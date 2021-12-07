var fs = require("fs");

var int = s => parseInt(s, 10);
var id = x => x;

// https://en.wikipedia.org/wiki/Triangular_number
var T = n => ((n * (n + 1)) / 2) | 0;

function run(xs, f) {
  var x0 = Math.min.apply(null, xs);
  var x1 = Math.max.apply(null, xs);
  var smallest = null;
  for (var cx = x0; cx < x1; cx++) {
    var fuel = xs.reduce((a, x) => a + f(Math.abs(x - cx)), 0);
    if (smallest === null || fuel < smallest) smallest = fuel;
  }
  return smallest;
}

var input = fs.readFileSync("7.txt", {encoding: "utf-8"});
var xs = input.trim().split(",").map(int);

console.log(run(xs, id));
console.log(run(xs, T));
