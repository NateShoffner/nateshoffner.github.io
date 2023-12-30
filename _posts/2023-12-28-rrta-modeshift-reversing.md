---
layout: post
title: RRTA ModeShift Reverse-Engineering
date: 2023-12-28 13:00 -05:00
description: A short journey into reverse-engineering the ModeShift RRTA app.
type: post
image: rrta-logo.png
categories:
- Projects
- Reverse-Engineering
tags:
- Python
- RRTA
- Android
---

A few years ago, the [RRTA](https://www.redrosetransit.com/) (Red Rose Transit Authority) performed a big overhaul to their transit system, including the introduction of a new mobile app called RRTA Go Mobile by [ModeShift](https://www.modeshift.com/). The app was designed to replace the old paper tickets and passes with a digital system that could be used to purchase passes and plan trips. As a big proponent of public transit, this was a very welcomed improvement for me. There were a few issues early on with QR codes not scanning properly and/or failing to renew, but those issues were quickly resolved. I myself have submitted a ticket or two to the developers regarding some issues I've encountered and received a fairly timely response with fixes following shortly after, so props to the developers for that.

RRTA also offers another app/web interface called [BusFinder](https://busfinder.redrosetransit.com/InfoPoint/) operating on the [myStop](https://availtec.com/mystop/) system by [Avail Tech](https://availtec.com/myavail/), which allows you to track buses in real-time, a feature ModeShift sadly fails to offer. This effectively requires riders to utilize multiple apps for basic functionality and RRTA doesn't seem to advertise the BusFinder app very well, as I've met many riders who were unaware of its existence.

Earlier this year, I decided to take a look at the BusFinder system and see if I could reverse-engineer it to create my own tools for tracking and analytics. I was able to get a basic prototype working, which was pretty simple considering it's a pretty basic REST API and eventually released a [Python wrapper](https://github.com/NateShoffner/python-rrta) for it.

I was curious if I could do the same with ModeShift, but I quickly discovered that it was a bit more complicated than BusFinder. The ModeShift app is a hybrid app, meaning it's essentially a web app wrapped in a native app. This is a pretty common practice for mobile apps, as it allows developers to write a single codebase for multiple platforms, but it also makes it a bit more difficult to reverse-engineer.

I started by decoding the APK using [apktool](https://ibotpeaches.github.io/Apktool/). Next I replaced the [Network Security Configuration](https://developer.android.com/privacy-and-security/security-config) to allow user-installed certificates, which is required to intercept HTTPS traffic. The source code for the app was then modified to disable any various [certificate pinning](https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning#what-is-pinning) methods and to allow the use of a custom CA certificate. After that, the modified APK was recompiled with Apktool, signed with my own key via [uber-apk-signer](https://github.com/patrickfav/uber-apk-signer), and installed on my device.

I then used [Fiddler Everywhere](https://www.telerik.com/download/fiddler-everywhere) to act as a man-in-the-middle (MITM) proxy to intercept the HTTPS traffic from the app. There are plenty of free/open source alternatives to Fiddler, but I've found Fiddler to be the most user-friendly and wanted to try the Everywhere version, as I've been a long-time user of the original Fiddler for Windows.

{% include post_image.liquid filename="modeshift-fiddler.png" class="center-block" %}

I'm not particularly interested in any of the authenticated endpoints, so I'm only going to focus on the unauthenticated endpoints for now since they're the most useful and allow stuff like trip planning. Admittedly, these endpoints do a lot of the heavy lifting as far as actual routing and trip planning goes. I was initially assuming that ModeShift was piggybacking off the same system as BusFinder (they perhaps are, to a degree), but it seems that ModeShift is doing a lot of the heavy lifting itself, rather than passing off the routing to something like Routes API from Google or something similar.

My plan is to offer a client implementation for ModeShift within the [python-rrta](https://github.com/NateShoffner/python-rrta) package. My hope is to create more tools for RRTA riders to utilize and to hopefully encourage more ridership.