---
layout: post
title: Ace of Spades Key Mapper
date: 2012-03-06 16:03 -05:00
description: Ace of Spades Key Mapper release blog
type: post
image: keymapper1.png
categories:
- Projects
tags:
- Ace of Spades
---

Recently there have been a lot of people asking how to map controls in Ace of Spades. For those who don't know, Ace of Spades allows controls to be configured via [scan codes](http://en.wikipedia.org/wiki/Scancode) by editing the controls.ini file located in the installation directory. Within the file, there is a URL that links to a [scan code chart](http://www.ee.bgu.ac.il/~microlab/MicroLab/Labs/ScanCodes.htm). For the most part, this chart will suffice, until you realize that Ace of Spades uses DirectInput scan codes, which can differ from those on the chart.

{% include post_image.liquid filename="keymapper1.png" alt="Ace of Spades Keymapper" %}

An example of the controls.ini scancode format:

    move_forward = 0x11
    move_backward = 0x1F
    move_left = 0x1E
    move_right = 0x20

To help alleviate the problems people were having and to make things easier (and to satisfy my laziness), I threw together a key mapper. This was originally part of Spadille 1.5, which while writing this has yet to be released as I'm waiting for Ace of Spades 0.75 Beta to move out of RC, but I figured a standalone version will do for the time being.

To use it, just start the program and locate your controls.ini file. It's designed to work with any version of Ace of Spades.

If you find any problems, you can either comment on here or on [this forum thread](http://ace-spades.com/forums/viewtopic.php?f=75&t=3581). A response through the forums will likely be faster.

	The program can be downloaded on the [Projects](/projects/) page.