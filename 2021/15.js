var fs = require("fs");

var lines = s => s.trim().split("\n");
var int = s => parseInt(s, 10);

var sum = xs => xs.reduce((a, b) => a + b, 0);
var mod = (a, b) => a - b * Math.floor(a / b);
var wrap = (x, a, b) => a + mod(x - a, b - a); // Assumes a < b.
var manhattan = (a, b) => Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
var swap = (a, i, j) => [a[j], a[i]] = [a[i], a[j]];

// https://en.wikipedia.org/wiki/Binary_heap
class MinHeap {
  constructor() { this.xs = []; }
  push(v, p) {
    var i = this.xs.push({v: v, p: p}) - 1, parent = (i - 1) >>> 1;
    while (i > 0) if (this.xs[i].p < this.xs[parent].p) {
      swap(this.xs, i, parent);
      [i, parent] = [parent, (parent - 1) >>> 1];
    } else break;
  }
  pop() {
    var v = this.xs[0];
    this.xs[0] = this.xs.pop();
    var root = 0, s = root, l = 2 * root + 1, r = 2 * root + 2;
    while (l <= this.xs.length - 1) {
      if (this.xs[l].p < this.xs[s].p) s = l;
      if (r <= this.xs.length - 1 && this.xs[r].p < this.xs[s].p) s = r;
      if (s !== root) {
        swap(this.xs, root, s);
        [s, root, l, r] = [s, s, 2 * s + 1, 2 * s + 2];
      } else break;
    }
    return v;
  }
  get size() { return this.xs.length; }
}

// https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
function dijkstra(xs, w, h, start, end) {
  var dist = Array(w * h).fill(Infinity), prev = Array(w * h).fill(null);
  var q = new MinHeap();

  dist[start.x + start.y * w] = 0;
  q.push(xs[start.x + start.y * w], 0);

  while (q.size > 0) {
    var {v: u, p: p} = q.pop();
    var ux = u.x, uy = u.y, ui = ux + uy * w;

    if (u === end) {
      var S = [];
      // The starting point doesn't count.
      while (u !== start) {
        S.unshift(u);
        u = prev[u.x + u.y * w];
      }
      return S;
    }

    for (var yy = -1; yy <= 1; yy++) for (var xx = -1; xx <= 1; xx++) {
      var nx = ux + xx, ny = uy + yy, vi = nx + ny * w, v = xs[vi];
      if (
        xx === 0 && yy === 0 // Skip u.
        || Math.abs(xx) === Math.abs(yy) // Avoid diagonals.
        || nx < 0 || nx >= w || ny < 0 || ny >= h // Stay on the grid.
      ) continue;
      var alt = dist[ui] + manhattan(u, v) * u.risk;
      if (alt >= dist[vi]) continue;
      [dist[vi], prev[vi]] = [alt, u];
      q.push(v, alt);
    }
  }

  throw "Couldn't do it";
}
function run(xs, w, h, sx, sy) {
  var nw = w * sx, nh = h * sy, ys = Array(nw * nh).fill(null);
  for (var ny = 0; ny < nh; ny++) for (var nx = 0; nx < nw; nx++) {
    var offset = ((nx / nw * sx) | 0) + ((ny / nh * sy) | 0);
    ys[nx + ny * nw] = {
      x: nx, y: ny, risk: wrap(xs[(nx % w) + (ny % h) * w] + offset, 1, 10)
    };
  }
  var p = dijkstra(ys, nw, nh, ys[0], ys[(nw - 1) + (nh - 1) * nw]);
  return sum(p.map(x => x.risk));
}

var input = fs.readFileSync("15.txt", {encoding: "utf-8"});
var inputLines = lines(input);
var w = inputLines[0].length, h = inputLines.length;
var xs = inputLines.flatMap(x => x.split("").map(int));
console.log(run(xs, w, h, 1, 1));
console.log(run(xs, w, h, 5, 5));
