<template id="myTrip">
    <!-- 我的行程组件 -->
    <div class="wrap">
        <!-- hack IOS切换路由无法改变title的bug -->
        <iframe :src="iframe" style="display: none"></iframe>
        <div class="no-trip" v-if="!order.length">
            <p>您尚未有行程哦,赶快开启您的行程吧~</p>
        </div>
        <!-- 订单状态
            1-发单 2-取消订单 3-接单后取消订单 4-已接单 5-开始行程,进行中
            6-结束行程,等待支付 7-支付成功 8-支付失败 9-已评价
        -->
        <ul class="my-trip-container">
            <li v-for="trip in order">
                <a :href="trip.jumpUrl">
                    <div class="my-trip-list">
                        <p class="addr-time-wrap">
                            <i class="time">{{trip.createTime}}</i>
                            <template v-if="trip.orderStatus==3||trip.orderStatus==8||trip.orderStatus==9">
                                <span class="gray-status">
                                {{['','发单','取消订单','已取消','已接单','进行中','待支付','待评价','支付失败','已评价'][trip.orderStatus]}}
                                </span>
                            </template>
                            <span class="warn-status" v-if="trip.orderStatus==99">
                               订单异常
                                </span>
                            <template v-if="trip.orderStatus!=3&&trip.orderStatus!=8&&trip.orderStatus!=9
                            &&trip.orderStatus!=99">
                                <span class="status">
                                {{['','发单','取消订单','已取消','已接单','行程进行中','等待支付','待评价','支付失败','已评价'][trip.orderStatus]}}
                                </span>
                            </template>
                        </p>
                        <p class="departure-wrap">
                            <i class="addr-icon"></i><span class="departure">{{trip.startAddr}}</span>
                        </p>
                        <p class="destination-wrap">
                            <i class="addr-icon"></i><span class="destination">{{trip.endAddr}}</span>
                        </p>
                    </div>
                    <i class="detail-more"></i>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
import wx from '../utils/config';
import format from '../utils/formatTime';
export default {
    name: 'myTrip',
    data() {
        return {
            usrId: '', //用户Id
            code: '',
            iframe: '',
            newOrder: [], //每次请求新的数据
            order: [],
            index: 0,
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
        this.code = this.getMyCode();
        this.getMyOrder(0);
        this.lazyLoad();
    },
    methods: {
        getMyCode: function() {
            function getParamName(name) { //正则表达式实现
                var match = RegExp('[?&]' + name + '=([^&]*)')
                    .exec(window.location.search);
                return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
            };
            return getParamName('code');
        },
        /**
         * [getMyOrder 用户获取我的行程]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @param   {[number]}   index [分页请求的页数,每次滚动条到底部index加1,然后发起一次ajax异步请求]
         * @return  {[type]}         [description]
         */
        getMyOrder: function(index, callback) {
            var data = {
                usrId: this.usrId,
                pageIndex: (index || 0) * this.pageCount,
                pageCount: this.pageCount
            };
            axios({
                    method: 'post',
                    url: wx.getUrl('listorder'),
                    data: wx.stringify(data),
                    headers: wx.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        var data = data.order;
                        console.table(data);
                        data.forEach((ele, index) => {
                            switch (Number(ele.orderStatus)) {
                                case 1:
                                    ele.jumpUrl = './callcart.html';
                                    break;
                                case 3:
                                    ele.jumpUrl = '#/tripend?orderNo=' + ele.orderNo;
                                    break;
                                case 4:
                                    ele.jumpUrl = './waitdriver.html';
                                    break;
                                case 5:
                                    ele.jumpUrl = './waitdriver.html';
                                    break;
                                case 6:
                                    ele.jumpUrl = '#/tripend?orderNo=' + ele.orderNo;
                                    break;
                                case 7:
                                    ele.jumpUrl = '#/tripend?orderNo=' + ele.orderNo;
                                    break;
                                case 8:
                                    ele.jumpUrl = '#/tripend?orderNo=' + ele.orderNo;
                                    break;
                                case 9:
                                    ele.jumpUrl = '#/tripend?orderNo=' + ele.orderNo;
                                    break;
                                case 99:
                                    ele.jumpUrl = '#/tripend?orderNo=' + ele.orderNo;
                                    break;
                                default:
                                    ele.jumpUrl = 'javascript:;';
                                    break;
                            }
                        });
                        this.newOrder = data;
                        //合并两个数组
                        this.order = Array.prototype.concat.apply([], [this.order, data]);
                        this.formatTime();
                        callback && callback();
                    } else if (data.rspCode == "101") {
                        localStorage.removeItem('userData');
                        window.location.href=wx.jumpLogin;
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
                var scrollWrap = document.querySelector('.my-trip-container');
                scrollWrap.onscroll = () => {
                    if (scrollWrap.scrollTop + scrollWrap.offsetHeight + 50 > scrollWrap.scrollHeight) {
                        this.index++;
                        this.getMyOrder(this.index);
                    }
                }
            }, 100);
        },
        formatTime: function() {
            this.newOrder.forEach((ele, index) => { //把时间戳转化成yyyy-MM-dd hh-mm格式
                ele.createTime = format.dateFilter(ele.createTime, 3);
            });
        }
    }
}
</script>
<style scoped lang="sass">
@import "../lib/variable.scss";
.no-trip {
    width: 100vw;
    height: 100vh;
    position: absolute;
    background-color: $body-bgc;
    z-index: 100;
    background: url("../assets/userCenter/no-trip@2x.png") no-repeat center 3rem;
    background-size: 2rem 2rem;
    p {
        text-align: center;
        color: $explain-fc;
        font-size: $btn-fz;
        margin-top: 50vh;
    }
}

.my-trip-container {
    height: 100vh;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background-color: $body-bgc;
    li {
        position: relative;
        margin-bottom: 0.16rem;
        background-color: $ele-bgc;
    }
    .my-trip-list {
        width: 100%;
        display: inline-block;
        box-sizing: border-box;
        color: $main-fc;
        font-size: $main-fz;
        line-height: 0.48rem;
        p {
            padding: 0 0.2rem;
        }
        .addr-time-wrap {
            position: relative;
            line-height: 0.8rem;
            border-bottom: 1px solid $text-line;
            .status,
            .gray-status,
            .warn-status {
                color: $money-fc;
                position: absolute;
                right: 5%;
            }
            .gray-status {
                color: gray;
            }
            .warn-status {
                color: red;
            }
            .time {
                color: $explain-fc;
            }
        }
        i.addr-icon {
            width: .3rem;
            height: .4rem;
            display: inline-block;
            margin-right: 0.2rem;
            vertical-align: middle;
        }
        .departure-wrap,
        .destination-wrap {
            margin: 0.2rem 0;
        }
        .departure-wrap .addr-icon {
            background: url("../assets/userCenter/addr-start@2x.png") no-repeat;
            background-size: contain;
        }
        .destination-wrap .addr-icon {
            background: url("../assets/userCenter/addr-end@2x.png") no-repeat;
            background-size: contain;
        }
        .departure,
        .destination {
            vertical-align: middle;
            display: inline-block;
            max-width: 80%;
        }
    }
    i.detail-more {
        display: inline-block;
        height: .6rem;
        width: .3rem;
        position: absolute;
        right: 5%;
        top: 70%;
        -webkit-transform: translateY(-50%);
        background: url("../assets/userCenter/right-arrow@2x.png") no-repeat;
        background-size: contain;
    }
}
</style>
