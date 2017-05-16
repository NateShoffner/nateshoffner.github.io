---
layout: post
title: PySnip Linux Setup
date: 2012-12-22 20:31 -05:00
description: Instructions for setting up PySnip on Ubuntu
type: post
categories:
- Gaming
- Projects
tags:
- Ace of Spades
- Linux
- PySnip
- Python
- Ubuntu
---

This is just a small guide on how to setup PySnip on Linux. If you want to set it up on Windows, there is already a featured server [here](https://code.google.com/p/pysnip/downloads/list).

This guide assumes basic experience with a terminal and your distro's package manager.

Since Ubuntu seems to be the most common distro, I'll provide instructions that use apt-get. If you use a different distro/manager, please refer to your package-manager documentation for the appropriate commands.

First, install the dependencies:

    sudo apt-get install python2.7 python2.7-dev python-setuptools python-twisted mercurial gcc g++ zope.interface
    sudo python -m easy_install cython
    sudo python -m easy_install pil
    sudo python -m easy_install jinja2

Next, you can install screen if you'd like:

    sudo apt-get install screen

Another optional feature is pygeoip, which will allow you to use the /from command, showing you where individual players are located geographically.

Next you need to either clone the repository using Mercurial.

    hg clone https://code.google.com/p/pysnip/
    cd pysnip
    sh build.sh

If you don't want to clone the repo, you can download an up-to-date zipped archive of the source [here](https://code.google.com/p/pysnip/source/browse/). Just download and extract as normal.

Next you need to edit the configuration:

    cd feature_server
    nano config.txt

**Make sure you change your admin password from the default one.**

Finally, run the server:

    sh run_server.sh

Or if you are using screen:

    screen sh run_server.sh

For help, please refer to the [Google Code](https://code.google.com/p/pysnip/) page or visit the [Build and Shoot](http://www.buildandshoot.com/) forums.

