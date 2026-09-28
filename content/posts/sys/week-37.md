+++
title = "Week 37: Scrum Project Kickoff"
date = "2026-09-07T16:00:00+02:00"
draft = false
description = "Kickoff of our Scrum project with Alpha Solutions: shared understanding, the first Product Backlog, Definition of Done, GitHub setup and the Sprint Zero debate."
summary = "Kickoff of our Scrum project with Alpha Solutions: shared understanding, the first Product Backlog, Definition of Done, GitHub setup and the Sprint Zero debate."
tags = ["SYS", "Scrum", "Project", "Sprint Zero", "GitHub Projects", "Definition of Done"]
categories = ["System Development"]
series = ["System Development"]
series_order = 4
weight = 37
+++

This week the **Scrum project** started with a kickoff from **Alpha Solutions**. After the kickoff we worked in our teams to establish the foundation for the project, and at the end of the day we met the **Product Owner** for the first short planning meeting.

## Setting up the project

The kickoff gave us the project brief. Then each team had to establish:

1. **A shared understanding** of the product's purpose, target audience and scope.
2. **Roles** in the team: who is Scrum Master, and how do we share responsibility?
3. **A first Product Backlog** with prioritized user stories.
4. **Acceptance criteria** for the first user stories.
5. **Estimates** in story points.
6. **A GitHub repository** for the code.
7. **A GitHub Project** as our Scrum board and backlog.
8. **A shared Definition of Done.**
9. **A short coding standard and a working agreement** covering how we write code and how we work together.

It's a long list for one day, but each item uses something from the previous weeks: user stories and acceptance criteria (week 36), estimation and prioritization (week 36), roles and artifacts (week 35).

### Definition of Done

Our DoD is the team's shared quality bar. A typical DoD for a project like this contains items such as:

```text
- Code is on a feature branch and merged to main via a pull request
- At least one other team member has reviewed the pull request
- Acceptance criteria are met
- Relevant tests are written and pass
- No known critical bugs
- The feature works in the shared environment / can be demoed
```

### Working agreement and coding standard

The **working agreement** covers how we collaborate: when we meet, how we communicate, how quickly we respond, and what we do when someone is stuck. The **coding standard** covers naming, formatting, folder structure and branch naming. Both are about *removing friction*. Settling these things once up front means we don't have to argue about them in every pull request.

### GitHub Projects as the Scrum board

We set up a **GitHub Project** linked to our repository. Issues become user stories and tasks, and the board shows columns such as *Backlog → Sprint Backlog → In progress → In review → Done*. Custom fields for story points, priority and sprint make it possible to create views of the current sprint, the full backlog and so on.

## Meeting the PO: the first Sprint Goal

At the end of the day each team had a 15-minute planning meeting with the PO. We had to come prepared with a **proposal**, and together we decided on the **Sprint Goal** for the first sprint.

The point was that we should have *real user stories* to work on during the first week, alongside the project setup, so that the first sprint delivers something that works.

## Sprint Zero, or not?

The preparation reading was about the **Sprint Zero** debate:

- **For Sprint Zero:** a project needs setup before it can deliver value, such as repositories, environments, architecture and a backlog. Calling that "Sprint Zero" makes the setup explicit.
- **Against Sprint Zero** (the Scrum.org view): Scrum has no Sprint Zero. *Every* sprint should deliver a usable increment. A sprint of only setup and planning easily turns into a mini-waterfall and delays feedback. The setup work should instead be done **alongside** delivering a small piece of real functionality.

The course followed the second approach: set up the project *and* pick a few user stories for the first sprint. I think this is the better approach, because building a small real feature is what shows whether the setup actually works.

## Key takeaways

- A project starts with a shared understanding of purpose, audience and scope.
- The first backlog, acceptance criteria, estimates and DoD put the theory from weeks 35–36 into practice.
- A working agreement and coding standard remove friction before it becomes conflict.
- Avoid a pure "Sprint Zero": do the setup *while* delivering a first small increment.
