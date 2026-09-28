+++
title = "Week 34: Getting Started and My First RAG Chatbot"
date = "2026-08-21T16:00:00+02:00"
draft = false
description = "Course kickoff, setting up this portfolio with Hugo and Blowfish, and an introduction to Retrieval-Augmented Generation."
summary = "Course kickoff, setting up this portfolio with Hugo and Blowfish, and an introduction to Retrieval-Augmented Generation."
tags = ["AIDA", "LLM", "RAG", "Hugo", "Dify"]
categories = ["AI-Driven Applications"]
series = ["AI-Driven Applications"]
series_order = 1
weight = 34
+++

This is the first post in my weekly log for the elective **AI-Driven Applications** (AIDA). Every week I write down what we covered and what I took away from it. This week had two sessions: a course introduction (17/8) and our first session on **RAG** (21/8).

## Session 1: Course introduction and portfolio

The first session set out what the course is about. It covers building software where AI is part of the system, and using AI tools as part of how we develop that software.

### What is an LLM, really?

We were asked to watch an introduction to *what a Large Language Model is* before class. The main idea I took from it:

- An LLM is a model trained on huge amounts of text to **predict the next token** in a sequence.
- It has no built-in "truth" and no access to *your* data. It only knows what it saw during training.
- In a software system, an LLM should be treated as **one component**: a service you send input to and get output from. It is not the whole application.

The last point comes back throughout the course. Much of the work is the software *around* the model: data, prompts, APIs, error handling and user experience.

### Setting up this portfolio

The practical part of the session was building the website you are reading now. The course uses a portfolio to document cases and projects along the way, and the stack is:

- **[Hugo](https://gohugo.io/)**: a static site generator. Content is written in Markdown and Hugo builds it into plain HTML.
- **[Blowfish](https://blowfish.page/)**: a Hugo theme with support for blog posts, series, tags and more.
- **GitHub**: the repository holds the source, and the site is deployed automatically on push.

```text
Markdown content  →  Hugo build  →  static HTML  →  deployed via GitHub
```

I like this setup because my content is plain Markdown files in a Git repository. That turned out to matter a lot later in the week.

We also wrote a short reflection on our expectations for AI's role in software development.

## Session 2: RAG I

The second session introduced **Retrieval-Augmented Generation (RAG)**.

### The problem RAG solves

An LLM does not know your documents, such as your company's handbook, your study regulations or your own notes. You could paste everything into the prompt, but that quickly becomes expensive, slow and limited by the context window.

RAG instead **retrieves only the relevant pieces** of your documents and gives them to the model as context:

```text
Documents → split into chunks → embeddings → vector store
                                                   ↓
User question → embedding → similarity search → top chunks
                                                   ↓
                         prompt = instructions + chunks + question
                                                   ↓
                                             LLM answer
```

Key concepts:

- **Chunking**: documents are split into smaller pieces so retrieval can be precise.
- **Embeddings**: each chunk is turned into a vector that represents its meaning. Questions are embedded the same way, so we can find chunks that are *semantically* close to the question.
- **Retrieval**: the most relevant chunks are fetched and inserted into the prompt.
- **Grounding**: the model is instructed to answer *based on the provided context*, which reduces (but does not remove) hallucinations.

### When is RAG a good idea?

We also discussed when RAG is *not* the right tool. RAG fits well when:

- the knowledge is **specific** (your documents, not general knowledge),
- the knowledge **changes** over time, and
- you want answers that can be **traced back** to a source.

If the dataset is tiny, pasting it into the prompt may be enough. If you need the model to learn a *style* or *behaviour* rather than facts, RAG is not the answer either.

### Comparing platforms

We compared three ways to build a RAG chatbot without writing everything from scratch:

| Platform | Notes |
|---|---|
| **ChatGPT custom GPTs** | Very easy to set up, but locked into the ChatGPT interface and with little control over retrieval. |
| **customGPT.ai** | A hosted RAG product. Quick to start, but a paid service with limited flexibility. |
| **Dify.ai** | An open platform for building LLM apps. It gives much more control over knowledge bases, retrieval settings and models, and it has an API. |

We judged them on **usability, cost and technical flexibility**. Dify was the most flexible of the three, which is why I later used it for my own portfolio chatbot.

### Data preparation matters

We built a RAG chatbot in Dify using the study regulations (*studieordningen*) as the knowledge base. One practical lesson was that **the format of the source data affects retrieval quality**. Converting a PDF to **Markdown** before uploading gives cleaner text with real headings and structure, so the chunks make more sense and retrieval improves.

## Key takeaways

- An LLM is a component in a system, not the system itself.
- RAG lets a model answer questions about *your* data by retrieving relevant chunks and adding them to the prompt.
- Retrieval quality depends heavily on data preparation. Garbage in, garbage out.
- Dify offers a good balance between ease of use and control.

The portfolio assignment for the week was to build a simple RAG chatbot on my own material, which leads straight into next week.
