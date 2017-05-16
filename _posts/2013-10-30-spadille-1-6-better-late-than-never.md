---
layout: post
title: Spadille 1.6 - Better Late Than Never?
date: 2013-10-30 10:31 -04:00
description: Spadille 1.6 release blog
type: post
image: spadille-1.6.png
categories:
- Projects
tags:
- Spadille
- Ace of Spades
---

Well, over a year and a half later, I suppose I should release Spadille 1.6 eh?

{% include post_image.liquid filename="spadille-1.6.png" %} 

Spadille dropped off the grid a bit after being put on the back burner a while ago. I stopped working on it during the middle of refactoring...which is a bad idea. It's been ready for release for a long time now, but I just never released it. Why do today what you can put off until tomorrow? This version does not support [OpenSpades](https://sites.google.com/a/yvt.jp/openspades/) yet, but I will release a quick patch shortly for it.

You can download Spadille 1.6 [here](/projects/).

Changelog:

- Countless minor UI changes
- Fixed a bunch of minor bugs
- Improved memory usage
- Improved threading
- Rewrote screenshot hooking, caching and manager
- Added dynamically populated server filters
- Added share link
- Added autocomplete to server browser
- Added mumble link
- Removed deprecated dependencies
- Fixed support for Build and Shoot
- Abstracted Spadille client and SpadilleDotNet library
- Added "Last Played" column
- Added intermediate dialog when joining server

#### Related Notes:
I'll likely be releasing my library that Spadille is based on (along with a few other projects), SpadilleDotNet. It's a C#/.NET (2.0 compliant) library that provides a lot of functionality for working with Ace of Spades Classic (Voxlap/OpenSpades), Build and Shoot, Ace of Spades 1.0, and more.

Additionally, I have a few more tools that I'll be releasing here soon as well, as I start to dig through old projects that I've not released, so keep an eye out.