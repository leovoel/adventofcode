var fs = require("fs");

var lines = s => s.trim().split("\n");
var middle = xs => xs.length % 2 === 0 ? null : xs[(xs.length / 2) | 0];

var M = {"]": "[", ")": "(", ">": "<", "}": "{"};
function run(xs) {
  var errorScore = 0;
  var remaining = [];
  for (var l of xs) {
    var stack = [];
    var corrupted = false;
    for (var c of l) {
      if (")]}>".indexOf(c) !== -1) {
        if (stack[stack.length - 1] !== M[c]) {
          corrupted = true;
          errorScore += [3, 57, 1197, 25137][")]}>".indexOf(c)];
          break;
        } else {
          stack.pop();
        }
      } else {
        stack.push(c);
      }
    }
    if (!corrupted) remaining.push(stack);
  }
  var completionScores = [];
  for (var stack of remaining) {
    var s = 0;
    while (stack.length > 0)
      s = s * 5 + "([{<".indexOf(stack.pop()) + 1;
    completionScores.push(s);
  }
  completionScores.sort((a, b) => a - b);
  return [errorScore, middle(completionScores)];
}

var input = fs.readFileSync("10.txt", {encoding: "utf-8"});
console.log(run(lines(input)).join("\n"));
