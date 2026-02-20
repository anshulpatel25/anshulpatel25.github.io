---
title: "Opensourcing Yukti: A Battery Charging Manager for Your Mobile Lab"
date: 2026-02-20
tags:
  - lab
  - arm
  - hardware
  - golang
  - opensource
---

In my [previous post](../mobile_soc_for_homelab/), I made the
case that old flagship smartphones are seriously underrated as lab nodes.
A `Snapdragon 835` from `2016` trailing a `Raspberry Pi 5` by only **13-15%**
on cryptographic benchmarks, at a fraction of the cost? That's a compelling
argument for raiding the drawer where old phones go to retire. 📱

The case for mobile hardware has only gotten stronger since then. The **AI
boom** has quietly reshaped memory manufacturing priorities: chip makers have
pivoted capacity toward **High Bandwidth Memory (HBM)** to feed the insatiable
appetite of GPU clusters and conventional DRAM and LPDDR supply has paid the
price. Single Board Computers like the `Raspberry Pi` and its alternatives have
seen noticeable **price increases** as a knock-on effect, making the
economics of purpose-built hobby hardware shakier than they used to be. An
old flagship sitting in a drawer starts looking less like a compromise and more
like the smart play.

But there's a catch nobody talks about, what happens to the battery when you
leave a phone plugged in permanently as a server?

<!-- markdownlint-disable-file MD013 -->

## 🔋 The Hidden Cost of "Always Plugged In"

Lithium-ion batteries are genuinely remarkable pieces of chemistry, but they
have a well-known Achilles' heel, **staying at 100% charge for extended
periods degrades them fast.** Keep a phone constantly topped up and you'll
watch its battery capacity shrink visibly over months.

This is normally fine for a phone you pocket every day it charges overnight and
you use it. But a lab node running Prometheus, Node Exporter, or any other
24/7 service? That phone lives on the charger indefinitely. Without
intervention, you're accelerating battery wear every single day.

The built-in battery is one of the best features of using mobile hardware for a
lab (free UPS!), but only if you protect it. So I built **Yukti** to do
exactly that.

## 🌱 Introducing Yukti

[**Yukti**](https://github.com/anshulpatel25/yukti) is a small, clean Go
application that manages battery charging automatically on rooted Android
devices. The name **_yukti_** (युक्ति) means _clever strategy_ in Sanskrit - and
that's exactly what it is a clever strategy to make your mobile lab
sustainable for the long run.

It runs quietly in the background as a Termux service, monitoring battery
capacity every 60 seconds and toggling charging on or off based on configurable
thresholds. No UI, no bloat just a focused daemon doing one thing well.

## 🧠 The Core Idea: Hysteresis Charging

The magic behind Yukti is a concept called **hysteresis**. Rather than
switching charging on and off at a single threshold (which would cause
constant, rapid toggling), Yukti uses _two_ thresholds with a buffer zone
between them:

| Battery Level | Action                     |
| ------------- | -------------------------- |
| ≤ 40%         | **Enable charging**        |
| 41% – 69%     | **Maintain current state** |
| ≥ 70%         | **Disable charging**       |

Think of it like a thermostat, your home's heating doesn't kick in the moment
the temperature drops by one degree it has a range it's comfortable with. Yukti
applies exactly the same thinking to your battery.

Here's what an actual charging cycle looks like:

```md
Battery drains → hits 40% → charging enabled ⚡
Battery charges → hits 70% → charging disabled 🔌
Battery drains → hits 40% → charging enabled ⚡
... and so on
```

The result is that your battery lives comfortably between 40% and 70%, which
is the **sweet spot for lithium-ion longevity**. You get the UPS benefit of a
charged battery, without the degradation from perpetually sitting at 100%.

The hysteresis zone (41–69%) is equally important, it prevents the charging
circuit from rapidly toggling on and off when the battery hovers near a single
boundary, reducing wear on both the battery and the charging hardware.

## 📸 Seeing It In Action

Here's a snapshot of the periodic automatic recharging cycle and the
corresponding thermal behavior on the `Snapdragon 835`:

![Yukti thermals](/images/yukti_thermals.png)

The pattern is exactly what you want, short, bounded charging bursts followed
by discharge phases, with thermals staying well within safe operating ranges
because charging events are infrequent and controlled.

I have been running Yukti on a `Snapdragon 835` lab node which currently
hosts my home's [observability stack](../deploy_obs_on_mobile_soc/).

## 🏗️ Architecture: Clean Go, No Surprises

Yukti is written in idiomatic Go and follows clean architecture principles.

The charging control works by writing to
`/sys/class/power_supply/battery/charging_enabled` a kernel-exposed sysfs
path available on most Android devices. This is why **root access is
required**, writing to sysfs nodes under `/sys/class/power_supply/` is
restricted to `root` on Android. Yukti needs to be granted superuser
permissions (via Magisk or similar) to function.

The clean separation between domain logic and the filesystem implementation
also means the hysteresis rules are fully unit-tested independent of any
hardware you can verify the logic without needing a physical device.

## 🚀 Getting Started

Yukti is built for **rooted Android devices** running Termux. The recommended
deployment is as a persistent Termux service that starts automatically on boot.

Full installation and deployment instructions including cross-compiling the
ARM64 binary, setting up the Termux service, and enabling it at startup are
covered in the
[official README on GitHub](https://github.com/anshulpatel25/yukti).

## 💭 Why This Matters Beyond Battery Health

When I argued for mobile SoCs as lab nodes, one of the headline benefits
was the built-in battery acting as a free UPS. But a degraded battery is
worse than no battery at all it can fail unpredictably and give you false
confidence about your uptime story.

Yukti closes that loop. With it running, the battery actually _stays healthy_
as an emergency power buffer, thermals stay predictable because charging bursts
are brief and spaced out, and your phone can realistically serve as a reliable
lab node for years rather than months.

A **2016-era flagship** running modern cloud-native workloads, with a healthy
battery, on a few watts of power that's an outcome worth getting excited about.
🎉

## 🤝 Open Source & Contributions

Yukti is open source under the MIT License included in the repository.
Contributions are very much welcome whether that's supporting additional
battery sysfs layouts, adding configurability for the charge thresholds, or
improving the Termux service setup experience.

If you're running mobile hardware in your lab, give Yukti a try and let me
know how it goes.

Happy building! 🚀
