var fs = require("fs");

var lines = s => s.trim().split("\n");

function part1([x, d], [cmd, n]) {
  switch (cmd) {
    case "forward": return [x + n, d];
    case "down": return [x, d + n];
    case "up": return [x, d - n];
  }
}
function part2([x, d, a], [cmd, n]) {
  switch (cmd) {
    case "forward": return [x + n, d + a * n, a];
    case "down": return [x, d, a + n];
    case "up": return [x, d, a - n];
  }
}
var run = (cmds, state, step, done) => done(cmds.reduce(step, state));

var input = fs.readFileSync("2.txt", {encoding: "utf-8"});
var cmds = lines(input).map(x => 
  (([d, a]) => [d, parseInt(a, 10)])(x.split(" "))
);
console.log(run(cmds, [0, 0], part1, ([x, d]) => x * d));
console.log(run(cmds, [0, 0, 0], part2, ([x, d]) => x * d));
