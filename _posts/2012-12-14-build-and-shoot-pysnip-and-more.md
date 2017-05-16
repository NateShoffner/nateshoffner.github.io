---
layout: post
title: Build and Shoot, PySnip, and More
date: 2012-12-14 14:52 -05:00
type: post
categories:
- Gaming
- Projects
tags:
- Ace of Spades
- Build and Shoot
- PySnip
---

Only a tad bit late on this one. Figured I'd post about it though.

#### Build and Shoot
In light of Jagex pushing out Ace of Spades 1.0 and abandoning 0.x, danheeze, izzy, and myself have decided to make a new community called [Build and Shoot](http://www.buildandshoot.com/). We're aiming at giving the Voxlap version of Ace of Spades a solid home. So far things have turned out quite well.

#### Master Server
The other week, I reverse-engineered and re-implemented the master server. That means game servers can connect to our master server to be listed on our [serverlist](http://www.buildandshoot.com/serverlist). It also means that we are completely independent of Jagex, which is always a plus. At the time of writing this, we have over 60 servers using our master server.

Since the protocol is exactly the same, server owners don't have much to do in order to use our master server. To see how to use our master server, please view [this thread](http://www.buildandshoot.com/viewtopic.php?f=18&amp;t=311).

Currently, it supports 0.75. We will likely be adding support for 0.76 RC10 as well later on.

#### PySnip
Along with everything that has been going on, pyspades has been made closed-source. I have put together a forked version, dubbed "PySnip". It's been slightly modified in some areas and is designed to work with our master server. All maps except for random and classicgen have been removed to slim the download size down. All the previous maps can still be downloaded [here](https://code.google.com/p/pysnip/downloads/detail?name=Original%20Pyspades%20Map%20Pack.zip&amp;can=2&amp;q=).

Jagex's master server has been down for quite some time now and I'm not sure if it's going to come back. If they do put it back online, I might add the ability to connect to multiple master servers by declaring them in the configuration file like so:

{% highlight json %}
{
    "master_servers" : {
        "enabled" : true,
        "hosts" : {
            "184.172.204.137" : 32886,
            "199.195.254.202" : 32886
        }
    }
}
{% endhighlight %}

More information here: [https://code.google.com/p/pysnip/](https://code.google.com/p/pysnip/)

If you would like to join Build and Shoot and play Ace of Spades Voxlap, please visit [http://buildandshoot.com](http://buildandshoot.com).