var fs = require("fs");

var lines = s => s.trim().split("\n");
var int = s => parseInt(s, 10);
var sum = xs => xs.reduce((a, b) => a + b, 0);

function display(xs, w, h) {
  var o = [];
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++)
      o.push(xs.get(x + "_" + y) === 1 ? "#" : ".");
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
  var next = new Map();
  for (var [px, py] of [...xs.keys()].map(x => x.split("_").map(int))) {
    var nx = Math.min(nw - Math.abs((nw - nbx) - px), nw - 1);
    var ny = Math.min(nh - Math.abs((nh - nby) - py), nh - 1);
    next.set(`${nx}_${ny}`, 1);
  }
  return [next, nw, nh];
}
function part1(xs, w, h, [axis, pos]) {
  return sum([...fold(xs, w, h, axis, pos)[0].values()]);
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

var xs = new Map(dots.map((([x, y]) => [`${x}_${y}`, 1])));

console.log(part1(xs, w, h, folds[0]));
console.log(part2(xs, w, h, folds));
