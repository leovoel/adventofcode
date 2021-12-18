var fs = require("fs");

var lines = s => s.trim().split("\n");

class Tree {
  constructor(l, r, v) {
    this.l = l ?? null;
    this.r = r ?? null;
    this.v = v;
  }
  clone() { return new Tree(this.l?.clone(), this.r?.clone(), this.v); }
  leaf() { return this.l === null && this.r === null; }
  static fromJSON(xs) {
    return (
      typeof xs === "number"
      ? new Tree(null, null, xs)
      : new Tree(...xs.map(Tree.fromJSON), null)
    );
  }
}
var preorder = (n, d, visit) => (
  n === null ? null
  : visit(n, d) ? n
  : preorder(n.l, d + 1, visit) || preorder(n.r, d + 1, visit)
);
function reduce(root) {
  var n = preorder(root, 0, (n, d) => d === 4 && n.l?.leaf() && n.r?.leaf());
  if (n !== null) {
    var leaves = [];
    preorder(root, 0, (n, d) => (n.leaf() && leaves.push(n), false));
    for (var i = 0; i < leaves.length; i++) {
      if (leaves[i] !== n.l) continue;
      var ll = i - 1 >= 0 ? leaves[i - 1] : null;
      var rl = i + 2 < leaves.length ? leaves[i + 2] : null;
      if (ll !== null) ll.v += n.l.v;
      if (rl !== null) rl.v += n.r.v;
      n.l = null;
      n.r = null;
      n.v = 0;
      return reduce(root);
    }
  }
  var n = preorder(root, 0, (n, d) => n.leaf() && n.v >= 10);
  if (n === null) return root;
  n.l = new Tree(null, null, Math.floor(n.v / 2));
  n.r = new Tree(null, null, Math.ceil(n.v / 2));
  n.v = null;
  return reduce(root);
}
var add = (a, b) => reduce(new Tree(a.clone(), b.clone(), null));
var mag = n => (
  3 * (n.l.leaf() ? n.l.v : mag(n.l)) + 2 * (n.r.leaf() ? n.r.v : mag(n.r))
);

function part1(xs) { return mag(xs.reduce(add)); }
function part2(xs) {
  var best = -Infinity;
  for (var i = 0; i < xs.length; i++)
    for (var j = i + 1; j < xs.length; j++)
      best = Math.max(best, Math.max(
        mag(add(xs[i], xs[j])), mag(add(xs[j], xs[i]))
      ));
  return best;
}

var input = fs.readFileSync("18.txt", {encoding: "utf-8"});
var xs = lines(input).map(x => Tree.fromJSON(JSON.parse(x)));
console.log(part1(xs));
console.log(part2(xs));
