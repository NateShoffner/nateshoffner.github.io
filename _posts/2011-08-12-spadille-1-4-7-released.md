---
layout: post
title: Spadille 1.4.7 Released
date: 2011-08-12 00:29 -04:00
description: Spadille 1.4.7 release blog
type: post
image: spadille1.4.7.png
categories:
- Projects
tags:
- Ace of Spades
- Projects
- Spadille
---

Well Ace of Spades 0.58 is out now so it's time to release an update for Spadille.  It's been updated to support the shotgun and new sounds files. Admin tools have also been added allowing server admins to easy manage the new ban lists and admin lists. One particular feature is banlist syncing, where the global blacklist (seen [here](http://aos.nateshoffner.com/blacklist/)) is appended to the existing banlist. Any subsequent syncs will appropriately add any new bans, as well as remove any bans which have been removed from the global blacklist.

{% include post_image.liquid filename="spadille1.4.7.png" %}

A follow-up release will be out in due time to take advantage of even more of the new features in 0.58, so stay tuned.

Download: [http://nateshoffner.com/projects/spadille/](http://nateshoffner.com/projects/spadille/)

Change Log:

- Server list is no longer refreshed unless it is different from the previous refresh
- Improved parsing speed (new serverlist)
- Improved memory management
- "Keep on top" is now consistent between runtimes
- Added option to sync banlist with global blacklist
- Removed limit on recent server count
- Fixed bug when main window is set to stay on top and child window is opened
- Added admin tools (ban list/admin list manager)
- Attempting to join an already-joined game focuses game window
- Added "bang searching" (reverse-searching by proceeding a query with "!")
- Fixed bug when displaying release notification when installed game version can't be found
- Added whitespace trimming for server names
- Added option to reset config in config editor
- Added drop down list for recent config names
- Added fog color option in config editor
- Adding shotgun support to mod manager
- Added pyspades icon column
- possible fix when unable to acquire installed game version