---
title: "Deploying Observability Stack on Mobile SoC: A Practical Guide"
date: 2026-02-17
tags:
  - observability
  - lab
  - arm
  - hardware
---

In my [previous post](../mobile_soc_for_homelab/), I explored why mobile SoCs
make compelling lab hardware and demonstrated that a Snapdragon 835 can hold its
own against modern single-board computers. I even showed a live dashboard
running Prometheus and Node Exporter on this setup. Now, let's get practical,
I'll show you exactly how to deploy a complete observability stack on your
mobile SoC. 📊🚀

<!-- markdownlint-disable-file MD013 -->

## 🎯 What We're Building

By the end of this guide, you'll have a fully functional monitoring setup
running on your Android device:

- **Grafana** - For beautiful dashboards and visualization
- **Prometheus** - For metrics collection and time-series storage
- **Node Exporter** - For system metrics (CPU, memory, disk, network)

This setup is perfect for monitoring your homelab, learning about observability,
or just proving that your old smartphone is more powerful than you thought! 💪

## 📋 Prerequisites

Before we dive in, make sure you have:

### 1. **Termux Installed**

[Termux](https://termux.dev/en/) is a powerful terminal emulator and Linux
environment for Android. It's the foundation of our entire setup.

- Install from [F-Droid](https://f-droid.org/en/packages/com.termux/)
  (recommended) or
  [GitHub releases](https://github.com/termux/termux-app/releases)
- ⚠️ **Important**: Do NOT install from Google Play Store.

### 2. **Root Access (for Node Exporter)**

Node Exporter requires
[root privileges](<https://en.wikipedia.org/wiki/Rooting_(Android)>) to access
certain system metrics. You'll need:

- A rooted Android device
- [Termux:Boot](https://github.com/termux/termux-boot) (optional, for auto-start
  on boot)

### 3. **Storage and Network**

- At least 500MB free storage
- Stable Wifi network connection

### 4. **Basic Terminal Skills**

Familiarity with basic Linux commands will help, but I'll walk you through each
step. 🎓

### 5. **Install Termux Services**

We'll use `termux-services` to manage our observability stack cleanly with `sv`
commands instead of using `nohup`. This provides proper service management
similar to systemd on traditional Linux systems.

Install termux-services:

```sh
pkg install termux-services -y
```

## 🚀 Part 1: Installing Grafana

Grafana is the easiest component to install, thanks to Termux's excellent
package repository.

### Step 1: Update Package Lists

First, ensure your Termux packages are up to date:

```sh
pkg update && pkg upgrade -y
```

### Step 2: Install Grafana

Install Grafana directly from the Termux repository:

```sh
pkg install grafana -y
```

That's it! The package manager handles all dependencies automatically. ✨

### Step 3: Set Up Grafana as a Service

Instead of using `nohup`, let's properly manage Grafana as a service using `sv`.

Create a service directory for Grafana:

```sh
mkdir -p $PREFIX/var/service/grafana
```

Create the run script:

```sh
cat > $PREFIX/var/service/grafana/run << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh
exec grafana server --homepath $PREFIX/share/grafana/ 2>&1
EOF
```

Make the scripts executable:

```sh
chmod +x $PREFIX/var/service/grafana/run
```

Enable and start the Grafana service:

```sh
sv-enable grafana
sv up grafana
```

💡 **Pro Tip**: You can check if Grafana is running with:

```sh
sv status grafana
```

By default, Grafana runs on port `3000`. You can access it by opening a browser
and navigating to:

```sh
http://<mobile-phone-ip>:3000
```

Default credentials:

- **Username**: `admin`
- **Password**: `admin` (you'll be prompted to change this on first login)

## 📦 Part 2: Installing Prometheus

Prometheus isn't available in the Termux repository, so we'll install it from
the official GitHub releases.

### Step 1: Install Required Dependencies

```sh
pkg install wget tar -y
```

### Step 2: Download Prometheus

Visit the
[Prometheus releases page](https://github.com/prometheus/prometheus/releases) to
find the latest ARM64 version. At the time of writing, the latest version is
`3.x.x`.

For ARM64 (which is what Snapdragon 835 uses):

```sh
cd $HOME
wget https://github.com/prometheus/prometheus/releases/download/v3.5.1/prometheus-3.5.1.linux-arm64.tar.gz
```

⚠️ **Note**: Replace `3.5.1` with the latest version number from the releases
page.

### Step 3: Extract the Tarball

```sh
tar -xzf prometheus-3.5.1.linux-arm64.tar.gz
mv prometheus-3.5.1.linux-arm64 prometheus
```

### Step 4: Set Up Prometheus as a Service

Create a service directory for Prometheus:

```sh
mkdir -p $PREFIX/var/service/prometheus
```

Create the run script:

```sh
cat > $PREFIX/var/service/prometheus/run << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh

exec $HOME/prometheus/prometheus --config.file=$HOME/prometheus/prometheus.yml --storage.tsdb.path $HOME/prometheus/ --storage.tsdb.retention.time 14d 2>&1
EOF
```

Make the scripts executable:

```sh
chmod +x $PREFIX/var/service/prometheus/run
```

Enable and start the Prometheus service:

```sh
sv-enable prometheus
sv up prometheus
```

Verify it's running:

```sh
sv status prometheus
```

## 🔍 Part 3: Installing Node Exporter (Root Required)

Node Exporter exposes hardware and OS metrics that Prometheus can scrape. This
requires root access to read certain system files.

### Step 1: Install Sudo (Root Shell)

Install `sudo` for a proper root environment in Termux:

```sh
pkg install sudo -y
```

### Step 2: Download Node Exporter

```sh
cd $HOME
wget https://github.com/prometheus/node_exporter/releases/download/v1.10.2/node_exporter-1.10.2.linux-arm64.tar.gz
```

⚠️ **Note**: Replace `1.10.2` with the latest version from the
[Node Exporter releases page](https://github.com/prometheus/node_exporter/releases).

### Step 3: Extract and Prepare

```sh
tar -xzf node_exporter-1.7.0.linux-arm64.tar.gz
mv node_exporter-1.10.2.linux-arm64 node_exporter
```

### Step 4: Set Up Node Exporter as a Service

Create a service directory for Node Exporter:

```sh
mkdir -p $PREFIX/var/service/node_exporter
```

Create the run script (with root privileges):

```sh
cat > $PREFIX/var/service/node_exporter/run << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh

exec sudo $HOME/node_exporter/node_exporter 2>&1
EOF
```

Make the scripts executable:

```sh
chmod +x $PREFIX/var/service/node_exporter/run
```

Enable and start the Node Exporter service:

```sh
sv-enable node-exporter
sv up node-exporter
```

Verify it's running:

```sh
sv status node-exporter
```

## Auto-Start on Boot

Services managed by `sv-enable` will automatically start when Termux starts. If
you want them to start when your device boots, install and configure
Termux:Boot:

```sh
# Create a boot script
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/start << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh
termux-wake-lock
. $PREFIX/etc/profile
EOF

chmod +x ~/.termux/boot/start
```

The wake lock ensures your services keep running even when the device is in
standby mode.

Running a complete monitoring stack on a mobile SoC might seem unconventional,
but it's surprisingly practical. The Snapdragon 835 handles this workload
without breaking a sweat, proving once again that these devices are capable of
much more than we give them credit for.

Whether you're using this for learning, as a lightweight monitoring solution, or
just to breathe new life into old hardware, I hope this guide helps you get
started. Happy monitoring! 📊✨

Here is the
[snapshot preview](https://grafana.anshulpatel.in/dashboard/snapshot/kwh62EsmD6LYvtw3sYrbp6dzpo8zSLLU)
of my Snapdragon 835 running the observability stack, showcasing real-time
metrics and system performance.
