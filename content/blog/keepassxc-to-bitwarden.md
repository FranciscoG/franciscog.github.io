---
title: KeepassXC to Bitwarden
date: 2025-12-16
tags:
  - guide
  - keepassxc
  - bitwarden
---

I recently transferred from KeepassXC to BitWarden and wanted to write down my notes just in case someone else is thinking of doing the same thing.

## TL;DR

For best compatibility:

- Export as XML
- Import as "KeePass 2 (xml)"

Easy as that! 

Everything _except_ attachments will get imported.

If you had entries with OTP/TOTP codes, they will automatically transfer but you'll need to upgrade to [Bitwarden Premium](https://bitwarden.com/pricing/) ($10/yr, very affordable) in order to be able to use them.

I can only confirm this worked with KeePassXC 2.7.11 on MacOS. 

## Concerns

Before making this transition, my 2 main concerns were:

- Will I be able to import my OTP settings
- And will my "Additional Attributes" fields get imported

## Which KeePass format should you import with?

When looking through the [many types of password databases that Bitwarden's import supports](https://bitwarden.com/help/import-faqs/#q-what-file-formats-does-bitwarden-support-for-import/), you'll notice that it lists both:

- KeePass 2 (xml)
- KeePassX (csv)

Seeing these options, you might assume that "KeePassX (csv)" is the right choice because [KeePassXC is a fork of KeePassX](https://keepassxc.org/docs/#faq-keepassx). 

While KeePassXC does have an export to CSV option, and you _can_ import into BitWarden with it, there are 2 caveats to using it: 

1. Once you export as CSV from KeepassXC you'll have to open up the file and change the name of some of the column headers, this is especially needed for OTP codes to get transferred
2. None of your "Additional Attributes" will get imported

At this point I was worried that I was going to have to do a lot of manual work to copy over those additional attributes...

Until I found [this post in the bitwarden community forums](https://community.bitwarden.com/t/keepassxc-info-missing-from-csv-import-html-into-bitwarden/44838) that clued me in on using the XML export and importing as "KeePass 2 (xml)" instead. 

And it worked perfectly! 

It was literally just a few clicks and I was done. My OTP codes were there and my "Additional Attributes" became "Custom fields".

It makes sense that this works because [KeePassX uses the KeePass 2 (.kdbx) password database format ](https://www.keepassx.org/index.html%3Fp=31.html), which KeepassXC inherited when they forked it. 

## No attachments 

The one thing that didn't get transferred over were attachments. But this was expected since exporting to CSV/XML doesn't obviously include attachments, otherwise it might have created a zip instead. This is the one thing you'll need to handle manually.

## Final thoughts

One of the things I loved about using KeePassXC was that it was a completely offline database. There were no central servers hosting a copy of my database in the cloud. I didn't have to worry about some KeePassXC employee getting hacked and gaining access to my database. I used [Syncthing](https://syncthing.net/) to sync my db across devices using local network discovery only. 

With Bitwarden I'm putting a lot of trust into the security of the company and their employees.

The other thing I really liked about KeePassXC was its auto-type feature. I didn't use the [KeePassXC browser extension](https://keepassxc.org/docs/#faq-browser) and instead relied heavily on its auto-type functionality that allowed the app to act as if it was typing for you. It worked on any input field in any app. All you had to do was focus into the field and then perform the auto-type from the KeePassXC entry.

Since Bitwarden doesn't offer this, I'm forced to use their extension.

And finally, by default KeePassXC clears your clipboard after 10 seconds. Bitwarden has the same ability but has it disabled by default, which I think is a mistake. So make sure to enable individually in every Bitwarden app or extension you've logged into because these settings don't sync.


