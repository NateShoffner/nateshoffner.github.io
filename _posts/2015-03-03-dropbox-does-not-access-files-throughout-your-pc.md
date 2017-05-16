---
layout: post
title: Dropbox Does Not Access Files Throughout Your PC
date: 2015-03-03 12:05 -05:00
description: Dropbox data collecting debunked
type: post
image: DropboxQueryOperations.png
categories: []
tags:
- Dropbox
---

Recently, there has been an [article](http://www.e-siber.com/guvenlik/dropbox-accesses-all-the-files-in-your-pc-not-just-sync-folder-and-steals-everything/) circulating around with a pretty damning accusation. To summarize the post, they claim Dropbox is transferring data on the entire computer, not just folders that are designated to be synced.

This is clearly a bold accusation, with seemingly little evidence to back it.  This speculation is based entirely on filesystem events and unverified network traffic..yep.

At the time of writing this, the author has not disclosed what "unnamed DLP agent" software he is using nor has he provided any real evidence to support his claims.

Let's explain the filesystem activity:

Just to run a simple test, I'll be using [Process Monitor](https://technet.microsoft.com/en-us/library/bb896645.aspx) and setting basic filters to check Explorer and Dropbox filesystem events.

After creating a new file outside of my designated Dropbox directory, you can see it fires filesystem events to query the file. In particular, [QueryDirectory](https://msdn.microsoft.com/en-us/library/ff567047%28VS.85%29.aspx) operations which involve [checking the file path](https://msdn.microsoft.com/en-us/library/windows/desktop/aa364980%28v=vs.85%29.aspx) to see if it belongs to a synced directory.

{% include post_image.liquid filename="DropboxQueryOperations.png" alt="Dropbox Query Operation" title="Dropbox Query Operation" %} 

I'd expect another culprit to the the shell integration. Personally, I don't use the sync indicators myself, as I have other programs that use shell integration and it can cause conflicts. However, I'd imagine that the shell integration in Explorer requires the files/directories to be queried as well to check for sync status.

As for the network activity...the author has not even bothered to check the length of the data and compared it to the suspected files nor has he compared the timestamps between the two. Keep in mind that network activity from a program such as Dropbox is perfectly normal, how else would it be able to sync things in realtime?

So no, based off the limited (see: hardly any) "evidence" provided by the original author, it does not appear that Dropbox is transferring data outside of the designated dirctories.