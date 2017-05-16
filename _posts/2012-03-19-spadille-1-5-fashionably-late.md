---
layout: post
title: Spadille 1.5 - Fashionably Late
date: 2012-03-19 16:51 -04:00
description: Spadille 1.5 release blog
type: post
image: spadille1.5.png
categories:
- Projects
tags:
- Ace of Spades
- Spadille
---

Wanna know something that makes you feel like a dead-beat?

{% include post_image.liquid filename="spadillegooglesad.png" alt="Sad Spadille Google Suggestions" %}

Feels bad, man. It's been far too long since the last Spadille update. Let's change that. This update is long overdue and hopefully the amount of changes/new features will help compensate for it.

{% include post_image.liquid filename="spadille1.5.png" %}

#### Game Updater

{% include post_image.liquid filename="Spadlile1.5GameUpdater1.png" alt="Game Updater" %}

One of the most requested additions has been a game updater. Recent versions of Spadille have shown that a new version was available, but only served as a link  to the Ace of Spades homepage. Now updates can be downloaded from within Spadille.

#### Game Settings + Keybinding

{% include post_image.liquid filename="Spadille1.5GameSettings.png" alt="Game Settings" %}

Ace of Spades 0.60 Beta added configurable controls via (rather arcane) scancodes. This utility will make changing controls much easier. Simply find the game action you want to change, and select a key from the drop-down list. Some of the key names may seem a bit cryptic, but every possible key is on there.

A standalone version of the this utility can be found [here](http://www.nateshoffner.com/2012/03/ace-of-spades-key-mapper/ "Ace of Spades Key Mapper").

#### Screenshots

{% include post_image.liquid filename="Spadille1.5ScreenshotManager.png" alt="Screenshot Manager" %}

The screenshot functionality got a pretty big overhaul. The screenshot mechanism was re-written from scratch for better reliability. Users reported slow load times when dealing with large quantities (250+) of screenshots. Screenshots are now cached to reduce memory allocation as well as increase load times (not to mention better multi-threading). Last but not least is screenshot uploading. With a single click, you can upload screenshots to Imgur for easy sharing.

<img title=" " src="{{ site.baseurl}}/assets/images/posts/download32.png" alt="" width="32" height="32" />
#### [Download Spadille 1.5](http://www.nateshoffner.com/projects/spadille)

#### Complete Change Log

- Filters are now tri-state (neutral, enforce, ignore)
- Added support for third-part game modes (TDM, TOW, 1CTF, R1CTF, Kraken, Babel, Arena, IRPG, IPower)
- Added searching by map name
- Added searching by country
- Added key mapping to game settings
- Added JSON support
- Updated GeoIP database
- Fixed some obscure country names
- Updated game settings for 0.75
- Server browser redesigned
- Removed in-game name dropdown
- Improved memory management
- Added game mode column
- Added map name column
- Updated serverlist parsing
- Added support for server ports
- Removed connect dialog from localhost connect
- Joined servers are now immediately appended to recent listing
- Fixed bug with software/favorites column not remaining sorted
- Added search delay
- Added option to remove borders from screenshots
- IRC link opens Quakenet webchat if IRC client is not found
- Added search character limit
- Local pings can now be preserved between refreshes
- Improved search (multiple word splits)
- Removed clan prefix option
- Made country flags optional
- Fixed possible infinite recursion bug with Pyspades serverlist updating
- Attempting to join multiple games now kills first instance (optional)
- LOTS of refactoring
- Added global blacklist integration
- Added proper in-game name truncating
- Update downloading is now asynchronous
- Update downloading can now be cancelled
- Added proper error handling for failed update download
- Fixed bug when toggled columns are cut off on right
- IP column is now hidden by default
- Added country column/removed country flag from IP column
- Added checking for local server when attempting to connect to localhost
- Fixed bug with dialogs not remembering "do not show again" when cancelled
- Implemented screenshot cache
- Added more functionality to tray menu
- Added proper AoS installation checking
- Added feedback form
- Completely redesigned mod manager/added more functionality
- Mod manager now loadtime dispersed
- Added server logging options
- Removed filter counts
- Added option for HTML encoding/decoding
- Added server language options
- Added client language options
- Completely redesigned map manager/added more functionality
- Fixed bug with inproper map save filename format
- Fixed bug with saving corrupt maps
- Added quick match button
- Redesigned about dialog/updated credits
- Made hit indicator disabling dynamic
- Added support for float-based mouse sensitivity
- Added new "first run" dialog
- Column sort direction is now consistent between runtimes
- Fixed bug with non-fixed ping strength indicators
- Added menu option to refresh individual server data
- Added option to join server on middle-click
- Sever URLs are now case-insensitive
- Added icon for vanilla servers
- Added direct connect button to main window
- Ping strength indicators are now color-coded
- Updating pings now only applies to visible servers in list
- Redesigned converter
- Added automatic refreshing disabling after set number of failed attempts
- Added error reporting
- Added option to clear error log
- Adding automatic detection for new game install
- In-game name checking is now dynamic
- Game version checking is now dynamic
- Error log viewer is now dynamic
- Missing GeoIP database now prevents further execution
- Added option to upload error log to Pastebin.com
- DDFontMake now included with installer
- Added create new map option in map manager
- Added option to periodically sync with global blacklist when hosting server
- Rewrote PrtScr hooking mechanism
- Added server counts in tabs
- Added option to backup mods
- Automatic refresh is now only disabled if server connection is successful
- Added option to close to system tray
- Removed deprecated Deuce name check
- Only successful joins are added to history
- Spadille now overrides "server full or misconfigured" error/offers retry option
- Added image uploading/online library to screenshot manager
- Improved game version detection reliability
- Added option to launch Spadille on system startup
- Added option to format title of Ace of Spades client
- Added drop-down list to direct connect for recent connection
- Added game updater
- Added support for direct connect using server URL without prepending aos://