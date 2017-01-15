
function unique(a) {
  return Array.from(new Set(a));
}

var a = [{name: "hanzichi"}, {age: 30}, new String(1), new Number(1)];
var ans = unique(a);
console.log(ans); // => [Object, Object, String, Number]
