<template id="myCoupon">
    <!-- 我的优惠券组件 -->
    <div class="wrap">
        <!-- hack IOS切换路由无法改变title的bug -->
        <iframe :src="iframe" style="display: none"></iframe>
        <div class="no-coupon" v-if="!coupon.length">
            <p>您尚未有优惠券哦~~</p>
        </div>
        <div class="my-coupon-container">
            <ul class="my-coupon-detail">
                <router-link v-for="cp in coupon" :to="{path:'tripend',query: {orderNo:orderNo,couponNo:cp.no}}" v-if="from">
                    <li>
                        <div v-if="cp.couponType==1">{{cp.value}}折</div>
                        <div v-if="cp.couponType==2">{{cp.value/100}}元</div>
                        <div>
                            <span v-if="cp.couponType==1">最高抵扣{{cp.maxDiscountAmout/100}}元</span>
                            <span v-if="cp.couponType==2&&cp.minOrderAmount">需要打车满{{cp.minOrderAmount/100}}元
                            </span>
                            <span v-if="cp.couponType==2&&!cp.minOrderAmount">
                            无任何使用门槛
                            </span>
                            <p>有效期至{{cp.expireTime}}</p>
                        </div>
                        <button class="coupon-btn">使用</button>
                    </li>
                </router-link>
                <li v-if="!from" v-for="cp in coupon">
                    <div v-if="cp.couponType==1">{{cp.value}}折</div>
                    <div v-if="cp.couponType==2">{{cp.value/100}}元</div>
                    <div>
                        <span v-if="cp.couponType==1">最高抵扣{{cp.maxDiscountAmout/100}}元</span>
                        <span v-if="cp.couponType==2&&cp.minOrderAmount">需要打车满{{cp.minOrderAmount/100}}元
                        </span>
                        <span v-if="cp.couponType==2&&!cp.minOrderAmount">
                        无任何使用门槛
                        </span>
                        <p>有效期至{{cp.expireTime}}</p>
                    </div>
                </li>
                <p style="height:1rem;" v-if="from"></p>
            </ul>
        </div>
        <router-link :to="{path:'tripend',query: {orderNo:orderNo}}">
            <button class="back-my-coupon" v-if="from">不使用优惠券</button>
        </router-link>
        <!-- <button class="back-my-coupon" v-if="!from">您的可用优惠券~~</button> -->
    </div>
</template>
<script>
import format from '../utils/formatTime';
import wx from '../utils/config';
export default {
    name: 'myCoupon',
    data: function() {
        return {
            usrId: '', //用户Id
            newCoupon: [], //每次请求新的数据
            coupon: [], //我的优惠券
            orderNo: '',
            index: 0,
            iframe: '',
            prevScrollTop: 0,
            pageCount: 8, //默认一次请求8条
            from: '' //来自个人中心还是我的行程付款选择优惠券
        }
    },
    created: function() {
        // 判断是否为ios设备，ios设备需要通过加载iframe来刷新title
        var hack_ios_changeTitle = (() => {
            if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                this.iframe = '/favicon.ico' + Math.random()
            }
        })();
        var getMyId = (() => {
            var userdata = JSON.parse(localStorage.getItem('userData'));
            this.openid = userdata.openId;
            this.usrId = userdata.usrId;
        })();
        this.getMyCoupon(0);
        this.lazyLoad();
        this.from = this.getOrderNo('orderNo') || false;
    },
    methods: {
        getOrderNo: function(attr) {
            var obj = {};
            var url = window.location.hash;
            if (url.indexOf('?') == -1) {
                return;
            }
            window.location.hash.split('?')[1].split('&').forEach(function(item, index) {
                obj[item.split('=')[0]] = item.split('=')[1];
            });
            return obj[attr];

        },
        /**
         * [getMyCoupon 获取用户所有的可用优惠券]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @param   {[number]}   index [分页请求的页数,每次滚动条到底部index加1,然后发起一次ajax异步请求]
         * @return  {[type]}         [description]
         */
        getMyCoupon: function(index, callback) {
            this.orderNo = this.getOrderNo('orderNo');
            var urlConnect = this.orderNo ? 'listcoupon4order' : 'listcoupon';
            var data = {
                usrId: this.usrId,
                orderNo: this.getOrderNo('orderNo') || '',
                pageIndex: (index || 0) * this.pageCount,
                pageCount: this.pageCount
            };
            axios({
                    method: 'post',
                    url: wx.getUrl(urlConnect),
                    data: wx.stringify(data),
                    headers: wx.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        var data = data.coupon;
                        this.newCoupon = data;
                        //合并两个数组
                        this.coupon = Array.prototype.concat.apply([], [this.coupon, data]);
                        this.formatTime();
                        callback && callback();

                    } else {
                        alert(data.rspDesc);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        /**
         * [lazyLoad 检测滚动条到底部自动加载请求更多的数据]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @return  {[type]}   [description]
         */
        lazyLoad: function() {

            setTimeout(() => {
                var scrollWrap = document.querySelector('.my-coupon-container');
                scrollWrap.onscroll = () => {
                    if (scrollWrap.scrollTop + scrollWrap.offsetHeight + 50 > scrollWrap.scrollHeight) {
                        this.index++;
                        this.getMyCoupon(this.index);
                    }
                }
            }, 100);
        },
        formatTime: function() {
            this.newCoupon.forEach((ele, index) => { //把时间戳转化成yyyy-MM-dd格式
                ele.expireTime = format.dateFilter(ele.expireTime, 2);
            });
        }
    }
}
</script>
<style scoped lang="sass">
@import "../lib/variable.scss";

.no-coupon {
    width: 100vw;
    height: 100vh;
    position: absolute;
    background-color: $body-bgc;
    z-index: 100;
    background: url("../assets/userCenter/no-quan@2x.png") no-repeat center 3rem;
    background-size:2rem;
    p {
        text-align: center;
        color: $explain-fc;
        font-size: $btn-fz;
        margin-top: 50vh;
    }
}

.my-coupon-container {
    height: 100vh;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background-color: $body-bgc;
    .my-coupon-detail li {
        height: 1.4rem;
        padding: 0.28rem 0.3rem;
        box-sizing: border-box;
        display:-webkit-box;
        margin-bottom: 0.2rem;
        background-color: $ele-bgc;
        div:first-child {
            width: 1.65rem;
            height: 0.85rem;
            white-space: nowrap;
            font-size: $money-fz;
            color: $strong-fc;
            font-weight: bold;
            display:-webkit-box;
            -webkit-box-align: center;
            text-indent: 0.5rem;
            background: url('../assets/userCenter/quan@2x.png') no-repeat;
            background-size: contain;
            margin-right: 0.3rem;
        }
        div:nth-of-type(2) {
            height: 0.85rem;
            line-height: 1.2em;
            display: -webkit-box;
            -webkit-box-align: center;
            -webkit-box-orient: vertical;
            span {
                font-size: $main-fz;
                color: $main-fc;
                display:block;
            }
            p {
                font-size: $tips-fz;
                color: $explain-fc;
                margin-top: 0;
                white-space: nowrap;
            }
        }
        .coupon-btn {
            margin-left: 0.4rem;
            background-color: $money-fc;
            outline: none;
            border: 1px solid $text-line;
            width: 1.5rem;
            height: 0.8rem;
            font-size: $tips-fz;
            white-space: nowrap;
            color: $ele-bgc;
        }
    }
}

.back-my-coupon {
    position: fixed;
    top: 89vh;
    left: 50%;
    width: 100vw;
    line-height: 1.3rem;
    font-size: $btn-fz;
    background-color: $ele-bgc;
    color: $money-fc;
    outline: none;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    border: none;
}
</style>
