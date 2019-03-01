# Display Name Spoof Prevention
This script was inspired by a **sharp increase** in the rate of **Display-Name spoofing** that I've seen during the duration of my work in Email Security, Business-to-Business, enterprise, and even small-town IT.

It is designed to digest a name (_usually an executive or authority of sorts_) and spit out an email "**Header-From**" filter for that name. This generated filter will match all email _FROM:_ patters regardless of the reply-to email in the header.

Here's a sample output from the script...
```
From:\s*"?\s*((J(\.|[o0]h?n(a[t7]han|a[t7]h[o0]n)?)?\s+(Y\.?)?\s+[s5]m[il1]{0,2}[t7]h)|([s5]m[il1]{0,2}[t7]h,?\s+J(\.|[o0]h?n(a[t7]han|a[t7]h[o0]n)?)?\s+(Y\.?)?))\s*"?\s+<
```

Seriously. It will match the name "**John Y. Smith**" in the following header variations:
```
From: "Jon Smith <jsmith@legit.enterprise.net>" <fake@spammer.net>
From:    "  Smith, Johnathon "   <fake@spammer.net>
From: J Y Smith <fake@spammer.net>
From:"Smith, J" <fake@spammer.net>
```
You get the point...

_Please note: I've recently updated the custom John rule to include Johnny/Jonny._

## What is Display-Name spoofing?

## Why?

## Prevention and Detection

## Dangers of Open-Source
Some may be concerned by me releasing the regular expressions some admins might use to filter display names.

To quell those fears, I should note that this project is intended to _inspire_ other formulas, solutions, and knowledge of email content filters to improve an administrator's role in **protecting their users**, as their job title states.

By writing this project up in a few days (both as a brainstorm and to automate a frequent task), I am trying to demonstrate to others that a solution to these common problems can be easily drafted with a little effort.

---

## TO-Do
Things to still check off the list for this project will be listed here, as well as any bugs to fix.

[ ] **Expand** the predefined list of names that have variations _(like Zack, Joe, & Mary)_.
[ ] Improve **string scanning** for the built regex to lessen the impact of _potential script errors_.
[ ] Finish this README document.
