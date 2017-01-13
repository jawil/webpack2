import Vue from 'vue';
import App from "./app.vue";
var vm = new Vue({
    el: "#main",
    render: x => x(App)
})
