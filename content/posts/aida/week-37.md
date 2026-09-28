+++
title = "Week 37: Spec-Driven Development and a Real-World Case"
date = "2026-09-10T16:00:00+02:00"
draft = false
description = "Why AI code agents need clear specifications, Peter Naur's 'Programming as Theory Building', and a company case from Engestofte Gods."
summary = "Why AI code agents need clear specifications, Peter Naur's 'Programming as Theory Building', and a company case from Engestofte Gods."
tags = ["AIDA", "Spec-driven development", "Code agents", "Peter Naur", "ADR"]
categories = ["AI-Driven Applications"]
series = ["AI-Driven Applications"]
series_order = 4
weight = 37
+++

This week had two sessions: **Spec-Driven Development** (7/9) and a **company presentation** from Engestofte Gods (10/9), which started the project phase of the course.

## Session 7: Spec-Driven Development

Code agents can write a lot of code very fast. That makes it more important to be precise about **what** should be built. Spec-driven development is about using a **specification** as the central artifact that guides requirements, design, implementation and review.

### Why agents need specs

When you give an agent a vague task, it fills the gaps with assumptions. Sometimes they are good, but often it invents requirements, makes domain decisions it shouldn't, or solves a slightly different problem. A good spec:

- defines the **problem** and the **goals**, and also the **non-goals**,
- describes the **user flow** and the requirements,
- contains **acceptance criteria** that make "done" unambiguous, and
- defines **testable boundaries**, so the result can be verified from the outside.

The spec is written for the agent to use, and the developer uses it to review the result.

### Peter Naur: Programming as Theory Building

We read Peter Naur's essay *Programming as Theory Building* from 1985. Naur argues that programming is mainly about the programmers **building a theory**, meaning an understanding of how the problem in the real world maps to the program. Producing code text is secondary.

According to Naur, a programmer who has the theory can:

1. **Explain** how parts of the program correspond to things in the real world.
2. **Justify** why the program is designed the way it is.
3. **Respond sensibly to change** by seeing how a new requirement relates to what already exists.

He also argues that this theory **cannot be fully written down**. Documentation helps, but a program whose original team is gone is effectively "dead", even if the code still runs.

This is directly relevant to AI agents. **An agent can produce code without having the theory.** If we let agents write everything without building the understanding ourselves, we end up with programs nobody really understands. Specs, glossaries and decision records are how we *build and share* the theory, both with our teammates and with the agents.

### The Mini AI Hero exercise

The exercise was to build a small **quiz website** (about meditation) using a spec-driven workflow in six steps:

1. **Interview the customer**: ask a few questions per round about purpose, target audience, learning goals, feedback and tone, then summarize.
2. **Write context documents**:
   - a **glossary** of domain terms (Question, Correct Answer, Feedback, Score …),
   - 1–2 **Architecture Decision Records (ADRs)**, e.g. "the quiz runs without a backend" or "each question has exactly one correct answer".
3. **Write the spec**: problem, target audience, goals, non-goals, user flow, requirements and acceptance criteria.
4. **Break the work into tickets**: small, **vertical** tickets that each deliver something visible ("Show the first question with answer options"). Avoid horizontal tickets like "do the HTML" or "do the CSS".
5. **Implement one ticket** with a code agent, using the spec, glossary and ADRs as context. The agent should explain what it changed, how it tested it and which assumptions it made.
6. **Review** the result against the spec. Did the agent invent requirements? Are all acceptance criteria met?

Example acceptance criteria:

```text
- The user can select an answer for each question
- The user sees a score when the quiz is finished
- Correct and incorrect answers are shown
- The quiz works without logging in
```

What I took from the exercise: the spec was more work to write than the code, but the code the agent produced from it was much closer to what we actually wanted.

## Session 8: Company presentation – Engestofte Gods

On Thursday we had a presentation from **[Engestofte Gods](https://www.engestofte.com/)**, an estate on Lolland. They presented concrete business challenges where AI and code agents might help.

The session connected the course topics to a real business with real problems, which is quite different from the exercises so far. It was meant to inspire our **project ideas**. We could build our project around one of Engestofte's challenges or pick our own idea, and the portfolio output for the session was a project idea proposal.

## Key takeaways

- With code agents, the bottleneck moves from writing code to **describing precisely what to build**.
- A spec with goals, non-goals and acceptance criteria gives agents less room to guess and gives me something concrete to review against.
- Naur's point is that the understanding lives in the developers, not in the code. Using agents doesn't change that, so I still need to build that understanding myself.
- Vertical tickets deliver something visible and testable with each step.
