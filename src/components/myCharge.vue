<template id="myCharge">
    <div class="wrap" v-title data-title="我的充值">
        <!-- hack IOS切换路由无法改变title的bug -->
        <iframe :src="iframe" style="display: none"></iframe>
        <!-- 充值人民币组件 -->
        <div class="my-charge-container">
            <router-link to='/account'>
                <div class="my-extra">
                    <span>
                    <strong><i class="extra-icon"></i>{{currentMoney/100}}元</strong>
                 </span>
                    <br> <span>当前余额</span>
                </div>
            </router-link>
            <div class="my-charge-num">
                <h4> 请选择充值金额</h4>
                <ul class="charge-detail-num">
                    <div v-for='data in dataDict'>
                        <input type="radio" hidden name="num" :id="data.id" v-model="paywallet.orderAmount" :value="data.key" number>
                        <label :for="data.id">
                            <li>{{data.key/100}}元</li>
                        </label>
                    </div>
                </ul>
                <div class="charge-promotion"> <em>{{promotion[paywallet.orderAmount]}}</em> </div>
            </div>
            <div class="my-charge-way">
                <div class="wx-ali-pay">
                    <label for="chargeWxPay">
                        <p class="weixin-pay"> <i class="pay-icon"></i>
                            <input type="radio" hidden name="charge-pay" id="chargeWxPay" value="4" v-model="paywallet.payType">
                            <span>微信支付</span>
                            <label for="chargeWxPay" class="beautify-radio"></label>
                        </p>
                    </label>
                    <label for="chargeAliPay">
                        <p class="ali-pay"> <i class="pay-icon"></i>
                            <input type="radio" hidden name="charge-pay" id="chargeAliPay" value="5" v-model="paywallet.payType">
                            <span>支付宝支付</span>
                            <label for="chargeAliPay" class="beautify-radio"></label>
                        </p>
                    </label>
                </div>
                <button class="pay-btn" v-on:click="confirmPay">确认充值</button>
            </div>
        </div>
    </div>
</template>
<script>
import wxData from '../utils/config';
import _AP from '../utils/pay';
export default {
    name: 'myCharge',
    data() {
        return {
            usrId: '',
            defaultChargeMoney: '',
            currentMoney: '',
            dataDict: [],
            orderNo: '',
            iframe: '',
            promotion: {},
            paywallet: {
                openid: '', //此处不是小驼峰都是小写,后面的是小驼峰openId
                orderAmount: '',
                payType: 4, //默认微信公众号支付
                usrId: ''
            }
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
            this.usrId = userdata.usrId;
            this.paywallet.openid = userdata.openId;
            this.paywallet.usrId = userdata.usrId;
        })();
        this.getMyWallet();
        this.getDataDict(() => {
            //初始化单选按钮的默认选择,默认选择100元充值和微信支付
            this.paywallet.orderAmount = this.defaultChargeMoney;
        });
    },
    methods: {
        /**
         * [getDataDict 获取充值默认金额和充值优惠,冲一万送女朋友]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @param  {[function]} callBack [回调函数]
         * @return  {[type]}            [description]
         */
        getDataDict: function(callBack) {
            var data = {
                groupNo: 'charge_rules'
            };
            axios({
                    method: 'post',
                    url: wxData.getUrl('getdatadict'),
                    data: wxData.stringify(data),
                    headers: wxData.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        this.dataDict = data.data;
                        this.defaultChargeMoney = this.dataDict[0].key;
                        this.dataDict.forEach((ele, index) => {
                            this.promotion[ele.key] = ele.keyDisplay;
                        });
                        callBack && callBack();
                    } else {
                        alert(data.rspDesc);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        /**
         * [getMyWallet 调用钱包接口获取当前充值页面的余额]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @return  {[type]}   [description]
         */
        getMyWallet: function(callback) {
            var data = {
                usrId: this.usrId
            };
            axios({
                    method: 'post',
                    url: wxData.getUrl('qrywallet'),
                    data: wxData.stringify(data),
                    headers: wxData.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        var data = data.wallet;
                        this.currentMoney = data.balanceAmt || 0;
                        this.walletStatus = data.walletStatus;
                        callback && callback();

                    } else if (data.rspCode == "1008") {
                        this.currentMoney = data.balanceAmt || 0;
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
         * @date    2016-12-09
         * @return  {[type]}   [description]
         */
        confirmPay: function() {
            var userdata = localStorage.getItem('userData');
            var self = this;
            /**
             * [WX_PAY_BACK 微信支付回调]
             * This is a garbage function,Do you agree with me?
             * @Author jawil
             * @date   2016-12-10
             * @param  {[string]}   orderNo     [订单编号]
             * @param  {[number]}   orderStatus [订单状态]
             */
            var WX_PAY_BACK = function(orderNo, orderStatus) {
                var data = {
                    orderNo: orderNo,
                    orderStatus: orderStatus
                };
                axios({
                        method: 'post',
                        url: wxData.getUrl('walletpayback'),
                        data: wxData.stringify(data),
                        headers: wxData.getHeaders(data)
                    })
                    .then((res) => {
                        var data = res.data;
                        if (data.rspCode != "00") {
                            console.log(data.rspDesc);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
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
                        timestamp: Number(orderData.timeStamp), //支付签名时间戳
                        nonceStr: orderData.nonceStr, // 支付签名随机串，
                        package: orderData.package,
                        signType: orderData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: orderData.paySign, // 支付签名
                        //支付成功支付回调
                        success: function(res) {
                            WX_PAY_BACK(self.orderNo, 7);
                            var url = window.location.href;
                            window.location.href = url.split(window.location.hash)[0] + '#/account';
                        },
                        cancel: function(res) {
                            WX_PAY_BACK(self.orderNo, 8);
                        },
                        error: function(res) {
                            WX_PAY_BACK(self.orderNo, 8);
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
                localStorage.setItem('isWhile', 'false');
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
                    url: wxData.getUrl('paywallet'),
                    data: wxData.stringify(self.paywallet),
                    headers: wxData.getHeaders(self.paywallet)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        self.orderNo = data.orderNo;
                        switch (Number(self.paywallet.payType)) {
                            case 5:
                                ALI_PAY(data.od);
                                break;
                            case 4:
                                WX_PAY(data);
                                break;
                            default:
                                break;
                        }
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
.my-charge-container {
    height: 100%;
    .my-extra {
        height: 15vh;
        width: 7.2rem;
        padding-top: .3rem;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
        position: relative;
        background-color: $ele-bgc;
        span:nth-of-type(1) {
            font-size: 0.55rem;
            color: $money-fc;
            position: relative;
            .extra-icon {
                position: absolute;
                width: 1em;
                height: 1em;
                margin-left: -0.7rem;
                top: 50%;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
                background: url("../assets/userCenter/remaining@2x.png") no-repeat;
                background-size: contain;
            }
        }
        span:nth-of-type(2) {
            font-size: 0.3rem;
            color: $explain-fc;
        }
    }
    .my-charge-num {
        height: 41vh;
        margin-top: 0.2rem;
        border-bottom: 1px solid #e4e4e4;
        padding: 0 .58rem;
        text-align: center;
        background-color: #FFF;
        em {
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            white-space: nowrap;
        }
        h4 {
            font-weight: normal;
            line-height: 1rem;
            position: relative;
            font-size: $main-fz;
        }
        .charge-detail-num {
            overflow: hidden;
            height: 50%;
            padding-bottom: 0.1rem;
            input[type="radio"]:checked +label li {
                color: $money-fc;
                border: 1px solid $money-fc;
            }
            li {
                width: 1.81rem;
                height: 0.9rem;
                float: left;
                margin-right: 0.2rem;
                margin-top: 0.2rem;
                line-height: 0.9rem;
                font-size: $btn-fz;
                color: $main-fc;
                border: 1px solid $text-line;
                box-sizing: border-box;
            }
            li.margin0 {
                margin-right: 0;
            }
        }
        .charge-promotion {
            height: 30%;
            color: $strong-fc;
            font-size: $btn-fz;
        }
    }
    .my-charge-way {
        height: 40vh;
        padding-top: 0.2rem;
        position: relative;
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
                padding: 3% 0.3rem;
                font-size: $main-fz;
                .pay-icon {
                    display: inline-block;
                    width: 1.7em;
                    height: 1.7em;
                    vertical-align: middle;
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
                    background-size: cover;
                }
                input[type="radio"]:checked + span {
                    font-weight: bold;
                }
                input[type="radio"]:checked + span + .beautify-radio {
                    border: 1px solid $money-fc;
                    background: url('../assets/userCenter/choosed@2x.png') no-repeat;
                    background-size: cover;
                }
            }
        }
        .pay-btn {
            color: $ele-bgc;
            font-size: $btn-fz;
            position: absolute;
            bottom: 0.7rem;
            width: 6.2rem;
            height: 1rem;
            left: 50%;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
            outline: none;
            border: none;
            background-color: $money-fc;
        }
    }
}
</style>
