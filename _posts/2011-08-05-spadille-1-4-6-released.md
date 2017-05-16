---
layout: post
title: Spadille 1.4.6 Released
date: 2011-08-05 19:22 -04:00
description: Spadille 1.4.6 release blog
type: post
image: Spadille_1.4.6.png
categories:
- Projects
tags:
- Ace of Spades
- Projects
- Spadille
---

Spadille 1.4.6 is now available for download.  This update consists more of a interface makeover compared to 1.4.5 along with a few bug fixes.  The player count bug where it was displaying several thousand players online has since been fixed (hopefully that will be real someday).

{% include post_image.liquid filename="Spadille_1.4.6.png" %}

There is now a tabbed interface which currently divideds the server list into 3 sections, Public (general server listing), favorites, and recent (history).  I think the names are pretty obvious.  Search, filters, and stats have been moved to the right side of the server list for easier access.

A new release probably isn't too far into the future depending on when Ace of Spades 0.55 is released. When a new Spadille version is released, you'll be able to see the new update wizard :D

Download: [http://nateshoffner.com/projects/spadille/](http://nateshoffner.com/projects/spadille/)

Change Log:

v1.4.6
- Fixed bug with server list always reorganizing after closing favorites/blacklist dialog
- Improved reliability of properly retrieving user IP and country
- Double-clicking blacklisted icon prompts dialog to add to favorites
- Filtered servers are now correctly ordered by sorted column
- Local pings are now permanent until proceeding refreshes
- Fixed bug with accidently blacklisting the server above the intended one
- Added clear option to server list manager
- Added "History" to server list manager
- Fixed bug when resetting columns and some column widths remain static
- Added update wizard
- Added option for custom refresh speeds
- Removed URL column in server browser (servers can still be searched via URL)
- Stats/filters/search added to right side of server browser
- Removed deprecated "non-favorites" filter
- Removed random connect
- Removed deprecated favorites/recent menu
- Added tabbed interface (public/favorites/recent)
- Fixed bug with inaccurate player count in stats