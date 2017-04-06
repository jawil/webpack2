<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img :src="seller.avatar" alt="">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div class="support" v-if="seller.supports">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div class="support-count" v-if="seller.supports" @click="showDetail">
                {{seller.supports.length}}个&nbsp;&gt;
            </div>
        </div>
        <div class="bulletin-wrapper" @click="showDetail">
            <span class="bulletin-title"></span>
            <span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="right-arrow">&gt; </i>
        </div>
        <div class="background-wrapper">
            <img :src="seller.avatar" alt="">
        </div>
        <transition name="fade">
            <div class="detail-wrapper" v-show="isDetailShow">
                <div class="detail-content clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="five-star-wrapper">
                            <v-score :score="seller.score"></v-score>
                        </div>
                        <h2 class="promotion-title">
                        <span class="line"></span>
                        <span class="text">优惠信息</span>
                        <span class="line"></span>
                    </h2>
                        <div class="promotion-msg">
                            <ul class="promotion-list" v-if="seller.supports">
                                <li v-for="item in seller.supports">
                                    <span class="icon" :class="classMap[item.type]"></span>
                                    <span class="text">{{item.description}}</span>
                                </li>
                            </ul>
                        </div>
                        <h2 class="notice-title">
                        <span class="line"></span>
                        <span class="text">商家公告</span>
                        <span class="line"></span>
                    </h2>
                        <div class="notice-text">
                            {{seller.bulletin}}
                        </div>
                    </div>
                </div>
                <div class="detail-close">
                    <i class="icon-close" @click="hideDetail">X</i>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import score from 'components/score/score.vue'
export default {
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
            isDetailShow: false
        }
    },
    created() {
        this.classMap = ['decrease', 'discount', 'special', 'guarantee', 'invoice']
    },
    components: {
        'v-score': score
    },
    methods: {
        showDetail() {
            this.isDetailShow = true
        },
        hideDetail() {
            this.isDetailShow = false
        }
    }
}
</script>
<style lang="sass">
@import '../../common/stylus/mixin.scss';
@import '../../common/stylus/base.scss';
.header {
    color: #fff;
    background: rgba(7, 17, 27, 0.5);
    overflow: hidden;
    position: relative;
    .content-wrapper {
        display: flex;
        padding: 0.48rem 0.24rem 0.36rem 0.48rem;
        position: relative;
        .avatar {
            width: 1.28rem;
            height: 1.28rem;
            img {
                border-radius: 5px;
            }
        }
        .content {
            padding-left: 0.32rem;
            color: rgb(255, 255, 255);
            .title {
                margin: 0.04rem 0 0.16rem 0;
                .brand {
                    display: inline-block;
                    width: 0.6rem;
                    height: .34rem;
                    @include bg-image('./icon/brand');
                    background-repeat: no-repeat;
                    background-size: contain;
                    vertical-align: top;
                }
                .name {
                    font-size: 0.32rem;
                    font-weight: bold;
                    line-height: 0.36rem;
                }
            }
            .description,
            .support {
                font-weight: 200;
                line-height: 0.24rem;
            }
            .description {
                font-size: 0.24rem;
                margin-bottom: 0.15rem;
            }
            .support {
                font-size: 0.2rem;
                .icon {
                    display: inline-block;
                    width: 0.32rem;
                    height: .32rem;
                    background-repeat: no-repeat;
                    background-size: contain;
                    vertical-align: middle;
                    &.decrease {
                        @include bg-image('./icon/decrease_1');
                    }
                    &.discount {
                        @include bg-image('./icon/discount_1');
                    }
                    &.special {
                        @include bg-image('./icon/special_1');
                    }
                    &.guarantee {
                        @include bg-image('./icon/guarantee_1');
                    }
                    &.invoice {
                        @include bg-image('./icon/invoice_1');
                    }
                }
                .text {
                    vertical-align: middle;
                }
            }
        }
        .support-count {
            position: absolute;
            right: 0.24rem;
            bottom: 0.36rem;
            width: 1rem;
            background-color: rgba(0, 0, 0, 0.2);
            color: rgb(255, 255, 255);
            font-size: 0.20rem;
            font-weight: 200;
            line-height: 0.5rem;
            border-radius: 0.5rem;
            text-align: center;
        }
    }
    .bulletin-wrapper {
        font-size: 0.20rem;
        padding: 0 0.24rem;
        background: rgba(7, 17, 27, 0.2);
        color: rgb(255, 255, 255);
        font-weight: 200;
        .bulletin-title {
            display: inline-block;
            width: 0.44rem;
            height: 0.24rem;
            vertical-align: middle;
            @include bg-image('./icon/bulletin');
            background-repeat: no-repeat;
            background-size: contain;
        }
        .bulletin-text {
            line-height: 0.56rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            display: inline-block;
            max-width: 85%;
            vertical-align: middle;
            margin: 0 0.08rem;
        }
    }
    .background-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        filter: blur(10px);
        img {
            width: 100%;
            height: 100%;
        }
    }
    .fade-enter {
        opacity: 0;
        background: rgba(7, 17, 27, 0);
    }
    .fade-leave-active {
        opacity: 0;
        background: rgba(7, 17, 27, 0);
    }
    .detail-wrapper {
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        transition: all 0.7s;
        background: rgba(7, 17, 27, 0.8);
        -webkit-backdrop-filter: blur(10px);
        .detail-content {
            min-height: 100%;
            .detail-main {
                margin-top: 1.28rem;
                padding-bottom: 1rem;
                .name {
                    font-size: 0.36rem;
                    font-weight: 700;
                    color: rgb(255, 255, 255);
                    line-height: 0.32rem;
                    text-align: center;
                }
                .five-star-wrapper {
                    text-align: center;
                    margin: 0.32rem 0 0.56rem 0;
                }
                .promotion-title,
                .notice-title {
                    padding: 0 0.72rem;
                    font-size: 0;
                    text-align: center;
                    line-height: .4rem;
                    display: flex;
                    align-items: center;
                    .text {
                        margin: 0 0.24rem 0 0.24rem;
                        font-size: 0.30rem;
                    }
                    .line {
                        font-size: 0;
                        display: inline-block;
                        width: 2.1rem;
                        border-top: 1px solid rgba(255, 255, 255, 0.2);
                    }
                }
                .promotion-msg {
                    margin: 0.48rem 0 0.58rem;
                    padding: 0 0.72rem;
                    .promotion-list li {
                        font-size: 0.24rem;
                        font-weight: 200px;
                        color: rgb(255, 255, 255);
                        margin-bottom: 0.24rem;
                        .icon {
                            display: inline-block;
                            width: 0.32rem;
                            height: .32rem;
                            background-repeat: no-repeat;
                            background-size: contain;
                            vertical-align: middle;
                            &.decrease {
                                @include bg-image('./icon/decrease_1');
                            }
                            &.discount {
                                @include bg-image('./icon/discount_1');
                            }
                            &.special {
                                @include bg-image('./icon/special_1');
                            }
                            &.guarantee {
                                @include bg-image('./icon/guarantee_1');
                            }
                            &.invoice {
                                @include bg-image('./icon/invoice_1');
                            }
                        }
                        .text {
                            vertical-align: middle;
                        }
                    }
                    .promotion-list li:last-child {
                        margin-bottom: 0;
                    }
                }
                .notice-text {
                    padding: 0 0.72rem;
                    margin-top: 0.48rem;
                    font-size: 0.28rem;
                    font-weight: 200;
                    color: (255, 255, 255);
                    line-height: 0.48rem;
                }
            }
        }
        .detail-close {
            position: relative;
            width: 0.64rem;
            line-height: 0.64rem;
            margin: -1rem auto 0 auto;
            clear: both;
            font-size: 0.64rem;
            text-align: center;
            color: rgba(255, 255, 255, 0.5);
        }
    }
}
</style>
