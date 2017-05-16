---
layout: post
title: Spadille 1.4.8 Released
date: 2011-09-19 02:16 -04:00
description: Spadille 1.4.8 release blog
type: post
image: Spadille1.4.8.png
categories:
- Projects
tags:
- Ace of Spades
- Projects
- Spadille
---

Well, it's been well over a month since the last update so I figured one was due.  There are a lot of changes trying to polish a few existing features, as well as some new ones. A new update should be out in due time (a lot sooner next time hopefully) with some more features I've been wanting to add for quite some time.

{% include post_image.liquid filename="Spadille1.4.8.png" %}

Download: [http://nateshoffner.com/projects/spadille/](http://nateshoffner.com/projects/spadille/)

Change Log:
- Added support for TIFF screenshot format
- Added wait period in between blacklist synchronizations
- Fixed admin dialog locking up during blacklist sync
- Improved master server flood protection
- Removed refresh speed options
- Added option to automatically refresh server list
- Added error handling to converter
- Refreshing server list cancels ping operation if running simultaneously
- Consolidated network requests
- Added option to cancel ping operation
- Removed deprecated code and dependencies
- Switching tabs while pinging servers now halts process
- Added ping signal strength icons
- Changing name in config editor now updates stats section
- Refreshing list during ping updating now stops ping update
- Fixed bug with maps not properly loaded in VOXED in map manager
- Fixed bug with blacklist filter not properly saving
- Fixed bug with utilities not showing in taskbar when launched from start menu
- Added menu options to remove existing favorited/blacklisted servers
- Added option to config editor to disable hit indicator
- Added option to set filter method to blacklist or whitelist (blacklist by default)
- Saved maps now use MM-DD-YYYY instead of UNIX time
- Added support for copying multiple screenshots
- Added support for Ctrl+C to copy screenshots
- Screenshots now load asynchronously
- Redesigned screenshot manager with image preview
- Added option to play sound when capturing screenshot
- Added option to filter servers based on ping limit
- Filters are no longer processed unless there is actual servers to be filtered
- Fixed bug with update timestamp not showing on first refresh
- Fixed bug when opening config editor and invalid clan prefix
- Fixed possible bug when fetching external IP