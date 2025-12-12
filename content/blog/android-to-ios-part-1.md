---
title: "Switching from Android to iOS: Part 1"
date: 2025-12-12
---

After many years of being a green bubble Android user, I've decided to switch over to iOS.

In this post I wanted to write down my thoughts, concerns, and process before I actually make the change, hence why I'm calling this "part 1". In part 2 I'll write about how it all went.

My current phone is a Pixel 8 running Android 16 (last updated in November 2025). I purchased it in late November 2023 so it's almost exactly 2 years old.

My new phone is an iPhone 17 (the latest baseline model as of Dec 2025).

## Why?

The reason I'm making the jump is simple, I'm tired of buying new phones more frequently than all of the iPhone users I know. I love the Android OS but my last 2 Pixel phones have been duds. 

I had a Pixel 5a phone that lasted 2 years. One day it just bricked itself for no reason as I unplugged it from my car. It was just dead, nothing could turn it on.

My current Pixel 8 has a [known issue](https://www.reddit.com/r/GooglePixel/comments/1if891x/pixel_8_intermittent_green_screen_help/) where the screen goes green or pixelates. I had the luck of finding out about in the middle of an international trip, that wasn't fun. Plus its battery is draining much faster now than before.

I've also had this issue with all Pixel phones I've owned where it was sending some calls straight to voicemail for no reason. I tried many ways of fixing this to no avail. I gave a Pixel phone to my Dad and he was constantly missing important medical related calls. He ended up switching back to an old Samsung phone.

## SIM to eSIM

I didn't realize that in the US, iPhone's have been eSIM only since the iPhone 14. I had a small moment of panic after opening up the package, mostly worried this would be a long process involving calling T-Mobile. 

However, the [official guide from Apple](https://support.apple.com/en-us/123878) makes it seem like it will be a simple process, and this [Reddit thread](https://www.reddit.com/r/tmobile/comments/180vo2m/transfer_line_from_android_phone_to_iphone_esim/) confirms it's pretty seamless, which eased some of my worries. 

## What I care actually transfers over

Most of the stuff on my phone is already backed to my Google account so there's not much that I need transferred. Google has a [handy guide](https://guidebooks.google.com/iphone/setup) on setting up all your Google services on iOS. 

Here are the few things I care about:

- SMS Message History

- Contacts

- WhatsApp Chat History - apparently people have had issues with this

## Password manager

Being the techy nerd that I am, of course I have a custom complicated setup. 

I use [KeepassXC](https://keepassxc.org/) and [Syncthing](https://syncthing.net/) as my password management system. It works completely offline and I sync my devices via local WiFi only. On Android I use the [Keepass2Android Offline](https://play.google.com/store/apps/details?id=keepass2android.keepass2android_nonet&hl=en_US) app, which is 100% free, no premium features behind a subscription or purchase.

In order to use a similar setup on iOS, I could use [Keepassium](https://keepassium.com/) and [Möbius Sync](https://mobiussync.com/). Keepassium's free tier is pretty good but its auto-fill feature is locked behind a [payment](https://keepassium.com/pricing/). That's a pretty important feature. I'd be willing to pay it to support the developer, but what gives me pause is the Möbius Sync app. I'm not sure if I trust it. So I'm thinking of switching over to BitWarden instead and I will write up another post on that whole process.

## Other concerns

My Google account has a bunch of 2FA ways of logging in and I'm hoping this won't be an issue when logging into my account on the new iPhone. I still have access to my Android so if I get a prompt I can still tap on it, or I can use other methods (Google Authenticator app, etc).

Just in case, I generated a new set of recovery codes and backed those up securely.

## The plan

After reading the official guides and a bunch of Reddit threads, I've formulated a plan on how I'm going to approach this:

I plan on using the [Move to iOS](https://play.google.com/store/apps/details?id=com.apple.movetoios&hl=en_US) app that I downloaded directly from the Google Play Store. As of writing this it says I have `v4.0.3`. You can [download the APK manually](https://support.apple.com/en-us/101590) if you don't have access to the Play Store.

I am going to turn off data on my Android and connect the 2 phones via WiFi. I saw a [Reddit thread](https://www.reddit.com/r/iphone/comments/jgufpe/if_youre_using_the_move_to_ios_app_make_sure_you/) that said this sped up the transfer by a lot.

I will only select SMS messages and WhatsApp messages to transfer.

I've seen a lot of people on Reddit complaining about issues with the WhatsApp transfer getting stuck or not working at all. WhatsApp's [own FAQ](https://faq.whatsapp.com/686469079565350) tells you to use the Move to iOS app so I'm going to start there and see how that goes. I backed up my chat history to Google drive just in case.

During the Move to iOS process, I will **not** log into my Apple ID. [This comment on Reddit](https://www.reddit.com/r/ios/comments/1akb3ur/comment/mv7gsw4/) said that helped them with the SMS message transfer. You log in later and it will merge your messages from iCloud with the ones transferred over from your Android. I don't have any messages in iCloud but I'm going to try this just in case.

After the (hopefully 🙏 ) successful transfer, I will then [sync my Google contacts](https://guidebooks.google.com/iphone/setup/sync-google-contacts-with-your-iphone), and log into iCloud with my Apple ID and I should be good to go. 



Wish me luck! 

-----

## Research

- An [official guide from Apple](https://support.apple.com/en-us/118670) on transferring from Android to iPhone with a video.

Some other Reddit threads I found while researching this:

- SMS messages: [this is the reddit thread](https://www.reddit.com/r/ios/comments/1akb3ur/is_it_possible_to_move_smsmms_from_android_to/) where I got the tip on not logging into my Apple ID.

- WhatsApp: [this thread](https://www.reddit.com/r/whatsapp/s/LqFNyi23cm) said that I should only select WhatsApp during the Move to iOS app process. I'm not exactly following this advice as I'm selecting both SMS and WhatsApp. I will let you know how that goes.

- WhatsApp: [this other thread](https://www.reddit.com/r/ios/comments/1l9d3ke/successfully_transferred_whatsapp_chats_from/) said you have to do it manually via exporting using the desktop app for WhatsApp, then uploading a zip to iCloud, then importing in the app. This is a last resort.

- WhatsApp: [this thread](https://www.reddit.com/r/ios/comments/1pb5z9t/successfully_transferred_my_whatsapp_chat_history/) said you need to use "spare iphone" as a bridge. 


