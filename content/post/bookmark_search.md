+++
author = "Anshul Patel"
date = 2020-04-29
showthedate = true
title = "Bookmark Search Engine"
tags = [
    "programming",
    "python",
    "elasticsearch",
    "sqlite",
    "kibana"
    ]
+++


<!--more-->

# Problem

As Software Engineers, we frequently bookmark links for great content either for reading it later or solving our problems.

Search Engines that we use, frequently updates their search index, hence the search list will be different after a particular interval of time.

Bookmark modules in the popular modern browsers doesn't provide full-text search for the content, so how to search through the content that is already curated by us for later reference?

There are indeed off the shelf solutions which provides the full-text search for your saved/bookmarked links but they are paid. Services which offer it for free gather metadata about reading habbits, which is bit concerning.

# Solution

## Approach

Develop a solution which can provide full text search across your bookmarked links and can be hosted by oneself.

## Philosophy

* Use external tools as much as you can.
* Use external software libraries as much as you can.
* The target audience is Software Engineers, hence setup and UX doesn't need to be simplified.


## Tools

* **Python:** It is used to parse, scrape the bookmark links.
* **Elasticsearch:** It is used to store the parsed content and as search engine.
* **Kibana:** It is used as UI to search through the stored content.
* **SQlite3:** It is used to stored the metadata of parsed bookmark links. Redis is a smarter choice and can provide **O(1)** for metadata lookup against Sqlite3's **O(n)**, but still Sqlite3 was chosen as process of storing/fetching metadata is infrequent and Sqlite3 is not required to be in a running state as opposed to Redis, which does save CPU time and Memory.


## Data Flow


![bookmark_search_flow](/img/bookmark-search-flow.png)


## Searching

* Open the Kibana Dashboard and switch the Query type from **KQL** to **Lucene** and search from your curated bookmark content.

![search_kibana](/img/search_kibana.png)


## Setup Instructions and Source Code

* https://github.com/anshulpatel25/bookmark-search
