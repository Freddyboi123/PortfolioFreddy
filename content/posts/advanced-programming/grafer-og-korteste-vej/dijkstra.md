+++
title = "Dijkstra: shortest route on a directed road network"
date = "2026-11-08T12:00:00+01:00"
draft = false
description = "How I implemented Dijkstra's algorithm in Java on a road network of 8 cities on Zealand with weighted, directed roads, and how I visualized it step by step."
summary = "How I implemented Dijkstra's algorithm in Java on a road network of 8 cities on Zealand with weighted, directed roads, and how I visualized it step by step."
tags = ["AP", "Dijkstra", "Graphs", "Shortest path", "Java", "Visualization"]
categories = ["Advanced Programming"]
series = ["Advanced Programming"]
series_order = 1
weight = 1
+++

{{< algorithm-demo name="dijkstra" title="Interactive Dijkstra visualization" caption="Try it: press Play, or step with ← → (click the demo first). Pick other cities under From / To." >}}

This is part 1 of the assignment [**Grafer og korteste vej**]({{< relref "posts/advanced-programming/grafer-og-korteste-vej/_index.md" >}}). Part 2 is [A\* on a city grid]({{< relref "astar.md" >}}).

**Code:** [`graphs/dijkstra`](https://github.com/Freddyboi123/AdvancedPrograming/tree/main/src/main/java/graphs/dijkstra) in my [AdvancedPrograming repository](https://github.com/Freddyboi123/AdvancedPrograming).

## The task

> Implement Dijkstra's algorithm to find the shortest route between cities in a road network.
>
> - Design your own road network with at least 8 cities and weighted, directed roads
> - Find the shortest route from one city to another
> - Make a visualization that makes sense. What is useful to see when you want to understand the algorithm?

## How the code is organised

```text
graphs/dijkstra/
├── Dijkstra.java              main: builds the map and picks start and end
├── logic/
│   ├── MapBuilder.java        the road network (cities + roads)
│   ├── FindShortestPath.java  the algorithm itself + printing the result
│   └── entity/
│       ├── WeightedNode.java  a city and its outgoing roads
│       └── NodeWithDist.java  a queue entry: (city, distance), sorted by distance
├── Visual.html                the visualization (open in a browser)
└── Visual.js
```

I kept the **data** (the map), the **algorithm** and the **entry point** apart, so I could change the map or the start and end cities without touching the algorithm.

## Step 1: The graph as an adjacency map

Each city is a `WeightedNode` that stores its **outgoing** roads in a `Map<WeightedNode, Integer>`. The key is the city the road leads to, and the value is the length in km. This is an *adjacency list*. Because a road is only stored on the city it leaves from, the graph is **directed** without any extra work.

[`WeightedNode.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/dijkstra/logic/entity/WeightedNode.java)

```java
public class WeightedNode {
    private String name;
    private Map<WeightedNode, Integer> neighbors;

    public WeightedNode(String name) {
        this.name = name;
        this.neighbors = new HashMap<>();
    }

    public Map<WeightedNode, Integer> getNeighbors() {
        return neighbors;
    }
    public void addNeighbor(WeightedNode neighbor, int weight) {
        neighbors.put(neighbor, weight);
    }
}
```

## Step 2: Designing the road network

My network has **8 cities on Zealand**, with **14 roads** and lengths that roughly match the real distances in km. To make the roads directed, `MapBuilder` has two helper methods. `oneWayRoad` adds the edge in one direction only. `twoWayRoad` adds it in both directions.

[`MapBuilder.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/dijkstra/logic/MapBuilder.java#L20-L50)

```java
twoWayRoad(kobenhavn, hellerup, 7);
oneWayRoad(kobenhavn, emdrup, 6);
twoWayRoad(kobenhavn, glostrup, 12);
twoWayRoad(kobenhavn, koge, 40);
oneWayRoad(emdrup, hellerup, 4);
twoWayRoad(hellerup, lyngby, 8);
twoWayRoad(emdrup, lyngby, 7);

oneWayRoad(lyngby, glostrup, 14);
twoWayRoad(lyngby, roskilde, 30);
oneWayRoad(holbaek, lyngby, 70);
oneWayRoad(glostrup, roskilde, 20);
oneWayRoad(koge, glostrup, 30);
twoWayRoad(roskilde, koge, 25);
twoWayRoad(roskilde, holbaek, 33);

// ...

private static void oneWayRoad(WeightedNode from, WeightedNode to, int km) {
    from.addNeighbor(to, km);
}

private static void twoWayRoad(WeightedNode a, WeightedNode b, int km) {
    a.addNeighbor(b, km);
    b.addNeighbor(a, km);
}
```

I chose the one-way roads on purpose, so that the direction changes the result. For example, there is a 70 km road from Holbæk to Lyngby, but not from Lyngby to Holbæk. A route from the Copenhagen area to Holbæk therefore has to go through Roskilde.

`buildMap()` returns the cities in a `LinkedHashMap<String, WeightedNode>`, so `main` can look them up by name:

[`Dijkstra.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/dijkstra/Dijkstra.java)

```java
Map<String, WeightedNode> cities = MapBuilder.buildMap();

WeightedNode start = cities.get("København");
WeightedNode end = cities.get("Holbæk");

FindShortestPath.findShortestPath(start, end);
```

## Step 3: A priority queue ordered by distance

Dijkstra always continues from the **closest city it has not finished yet**. To get that city quickly, I use Java's `PriorityQueue`, which is a min-heap: `poll()` returns the smallest element in O(log n).

The queue needs to know what "smallest" means, so each entry is a small `NodeWithDist` object that implements `Comparable` and compares on distance:

[`NodeWithDist.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/dijkstra/logic/entity/NodeWithDist.java)

```java
public class NodeWithDist implements Comparable<NodeWithDist> {
    public WeightedNode node;
    public int dist;

    @Override
    public int compareTo(NodeWithDist other) {
        return Integer.compare(this.dist, other.dist);
    }
}
```

I store the distance in the queue entry rather than reading it from the `dist` map. That way an entry keeps the distance it had when it was added, which matters for the "lazy deletion" in the next step.

## Step 4: The algorithm

[`FindShortestPath.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/dijkstra/logic/FindShortestPath.java#L10-L47)

```java
public static void findShortestPath(WeightedNode start, WeightedNode end) {
    Map<WeightedNode, Integer> dist = new HashMap<>();
    Map<WeightedNode, WeightedNode> prev = new HashMap<>();
    Set<WeightedNode> visited = new HashSet<>();
    PriorityQueue<NodeWithDist> queue = new PriorityQueue<>();

    dist.put(start, 0);
    queue.add(new NodeWithDist(start, 0));

    while (!queue.isEmpty()) {
        NodeWithDist current = queue.poll();

        if (current.node.equals(end)) break;
        if (visited.contains(current.node)) continue;

        visited.add(current.node);
        System.out.println(current.node.getName() + " er nu visited (" + current.dist + " km)");

        for (Map.Entry<WeightedNode, Integer> road : current.node.getNeighbors().entrySet()) {
            WeightedNode next = road.getKey();
            int roadLength = road.getValue();

            if (visited.contains(next)) continue;

            int newDist = current.dist + roadLength;
            int oldDist = dist.getOrDefault(next, Integer.MAX_VALUE);

            if (newDist < oldDist) {
                dist.put(next, newDist);
                prev.put(next, current.node);
                queue.add(new NodeWithDist(next, newDist));
                System.out.println("  Afstanden fra " + start.getName() + " til " + next.getName() + " er nu " + newDist + " km");
            }
        }
    }

    printResult(start, end, dist, prev);
}
```

These are the techniques the method uses:

| Technique | Where | Why |
|---|---|---|
| **`dist` map** with `getOrDefault(..., Integer.MAX_VALUE)` | `oldDist` | A city that isn't in the map yet counts as "∞", so I don't have to fill the map with infinity first. |
| **Edge relaxation** | `if (newDist < oldDist)` | If going through `current` is shorter than the best route found so far, update the distance and remember where we came from. |
| **`visited` set** | `visited.add(...)` | When a city is polled, its distance is **final**. No later route can be shorter, because every other city in the queue is at least as far away and road lengths are never negative. |
| **Lazy deletion** | `if (visited.contains(current.node)) continue;` | Java's `PriorityQueue` can't lower the priority of an element that is already in the queue. Instead, I add a **new** entry with the better distance and skip the old one when it comes out later. |
| **`prev` map** | `prev.put(next, current.node)` | Stores, for each city, which city it was reached from on the best route. The path is rebuilt from it at the end. |
| **Early exit** | `if (current.node.equals(end)) break;` | When the target is polled, its distance is final, so there is no reason to explore the rest of the map. |

### Rebuilding the path

`prev` only stores one step back for each city, so the path is rebuilt **backwards**: start at the target and follow `prev` until there is no previous city (the start). `path.add(0, ...)` inserts at the front, so the list comes out in the right order.

[`FindShortestPath.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/dijkstra/logic/FindShortestPath.java#L49-L64)

```java
if (!dist.containsKey(end)) {
    System.out.println("Der findes ingen vej fra " + start.getName() + " til " + end.getName());
    return;
}

List<String> path = new ArrayList<>();
for (WeightedNode city = end; city != null; city = prev.get(city)) {
    path.add(0, city.getName());
}
```

Because the roads are directed, there may be **no route at all** (for example, nothing leads *into* a city). This is handled by checking `dist.containsKey(end)` first.

## Result: København → Holbæk

This is the console output when running `Dijkstra.main`. I print every time a city becomes visited, and every time a shorter distance is found, so the run can be followed in the console as well:

```text
København er nu visited (0 km)
  Afstanden fra København til Hellerup er nu 7 km
  Afstanden fra København til Køge er nu 40 km
  Afstanden fra København til Emdrup er nu 6 km
  Afstanden fra København til Glostrup er nu 12 km
Emdrup er nu visited (6 km)
  Afstanden fra København til Lyngby er nu 13 km
Hellerup er nu visited (7 km)
Glostrup er nu visited (12 km)
  Afstanden fra København til Roskilde er nu 32 km
Lyngby er nu visited (13 km)
Roskilde er nu visited (32 km)
  Afstanden fra København til Holbæk er nu 65 km
Køge er nu visited (40 km)

Korteste vej: København -> Glostrup -> Roskilde -> Holbæk
Samlet afstand: 65 km
```

Some details from the run:

- Cities are visited in order of distance: 0, 6, 7, 12, 13, 32, 40. That ordering is what Dijkstra guarantees.
- Hellerup is visited at 7 km and never updated. The route through Emdrup (6 + 4 = 10) is longer.
- Roskilde gets 32 km via Glostrup. Lyngby → Roskilde would be 13 + 30 = 43, so that relaxation fails and nothing is printed.
- Lyngby → Holbæk does not exist (that road only goes the other way), so Holbæk can only be reached through Roskilde.

## The visualization

[`Visual.html`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/dijkstra/Visual.html) + [`Visual.js`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/dijkstra/Visual.js) is a step-by-step visualization in JavaScript that runs in the browser. It is the demo at the top of this post. It uses the same cities and roads as `MapBuilder`.

To decide what to show, I asked myself what you need to see to understand **why** Dijkstra picks the next city. My answer is three things: the map, the queue, and the dist/prev table. The page shows all three at the same time:

| What is shown | Why |
|---|---|
| **The map**, with one-way roads drawn as arrows | You can see the directed graph, and why some routes are impossible. |
| **City colours**: not reached / in queue / current / visited (final) / shortest path | You can see the frontier grow outwards from the start in order of distance. |
| **The road being checked** in each step, marked as "shorter" or "not shorter" | It makes the relaxation (`newDist < oldDist`) visible, one road at a time. |
| **The priority queue** as chips, smallest first, with old entries struck through | It shows the lazy deletion: a city can be in the queue more than once, and the old entry is skipped. |
| **The dist & prev table** | It shows the bookkeeping the path is rebuilt from at the end. |
| **"What happens"**: one sentence per step, e.g. *"Glostrup → Roskilde: 12 + 20 = 32 < ∞. Shorter!"* | It explains the step in words, like the console output. |

The controls are **Step / Back / Play / Reset**, a speed slider, arrow keys and space, and **From/To** selectors so you can try other routes. Being able to step **back** was important. When something surprising happens, you can go back and look at the step again.

To make stepping back easy, the JavaScript version doesn't animate while it runs. It runs the whole algorithm first and records a **snapshot** of the state after each step. The page then only has to show snapshot number *i*:

[`Visual.js`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/dijkstra/Visual.js#L47-L57)

```js
const snap = (extra) => steps.push({
    dist: { ...dist },
    prev: { ...prev },
    visited: new Set(visited),
    queue: queue.map(q => ({ ...q })),
    current: null,
    edge: null,
    kind: null,
    path: null,
    ...extra,
});
```

The algorithm in `runDijkstra` follows `FindShortestPath.java` line for line (a queue of `{node, dist}`, `visited`, `dist`, `prev`, lazy deletion and early exit). The only addition is a `snap(...)` call after each step.

## How to run it

- **Console:** run `graphs.dijkstra.Dijkstra`. Change the start and end cities in `main`.
- **Visualization:** use the [interactive demo at the top of this post](#the-top), or open `src/main/java/graphs/dijkstra/Visual.html` from the repo in a browser.

Next: [Part 2: A\* on a city grid]({{< relref "astar.md" >}}).
