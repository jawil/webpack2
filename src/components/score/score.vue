<template>
    <div class="star-rating">
        <div class="star-rating-top" :style="{ width: score/5*100 + '%' }">
            <span :style="{fontSize:size+'px'}"></span>
            <span :style="{fontSize:size+'px'}"></span>
            <span :style="{fontSize:size+'px'}"></span>
            <span :style="{fontSize:size+'px'}"></span>
            <span :style="{fontSize:size+'px'}"></span>
        </div>
        <div class="star-rating-bottom">
            <span :style="{fontSize:size+'px'}"></span>
            <span :style="{fontSize:size+'px'}"></span>
            <span :style="{fontSize:size+'px'}"></span>
            <span :style="{fontSize:size+'px'}"></span>
            <span :style="{fontSize:size+'px'}"></span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        score: {
            type: Number
        },
        size: {
            type: Number,
            default () {
                return 20
            }
        }
    }
}
</script>
<style>
.star-rating {
    unicode-bidi: bidi-override;
    color: #d5d6da;
    font-size: 0;
    margin: 0 auto;
    position: relative;
    display: inline-block;
    padding: 0;
    text-shadow: 0px 1px 0 #a2a2a2;
    vertical-align: middle;
    top: -5px;
}

.star-rating span:not(:first-child) {
    padding: 3px;
    font-size: 20px;
}

.star-rating span:after {
    content: "★";
}

.star-rating-top {
    color: #ff9a00;
    padding: 0;
    position: absolute;
    z-index: 1;
    display: block;
    top: 0;
    left: 0;
    overflow: hidden;
    white-space: nowrap;
}

.star-rating-bottom {
    padding: 0;
    display: block;
    z-index: 0;
}
</style>
