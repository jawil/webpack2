<template id="myAccount">
    <!-- 我的余额流水组件 -->
    <div class="wrap">
        <!-- hack IOS切换路由无法改变title的bug -->
        <iframe :src="iframe" style="display: none"></iframe>
        <div class="my-account-container">
            <router-link to='/wallet'>
                <div class="my-extra">
                    <span>
            <strong><i class="extra-icon"></i>  {{currentMoney/100}}元</strong>
            </span>
                    <br>
                    <span>当前余额</span>
                </div>
            </router-link>
            <div class="no-account" v-if="!walletLog.length">
                <p>您尚未有余额流水哦~</p>
            </div>
            <ul class="ul-account-container" v-if="walletLog.length">
                <li v-for="wallet in walletLog" v-if="walletLog.length">
                    <div class="my-account-list">
                        <p v-if="wallet.transType==1">
                            <!-- 注意数据库所有钱的单位都是分 -->
                            <span>充值{{wallet.payAmt/100}}元</span>
                            <em class="account-detail">
                        +{{wallet.transAmt/100}}元
                        </em>
                        </p>
                        <p v-if="wallet.transType==2">
                            <span>专车消费</span>
                            <em class="account-detail">-{{wallet.transAmt/100}}元</em>
                        </p>
                        <p>
                            <span>余额{{wallet.balanceAfterTrans/100}}元</span>
                            <em class="time">{{wallet.createTime}}</em>
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import format from '../utils/formatTime';
import wx from '../utils/config';
export default {
    name: 'myAccount',
    data: function() {
        return {
            usrId: '', //用户Id
            currentMoney: '', //当前余额
            index: 0,
            iframe: '',
            pageCount: 16, //默认一次请求8条
            newWalletLog: [], //每次请求新的数据
            walletLog: []
                /*{
                    balanceAfterTrans: '', //交易后金额
                    balanceBeforeTrans: '', //   交易前金额
                    createTime: '', //创建时间
                    usrId: '', //用户Id
                    operator: '', //操作人
                    transAmt: '', // 交易金额
                    transType: '', //交易类型
                    walletNo: '' //钱包编号
                }*/
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
        this.getMyAccountLog(0);
        this.lazyLoad();
    },
    methods: {
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
                    } else {
                        alert(data.rspDesc);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        /**
         * [getMyAccountLog 获取我的钱包消费流水]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @return  {[type]}   [description]
         */
        getMyAccountLog: function(index, callback) {
            var data = {
                usrId: this.usrId,
                pageIndex: (index || 0) * this.pageCount,
                pageCount: this.pageCount
            };
            axios({
                    method: 'post',
                    url: wx.getUrl('qrywalletlog'),
                    data: wx.stringify(data),
                    headers: wx.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        var data = data.walletLog;
                        this.newWalletLog = data;
                        //this.currentMoney = data[0].balanceAfterTrans || 0;
                        this.walletLog = Array.prototype.concat.apply([], [this.walletLog, data]);
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
        lazyLoad: function() {
            setTimeout(() => {
                var scrollWrap = document.querySelector('.my-account-container');
                scrollWrap.onscroll = () => {
                    if (scrollWrap.scrollTop + scrollWrap.offsetHeight + 50 > scrollWrap.scrollHeight) {
                        this.index++;
                        this.getMyAccountLog(this.index);
                    }
                }
            }, 100);
        },
        formatTime: function() {
            this.newWalletLog.forEach((ele, index) => { //把时间戳转化成yyyy-MM-dd hh:mm格式
                ele.createTime = format.dateFilter(ele.createTime, 3);
            });
        }
    }
}
</script>
<style scoped lang="sass">
@import "../lib/variable.scss";
.no-account {
    width: 100vw;
    height: 85vh;
    position: absolute;
    background-color: $ele-bgc!important;
    z-index: 100;
    margin-top:0.2rem;
    background: url("../assets/userCenter/yue.png") no-repeat center 3rem;
    background-size: 2rem;
    p {
        text-align: center;
        color: $explain-fc;
        font-size: $btn-fz;
        margin-top: 45vh;
    }
}

.my-account-container {
    height: 100vh;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
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
                background: url("../assets/userCenter/remaining@2x.png") no-repeat;
                background-size: contain;
                margin-left: -0.7rem;
                top: 50%;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
            }
        }
        span:nth-of-type(2) {
            font-size: 0.3rem;
            color: $explain-fc;
        }
    }
    .ul-account-container {
        margin-top: 0.2rem;
        li {
            position: relative;
            background-color: $ele-bgc;
            border-bottom: 1px solid $text-line;
        }
        li:last-child {
            border: none;
        }
        .my-account-list {
            width: 100%;
            display: inline-block;
            box-sizing: border-box;
            padding: .2rem .2rem;
            color: $main-fc;
            font-size: $main-fz;
            line-height: 0.48rem;
            em {
                float: right;
                color: $explain-fc;
            }
            .account-detail {
                color: $strong-fc;
            }
        }
    }
}
</style>
