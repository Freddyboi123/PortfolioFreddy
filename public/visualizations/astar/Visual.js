

const GRID = [
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
];
const CITY_NAMES = { N: "Nordby", S: "Sydby", O: "Østby", V: "Vestby", M: "Midtby", B: "Bakkeby", K: "Kystby", H: "Havnby" };
const ROWS = GRID.length, COLS = GRID[0].length;

const CITIES = {}, CITY_AT = {};
for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const n = CITY_NAMES[GRID[r][c]];
    if (n) { CITIES[n] = [r, c]; CITY_AT[r + "," + c] = n; }
}

const key = (r, c) => r + "," + c;
const name = ([r, c]) => CITY_AT[key(r, c)] || `(${r},${c})`;
const isOpen = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS && GRID[r][c] !== ".";

const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
function neighbors(r, c) {
    return DIRECTIONS.map(([dr, dc]) => [r + dr, c + dc]).filter(([nr, nc]) => isOpen(nr, nc));
}

const heuristic = (r, c, goal) => Math.abs(goal[0] - r) + Math.abs(goal[1] - c);

function runAstar(start, goal, useHeuristic) {
    const h = (r, c) => (useHeuristic ? heuristic(r, c, goal) : 0);
    const startKey = key(...start), goalKey = key(...goal);
    const dist = { [startKey]: 0 };
    const prev = {};
    const visited = new Set();
    const queue = [{ cell: start, g: 0, f: h(...start) }];
    const steps = [];

    const snap = (extra) => steps.push({
        dist: { ...dist },
        visited: new Set(visited),
        queue: queue.map(q => ({ ...q })),
        current: null,
        check: null,
        kind: null,
        path: null,
        ...extra,
    });

    snap({ kind: "start",
        msg: `Start in <b>${name(start)}</b>, goal is <b>${name(goal)}</b>: g = 0, h = ${h(...start)}, so f = ${h(...start)}. Put it in the queue.` });

    while (queue.length > 0) {
        queue.sort((a, b) => a.f - b.f);
        const current = queue.shift();
        const curKey = key(...current.cell);

        if (curKey === goalKey) {
            snap({ kind: "stop", current: curKey,
                msg: `Polled <b>${name(current.cell)}</b> with f = ${current.f}. That is the goal, so stop.` });
            break;
        }
        if (visited.has(curKey)) {
            snap({ kind: "skip", current: curKey,
                msg: `Polled <b>${name(current.cell)}</b>, but it is already visited. It's an old entry, so skip it.` });
            continue;
        }
        visited.add(curKey);
        snap({ kind: "poll", current: curKey,
            msg: `Polled <b>${name(current.cell)}</b>, the lowest f in the queue: f = g + h = ${current.g} + ${current.f - current.g} = <b>${current.f}</b>. Mark it visited.` });

        for (const nb of neighbors(...current.cell)) {
            const nbKey = key(...nb);
            if (visited.has(nbKey)) continue;
            const newDist = current.g + 1;
            const old = dist[nbKey];
            const oldText = old === undefined ? "∞" : old;
            if (old === undefined || newDist < old) {
                dist[nbKey] = newDist;
                prev[nbKey] = current.cell;
                const f = newDist + h(...nb);
                queue.push({ cell: nb, g: newDist, f });
                snap({ kind: "better", current: curKey, check: nbKey,
                    msg: `Neighbor <b>${name(nb)}</b>: g = ${current.g} + 1 = ${newDist} &lt; ${oldText}. Better! h = ${h(...nb)}, so f = <b>${f}</b>. Add it to the queue.` });
            } else {
                snap({ kind: "worse", current: curKey, check: nbKey,
                    msg: `Neighbor <b>${name(nb)}</b>: g = ${current.g} + 1 = ${newDist} ≥ ${oldText}. Not better, ignore it.` });
            }
        }
    }

    const path = [];
    if (dist[goalKey] !== undefined) {
        for (let cell = goal; cell; cell = prev[key(...cell)]) path.unshift(cell);
    }
    snap({
        kind: "done",
        path,
        msg: path.length
            ? `Shortest path found: <b>${dist[goalKey]} steps</b>.<br>${useHeuristic ? "A*" : "Dijkstra"} visited ${visited.size} of ${openCount} open cells. Toggle Dijkstra mode to compare.`
            : `No path from ${name(start)} to ${name(goal)}.`,
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

let start = CITIES["Nordby"];
let goal = CITIES["Sydby"];
const openCount = GRID.join("").replace(/\./g, "").length;

const toolbar = htmlEl("div", { id: "toolbar", className: "card" }, document.body);

const startGroup = htmlEl("div", { className: "group" }, toolbar);
htmlEl("label", {}, startGroup, "From");
const startSel = htmlEl("select", {}, startGroup);
const endGroup = htmlEl("div", { className: "group" }, toolbar);
htmlEl("label", {}, endGroup, "To");
const endSel = htmlEl("select", {}, endGroup);
for (const n in CITIES) {
    htmlEl("option", { value: n }, startSel, n);
    htmlEl("option", { value: n }, endSel, n);
}
startSel.value = "Nordby";
endSel.value = "Sydby";
startSel.onchange = endSel.onchange = () => {
    start = CITIES[startSel.value];
    goal = CITIES[endSel.value];
    reset();
};

const btnGroup = htmlEl("div", { className: "group" }, toolbar);
const resetBtn = htmlEl("button", { title: "Reset (R)" }, btnGroup, "⟲ Reset");
const backBtn = htmlEl("button", { title: "Back (←)" }, btnGroup, "◀ Back");
const stepBtn = htmlEl("button", { title: "Step (→)" }, btnGroup, "Step ▶");
const playBtn = htmlEl("button", { className: "primary", title: "Play / pause (space)" }, btnGroup, "▶ Play");
const endBtn = htmlEl("button", { title: "Jump to result (E)" }, btnGroup, "⏭ Result");

const speedGroup = htmlEl("div", { className: "group" }, toolbar);
htmlEl("label", {}, speedGroup, "Speed");
const speed = htmlEl("input", { type: "range", min: 1, max: 10, value: 5 }, speedGroup);

const optGroup = htmlEl("div", { className: "group" }, toolbar);
const showH = htmlEl("input", { type: "checkbox", id: "showH", checked: true }, optGroup);
htmlEl("label", { htmlFor: "showH" }, optGroup, "Show h everywhere");
const dijkstraMode = htmlEl("input", { type: "checkbox", id: "dijkstra" }, optGroup);
htmlEl("label", { htmlFor: "dijkstra" }, optGroup, "Dijkstra mode (h = 0)");

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

const statsCard = htmlEl("div", { className: "card" }, side);
htmlEl("h3", {}, statsCard, "Progress");
const stats = htmlEl("div", { id: "stats" }, statsCard);
const statEls = {};
for (const [id, label] of [["visited", "visited cells"], ["queue", "in queue"], ["path", "path length"]]) {
    const box = htmlEl("div", { className: "stat" }, stats);
    statEls[id] = htmlEl("div", { className: "num" }, box, "0");
    htmlEl("div", { className: "lbl" }, box, label);
}
const formula = htmlEl("div", { className: "formula" }, statsCard);
formula.innerHTML =
    `<div class="mini"><i style="left:4px">g</i><i style="right:4px">h</i><b>f</b></div>` +
    `<div><b>g</b> = steps from start<br><b>h</b> = Manhattan distance to goal<br><b>f</b> = g + h (the queue sorts by this)</div>`;

const queueCard = htmlEl("div", { className: "card" }, side);
htmlEl("h3", {}, queueCard, "Priority queue · lowest f first");
const queueDiv = htmlEl("div", { id: "queue" }, queueCard);
const hint = htmlEl("div", { className: "hint" }, queueCard);
hint.innerHTML =
    "Keys: <kbd>←</kbd> <kbd>→</kbd> step · <kbd>space</kbd> play · <kbd>E</kbd> result · <kbd>R</kbd> reset";

const CELL = 50;
const svg = svgEl("svg", { width: COLS * CELL, height: ROWS * CELL, viewBox: `0 0 ${COLS * CELL} ${ROWS * CELL}` }, mapCard);

const cellLayer = svgEl("g", {}, svg);
const pathLine = svgEl("polyline", { class: "path-line", points: "" }, svg);
const textLayer = svgEl("g", {}, svg);

const cellEls = {};
for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
        const x = c * CELL, y = r * CELL;
        const ch = GRID[r][c];
        const base = ch === "." ? "cell wall" : CITY_NAMES[ch] ? "cell city" : "cell";
        const g = svgEl("g", { class: base }, cellLayer);
        svgEl("rect", { class: "bg", x, y, width: CELL, height: CELL, rx: 6 }, g);
        if (ch === ".") continue;
        svgEl("rect", { class: "ring", x: x + 3, y: y + 3, width: CELL - 6, height: CELL - 6, rx: 6 }, g);
        svgEl("rect", { class: "check", x: x + 4, y: y + 4, width: CELL - 8, height: CELL - 8, rx: 5 }, g);
        const t = svgEl("g", { class: "cell" }, textLayer);
        const els = {
            g, t,
            gText: svgEl("text", { class: "g", x: x + 6, y: y + 13 }, t),
            hText: svgEl("text", { class: "h", x: x + CELL - 6, y: y + 13, "text-anchor": "end" }, t),
            fText: svgEl("text", { class: "f", x: x + CELL / 2, y: y + CELL / 2 + 9, "text-anchor": "middle" }, t),
            tag: svgEl("text", { class: "tag", x: x + CELL / 2, y: y + CELL / 2 + 7, "text-anchor": "middle" }, t),
            base,
        };
        if (CITY_NAMES[ch]) {
            svgEl("text", { class: "cityName", x: x + CELL / 2, y: y + CELL - 4, "text-anchor": "middle" }, t)
                .textContent = CITY_NAMES[ch];
        }
        cellEls[key(r, c)] = els;
    }
}

const legend = htmlEl("div", { id: "legend" }, mapCard);
for (const [label, color] of [
    ["No road", "--wall"], ["Road", "--open"], ["City", "--city"], ["In queue", "--queue"],
    ["Current", "--current"], ["Visited", "--visited"], ["Shortest path", "--path"],
]) {
    const s = htmlEl("span", {}, legend, label);
    s.style.setProperty("--c", `var(${color})`);
}

let steps = [];
let index = 0;
let timer = null;

function render() {
    const s = steps[index];
    const useH = !dijkstraMode.checked;
    const startKey = key(...start), goalKey = key(...goal);
    const pathKeys = new Set((s.path || []).map(p => key(...p)));
    const inQueue = new Set(s.queue.map(q => key(...q.cell)));

    for (const k in cellEls) {
        const { g, t, gText, hText, fText, tag, base } = cellEls[k];
        const [r, c] = k.split(",").map(Number);
        let state = "";
        if (inQueue.has(k)) state = "queue";
        if (s.visited.has(k)) state = "visited";
        if (k === s.current) state = "current";
        if (pathKeys.has(k)) state = "path";
        let cls = base + " " + state;
        if (k === s.check) cls += " " + s.kind;
        g.setAttribute("class", cls);
        t.setAttribute("class", base + " " + state);

        const hVal = useH ? heuristic(r, c, goal) : 0;
        const gVal = s.dist[k];
        const isEnd = k === startKey || k === goalKey;
        if (gVal !== undefined) {
            gText.textContent = gVal;
            hText.textContent = hVal;
            fText.textContent = isEnd || state === "path" ? "" : gVal + hVal;
            fText.setAttribute("class", "f");
        } else {
            gText.textContent = "";
            hText.textContent = "";
            fText.textContent = showH.checked && useH && !isEnd ? hVal : "";
            fText.setAttribute("class", "f hint");
        }
        tag.textContent = k === startKey ? "S" : k === goalKey ? "G" : "";
    }

    pathLine.setAttribute("points", (s.path || [])
        .map(([r, c]) => `${c * CELL + CELL / 2},${r * CELL + CELL / 2}`).join(" "));

    msg.className = s.kind;
    msg.innerHTML = s.msg;

    statEls.visited.textContent = s.visited.size;
    statEls.queue.textContent = s.queue.filter(q => !s.visited.has(key(...q.cell))).length;
    statEls.path.textContent = s.path && s.path.length ? s.path.length - 1 : "–";

    queueDiv.innerHTML = "";
    const sortedQueue = [...s.queue].sort((a, b) => a.f - b.f);
    if (sortedQueue.length === 0) htmlEl("span", { className: "empty" }, queueDiv, "empty");
    sortedQueue.forEach((q, i) => {
        let cls = "chip";
        if (s.visited.has(key(...q.cell)) || s.kind === "done") cls += " stale";
        else if (i === 0) cls += " next";
        htmlEl("span", { className: cls }, queueDiv, `${name(q.cell)} f=${q.f}`);
    });

    stepLabel.textContent = `Step ${index + 1} / ${steps.length}`;
    progressBar.style.width = `${(index / (steps.length - 1)) * 100}%`;
    backBtn.disabled = index === 0;
    stepBtn.disabled = endBtn.disabled = index === steps.length - 1;
}

function stopPlaying() {
    clearTimeout(timer);
    timer = null;
    playBtn.textContent = "▶ Play";
}

const delay = () => 1500 / speed.value;

function tick() {
    if (index >= steps.length - 1) return stopPlaying();
    index++;
    render();
    timer = setTimeout(tick, delay());
}

function togglePlay() {
    if (timer) return stopPlaying();
    if (index >= steps.length - 1) { index = 0; render(); }
    playBtn.textContent = "❚❚ Pause";
    timer = setTimeout(tick, delay());
}

function step(delta) {
    const next = index + delta;
    if (next < 0 || next >= steps.length) return;
    index = next;
    render();
}

function reset() {
    stopPlaying();
    steps = runAstar(start, goal, !dijkstraMode.checked);
    index = 0;
    render();
}

stepBtn.onclick = () => step(1);
backBtn.onclick = () => step(-1);
endBtn.onclick = () => { stopPlaying(); index = steps.length - 1; render(); };
resetBtn.onclick = reset;
playBtn.onclick = togglePlay;
showH.onchange = render;
dijkstraMode.onchange = reset;

document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
    if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === " ") { e.preventDefault(); togglePlay(); }
    else if (e.key === "e" || e.key === "E") endBtn.onclick();
    else if (e.key === "r" || e.key === "R") reset();
});

reset();
