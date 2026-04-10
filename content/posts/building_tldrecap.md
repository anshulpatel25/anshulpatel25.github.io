---
title: "Building TLDRecap Tech: AI-Powered Summaries of Tech Talks with Zero
Operational Cost"
date: 2026-04-10
tags:
  - ai
  - llm
  - n8n
  - hugo
  - automation
  - python
  - cloudflare
---

Every week, hundreds of remarkable technology talks land on YouTube. Keynotes,
talks, podcast episodes which is a firehose of knowledge that no one,
realistically, has time to fully consume. I felt this acutely. I'd save videos
to watch later, and "later" would never come.

The idea behind [**TLDRecap Tech**](https://tldrecap.tech) was simple: _what if
the best insight from any tech talk could reach you in two minutes instead of
two hours?_ So I built it. This post is about how.

<!--more-->

<!-- markdownlint-disable-file MD013 -->

## 🗺️ The Architecture at a Glance

Before diving into the details, here's the full pipeline end to end:

```goat
+---------------------+
|  YouTube Videos     |
|  (Conferences,      |
|   Podcasts, Talks)  |
+---------------------+
          |
          | Transcripts + Metadata
          v
+---------------------+
| Residential Proxy   |  <-- Android phone on 5G
| (Bot detection      |
|  avoidance)         |
+---------------------+
          |
          v
+---------------------+
|   n8n Workflow      |
|   Orchestration     |
+---------------------+
          |
    +-----+------+-------+-------+
    |            |       |       |
    v            v       v       v
 Infer       Summarize  Slug   Tags
 Speakers    (Gemini)   Gen    Gen
                |
         Round-robin load
         balance (free tier)
          |         |
       Gemini 2.5  Gemini 3.0, etc
          Flash     Flash
          |
          v
+---------------------+
|      NocoDB         |  <-- Data lake
+---------------------+
          |
          v
+---------------------+
|  Python + Jinja2    |  <-- Markdown generation
+---------------------+
          |
          v
+---------------------+
|  Hugo + Cloudflare  |  <-- Static site build
|  CI                 |
+---------------------+
          |
          v
+---------------------+
|  Cloudflare Pages   |  <-- Deployment
+---------------------+
```

Every piece of this pipeline was chosen deliberately. Let me walk through each
one.

---

## 🔍 The Problem: YouTube Hates Bots (Rightfully So)

The first challenge was fetching YouTube transcripts and video metadata
programically at volume. YouTube's bot detection is sophisticated and aggressive.
Residential IPs get flagged. Datacenter IPs get flagged faster. API quotas are
limited for the scale I wanted.

The solution came from an unconventional place: **my Android phone.**

I built a **custom residential proxy deployed on an Android smartphone leveraging
a 5G network connection.** Here's why this works well:

- **Residential IP**: Mobile carrier IPs are indistinguishable from regular
  consumer traffic
- **5G throughput**: Easily handles the bandwidth needs of metadata and transcript
  fetching
- **Always-on**: The phone sits plugged in (with charging managed by
  [Yukti](../opensourcing_yukti/), naturally 😄)
- **Rotating IPs**: 5G carriers naturally rotate IPs over time, adding another
  layer of resilience

All transcript and metadata fetches are routed through this proxy. YouTube
sees ordinary residential traffic. Problem solved no bans, no CAPTCHAs.

---

## ⚙️ The n8n Workflow: Orchestrating the Pipeline

The entire data processing pipeline runs inside [**n8n**](https://n8n.io/), a
self-hosted workflow automation platform. Think of it as the conductor of the
orchestra  it coordinates every step from raw video URL to a finished,
publication-ready markdown recap.

The workflow steps in order:

### 1. Fetch YouTube Transcripts and Metadata

The workflow starts with a video URL (or a batch of URLs from a curated list).
n8n issues HTTP requests through the residential proxy to pull:

- **Auto-generated or manual transcripts**  the raw spoken content
- **Video metadata**  title, channel, duration, thumbnail URL, publish date,
  view count, and description

Raw transcripts from YouTube are noisy. They lack punctuation, speaker labels,
and formatting. They go straight into the next stage for enrichment.

### 2. Infer Speakers

Conference talks often involve multiple speakers, panellists, or interviewers.
A flat transcript with no speaker attribution reads like a wall of text.

A Gemini model analyses the transcript and infers speaker turns based on
context clues in the text  phrasing shifts, topic hand-offs, self-introductions,
and moderator patterns. The result is a speaker-attributed transcript that makes
the final summary far more readable.

### 3. Summarize the Video

This is the centrepiece of the pipeline. The attributed transcript and video
metadata are passed to a Gemini model with a carefully engineered **deterministic
summarization prompt** that requests:

- A concise `TL;DR` (2-3 sentences)
- Key themes and takeaways structured by topic
- Actionable insights the reader can apply immediately
- Notable quotes, where relevant

The prompt is built around **determinism**  the same video should always produce
a structurally consistent recap, regardless of which model generation handles it.
This is critical when you're balancing load across multiple models (more on that
below). The output structure is locked; only model-generated content flows in.

### 4. URL Slug Generation

Every recap needs a clean, SEO-friendly URL slug. Rather than slugifying the
video title (which can be verbose, click-baity, or just strange), Gemini is
asked to generate a concise, descriptive, lowercase slug from the video title and
summary.

`"Understanding Distributed Tracing in 2025 | Platform Eng Summit"` becomes
`/distributed-tracing-platform-engineering-2025`  readable, keyword-rich, and
human-friendly.

### 5. Infer Tags

Tags drive discoverability on the site and power the search index. Gemini
analyses the summary and produces a set of normalized, lowercase tags covering
the core topics, technologies, and domains discussed in the talk.

A talk on eBPF-based network observability might get:
`ebpf`, `observability`, `networking`, `linux-kernel`, `cloud-native`  all
inferred automatically without any manual curation.

---

## 🤖 Gemini on the Free Tier: Round-Robin Load Balancing

Running generative AI at scale is expensive  unless you're clever about it.
Google's Gemini series offers generous free tier limits, but those limits are
**per model per minute**. The solution: spread the load.

I use a **round-robin load balancing strategy across multiple Gemini model
generations**. Each incoming video is assigned to the next model in the rotation:

| Round | Model                   |
| ----- | ------------------------|
| 1     | Gemini 2.5 Flash Lite   |
| 2     | Gemini 2.5 Flash        |
| 3     | Gemini 3.0 Flash Lite   |
| 4     | Gemini 3.1 Flash        |
| ...   | ...                     |

Because the summarization prompt is **deterministic**  a consistent output
schema regardless of model  the recap quality remains uniform across all model
generations.

This approach keeps **token utilization well within free tier limits** and costs
exactly zero rupees in AI API fees.

---

## 🗄️ NocoDB: The Data Lake

Every processed recap  summary, slug, tags, metadata, transcript  is written
to [**NocoDB**](https://nocodb.com/), an open-source Airtable alternative that
sits on top of a relational database.

NocoDB serves as the **data lake** for the entire platform:

- **Source of truth** for all recap content
- **Queryable** via a clean REST API that n8n uses for writing and reading
- **Visual interface** for browsing, filtering, and manually overriding any
  AI-generated content before publication
- **Audit trail**  every recap has its raw transcript, generated summary, and
  final published version stored side-by-side

The manual override capability is essential. AI summaries are good  but
occasionally a talk has highly specific domain context that the model
mischaracterises. NocoDB makes it trivial to spot and correct these before
they go live.

---

## 📝 Python + Jinja2: Rendering the Markdown

Python script queries the API and renders
the final Hugo-compatible markdown file using a **predefined Jinja2 template**.

The template is fixed. The AI-generated content flows into it. This separation
is deliberate  it means:

- **Layout changes** happen in the template, not in AI prompts
- **Consistent front matter**  title, date, tags, slug, and summary are always
  in the right positions
- **Hugo compatibility** is guaranteed since the template is designed specifically
  around Hugo's content model

A single script run pulls all pending recaps from NocoDB and emits a `.md` file
per recap into the Hugo `content/` directory. From there, Hugo takes over.

---

## 🚀 Deployment: Hugo + Cloudflare Pages

The frontend is a **static site built with [Hugo](https://gohugo.io/)**  fast,
minimal, and perfectly matched to a site that's fundamentally a collection of
markdown documents.

The deployment pipeline:

1. **Markdown files are committed** to the GitHub repository (either manually
   or via an automated commit from the Python rendering script)
2. The **static output is deployed to Cloudflare Pages**  global CDN edge
   delivery, free tier, automatic HTTPS, and zero server management

The entire infrastructure cost of serving tldrecap.tech globally is
**effectively zero**: free tier Gemini, free tier Cloudflare Pages, self-hosted
n8n and NocoDB, and a phone I already owned.

---

## 🧩 Putting It All Together: The Full Flow

```goat
+--------------------+
|     Video URL      |
+--------------------+
          |
          v
+------------------------------------+
| Residential Proxy (Android 5G)    |
+------------------------------------+
          |
          v
+--------------------------------------+
| n8n Workflow                         |
| +- Fetch transcript + metadata       |
| +- Infer speakers                    |
| +- Summarize (Gemini, round-robin)   |
| +- Generate slug                     |
| +- Generate tags                     |
+--------------------------------------+
          |
          v
+--------------------+
|      NocoDB        |
|   (Data Lake)      |
+--------------------+
          |
     Manual review
      (optional)
          |
          v
+--------------------------------------+
| Python + Jinja2 Template Rendering   |
+--------------------------------------+
          |
          v
+--------------------------------------+
| Commit .md to GitHub repo            |
+--------------------------------------+
          |
          v
+--------------------------------------+
| Cloudflare CI (hugo build)           |
+--------------------------------------+
          |
          v
+--------------------+
| Cloudflare Pages   |
+--------------------+
          |
          v
+--------------------+
| tldrecap.tech live |
+--------------------+
```

---

## 🏁 Closing Thoughts

TLDRecap Tech is a project built entirely at the intersection of constraints:
free-tier AI, residential proxies from repurposed hardware, self-hosted open
source tooling, and a static site that costs next to nothing to run globally.

The result is a pipeline that processes tech talks into polished recaps
automatically, consistently, and at zero marginal cost which means I can
keep the site growing without worrying about infrastructure bills scaling with
content volume.

If you've ever felt overwhelmed by the sheer volume of great tech content out
there, I hope TLDRecap Tech helps. And if you're building something similar,
I hope this breakdown saves you some of the trial and error I went through.

Check it out at [tldrecap.tech](https://tldrecap.tech) and if you have
[feedback](https://nocodb.anshulpatel.in/dashboard/#/nc/form/c5e728c1-7260-444a-a55b-509c0f5c9f32/survey), there's a form on the site. I read every submission.
