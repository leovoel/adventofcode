var fs = require("fs");

var lines = s => s.trim().split("\n");
var int = s => parseInt(s, 10);

var sum = xs => xs.reduce((a, b) => a + b, 0);
var product = xs => xs.reduce((a, b) => a * b, 1);

function run(xs, w, h) {
  var xs = xs.map((x, i) => ({
    height: x, x: i % w, y: (i / w) | 0, filled: false
  }));
  var at = (x, y) => x + y * w;
  var low = [];
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var cell = xs[at(x, y)];
      var lowest = Infinity;
      for (var yy = -1; yy <= 1; yy++) {
        for (var xx = -1; xx <= 1; xx++) {
          if (xx === yy || (xx === 0 && yy === 0)) continue;
          var nx = x + xx, ny = y + yy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          lowest = Math.min(lowest, xs[at(nx, ny)].height);
        }
      }
      if (cell.height < lowest) low.push(cell);
    }
  }
  function flood(x, y) {
    var queue = [xs[at(x, y)]];
    function add(x, y) {
      if (x < 0 || x >= w || y < 0 || y >= h) return;
      queue.push(xs[at(x, y)]);
    }
    var area = 0;
    while (queue.length > 0) {
      var cell = queue.shift();
      if (!cell.filled && cell.height !== 9) {
        cell.filled = true;
        area++;
        add(cell.x - 1, cell.y);
        add(cell.x + 1, cell.y);
        add(cell.x, cell.y - 1);
        add(cell.x, cell.y + 1);
      }
    }
    return area;
  }
  var areas = low.map(c => flood(c.x, c.y));
  areas.sort((a, b) => a - b);
  return [sum(low.map(c => c.height + 1)), product(areas.slice(-3))];
}

var input = fs.readFileSync("9.txt", {encoding: "utf-8"});
var inputLines = lines(input);
var width = inputLines[0].length;
var height = inputLines.length;
var xs = [];
for (var line of inputLines) for (var c of line) xs.push(int(c));
console.log(run(xs, width, height).join("\n"));
