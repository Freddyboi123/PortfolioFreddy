+++
title = "Week 38: Project Start and Coworking with Agents"
date = "2026-09-18T16:00:00+02:00"
draft = false
description = "Kicking off the course project, and how teams of humans and AI agents can work in parallel safely using tickets, guardrails, Git worktrees and CODEOWNERS."
summary = "Kicking off the course project, and how teams of humans and AI agents can work in parallel safely using tickets, guardrails, Git worktrees and CODEOWNERS."
tags = ["AIDA", "Project", "Code agents", "Git", "Git worktrees", "CODEOWNERS"]
categories = ["AI-Driven Applications"]
series = ["AI-Driven Applications"]
series_order = 5
weight = 38
+++

This week the project work started. We had the **project kickoff** (14/9) and a session on **collaborative agentic development** (18/9): how several people *and* several agents can work on the same codebase without getting in each other's way.

## Session 9: Project start

We formed project teams and started work on an AI-driven application, based either on one of the business cases from Engestofte Gods or on our own idea.

The first deliverables were:

- a **project description**: the problem, who it is for and what we want to achieve, and
- a **system sketch**: the main components and how data flows between them (frontend, backend, LLM API, data sources and so on).

Last week's spec-driven work fitted in naturally here. A clear description and sketch are the start of the shared "theory" of the project that the team, and the agents we use, will work from.

## Session 10: Collaborative agentic development

When one developer uses one agent, coordination is easy. When a **team** of developers each run one or more agents in the same repository, you need structure.

### The agent ticket as a small contract

The main idea of the session was to write tasks for agents as **tickets that work like small contracts**. A good agent ticket contains:

- **Purpose and deliverable**: what should exist when the task is done.
- **Owner and branch name**: who is responsible and where the work happens.
- **Allowed files**: which parts of the codebase the agent may change.
- **Prohibited changes**: what it must not touch, and what it must not "helpfully" expand into.
- **Functional requirements**, preferably with examples.
- **Technical guardrails**: architecture rules to follow.
- **Test requirements** and a **definition of done**.
- **Stop conditions**: when the agent must stop and ask a human instead of guessing.
- **Handoff**: what the agent must report so the work can be reviewed.

A minimal version for routine tasks contains just: goal, scope, criteria, verification, stop conditions and handoff.

### Guardrails: soft vs. hard

We distinguished between two kinds of guardrails:

- **Soft guardrails** are *instructions*, written in the ticket or in agent instruction files. The agent is *supposed* to follow them, but nothing forces it.
- **Hard guardrails** are *technically enforced*, so breaking the rules gives an error. Examples:
  - **CODEOWNERS**: required reviewers for specific paths,
  - **branch protection**: no direct pushes to `main`, reviews required,
  - **CI checks**: tests and linting must pass,
  - **ArchUnit** / **Maven Enforcer** (in Java projects): architecture and dependency rules checked automatically,
  - custom validation scripts.

The rule I took from this: **the more important the rule, the more it should be a hard guardrail.** Relying on the agent to always follow instructions is not enough.

### Git worktrees for parallel work

Normally a Git repository has one working directory with one branch checked out at a time. **Git worktrees** let you have *several working directories* from the same repository, each with its own branch:

```bash
# create a new worktree in a sibling folder, on a new branch
git worktree add ../myproject-search -b feature/customer-search

# list worktrees
git worktree list

# remove it when the work is merged
git worktree remove ../myproject-search
```

This makes it possible to run one agent per feature in parallel, each in its own folder and branch, without them overwriting each other's files. The ticket's branch name and allowed files map directly onto the worktree setup.

### CODEOWNERS

A `CODEOWNERS` file in the repository defines who owns which parts of the code:

```text
# .github/CODEOWNERS
/src/api/        @backend-team
/src/frontend/   @frontend-team
/docs/           @frederik
```

Combined with branch protection, changes to those paths **require review from the owner**. It's a hard guardrail that makes sure nobody, human or agent, changes a critical area without the responsible person seeing it.

### An example

The course material walked through a full ticket for a **customer search** feature in a Java/Javalin project. It listed the exact paths the agent could change, what it was not allowed to do (e.g. change the database schema or shared APIs), which test scenarios had to pass, and when to stop and ask, for example if the task turned out to require a schema change.

## Key takeaways

- A project starts with a shared understanding: a description and a system sketch.
- Writing agent tasks as tickets with scope, criteria and stop conditions makes the results predictable and reviewable.
- Soft guardrails are instructions, while hard guardrails (CODEOWNERS, branch protection, CI) are enforced.
- Git worktrees make it practical to run several agents on separate branches in parallel.
