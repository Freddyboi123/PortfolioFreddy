+++
title = "Implementing a RAG Chatbot on My Portfolio Website"
date = "2026-08-28T12:00:00+02:00"
draft = false
+++

# Implementing a RAG Chatbot on My Portfolio Website

As part of developing my portfolio website, I wanted to build something that was more than just a collection of pages and project descriptions.

I wanted visitors to be able to interact with my portfolio and ask questions about my experience, projects, skills, and the things I have worked on.

To achieve this, I decided to implement a **Retrieval-Augmented Generation (RAG)** chatbot directly into my website.

The chatbot is built using **Dify**, with my Hugo website acting as the knowledge base. The system uses **hybrid search** for retrieving relevant information, **Jina Reranker v3** for improving the search results, and **OpenAI** as the AI model generating the final responses.

## What is RAG?

RAG stands for **Retrieval-Augmented Generation**.

Instead of relying entirely on the information an AI model already knows, a RAG system retrieves relevant information from an external knowledge base and provides it to the AI as context.

A simplified version of the process looks like this:

```text
User question
      ↓
Retrieve relevant information
      ↓
Rank the retrieved information
      ↓
Send context + question to AI
      ↓
Generate response
```

This is particularly useful for a portfolio website because the AI does not need to "know" who I am beforehand.

Instead, it can retrieve information directly from my website.

For example, if someone asks:

> "What projects has Frederik worked on?"

the system can search my portfolio content, retrieve the relevant project descriptions, and provide that information to the AI.

## Using Dify

For the RAG implementation, I chose **Dify**.

Dify provides a framework for building AI applications and makes it possible to create RAG pipelines without having to implement every component from scratch.

I used Dify as the foundation for the chatbot and configured a knowledge base containing the content from my Hugo website.

This allowed me to separate the different parts of the system:

* Hugo handles the website and its content.
* Dify handles the RAG pipeline.
* The search system retrieves relevant information.
* Jina Reranker improves the retrieved results.
* OpenAI generates the final answer.

This separation also makes the system easier to modify and experiment with.

## Using My Hugo Website as the Knowledge Base

One of the more interesting parts of the project was using the website itself as the chatbot's knowledge base.

My portfolio is built using **Hugo**, which means most of the content is stored as Markdown files.

For example:

```text
content/
├── posts/
│   ├── firstPost.md
│   ├── rag-implementation.md
│   └── another-project.md
├── projects/
│   ├── project-one.md
│   └── project-two.md
└── about.md
```

These files contain information about my projects, experience, technical interests, and other relevant information.

Rather than maintaining a completely separate database of information for the chatbot, I wanted the website's content to be the source of truth.

That means that when I add or update content on the website, the same information can be used by the chatbot.

## Hybrid Search

For retrieving information from the knowledge base, I am using **hybrid search**.

Hybrid search combines multiple approaches to finding relevant information instead of relying on only one search method.

A traditional keyword search is good at finding exact terms.

For example, if a user searches for:

```text
Dify
```

a keyword-based system can easily find documents containing the word "Dify".

However, keyword search can struggle when the user asks the same question using different terminology.

Semantic search helps with this by looking at the meaning of the query rather than just matching individual words.

For example:

```text
"What technology did I use to build my AI chatbot?"
```

could potentially retrieve content mentioning:

```text
RAG
Dify
OpenAI
Jina
AI
```

even if the exact words in the question do not appear together in the document.

By combining these approaches, hybrid search can provide a better set of initial search results.

## Jina Reranker v3

Retrieving a number of potentially relevant documents is only the first step.

The system also needs to determine which of those results are actually the most useful for answering the user's question.

For this, I am using **Jina Reranker v3**.

The reranker takes the initial search results and evaluates them against the user's query.

Conceptually, the process looks like:

```text
User question
      ↓
Hybrid search
      ↓
Initial results
      ↓
Jina Reranker v3
      ↓
Best matching results
      ↓
OpenAI
      ↓
Final answer
```

This is important because a search system might retrieve several documents that are generally related to the topic, while only a few actually contain the information needed to answer the question.

The reranker helps prioritize those more relevant pieces of information before they are passed to the AI model.

## OpenAI as the AI Model

After the relevant information has been retrieved and reranked, the resulting context is provided to an **OpenAI** model.

The model is responsible for turning the retrieved information into a natural-language response.

The important distinction here is that the model is not simply being asked:

```text
"Tell me about Frederik."
```

Instead, the RAG system provides it with relevant information retrieved from my website.

The overall architecture is therefore:

```text
                    ┌─────────────────┐
                    │   Hugo Website  │
                    │   Markdown      │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │  Dify Knowledge │
                    │      Base       │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │  Hybrid Search  │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │ Jina Reranker   │
                    │      v3         │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │     OpenAI      │
                    │   AI Model      │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │ Chatbot Response│
                    └─────────────────┘
```

## Why I Chose This Approach

There are several reasons I decided to build the chatbot this way.

### 1. The website remains the source of truth

I don't need to manually maintain the chatbot's information separately from my portfolio.

The information already exists in my Hugo content.

### 2. It makes the portfolio interactive

Instead of forcing visitors to navigate through several pages to find information, they can ask questions directly.

For example:

```text
"What programming languages does Frederik use?"

"Tell me about his RAG project."

"What has he built using Hugo?"

"What technologies has he worked with?"
```

The chatbot can then retrieve the relevant information and present it conversationally.

### 3. It demonstrates a practical AI implementation

I also wanted the project itself to demonstrate that I understand more than simply how to call an AI API.

The implementation involves several components:

* Retrieval
* Vector/semantic search
* Keyword search
* Reranking
* Prompting
* AI model integration
* API communication
* Website integration

This makes the chatbot a project in its own right.

## Challenges During Development

Getting the system working was not completely straightforward.

One of the challenges was making sure the information being retrieved by the RAG system was actually useful.

A RAG system can technically work while still producing poor answers if the retrieval stage returns irrelevant or incomplete information.

This is why the combination of **hybrid search and reranking** is important.

Another challenge was connecting the different systems.

The website, Dify, the knowledge base, the reranker, and the OpenAI model all have different responsibilities and interfaces.

Getting those pieces to communicate correctly required testing the API configuration and making sure the correct endpoints and models were being used.

## What I Learned

Building this project gave me a better understanding of how RAG systems work in practice.

One of the biggest things I learned is that the quality of a RAG chatbot depends heavily on the retrieval pipeline.

It is easy to focus on the AI model because that is the part users interact with. However, if the system retrieves poor information, even a powerful model will have difficulty producing a good answer.

The pipeline therefore matters just as much as the model:

```text
Good question
     ↓
Good retrieval
     ↓
Good ranking
     ↓
Good context
     ↓
Good AI response
```

This project also gave me practical experience working with APIs and integrating AI functionality into an existing web application.

## What's Next?

The current implementation is still a work in progress.

There are several things I would like to improve as the project develops.

One of them is improving how the Hugo content is automatically synchronized with the Dify knowledge base.

I would also like to experiment with different retrieval settings and evaluate how they affect the chatbot's answers.

Another area I want to explore is making the chatbot better at understanding the structure of my portfolio.

For example, distinguishing between:

* Projects
* Blog posts
* Work experience
* Technical skills
* Education

could potentially make the retrieved context more precise.

Ultimately, the goal is to turn the chatbot into an interactive interface to my portfolio rather than simply adding an AI chatbot for the sake of having one.

## Conclusion

The RAG chatbot is one of the more interesting parts of my portfolio because it combines several technologies into a single application.

The current stack consists of:

**Hugo** → Website and content

**Dify** → RAG application and knowledge base

**Hybrid Search** → Information retrieval

**Jina Reranker v3** → Result ranking

**OpenAI** → Natural-language generation

The project has also given me a practical opportunity to experiment with how retrieval-augmented AI systems can be integrated into real-world applications.

Rather than building a chatbot that simply talks about anything, I wanted to build one that can actually understand the content of my portfolio.

And this is the first step towards doing exactly that.
+++
