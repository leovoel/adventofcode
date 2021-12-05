var fs = require("fs");

var lines = s => s.trim().split("\n");

var sum = xs => xs.reduce((a, b) => a + b);
var sign = x => x > 0 ? 1 : x < 0 ? -1 : 0;

var int = s => parseInt(s, 10);

function run(w, h, ls, diagonals) {
  var grid = Array(w * h).fill(0);
  for (var [sx, sy, ex, ey] of ls) {
    var dx = sign(ex - sx);
    var dy = sign(ey - sy);
    if (!diagonals && dx !== 0 && dy !== 0) continue;
    var px = sx;
    var py = sy;
    while (true) {
      grid[px + py * w]++;
      if (px === ex && py == ey) break;
      px += dx;
      py += dy;
    }
  }
  return sum(grid.map(x => (x > 1) | 0));
}

var input = fs.readFileSync("5.txt", {encoding: "utf-8"});
var ls = [];
var w = 0;
var h = 0;
for (var l of lines(input)) {
  var ln = [x0, y0, x1, y1] = l.match(/\d+/g).map(int);
  ls.push(ln);
  w = Math.max(w, Math.max(x0, x1) + 1);
  h = Math.max(h, Math.max(y0, y1) + 1);
}
console.log(run(w, h, ls, false));
console.log(run(w, h, ls, true));
