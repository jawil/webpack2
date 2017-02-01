import Vue from 'vue';
import App from "./app.vue";
function unique(a) {
  return Array.from(new Set(a));
}

var a = [{name: "hanzichi"}, {age: 30}, new String(1), new Number(1)];
var ans = unique(a);
console.log(ans);
var vm = new Vue({
    el: "#main",
    render: x => x(App)
})
