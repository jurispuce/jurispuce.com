---
title: "Next-Gen Security Audits: How to Stop Dying Inside During Documentation Reviews"
date: 2025-03-31T10:36:56+03:00
draft: false
description: "Discover how AI-powered audit automation can transform security documentation reviews from painful exercises to valuable insights."
featured: true
upcoming: false
eventDate: 2025-03-31T10:36:56+03:00
thumbnail: "/images/blog/SCR-20250331-jmxj.png"
externalLink: ""
videoEmbed: ""
ctaButton: true
ctaText: "Connect on LinkedIn"
ctaLink: "https://linkedin.com/in/jurispuce"
tags: ["security", "audits", "automation", "AI"]
categories: ["security"]
---

## The Audit Automation Revolution (Or: How I Learned to Sleep Again)

Ever tried explaining to non-technical executives why their "industry-leading security posture" actually resembles a scarecrow with missing limbs? That was me a month ago, watching faces fall as I revealed their documentation had more holes than my attempts at knitting (current hole-to-scarf ratio: approximately 3:1).

Unfortunately, in this article, I won't be sharing code samples of what I've done. Instead, I'll refer to some of the data models I've been using, and you can figure it out yourself or connect with me on LinkedIn. If you're interested, I'd be happy to share more information. Read on or … whatever! ;)

## The Real Problem

The problem wasn't their security - it was their approach to security documentation in general. Instead of just fulfilling an external requirement, they made themselves vulnerable. For every security requirement coming from outside, they were actually creating five more internally which they never turned out to fulfill with their technical controls.

![The "scrambled" UI to manage requirements and knowledge](/images/blog/SCR-20250331-jmxj.png)

Meanwhile, this has been a crazy weekend expanding on what I'd been developing secretly for last few months what I dramatically call "The Trilogy of Not Losing Your Mind During Audits": context embedding, Stage 1 verification, and Stage 2 validation.

## Context Embedding: The Digital Sherlock Holmes Phase

Traditional audit preparation looks like me trying to assemble flatpack furniture after losing the instructions - chaotic, frustrating, and likely to end in tears.

Context embedding with AI transforms this experience entirely.

Here's how it works in real life:

1. **Requirement Relationship Mapping**: AI analyzes frameworks to identify connections between requirements faster than my border collie spots tennis balls in tall grass. Requirements that seem different often overlap like my neighbor's tree branches in my garden - technically separate but practically inseparable.

2. **Documentation Relationship Analysis**: Instead of manually reading through policy documents (an activity I rank just above getting a root canal), AI creates a semantic map showing how documents reference each other. During one audit, we discovered a client's incident response procedure referenced a non-existent escalation matrix, which referenced an outdated contact list, which referenced… you get the idea. It was the security documentation equivalent of those infinite mirror reflections.

3. **Internal Requirement Extraction**: The hidden gem! AI identifies statements like "The organization shall review access quarterly" buried in policies. These self-imposed requirements are the organizational equivalent of drunk online shopping - commitments made enthusiastically that nobody remembers the next morning.

However, there is a big but in this part. The but part is that doing this manually by using AI tools or just using a standard n8n worklow type of automation will not really work. What you would need to do, you would need to create graph database with quite complex relationship models.

I once extracted 53 internal requirements from a client's documentation. Their CISO made the same face my cat does when I accidentally step on her tail - shock, betrayal, and the dawning realization that somebody's going to pay for this because it turns out "once you say you do it, you actually have to do it".

## Stage 1: The Great Documentation Alignment

Stage 1 uses AI to answer the eternal question: "Do we actually have policies and procedures that match our claims, or are we just making things up like my excuses for not going to the gym?"

The AI automation process:

1. **Classification**: Determines if requirements need documentation verification - because some things actually don't. I once spent three hours looking for a client's "data destruction procedure" before realizing they were a cloud-only company that never handled physical media. That's three hours of my life I'll never get back, much like the time I spent learning to play the recorder in primary school.

2. **Document Search & Match**: AI searches repositories to identify relevant documents faster than I can find my car keys (which, admittedly, is a low bar). One client swore they had "robust encryption standards" until our AI found their so-called standards consisted of a single sentence: "Use encryption when necessary." Helpful as a chocolate teapot, that one.

3. **Gap Analysis**: Identifies missing documentation with brutal efficiency. The AI doesn't sugarcoat findings like humans do. It won't say "opportunity for improvement" - it just flatly states "completely missing," much like my filter when I'm on my third coffee of the day.

I witnessed a security director visibly age during a presentation of Stage 1 results. "But we passed our last audit!" he protested. Yes, and I once convinced my niece I could make coins appear from behind her ear - some illusions are easy to maintain until someone looks closer.

**DISCLOSURE**: Remember, in the beginning of this paragraph, I said "fast". The honest answer: "normal document package takes around 4 hours or so to do full analysis of it."

## Stage 2: Show Me The Evidence (Or: Prove It!)

If Stage 1 is about finding what you claim to do, Stage 2 is proving you actually do it - the difference between my New Year's resolution to learn Spanish and the reality that I still can't order anything beyond "cerveza, por favor."

AI transforms this stage from a scavenger hunt into a precision operation:

![Limited representation of just a few questions to verify specific short set of requirements in Neo4J](/images/blog/SCR-20250331-jndd.png)<br>
<p align="center">
Limited representation of just a few questions to verify specific short set of requirements in Neo4J
</p>

1. **Custom Evidence Questions**: AI generates tailored validation questions based on documentation found in Stage 1 and those sneaky internal requirements. Instead of generic "Do you review access?" questions, it asks "Please provide the last three quarterly access reviews from March, June, and September as specified in Policy SEC-035, section 4.2." Try wriggling out of that one!

2. **Evidence Validation**: AI pre-analyzes submitted evidence to check if it actually satisfies requirements or is just adjacent to them - like my attempt to count gardening as exercise. (It's not, apparently, no matter how many times I argue about digging being a core workout.)

3. **Continuous Compliance Tracking**: Identifies ongoing obligations and creates schedules to verify them throughout the year, not just during panic-driven audit season. This is the difference between my daily flossing (theoretical) and my week-before-dentist-appointment flossing marathon (actual).

During one audit, our AI identified that a client had committed to monthly security testing in their customer-facing documentation. Their actual testing schedule? "Whenever Gary remembers," which turned out to be roughly once every leap year. The gap between claimed and actual practices was wide enough to park a cruise ship sideways.

## The Life-Changing Magic of Automated Audits

Automated audits using AI aren't just faster - they're fundamentally different. Like comparing my attempt at cutting my own hair during lockdown to an actual professional haircut. Same general concept, wildly different results.

Internally it means for internal audit preparation time now I can reduce from six weeks to three days for a 100+ people organization. In another case we had customer discovering their actual security posture was stronger than their documentation suggested - they were doing the right things but not writing them down, like my grandmother's cooking recipes that existed entirely in her head. And don't mention the verbal storm I had to sit through then listening how "stupid all the EU regulations are and why we don't need them" while actually they were doing MORE…

The most satisfying moment? Watching a use case for the system to identify 27 areas where a customer could simplify policies without reducing security effectiveness. Their documentation diet was so successful that their security handbook went from "War and Peace" dimensions to something people might actually read without developing carpal tunnel syndrome.

## Embrace The Future (It's Less Painful Than You Think)

If you're still doing manual audits, you're the security equivalent of someone still using a Nokia 3310 in the age of smartphones. It works, technically, but you're missing out on a whole new world of capabilities and a lot more free time.

Next-generation audits with AI context embedding and two-stage verification don't just make audits bearable - they make them valuable. And they'll save you from the embarrassment of claiming complete compliance only to discover you have the security documentation equivalent of swiss cheese.

And isn't avoiding embarrassment what security is really all about? Well, that and protecting critical assets. But mostly avoiding embarrassment in front of executives. Trust me, I speak from experience.

P.S. If your security documentation is perfect and requires no improvements, congratulations! You're either lying to yourself or you're from an alternate dimension where documentation writes itself. Either way, I'd like to hear your secrets.


## The Spreadsheet Therapy: Turning Chaos into Columns and Rows 📊

Let me conclude with a practical approach that I like to call "Spreadsheet Therapy" - because nothing says "I'm taking control of my life" quite like organizing chaos into neat little cells. Much like how I attempted to organize my dating history once, only to discover patterns I was happier not knowing.

### The Great Google Sheet Intervention

Here's a revolutionary idea that has saved more incident management processes than caffeine has saved Monday mornings: Create a dedicated Google Sheet for each of our CPR components. That's right - one sheet each for those C(x), P(x), and R(x) items we've dissected more thoroughly than my neighbor dissects my gardening techniques.

**Step 1: Document the Current Reality**  
First, create a column brutally titled "Current State." This is where you'll document the existing reality of your incident management process. Be honest here - more honest than I was when describing my DIY skills on my dating profile, which resulted in me attempting to install a ceiling fan for a woman who is now, unsurprisingly, my ex.

For example, under C3 (Timeliness of Discovery), your current state might read: "We typically discover incidents approximately three weeks after they occur, usually when a customer calls to ask why their data is for sale on the dark web." Brutal honesty, people. It's like taking off Spanx at the end of the day - uncomfortable but necessary.

**Step 2: Dream the Impossible Dream**  
Next, create a column optimistically labeled "Expected State." This is where you'll define your target state - what good looks like if everything went according to plan. Which, in my experience, happens approximately as often as my cat voluntarily takes a bath.

For P2 (Response Timelines), your expected state might be: "Critical incidents contained within 30 minutes of detection, with executive notification within 15 minutes." Not "whenever Dave remembers to check his email" or "after the third missed call from the CEO."

**Step 3: Mind the Gap**  
Now create the column that will keep you awake at night: "Gap Analysis." This is where you compare your fantasy with your reality - a process I personally avoid in most areas of my life, but which is strangely therapeutic in incident management.

For R4 (Lessons Learned Integration), your gap might be: "Currently, lessons learned are documented but never implemented, much like my annual resolution to reduce my cheese consumption."

**Step 4: Actions That Actually Happen**  
Finally, create an "Action Items" column with clear owners and deadlines. Because a plan without accountability is just a wish, much like my "someday I'll organize the garage" declaration that's been ongoing since 2017.

For each gap, define specific, measurable actions. For example, under P4 (Communication and Coordination), your action might be: "By June 30th, Sarah will implement a dedicated Slack channel for incident communication with automated alerts, replacing our current system of panicked hallway conversations and misinterpreted hand gestures."

### Why This Actually Works

This approach works because it transforms the abstract into the concrete. It's like how I finally started flossing regularly after my dentist showed me pictures of my gums compared to "ideal" gums. Some things you cannot unsee.

The beauty of this spreadsheet method is that it creates visibility into progress (or lack thereof). Those color-coded status updates provide the same dopamine hit as checking off items on a to-do list, which, let's be honest, is why I sometimes add items I've already completed just for the satisfaction of crossing them off.

And unlike my attempts at maintaining a consistent exercise routine, with this approach, you can actually see improvement over time. Those red cells gradually turn amber, then green, providing tangible evidence that you're not, in fact, trapped in an infinite loop of incident response failures.

I implemented this exact approach at my last organization, and we managed to reduce our average incident detection time from "embarrassingly long" to "still concerning but notably better." We celebrated this achievement with cake, which seemed counterproductive to my personal health metrics but wonderful for team morale.

Remember, the goal isn't perfection – it's progress. As my grandmother wisely told me after I explained my ambitious home renovation plans: "Darling, you can't fix everything at once. Start with the room that's most likely to kill you, and work your way down from there." Incident management wisdom comes in many forms, often from unexpected sources.

Now if you'll excuse me, I need to update my personal gap analysis spreadsheet, where "Current State: Writing humorous articles about incident management" will hopefully soon progress to "Expected State: Writing humorous articles about incident management while properly watering my house plants." We all have our mountains to climb.
