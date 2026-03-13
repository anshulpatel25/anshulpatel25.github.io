---
title: "Opensourcing termux-api-exporter: Monitoring Your Mobile Lab the Prometheus Way"
date: 2026-03-13
tags:
  - observability
  - prometheus
  - lab
  - arm
  - hardware
  - golang
  - opensource
---

In my [previous post](../mobile_soc_for_homelab/), I made the case that old
flagship smartphones are fantastic lab hardware. A `Snapdragon 835` from `2016`
delivering **85-87%** of a `Raspberry Pi 5`'s performance at a fraction of the
cost? That's not just compelling, it's a game-changer for budget conscious lab
builders. 📱💪

But here's the thing, once you've got your mobile SoC running services 24/7, you
need to **monitor** it. You want to know if your battery is healthy, if your
WiFi connection is stable, and whether your device is thermally comfortable
under load. And if you're already running Prometheus (which you should be!), you
need metrics in a format it understands.

That's why I built
[**termux-api-exporter**](https://github.com/anshulpatel25/termux-api-exporter)
a Prometheus exporter that bridges Android device metrics and your observability
stack. 🚀

<!-- markdownlint-disable-file MD013 -->

## 🤔 First Things First: What is Termux?

Before diving into the exporter, let's establish the foundation.
[**Termux**](https://wiki.termux.com/wiki/Main_Page) is a powerful terminal
emulator and Linux environment for Android. Think of it as bringing the full
power of a Linux command line to your smartphone, no root required (for most
features).

What makes Termux special:

- **Full-featured package ecosystem** - Access to thousands of packages through
  `pkg` (apt-based)
- **Real Linux environment** - Not a chroot or VM, but a real userspace with
  bash, Python, Go, Node.js, and more
- **Scriptable and automatable** - Perfect for running servers, cron jobs, and
  automation
- **Active development** - Regular updates and strong community support

In short, Termux transforms your Android device from a consumption device into a
legitimate computing platform. It's what makes running Prometheus, Grafana, and
other cloud-native tools on mobile hardware actually practical. ✨

## 📱 What is Termux:API?

[**Termux:API**](https://wiki.termux.com/wiki/Termux:API) is Termux's bridge to
Android system APIs. It's a companion app that exposes Android functionality
through command-line tools, letting you interact with device hardware and
services programmatically.

With Termux:API, you can:

- **📊 Query battery status** - capacity, temperature, health, charging state
- **📶 Access WiFi information** - connection status, signal strength, network
  details
- **📞 Send SMS/calls** - automate notifications and alerts
- **📍 Get GPS location** - for location-aware scripts
- **🔔 Show notifications** - alert yourself about system events
- **📸 Control camera** - capture images from scripts
- ...and much more

The beauty of Termux:API is its simplicity. Need battery info? Just run:

```bash
termux-battery-status
```

You get clean JSON output:

```json
{
  "health": "GOOD",
  "percentage": 65,
  "plugged": "UNPLUGGED",
  "status": "DISCHARGING",
  "temperature": 28.4,
  "current": -450000
}
```

This is perfect for monitoring, but there's a gap, **these APIs aren't directly
compatible with Prometheus.** That's where `termux-api-exporter` comes in.

## 🎯 Why Build an Exporter?

When I started using a `Snapdragon 835` device as a lab node running Prometheus
and other services (as documented in my
[Mobile SoC deployment guide](../deploy_obs_on_mobile_soc/)), I quickly realized
I had a **blind spot**: I couldn't see critical Android specific metrics in my
dashboards.

Questions I couldn't answer:

- ❓ Is my battery degrading from being a 24/7 server?
- ❓ What's the actual WiFi signal quality over time?
- ❓ Is the battery temperature spiking under load?

Sure, I could SSH in and run `termux-battery-status` manually. But that's not
monitoring, that's spot-checking. I needed **continuous, time-series metrics**
integrated into my existing Prometheus/Grafana observability stack.

The solution? Build a proper **Prometheus exporter** that translates Termux:API
data into metrics that Prometheus can scrape, store, and alert on. 📈

## 🛠️ Introducing termux-api-exporter

[**termux-api-exporter**](https://github.com/anshulpatel25/termux-api-exporter)
is a lightweight Prometheus exporter written in Go that exposes Android device
metrics through Termux:API. It runs as a simple HTTP server on your Android
device, making metrics available at the standard `/metrics` endpoint.

### 🔋 Battery Metrics

The exporter provides comprehensive battery monitoring:

| Metric                               | Description                         | Example Value |
| ------------------------------------ | ----------------------------------- | ------------- |
| `termux_battery_temperature_celsius` | Battery temperature in Celsius (°C) | `28.4`        |
| `termux_battery_percentage`          | Battery charge percentage (%)       | `69`          |

These metrics let you track battery health trends over time, set alerts for
temperature spikes, and monitor charging patterns, critical data when using a
mobile device as always-on infrastructure.

### 📶 WiFi Metrics

The exporter also surfaces WiFi connection information:

| Metric                        | Description           | Example Value |
| ----------------------------- | --------------------- | ------------- |
| `termux_wifi_rssi_dbm`        | Signal strength (dBm) | `-45`         |
| `termux_wifi_link_speed_mbps` | Link speed (Mbps)     | `144`         |

With these metrics, you can:

- ✅ Track WiFi stability and detect connection drops
- ✅ Monitor signal strength degradation (maybe it's time to relocate your device?)
- ✅ Observe link speed variations
- ✅ Set alerts for connection loss

## 📊 What It Looks Like in Action

Once scraped by Prometheus, you can build dashboards in Grafana that show:

- **Battery percentage over time** - visualize drain rates and charging cycles
- **Battery temperature trends** - ensure your device isn't overheating
- **WiFi signal strength history** - identify network stability issues

This is particularly valuable if you're running services like in my
[observability deployment](../deploy_obs_on_mobile_soc/) because you can
correlate device health with workload changes.📉📈

## 🏗️ How It Works

Under the hood, the exporter is beautifully simple:

1. **HTTP server** exposes `/metrics` endpoint (default port: `9550`)
2. **On each scrape**, it calls `termux-battery-status` and `termux-wifi-connectioninfo`
3. **Parses JSON output** from Termux:API commands
4. **Converts to Prometheus metrics** with appropriate types (gauges) and labels
5. **Returns metrics** in Prometheus text exposition format

The exporter is stateless and lightweight, it only runs commands when Prometheus
scrapes it, so it doesn't consume resources continuously polling APIs.

## 🚀 Getting Started

Installation is straightforward:

```bash

# Update package repositories
pkg update && pkg upgrade -y

# Install sudo package
pkg install sudo

# Install termux-api package
pkg install termux-api

# Install termux-services package
pkg install termux-services

# Restart Termux after installing termux-services
exit
# Then reopen Termux

pkg install wget
# Update release version as per your requirement
wget https://github.com/anshulpatel25/termux-api-exporter/releases/download/v0.1.0/termux-api-exporter-arm64-linux.tar.gz

# Make it executable
chmod +x termux-api-exporter

# Run it
sudo ./termux-api-exporter
```

The exporter starts listening on `http://localhost:9797/metrics` by default. Add
it as a scrape target in your Prometheus config:

```yaml
scrape_configs:
  - job_name: "android-device"
    static_configs:
      - targets: ["your-device-ip:9797"]
```

And just like that, you're monitoring your mobile lab! 🎉

## 💡 Why This Matters

Using mobile SoCs for homelab infrastructure is still niche, but it's growing.
As traditional SBC prices climb and used smartphones become more capable (and
cheaper), more people are exploring this path. But to run mobile hardware
**sustainably** and **reliably** in production, you need visibility.

`termux-api-exporter` fills that gap. It's purpose-built for the emerging mobile
lab ecosystem, bringing first-class observability to a platform that desperately
needs it.

Whether you're monitoring a single device or building a fleet of smartphone
servers (yes, people do this!), having battery health, thermal data, and network
connectivity in your observability stack isn't optional, it's essential. 🔥

Happy monitoring! 📊✨
