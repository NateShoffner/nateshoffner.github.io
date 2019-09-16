---
layout: post
title: Google Play Developer Account Termination
date: 2019-09-16 15:10 -05:00
description: 
type: post
image: google-play.png
categories:
- Android
tags:
- Google Play
- Play Store
- Android
---

Recently I had the pleasure of dealing with Google's heavy handed approach to over-sweeping account terminations.

On September 11th, I received the following email from Google out of the blue:

> This is a notification that your Google Play Publisher account has been terminated.
>
> REASON FOR TERMINATION: Prior violations of the [Developer Program Policies](https://play.google.com/about/developer-content-policy.html) and [Developer Distribution Agreement](http://www.android.com/us/developer-distribution-agreement.html) by this or associated accounts as outlined in previous emails sent to the registered email address(es) of the Publisher account(s).
>
> Google Play Publisher suspensions are associated with developers, and may span multiple account registrations and related Google services.
>
> You can visit the [Developer Policy Center](https://play.google.com/about/enforcement.html#enforcement-process) to better understand how we enforce Developer Program Policies. If you’ve reviewed the policy and feel this termination may have been in error, please reach out to our [policy support team](https://support.google.com/googleplay/android-developer/contact/emailappeals?t=7187132&ts=BOT&email=$%7BEMAIL_ADDRESS%7D&n=$%7BDEV_NAME%7D).
>
> Do not attempt to register a new developer account. We will not be restoring your account at this time.
>
> The Google Play Team

I received no warnings prior to the termination email I received nor did I have any idea as to why the account was terminated to begin with. The only email I ever received regarding this account was on August 29th, 2018 where I was notified that an app was removed from Google Play because of a Children's Online Privacy Protection Act (COPPA) compliance requirement, which I adhered to and the app was reinstated shortly thereafter.

I submitted my appeal, explaining I had never received any warnings or occurrences prior to termination and gave some basic information regarding my packages that would be pertinent to a potential occurrence (e.g., content ratings, open-source, embedded ads).

Additionally, I decided to [post](https://www.reddit.com/r/androiddev/comments/d30gqw/account_terminated_without_prior_warning/) over on [/r/androiddev](https://www.reddit.com/r/androiddev/) about the situation and found out I wasn't alone and there was apparently some sort of ban wave, all of which seemed to have a similar story: no prior occurrences, no warning email, and the claim of "prior occurrences" given as the reason for termination.

The following day after submitting my appeal, I received a response:

> Hi Nate,
>
> Thanks for contacting the Google Play Team.
>
> After further review, we've accepted your appeal and reinstated your account. You'll need to sign in to your [Play Console](https://play.google.com/apps/publish/) to modify and/or republish any reinstated apps to make them available on Google Play.
>
> If the option to resubmit is not available, please try making a small change to your app’s Store Listing page. For example, you can add and remove a space at the end of your app description.
>
> Please let me know if you have any other questions.
>
> Regards,
> Samantha 
> The Google Play Team

Several other developers I've talked to have received the same response with no reasons given for their termination. Any Play Store listings had to be re-submitted but that aside, re-instatetment was seamless.

I responded to the reinstatement email requesting further information on whey the account was terminated and what steps I could possibly take to avoid future potential issues.

Then on September 13th, I received a follow up email:

> Hi Nate Shoffner,
>
> On September 11, 2019, an error resulted in the unintentional ban of your developer account. We apologize for this error and assure you that it will not negatively impact your account standing. We will restore all of your app(s) to their prior state as of September 11, 2019. No action is needed on your part. We expect the restoration process to be complete by September 14, 2019.
>
> Your restored app(s) may be reviewed by the Google Play Team, so please ensure that your app(s) are compliant with all [Developer Program Policies](https://play.google.com/about/developer-content-policy/). 
>
> If you have any questions or concerns about this process, feel free to [submit a request here](https://support.google.com/googleplay/android-developer/contact/appwarning) and we'll do our best to respond within 1 business day. 
>
> Thank you for your understanding and for being a valued part of the Google Play ecosystem. 
>
> The Google Play Team

Finally, today on September 16th I received a response to me asking for further details as to why the account was terminated to begin withL:

> Hi Nate,
> 
> Thanks again for reaching out. I believe an email was sent out to you (ticket# REDACTED) last Friday explaining the issue. 
> 
> Please refer to the aforementioned email for more information and if you have any further questions please let me know. 
>
> Regards,
> Samantha 
> The Google Play Team

Anybody who's had to deal with monolithic companies like Google knows how daunting it can be when something like this happens. You feel powerless because getting in contact with an actual human seems nearly impossible. What's worse is that, from what I've read, any accounts associated with a terminated account is subject to termination as well. This can cause a massive domino effect when you have several accounts working for one client/company and one of them is terminated.

Google needs to work on their transparency when it comes to their "valued" members of the Google Play ecosystem. While there is definitely a case to be made for Google needing to do maintenance for malicious apps and developers, even through automated means, there needs to be a more transparent and communicative method of dealing with them in the case of false positives. When an individual's career and livelihood can but cut off without a warning, it's a surefire way to get people to abandon your platform for one with better insurance.