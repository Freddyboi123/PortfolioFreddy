+++
title = "Week 34: Introduction to System Development"
date = "2026-08-17T16:00:00+02:00"
draft = false
description = "The foundations of system development: the SDLC, Royce's 1970 paper on the waterfall model, and the Agile Manifesto."
summary = "The foundations of system development: the SDLC, Royce's 1970 paper on the waterfall model, and the Agile Manifesto."
tags = ["SYS", "SDLC", "Waterfall", "Agile", "Agile Manifesto"]
categories = ["System Development"]
series = ["System Development"]
series_order = 1
weight = 34
+++

This is the first post in my weekly log for **System Development** (SYS). The first session introduced the course, the semester plan, study points and the exam. It then went back to the foundations of system development, with texts that are old but still relevant.

**Learning goal:** to understand how system development methods and processes affect quality, both in the *product* and in the *process*.

## What is the SDLC?

The **Systems Development Life Cycle (SDLC)** describes the phases a system goes through from idea to operation. A typical version:

```text
Planning → Analysis (requirements) → Design → Implementation → Testing → Deployment → Maintenance
```

The phases are a way of naming the kinds of work that always need to happen. The key point is that they say nothing about **how** or **in which order** they are carried out. That is what the development *models* and *methods* decide:

- a **development model** (process model) describes how the phases are organized: in sequence, in cycles, or overlapping,
- a **method** is the concrete practices, roles and artifacts a team uses to follow a model, e.g. Scrum or XP.

## Royce (1970): *Managing the Development of Large Software Systems*

We read Winston W. Royce's paper from 1970, which is usually cited as the origin of the **waterfall model**:

```text
System requirements
   ↓
Software requirements
   ↓
Analysis
   ↓
Program design
   ↓
Coding
   ↓
Testing
   ↓
Operations
```

The interesting part is that **Royce doesn't recommend the pure waterfall**. He presents the sequential model and then writes that it is *"risky and invites failure"*. The problem is that testing happens at the very end, so design flaws are only found when they are most expensive to fix.

Royce proposes several improvements:

1. **Program design comes first**: design before analysis and coding are finished.
2. **Document the design**: a lot of documentation.
3. **Do it twice**: build a pilot version first and learn from it.
4. **Plan, control and monitor testing**.
5. **Involve the customer**, formally and repeatedly throughout the project.

Reading the original, it's almost ironic that the "waterfall" became a standard model. Royce already argued for **iteration, feedback and customer involvement**, the ideas that agile development builds on 30 years later.

## The Agile Manifesto (2001)

In 2001, a group of developers wrote the **[Agile Manifesto](https://agilemanifesto.org/)** as a reaction against heavy, documentation-driven processes:

> **Individuals and interactions** over processes and tools
> **Working software** over comprehensive documentation
> **Customer collaboration** over contract negotiation
> **Responding to change** over following a plan
>
> *That is, while there is value in the items on the right, we value the items on the left more.*

The last line is important. The manifesto doesn't say that plans and documentation are worthless, only that they are **less important** than the things on the left.

The manifesto is backed by **12 principles**. The ones I find most important:

- Deliver **working software frequently**, in weeks rather than months.
- **Welcome changing requirements**, even late in development.
- Business people and developers **work together daily**.
- **Working software is the primary measure of progress.**
- **Simplicity**, the art of maximizing the amount of work *not* done.
- The team **regularly reflects** on how to become more effective and adjusts.

We were asked whether we recognize the agile mindset from earlier projects in our studies. I do in some places, like short iterations and frequent feedback from teachers. But much of our earlier project work was closer to a mini-waterfall: plan everything, build everything, test at the end.

## Plan-driven vs. agile

| | Plan-driven (waterfall) | Agile |
|---|---|---|
| Requirements | Defined up front | Discovered and refined along the way |
| Delivery | One big delivery at the end | Small, frequent increments |
| Change | Expensive, avoided | Expected and welcomed |
| Customer | Involved at start and end | Involved continuously |
| Feedback on quality | Late (test phase) | Early and often |

Neither is "right" in every situation. Plan-driven models can make sense when the requirements are stable and well understood, or when regulation requires thorough documentation. Agile fits best when there is uncertainty, which describes most software projects.

## Key takeaways

- The SDLC names the work, and the model and method decide how it is organized.
- Royce's "waterfall" paper argues *against* the pure waterfall and for iteration and customer involvement.
- The Agile Manifesto values individuals, working software, collaboration and responding to change.
- The choice of process affects the quality of both the product and the process.
