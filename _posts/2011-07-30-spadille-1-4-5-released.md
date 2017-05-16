---
layout: post
title: Spadille 1.4.5 Released
date: 2011-07-30 01:44 -04:00
description: Spadille 1.4.5 release blog
type: post
categories:
- Projects
tags:
- Ace of Spades
- Projects
- Spadille
---

Spadille 1.4.5 has now been released. This released includes quite a few bug fixes along with a bit more polishing of the program itself, both under the hood and with aesthetics.

{% include post_image.liquid filename="Spadille-1.4.5.png" %}

A few new features are Slab6 is now included with the installer, more filtering options (foreign countries, favorites only, "vanilla servers"), screenshot save formats, improved/faster server listing, clan prefix option in config editor, and more.  Additionally, error logging has been added to help solve some problems, should they arise.  The complete change log can be found below:

Download: [http://nateshoffner.com/projects/spadille/](http://nateshoffner.com/projects/spadille/")

Change Log:

- Opening Spadille while already running now focuses existing window
- Local pings are now color-coded blue
- Redesigned and added addiction data to statistics
- Added refresh limiter
- Improved network traffic
- Added option to reset all filters
- Added warning dialog when attempting to join two games simultaneously
- Added clan prefix option/input in config editor
- Added option to change screenshot image format (PNG/BMP/JPEG)
- Fixed bug with collision when adding a blacklisted server to favorites
- Added double-clicking of icon column to add/remove server to/from favorites
- Added icon column for distinguishing between favorites/blacklisted/personal servers
- Redesigned the favorites/blacklist dialog
- Fixed bug with newly blacklisted servers being hidden when blacklist filter is off
- Substituted favorites color coding with favorite column
- Fixed possible bug with screenshot when game is not in focus (alt-tabbed)
- Added option to filter vanilla servers
- Fixed bug with remembering filter for pyspades and blacklisted servers
- Added option to filter non-favorited servers
- Added option to filter foreign countries
- Consolidated location column with IP column
- Re-added consistent client size between runtimes
- Disabled column header height resizing
- Added option to reset columns
- Added error logging
- Consolidated software column with the server name column
- Fixed bug when blacklisting first server on list
- Fixed bug with pyspades servers not being detected
- Added character limit to config editor name input
- Added button to mod manager to edit mod (KV6) in Slab6
- Added button to map manager to edit map in Voxel
- Slab6 now included with installer
- Fixed possible bug with missing GeoIP database