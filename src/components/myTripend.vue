<template id="myTripend">
    <!-- 订单状态-->
    <!--
        1-发单 2-取消订单 3-接单后取消订单 4-已接单 5-开始行程,进行中
         6-结束行程,等待支付 7-支付成功 8-支付失败 9-已评价
    -->
    <div class="wrap">
        <!-- hack IOS切换路由无法改变title的bug -->
        <iframe :src="iframe" style="display: none"></iframe>
        <!-- 行程结束组件 -->
        <div class="my-tripend-container">
            <!-- 司机信息 -->
            <div class="driver-info-wrap">
                <img :src="'http://qiniu.jijincar.com/'+driverInfo.imgUsr" alt="">
                <div class="driver-info">
                    <span class="driver-name">{{driverInfo.name}}</span>
                    <br>
                    <span class="driver-car-info">
                    {{carInfo.carType}}-{{carInfo.carNo}}
                    </span>
                </div>
                <a :href="'tel:'+driverInfo.mobile"><i class="driver-tel-icon"></i></a>
            </div>
            <!-- 行程信息 -->
            <div class="trip-info-wrap">
                <!-- 行程出发地和目的地 -->
                <div class="trip-addr">
                    <p class="addr-diff">
                        <i class="departure-icon"></i>
                        <span class="addr-diff-startAddr" :class="{'diffWidth':orderStatus==7}">{{orderDetail.startAddr}}</span>
                    </p>
                    <p class="addr-diff">
                        <i class="destination-icon"></i>
                        <span :class="{'diffWidth':orderStatus==7}">{{orderDetail.endAddr}}</span>
                    </p>
                    <p class="score-show" v-if="orderStatus==7">
                        <span>{{orderDetail.payAmount/100}}元</span>
                        <br>
                        <span v-if="orderDetail.payType==9">余额支付</span>
                        <span v-if="orderDetail.payType==4">微信支付</span>
                        <span v-if="orderDetail.payType==5">支付宝支付</span>
                    </p>
                </div>
                <!-- 行程具体信息和费用 -->
                <div class="trip-detail" v-if="orderStatus!==7&&orderStatus!==3">
                    <p>
                        <span>最低消费</span>
                        <span>{{orderDetail.initAmount/100}}元</span>
                    </p>
                    <p>
                        <span v-if="orderDetail.orderMileage>=1000">
                    里程({{(orderDetail.orderMileage/1000).toFixed(2)}}公里)
                        </span>
                        <span v-if="orderDetail.orderMileage<1000">
                    里程({{orderDetail.orderMileage}}米)
                        </span>
                        <span>
                    {{orderDetail.mileageAmount/100}}元
                        </span>
                    </p>
                    <p>
                        <span>时长({{Math.ceil(orderDetail.orderTime/1000/60)}}分钟)</span>
                        <span>{{orderDetail.timeAmount/100}}元</span>
                    </p>
                    <p v-if="orderDetail.nightServAmount">
                        <span>夜间服务费</span>
                        <span>{{orderDetail.nightServAmount/100||0}}元</span>
                    </p>
                    <p>
                        <span>合计</span>
                        <b>{{orderDetail.orderAmount/100}}元</b>
                    </p>
                </div>
            </div>
            <!-- 行程结束-取消行程 -->
            <div class="cancel-trip" v-if="orderStatus==3">
                <p class="cancel-icon"><i></i></p>
                <p class="cancel-title">
                    行程已取消
                </p>
                <p class="cancel-time">
                    {{cancelTime}}
                </p>
            </div>
            <!-- 行程结束-订单异常 -->
            <div class="order-abnormal" v-if="orderStatus==99">
                订单异常,请及时联系相关负责人!
            </div>
            <!-- 行程结束-支付模块 -->
            <div class="pay-methods-wrap" v-if="orderStatus==6 ||orderStatus==8">
                <h5>支付费用</h5>
                <div class="coupon" v-if="!orderFree.couponNum">
                    <span>优惠</span>
                    <span v-if="!orderFree.couponNum">
                        暂无优惠券可用
                    </span>
                </div>
                <router-link :to="{path:'coupon',query: {orderNo:orderDetail.orderNo}}" v-if="orderFree.couponNum">
                    <div class="coupon">
                        <span>优惠</span>
                        <span v-if="!!coupon.no" class="promotion-moneny">
                        -{{orderFree.couponAmount/100}}元
                        </span>
                        <span v-if="!!orderFree.couponNum&&!coupon.no">
                            {{orderFree.couponNum}}张优惠券可用
                            <em class="arrow"></em>
                        </span>
                    </div>
                </router-link>
                <div class="my-charge-way">
                    <!-- 余额充足时候首选余额支付 -->
                    <div class="remaining-pay-wrap" v-if="orderFree.availableAmt-orderFree.payAmount>=0">
                        <div class="remaining-pay">
                            <span>余额实付</span>
                            <span>{{orderFree.payAmount/100}}元</span>
                        </div>
                        <em class="current-money">
                        当前余额:{{orderFree.availableAmt/100}}元
                        </em>
                    </div>
                    <!-- 第三方支付,微信支付宝 -->
                    <div class="wx-ali-pay" v-if="orderFree.availableAmt-orderFree.payAmount<0">
                        <label for="chargeWxPay">
                            <p class="weixin-pay">
                                <i class="pay-icon"></i>
                                <input type="radio" hidden name="charge-pay" id="chargeWxPay" v-model="payorder.payType" value="4" number>
                                <span>微信支付</span>
                                <i class="pay-num">
                                需支付:<i>{{orderFree.payAmount/100}}</i>元
                                </i>
                                <label for="chargeWxPay" class="beautify-radio"></label>
                            </p>
                        </label>
                        <label for="chargeAliPay">
                            <p class="ali-pay">
                                <i class="pay-icon"></i>
                                <input type="radio" hidden name="charge-pay" id="chargeAliPay" v-model="payorder.payType" value="5" number>
                                <span>支付宝支付</span>
                                <i class="pay-num">
                                需支付:<i>{{orderFree.payAmount/100}}</i>元
                                </i>
                                <label for="chargeAliPay" class="beautify-radio"></label>
                            </p>
                        </label>
                    </div>
                    <button class="pay-btn" v-on:click="confirmPay">确认支付</button>
                </div>
            </div>
            <!-- 行程结束-已评价模块 -->
            <div class="pay-detail" v-if="orderStatus==9">
                <!-- 支付详情 -->
                <h5>支付详情</h5>
                <div>
                    <span>优惠</span>
                    <span>{{orderDetail.couponAmount?(-orderDetail.couponAmount/100+'元'):'没有使用优惠券'}}</span>
                </div>
                <div>
                    <span v-if="orderDetail.payType==9">余额实付</span>
                    <span v-if="orderDetail.payType==4">微信实付</span>
                    <span v-if="orderDetail.payType==5">支付宝实付</span>
                    <span>{{orderDetail.payAmount/100}}元</span>
                </div>
            </div>
            <!-- 行程结束-评分模块-->
            <div class="evaluation" v-if="orderStatus==7">
                <hr><span>匿名评价</span>
                <hr>
                <div class="evaluate">
                    <label :for="'item'+index" v-for="index in [1,2,3,4,5]">
                        <div class="star-five-wrap">
                            <input type="checkbox" name="score" :id="'item'+index" :value="index" hidden>
                            <i class="star-five"></i>
                        </div>
                    </label>
                </div>
                <button class="score-btn" disabled v-on:click="cmtorder">提交评价</button>
            </div>
            <!-- 行程结束-评分完成展示-->
            <div class="evaluation" v-if="orderStatus==9" :class="{'evaluation-diff':orderStatus==9}">
                <hr><span>匿名评价</span>
                <hr>
                <div class="evaluate">
                    <div class="star-five-wrap" v-for="index in scoreArray">
                        <i class="star-five-diff"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import wxData from '../utils/config';
import _AP from '../utils/pay';
import format from '../utils/formatTime';
export default {
    name: 'myTripend',
    data: function() {
        return {
            usrId: '',
            code: '',
            iframe: '',
            cancelTime: '',
            orderStatus: '',
            carInfo: '',
            driverInfo: '',
            orderDetail: '',
            orderFree: '',
            coupon: { //优惠券
                no: '',
                title: ''
            },
            payorder: {
                usrId: '',
                openid: '',
                orderNo: '',
                couponNo: '',
                payType: 4 //默认微信公众号支付
            },
            scoreNum: '',
            scoreArray: []
        }
    },
    created: function() {
        this.coupon.no = this.getParaName('couponNo') || '';

        this.code = this.getMyCode();

        var getMyId = (() => {
            var userdata = JSON.parse(localStorage.getItem('userData'));
            this.payorder.openid = userdata.openId;
            this.usrId = userdata.usrId;
        })();

        this.getQryorder(() => {
            this.setTitle();
            switch (this.orderStatus) {
                case 6:
                    this.getOrderfee();
                    break;
                case 7:
                    setTimeout(() => {
                        this.score();
                    }, 0);
                    break;
                case 8:
                    this.getOrderfee();
                    break;
            }
        });
    },
    methods: {
        setTitle: function() {
            var title = '';
            switch (this.orderStatus) {
                case 3:
                    title = "行程已取消";
                    break;
                case 6:
                    title = "行程结束-待支付";
                    break;
                case 7:
                    title = "行程结束-待评价";
                    break;
                case 8:
                    title = "行程结束-支付失败";
                    break;
                case 9:
                    title = "行程结束-已评价";
                    break;
                case 99:
                    title = "行程结束-订单异常";
                    break;
            }
            document.title = title;
            // 判断是否为ios设备，ios设备需要通过加载iframe来刷新title
            var hack_ios_changeTitle = (() => {
                if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    this.iframe = '/favicon.ico' + Math.random()
                }
            })();
        },
        getMyCode: function() {
            function getParamName(name) { //正则表达式实现
                var match = RegExp('[?&]' + name + '=([^&]*)')
                    .exec(window.location.search);
                return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
            };
            return getParamName('code');
        },
        getParaName: function(attr) {
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
        getQryorder: function(callback) {
            var data = {
                orderNo: this.getParaName('orderNo')
            };
            var orderData = axios({
                    method: 'post',
                    url: wxData.getUrl('qryorder'),
                    data: wxData.stringify(data),
                    headers: wxData.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        this.carInfo = data.car || {};
                        this.carInfo.carType = this.carInfo.carType ? this.carInfo.carType : '车型号未知';
                        this.carInfo.carNo = this.carInfo.carNo ? this.carInfo.carNo : '车牌号未知';
                        this.driverInfo = data.driver;
                        this.orderDetail = data.order;
                        this.orderStatus = data.order.orderStatus;
                        if (this.orderStatus == 3) {
                            this.cancelTime = format.dateFilter(data.order.createTime, 3);
                        }
                        if (this.orderStatus == 9) {
                            this.scoreArray.length = 0;
                            for (var i = 0; i < data.order.score; i++) {
                                this.scoreArray[i] = i;
                            }
                        }
                        callback && callback();
                    } else {
                        alert(data.rspDesc);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        getOrderfee: function(callback) {
            var data = {
                usrId: this.usrId,
                orderNo: this.getParaName('orderNo'),
                couponNo: this.coupon.no
            };
            var orderFree = axios({
                    method: 'post',
                    url: wxData.getUrl('orderfee'),
                    data: wxData.stringify(data),
                    headers: wxData.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        this.orderFree = data;
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
         * [confirmPay 点击确认支付按钮发起支付请求]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-12
         * @return  {[type]}   [description]
         */
        confirmPay: function() {
            var self = this;
            this.payorder.usrId = this.usrId;
            this.payorder.orderNo = this.getParaName('orderNo');
            this.payorder.couponNo = this.getParaName('couponNo');
            var payData = this.payorder;
            if (this.orderFree.availableAmt - this.orderFree.payAmount >= 0) {
                this.payorder.payType = 9;
            }

            var PAY_BACK = (orderNo, orderStatus) => {
                var data = {
                    orderNo: orderNo,
                    orderStatus: orderStatus
                };
                axios({
                        method: 'post',
                        url: wxData.getUrl('payback'),
                        data: wxData.stringify(data),
                        headers: wxData.getHeaders(data)
                    })
                    .then((res) => {
                        var data = res.data;
                        if (data.rspCode == "00") {
                            this.getQryorder(() => {
                                this.setTitle();
                                setTimeout(() => {
                                    this.score();
                                }, 100);
                            });
                        } else {
                            this.getQryorder(() => {
                                this.setTitle();
                                setTimeout(() => {
                                    this.score();
                                }, 100);
                            });
                            console.log(data.rspDesc);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            };

            /**
             * [EXTRA_PAY 余额支付]
             * This is a garbage function,Do you agree with me?
             * @Author jawil
             * @date   2016-12-14
             * @param  {[type]}   orderData [状态]
             */
            var EXTRA_PAY = function(orderData) {
                if (orderData.rspCode == "00") {
                    PAY_BACK(self.payorder.orderNo, 7);
                } else {
                    PAY_BACK(self.payorder.orderNo, 8);
                }
            };
            /**
             * [WX_PAY 发起微信支付请求]
             * This is a garbage function,Do you agree with me?
             * @Author jawil
             * @date   2016-12-10
             * @param  {[json]}   orderData [微信发起支付请求的json格式参数]
             */
            var WX_PAY = function(orderData) {
                wx.ready(function() {
                    wx.chooseWXPay({
                        timestamp: orderData.timeStamp, //支付签名时间戳
                        nonceStr: orderData.nonceStr, // 支付签名随机串，
                        package: orderData.package,
                        signType: orderData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: orderData.paySign, // 支付签名
                        //支付成功支付回调
                        success: function(res) {
                            setTimeout(() => {
                                PAY_BACK(self.payorder.orderNo, 7);
                            }, 100);
                        },
                        cancel: function(res) {
                            //PAY_BACK(self.payorder.orderNo, 8);
                        },
                        error: function(res) {
                            PAY_BACK(self.payorder.orderNo, 8);
                        }
                    });
                });
            };
            /**
             * [ALI_PAY 发起支付宝支付请求]
             * This is a garbage function,Do you agree with me?
             * @Author jawil
             * @date   2016-12-10
             * @param  {[string]}   orderData [支付宝请求参数配置字符串]
             */
            var ALI_PAY = function(orderData) {
                var urlspace = 'https://mapi.alipay.com/gateway.do?' + orderData;
                var url = urlspace.replace(/\s+/g, ""); //去掉链接中的空格
                var OA = document.createElement('a');
                OA.href = url;
                var url = OA.href;
                localStorage.setItem('isWhile', 'true');
                _AP.pay(url);
            };
            /**
             * [orderData 获取微信或者支付宝发起请求所需要的订单参数]
             *Y(1, "银联支付"), W(2, "微信支付"), A(3, "支付宝支付"),
             *WXMP(4, "微信公众号"), ALIH5(5, "支付宝网页支付"), WALLET(9, "钱包支付");
             * @type {[type]}
             */
            var orderData = axios({
                    method: 'post',
                    url: wxData.getUrl('payorder'),
                    data: wxData.stringify(self.payorder),
                    headers: wxData.getHeaders(self.payorder)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        self.orderNo = data.orderNo;
                        switch (Number(self.payorder.payType)) {
                            case 5:
                                ALI_PAY(data.od);
                                break;
                            case 4:
                                WX_PAY(data);
                                break;
                            case 9:
                                EXTRA_PAY(data);
                                break;
                        }
                    } else {
                        alert(data.rspDesc);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        /**
         * [score 用户评分模块]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @return  {[type]}   [description]
         */
        score: function() {
            var iScore = document.querySelectorAll('.star-five-wrap');
            var iInput = document.getElementsByName('score');
            var self = this;
            Array.prototype.slice.call(iScore).forEach(function(ele, index) {
                ele.addEventListener('click', function(ev) {
                    ev.preventDefault();
                    self.scoreNum = index + 1;
                    document.querySelector('.score-btn').disabled = false;
                    for (var i = 0; i < iScore.length; i++) {
                        iInput[i].checked = false;
                    }
                    for (var i = 0; i <= index; i++) {
                        iInput[i].checked = true;
                    }
                });
            });
        },
        /**
         * [cmtorder 用户提交评价确认打分]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @return  {[type]}   [description]
         */
        cmtorder: function() {
            var data = {
                usrId: this.usrId,
                orderNo: this.getParaName('orderNo'),
                score: this.scoreNum
            };
            axios({
                    method: 'post',
                    url: wxData.getUrl('cmtorder'),
                    data: wxData.stringify(data),
                    headers: wxData.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        this.getQryorder(() => {
                            this.setTitle();
                            setTimeout(() => {
                                window.location.href = wxData.jumpLogin;
                            }, 3000);
                        });
                    } else {
                        alert(data.rspDesc);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }
}
</script>
<style scoped lang="sass">
@import "../lib/variable.scss";
.my-tripend-container {
    min-height: 100vh;
    height: auto;
    overflow: hidden;
    div {
        background-color: $ele-bgc;
    }
    .driver-info-wrap {
        padding: 0.2rem;
        box-sizing: border-box;
        font-size: 0;
        img {
            width: .9rem;
            height: .9rem;
            border-radius: 50%;
            margin-right: 0.27rem;
            vertical-align: middle;
        }
        .driver-info {
            display: inline-block;
            vertical-align: middle;
            span:nth-of-type(1) {
                font-size: $main-fz;
            }
            span:nth-of-type(2) {
                font-size: $tips-fz;
                color: $explain-fc;
            }
        }
        .driver-tel-icon {
            float: right;
            width: 0.6rem;
            height: 0.6rem;
            margin-top: 0.15rem;
            background: url("../assets/userCenter/phone@2x.png") no-repeat;
            background-size: contain;
        }
    }
    /* 行程信息 */
    .trip-info-wrap {
        margin-top: 0.15rem;
        position: relative;
        /* 行程出发地和目的地 */
        .trip-addr {
            font-size: 0;
            box-sizing: border-box;
            padding: 0.1rem 0;
            p {
                line-height: .6rem;
                text-indent: 0.2rem;
                font-size: $main-fz;
                color: $main-fc;
                i {
                    width: 0.3rem;
                    height: 0.4rem;
                    display: inline-block;
                    vertical-align: middle;
                }
                i.departure-icon {
                    background: url("../assets/userCenter/addr-start@2x.png") no-repeat;
                    background-size: contain;
                }
                i.destination-icon {
                    background: url("../assets/userCenter/addr-end@2x.png") no-repeat;
                    background-size: contain;
                }
            }
            .addr-diff {
                /*  .addr-diff-startAddr {
                    padding-bottom: 0.2rem;
                } */
                span {
                    width: 90%;
                    vertical-align: middle;
                    display: inline-block;
                    line-height: 0.4rem;
                    text-indent: 0;
                }
                .diffWidth {
                    width: 65%;
                }
            }
            .score-show {
                text-align: center;
                line-height: 0.4rem;
                position: absolute;
                right: 5%;
                top: 50%;
                -webkit-transform: translateY(-50%);
                span:first-child {
                    color: $money-fc;
                    font-size: $money-fz;
                }
                span:last-child {
                    color: $explain-fc;
                    font-size: $tips-fz;
                }
            }
        }
        /* 行程具体信息和费用 */
        .trip-detail {
            border-top: 1px solid $text-line;
            border-bottom: 1px solid $text-line;
            margin-bottom: 0.14rem;
            padding: 0.2rem 0;
            padding-bottom: 0.3rem;
            p:first-child {
                border-bottom: 1px solid $text-line;
                font-size: $tips-fz;
                color: gray;
                padding-bottom: 0.15rem;
                font-weight: bold;
            }
            p {
                line-height: 0.48rem;
                display: -webkit-box;
                -webkit-box-pack: justify;
                font-size: $tips-fz;
                color: $explain-fc;
                padding: 0 0.2rem;
                span {
                    display: block;
                }
                b {
                    font-size: $sub-fz;
                    color: $strong-fc;
                    font-weight: bold;
                }
            }
        }
    }
    /* 订单异常 */
    .order-abnormal {
        padding-top: 2rem;
        min-height: 30vh;
        text-align: center;
        font-size: $money-fz;
        color: red;
    }
    /* 取消行程 */
    .cancel-trip {
        text-align: center;
        padding-top: 0.3rem;
        border-top: 1px solid $text-line;
        color: $main-fc;
        font-size: $money-fz;
        height: 90vh;
        .cancel-icon {
            margin: 0.6rem 0;
            i {
                display: inline-block;
                width: 2rem;
                height: 2rem;
                background: url("../assets/userCenter/cancel-trip.png") no-repeat;
                background-size: contain;
            }
        }
        .cancel-time {
            color: $explain-fc;
            font-size: $main-fz;
            width: 100%;
            margin-top: 0.3rem;
        }
    }
    /* 支付方式 */
    .pay-methods-wrap {
        font-size: $main-fz;
        color: $main-fc;
        height: auto;
        min-height: 51vh;
        background-color: $ele-bgc;
        a {
            color: $main-fc;
        }
        h5 {
            padding: 0.2rem 0.25rem;
            font-size: $main-fz;
            border-bottom: 1px solid $text-line;
        }
        .coupon,
        .remaining-pay {
            padding: 0.2rem 0.25rem;
            display: -webkit-box;
            -webkit-box-pack: justify;
            border-bottom: 1px solid $text-line;
            span {
                display: block;
            }
            span:first-child {
                font-weight: 400;
            }
            span:last-child {
                /* padding-right: .5rem; */
                position: relative;
                color: $explain-fc;
            }
            em.arrow {
                position: absolute;
                right: -0.2rem;
                width: 0.23rem;
                height: 0.43rem;
                top: 50%;
                -webkit-transform: translateY(-50%);
                vertical-align: middle;
                background: url("../assets/userCenter/right-arrow@2x.png") no-repeat;
                background-size: contain;
            }
            .promotion-moneny {
                color: $strong-fc!important;
            }
        }
        .remaining-pay span:last-child {
            padding: 0;
            color: $money-fc;
            font-size: $money-fz;
        }
        .current-money {
            float: right;
            padding: 0.2rem 0.2rem;
            color: $explain-fc;
            font-size: $tips-fz;
        }
        .my-charge-way {
            position: relative;
            /* border:1px solid red; */
            overflow: hidden;
            .wx-ali-pay {
                background-color: $ele-bgc;
                p:first-child {
                    border-bottom: 1px solid $text-line;
                }
                .weixin-pay .pay-icon {
                    background: url("../assets/userCenter/weixin@2x.png") no-repeat;
                    background-size: contain;
                }
                .ali-pay .pay-icon {
                    background: url("../assets/userCenter/zhifubao@2x.png") no-repeat;
                    background-size: contain;
                }
                /*微信和支付宝支付*/
                p {
                    padding: 0.2rem 0.25rem;
                    font-size: $main-fz;
                    .pay-icon {
                        display: inline-block;
                        width: 1.7em;
                        height: 1.7em;
                        vertical-align: middle;
                    }
                    .pay-num {
                        display: none;
                        margin-left: 0.7rem;
                        vertical-align: middle;
                        i {
                            color: $money-fc;
                            font-size: $money-fz;
                        }
                    }
                    span {
                        vertical-align: middle;
                        margin-left: 0.2rem;
                    }
                    .beautify-radio {
                        display: inline-block;
                        width: .7rem;
                        height: .7rem;
                        border: 1px solid $text-line;
                        float: right;
                        border-radius: .7rem;
                        margin-top: -0.08rem;
                        background: url('../assets/userCenter/notchoose@2x.png') no-repeat;
                        background-size: contain;
                    }
                    input[type="radio"]:checked + span {
                        font-weight: bold;
                    }
                    input[type="radio"]:checked + span +.pay-num {
                        display: inline-block;
                    }
                    input[type="radio"]:checked + span +.pay-num+ .beautify-radio {
                        border: 1px solid $money-fc;
                        background: url('../assets/userCenter/choosed@2x.png') no-repeat;
                        background-size: contain;
                    }
                }
            }
            /*确认支付按钮*/
            .pay-btn {
                color: $ele-bgc;
                font-size: $btn-fz;
                width: 6.2rem;
                height: 1rem;
                display: block;
                margin: 0.6rem auto;
                outline: none;
                border: none;
                background-color: $money-fc;
            }
        }
    }
    /* 支付详情模块 */
    .pay-detail {
        font-size: $main-fz;
        color: $main-fc;
        h5 {
            padding: 0.2rem 0.25rem;
            border-bottom: 1px solid $text-line;
        }
        div {
            padding: 0.2rem 0.25rem;
            display: -webkit-box;
            -webkit-box-pack: justify;
            span {
                display: block;
            }
            border-bottom: 1px solid $text-line;
            span:last-child {
                font-size: $money-fz;
                color: $money-fc;
            }
        }
    }
    /* 支付完成评分 */
    .evaluation-diff {
        height:11vh!important;
        padding: 0;
    }
    .evaluation {
        padding: 0.5rem 0rem;
        background-color: $body-bgc;
        position: relative;
        height: 50vh;
        font-size: 0;
        text-align: center;
        .evaluate {
            text-indent: -0.3rem;
        }
        hr {
            display: inline-block;
            width: 2rem;
            border: 1px solid $bg-line;
            vertical-align: middle;
        }
        span {
            vertical-align: middle;
            font-size: $main-fz;
            color: $explain-fc;
            padding: 0 0.33rem;
        }
        div {
            background-color: $body-bgc;
            text-align: center;
        }
        .score-btn {
            color: $ele-bgc;
            font-size: $btn-fz;
            position: absolute;
            width: 6.2rem;
            height: 1rem;
            left: 50%;
            bottom: 0;
            -webkit-transform: translateX(-50%);
            outline: none;
            border: none;
            background-color: $money-fc;
        }
        .score-btn:disabled {
            color: $explain-fc;
            background-color: $text-line;
        }
        .star-five-wrap {
            display: inline-block;
            width: 30px;
            height: 40px;
            margin-top: 10px;
            margin-right: 5px;
        }
        /*五角星模块*/
        .star-five,
        .star-five-diff {
            margin: 15px 0;
            position: absolute;
            display: inline-block;
            color: #D6D6D6;
            width: 0px;
            height: 0px;
            border-right: 10px solid transparent;
            border-bottom: 7px solid #D6D6D6;
            border-left: 10px solid transparent;
            -webkit-transform: rotate(35deg);
        }
        .star-five:before,
        .star-five-diff:before {
            border-bottom: 8px solid #D6D6D6;
            border-left: 3px solid transparent;
            border-right: 3px solid transparent;
            position: absolute;
            height: 0;
            width: 0;
            top: -4.5px;
            left: -6.5px;
            display: block;
            content: '';
            -webkit-transform: rotate(-35deg);
        }
        .star-five:after,
        .star-five-diff:after {
            position: absolute;
            display: block;
            color: #D6D6D6;
            top: .3px;
            left: -10.5px;
            width: 0px;
            height: 0px;
            border-right: 10px solid transparent;
            border-bottom: 7px solid #D6D6D6;
            border-left: 10px solid transparent;
            -webkit-transform: rotate(-70deg);
            content: '';
        }
        input[type="checkbox"]:checked + .star-five,
        input[type="checkbox"]:checked + .star-five::before,
        input[type="checkbox"]:checked + .star-five::after {
            border-bottom: 8px solid #FF9494;
        }
        .star-five-diff,
        .star-five-diff:before,
        .star-five-diff:after {
            border-bottom: 8px solid #FF9494;
        }
    }
}
</style>
