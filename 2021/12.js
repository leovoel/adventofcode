var fs = require("fs");

var within = (x, a, b) => x >= a && x <= b;
var isUpper = s => within(s.charCodeAt(0), 65 /* A */, 90 /* Z */);
var isLower = s => within(s.charCodeAt(0), 97 /* a */, 122 /* z */);
var lines = s => s.trim().split("\n");

// The crappy `defaultdict` I've been using (made out of `Proxy`) is pretty
// slow for this problem...
function run(g, valid) {
  var paths = 0, seen = {};
  function search(vertex) {
    seen[vertex] = (seen[vertex] ? seen[vertex] : 0) + 1;
    var adjacent = g[vertex];
    for (var i = 0; i < adjacent.length; i++) {
      var next = adjacent[i];
      if (next === "start") continue;
      else if (next === "end") paths++;
      else if (isUpper(next) || !seen[next] || valid(seen)) search(next);
    }
    seen[vertex]--;
  }
  search("start");
  return paths;
}

function graph(edges) {
  var o = {};
  for (var [a, b] of edges) {
    (o[a] === undefined ? o[a] = [] : o[a]).push(b);
    (o[b] === undefined ? o[b] = [] : o[b]).push(a);
  }
  return o;
}

var input = fs.readFileSync("12.txt", {encoding: "utf-8"});
var xs = graph(lines(input).map(x => x.split("-")));
console.log(run(xs, seen => false));
console.log(run(xs, seen => {
  var n = 0;
  for (var k in seen)
    if (k !== "start" && k !== "end" && isLower(k) && seen[k] > 1)
      n++;
  return n === 0;
}));
