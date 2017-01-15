<template id="myWallet">
    <!-- 我的钱包组件 -->
    <div class="wrap">
        <!-- hack IOS切换路由无法改变title的bug -->
        <iframe :src="iframe" style="display: none"></iframe>
        <div class="my-extra-container">
            <router-link to="/account">
                <div class="my-extra">
                    <span><i class="extra-icon"></i>{{currentMoney/100}}元</span>
                    <br>
                    <span>当前余额</span>
                    <i class="show-icon"></i>
                </div>
            </router-link>
            <router-link to="/charge">
                <div class="recharge">
                    <i class="recharge-icon"></i>
                    <span>充值<i class="promotion">({{keyDisplay}})</i></span>
                    <i class="show-icon"></i>
                </div>
            </router-link>
            <router-link to="/coupon">
                <div class="coupon">
                    <i class="coupon-icon"></i>
                    <span>我的优惠券</span>
                    <i class="show-icon"></i>
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
import wx from '../utils/config';
export default {
    name: 'myWallet',
    data() {
        return {
            iframe: '',
            usrId: '', //用户Id
            currentMoney: '', //当前余额
            keyDisplay: '',
            walletStatus: '' //钱包状态,钱包状态 0-无效，尚未开通，1-有效
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
        this.getMyWallet();
        this.getDataDict();
    },
    methods: {
        /**
         * [getMyWallet 用户获取我的钱包信息]
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
                    url: wx.getUrl('qrywallet'),
                    data: wx.stringify(data),
                    headers: wx.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        var data = data.wallet;
                        this.currentMoney = data.availableAmt || 0;
                        this.walletStatus = data.walletStatus;
                        callback && callback();

                    } else if (data.rspCode == "1008") {
                        this.currentMoney = data.availableAmt || 0;
                        callback && callback();
                    } else if (data.rspCode == "101") {
                        localStorage.removeItem('userData');
                        window.location.href = wx.jumpLogin;
                    } else {
                        alert(data.rspDesc);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
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
                    url: wx.getUrl('getdatadict'),
                    data: wx.stringify(data),
                    headers: wx.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        this.dataDict = data.data;
                        this.keyDisplay = this.dataDict[0].keyDisplay || '';
                        callBack && callBack();
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
.my-extra-container {
    min-height: 100vh;
    .show-icon {
        position: absolute;
        right: 5%;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        width: .24rem;
        height: .42rem;
        background: url("../assets/userCenter/right-arrow@2x.png") no-repeat;
        background-size: contain;
    }
    a {
        color: $main-fc;
    }
    .my-extra {
        height: 1.5rem;
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
                transform: translateY(-50%);
                -webkit-transform: translateY(-50%);
                background: url("../assets/userCenter/remaining@2x.png") no-repeat;
                background-size: contain;
            }
        }
        span:nth-of-type(2) {
            font-size: 0.3rem;
            color: $explain-fc;
        }
    }
    .recharge {
        margin-top: .3rem;
        .promotion {
            color: $explain-fc;
        }
    }
    .recharge,
    .coupon {
        position: relative;
        border-bottom: 1px solid $text-line;
        line-height: 1rem;
        font-size: $main-fz;
        background-color: $ele-bgc;
        span {
            vertical-align: middle;
        }
    }
    .recharge-icon,
    .coupon-icon {
        display: inline-block;
        width: .4rem;
        height: .4rem;
        margin: 0 0.2rem;
        vertical-align: middle;
    }
    .recharge-icon {
        background: url("../assets/userCenter/charge@2x.png") no-repeat;
        background-size: contain;
    }
    .coupon-icon {
        background: url("../assets/userCenter/coupon@2x.png") no-repeat center;
        background-size: contain;
    }
}
</style>
