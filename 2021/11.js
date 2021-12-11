var fs = require("fs");

var lines = s => s.trim().split("\n");
var int = s => parseInt(s, 10);

function run(levels, w, h) {
  var at = (x, y) => x + y * w;
  function inc(x, y) {
    var energy = levels[at(x, y)];
    levels[at(x, y)] = energy === -1 || energy >= 9 ? -1 : energy + 1;
    if (energy === -1 || energy < 9) return;
    for (var yy = -1; yy <= 1; yy++) {
      for (var xx = -1; xx <= 1; xx++) {
        if (xx === 0 && yy === 0) continue;
        var nx = x + xx, ny = y + yy;
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
        inc(nx, ny);
      }
    }
  }
  var totalFlashes = 0;
  var allFlashStep = null;
  var step = 0;
  while (step < 1000000) {
    for (var y = 0; y < h; y++)
      for (var x = 0; x < w; x++)
        inc(x, y);
    var flashes = 0;
    for (var i = 0; i < w * h; i++) {
      if (levels[i] !== -1) continue;
      flashes++;
      levels[i] = 0;
    }
    if (step < 100) totalFlashes += flashes;
    if (allFlashStep === null && flashes === w * h) {
      allFlashStep = step + 1;
      break;
    }
    step++;
  }
  return [totalFlashes, allFlashStep];
}

var input = fs.readFileSync("11.txt", {encoding: "utf-8"});
var inputLines = lines(input);
var width = inputLines[0].length;
var height = inputLines.length;
var xs = [];
for (var line of inputLines) for (var c of line) xs.push(int(c));
console.log(run(xs, width, height).join("\n"));
