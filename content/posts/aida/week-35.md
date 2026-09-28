+++
title = "Week 35: RAG in Practice and Coding with Agents"
date = "2026-08-28T16:00:00+02:00"
draft = false
description = "Building a RAG chatbot into my portfolio, automating knowledge base updates, and a first look at AI code agents."
summary = "Building a RAG chatbot into my portfolio, automating knowledge base updates, and a first look at AI code agents."
tags = ["AIDA", "RAG", "Dify", "GitHub Actions", "Code agents", "Claude Code"]
categories = ["AI-Driven Applications"]
series = ["AI-Driven Applications"]
series_order = 2
weight = 35
+++

This week had two sessions: **RAG II** (24/8), where we took RAG from a demo to a working feature on our portfolios, and **code agents in software development** (28/8).

## Session 3: RAG II

Last week we built a RAG chatbot inside Dify. This week the goal was to build a RAG solution for a real case: **a chatbot on our own portfolio site** that can answer questions about our work.

### Workflow: research → discuss → implement

The session followed a clear workflow:

1. **Research** possible solutions, using ChatGPT/Claude as sparring partners.
2. **Present and discuss** approaches with other students.
3. **Implement** the chosen solution on our own site.

Comparing approaches with others was useful. People chose different solutions, from simple embedded chat widgets to custom frontends calling the Dify API.

### What makes a RAG solution good?

We looked at demos and discussed three factors that decide whether a RAG chatbot is actually useful:

- **Data sources**: which content is in the knowledge base, and is it clean and well structured? Markdown with meaningful headings works much better than messy PDF exports.
- **Retrieval quality**: does the system find the *right* chunks? This depends on chunk size, the search method (keyword, semantic or hybrid) and whether results are reranked.
- **Prompt design**: does the system prompt tell the model how to use the context, what to do when the answer isn't there, and what tone to use?

We also discussed the **limitations** of RAG. It cannot answer what is not in the knowledge base, poor chunks lead to confident but wrong answers, and the system is only as current as its data.

### Keeping the chatbot up to date

One problem I found interesting: **how do you keep the knowledge base in sync when the content changes?** If I write a new post and the chatbot doesn't know about it, the chatbot is out of date.

Since my site is Markdown in a Git repository, the answer is automation:

```text
git push  →  GitHub Actions workflow  →  Dify API  →  knowledge base updated
```

Using the [Dify API](https://docs.dify.ai/en/api-reference/guides/get-started) together with [GitHub Actions](https://docs.github.com/en/actions), a workflow can upload changed content to the Dify knowledge base every time I push. The website stays the single source of truth.

I wrote a separate, more detailed post about the implementation: **[Implementing a RAG Chatbot on My Portfolio Website](/posts/rag/)**. It covers my choice of hybrid search, the Jina Reranker v3 and OpenAI as the generating model.

## Session 4: Code agents in software development

The second session was about **AI code agents** such as **Claude Code**, **OpenAI Codex** and **Gemini CLI**.

### Code agents vs. chat assistants

A chat assistant gives you code snippets that you copy and paste. A **code agent** works *inside your project*. It can read files, search the codebase, edit code, run commands and tests, and repeat until something works.

```text
Developer gives a task
        ↓
Agent reads the codebase and plans
        ↓
Agent edits files / runs commands / runs tests
        ↓
Agent reports back → developer reviews
```

### Where agents help

We went through how agents can be used across the development process:

- **Architecture**: discussing and sketching structure, weighing alternatives.
- **Debugging**: reading stack traces, finding the relevant code and proposing fixes.
- **Refactoring**: making consistent changes across many files.
- **Testing**: writing test cases and running them to verify behaviour.

### Collaboration between developer and agent

The main theme was **collaboration**. The agent does not replace the developer. The developer is still responsible for:

- giving a **clear task** with enough context,
- **reviewing** what the agent produced, and
- deciding whether the result is actually correct and fits the project.

An agent is fast and tireless, but it can also be confidently wrong or solve a slightly different problem than the one you meant. The better the task description, the better the result, which comes back later in the course with spec-driven development.

The exercise was to solve a programming task with a code agent and **document the workflow**: how I phrased the task, what the agent did, where I had to correct it, and what I learned about working with it.

## Key takeaways

- A useful RAG chatbot depends on data sources, retrieval and prompt design together.
- Automating the knowledge base update (Git push → GitHub Actions → Dify API) keeps the website as the source of truth.
- Code agents work inside your project, but the developer is still responsible for the task description and the review.
