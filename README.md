# Display Name Spoof Prevention
This script was inspired by a **sharp increase** in the rate of **Display-Name spoofing** that I've seen during the duration of my work in Email Security, Business-to-Business, enterprise, and even small-town IT.

It is designed to digest a name (_usually an executive or authority of sorts_) and spit out an email "**Header-From**" filter for that name. This generated filter will match all email _FROM:_ patters regardless of the reply-to email in the header.

**Please see the web-form directory for a much cleaner and efficient tool that can be deployed on a web server.**

## Usage
Usage of the script itself is pretty straight-forward:
```
USAGE: ./ceo_filter_gen.sh "CEO-Name" [OPTIONS]...
Generate a complex, general regular expression for a Display Name
  in the "From:" header of an email. This regex, by default, will
  match the name given, as well as typo-squatting variations of the
  name.
CEO-Name: The CEO-Name field should be from FIRST to LAST name.

OPTIONS:
   -e    Match all From headers EXCEPT those with the given emails.
          Multiple emails can be separated by a single comma.
   -c    Generate a SpamAssassin CUSTOM RULE that can be applied to
          an MTA using the service. This includes the Barracuda ESG.
          PLEASE NOTE: The use of this option requires the -e option,
          and the custom rule will scan both inbound and outbound, so
          any email address (including internal/aliases) used by the
          executive will need to be added with the -e option.
   -i    Generate a case-insensitive variant. This option is default
          when using the -c option.
```

## Examples

Here's a sample output from the script...
```
[zack@AMD64-arch ~]$ ./ceo_filter_gen.sh "John Y. Smith"
Regex successfully generated for name "John Y. Smith"!
Please enter this into the content filters section of an email security solution to scan for headers.

From:\s*"?\s*((J(\.|[Oo0]h?n(a[Tt7]han|a[Tt7]h[Oo0]n|ny|n[IiLl1]{0,2}[Ee3])?)?(\s+Y\.?)?\s+[Ss5]m[IiLl1]{0,2}[Tt7]h)|([Ss5]m[IiLl1]{0,2}[Tt7]h,?\s+J(\.|[Oo0]h?n(a[Tt7]han|a[Tt7]h[Oo0]n|ny|n[IiLl1]{0,2}[Ee3])?)?(\s+Y\.?)?))\s*"?\s+<

For confidence, test the Regex here: https://regoio.herokuapp.com/
PLEASE NOTE: THE TESTER ABOVE IS CASE-SENSITIVE!!!
```

The output will match any case too, in the event that the email filtering system you're using is case-sensitive. Also, notice the _typosquatting_ prevention mechanisms (catching **I** substituted by **L** or **1**, for example).

This generated regex will match the name "**John Y. Smith**" in the following header variations (and more):
```
From: "jon SmiTH <jsmith@legit.enterprise.net>" <fake@spammer.net>
From:    "  Sml7h, Johnath0n "   <notreally@yahoo.net>
From: J Y 5m1th <somefakeaddress@gmail.com>
From:"Smith, J" <other@fake.address>
```
The intent here is to be both flexible to prevent circumvention of the rule, but to also not be too greedy.

### The -e Flag
Also, if your email content filtering supports regex __look-ahead__ operators (Barracuda, for example, does **not** at this time), you can elect to use the "-e" option to provide an email address for matching exemption from this pattern using a _negative lookahead_.

Following the example above, we can say that the filter should match **ALL** "John Smith" senders **UNLESS** the reply-to address is "_jsmith@realdomain.net_":
```
[zack@AMD64-arch ~]$ ./ceo_filter_gen.sh "John Y. Smith" -e "jsmith@realdomain.net"
Regex successfully generated for name "John Y. Smith"!
Please enter this into the content filters section of an ESG/ESS for headers.

From:\s*"?\s*((J(\.|[Oo0]h?n(a[Tt7]han|a[Tt7]h[Oo0]n|ny|n[IiLl1]{0,2}[Ee3])?)?(\s+Y\.?)?\s+[Ss5]m[IiLl1]{0,2}[Tt7]h)|([Ss5]m[IiLl1]{0,2}[Tt7]h,?\s+J(\.|[Oo0]h?n(a[Tt7]han|a[Tt7]h[Oo0]n|ny|n[IiLl1]{0,2}[Ee3])?)?(\s+Y\.?)?))\s*"?\s+<(?!jsmith@realdomain\.net\>\s*$)
```
This is the ideal use of this script if your content filtering supports regex look-ahead.

### The -c Flag
The script also includes an option to output custom rules for _SpamAssassin_ as well, in case you are an email administrator that utilizes open-source software. This solution is also, luckily, Barracuda-ESG-compatible, but has to be added by their support team upon request. Just tell them to reference **Solution #00005971, STEP 8** and they can take care of the rest.

Again, this option builds upon the -e flag above but produces a different output:
```
[zack@AMD64-arch ~]$ ./ceo_filter_gen.sh "Zachary T. Puhl" -e"zpuhl@barracuda.com,zack.puhl@yahoo.com,zpuhl@yeethop.xyz" -c
Regex successfully generated for name "Zachary T. Puhl"!
Please edit the file [REDACTED] on the target Barracuda ESG, or alternatively the local.cf file on the MTA using SpamAssassin, and paste these lines at the bottom:

header __BSF_SP_EXEC_FROM From =~ /((Z(\.|ac([kh](([e3]|a)ry)?)?)?(\s+[t7]\.?)?\s+Puh[il1])|(Puh[il1],?\s+Z(\.|ac([kh](([e3]|a)ry)?)?)?(\s+[t7]\.?)?))/i
header __BSF_SP_EXEC_EXEMPT From:addr =~ /(zpuhl\@barracuda\.com|zack\.puhl\@yahoo\.com|zpuhl\@yeethop\.xyz)/i
meta BSF_SP_EXEC (__BSF_SP_EXEC_FROM && !__BSF_SP_EXEC_EXEMPT)
describe BSF_SP_EXEC Spoofed Executive
score BSF_SP_EXEC 10.00
```

_Note: The "BSF_SP_EXEC" in the custom rule stands for "Barracuda Spam Firewall -> Spoof Protection -> Executive" and is entirely my own naming convention, **not** affiliated with the Barracuda engineering/development annotation of custom rules. This name doesn't really matter and can be changed next to the meta keyword where it's defined._

### Important Note!
You should **always** ask for the CEO or executive's middle name (or at least initial) to make this more thorough! Entering a name into the script _without a middle name/initial_ will generate a regex that _will NOT match From headers with middle names/initials_!

---

# Auxiliary Information & Training

## What is Display-Name spoofing?
When spear-phishing attacks appear to come from an executive at a business, going to another business member with some sort of financial corporate account access, claiming to need a favor or demanding payment for a late invoice.

These emails are usually **very** brief, and the spammer starts the conversation with something like `hey, are you busy (sent from my iphone)`, and if the business member falls for it, **once they reply, the Mail Client on the their end usually TRUSTS the sender and stops showing the email address in the conversation!** This is a "feature" common to Outlook, I believe.

What that means is if the spammer gets the initial reply, they're in.

And on top of it, the question always becomes: why doesn't my spam filter catch this? Because **the message is brief and comes from a legitimate source** so if your spam filter or provider doesn't have the sender on any blacklist by direct email address... well.. _it's free real estate_.

---

## Prevention and Detection
Three words: **TRAIN. YOUR. USERS.** If they know James in accounting hates iPhones, why would his message to you requesting your attention say `sent from my iPhone`? **Teach your users to recognize these types of things** and you won't have a problem.

As a fix otherwise, _if your users hate the training_, use this method the script was designed for. Add the content filter to your spam filter. If it's a Barracuda, perfect; if it's not, find out if it supports Regular Expression pattern matching. **Most do.**

Punch a name into the script on your home Linux workstation, copy the regex, and drop it into the content filter page of your spam filter with the following criteria:
- MATCH: `headers`
- ACTION: `block`
- DIRECTION: `inbound only` <-- so we don't block the spoofed executive going outbound.

### A problem with the solution presented by this script
As you have probably already guessed, using these filters has a catch, **if you can't use any of the exemption options**.

Your CEO/executive/whatever won't be able to use his/her third-party email service to email people in your company anymore. In my opinion, this is an even trade to stop the spoofing and to cap the risk of losing $1k+ to a spear-phishing attack.

If you have a Barracuda, you're in luck. You can _use the SpamAssassin rule (on an ESG) through their support team, or alternatively use the regular generator and whitelist the executive's 3rd-party email_ so that everyone is happy, and all is well. Just monitor the whitelist (if used) and make sure it isn't abused by someone out there that might know it!

If you don't have a Barracuda, consult with your current product support and see if you have support for "look-ahead" operators with your content filtering, or if their product uses the SpamAssassin utility. Then you can use the "-e" or "-c" options as mentioned above.

---

## Why and How?
Well, it's free, it's easy, and it's convenient behind a VPN. You can rely on another organization to provide all the email security standards for you and you can just abuse their platform. Free `DMARC`, `DKIM`, `SPF`, `IP Reputation`, the list goes on.

Say I'm a _really_ clever black-hat out in the depths of sun-beaten Arizona, and I like to fill my free-time by scamming vulnerable business contacts out of gift-cards that I can later sell at 80% cash return. I'm looking for a new target today: **BigBiz in Nevada** looks good.

So I jump on my PC (connected to a sort of VPN of course to hide my identity), then do all the targeted research I can about this organization. _Their employee directory at BigBiz is nice and public._ This can take as long as I need, the longer the better because I get more info scraped from their site and about how their business is structured. And then I potentially strike a mother-lode by learning what the typical company invoice format is.

Now I go to **Gmail, Yahoo, Comcast, or some other free mail platform**, create an account with my fake identity, and **set my display name to the CEO/COO of BigBiz Inc**. Then I message Jenny the Sales Admin and tell her I'd really love to surprise the company for the second anniversary. I just need $600 in gift cards from the corporate account, with pics of the pins revealed sent to me ASAP. _But I'm in a meeting so don't come by the office._ -.-

Jenny isn't well-trained on guarding her inbox, so the rest is history.

`/story-time` I'm simplifying the process here but that's really all it takes. I've seen it one-too-many times.

---

## Dangers of Open-Source
Some may be concerned by me releasing the regular expressions some admins might use to filter display names.

To quell those fears, I should note that this project is intended to _inspire_ other formulas, solutions, and knowledge of email content filters to improve an administrator's role in **protecting their users**, as their job title states.

By writing this project up in a few days (both as a brainstorm and to automate a frequent task), I am trying to demonstrate to others that a solution to these common problems can be easily drafted with a little effort. If a spammer **finds a way around filters generated by my tool**, please let me know and I'll try to fix it! But also, be proactive and learn to fix it as well, in case you must in the future and my tool becomes unavailable.

As an additional self-righteous side-note, this form of protection that the tool creates provides an umbrella for even those with the lowest product models and features, who may be garroted by an efficient spear-phishing campaign.

---

## TO-DO
Things to still check off the list for this project will be listed here, as well as any bugs to fix.

+ [X] **Expand** the predefined list of names that have variations (_like Zack, Joe, & Mary_).
+ [X] Improve **string scanning** for the built regex to lessen the impact of _potential script errors_.
+ [X] Finish this README document.
+ [X] Build a JavaScript-based web form to do all of this with a clean GUI.
+ [ ] Add support for **unicode** typosquatting, or at least an expanded ASCII version.
+ [ ] Add a checkbox/"select" for name prefixes (Mr/Ms/Mrs/Dr/etc).
+ [ ] Add some kind of slider or Radio button that will adjust the generality of the generated regex.
