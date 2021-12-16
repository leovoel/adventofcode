var fs = require("fs");

var lines = s => s.trim().split("\n");
var hex = x => parseInt(x, 16);

var range = n => Array(n).fill().map((x, i) => i);
var bitsOf = (x, size) => range(size).map(i => (x >> (size - 1 - i)) & 1);
var min = (xs, init=Infinity) => xs.reduce((a, b) => a < b ? a : b, init);
var max = (xs, init=-Infinity) => xs.reduce((a, b) => a > b ? a : b, init);
var sum = (xs, init=0) => xs.reduce((a, b) => a + b, init);
var product = (xs, init=1) => xs.reduce((a, b) => a * b, init);
var lt = (a, b) => a < b ? 1 : 0;
var gt = (a, b) => a > b ? 1 : 0;
var eq = (a, b) => a === b ? 1 : 0;
var oneOf = (y, xs) => xs.some(x => x === y);

class Reader {
  constructor(input) {
    this.input = input;
    this.index = 0;
  }
  done() { return this.index >= this.input.length; }
  bit() { return this.input[this.index++]; }
  int(size) {
    return range(size).map(_ => this.bit()).reduce((a, x) => a << 1 | x, 0);
  }
  packet() {
    var [ver, id] = [this.int(3), this.int(3)];
    var sub = [];
    if (oneOf(id, [0, 1, 2, 3, 5, 6, 7])) {
      if (this.bit() === 0)
        for (var l = this.int(15), end = this.index + l; this.index < end;)
          sub.push(this.packet());
      else
        for (var i = 0, n = this.int(11); i < n; i++)
          sub.push(this.packet());
      if (oneOf(id, [5, 6, 7]) && sub.length !== 2) throw "Invalid packet";
    }
    if (id === 4) {
      var val = 0n;
      while (!this.done()) {
        var lastGroup = !this.bit();
        val = val << 4n | BigInt(this.int(4));
        if (lastGroup) break;
      }
      return {ver, type: "literal", sub, val};
    } else if (id === 0) return {
      ver, type: "add", sub, val: sum(sub.map(value), 0n),
    }; else if (id === 1) return {
      ver, type: "mul", sub, val: product(sub.map(value), 1n),
    }; else if (id === 2) return {
      ver, type: "min", sub, val: min(sub.map(value)),
    }; else if (id === 3) return {
      ver, type: "max", sub, val: max(sub.map(value)),
    }; else if (id === 5) return {
      ver, type: "gt", sub, val: BigInt(gt(...sub.map(value))),
    }; else if (id === 6) return {
      ver, type: "lt", sub, val: BigInt(lt(...sub.map(value))),
    }; else if (id === 7) return {
      ver, type: "eq", sub, val: BigInt(eq(...sub.map(value))),
    }; else throw {error: "Unknown packet", ver, id};
  }
}
function value(p) { return p.val; }
function sumver(p) { return p.sub.reduce((a, p) => a + sumver(p), p.ver); }
function part1(xs) { return sumver(new Reader(xs).packet()); }
function part2(xs) { return new Reader(xs).packet().val.toString(); }

var input = fs.readFileSync("16.txt", {encoding: "utf-8"});
var xs = input.trim().split("").flatMap(x => bitsOf(hex(x), 4));
console.log(part1(xs));
console.log(part2(xs));
