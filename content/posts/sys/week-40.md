+++
title = "Week 40: Quality Assurance and Testing"
date = "2026-09-28T09:00:00+02:00"
draft = false
description = "Quality assurance in a Scrum project: the test pyramid, test strategy, what to automate, test case design techniques, testability and quality as a continuous part of the sprint."
summary = "Quality assurance in a Scrum project: the test pyramid, test strategy, what to automate, test case design techniques, testability and quality as a continuous part of the sprint."
tags = ["SYS", "Testing", "Quality assurance", "Test pyramid", "Test design", "Scrum"]
categories = ["System Development"]
series = ["System Development"]
series_order = 7
weight = 40
+++

This week was about **quality assurance and testing**: do we have control over the quality of what we build, how much should we test, and how? The PO also set the requirements for Sprint 4, and each team gave a Sprint 3 review (demo).

Some of the learning goals continue next week, so this post covers the foundations.

## Types of tests

Tests are grouped into **levels** by how much of the system they cover:

- **Unit tests** test a single function or class in isolation. They are fast, cheap and precise.
- **Integration tests** test that components work together: code and database, service and external API.
- **System / end-to-end (E2E) tests** test the whole system from the user's perspective, e.g. through the UI.
- **Acceptance tests** check that a user story meets its acceptance criteria.

Tests can also be grouped by **type**: functional tests (does it do the right thing?) and non-functional tests (performance, security, usability), which connects back to FURPS in week 36.

## The test pyramid

The **test pyramid** is a strategy for test automation:

```text
            /\
           /E2E\          few – slow, brittle, expensive
          /------\
         /Integr- \       some
        /  ation   \
       /------------\
      /  Unit tests  \    many – fast, stable, cheap
     /________________\
```

- Have **many** unit tests. They run in milliseconds and pinpoint exactly what broke.
- Have **some** integration tests for the places where components meet.
- Have **few** end-to-end tests for the most important user flows. They are slow and break easily when the UI changes.

The anti-pattern is the **ice cream cone**: mostly manual and E2E tests with few unit tests. That gives slow feedback and fragile tests.

## What to automate, and what not to

Automation has a cost: tests must be written *and maintained*. Good candidates for automation are:

- tests that are run **often** (regression tests on every commit),
- business logic that is **critical** or complex,
- tests that are **tedious or error-prone** to do by hand, such as many data combinations.

Manual testing still makes sense for:

- **exploratory testing**, where a human tries to break the system in creative ways,
- **usability** and visual assessment,
- features that are **changing rapidly** or are one-off.

A **test strategy** for a project is a justified choice of which levels and types to use for which parts of the system, and what is automated versus tested manually.

## Test case design

Good test cases are **derived from requirements**: user stories and acceptance criteria. They should cover both **positive** scenarios (valid input gives the expected result) and **negative** scenarios (invalid input is handled correctly).

Three techniques for choosing test data systematically:

### Equivalence partitioning

Divide the inputs into **groups that the system should treat the same way**, and test one value from each group. Example: an age field that accepts 18–65:

| Partition | Example value | Expected |
|---|---|---|
| Below range | 10 | Rejected |
| In range | 40 | Accepted |
| Above range | 80 | Rejected |

### Boundary value analysis

Bugs cluster at **boundaries** (`<` vs. `<=`), so test right at and around them: **17, 18, 19** and **64, 65, 66**.

### Decision tables

When the result depends on **combinations of conditions**, list all the combinations in a table:

| Member? | Order > 500 kr? | Discount |
|---|---|---|
| Yes | Yes | 15% |
| Yes | No | 10% |
| No | Yes | 5% |
| No | No | 0% |

Each column of conditions becomes a test case, so no combination is forgotten.

## Testability

How easy code is to test depends on its **design**. Code is hard to test when it creates its own dependencies, mixes logic with I/O (database, network, UI), or depends on global state.

Two principles help:

- **Separation of concerns**: keep business logic apart from database access, HTTP handling and UI, so the logic can be tested on its own.
- **Dependency injection**: pass dependencies *in* instead of creating them inside the class. The test can then pass in a **test double** (a stub, mock or fake) instead of the real database or API.

```java
// Hard to test: creates its own dependency
class OrderService {
    private final OrderRepository repo = new DatabaseOrderRepository();
}

// Testable: the dependency is injected
class OrderService {
    private final OrderRepository repo;
    OrderService(OrderRepository repo) { this.repo = repo; }
}
```

Test doubles aren't always the answer, though. **Integration** points, such as whether the SQL actually works against the real database, should also be tested for real.

## Quality as part of the Scrum process

The main message of the session: **quality assurance is not a phase at the end of the sprint.** It happens continuously:

```text
Acceptance criteria → test cases → implementation + unit tests
   → pull request + code review → CI runs all tests → Done (DoD)
```

- **Acceptance criteria** are written with testing in mind from the start.
- **Automated tests** are written together with the code.
- **Code review** in pull requests catches problems early.
- **CI** (e.g. GitHub Actions) runs the tests on every push, so a broken build is caught immediately.
- The **Definition of Done** contains the quality criteria, e.g. "unit tests written and passing" and "CI green".

This ties together weeks 35, 36 and 39. The DoD and acceptance criteria are only meaningful if they are verified, and tests and CI are how we verify them.

## Key takeaways

- The test pyramid calls for many unit tests, some integration tests and few E2E tests.
- Automate what runs often and is critical, and keep exploratory testing manual.
- Derive test cases from acceptance criteria using equivalence partitioning, boundary values and decision tables.
- Testable code comes from separation of concerns and dependency injection.
- Quality is built in continuously through the sprint, not tested in at the end.
