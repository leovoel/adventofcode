var fs = require("fs");

var int = s => parseInt(s, 10);

function launch(tx0, tx1, ty0, ty1, vx, vy) {
  var px = 0;
  var py = 0;
  var bestY = -Infinity;
  var step = 0;
  var hit = false;
  while (px < tx1 && py > ty0) {
    px += vx;
    py += vy;
    bestY = Math.max(bestY, py);
    vx = vx > 0 ? vx - 1 : vx < 0 ? vx + 1 : vx;
    vy--;
    hit = px >= tx0 && px <= tx1 && py >= ty0 && py <= ty1;
    if (hit) break;
    step++;
  }
  return [hit, bestY];
}
function run([tx0, tx1, ty0, ty1]) {
  var acceptable = 0;
  var bestY = -Infinity;
  for (var vy = -1000; vy <= 1000; vy++) {
    for (var vx = 0; vx <= 1000; vx++) {
      var [hit, nextBestY] = launch(tx0, tx1, ty0, ty1, vx, vy);
      if (hit) {
        bestY = Math.max(bestY, nextBestY);
        acceptable++;
      }
    }
  }
  return [bestY, acceptable];
}

var input = fs.readFileSync("17.txt", {encoding: "utf-8"});
var xs = input.trim().match(/-?\d+/g).map(int);
console.log(run(xs).join("\n"));
