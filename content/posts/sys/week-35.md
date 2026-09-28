+++
title = "Week 35: Scrum"
date = "2026-08-24T16:00:00+02:00"
draft = false
description = "The Scrum framework: roles, events, artifacts, timeboxed sprints, Definition of Done and how Scrum supports iterative and incremental development."
summary = "The Scrum framework: roles, events, artifacts, timeboxed sprints, Definition of Done and how Scrum supports iterative and incremental development."
tags = ["SYS", "Scrum", "Agile", "Sprint", "Product Backlog"]
categories = ["System Development"]
series = ["System Development"]
series_order = 2
weight = 35
+++

This week was an introduction to **Scrum**, the framework we will use in our upcoming Scrum project. We also had a visit from **Rune Svendsgaard from Erhvervsstyrelsen** (the Danish Business Authority), who talked about his practical experience in *"From need to customer value using Scrum"*.

Preparation was the video *Introduction to Scrum*, the book *Scrum and XP from the Trenches* (parts 1–10), the Scrum Reference Card and the Crisp Scrum Checklist.

## What is Scrum?

Scrum is a lightweight **framework** for developing products in complex environments. It is not a complete method: it defines a small set of roles, events and artifacts, and leaves the rest (how you write code, test and so on) to the team.

Scrum is built on **empiricism**: decisions are based on what you observe, not on detailed up-front plans. Its three pillars are:

- **Transparency**: the work and progress are visible to everyone.
- **Inspection**: the product and the process are inspected frequently.
- **Adaptation**: the team changes course when the inspection shows it's needed.

## The Scrum Team: three accountabilities

| Role | Responsibility |
|---|---|
| **Product Owner** | Maximizes the value of the product. Owns and **prioritizes the Product Backlog** and decides *what* is built and in which order. |
| **Scrum Master** | Makes Scrum work. Coaches the team, removes impediments, protects the team from disruptions and facilitates the events. A *servant leader*, not a project manager. |
| **Developers** | Everyone who builds the increment. They decide *how* the work is done and *how much* they can take into a sprint. |

The team is **self-managing** and **cross-functional**: together they have all the skills needed to deliver a finished increment.

One of the preparation questions was whether the Scrum Master role would suit me in the exam project. It's an interesting role because it's about the team and the process rather than the code. You need to be good at noticing when something is blocking the team and willing to speak up about it.

## The events

Everything in Scrum happens in **sprints**: fixed-length, **timeboxed iterations** (typically 1–4 weeks). *Timeboxed* means the length is fixed. When time is up, the sprint ends, and you reduce scope rather than extend the deadline.

```text
┌──────────────────────────── Sprint (timebox) ────────────────────────────┐
│ Sprint Planning → Daily Scrum (every day) → Sprint Review → Retrospective │
└──────────────────────────────────────────────────────────────────────────┘
                        → next sprint starts immediately
```

- **Sprint Planning**: the team agrees on a **Sprint Goal**, selects items from the Product Backlog and plans how to deliver them.
- **Daily Scrum**: a 15-minute daily sync on progress towards the Sprint Goal: what's done, what's next, what's blocking.
- **Sprint Review**: the increment is **demonstrated** to the Product Owner and stakeholders. Feedback is used to adjust the Product Backlog.
- **Sprint Retrospective**: at the **end of every sprint**, after the review. The team inspects *how they worked* (collaboration, tools, process) and decides on concrete improvements for the next sprint.

## The artifacts

- **Product Backlog**: an ordered list of *everything* that might be needed in the product. It is owned by the Product Owner and constantly refined.
- **Sprint Backlog**: the items selected for the *current sprint*, plus the team's plan (tasks) for delivering them. It is owned by the Developers.
- **Increment**: the sum of all finished work. It must be usable, or **potentially shippable**.

**Product Backlog vs. Sprint Backlog:** the Product Backlog is the long-term list for the whole product. The Sprint Backlog is the short-term commitment for this sprint only.

### Definition of Done

The **Definition of Done (DoD)** is the team's shared, general criteria for when *any* piece of work counts as finished. For example: code is reviewed, tests pass, it's merged to main and deployed to the test environment. Work that doesn't meet the DoD is not part of the increment.

**Potentially shippable** means the increment is of such quality that it *could* be released to users. Whether it actually is released is a business decision.

## Iterative and incremental

Scrum combines two ideas:

- **Iterative**: we repeat the cycle (plan → build → review → improve) and refine the product each time.
- **Incremental**: each sprint *adds* a working piece of functionality on top of the previous ones.

The short cycles give **frequent feedback**. If we're building the wrong thing, we find out after one sprint instead of at the end of the project.

## From need to customer value

Rune Svendsgaard's talk added the practitioner's perspective. The central point was that Scrum is about delivering **value to the customer**, not about following the rituals. The Product Owner's job of understanding the real need, and the team's job of delivering small, usable pieces, matter more than doing every meeting "correctly".

## Key takeaways

- Scrum is a framework built on transparency, inspection and adaptation.
- Three roles: the PO decides *what*, the Developers decide *how*, and the Scrum Master makes the process work.
- Sprints are timeboxed. Scope is cut, not time.
- The Product Backlog is for the whole product, and the Sprint Backlog is this sprint's commitment.
- Work is only done when it meets the Definition of Done, and the increment should be potentially shippable.
