<template>
    <div>
        <div id="goods">
            <div class="menu-wrapper" ref="menuWrapper">
                <ul>
                    <li v-for="(item,index) in goods" class="menu-item menu-item-hook" :class="{'current':currentIndex==index}" @click="slectMenu(index,$event)">
                        <span class="text border-1px">
                    <span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span> {{item.name}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="foods-wrapper" ref="foodWrapper">
                <ul>
                    <li v-for="item in goods" class="food-list food-list-hook">
                        <h1 class="title">{{item.name}}</h1>
                        <ul>
                            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
                                <div class="icon">
                                    <img :src="food.icon" alt="">
                                </div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="description">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}</span>
                                        <span>好评率{{food.rating}}%</span>
                                    </div>
                                    <div class="price">
                                        <span class="current-price">&yen;{{food.price}}</span>
                                        <span class="old-price" v-show="food.oldPrice">&yen;{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <cartcontrol :food="food" v-on:message="recieveMessage"></cartcontrol>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <goodscart ref="goodscart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></goodscart>
        </div>
        <food :food="selectedFood" ref="food" v-on:add="recieveMessage"></food>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
import goodscart from 'components/goodscart/goodscart.vue'
import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
import food from 'components/food/food.vue'

const ERR_OK = 0
const appData = require('../../../data.json')
const goods = appData.goods

export default {
    props: {
        seller: {
            type: Object
        }
    },

    data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            wrapMenuHeight: '',
            selectedFood: {}
        }
    },

    components: {
        goodscart,
        cartcontrol,
        food
    },

    computed: {
        currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i]
                let height2 = this.listHeight[i + 1]
                if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                    return i
                }
            }
            return 0
        },

        selectFoods() {
            let foods = []
            this.goods.forEach(good => {
                good.foods.forEach(food => {
                    if (food.count) {
                        foods.push(food)
                    }
                })
            })
            return foods
        }
    },

    created() {
        this.classMap = ['decrease', 'discount', 'special', 'guarantee', 'invoice']
        this.goods = goods
        this.$nextTick(f => {
            this.initScroll()
            this.calculateHeight()
            this.wrapMenuHeight = this.$refs.menuWrapper.clientHeight
        })
    },

    methods: {
        getGoods() {
            // Vue.prototype.$http = axios
            this.$http({
                    method: 'get',
                    url: 'api/goods',
                    params: {
                        ID: 12345
                    }
                })
                .then((res) => {
                    let data = res.data
                    if (data.errno === ERR_OK) {
                        this.goods = data.data
                        this.$nextTick(f => {
                            this.initScroll()
                            this.calculateHeight()
                            this.wrapMenuHeight = this.$refs.menuWrapper.clientHeight
                        })
                    }
                })
                .catch((err) => {
                    console.error(err)
                })
        },

        recieveMessage(target) { // 接受子组件传过来的参数
            // 体验优化,异步执行下落动画
            this.$nextTick(f => {
                this.$refs.goodscart.drop(target)
            })
        },

        selectFood(food, ev) {
            if (!ev._constructed) {
                return
            }
            this.selectedFood = food
            this.$refs.food.show()
        },

        slectMenu(index, ev) {
            if (!ev._constructed) {
                return
            }
            let foodList = this.$refs.foodWrapper.querySelectorAll('.food-list-hook')
            let el = foodList[index]
            this.foodsScroll.scrollToElement(el, 300)
        },

        initScroll() {
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                click: true // 取消阻止默认事件
            })
            this.foodsScroll = new BScroll(this.$refs.foodWrapper, {
                click: true,
                probeType: 3 // 监听滚动事件
            })
            this.foodsScroll.on('scroll', pos => {
                this.scrollY = Math.abs(Math.round(pos.y))
                let menuList = this.$refs.menuWrapper.querySelectorAll('.menu-item-hook')
                let el = menuList[this.currentIndex]
                if (el.offsetTop + 10 > this.wrapMenuHeight || el.offsetTop <= 0) {
                    this.menuScroll.scrollToElement(el, 300)
                }
            })
        },

        calculateHeight() {
            let foodList = this.$refs.foodWrapper.querySelectorAll('.food-list-hook')
            let height = 0
            this.listHeight.push(height)
            Array.prototype.slice.call(foodList).forEach(ele => {
                height += ele.clientHeight
                this.listHeight.push(height)
            })
        }
    }
}
</script>
<style lang="sass">
@import '../../common/stylus/mixin.scss';
@import '../../common/stylus/base.scss';
#goods {
    display: flex;
    position: absolute;
    top: 3.5rem;
    bottom: 1rem;
    overflow: hidden;
    width: 100%;
    .menu-wrapper {
        width: 1.6rem;
        background-color: #f3f5f7;
        flex: 0 0 1.6rem;
        .menu-item {
            display: table;
            width: 1.6rem;
            height: 1.08rem;
            line-height: 0.28rem;
            &.current {
                position: relative;
                margin-top: -1px;
                z-index: 10;
                background-color: #fff;
                font-weight: 700;
                .text {
                    @include border-none();
                }
            }
            .icon {
                display: inline-block;
                width: 0.24rem;
                height: .24rem;
                background-repeat: no-repeat;
                background-size: contain;
                margin-right: 0.02rem;
                &.decrease {
                    @include bg-image('./icon/decrease_3');
                }
                &.discount {
                    @include bg-image('./icon/discount_3');
                }
                &.special {
                    @include bg-image('./icon/special_3');
                }
                &.guarantee {
                    @include bg-image('./icon/guarantee_3');
                }
                &.invoice {
                    @include bg-image('./icon/invoice_3');
                }
            }
            .text {
                vertical-align: middle;
                font-size: 12px;
                display: table-cell;
                @include border-1px(rgba(7, 17, 27, 0.1));
                padding: 0 0.2rem;
            }
        }
    }
    .foods-wrapper {
        flex: 1;
        background-color: #fff;
        .title {
            padding-left: 0.28rem;
            line-height: 0.52rem;
            border-left: 2px solid #d9dde1;
            font-size: 12px;
            color: rgb(147, 153, 159);
            background-color: #f3f5f7;
        }
        .food-item {
            display: flex;
            margin: 0.36rem;
            @include border-1px(rgba(7, 17, 27, 0.1));
            padding-bottom: 0.18rem;
            &:last-child {
                @include border-none();
                padding-bottom: 0;
            }
            .icon {
                flex: 0 0 1.04rem;
                margin-right: 0.2rem;
                img {
                    width: 1.04rem;
                    height: 1.04rem;
                }
            }
            .content {
                flex: 1;
                .name {
                    margin: 0.02rem 0 0.08rem 0;
                    line-height: 0.28rem;
                    font-size: 14px;
                    color: rgb(7, 17, 27);
                }
                .description,
                .extra {
                    line-height: 0.2rem;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
                .description {
                    margin-bottom: 0.16rem;
                    line-height: 0.3rem;
                }
                .extra {
                    .count {
                        margin-right: 0.24rem;
                    }
                }
                .cartcontrol-wrapper {
                    position: absolute;
                    right: 0;
                    bottom: 0.18rem;
                }
                .price {
                    font-weight: 700;
                    line-height: 0.48rem;
                    .current-price {
                        margin-right: 0.16rem;
                        font-size:14px;
                        color: rgb(240, 20, 20);
                    }
                    .old-price {
                        text-decoration: line-through;
                        font-size:10px;
                        color: rgb(147, 153, 159);
                    }
                }
            }
        }
    }
}
</style>
