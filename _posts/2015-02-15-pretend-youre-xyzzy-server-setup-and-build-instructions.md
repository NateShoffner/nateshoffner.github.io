---
layout: post
title: '"Pretend You''re Xyzzy" Server Setup and Build Instructions'
date: 2015-02-15 13:12 -05:00
description: '"Pretend You''re Xyzzy" Server Setup and Build Instructions'
type: post
image: xyzzy.png
categories: []
tags:
- Tomcat
---

"Pretend You're Xyzzy" is a Cards Against Humanity clone that allows you to play online with others. It consists of a Tomcat/JSP server and web page clients.

{% include post_image.liquid filename="xyzzy.png" %} 

At the time of writing this, the main server located at [pretendyoure.xyz](http://pretendyoure.xyz/) appears to be down, so I decided to set up my own server for a group of friends and myself to play. Initially, there didn't seem to be much info on setting up the server. The [GitHub](https://github.com/ajanata/PretendYoureXyzzy) had a very brief explanation:

> This project has only been tested in Tomcat 7 and is known to not work in Tomcat 6 without some finagling. Currently, the only automated way to build is is using the Eclipse project.

While the setup isn't terribly complicated or anything, I figured I'd post some instructions on how to set things up since a lot of people seem to be having issues doing so and there don't seem to be any concise instructions on how to do so.

These instructions are for a Debian-based installation, but are easily applicable to other distros/platforms as well.

First you'll need Apache Tomcat 7 and you'll want to install the admin panel as well:

    sudo apt-get install tomcat7 tomcat7-admin

Next, stop the Tomcat server for the time being so we can modify some permissions:

    service tomcat7 stop

Next, we'll edit the users config so we can administrate the server:

    sudo nano /etc/tomcat7/tomcat-users.xml

Add the following line in between the <tomcat-users> and </tomcat-users> tags, replacing 'admin' and 'password' with your own secure credentials:

    <user username="admin" password="password" roles="manager-gui,admin-gui"/>

Start the service back up:

    service tomcat7 start

Now we want to install PostgreSQL for our database:

    sudo apt-get install postgresql

Change over to the postgres user (already set up via the installation process):

    sudo -i -u postgres

Then, run the following, replacing 'password' with a secure password of your choice:

    createdb cahdb
    psql template1
    CREATE USER cah WITH PASSWORD 'password';
    GRANT ALL PRIVILEGES ON DATABASE "cahdb" to cah;
    \q
    exit

Finally, we need to download the cards database and import it:

    wget https://raw.githubusercontent.com/ajanata/PretendYoureXyzzy/master/cah_cards.sql
    psql -h localhost -d cahdb -U cah -f cah_cards.sql

Now navigate to http://your_host:8080/manager/html and login.

From here, you can upload your WAR file and deploy it.

If your server does not seem to be loading/seems to be stalling, a possible reason could be Tomcat using a blocking entropy source for session IDs. To implement a non-blocking (and slightly less secure) entropy source, open/create a setenv.sh script in /usr/share/tomcat7/bin and add the following line:

    JAVA_OPTS=" $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom "

Save and restart Tomcat.

    service tomcat7 restart
    Finally, you can access the app via http://your_host:8080/cah.

You can download a pre-built/zipped version of cah.war [here]({{ site.baseurl }}/assets/files/cah.zip). The PostgreSQL parameters are as follows:

    Username: cah
    Password: password
    Database: cahdb

**NOTE:** Since this version uses insecure/public credentials, make sure to take necessary precautions to secure your server.

If you'd prefer to build your own version, follow the instructions below.

Building the .war file is fairly straightforward. Just download the source from Github via Git or just use the zip functionality.

You will need the [JRE v7u75](http://www.oracle.com/technetwork/java/javase/downloads/jre7-downloads-1880261.html) installed.

Open [Eclipse (Java EE)](https://eclipse.org/downloads/packages/eclipse-ide-java-ee-developers/keplersr2) and open the project.

Install Luna if you don't already have it buy going to Help->Install New Software. Choose "Luna". Select "Web, Xml, Java EE and OSGi Enterprise Development", install it and restart.

Set Tomcat 7 as your runtime environment server.

Make sure your build path uses the correct runtime environment as well.

Database credentials can be changed in the hibernate.cfg.xml file.

When all is well, you can go to File->Export->Web->WAR File.

You can upload and deploy that file through the Tomcat admin panel and you're good to go!