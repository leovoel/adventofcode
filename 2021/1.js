var fs = require("fs");

var lines = s => s.trim().split("\n");
var range = n => Array(n).fill().map((x, i) => i);
var windows = (xs, n) => range(xs.length - n + 1).map(i => xs.slice(i, i + n));
var sum = xs => xs.reduce((a, b) => a + b);

var run = (xs, n) => windows(windows(xs, n), 2).reduce((n, [a, b]) => (
  sum(b) > sum(a) ? n + 1 : n
), 0);

var input = fs.readFileSync("1.txt", {encoding: "utf-8"});
var xs = lines(input).map(x => parseInt(x, 10));
console.log(run(xs, 1));
console.log(run(xs, 3));
