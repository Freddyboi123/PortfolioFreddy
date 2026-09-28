+++
title = "Week 39: Security, Law and Ethics"
date = "2026-09-25T16:00:00+02:00"
draft = false
description = "Keeping keys and secrets safe when building with agents, and the legal and ethical side of AI: the EU AI Act, transparency, copyright in RAG and sustainability."
summary = "Keeping keys and secrets safe when building with agents, and the legal and ethical side of AI: the EU AI Act, transparency, copyright in RAG and sustainability."
tags = ["AIDA", "Security", "Secrets", "EU AI Act", "Ethics", "Copyright", "Sustainability"]
categories = ["AI-Driven Applications"]
series = ["AI-Driven Applications"]
series_order = 6
weight = 39
+++

This week covered two topics that are easy to skip when you are busy building: **security** (21/9) and **legal and ethical considerations** (25/9).

## Session 11: Security – "Is it secret? Is it safe?"

The first session combined project work with a focus on **how we handle keys and credentials** during development. This matters more now that we build applications that call paid APIs and use agents that can read our files and run commands.

### Keep secrets out of the code

The basic rules:

- **Never hardcode API keys** in the source code. Keep them in **environment variables** or a secrets manager.
- Keep `.env` files **out of Git** (add them to `.gitignore`) and share an `.env.example` with the variable *names* only.
- **Secrets belong on the backend.** A frontend should never call an LLM provider directly with a key, because anything shipped to the browser is public. The frontend calls *your* backend, and the backend calls the provider.
- In CI/CD, use the platform's **secret store**, e.g. GitHub Actions secrets, instead of values in workflow files.

```text
Browser  →  my backend (holds the key in an env variable)  →  LLM API
   ✗ never:  Browser  →  LLM API with the key in JavaScript
```

### What changes with agents?

Code agents add new ways for secrets to leak:

- An agent that can **read your files** can also read your `.env` file, and the contents may end up in its context and be sent to the model provider.
- An agent that can **run commands** could print secrets to logs or commit them by accident.
- An agent might "helpfully" **hardcode a key** to make something work quickly.

Mitigations are to limit which files and commands the agent can use, review diffs before committing, use secret scanning in the repository, and use **scoped, revocable keys** with spending limits so that a leak does limited damage. If a key does leak, **rotate it** immediately. Deleting it from Git history is not enough.

### Untrusted input

Anything that ends up in a prompt, whether user input, uploaded documents or retrieved RAG chunks, can contain **prompt injection**: text that tries to override your instructions. The model's output should therefore be treated as untrusted too. Validate it, and don't let it trigger sensitive actions without checks.

The portfolio task was to document how we manage keys and credentials in our project and reflect on the technical choices we made.

## Session 12: Legal and ethical considerations

The second session was about using AI **responsibly**: data protection, bias, risk assessment and accountability. We started with Hannah Fry's video *"Why AI Agents are either the best or worst thing we've ever built"* and then worked through four themes.

### 1. The EU AI Act

The EU AI Act regulates AI by **risk level**. What surprised me was that **education is classified as high-risk** when AI is used for grading, exams, admissions or assessing performance. That applies directly to the assignment-feedback app we built in week 36.

For high-risk use:

- **human oversight** is required, and professional judgment cannot be handed over to an algorithm,
- decisions must be **explainable**, and
- people must be **informed** when AI is part of the feedback or assessment process. Hidden AI is not acceptable.

Some practices are **prohibited or heavily restricted**, such as emotion recognition, social scoring and manipulation of behaviour.

AI is still **allowed** in teaching (chatbots, feedback tools, coding assistants), but it must be used transparently and responsibly.

### 2. The fine print: transparency and documentation

- **Users must be told when they are talking to an AI**, unless it is obvious. This applies to my portfolio chatbot too, so it should clearly present itself as an AI assistant.
- AI-generated or manipulated content (images, audio, video) comes with extra transparency obligations.
- Since **2 August 2025**, providers of general-purpose AI models must publish a **summary of their training data**: content types, sources, time period and known limitations. This is similar to a *model card*.

### 3. Copyright and RAG

This was the most practical theme for me. Just because you *can* upload something to a RAG system doesn't mean you're *allowed* to.

- **Safe**: your own notes and slides, openly licensed material used within its licence, material you have explicit permission to use, and public-domain works.
- **Risky**: whole books or scanned chapters, library resources and commercial articles, content copied from the web just because it was accessible, and other people's teaching material without permission.

A better approach is to write **summaries, extract key concepts and cite sources**, and to check the rights when in doubt. My own portfolio chatbot is on safe ground, because the knowledge base is my own content.

### 4. Sustainability and generative AI

Generative AI uses a lot of energy. The course's message was to use it thoughtfully rather than reject it:

- choose an **appropriately sized model**. Not every task needs the biggest one,
- use **efficient data formats** (Markdown, JSON, CSV),
- **optimize prompts** and avoid unnecessary API calls,
- limit image and video generation, and
- use a normal search engine when that is enough.

The guiding rule: **use AI when it adds real value, and use a simpler solution when that is enough.** This also tends to save money.

### Human responsibility

All four themes come back to **people staying responsible**. AI can help with overview, structure and suggestions, but it cannot take professional responsibility. Personal data should be anonymized before it is sent to an AI service, and you should know where the data goes and how long it is kept.

## Key takeaways

- Keep secrets on the backend and in environment variables, never in code, Git or the browser.
- Agents add new ways for secrets to leak, so limit their access and review their changes.
- AI for assessment in education is **high-risk** under the EU AI Act: human oversight, explainability and transparency are required.
- Tell users when they are talking to an AI.
- Only put content you have the rights to into a RAG knowledge base.
- Use the smallest model and simplest solution that does the job.
