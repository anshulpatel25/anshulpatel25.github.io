---
title: "From Prompts to Prints: Creating Parametric 3D Models with LLMs! 🚗✨"
date: 2026-06-06
tags:
  - ai
  - llm
  - 3d-printing
  - cad
  - build123d
  - python
  - opensource
---

I've been using Large Language Models (LLMs) for a while now. Whether it's
writing complex Go services, drafting documentation, summarizing long reports,
or even designing AI agent sandboxes, LLMs have become my go-to co-pilot. But
recently, I decided to push the boundaries a bit further.

What if I could use an LLM not just to write code that runs on a CPU, but to
**generate physical objects**?

As an automobile enthusiast and an avid collector of 1:64 scale diecast cars
(yes, my desk is covered in Hot Wheels and Tomica!), I had the perfect
challenge: designing a **Modular Diecast Display Case**. And I wanted to do it
entirely through a parametric, code-first CAD approach powered by AI. 🛠️

<!--more-->

<!-- markdownlint-disable-file MD013 -->

## 🎨 The Vision: A Perfect Home for 1:64 Cars

If you're into diecast collecting, you know the struggle. You want to display
your favorite cars, but standard cases are either too bulky, too expensive, or
don't stack well. I wanted something specific:

- **Modular & Stackable**: So the collection can grow.
- **Minimalist**: To keep the focus on the car.
- **3D Printer Friendly**: Optimized for zero-support FDM printing.
- **Parametric**: So I can tweak dimensions easily if I ever switch to 1:43
  scale!

## ⚙️ The Technical Stack: Code-First CAD

Instead of traditional "point-and-click" CAD software, I used
[**build123d**](https://github.com/gumyr/build123d), a Python-based parametric
geometry library. Why? Because LLMs are _incredible_ at writing Python.

To make the workflow even smoother, I utilized a specialized "text-to-cad"
agentic skill. This allowed me to describe the geometry in natural language,
have the agent generate the `build123d` Python code, and then iterate on the
design programmatically.

## 📐 Designing the Geometry

{{< stl src="/models/diecast_display_case.stl" height="600px" model-color="#f5cb42" >}}

The result of this AI-assisted collaboration is the
[**diecast-modular-display**](https://github.com/anshulpatel25/diecast-modular-display).
Here's how the technical details broke down:

### 1. The Core Shell

The case is a hollow box shell with dimensions of **84mm (W) × 36mm (D) × 39mm
(H)**. I went with a **2mm wall thickness** to ensure it's sturdy enough for
stacking while remaining lightweight. The front face is completely open,
providing a perfect side-profile view of the car.

### 2. Built-in Car Stabilization

Nothing is more annoying than a car rolling around inside its display. I added a
**1.5mm deep sunken wheel tray** (72mm × 26mm) on the inner floor. It’s a small
detail that makes a huge difference!

### 3. Support-Free Optimization

To make printing a breeze, the model is designed to be printed **lying flat on
its back wall**. I added stylized **diamond cutouts** on the back and sides. By
using 45-degree angles for these cutouts, the printer can bridge the gaps
without needing any messy support structures. Clean prints, every time! ✨

### 4. The Stacking Mechanism

To make it truly modular, I implemented a pin-and-pocket system:

- **Top**: Two Ø5.0mm × 2.0mm locking pins.
- **Bottom**: Two Ø5.4mm × 2.2mm receiving pockets.

That 0.4mm diameter tolerance (0.2mm per side) is the "magic number" for most
FDM printers to get a snug, satisfying snap-fit.

## 🤖 The Agentic Workflow

What made this project special wasn't just the final STL file, but the process.
Using the [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad) skill, I could verify the geometry
autonomously. My "Agent" could:

1. **Generate** the `build123d` Python script.
2. **Compile** it into STEP and STL formats.
3. **Inspect** the topology to ensure the faces and planes were correct.
4. **Snapshot** the model from an isometric view to show me the progress.

It felt less like "drawing" and more like "directing" a master craftsman.

## Final Result: A Sleek, Functional Display Case

![Diecast Modular Display](/images/diecast_modular_display.jpg)

## 🚀 Get the Files!

The entire project is Open Source. Whether you want to print some cases for your
own collection or dive into the Python code to see how the parametric geometry
is built, you can find everything below:

👉
GitHub: [**anshulpatel25/diecast-modular-display**](https://github.com/anshulpatel25/diecast-modular-display)

👉 3D Files: [**Diecast Display**](https://than.gs/m/1560820)


## 🏁 Final Thoughts

Moving from "Text to Code" to "Text to CAD" feels like a natural evolution. LLMs
aren't just for chatbots; they are becoming powerful engines for spatial
reasoning and engineering. Designing this display case showed me that with the
right tools and a bit of enthusiastic prompting, we can bring our digital ideas
into the physical world faster than ever.

Now, if you'll excuse me, I have a few more cars that need a new home. Happy
printing! 🏎️💨
