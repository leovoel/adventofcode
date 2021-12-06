var fs = require("fs");

var sum = xs => xs.reduce((a, b) => a + b);
var lines = s => s.trim().split("\n");
var int = s => parseInt(s, 10);

function defaultdict(factory, initial) {
  return new Proxy({}, {
    get(o, k) { return k in o ? o[k] : (o[k] = factory(initial)); }
  });
}

function run(fish, days) {
  var counts = defaultdict(_ => 0);
  for (var f of fish) counts[f]++;
  for (var day = 0; day < days; day++) {
    for (var [t, n] of [...Object.entries(counts)]) {
      t = t | 0; // Should probably use Map...
      counts[t] -= n;
      if (t === 0) {
        counts[6] += n;
        counts[8] += n;
      } else {
        counts[t - 1] += n;
      }
    }
  }
  return sum([...Object.values(counts)]);
}

var input = fs.readFileSync("6.txt", {encoding: "utf-8"});
var xs = input.trim().split(",").map(int);

console.log(run(xs, 80));
console.log(run(xs, 256));
