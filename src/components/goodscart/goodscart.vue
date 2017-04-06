<template>
    <div>
        <div class="goodscart">
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'highlight':totalCount>0}">
                            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                        </div>
                        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{'highlight':totalPrice>0}">
                        &yen;{{totalPrice}}
                    </div>
                    <div class="description">
                        另需配送费&yen;{{deliveryPrice}}元
                    </div>
                </div>
                <div class="content-right" @click.stop.prevent="pay">
                    <div class="pay" v-html="payDesc" :class="payClass">
                    </div>
                </div>
                <div class="ball-container">
                    <div v-for="ball in balls">
                        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
                            <div class="ball" v-show="ball.show">
                                <div class="inner inner-hook">
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
                <transition name="fold">
                    <div class="shopcart-list" v-show="listShow">
                        <div class="list-header">
                            <h1 class="title">购物车</h1>
                            <span class="empty" @click="empty">清空</span>
                        </div>
                        <div class="list-content" ref="listContent">
                            <ul>
                                <li class="food border-1px" v-for="food in selectFoods">
                                    <span class="name">{{food.name}}</span>
                                    <div class="price">
                                        <span>&yen;{{food.price*food.count}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <cartcontrol @message="addFood" :food="food"></cartcontrol>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <transition name="fade">
            <div class="list-mask" @click="hideList" v-show="listShow"></div>
        </transition>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
export default {
    props: {
        selectFoods: {
            type: Array,
            default () {
                return []
            }
        },
        deliveryPrice: {
            type: Number
        },
        minPrice: {
            type: Number
        }
    },

    data() {
        return {
            balls: [{
                show: false
            }, {
                show: false
            }, {
                show: false
            }, {
                show: false
            }, {
                show: false
            }],
            dropBalls: [],
            fold: true
        }
    },

    components: {
        cartcontrol
    },

    computed: {
        totalPrice() {
            let total = 0
            this.selectFoods.forEach(ele => {
                total += ele.price * ele.count
            })
            return total
        },

        totalCount() {
            let count = 0
            this.selectFoods.forEach(ele => {
                count += ele.count
            })
            return count
        },

        payDesc() {
            if (this.totalPrice === 0) {
                return `&yen;${this.minPrice}元起送`
            } else if (this.totalPrice < this.minPrice) {
                let needPrice = this.minPrice - this.totalPrice
                return `还差&yen;${needPrice}元起送`
            } else {
                return `去结算`
            }
        },

        payClass() {
            if (this.totalPrice < this.minPrice) {
                return 'insufficient'
            } else {
                return 'adequate'
            }
        },

        listShow() {
            if (!this.totalCount) {
                this.fold = true
                return false
            }
            let show = !this.fold
            if (show) {
                this.$nextTick(f => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.listContent, {
                            click: true
                        })
                    } else {
                        this.scroll.refresh()
                    }
                })
            }
            return show
        }
    },

    methods: {
        drop(el) {
            for (let i = 0; i < this.balls.length; i++) {
                let ball = this.balls[i]
                if (!ball.show) {
                    ball.show = true
                    ball.el = el
                    this.dropBalls.push(ball)
                    return
                }
            }
        },

        toggleList() {
            if (!this.totalCount) {
                return
            }
            this.fold = !this.fold
        },

        hideList() {
            this.fold = true
        },

        empty() {
            this.selectFoods.forEach(food => {
                food.count = 0
            })
        },

        pay() {
            if (this.totalPrice < this.minPrice) {
                return
            }
            window.alert(`支付${this.totalPrice}元`)
        },

        addFood(target) {
            this.drop(target)
        },

        beforeDrop(el) {
            let count = this.balls.length
            while (count--) {
                let ball = this.balls[count]
                if (ball.show) {
                    let rect = ball.el.getBoundingClientRect()
                    let x = rect.left - 32
                    let y = -(window.innerHeight - rect.top - 22)
                    el.style.display = ''
                    el.style.webkitTransform = `translate3d(0,${y}px,0)`
                    el.style.transform = `translate3d(0,${y}px,0)`
                    let inner = el.getElementsByClassName('inner-hook')[0]
                    inner.style.webkitTransform = `translate3d(${x}px,0,0)`
                    inner.style.transform = `translate3d(${x}px,0,0)`
                }
            }
        },

        dropping(el, done) {
            /* eslint-disable no-unused-vars */
            let rf = el.offsetHeight
            this.$nextTick(f => {
                el.style.webkitTransform = 'translate3d(0,0,0)'
                el.style.transform = 'translate3d(0,0,0)'
                let inner = el.getElementsByClassName('inner-hook')[0]
                inner.style.webkitTransform = 'translate3d(0,0,0)'
                inner.style.transform = 'translate3d(0,0,0)'
                el.addEventListener('transitionend', done)
            })
        },

        afterDrop(el) {
            let ball = this.dropBalls.shift()
            if (ball) {
                ball.show = false
                el.style.display = 'none'
            }
        }
    }
}
</script>
<style lang="sass">
@import '../../common/stylus/mixin.scss';
@import '../../common/stylus/base.scss';
.goodscart {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 1rem;
    .content {
        display: flex;
        background: #141d27;
        font-size: 0;
        color: rgba(255, 255, 255, 0.4);
        .content-left {
            flex: 1;
            .logo-wrapper,
            .price,
            .description {
                display: inline-block;
            }
            .logo-wrapper {
                position: relative;
                top: -0.2rem;
                margin: 0 0.24rem;
                padding: 0.12rem;
                width: 1.2rem;
                height: 1.2rem;
                box-sizing: border-box;
                vertical-align: top;
                border-radius: 50%;
                background: #141d27;
                .num {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 0.48rem;
                    height: 0.32rem;
                    line-height: 0.32rem;
                    text-align: center;
                    border-radius: 0.32rem;
                    font-size:10px;
                    font-weight: 700;
                    color: #fff;
                    background: rgb(240, 20, 20);
                    box-shadow: 0 0.08rem 0.16rem 0 rgba(0, 0, 0, 0.4);
                }
                .logo {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #2b343c;
                    text-align: center;
                    line-height: 1.5rem;
                    &.highlight {
                        background: rgb(0, 160, 220);
                    }
                    .icon-shopping_cart {
                        display: inline-block;
                        width: 0.6rem;
                        height: 0.6rem;
                        color: #80858a;
                        background-image: url("./icon/goodscart.png");
                        background-size: contain;
                        &.highlight {
                            color: #fff;
                            background-image: url("./icon/goodscarth.png");
                            background-size: contain;
                        }
                    }
                }
            }
            .price {
                vertical-align: top;
                line-height: 0.48rem;
                margin-top: 0.24rem;
                box-sizing: border-box;
                padding-right: 0.24rem;
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 16px;
                font-weight: 700;
                &.highlight {
                    color: #fff;
                }
            }
            .description {
                vertical-align: top;
                line-height: 0.5rem;
                margin: 0.24rem 0 0 0.24rem;
                font-size: 10px;
            }
        }
        .content-right {
            flex: 0 0 2.1rem;
            .pay {
                line-height: 1rem;
                text-align: center;
                font-size: 12px;
                font-weight: 700;
                &.insufficient {
                    background-color: #2b333b;
                }
                &.adequate {
                    background-color: #00b43c;
                    color: #fff;
                }
            }
        }
        .ball-container {
            .ball {
                position: fixed;
                left: 32px;
                bottom: 22px;
                z-index: 200;
                z-index: 200;
                transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
            }
            .inner {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background-color: rgb(0, 160, 220);
                transition: all 0.4s linear;
            }
        }
        .shopcart-list {
            position: absolute;
            left: 0;
            top: 0;
            z-index: -1;
            width: 100%;
            transform: translate3d(0, -100%, 0);
            &.fold-enter-active,
            &.fold-leave-active {
                transition: all 0.5s;
            }
            &.fold-enter,
            &.fold-leave-active {
                transform: translate3d(0, 0, 0);
            }
            .list-header {
                height: 0.8rem;
                line-height: 0.8rem;
                padding: 0 0.36rem;
                background: #f3f5f7;
                border-bottom: 1px solid rgba(7, 17, 27, 0.1);
                .title {
                    float: left;
                    font-size:14px;
                    color: rgb(7, 17, 27);
                }
                .empty {
                    float: right;
                    font-size: 12px;
                    color: rgb(0, 160, 220);
                }
            }
            .list-content {
                padding: 0 0.36rem;
                max-height: 4.34rem;
                overflow: hidden;
                background: #fff;
                .food {
                    position: relative;
                    padding: 0.24rem 0;
                    box-sizing: border-box;
                    @include border-1px(rgba(7,
                    17,
                    27,
                    0.1));
                    .name {
                        line-height: 0.48rem;
                        font-size: 14px;
                        color: rgb(7, 17, 27);
                    }
                    .price {
                        position: absolute;
                        right: 1.8rem;
                        bottom: 0.24rem;
                        line-height: 0.48rem;
                        font-size: 14px;
                        font-weight: 700;
                        color: rgb(240, 20, 20);
                    }
                    .cartcontrol-wrapper {
                        position: absolute;
                        right: 0;
                        bottom: 0.24rem;
                    }
                }
            }
        }
    }
}

.list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    backdrop-filter: blur(10px);
    opacity: 1;
    background: rgba(7, 17, 27, 0.6);
    &.fade-enter-active,
    &.fade-leave-active {
        transition: all 0.5s;
    }
    &.fade-enter,
    &.fade-leave-active {
        opacity: 0;
        background: rgba(7, 17, 27, 0);
    }
}
</style>
