---
title: "Denial of Service(DoS): Attacks and Mitigation"
date: 2016-11-24T00:00:00+05:30
tags:
  - "sitereliability"
  - "security"
---


[2016 saw 71%](http://www.akamai.com/us/en/multimedia/documents/state-of-the-internet/q3-2016-state-of-the-internet-security-report-infographic.pdf)
rise in Denial of Service attacks with biggest attack of 623 Gbps and mega
attacks averaging around 100 Gbps.

If unprepared, Denial of Service can result in
[Financial losses, Reputational Damage, Customer Attrition and Legal Pursuits](http://blog.radware.com/security/2013/05/how-much-can-a-ddos-attack-cost-your-business/).

<!--more-->

## Common Denial of Service Attacks

### HTTP Flood Attacks

- **Volumetric Attack:** Simultaneously many machines launch HTTP requests
  towards a target, saturating it's resources or saturating bandwidth.
- **Malicious Application Requests:** Simultaneous GET/POST/PUT requests to
  target, which causes high CPU utilization.
  For Eg: Password Reset request, Long running requests like report execution,
  downloading large files, requests calling slow hash function

### SYN Attacks

- Simultaneous TCP requests are sent to target, but doesn't complete
  3-way handshake. For Eg: Initiating request via Spoofed IP.

### UDP and ICMP Attacks

- Simultaneously flood random ports on target using UDP protocol.
  Spoofing is much easier as there is no 3-way handshake in UDP.

### ICMP Attacks

- Simultaneously launching ICMP echo requests to the target with spoofed IP.
- Simultaneously sending large packets to the target causing buffer-overflow.

### DNS Attack Reflection and Amplification

- DNS reflection is achieved by eliciting a response from a DNS resolvers to a
  spoofed IP.
  Simultaneously sending out DNS query with a spoofed IP to a DNS resolver
  can overwhelm it.

## Basic Mitigations

- Establish Traffic reputation
- Filter Ingress traffic
- Disable unused ports and block unnecssary protocols
- Blackholing suspected or malicious traffic
- Implement Web Application Firewall (WAF)
- Use third-party services like CloudFlare, Akamai, Incapsula.

![ddos](/images/ddos.png)
