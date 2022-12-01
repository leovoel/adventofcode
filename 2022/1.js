var fs = require("fs");

var splitBy = (s, sep) => s.trim().split(sep);
var lines = s => splitBy(s, "\n");
var lineDelimited = s => splitBy(s, "\n\n");
var int = s => parseInt(s, 10);
var sum = (xs, init=0) => xs.reduce((a, b) => a + b, init);
var sorted = (xs, f) => [...xs].sort(f);
var descending = (a, b) => a > b ? -1 : a < b ? 1 : 0;
var map = (xs, f) => xs.map(x => f(x));

var run = (xs, n) => sum(sorted(map(xs, sum), descending).slice(0, n));

var input = fs.readFileSync("1.txt", {encoding: "utf-8"});
var xs = map(lineDelimited(input), s => map(lines(s), int));
console.log(run(xs, 1));
console.log(run(xs, 3));
