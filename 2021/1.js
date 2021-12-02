var fs = require("fs");

var lines = s => s.trim().split("\n");
function* windows(xs, size) {
  var w = [];
  for (var [i, x] of xs.entries()) {
    if (w.length === size) {
      var a = w.slice();
      w.push(x);
      w.shift();
      var b = w.slice();
      yield [a, b];
    } else {
      w.push(x);
    }
  }
}
var sum = xs => xs.reduce((a, b) => a + b);

var run = (xs, n) => [...windows(xs, n)].reduce((n, [a, b]) => (
  sum(b) > sum(a) ? n + 1 : n
), 0);

var input = fs.readFileSync("1.txt", {encoding: "utf-8"});
var xs = lines(input).map(x => parseInt(x, 10));
console.log(run(xs, 1));
console.log(run(xs, 3));
