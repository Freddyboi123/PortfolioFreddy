+++
date = '2026-08-21T11:37:19+02:00'
title = 'index'
+++

# Welcome 👋

Hi, I'm Frederik.

Welcome to my website. I'm currently building this site with **Hugo** and **Blowfish**.

More content coming soon.

# Building a Simple Event-Driven System with Redis and Python

Event-driven architecture is a useful way to build applications where different parts of a system need to react to things happening elsewhere. Instead of having one service directly call another service every time something happens, an application can publish an event and allow other components to decide whether they are interested in it.

In this post, I’ll look at a small example using **Python** and **Redis** to build a simple event-driven notification system.

## What is Event-Driven Architecture?

In a traditional application, one component might directly call another:

```text
User
  ↓
Web Application
  ↓
Notification Service
  ↓
Email Provider
```

This works well for small applications, but the web application becomes increasingly dependent on the notification service.

With an event-driven approach, the architecture can instead look like this:

```text
User
  ↓
Web Application
  ↓
Event Broker
  ├── Notification Service
  ├── Analytics Service
  └── Audit Service
```

The web application only needs to publish an event such as:

```text
user.registered
```

Other services can subscribe to that event and perform their own work.

This creates a useful separation between the producer of an event and the consumers of that event.

## Using Redis as an Event Broker

For this example, I’m using **Redis**.

Redis is commonly known as an in-memory key-value store, but it also provides features that can be useful for event-driven applications. One of those features is **Redis Streams**, which provides a persistent, append-only sequence of messages.

A simple event might look like this:

```json
{
  "event": "user.registered",
  "user_id": "12345",
  "email": "user@example.com"
}
```

The application can add this event to a Redis stream:

```python
import redis
import json

client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

event = {
    "event": "user.registered",
    "user_id": "12345"
}

client.xadd(
    "events",
    {
        "payload": json.dumps(event)
    }
)
```

The important part here is that the application doesn't need to know which services will process the event.

## Consuming Events

A separate worker can listen for new events:

```python
messages = client.xread(
    {"events": "$"},
    block=5000
)

for stream, entries in messages:
    for message_id, data in entries:
        event = json.loads(data["payload"])

        print(
            f"Received event: {event['event']}"
        )
```

In a real application, the consumer would probably perform some useful operation instead of simply printing the event.

For example, a notification service could receive `user.registered` and send a welcome email.

An analytics service could receive the same event and record it for reporting.

An audit service could store the event for future investigation.

## Why Use Events?

One of the biggest advantages of this approach is that services become less tightly coupled.

Imagine that the application originally only needs to send welcome emails. Later, we decide that every registration should also be recorded in an analytics system.

With a tightly coupled architecture, the registration code might need to be changed:

```python
create_user()
send_email()
record_analytics()
```

With an event-driven architecture, the registration service can continue publishing:

```text
user.registered
```

The analytics service can simply subscribe to that event.

This makes it easier to add new functionality without modifying the original producer.

## The Problem with Distributed Systems

Event-driven systems aren't automatically better, though.

They introduce their own problems.

For example, what happens if the notification service crashes after receiving an event?

This is where concepts such as **message acknowledgement**, **consumer groups**, **retries**, and **idempotency** become important.

A consumer should ideally be able to process the same event more than once without causing an unexpected result.

For example, if an event tells a service to charge a customer's credit card, blindly processing the event twice could result in two payments.

A better design would associate an identifier with each event:

```json
{
  "event_id": "8f4c2c",
  "event": "payment.created",
  "user_id": "12345",
  "amount": 49.99
}
```

The consumer can then keep track of which event IDs it has already processed.

## A Small Project

I used these ideas in a small project called **EventBoard**.

EventBoard is a simple Python application that demonstrates event-driven communication between several services.

The project contains three main components:

* **API Service** — creates users and publishes events.
* **Notification Worker** — listens for user events and simulates sending notifications.
* **Analytics Worker** — consumes the same events and records basic statistics.

The architecture looks like this:

```text
                 ┌────────────────────┐
                 │    Python API      │
                 └─────────┬──────────┘
                           │
                           │ publish
                           ▼
                 ┌────────────────────┐
                 │   Redis Streams    │
                 └───────┬───────┬────┘
                         │       │
                   consume│       │consume
                         ▼       ▼
              ┌──────────────┐ ┌──────────────┐
              │ Notification │ │  Analytics   │
              │    Worker    │ │    Worker    │
              └──────────────┘ └──────────────┘
```

The project is intentionally small, but it demonstrates several concepts that are useful when designing larger distributed systems.

It also provides a practical example of how Redis can be used for more than simple caching.

## What I Learned

The biggest lesson from building EventBoard was that event-driven architecture isn't primarily about the technology being used.

Redis, Kafka, RabbitMQ, and other messaging systems can all be used to implement event-based communication. The more important questions are architectural:

* What events should exist?
* Who owns each event?
* Which services consume them?
* What happens when a consumer fails?
* Can an event safely be processed twice?
* How should failed events be retried?
* How long should events be retained?

Thinking about these questions early can prevent a simple event system from becoming difficult to maintain later.

## Conclusion

Event-driven architecture can be a useful approach when an application has multiple independent components that need to react to the same actions.

For a small application, introducing an event broker may be unnecessary complexity. However, when services need to evolve independently, events can provide a useful boundary between them.

Redis Streams provides a relatively simple way to experiment with these ideas without immediately introducing a large infrastructure stack.

The **EventBoard** project is a small example of this approach and is useful as a starting point for experimenting with event-driven systems, Redis Streams, Python workers, retries, and idempotent event processing.

### Related Project

**EventBoard** — A Python and Redis project demonstrating event-driven communication between an API, notification worker, and analytics worker.

The project can be extended with additional consumers, authentication, persistent databases, Docker containers, and monitoring to explore how the architecture behaves as the system becomes more complex.
