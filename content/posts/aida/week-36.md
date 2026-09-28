+++
title = "Week 36: Integrating an LLM API into My Own Application"
date = "2026-09-04T16:00:00+02:00"
draft = false
description = "Treating an LLM as an external service: prompts, structured output, error handling, and building an AI assignment-feedback app."
summary = "Treating an LLM as an external service: prompts, structured output, error handling, and building an AI assignment-feedback app."
tags = ["AIDA", "LLM", "API", "Prompt engineering", "JSON", "Backend"]
categories = ["AI-Driven Applications"]
series = ["AI-Driven Applications"]
series_order = 3
weight = 36
+++

This week was about building our own LLM application rather than using an existing platform. We had **LLM API integration** (31/8), where we designed the solution, and **LLM API implementation** (4/9), where we built it.

## The case: AI feedback on assignments

The assignment for both sessions was a small AI-driven application that **assesses a student assignment against a rubric** and returns structured feedback:

```text
Client (frontend / REST client)
        ↓  assignment text
Backend endpoint
        ↓  system prompt + user prompt (rubric + assignment)
LLM API
        ↓  JSON response
Backend validates and parses
        ↓
Client receives structured feedback
```

The requirements were:

1. **Derive a rubric** from the assessment guidelines: 4–6 criteria, each with low, medium and high levels, preferably as JSON so the code can use it.
2. **Design prompts**: a system prompt that defines the model's role and output format, and a user prompt that contains the rubric and the assignment text.
3. **Build a backend** that receives input, builds the API request, calls the LLM, processes the response and returns it.
4. **Return structured feedback**: an overall assessment, feedback per criterion, strengths, weaknesses, improvement suggestions and 4–6 follow-up questions for the student.
5. **Test and reflect** using three example student assignments.

## Session 5: Designing the integration

### The LLM is an external service

The main mindset shift was to **treat the model like any other external API**. That means it can:

- be **slow**,
- **fail** (timeouts, network errors, rate limits, authentication errors),
- return **unexpected output**,
- **cost money** per call, and
- behave differently under **load**.

Once you think of it this way, the usual software engineering practices apply.

### System prompt vs. user prompt

- The **system prompt** describes *who the model is and how it should behave*: its role, rules, tone, constraints and output format.
- The **user prompt** contains *the actual data and task*: here, the rubric and the assignment text.

Keeping them separate makes the behaviour more consistent and makes it easy to reuse the same system prompt for many inputs. Structuring the user prompt clearly, with labels and clear separation between instructions and content, also improves the output noticeably.

### Structured output

Free text is fine for humans but hard for code. To use the model's answer in an application, you need **structured output**, typically JSON:

```json
{
  "overall_summary": "...",
  "criteria": [
    { "name": "Problem statement", "level": "medium", "feedback": "..." }
  ],
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."],
  "follow_up_questions": ["..."]
}
```

Define the format **early**, describe it in the system prompt, and ideally include an example. Even then, the output must be **validated in the backend**: check that it is valid JSON, that required fields exist and that types are correct. Never assume the model got it right.

### Synchronous vs. asynchronous

A short request can be handled **synchronously**: the client waits and gets the answer. Longer tasks (large documents, many calls) should be **asynchronous**: create a job, return a job ID and let the client poll for the status (`queued`, `running`, `completed`, `failed`).

## Session 6: Implementation

The second session was about turning the design into working code, with the focus on **getting the whole chain working end to end**. It did not have to be perfect.

### Start simple, then build up in layers

The course checklist suggests building in levels:

| Level | What it contains |
|---|---|
| **1** | Minimal prototype: one system prompt, one user prompt, one endpoint, simple input/output. |
| **2** | Better prompts, structured output, validation. |
| **3** | Retries, throttling, job queues, a database. |
| **4** | Worker architecture, caching, monitoring. |

Getting level 1 running first (client → backend → LLM API → response) makes every later improvement easier to test.

### Robustness practices

Some practices from the checklist I want to remember:

- **Retries with exponential backoff and jitter** for temporary failures, so you don't overload an API that is already struggling.
- **Control request volume** with throttling, queues and limited parallelism. This protects both the rate limit and the budget.
- **Log sensibly**: timing, status codes and error types, but never sensitive personal data.
- **Keep API keys on the backend** in environment variables. The frontend should never call the LLM provider directly.
- **Watch the costs**: prompt size, number of calls, and whether you really need to send the whole document every time.

### Evaluating the output

Testing on the three example assignments showed that the job isn't done when the code runs. You also have to **evaluate critically** whether the feedback is relevant and correct, and whether it actually follows the rubric. The same input can give slightly different answers from run to run, so you need to check **stability** as well as quality.

This also raised a bigger question. AI feedback can be a useful *first pass*, but grading students is high-stakes, so a human needs to stay in charge. We come back to this under the legal and ethical topics later in the course.

## Key takeaways

- Treat the LLM as an unreliable external service and design for failure.
- Separate the system prompt from the user prompt, and structure the input clearly.
- Define a JSON output format early and **always validate** it.
- Build in layers: get the whole chain working first, then add robustness.
- Match your trust in the model to how critical the task is.
