var fs = require("fs");

var sum = xs => xs.reduce((a, b) => a + b);
var int = s => parseInt(s, 10);
var lines = s => s.trim().split("\n");

var input = fs.readFileSync("4.txt", {encoding: "utf-8"});
var xs = lines(input).filter(x => x !== "");

var W = 5, H = 5;
var cell = (b, x, y) => b[x + y * W];
function won(b) {
  for (var y = 0; y < H; y++) {
    var hm = 0;
    for (var x = 0; x < W; x++)
      if (cell(b, x, y).m) hm++;
    if (hm === W) return true;
  }
  for (var x = 0; x < W; x++) {
    var vm = 0;
    for (var y = 0; y < H; y++)
      if (cell(b, x, y).m) vm++;
    if (vm === H) return true;
  }
  return false;
}
function unmarked(b) {
  var o = [];
  for (var y = 0; y < H; y++) {
    for (var x = 0; x < W; x++) {
      var c = cell(b, x, y);
      if (!c.m) o.push(c.v);
    }
  }
  return o;
}
function reset(b) { for (var i = 0; i < W * H; i++) b[i].m = false; }
function run(bs, ns, last) {
  bs.forEach(reset);
  var ws = [], wsa = [];
  for (var n of ns) {
    for (var b of bs) {
      for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
          var c = cell(b, x, y);
          if (c.v === n) c.m = true;
        }
      }
      if (won(b) && ws.indexOf(b) === -1) {
        ws.push(b);
        wsa.push(sum(unmarked(b)) * n);
      }
    }
  }
  return wsa[last ? wsa.length - 1 : 0];
}

var li = 0, read = () => xs[li++], done = () => li >= xs.length;
var ns = read().trim().split(",").map(int), bs = [];
while (!done()) {
  var b = [];
  for (var i = 0; i < 5; i++) b = [
    ...b, ...read().trim().split(/\s+/).map(x => ({v: int(x), m: false}))
  ];
  bs.push(b);
}
console.log(run(bs, ns, false));
console.log(run(bs, ns, true));
