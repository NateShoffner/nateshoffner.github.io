---
layout: post
title: Visual Studio - .resx file complication bug with ImageList
date: 2012-05-15 12:31 -04:00
type: post
categories:
- Programming
tags:
- ".resx"
- ImageList
- Visual Studio
- WinForms
---

Visual Studio's WinForm designer is outstanding in many ways. But recently I've found myself in a bit of a situation when using the designer along with an ImageList.

Upon trying to compile, I received an error stating "*Error 322 Could not load file or assembly '&lt;referenced assembly here&gt;' or one of its dependencies. An attempt was made to load a program with an incorrect format. Line 283, position 5. WinForm.resx 283*". This lead me to viewing the resource file for the WinForm I was working. More specifically, it was showing me the ImageStream (base64 encoded) for the ImageList.

Here are a few notes regarding my situation that might be relevant:

* Using Visual Studio 2010 targeting .NET 2.0
* Occurs using both Debug and Release modes
* Solution platform - x86
* Running Windows 7 Home Premium 64-bit
* ImageList contains 5 16x16 PNG images with 32bit Bit Depth
* The assembly it's supposedly failing to load is a class library I have created which has no referenced resources (at least not externally)

Some quick Googling lead me to a Microsoft Connect [bug report(https://connect.microsoft.com/VisualStudio/feedback/details/532584/error-when-compiling-resx-file-seems-related-to-beta2-bug-5252020] where the issue was supposedly resolved.....in early 2011. Some users have found some hacky workarounds involving modifying the ImageStream, but that wasn't the case for me. I eventually landed on a [blog post](http://blogs.msdn.com/b/visualstudio/archive/2010/06/19/resgen-exe-error-an-attempt-was-made-to-load-a-program-with-an-incorrect-format.aspx) with a few possible workarounds with the first one being the easiest (in my situation, at least). All I had to do was change the referenced assembly from x86 to AnyCPU. It seemed to have done the trick and I haven't had any problems since. Hopefully this bug will actually be fixed/released by Microsoft, seeing as none of the workarounds are universally ideal for lots of project types.