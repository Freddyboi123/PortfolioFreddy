+++
title = "Week 40: Visiting Engestofte Gods and the Model Context Protocol"
date = "2026-10-02T16:00:00+02:00"
draft = true
description = "A field trip to Engestofte Gods to demo our prototype, and a mini-workshop on MCP, the standard way to connect AI assistants to tools and data."
summary = "A field trip to Engestofte Gods to demo our prototype, and a mini-workshop on MCP, the standard way to connect AI assistants to tools and data."
tags = ["AIDA", "MCP", "Project", "Engestofte Gods"]
categories = ["AI-Driven Applications"]
series = ["AI-Driven Applications"]
series_order = 7
weight = 40
+++

This week had two sessions: a **field trip to Engestofte Gods** (29/9) and a **mini-workshop on MCP**, the Model Context Protocol (2/10).

## Session 13: Field trip to Engestofte Gods

We took the bus to **Engestofte Gods** on Lolland, the company that presented its business challenges in week 37. The plan for the day:

- a **guided tour** of the estate,
- **demonstrating our project prototypes** to the hosts, and
- reflecting on how the visit relates to our own projects.

<!-- TODO: Add your own experience from the trip here:
- What did you see on the tour that was relevant to your project?
- How did the hosts react to your prototype demo? What feedback did you get?
- Did the visit change your understanding of the problem or your priorities?
-->

## Session 14: MCP – Model Context Protocol

### The problem MCP solves

An AI assistant only knows what is in its training data and its context. To be useful in a real system, it needs to **use tools and access data**: look something up in a database, call an API, read a file, create a ticket.

Without a standard, every AI application needs custom integration code for every tool. The **Model Context Protocol (MCP)** is a **standard way to connect AI assistants to tools, data and backend logic**. You build an integration once as an MCP server, and any MCP-compatible client can use it.

### Architecture

MCP uses a **client–server model**:

```text
AI client (Claude Desktop, Codex, IDE assistant …)
        │  1. connects
        ▼
   MCP server
        │  2. advertises its capabilities
        ▼
AI chooses a capability and calls it (3)
        │
        ▼
Server does the work (database, API, files …)
        │  4. returns a structured result
        ▼
AI uses the result in its answer
```

An MCP server can expose three kinds of capabilities:

| Capability | What it is | Example |
|---|---|---|
| **Tools** | Functions the model can call | `search_bookings(date)` |
| **Resources** | Data the model can read | a document, a table, a file |
| **Prompts** | Predefined instructions/templates | "Summarize this week's orders" |

### Transports

MCP can run over different **transports**:

- **stdio**: the client starts the server as a local process and they talk over standard input/output. It is the simplest option and well suited to development and prototypes.
- **Streamable HTTP**: the server runs over the network. This suits cloud deployment and multi-user setups.
- **HTTP + SSE**: an older pattern with Server-Sent Events for streaming, now mostly historical.

The recommendation was to **start with stdio** and move to HTTP when you need to deploy.

### MCP vs. REST

MCP does **not** replace REST:

- a **REST API** is designed for **app-to-app** communication,
- **MCP** is designed for **model-to-tool** communication.

The same backend can expose both: a REST API for the frontend and an MCP server that lets an AI assistant use the same logic.

### Relevance to my work

<!-- TODO: The portfolio task is a short reflection on how MCP could be used in your project or another AI application. Some starting points:
- Your project: which tools/data would an AI assistant need access to? Could they be exposed as MCP tools?
- The portfolio chatbot: an MCP server could expose the Hugo content as resources, or a "search_posts" tool.
- Remember the security points from week 39: an MCP tool gives the model real capabilities, so scope and validate what it can do.
-->

## Key takeaways

- MCP is a standard for connecting AI assistants to tools, resources and prompts.
- It uses a client–server model. Start with the stdio transport and move to HTTP for deployment.
- MCP is for model-to-tool communication and works alongside REST rather than replacing it.
