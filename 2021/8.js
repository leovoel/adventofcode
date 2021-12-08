var fs = require("fs");

var lines = s => s.trim().split("\n");
function bitset(s) {
  var bs = 0;
  for (var i = 0; i < s.length; i++)
    bs += 1 << (s.charCodeAt(i) - 97 /* a */);
  return bs;
}
function bslen(bs) {
  // https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel
  bs = bs - ((bs >> 1) & 0x55555555);
  bs = (bs & 0x33333333) + ((bs >> 2) & 0x33333333);
  return ((bs + (bs >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

function part1(notes) {
  var o = 0;
  for (var [patterns, encoded] of notes)
    for (var digit of encoded)
      if ([2, 3, 4, 7].includes(digit.length))
        o++;
  return o;
}
function part2(notes) {
  var result = 0;
  for (var [patterns, encoded] of notes) {
    var t = 0, m = 0, b = 0, tl = 0, bl = 0, tr = 0, br = 0;
    var tr_br = 0, m_tl = 0, b_bl = 0, s2d = {}, fiveCharPatterns = [];
    for (var p of patterns) {
      var bs = bitset(p);
      switch (p.length) {
        case 2: s2d[bs] = 1; tr_br = bs; break;
        case 3: s2d[bs] = 7; t = bs; break;
        case 4: s2d[bs] = 4; m_tl = bs; break;
        case 7: s2d[bs] = 8; b_bl = bs; break;
        case 5: fiveCharPatterns.push(bs); break;
      }
    }
    t &= ~tr_br;
    m_tl &= ~(tr_br | t);
    b_bl &= ~(tr_br | t | m_tl);
    for (var p of fiveCharPatterns) {
      var pm = p & m_tl, pb = p & b_bl;
      var remaining = p & ~(pm | pb | t | tr_br);
      if (bslen(pm) === 1 && bslen(pb) === 1 && remaining === 0) {
        m = pm;
        b = pb;
        tl = m_tl & ~pm;
        bl = b_bl & ~pb;
        s2d[p] = 3;
        break;
      }
    }
    for (var p of fiveCharPatterns) {
      if (s2d[p] !== undefined) continue;
      var remaining = p & ~(t | m | b | bl);
      if (bslen(remaining) === 1) {
        tr = remaining;
        br = tr_br & ~remaining;
        s2d[p] = 2;
        break;
      }
    }
    s2d[tr | br | tl | bl | t | b] = 0;
    s2d[br | tl | t | m | b] = 5;
    s2d[br | tl | bl | t | m | b] = 6;
    s2d[tr | br | tl | t | m | b] = 9;
    result += encoded.reduce((a, x) => a * 10 + s2d[bitset(x)], 0);
  }
  return result;
}

var input = fs.readFileSync("8.txt", {encoding: "utf-8"});
var xs = lines(input).map(x => x.split(" | ").map(y => y.split(" ")));
console.log(part1(xs));
console.log(part2(xs));
