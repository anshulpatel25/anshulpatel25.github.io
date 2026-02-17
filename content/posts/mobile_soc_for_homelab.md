---
title: "Rethinking Lab Compute: Why Mobile SoCs Deserve a Second Look"
date: 2026-02-15
tags:
  - lab
  - arm
  - hardware
---

If you've been shopping for lab hardware lately, you've probably experienced
some serious sticker shock. 😱 The AI boom has fundamentally shifted
manufacturer priorities, and traditional computing hardware prices have
skyrocketed as a result. But what if I told you that the solution to affordable
lab computing might be sitting in your desk drawer or more specifically, in that
old flagship smartphone you replaced a couple of years ago? 📱✨

<!-- markdownlint-disable-file MD013 -->

## 🌍 The Shifting Landscape of Computing Hardware

The AI revolution has been incredible for advancing technology, but it's come
with an unexpected side effect: traditional compute hardware for hobbyists and
enthusiasts is getting squeezed out. Manufacturers are prioritizing high-margin
AI accelerators and data center GPUs, while the modest computing needs of
builders are increasingly an afterthought. The result? Higher prices and limited
availability for the very hardware that powers our learning labs and self-hosted
services.

But here's the thing: while we've been chasing traditional ARM SBCs (Single
Board Computers) like the Raspberry Pi, the mobile industry has been quietly
churning out incredibly efficient, powerful System-on-Chips (SoCs) for years.
And many of these devices are now readily available in the second-hand market at
compelling prices.

## 🔬 The Experiment: Snapdragon 835 vs. Raspberry Pi 5

To test this hypothesis, I decided to pit a mobile SoC against one of the most
popular boards: `the Raspberry Pi 5 Model B rev 1.0`. But instead of using the
latest and greatest mobile chip, I went with something you might find in a used
phone from `2016-2017` the `Qualcomm Snapdragon 835`.

Let's set the stage with the specs:

**Raspberry Pi 5 [(BCM2712)](https://en.wikipedia.org/wiki/Raspberry_Pi)**

- Release Year: `2023`
- Architecture: `Quad-core ARM 2.4 GHz Cortex-A76`

**Snapdragon
[835](https://www.qualcomm.com/content/dam/qcomm-martech/dm-assets/documents/snapdragon_product_brief_835_0.pdf)**

- Release Year: `2016`
- Architecture:
  `Octa-core Kryo 280 (4x2.45 GHz performance cores + 4x1.9 GHz efficiency cores)`

On paper, you'd expect the `Raspberry Pi 5` being seven years newer—to
completely dominate. After all, it's purpose-built for the maker community and
single-board computing. But the reality is far more interesting.

## 📊 The Benchmarking Results: Surprisingly Close

I ran `openssl speed` benchmarking on both platforms to get a real-world
performance comparison for cryptographic operations—something that's critical
for many lab workloads like web servers and application servers.

The results? 🎉

**The Snapdragon 835 lagged behind the Raspberry Pi 5 by only 13-15%**, for real
workloads which generally uses `8 Kilobytes (8192 bytes)` block size for data
processing.

## OpenSSL Speed Benchmark Results

### 🥧 Raspberry Pi 5 (BCM2712)

```sh
openssl speed -multi 8 sha256
#                #16 bytes     #64 bytes    #256 bytes   #1024 bytes  #8192 bytes  #16384 bytes
sha256          207364.00k   771244.97k  2233883.46k  4243494.35k  5793920.34k  5845172.22k
```

### 📱 Snapdragon 835

```sh
openssl speed -multi 8 sha256
#                #16 bytes     #64 bytes    #256 bytes   #1024 bytes  #8192 bytes  #16384 bytes
sha256           96938.25k   364744.94k  1209499.86k  2967597.06k  5170452.89k  5445429.93k
```

Let that sink in for a moment. A mobile SoC from `2016`, came within striking
distance of a `2023` single-board computer. And remember, the `Snapdragon 835`
was optimized for battery life and thermal constraints of a smartphone, not
sustained compute workloads.

## 💡 Why This Matters for Your Lab

### 1. 💰 **Cost Efficiency is King**

Used smartphones with `Snapdragon 835` (and similar generation chips) are
abundant in the second-hand market. You can often find them for a fraction of
what you'd pay for a new `Raspberry Pi 5` and they come with built-in batteries
(UPS, anyone? 🔌), storage, display, and networking already integrated.

### 2. ⚡ **Performance Per Dollar**

When you're only giving up **13-15%** performance for potentially **50-70%**
cost savings, the math starts to look really compelling. For many lab workloads
such as DNS servers, lightweight web applications, monitoring tools, this
performance difference is negligible.

### 3. 🔋 **Power Efficiency**

Mobile SoCs are designed from the ground up to be power-sipping beasts. The
`Snapdragon 835`'s 10nm process was cutting-edge for its time, delivering
excellent performance per watt. In a homelab running 24/7, those electricity
savings add up quickly.

### 4. 🌡️ **Thermal Characteristics**

These chips are designed to run in passively cooled environments (your pocket).
This makes them ideal for compact, quiet lab deployments where active cooling is
undesirable.

## 🌐 The Broader Implications

This isn't just about `Snapdragon 835` vs. `Raspberry Pi 5`. It's about
recognizing that we have an entire ecosystem of powerful, efficient, and
affordable computing hardware that's been hiding in plain sight. As flagship
smartphones are upgraded every 1-2 years, millions of perfectly capable
computing devices are relegated to drawers or recycling centers.

## 🏗️ Real-World Usage: CNCF Components on Mobile SoCs

Theory is great, but what about practical applications? I've been successfully
running popular
**[CNCF (Cloud Native Computing Foundation)](https://www.cncf.io/)** components
on the `Snapdragon 835` SoC, including:

- **Prometheus** - The industry-standard monitoring and alerting toolkit
- **Node Exporter** - Hardware and OS metrics exporter for Prometheus

These aren't lightweight toy applications—they're battle-tested cloud-native
tools used by organizations worldwide. Running them on a 2016-era mobile chip
demonstrates that these devices are more than capable of handling serious lab
workloads.

The setup has been stable, performant, and power-efficient. Prometheus scrapes
metrics, stores time-series data, and serves queries without breaking a sweat.
Node Exporter reliably collects and exposes system metrics. All of this on a
chip originally designed to power a smartphone.

**Want to see it in action?**

[Dashboard Snapshot](https://grafana.anshulpatel.in/dashboard/snapshot/DQqsxIzREd86XAesVNxEvitPDy9uX1Ln)
of node exporter running on `Snapdragon 835`. (Depending on your network, it
might take a few seconds to load the dashboard). I will be sharing more details
about the setup and configuration in an upcoming post, so stay tuned!

This real-world deployment proves that mobile SoCs aren't just a theoretical
alternative but they're a practical, viable option for modern lab infrastructure
running cloud-native workloads.

## ⚠️ The Challenges (Because Nothing's Perfect)

Let's be honest: using mobile hardware for computing isn't without challenges:

- **Software Ecosystem**: While there are solutions like
  [termux](https://termux.dev/en/) which allow you to install various Linux
  packages on Android, the packaging and support for certain applications may
  not be as robust as on traditional ARM SBCs.
- **Vendor restrictions**: Most vendors have recently cracked down on unlocking
  bootloaders (for e.g. you can only unlock bootloader on a single device in a
  calendar year), which can restrict ability to install certain softwares.
- **Documentation**: Not as friendly as Raspberry Pi.
- **GPIO and expansion**: Limited (Serial communication via USB port) or None
  compared to traditional SBCs.

## 🎯 The Bottom Line

As computing costs continue to climb due to AI-driven market dynamics, we need
to get creative about our lab infrastructure. Mobile SoCs represent an untapped
reservoir of affordable, efficient computing power that deserves serious
consideration.

The next time you're about to drop **$80-100** on a `Raspberry Pi 5`, consider
this: that old flagship phone might just be your next lab server. 🚀 It's not a
bad idea—it might actually be brilliant. 💪
