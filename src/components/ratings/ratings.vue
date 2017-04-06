<template>
    <div class="ratings" ref="ratings">
        <div class="ratings-content">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <star :size="16" :score="seller.serviceScore"></star>
                        <span class="score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商品评分</span>
                        <star :size="16" :score="seller.foodScore"></star>
                        <span class="score">{{seller.foodScore}}</span>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="title">送达时间</span>
                        <span class="delivery">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <split></split>
            <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings"></ratingselect>
            <div class="rating-wrapper">
                <ul>
                    <li v-for="rating in ratings" v-show="needShow(rating.rateType, rating.text)" class="rating-item">
                        <div class="avatar">
                            <img :src="rating.avatar">
                        </div>
                        <div class="content">
                            <h1 class="name">{{rating.username}}</h1>
                            <div class="star-wrapper">
                                <star :size="12" :score="rating.score"></star>
                                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
                            </div>
                            <p class="text">{{rating.text}}</p>
                            <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                                <span class="icon-thumb_up"></span>
                                <span class="item" v-for="item in rating.recommend">{{item}}</span>
                            </div>
                            <div class="time">
                                {{rating.rateTime | formatDate}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
import {
    formatDate
} from 'common/js/date'
import star from 'components/score/score'
import ratingselect from 'components/ratingselect/ratingselect'
import split from 'components/split/split'

const ALL = 2
const ERR_OK = 0
const appData = require('../../../data.json')
const ratings = appData.ratings

export default {
    props: {
        seller: {
            type: Object
        }
    },

    data() {
        return {
            ratings: [],
            selectType: ALL,
            onlyContent: true
        }
    },

    created() {
        this.ratings = ratings
        this.$nextTick(f => {
            this.scroll = new BScroll(this.$refs.ratings, {
                click: true
            })
        })
    },

    methods: {
        getRatings() {
            // Vue.prototype.$http = axios
            this.$http({
                    method: 'get',
                    url: 'api/ratings',
                    params: {
                        ID: 12345
                    }
                })
                .then((res) => {
                    let data = res.data
                    if (data.errno === ERR_OK) {
                        this.ratings = data.data
                        this.$nextTick(f => {
                            this.scroll = new BScroll(this.$refs.ratings, {
                                click: true
                            })
                        })
                    }
                })
                .catch((err) => {
                    console.error(err)
                })
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
        star,
        split,
        ratingselect
    }
}
</script>
<style lang="sass">
@import '../../common/stylus/mixin.scss';
@import '../../common/stylus/base.scss';
.ratings {
    position: absolute;
    top: 3.5rem;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview {
        display: flex;
        padding: 0.36rem 0;
        .overview-left {
            flex: 0 0 137px;
            padding: 0.12rem 0;
            width: 137px;
            border-right: 1px solid rgba(7, 17, 27, 0.1);
            text-align: center;
            .score {
                margin-bottom: 0.12rem;
                line-height: 0.56rem;
                font-size: 0.48rem;
                color: #f90;
            }
            .title {
                margin-bottom: 0.16rem;
                line-height: 0.24rem;
                font-size: 12px;
                color: #07111b;
            }
            .rank {
                line-height: 0.2rem;
                font-size: 10px;
                color: #93999f;
            }
        }
        .overview-right {
            flex: 1;
            padding: 0.12rem 0 0.12rem 0.48rem;
            .score-wrapper {
                margin-bottom: 0.16rem;
                font-size: 0;
                .title {
                    display: inline-block;
                    line-height: 0.36rem;
                    vertical-align: top;
                    font-size: 12px;
                    color: #07111b;
                    margin-right: 0.16rem;
                }
                .star {
                    display: inline-block;
                    margin: 0 0.24rem;
                    vertical-align: middle;
                }
                .score {
                    display: inline-block;
                    line-height: 0.36rem;
                    vertical-align: top;
                    font-size: 12px;
                    color: #f90;
                    margin-left: 0.16rem;
                }
            }
            .delivery-wrapper {
                font-size: 0;
                .title {
                    line-height: 0.36rem;
                    font-size: 12px;
                    color: #07111b;
                }
                .delivery {
                    margin-left: 0.24rem;
                    font-size: 12px;
                    color: #93999f;
                }
            }
        }
    }
    .rating-wrapper {
        padding: 0 0.36rem;
        .rating-item {
            display: flex;
            padding: 0.36rem 0;
            @include border-1px(rgba(7, 17, 27, 0.1));
            .avatar {
                flex: 0 0 0.56rem;
                width: 0.56rem;
                margin-right: 0.24rem;
                img {
                    border-radius: 50%;
                    width: 0.56rem;
                    height: 0.56rem;
                }
            }
            .content {
                position: relative;
                flex: 1;
                .name {
                    margin-bottom: 4px;
                    line-height: 0.24rem;
                    font-size: 10px;
                    color: #07111b;
                }
                .star-wrapper {
                    margin-bottom: 0.12rem;
                    font-size: 0;
                    .star {
                        display: inline-block;
                        margin-right: 0.12rem;
                        vertical-align: top;
                    }
                    .delivery {
                        display: inline-block;
                        vertical-align: top;
                        line-height: 0.24rem;
                        font-size: 10px;
                        color: #93999f;
                    }
                }
                .text {
                    margin-bottom: 0.16rem;
                    line-height: 0.36rem;
                    color: #07111b;
                    font-size: 12px;
                }
                .recommend {
                    line-height: 0.32rem;
                    font-size: 0;
                    .icon-thumb_up,
                    .item {
                        display: inline-block;
                        margin: 0 0.16rem 0.08rem 0;
                        font-size: 9px;
                    }
                    .icon-thumb_up {
                        width: 0.32rem;
                        height: 0.32rem;
                        vertical-align: middle;
                        background: url('./icon/up.png') no-repeat;
                        background-size: contain;
                    }
                    .item {
                        padding: 0 0.12rem;
                        border: 1px solid rgba(7, 17, 27, 0.1);
                        border-radius: 1px;
                        color: #93999f;
                        background: #fff;
                    }
                }
                .time {
                    position: absolute;
                    top: 0;
                    right: 0;
                    line-height: 0.24rem;
                    font-size: 10px;
                    color: #93999f;
                }
            }
        }
    }
}

@media only screen and (max-width: 320px) {
    .ratings .overview .overview-left {
        flex: 0 0 120px;
        width: 120px;
    }
}

@media only screen and (max-width: 320px) {
    .ratings .overview .overview-right {
        padding-left: 0.12rem;
    }
}
</style>
