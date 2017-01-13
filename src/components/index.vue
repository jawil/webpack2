<template id="hello">
    <!-- 个人信息组件 -->
    <div class="wrap">
        Hello Webpack,Vue.js!
        <img src="../assets/logo.png">
    </div>
</template>
<script>
export default {
    name: 'hello',
    data: function() {
        return {

        }
    },
    created: function() {

    },
    methods: {

    }
}
</script>
<style scoped lang="sass">
@import "../sass/reset.scss";
.wrap {
    color: red;
    font-size: 24px;
    text-align: center;
    background: url('../assets/logo.png') no-repeat center;
}
</style>
