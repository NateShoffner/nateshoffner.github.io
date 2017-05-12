---
layout: post
title: Disable Nvidia Telemetry
date: 2017-05-12 15:13 -05:00
description: 
type: post
image: /assets/images/posts/NvidiaTelemetry2.png
categories:
- Projects
tags:
- Nvidia
- Telemetry
---

Back in early November, Nvidia started bundling telemetry services with their drivers. Gamers Nexus did an [analysis](http://www.gamersnexus.net/industry/2672-geforce-experience-data-transfer-analysis) where they inspected data transactions via Wireshark. Their focus seemed to be moreso on dispelling the rumors of personally identifiable information being sent **unencrypted**, as they didn't decrypt any of the encrypted traffic. Their results yielded from an hour of testing that nothing was being sent, the services were seemingly dormant.

For me, however, it's a moot point. Nvidia should've been upfront about the telemetry with their users and I'm not really a fan of unnecessary services running on my computer, so naturally I disabled the services from their inception. I soon found out that they were being reactivated upon updates, which resulted in me throwing together a small utility to handle the disabling work for me.

I've shared it with a few people and figured I might as well throw it online.

Note: I use a small subset of GeForce Experience's features, including ShadowPlay and have experienced no problems. I can't speak for every use case and how disabling these services might be impactful in the future, so use it at your own risk.

You can download the utility [here](https://github.com/NateShoffner/Disable-Nvidia-Telemetry/releases) as well as find the source code on [GitHub](https://github.com/NateShoffner/Disable-Nvidia-Telemetry).

![{{ site.baseurl }}/assets/images/posts/NvidiaTelemetry1.png]({{ site.baseurl }}/assets/images/posts/NvidiaTelemetry1.png)

![{{ site.baseurl }}/assets/images/posts/NvidiaTelemetry2.png]({{ site.baseurl }}/assets/images/posts/NvidiaTelemetry2.png)

![{{ site.baseurl }}/assets/images/posts/NvidiaTelemetry3.png]({{ site.baseurl }}/assets/images/posts/NvidiaTelemetry3.png)