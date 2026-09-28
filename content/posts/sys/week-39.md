+++
title = "Week 39: Reflecting on Our Scrum Practice"
date = "2026-09-21T16:00:00+02:00"
draft = false
description = "Second Sprint Review and Planning, and a deeper look at how we work: retrospectives, velocity, the Scrum board, backlogs, pull requests, acceptance criteria and sprint goals."
summary = "Second Sprint Review and Planning, and a deeper look at how we work: retrospectives, velocity, the Scrum board, backlogs, pull requests, acceptance criteria and sprint goals."
tags = ["SYS", "Scrum", "Project", "Velocity", "Retrospective", "Code review", "CODEOWNERS"]
categories = ["System Development"]
series = ["System Development"]
series_order = 6
weight = 39
+++

This week had another **Sprint Review** and **Sprint Planning** with the PO. This time we had to bring the application and database ready for a demo, plus a draft plan for the next sprint with the proposed stories already estimated.

This week we also had to prepare short answers and concrete examples on seven topics about *how* we work. The teacher mentioned that these could easily be exam questions. They are a good checklist for whether a team is actually doing Scrum or just going through the motions.

## 1. What we got out of the retrospective

A retrospective is only useful if it leads to change. The questions were:

- What were the most important insights?
- Which **concrete improvements** have we decided to try?
- How will we **follow up** on whether they work?

"We should communicate better" is not an improvement. "We post a short status in the team chat before 10:00 every day" is, because you can check whether it happened and whether it helped.

## 2. Velocity and realistic planning

**Velocity** is the number of story points a team *completes* (according to the DoD) in a sprint. Only finished stories count. Half-done work counts as zero.

After a few sprints, velocity gives the team an empirical basis for planning:

- How many points did we get **fully done** in the last sprint?
- What caused the difference between what we **planned** and what we **finished**: underestimated stories, unexpected tasks, illness, setup problems?
- How do we use that when choosing work for the **next** sprint?

Velocity is a *planning tool for the team*, not a performance measure to compare teams. Story points are relative and differ from team to team.

## 3. The Scrum board

The board should give an **accurate picture** of the status at a glance:

- What's left? What's in progress? What's **blocked** or waiting for **review**?
- Use **filters and views**, e.g. current sprint, the whole Product Backlog, by priority or by assignee.

A board that nobody updates is worse than no board, because it gives a false picture. Keeping it up to date is part of the transparency pillar in Scrum.

## 4. Product Backlog vs. Sprint Backlog

It should be **visible in the project** which stories are selected for the current sprint and which are candidates for later. The plan for delivering a story shows up as **tasks** under the story.

What happens when new work appears, or a story turns out to be bigger than expected? Make it visible, discuss it with the PO and decide together: split the story, drop something else, or put the new work in the Product Backlog. Scope changes should not quietly expand the sprint.

## 5. Pull requests and code review

- Do we use **pull requests** and ask another team member to review?
- What do we actually **check** in a review? Correctness against the acceptance criteria, readability, the coding standard, tests, and error handling.
- Can we show a PR where the feedback **led to an improvement**?

**CODEOWNERS** in GitHub can assign review responsibility automatically:

```text
# .github/CODEOWNERS
/src/backend/    @backend-dev
/src/frontend/   @frontend-dev
/db/             @backend-dev
```

When a PR touches those paths, the owners are automatically requested as reviewers, and with branch protection their approval can be made mandatory. Without it, the team needs another agreement that ensures the relevant people review the changes.

## 6. Acceptance criteria and tests

- Are the acceptance criteria concrete enough that we **know what to implement**? If not, ask the PO.
- Can we **derive test cases** from them with clear inputs and expected results?
- Do they cover **error cases and edge cases**, not just the happy path?

The exercise was to pick one story and show the chain **acceptance criteria → implementation → test**. When that chain is clear, "done" is something we can demonstrate. This leads directly into next week's topic on quality assurance.

## 7. Sprint goal and finished work

- What was the goal of the sprint, and **to what extent did we reach it**?
- Does the work we call "done" actually meet our **Definition of Done**?
- What do we propose as the next Sprint Goal, and **why is it valuable to the user**?

A sprint goal should describe **value**, e.g. "A customer can place and pay for an order". A list of stories to finish is not a goal.

## Key takeaways

- A retrospective should end in concrete improvements that you follow up on.
- Velocity counts only *done* points and is a planning tool, not a performance measure.
- The board, backlogs and tasks are only useful if they reflect reality.
- Pull requests with real review, possibly enforced with CODEOWNERS, are part of the quality process.
- Acceptance criteria should be concrete enough to turn into tests, including error cases.
- A Sprint Goal describes value for the user.
