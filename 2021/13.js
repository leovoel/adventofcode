var fs = require("fs");

var lines = s => s.trim().split("\n");
var int = s => parseInt(s, 10);
var sum = xs => xs.reduce((a, b) => a + b, 0);

function display(xs, w, h) {
  var o = [];
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++)
      o.push(xs[x + y * w] === 1 ? "#" : ".");
    o.push("\n");
  }
  return o.join("");
}
function fold(xs, w, h, axis, pos) {
  var [nw, nh] = (
    axis === "x"
    ? [Math.max(pos, (w - 1) - pos), h]
    : [w, Math.max(pos, (h - 1) - pos)]
  );
  var [nbx, nby] = axis === "x" ? [nw - pos, 0] : [0, nh - pos];
  var next = Array(nw * nh).fill(0);
  for (var py = 0; py < h; py++) {
    for (var px = 0; px < w; px++) {
      var nx = Math.min(nw - Math.abs((nw - nbx) - px), nw - 1);
      var ny = Math.min(nh - Math.abs((nh - nby) - py), nh - 1);
      if (nx >= 0 && nx < nw && ny >= 0 && ny < nh)
        next[nx + ny * nw] |= xs[px + py * w];
    }
  }
  return [next, nw, nh];
}
function part1(xs, w, h, [axis, pos]) {
  return sum(fold(xs, w, h, axis, pos)[0].map(x => x));
}
function part2(xs, w, h, folds) {
  return display(...folds.reduce(([xs, w, h], [axis, pos]) => (
    fold(xs, w, h, axis, pos)
  ), [xs, w, h]));
}

var input = fs.readFileSync("13.txt", {encoding: "utf-8"});

var [dots, folds] = input.trim().split("\n\n").map(x => x.split("\n"));
dots = dots.map(x => x.split(",").map(int));

var w = Math.max.apply(null, dots.map(([x, y]) => x)) + 1;
var h = Math.max.apply(null, dots.map(([x, y]) => y)) + 1;

folds = folds.map(x => {
  var [_, axis, pos] = x.match(/([xy])=([0-9]+)$/);
  return [axis, int(pos)];
});

var xs = Array(w * h).fill(0);
for (var [dx, dy] of dots) xs[dx + dy * w] |= 1;

console.log(part1(xs, w, h, folds[0]));
console.log(part2(xs, w, h, folds));
