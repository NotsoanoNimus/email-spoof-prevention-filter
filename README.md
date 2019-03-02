# Display Name Spoof Prevention
This script was inspired by a **sharp increase** in the rate of **Display-Name spoofing** that I've seen during the duration of my work in Email Security, Business-to-Business, enterprise, and even small-town IT.

It is designed to digest a name (_usually an executive or authority of sorts_) and spit out an email "**Header-From**" filter for that name. This generated filter will match all email _FROM:_ patters regardless of the reply-to email in the header.

Here's a sample output from the script...
```
[zack@AMD64-arch ~]$ ./ceo_filter_gen.sh "John Y. Smith" -c
Regex successfully generated for name "John Y. Smith"!
Please enter this into the content filters section of an ESG/ESS for headers.

From:\s*"?\s*((J(\.|[Oo0]h?n(a[Tt7]han|a[Tt7]h[Oo0]n|ny|n[IiLl1]{0,2}[Ee3])?)?(\s+Y\.?)?\s+[Ss5]m[IiLl1]{0,2}[Tt7]h)|([Ss5]m[IiLl1]{0,2}[Tt7]h,?\s+J(\.|[Oo0]h?n(a[Tt7]han|a[Tt7]h[Oo0]n|ny|n[IiLl1]{0,2}[Ee3])?)?(\s+Y\.?)?))\s*"?\s+<

For confidence, test the Regex here: https://regoio.herokuapp.com/
PLEASE NOTE: THE TESTER ABOVE IS CASE-SENSITIVE!!!
```

Seriously. That output will match any case too, in the event that the email filtering system you're using does case-sensitive filtering.

It will match the name "**John Y. Smith**" in the following header variations:
```
From: "jon SmiTH <jsmith@legit.enterprise.net>" <fake@spammer.net>
From:    "  Sml7h, Johnathon "   <notreally@yahoo.net>
From: J Y 5m1th <somefakeaddress@gmail.com>
From:"Smith, J" <other@fake.address>
```
You get the point...

_Please note: I've recently updated the custom John rule to include Johnny/Jonny._

---

## What is Display-Name spoofing?
When spear-phishing attacks appear to come from an executive at a business, going to another business member with some sort of financial account access, claiming to need a favor or demanding payment for a late invoice.

These emails are usually **very** brief, and the spammer starts the conversation with something like `hey, are you busy (sent from my iphone)`, and if the business member falls for it, **once they reply, the Mail Client on their end usually TRUSTS the sender and stops showing the email address in the conversation typically!**

What that means is if the spammer gets the initial reply, they're in.

And on top of it, the question always becomes: why doesn't my spam filter catch this? Because **the message is brief and comes from a legitimate source** so if your spam filter or provider doesn't have the sender on any blacklist by email address alone... well.. _it's free real estate_.

---

## Prevention and Detection
Three words: **TRAIN. YOUR. USERS.** If they know James in accounting hates iPhones, why would his message to you requesting your attention say `sent from my iPhone`? **Teach your users to recognize this** and you won't have a problem.

As a fix otherwise, _if your users hate the training_, use this method the script was designed for. Add the content filter to your spam filter. If it's a Barracuda, perfect; if it's not, find out if it supports Regular Expression pattern matching. **Most absolutely do.**

Punch a name into the script on your home Linux workstation, copy the regex, and drop it into the content filter page of your spam filter with the following criteria:
- MATCH: `headers`
- ACTION: `block`
- DIRECTION: `inbound only` <-- so we don't block the spoofed exec going outbound.

#### A problem with the solution presented by this script
As you have probably already guessed, using these filters has a trade-off.

**Your CEO/executive/whatever won't be able to use his/her third-party email service to email people in your company anymore.** In my opinion, this is an even trade to stop the spoofing and to cap the risk of losing $1k+ to a spoofer.

If you have a Barracuda, you're in luck. You can whitelist the executive's 3rd-party email so that everyone is happy, and all is well. Just monitor the whitelist and make sure it isn't abused by someone out there that might know it!

---

## Why and How?
Well, it's free, it's easy, and it's convenient behind a VPN. You can rely on another organization to provide all the email security standards for you and you can just abuse their platform. Free `DMARC`, `DKIM`, `SPF`, `IP Reputation`, the list goes on.

Say I'm a _really_ clever black-hat out in the depths of sun-beaten Arizona, and I like to fill my free-time by scamming vulnerable business contacts out of gift-cards that I can later sell at 80% cash return. I'm looking for a new target today: **BigBiz in Nevada** looks good.

So I jump on my PC (connected to a sort of VPN of course to hide my identity), then do all the targeted research I can about this organization. This can take as long as I need, the longer the better because I get more info scraped from their site and about how their business is structured. And then I strike a mother-lode by learning what the typical company invoice format is.

Now I go to **Gmail, Yahoo, Comcast, or some other free mail platform**, create an account with my fake identity, and **set my display name to the CEO/COO of BigBiz Inc**. Then I message Jenny the Sales Admin and tell her I'd really love to surprise the company for the second anniversary. I just need $600 in gift cards from the corporate account.

Jenny isn't well-trained on guarding her inbox, so the rest is history.

`/Story-time` I'm simplifying the process here but that's really all it takes. I've seen it one-too-many times.

---

## Dangers of Open-Source
Some may be concerned by me releasing the regular expressions some admins might use to filter display names.

To quell those fears, I should note that this project is intended to _inspire_ other formulas, solutions, and knowledge of email content filters to improve an administrator's role in **protecting their users**, as their job title states.

By writing this project up in a few days (both as a brainstorm and to automate a frequent task), I am trying to demonstrate to others that a solution to these common problems can be easily drafted with a little effort.

---

## TO-DO
Things to still check off the list for this project will be listed here, as well as any bugs to fix.

+ [ ] **Expand** the predefined list of names that have variations (_like Zack, Joe, & Mary_).
+ [ ] Improve **string scanning** for the built regex to lessen the impact of _potential script errors_.
+ [X] Finish this README document.
