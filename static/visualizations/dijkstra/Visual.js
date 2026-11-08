

const CITIES = {
    "København": { x: 710, y: 390 },
    "Køge":      { x: 440, y: 530 },
    "Holbæk":    { x: 100, y: 260 },
    "Roskilde":  { x: 280, y: 380 },
    "Lyngby":    { x: 530, y: 110 },
    "Glostrup":  { x: 500, y: 370 },
    "Emdrup":    { x: 620, y: 260 },
    "Hellerup":  { x: 750, y: 170 },
};

const ROADS = [
    ["København", "Hellerup", 7, true],
    ["København", "Emdrup", 6, false],
    ["København", "Glostrup", 12, true],
    ["København", "Køge", 40, true],
    ["Emdrup", "Hellerup", 4, false],
    ["Hellerup", "Lyngby", 8, true],
    ["Emdrup", "Lyngby", 7, true],
    ["Lyngby", "Glostrup", 14, false],
    ["Lyngby", "Roskilde", 30, true],
    ["Holbæk", "Lyngby", 70, false],
    ["Glostrup", "Roskilde", 20, false],
    ["Køge", "Glostrup", 30, false],
    ["Roskilde", "Køge", 25, true],
    ["Roskilde", "Holbæk", 33, true],
];

const NEIGHBORS = {};
for (const name in CITIES) NEIGHBORS[name] = [];
for (const [a, b, km, twoWay] of ROADS) {
    NEIGHBORS[a].push([b, km]);
    if (twoWay) NEIGHBORS[b].push([a, km]);
}

const edgeKey = (a, b) => (a < b ? a + "|" + b : b + "|" + a);

function runDijkstra(start, end) {
    const dist = { [start]: 0 };
    const prev = {};
    const visited = new Set();
    const queue = [{ node: start, dist: 0 }];
    const steps = [];

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

    snap({ kind: "start", msg: `Start in <b>${start}</b>: dist = 0. Put (${start}, 0) in the queue.` });

    while (queue.length > 0) {
        queue.sort((p, q) => p.dist - q.dist);
        const current = queue.shift();

        if (current.node === end) {
            snap({ kind: "stop", current: current.node,
                msg: `Polled <b>(${end}, ${current.dist})</b>. That is the target, so we can stop.` });
            break;
        }
        if (visited.has(current.node)) {
            snap({ kind: "skip", current: current.node,
                msg: `Polled <b>(${current.node}, ${current.dist})</b>, but ${current.node} is already visited. It's an old entry, so skip it.` });
            continue;
        }
        visited.add(current.node);
        snap({ kind: "poll", current: current.node,
            msg: `Polled <b>(${current.node}, ${current.dist})</b>, the closest city in the queue. Its distance is now final, so mark it visited.` });

        for (const [neighbor, km] of NEIGHBORS[current.node]) {
            if (visited.has(neighbor)) continue;
            const newDist = current.dist + km;
            const old = dist[neighbor];
            const oldText = old === undefined ? "∞" : old;
            if (old === undefined || newDist < old) {
                dist[neighbor] = newDist;
                prev[neighbor] = current.node;
                queue.push({ node: neighbor, dist: newDist });
                snap({ kind: "better", current: current.node, edge: [current.node, neighbor],
                    msg: `${current.node} → ${neighbor}: ${current.dist} + ${km} = <b>${newDist}</b> &lt; ${oldText}. Shorter! Update ${neighbor} and add (${neighbor}, ${newDist}) to the queue.` });
            } else {
                snap({ kind: "worse", current: current.node, edge: [current.node, neighbor],
                    msg: `${current.node} → ${neighbor}: ${current.dist} + ${km} = <b>${newDist}</b> ≥ ${oldText}. Not shorter, ignore it.` });
            }
        }
    }

    const path = [];
    if (dist[end] !== undefined) {
        for (let n = end; n !== undefined; n = prev[n]) path.unshift(n);
    }
    snap({
        kind: "done",
        path,
        msg: path.length
            ? `Shortest path: <b>${path.join(" → ")}</b><br>Total: <b>${dist[end]} km</b>`
            : `No path from ${start} to ${end}.`,
    });
    return steps;
}

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs, parent) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
}
function htmlEl(tag, attrs, parent, text) {
    const el = document.createElement(tag);
    Object.assign(el, attrs || {});
    if (text !== undefined) el.textContent = text;
    if (parent) parent.appendChild(el);
    return el;
}

const toolbar = htmlEl("div", { id: "toolbar", className: "card" }, document.body);

const startGroup = htmlEl("div", { className: "group" }, toolbar);
htmlEl("label", {}, startGroup, "From");
const startSel = htmlEl("select", {}, startGroup);
const endGroup = htmlEl("div", { className: "group" }, toolbar);
htmlEl("label", {}, endGroup, "To");
const endSel = htmlEl("select", {}, endGroup);
for (const name in CITIES) {
    htmlEl("option", { value: name }, startSel, name);
    htmlEl("option", { value: name }, endSel, name);
}
startSel.value = "København";
endSel.value = "Holbæk";

const btnGroup = htmlEl("div", { className: "group" }, toolbar);
const resetBtn = htmlEl("button", { title: "Reset (R)" }, btnGroup, "⟲ Reset");
const backBtn = htmlEl("button", { title: "Back (←)" }, btnGroup, "◀ Back");
const stepBtn = htmlEl("button", { title: "Step (→)" }, btnGroup, "Step ▶");
const playBtn = htmlEl("button", { className: "primary", title: "Play / pause (space)" }, btnGroup, "▶ Play");

const speedGroup = htmlEl("div", { className: "group" }, toolbar);
htmlEl("label", {}, speedGroup, "Speed");
const speed = htmlEl("input", { type: "range", min: 1, max: 5, value: 3 }, speedGroup);

htmlEl("div", { className: "spacer" }, toolbar);
const stepLabel = htmlEl("span", { id: "stepLabel" }, toolbar);
const progress = htmlEl("div", { id: "progress" }, toolbar);
const progressBar = htmlEl("div", { id: "progressBar" }, progress);

const wrap = htmlEl("div", { id: "wrap" }, document.body);
const mapCard = htmlEl("div", { id: "mapCard", className: "card" }, wrap);
const side = htmlEl("div", { id: "side" }, wrap);

const msgCard = htmlEl("div", { className: "card" }, side);
htmlEl("h3", {}, msgCard, "What happens");
const msg = htmlEl("div", { id: "msg" }, msgCard);

const queueCard = htmlEl("div", { className: "card" }, side);
htmlEl("h3", {}, queueCard, "Priority queue · smallest first");
const queueDiv = htmlEl("div", { id: "queue" }, queueCard);

const distCard = htmlEl("div", { className: "card" }, side);
htmlEl("h3", {}, distCard, "dist & prev");
const distTable = htmlEl("table", {}, distCard);
const hint = htmlEl("div", { className: "hint" }, distCard);
hint.innerHTML = "Keys: <kbd>←</kbd> <kbd>→</kbd> step · <kbd>space</kbd> play · <kbd>R</kbd> reset";

const W = 820, H = 600;
const svg = svgEl("svg", { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, mapCard);

const defs = svgEl("defs", {}, svg);
const bg = svgEl("linearGradient", { id: "bg", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
svgEl("stop", { offset: "0%", "stop-color": "#f8fbff" }, bg);
svgEl("stop", { offset: "100%", "stop-color": "#eef4fb" }, bg);
const dots = svgEl("pattern", { id: "dots", width: 22, height: 22, patternUnits: "userSpaceOnUse" }, defs);
svgEl("circle", { cx: 2, cy: 2, r: 1.2, fill: "#d5dfec" }, dots);
const shadow = svgEl("filter", { id: "shadow", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
svgEl("feDropShadow", { dx: 0, dy: 3, stdDeviation: 3, "flood-color": "#0f172a", "flood-opacity": 0.25 }, shadow);

svgEl("rect", { width: W, height: H, fill: "url(#bg)" }, svg);
svgEl("rect", { width: W, height: H, fill: "url(#dots)" }, svg);

const edgeLayer = svgEl("g", {}, svg);
const weightLayer = svgEl("g", {}, svg);
const nodeLayer = svgEl("g", {}, svg);

const edgeEls = {};
const arrowEls = {};
for (const [a, b, km, twoWay] of ROADS) {
    const p = CITIES[a], q = CITIES[b];
    edgeEls[edgeKey(a, b)] = svgEl("line", { class: "edge", x1: p.x, y1: p.y, x2: q.x, y2: q.y }, edgeLayer);
    const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
    if (!twoWay) {

        const ax = p.x + (q.x - p.x) * 0.7, ay = p.y + (q.y - p.y) * 0.7;
        const angle = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
        arrowEls[edgeKey(a, b)] = svgEl("path", { class: "arrow", d: "M 9 0 L -7 -8 L -7 8 Z",
            transform: `translate(${ax} ${ay}) rotate(${angle})` }, weightLayer);
    }
    const g = svgEl("g", { class: "weight" }, weightLayer);
    svgEl("rect", { x: mx - 15, y: my - 10, width: 30, height: 20, rx: 10 }, g);
    svgEl("text", { x: mx, y: my + 4, "text-anchor": "middle" }, g).textContent = km;
}

const nodeEls = {};
for (const name in CITIES) {
    const { x, y } = CITIES[name];
    const g = svgEl("g", { class: "node" }, nodeLayer);
    svgEl("circle", { class: "ring", cx: x, cy: y, r: 26 }, g);
    svgEl("circle", { class: "body", cx: x, cy: y, r: 26 }, g);
    const distText = svgEl("text", { class: "dist", x, y: y + 5, "text-anchor": "middle" }, g);
    svgEl("text", { class: "name", x, y: y - 36, "text-anchor": "middle" }, g).textContent = name;
    const tag = svgEl("text", { class: "tag", x, y: y + 46, "text-anchor": "middle" }, g);
    nodeEls[name] = { g, distText, tag };
}

const legend = htmlEl("div", { id: "legend" }, mapCard);
for (const [label, color] of [
    ["Not reached", "--unreached"], ["In queue", "--queue"], ["Current", "--current"],
    ["Visited (final)", "--visited"], ["Shortest path", "--path"],
]) {
    const s = htmlEl("span", {}, legend, label);
    s.style.setProperty("--c", `var(${color})`);
}
htmlEl("span", { className: "noDot" }, legend, "▶ = one-way road · no arrow = two-way road");

const NODE_COLORS = { queue: "--queue", visited: "--visited", current: "--current", path: "--path" };
let steps = [];
let index = 0;
let timer = null;

function nodeState(s, name) {
    if (s.path && s.path.includes(name)) return "path";
    if (name === s.current) return "current";
    if (s.visited.has(name)) return "visited";
    if (s.queue.some(q => q.node === name)) return "queue";
    return "unreached";
}

function render() {
    const s = steps[index];
    const start = startSel.value, end = endSel.value;

    const pathEdges = new Set();
    if (s.path) for (let i = 1; i < s.path.length; i++) pathEdges.add(edgeKey(s.path[i - 1], s.path[i]));
    const treeEdges = new Set(Object.entries(s.prev).map(([n, p]) => edgeKey(n, p)));
    const activeEdge = s.edge ? edgeKey(...s.edge) : null;
    for (const key in edgeEls) {
        let cls = "edge";
        if (pathEdges.has(key)) cls += " path";
        else if (key === activeEdge) cls += " " + s.kind;
        else if (!s.path && treeEdges.has(key)) cls += " tree";
        edgeEls[key].setAttribute("class", cls);
        if (arrowEls[key]) arrowEls[key].setAttribute("class", cls.replace("edge", "arrow"));
    }

    for (const name in nodeEls) {
        const { g, distText, tag } = nodeEls[name];
        g.setAttribute("class", "node " + nodeState(s, name));
        distText.textContent = s.dist[name] === undefined ? "∞" : s.dist[name];
        tag.textContent = name === start ? "START" : name === end ? "TARGET" : "";
    }

    msg.className = s.kind;
    msg.innerHTML = s.msg;

    queueDiv.innerHTML = "";
    const sortedQueue = [...s.queue].sort((p, q) => p.dist - q.dist);
    if (sortedQueue.length === 0) htmlEl("span", { className: "empty" }, queueDiv, "empty");
    sortedQueue.forEach((q, i) => {
        let cls = "chip";
        if (s.visited.has(q.node) || s.kind === "done") cls += " stale";
        else if (i === 0) cls += " next";
        htmlEl("span", { className: cls }, queueDiv, `${q.node} · ${q.dist}`);
    });

    const changed = s.kind === "better" ? s.edge[1] : null;
    distTable.innerHTML = "<tr><th>City</th><th>dist</th><th>prev</th></tr>";
    for (const name in CITIES) {
        const state = nodeState(s, name);
        let cls = s.visited.has(name) ? "visited" : "";
        if (name === changed) cls += " changed";
        const row = htmlEl("tr", { className: cls }, distTable);
        const cell = htmlEl("td", {}, row);
        const dot = htmlEl("span", { className: "dot" }, cell);
        dot.style.setProperty("--c", `var(${NODE_COLORS[state] || "--unreached"})`);
        cell.append(name + (s.visited.has(name) ? " ✓" : ""));
        htmlEl("td", {}, row, s.dist[name] === undefined ? "∞" : s.dist[name]);
        htmlEl("td", {}, row, s.prev[name] || "–");
    }

    stepLabel.textContent = `Step ${index + 1} / ${steps.length}`;
    progressBar.style.width = `${(index / (steps.length - 1)) * 100}%`;
    backBtn.disabled = index === 0;
    stepBtn.disabled = index === steps.length - 1;
}

function stopPlaying() {
    clearTimeout(timer);
    timer = null;
    playBtn.textContent = "▶ Play";
}

function tick() {
    if (index >= steps.length - 1) return stopPlaying();
    index++;
    render();
    timer = setTimeout(tick, 1600 / speed.value);
}

function togglePlay() {
    if (timer) return stopPlaying();
    if (index >= steps.length - 1) { index = 0; render(); }
    playBtn.textContent = "❚❚ Pause";
    timer = setTimeout(tick, 1600 / speed.value);
}

function step(delta) {
    const next = index + delta;
    if (next < 0 || next >= steps.length) return;
    index = next;
    render();
}

function reset() {
    stopPlaying();
    steps = runDijkstra(startSel.value, endSel.value);
    index = 0;
    render();
}

stepBtn.onclick = () => step(1);
backBtn.onclick = () => step(-1);
resetBtn.onclick = reset;
playBtn.onclick = togglePlay;
startSel.onchange = reset;
endSel.onchange = reset;

document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "SELECT") return;
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === " ") { e.preventDefault(); togglePlay(); }
    else if (e.key === "r" || e.key === "R") reset();
});

reset();
