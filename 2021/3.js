var fs = require("fs");

var lines = s => s.trim().split("\n");

function defaultdict(factory, initial) {
  return new Proxy({}, {
    get(o, k) { return k in o ? o[k] : factory(initial); }
  });
}

var input = fs.readFileSync("3.txt", {encoding: "utf-8"});
var inputLines = lines(input);

var width = inputLines[0].length;

function count(xs) {
  var results = Array(width).fill().map(_ => defaultdict(_ => 0));
  xs.forEach(x => [...x].forEach((c, i) => { results[i][c]++; }));
  return results;
}
function part1(inputLines) {
  var counts = count(inputLines);
  var gamma = 0;
  var epsilon = 0;
  for (var [i, {0: zero, 1: one}] of counts.entries()) {
    gamma |= ~~(zero < one) << (width - 1 - i);
    epsilon |= ~~(zero > one) << (width - 1 - i);
  }
  return gamma * epsilon;
}
function part2(inputLines) {
  function filter(lines, zero, one) {
    var counts = count(lines);
    for (var i = 0; i < width; i++) {
      var c = counts[i];
      var expected = c[0] > c[1] ? zero : one;
      var next = lines.filter(x => x.charAt(i) === expected);
      if (next.length === 0) break;
      lines = next;
      counts = count(lines);
    }
    return parseInt(lines[0], 2);
  }
  var oxygen = filter(inputLines, "0", "1");
  var co2 = filter(inputLines, "1", "0");
  return oxygen * co2;
}

console.log(part1(inputLines));
console.log(part2(inputLines));
