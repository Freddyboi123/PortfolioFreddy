+++
title = "A*: shortest route between cities on a grid"
date = "2026-11-08T12:30:00+01:00"
draft = false
description = "How I implemented A* in Java on a 12×12 grid with 8 named cities, using Manhattan distance as the heuristic, and how the visualization compares it with Dijkstra."
summary = "How I implemented A* in Java on a 12×12 grid with 8 named cities, using Manhattan distance as the heuristic, and how the visualization compares it with Dijkstra."
tags = ["AP", "A*", "Graphs", "Shortest path", "Heuristics", "Java", "Visualization"]
categories = ["Advanced Programming"]
series = ["Advanced Programming"]
series_order = 2
weight = 2
+++

{{< algorithm-demo name="astar" title="Interactive A* visualization" caption="Try it: press Play, or step with ← →. Tick “Dijkstra mode” to compare with h = 0." >}}

This is part 2 of the assignment [**Grafer og korteste vej**]({{< relref "posts/advanced-programming/grafer-og-korteste-vej/_index.md" >}}). Part 1 is [Dijkstra on a directed road network]({{< relref "dijkstra.md" >}}). A\* builds directly on it.

**Code:** [`graphs/astar`](https://github.com/Freddyboi123/AdvancedPrograming/tree/main/src/main/java/graphs/astar) in my [AdvancedPrograming repository](https://github.com/Freddyboi123/AdvancedPrograming).

## The task

> Implement A* to find the shortest route between cities on a grid.
>
> - Design your own grid, at least 8×8, with cities in some cells and roads between them
> - Give your cities names, e.g. Nordby, Sydby, Østby and Vestby
> - Find the shortest route from one city to another
> - Make a visualization that makes sense. What is useful to see when you want to understand the algorithm?

## How the code is organised

```text
graphs/astar/
├── Astar.java               main: builds the grid and picks start and destination
├── logic/
│   ├── GridBuilder.java     the grid: roads, cities and neighbours
│   ├── AStarSolver.java     the heuristic, the algorithm and printing the result
│   └── entity/
│       ├── GridCell.java    one cell: row, col, optional city name, neighbours
│       └── NodeWithDist.java  a queue entry: (cell, g, h, f), sorted by f
├── Visual.html              the visualization (open in a browser)
└── Visual.js
```

It has the same structure as my Dijkstra solution: data, algorithm and entry point are kept apart.

## Step 1: Drawing the grid as text

I wanted to be able to *see* the map in the code, so the grid is an array of strings with one character per cell:

- `.` = no road (the cell isn't part of the graph)
- `#` = road
- a letter = a city (a city is also a road cell)

[`GridBuilder.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/astar/logic/GridBuilder.java#L10-L36)

```java
private static final char NO_ROAD = '.';

private static final String[] GRID = {
        ".....N####..",
        ".....#...#..",
        ".B####...##K",
        ".#...#.....#",
        ".#...###M###",
        "V###....#..#",
        "#..######..#",
        "#.....#....O",
        "#.....#....#",
        "###H####...#",
        ".......#...#",
        ".......S####",
};

private static final Map<Character, String> CITY_NAMES = Map.of(
        'N', "Nordby",
        'S', "Sydby",
        'O', "Østby",
        'V', "Vestby",
        'M', "Midtby",
        'B', "Bakkeby",
        'K', "Kystby",
        'H', "Havnby"
);
```

The grid is **12×12** and has **8 cities**. I placed the roads so that the direct line is often blocked. For example, Nordby (top) and Sydby (bottom) can't be connected in a straight line, so the algorithm has to find a way around.

## Step 2: From characters to a graph

`GridBuilder.build()` converts the text in two passes:

1. It creates a `GridCell` for every cell that isn't `.`. The city name comes from `CITY_NAMES.get(symbol)`, which gives `null` for an ordinary road.
2. It connects each cell to its neighbours **up, down, left and right** (4-connectivity), when the neighbour is inside the grid and is a road.

[`GridBuilder.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/astar/logic/GridBuilder.java#L38-L70)

```java
private static final int[][] DIRECTIONS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

public static GridCell[][] build() {
    int rows = GRID.length;
    int cols = GRID[0].length();
    GridCell[][] cells = new GridCell[rows][cols];

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            char symbol = GRID[r].charAt(c);
            if (symbol != NO_ROAD) {
                cells[r][c] = new GridCell(r, c, CITY_NAMES.get(symbol));
            }
        }
    }

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (cells[r][c] == null) continue;

            for (int[] direction : DIRECTIONS) {
                int nr = r + direction[0];
                int nc = c + direction[1];
                boolean insideGrid = nr >= 0 && nr < rows && nc >= 0 && nc < cols;

                if (insideGrid && cells[nr][nc] != null) {
                    cells[r][c].addNeighbor(cells[nr][nc]);
                }
            }
        }
    }
    return cells;
}
```

The `DIRECTIONS` array means I don't have to write four nearly identical `if` statements. Cells without a road stay `null`, so "is there a road here?" is just a `null` check.

Each `GridCell` knows its position, its neighbours and, optionally, its name. `label()` makes the console output readable: a city is printed as `Midtby (4,8)` and a road cell as `(4,7)`.

[`GridCell.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/astar/logic/entity/GridCell.java)

```java
public boolean isCity() { return name != null; }

public String label() {
    String position = "(" + row + "," + col + ")";
    return isCity() ? name + " " + position : position;
}
```

`GridBuilder.cities(...)` collects all city cells in a `Map<String, GridCell>`, so `main` can pick start and destination by name:

[`Astar.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/astar/Astar.java)

```java
GridCell[][] grid = GridBuilder.build();
Map<String, GridCell> cities = GridBuilder.cities(grid);

GridCell start = cities.get("Nordby");
GridCell destination = cities.get("Sydby");

AStarSolver.findShortestPath(start, destination);
```

## Step 3: The heuristic, Manhattan distance

The difference between A\* and Dijkstra is the **heuristic** *h*, an estimate of how far a cell is from the destination. Each queue entry has three numbers:

- **g**: the actual distance from the start (the number of steps so far)
- **h**: the estimated distance left to the destination
- **f = g + h**: the estimated length of the whole route through this cell

The queue is sorted on **f** instead of g. A\* therefore prefers cells that are both close to the start *and* seem to lead towards the destination.

[`NodeWithDist.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/astar/logic/entity/NodeWithDist.java)

```java
public NodeWithDist(GridCell node, int gCost, int hCost) {
    this.node = node;
    this.gCost = gCost;
    this.hCost = hCost;
    this.fCost = gCost + hCost;
}

@Override
public int compareTo(NodeWithDist other) {
    return Integer.compare(this.fCost, other.fCost);
}
```

As the heuristic I use **Manhattan distance**, the number of rows plus the number of columns between two cells:

[`AStarSolver.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/astar/logic/AStarSolver.java#L10-L13)

```java
private static int heuristic(GridCell cell, GridCell destination) {
    return Math.abs(destination.getRow() - cell.getRow())
            + Math.abs(destination.getCol() - cell.getCol());
}
```

I chose Manhattan because it fits my grid exactly. You can only move up, down, left and right, and every step costs 1, so the Manhattan distance is the shortest possible route *if there were no gaps in the roads*. A real route can only be the same length or longer. The heuristic therefore **never overestimates**, which means it is *admissible*, and that guarantees A\* still finds the shortest route.

## Step 4: The algorithm

[`AStarSolver.java`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/astar/logic/AStarSolver.java#L15-L49)

```java
public static void findShortestPath(GridCell start, GridCell destination) {
    Map<GridCell, Integer> dist = new HashMap<>();
    Map<GridCell, GridCell> prev = new HashMap<>();
    Set<GridCell> visited = new HashSet<>();
    PriorityQueue<NodeWithDist> queue = new PriorityQueue<>();

    dist.put(start, 0);
    queue.add(new NodeWithDist(start, 0, heuristic(start, destination)));

    while (!queue.isEmpty()) {
        NodeWithDist current = queue.poll();

        if (current.node.equals(destination)) break;
        if (visited.contains(current.node)) continue;

        visited.add(current.node);
        System.out.println(current.node.label() + " er nu visited (g = " + current.gCost + ", f = " + current.fCost + ")");

        for (GridCell neighbor : current.node.getNeighbors()) {
            if (visited.contains(neighbor)) continue;

            int newDist = current.gCost + 1;
            int oldDist = dist.getOrDefault(neighbor, Integer.MAX_VALUE);

            if (newDist < oldDist) {
                dist.put(neighbor, newDist);
                prev.put(neighbor, current.node);
                queue.add(new NodeWithDist(neighbor, newDist, heuristic(neighbor, destination)));
                System.out.println("  Afstanden fra " + start.getName() + " til " + neighbor.label() + " er nu " + newDist);
            }
        }
    }

    printResult(start, destination, dist, prev, visited.size());
}
```

This is deliberately the **same skeleton as my Dijkstra**: a `PriorityQueue` min-heap, a `dist` map with `getOrDefault(..., MAX_VALUE)` as ∞, a `visited` set with lazy deletion, edge relaxation, a `prev` map for the path, and an early exit when the destination is polled. Only three things are different:

| | Dijkstra | A\* |
|---|---|---|
| Graph | `WeightedNode` with a `Map` of road lengths | `GridCell` with a `List` of neighbours |
| Cost of an edge | the length of the road (`roadLength`) | always `1` (one step) |
| The queue is sorted by | `dist` (g) | `fCost = g + h` |

The `dist` map still stores **g**, the actual distance. **h** is only used to decide the *order* the cells are explored in. I think this is the most important point: the heuristic changes which cells you explore, not the length of the route you find.

The path is rebuilt the same way as in Dijkstra, by following `prev` back from the destination. `printResult` also prints **how many cells were visited**, so the work can be compared with Dijkstra.

## Result: Nordby → Sydby

The end of the console output from `Astar.main`:

```text
Nordby (0,5) er nu visited (g = 0, f = 13)
  Afstanden fra Nordby til (1,5) er nu 1
  Afstanden fra Nordby til (0,6) er nu 1
(1,5) er nu visited (g = 1, f = 13)
...
(10,7) er nu visited (g = 16, f = 17)
  Afstanden fra Nordby til Sydby (11,7) er nu 17

Korteste vej: Nordby (0,5) -> (1,5) -> (2,5) -> (3,5) -> (4,5) -> (4,6) -> (4,7) -> Midtby (4,8) -> (5,8) -> (6,8) -> (6,7) -> (6,6) -> (7,6) -> (8,6) -> (9,6) -> (9,7) -> (10,7) -> Sydby (11,7)
Samlet afstand: 17 skridt
Antal visited celler: 26
```

At the start, h = |11 − 0| + |7 − 5| = **13**. Along the first part of the route, f stays at 13: each step down increases g by 1 and decreases h by 1. A\* follows the cells with f = 13 first. Only when the road turns away from Sydby (out to Midtby) does f increase to 15 and then 17. That is when A\* starts trying other cells.

### A\* vs. Dijkstra on the same grid

If the heuristic is set to 0, f = g, and A\* turns into exactly Dijkstra. I ran the same route both ways:

| | Route | Visited cells |
|---|---|---|
| A\* (Manhattan) | 17 steps | **26** |
| Dijkstra (h = 0) | 17 steps | **57** |

They find the same shortest route, but A\* needs fewer than half as many visited cells. Dijkstra spreads out evenly in all directions. A\* is pulled towards Sydby.

## The visualization

[`Visual.html`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/astar/Visual.html) + [`Visual.js`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/astar/Visual.js) is a step-by-step visualization in JavaScript (the demo at the top of this post) with the same grid and city names as `GridBuilder`. It uses the same snapshot approach as my Dijkstra visualization: the whole run is recorded first, so you can step both forwards and backwards.

What's new in A\* is **g, h and f**, so the visualization focuses on those numbers:

| What is shown | Why |
|---|---|
| **g, h and f in each reached cell** | You can see why a cell is chosen: it has the lowest f, even if its g isn't the lowest. |
| **"Show h everywhere"** | Shows h in cells that haven't been reached yet too, so you can see the heuristic as a "slope" down towards the destination. |
| **Cell colours**: no road / road / city / in queue / current / visited / shortest path | You can see the explored area stretch towards the destination, instead of spreading out evenly as in Dijkstra. |
| **The priority queue sorted by f**, with old entries struck through | It shows that the queue is now ordered by f, and that lazy deletion works the same way as in Dijkstra. |
| **Progress**: visited cells, in queue, path length | Gives numbers for how much work the algorithm has done. |
| **"Dijkstra mode (h = 0)"** | The most important feature. You can run the same route with and without the heuristic and see the difference straight away. |

The **Dijkstra mode** toggle was my most important design decision. The best way to understand what the heuristic does is to switch it off and see what happens. In the code, the toggle just replaces h with 0:

[`Visual.js`](https://github.com/Freddyboi123/AdvancedPrograming/blob/main/src/main/java/graphs/astar/Visual.js#L35-L38)

```js
const heuristic = (r, c, goal) => Math.abs(goal[0] - r) + Math.abs(goal[1] - c);

function runAstar(start, goal, useHeuristic) {
    const h = (r, c) => (useHeuristic ? heuristic(r, c, goal) : 0);
```

The last step tells you how many of the open cells were visited (*"A\* visited 26 of … open cells. Toggle Dijkstra mode to compare."*). There are also **From/To** selectors for all 8 cities, a speed slider, a **Result** button that jumps to the end, and keyboard shortcuts.

## How to run it

- **Console:** run `graphs.astar.Astar`. Change the cities in `main`.
- **Visualization:** use the [interactive demo at the top of this post](#the-top), or open `src/main/java/graphs/astar/Visual.html` from the repo in a browser.

Back to the assignment: [Grafer og korteste vej]({{< relref "posts/advanced-programming/grafer-og-korteste-vej/_index.md" >}}) · Previous: [Part 1: Dijkstra]({{< relref "dijkstra.md" >}}).
