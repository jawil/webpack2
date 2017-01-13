<template>
<div id="app">
<Hello></Hello>
</div>
</template>
<script>
import Hello from 'components/index.vue';
export default {
    name: 'app',
    data: function() {
        return {

        }
    },
    created: function() {

    },
    components: {
        Hello
    },
    methods: {

    }
}
</script>
<style scoped lang="sass">
@import "../../sass/reset.scss";
</style>
