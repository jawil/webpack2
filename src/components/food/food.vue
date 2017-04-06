<template>
    <transition name="move">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image">
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift">&lt;</i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">&yen;{{food.price}}</span><span class="old" v-show="food.oldPrice">&yen;{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cartcontrol @message="addFood" :food="food"></cartcontrol>
                    </div>
                    <transition name="fade">
                        <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">
                            加入购物车
                        </div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings">
                    </ratingselect>
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" :src="rating.avatar">
                                </div>
                                <div class="time">
                                    {{rating.rateTime | formatDate}}
                                </div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
                            暂无评价
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import BScroll from 'better-scroll'
import {
    formatDate
} from 'common/js/date.js'
import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
import ratingselect from 'components/ratingselect/ratingselect.vue'
import split from 'components/split/split.vue'

const ALL = 2

export default {
    props: {
        food: {
            type: Object
        }
    },
    data() {
        return {
            showFlag: false,
            selectType: ALL,
            onlyContent: true,
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
        }
    },
    methods: {
        show() {
            this.showFlag = true
            this.selectType = ALL
            this.onlyContent = true
            this.$nextTick(f => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.food, {
                        click: true
                    })
                } else {
                    this.scroll.refresh()
                }
            })
        },

        hide() {
            this.showFlag = false
        },

        addFirst(event) {
            if (!event._constructed) {
                return
            }
            this.$emit('add', event.target)
            this.$set(this.food, 'count', 1)
        },

        needShow(type, text) {
            if (this.onlyContent && !text) {
                return false
            }
            if (this.selectType === ALL) {
                return true
            } else {
                return type === this.selectType
            }
        },

        addFood(target) {
            this.$emit('add', target)
        },

        selectRating(type) {
            this.selectType = type
            this.$nextTick(f => {
                this.scroll.refresh()
            })
        },

        toggleContent() {
            this.onlyContent = !this.onlyContent
            this.$nextTick(f => {
                this.scroll.refresh()
            })
        }
    },

    filters: {
        formatDate(time) {
            let date = new Date(time)
            return formatDate(date, 'yyyy-MM-dd hh:mm')
        }
    },

    components: {
        cartcontrol,
        ratingselect,
        split
    }
}
</script>
<style lang="sass">
@import '../../common/stylus/mixin.scss';
@import '../../common/stylus/base.scss';
.food {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0.96rem;
    z-index: 30;
    width: 100%;
    background: #fff;
    transform: translate3d(0, 0, 0);
    &.move-enter-active,
    &.move-leave-active {
        transition: all 0.2s linear;
    }
    &.move-enter,
    &.move-leave-active {
        transform: translate3d(100%, 0, 0);
    }
    .image-header {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 100%;
        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .back {
            position: absolute;
            top: 0;
            left: 0;
            .icon-arrow_lift {
                display: block;
                padding: 0.3rem;
                font-size: 0.8rem;
                color: #fff;
            }
        }
    }
    .content {
        position: relative;
        padding: 0.36rem;
        .title {
            line-height: 0.28rem;
            margin-bottom: 0.16rem;
            font-size: 14px;
            font-weight: 700;
            color: #07111b;
        }
        .detail {
            margin-bottom: 0.36rem;
            line-height: 0.2rem;
            height: 0.2rem;
            font-size: 0;
            .sell-count,
            .rating {
                font-size: 10px;
                ;
                color: #93999f;
            }
            .sell-count {
                margin-right: 0.24rem;
            }
        }
        .price {
            font-weight: 700;
            line-height: 0.48rem;
            .now {
                margin-right: 0.16rem;
                font-size: 14px;
                color: #f01414;
            }
            .old {
                text-decoration: line-through;
                font-size: 10px;
                color: #93999f;
            }
        }
        .cartcontrol-wrapper {
            position: absolute;
            right: 0.48rem;
            bottom: 0.36rem;
        }
        .buy {
            position: absolute;
            right: 0.36rem;
            bottom: 0.36rem;
            z-index: 10;
            height: 0.7rem;
            line-height: 0.7rem;
            padding: 0 0.24rem;
            box-sizing: border-box;
            border-radius: 0.5rem;
            font-size: 10px;
            color: #fff;
            background: #00a0dc;
            opacity: 1;
            &.fade-enter-active,
            &.fade-leave-active {
                transition: all 0.2s;
            }
            &.fade-enter,
            &.fade-leave-active {
                opacity: 0;
                z-index: -1;
            }
        }
    }
    .info {
        padding: 0.36rem;
        .title {
            line-height: 0.28rem;
            margin-bottom: 0.12rem;
            font-size: 14px;
            color: #07111b;
        }
        .text {
            line-height: 0.48rem;
            padding: 0 0.16rem;
            font-size: 12px;
            color: #4d555d;
        }
    }
    .rating {
        padding-top: 0.36rem;
        .title {
            line-height: 0.28rem;
            margin-left: 0.36rem;
            font-size: 14px;
            color: #07111b;
        }
        .rating-wrapper {
            padding: 0 0.36rem;
            .rating-item {
                position: relative;
                padding: 0.32rem 0;
                @include border-1px(rgba(7, 17, 27, 0.1));
                .user {
                    position: absolute;
                    right: 0;
                    top: 0.32rem;
                    line-height: 0.24rem;
                    font-size: 0;
                    .name {
                        display: inline-block;
                        margin-right: 0.12rem;
                        vertical-align: top;
                        font-size: 10px;
                        color: #93999f;
                    }
                    .avatar {
                        border-radius: 50%;
                        width: 0.24rem;
                        height: 0.24rem;
                    }
                }
                .time {
                    margin-bottom: 0.12rem;
                    line-height: 0.24rem;
                    font-size: 10px;
                    color: #93999f;
                }
                .text {
                    line-height: 0.32rem;
                    font-size: 12px;
                    color: #07111b;
                    .icon-thumb_up,
                    .icon-thumb_down {
                        margin-right: 0.08rem;
                        display: inline-block;
                        width: 0.32rem;
                        height: 0.32rem;
                        vertical-align: middle;
                    }
                    .icon-thumb_up {
                        background: url('./icon/up.png') no-repeat;
                        background-size: contain;
                    }
                    .icon-thumb_down {
                        background: url('./icon/down.png') no-repeat;
                        background-size: contain;
                    }
                }
            }
            .no-rating {
                padding: 0.32rem 0;
                font-size: 12px;
                color: #93999f;
            }
        }
    }
}
</style>
