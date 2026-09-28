+++
title = "Week 36: Requirements Specification"
date = "2026-08-31T16:00:00+02:00"
draft = false
description = "Functional and non-functional requirements, user stories and INVEST, acceptance criteria, Planning Poker, story points vs. T-shirt sizes, MoSCoW and the Definition of Done."
summary = "Functional and non-functional requirements, user stories and INVEST, acceptance criteria, Planning Poker, story points vs. T-shirt sizes, MoSCoW and the Definition of Done."
tags = ["SYS", "Requirements", "User stories", "INVEST", "Planning Poker", "MoSCoW", "FURPS"]
categories = ["System Development"]
series = ["System Development"]
series_order = 3
weight = 36
+++

This week was about **requirements**: how we describe what a system should do, how we know when a requirement is met, and how we estimate and prioritize the work. It was preparation for the Scrum project starting next week.

## Functional and non-functional requirements

- **Functional requirements** describe *what* the system should do: its features and behaviour. *"A user can reset their password by email."*
- **Non-functional requirements** describe *how well* the system should do it: qualities and constraints. *"Pages load in under 2 seconds."*, *"The system supports 500 concurrent users."*

**FURPS** is a useful checklist for finding requirements of both kinds:

| Letter | Category | Example |
|---|---|---|
| **F** | Functionality | Features, capabilities, security |
| **U** | Usability | Ease of use, accessibility, documentation |
| **R** | Reliability | Availability, error rate, recoverability |
| **P** | Performance | Response time, throughput, resource use |
| **S** | Supportability | Maintainability, testability, configurability |

(FURPS+ adds constraints such as design, implementation, interface and physical requirements.)

Non-functional requirements are easy to forget because they rarely appear as a single feature, but they often decide whether the system is actually usable.

## User stories

A **user story** describes a requirement from the user's perspective:

```text
As a <type of user>,
I want <some goal>,
so that <some reason / value>.
```

For example: *"As a customer, I want to see my order history, so that I can reorder products I've bought before."*

A user story is not a full specification. Mike Cohn calls it a *promise of a conversation*: the story is a placeholder, and the details are clarified in dialogue with the Product Owner.

### INVEST: criteria for a good user story

| | Criterion | Meaning |
|---|---|---|
| **I** | Independent | Can be developed without depending on other stories. |
| **N** | Negotiable | Not a fixed contract. The details are open for discussion. |
| **V** | Valuable | Delivers value to a user or customer. |
| **E** | Estimable | The team understands it well enough to estimate it. |
| **S** | Small | Fits within a sprint. |
| **T** | Testable | It's clear how to verify that it's done. |

### Story splitting

Stories that are too big (*epics*) must be split. The key is to split **vertically**, so each piece still delivers value through all layers of the system. Horizontal splits like "the database part" and "the UI part" don't deliver value on their own. Common ways to split are by workflow step, by business rule, by data variation, or by doing the simple case first and the complex case later.

## Acceptance criteria

**Acceptance criteria** (Cohn calls them *conditions of satisfaction*) are the concrete conditions a specific story must meet to be accepted. They clarify and limit the requirement:

```text
Story: As a customer, I want to reset my password so that I can log in if I forget it.

Acceptance criteria:
- Given a registered email, a reset link is sent to that email.
- The reset link expires after 24 hours.
- An unknown email shows the same neutral message (no user enumeration).
- The new password must meet the password policy.
```

The Given/When/Then format is also common. Good acceptance criteria can be turned directly into test cases, which becomes important in week 40.

### Acceptance criteria vs. Definition of Done

- **Acceptance criteria** are *specific* to one story. They describe what this feature must do.
- The **Definition of Done** is *general* and applies to *all* stories. It describes the quality standard for any finished work (reviewed, tested, merged, documented …).

A story is only done when it meets **both** its own acceptance criteria and the team's DoD.

## Estimation

### Absolute vs. relative estimation

- **Absolute** estimation: *"this will take 6 hours"*. People are bad at this, especially for work they haven't done before.
- **Relative** estimation: *"this is about twice as big as that"*. People are much better at comparing.

Agile teams therefore usually estimate **relatively**:

- **Story points**: an abstract number for size, covering effort, complexity and uncertainty. Often a modified Fibonacci scale (1, 2, 3, 5, 8, 13, 20 …). The growing gaps reflect that uncertainty grows with size.
- **T-shirt sizes** (XS, S, M, L, XL): coarser and faster. Good for early, rough estimation of a large backlog.

Hours are still used in some teams, typically for breaking a story down into tasks during sprint planning.

### Planning Poker

**Planning Poker** is a consensus technique for estimating:

1. The PO reads a story and answers questions.
2. Each developer privately picks a card with their estimate.
3. Everyone reveals their card **at the same time**, so nobody anchors on anyone else.
4. The highest and lowest estimates explain their reasoning.
5. Repeat until the estimates converge.

The discussion is often more valuable than the number. A big spread usually means people have *understood the story differently*.

## Prioritization with MoSCoW

Not everything can be built at once, so requirements must be **prioritized**. **MoSCoW** sorts them into four groups:

- **M**ust have: the product doesn't work or has no value without it.
- **S**hould have: important, but the product still works without it.
- **C**ould have: nice to have if there's time.
- **W**on't have (this time): explicitly out of scope for now.

The "Won't have" group is useful because it makes the scope explicit and manages expectations.

## Putting it together

These tools together drive agile planning:

```text
Requirements → User stories (INVEST) → Acceptance criteria
     → Estimation (story points) → Prioritization (MoSCoW / PO)
         → Sprint Planning → Build → Done (acceptance criteria + DoD)
```

## Key takeaways

- Functional requirements describe *what*, non-functional requirements describe *how well*, and FURPS helps you find both.
- A good user story follows INVEST and is split vertically.
- Acceptance criteria are specific to a story, while the DoD applies to everything.
- Estimate relatively (story points or T-shirt sizes) and use Planning Poker to surface different interpretations.
- MoSCoW makes priorities and scope explicit.
