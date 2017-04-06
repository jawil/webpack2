<template>
    <div class="ratingselect">
        <div class="rating-type border-1px">
            <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span
          class="count">{{ratings.length}}</span></span>
            <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span
          class="count">{{positives.length}}</span></span>
            <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span
          class="count">{{negatives.length}}</span></span>
        </div>
        <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
            <span class="icon-check_circle">&#10003;</span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>
<script>
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
    props: {
        ratings: {
            type: Array,
            default () {
                return []
            }
        },
        selectType: {
            type: Number,
            default: ALL
        },
        onlyContent: {
            type: Boolean,
            default: false
        },
        desc: {
            type: Object,
            default () {
                return {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                }
            }
        }
    },
    computed: {
        positives() {
            // 此filter非Vue的filter函数，是ES5的Array.filter数组方法，返回的是新的数组
            return this.ratings.filter(rating => {
                return rating.rateType === POSITIVE
            })
        },
        negatives() {
            return this.ratings.filter(rating => {
                return rating.rateType === NEGATIVE
            })
        }
    },
    methods: {
        select(type, event) {
            if (!event._constructed) {
                return
            }
            this.$emit('select', type)
        },
        toggleContent(event) {
            if (!event._constructed) {
                return
            }
            this.$emit('toggle')
        }
    }
}
</script>
<style lang="sass">
@import '../../common/stylus/mixin.scss';
@import '../../common/stylus/base.scss';
.ratingselect {
    .rating-type {
        padding: 0.36rem 0;
        margin: 0 0.36rem;
        font-size: 0;
        @include border-1px(rgba(7, 17, 27, 0.1));
        .block {
            display: inline-block;
            padding: 0.16rem 0.24rem;
            margin-right: 0.16rem;
            line-height: 0.32rem;
            border-radius: 1px;
            font-size: 12px;
            color: #4d555d;
            &.active {
                color: #fff;
            }
            .count {
                margin-left: 0.04rem;
                font-size:8px;
            }
            &.positive {
                background: rgba(0, 160, 220, 0.2);
                &.active {
                    background: #00a0dc;
                }
            }
            &.negative {
                background: rgba(77, 85, 93, 0.2);
                &.active {
                    background: #4d555d;
                }
            }
        }
    }
    .switch {
        padding: 0.24rem 0.36rem;
        line-height: 0.48rem;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        color: #93999f;
        font-size: 0;
        &.on .icon-check_circle {
            color: #00c850;
        }
        .icon-check_circle {
            display: inline-block;
            vertical-align: top;
            margin-right: 0.08rem;
            font-size: 0.36rem;
            width: 0.44rem;
            height: 0.44rem;
            text-align: center;
            border-radius: 50%;
            color: #fff;
            background-color: #dbdddf;
        }
        .text {
            display: inline-block;
            vertical-align: top;
            font-size:12px;
        }
    }
}
</style>
