var fs = require("fs");

var lines = s => s.trim().split("\n");

function run(template, rules, n) {
  var prev = null;
  for (var i = 0; i < n + 1; i++) {
    var next = new Map();
    if (prev === null) {
      for (var j = 0; j < template.length - 1; j++)
        next.set(template.charAt(j) + template.charAt(j + 1), 1);
    } else {
      for (var [m, v] of prev.entries()) {
        var [a, b] = m.split("");
        var ts = rules.get(m);
        if (ts !== undefined) {
          next.set(a + ts, (next.has(a + ts) ? next.get(a + ts) : 0) + v);
          next.set(ts + b, (next.has(ts + b) ? next.get(ts + b) : 0) + v);
        } else {
          throw "?";
        }
      }
    }
    prev = next;
  }
  var count = {};
  for (var [k, v] of prev.entries()) {
    var [a, _] = k.split("");
    count[a] = (count[a] === undefined ? 0n : count[a]) + BigInt(v);
  }
  var last = template.charAt(template.length - 1);
  count[last] = (count[last] === undefined ? 0n : count[last]) + 1n;
  var sorted = [...Object.entries(count)];
  sorted.sort(([ka, va], [kb, vb]) => va > vb ? 1 : va < vb ? -1 : 0);
  return (sorted[sorted.length - 1][1] - sorted[0][1]).toString();
}

var input = fs.readFileSync("14.txt", {encoding: "utf-8"});

var [template, rules] = input.trim().split("\n\n");
rules = new Map(lines(rules).map(x => x.split(" -> ")));

console.log(run(template, rules, 10));
console.log(run(template, rules, 40));
