<template id="myIcode">
    <!-- 我的邀请码组件 -->
    <div class="wrap">
        <!-- hack IOS切换路由无法改变title的bug -->
        <iframe :src="iframe" style="display: none"></iframe>
        <div class="my-icode-container">
            <div class="my-icode-msg">
                <div class="my-icode-num">
                    <div>
                        <p>{{code}}</p>
                        <p>我的邀请码</p>
                    </div>
                </div>
                <div class="my-icode-tips">
                    <p>你的好友在注册积金出行时输入此邀请码</p>
                    <p><strong>{{invitorRegDesc}}</strong></p>
                </div>
            </div>
            <div class="my-icode-share">
                <!-- 用户点击分享提示点击右上角进行分享-->
                <div id="mcover" v-on:click="guideToShare(0)" v-show="toggle">
                    <p class="tips"> <span>请点击右上角</span>
                        <br> <strong v-text="sharePlace"></strong> </p>
                </div>
                <hr> <span>分享</span>
                <hr>
                <div class="share-myfriends">
                    <div v-on:click="guideToShare(1)"><i class="share-icon wx-friends"></i>
                        <br>微信好友 </div>
                    <div v-on:click="guideToShare(2)"><i class="share-icon wx-friends-circle"></i>
                        <br>朋友圈 </div>
                    <div v-on:click="guideToShare(3)"><i class="share-icon wx-friends-QQ"></i>
                        <br>QQ好友 </div>
                    <div v-on:click="shareToSina"><i class="share-icon sina"></i>
                        <br>新浪微博 </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import wxData from '../utils/config';
export default {
    name: 'myIcode',
    data() {
        return {
            usrId: '',
            code: '',
            iframe: '',
            invitorRegDesc: '',
            title: "积金出行邀请码分享!",
            content: '您的积金出行专享邀请码ASDF5,关注积金出行微信公众号并注册,你和你的朋友都将会获得一张10元抵扣券',
            toggle: false,
            sharePlace: ''
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
        })();

        this.changUrl();

        setTimeout(() => {
            this.shareToWeChat();
        }, 0);

        this.getMyInfo();
        this.getInvitorRegDesc();
    },
    methods: {
        /**
         *'http://wx.jijincar.com/dist/index.html?code=0318S3P215EEwM100dN218kQO218S3Pc#/icode'
         *(上面这种格式的url路由hash在后面jssdk权限会失效)
         *转化成
         *'http://wx.jijincar.com/dist/index.html#/icode?code=0318S3P215EEwM100dN218kQO218S3Pc'
         *(url重组hash紧跟url后面可以避免jssdk权限实效问题)
         **/
        changUrl: function() {
            var protocol = window.location.protocol;
            var host = window.location.host;
            var pathname = window.location.pathname;
            var hash = window.location.hash;
            var search = window.location.search;
            var href = protocol + '//' + host + pathname + hash + search;
            console.log(href);
            localStorage.setItem('href', href);
            if (window.location.href !== localStorage.getItem('href')) {
                console.log(href);
                //console.log( window.location.href);
                window.location.href = href;
            }
        },
        getInvitorRegDesc: function() {
            let data = {
                groupNo: 'invitor_reg_desc',
            }
            axios({
                    method: 'post',
                    url: wxData.getUrl('getdatadict'),
                    data: wxData.stringify(data),
                    headers: wxData.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        this.invitorRegDesc = data.data[0].value;
                    }
                })
                .catch((err) => {
                    console.error(err);
                })
        },
        getMyInfo: function(callback) {
            var data = {
                usrId: this.usrId
            };
            axios({
                    method: 'post',
                    url: wxData.getUrl('getinfo'),
                    data: wxData.stringify(data),
                    headers: wxData.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        var data = data.usr;
                        this.code = data.icode;
                        callback && callback();

                    } else if (data.rspCode == "101") {
                        localStorage.removeItem('userData');
                        window.location.href = wxData.jumpLogin;
                    } else {
                        alert(data.rspDesc);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        /**
         * [guideToShare 指引用户点击右上角进行分享]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @param   {[number]}   type [0:隐藏遮罩 1:微信 2:朋友圈 3:QQ好友]
         * @return  {[type]}        [description]
         */
        guideToShare: function(type) {
            switch (type) {
                case 0:
                    this.toggle = false;
                    break;
                case 1:
                    this.toggle = true;
                    this.sharePlace = '"分享到微信好友"';
                    break;
                case 2:
                    this.toggle = true;
                    this.sharePlace = '"分享到朋友圈"';
                    break;
                case 3:
                    this.toggle = true;
                    this.sharePlace = '"分享到QQ好友"';
                    break;
            }
        },
        /**
         * [shareToSina 分享到新浪微博]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @return  {[type]}   [description]
         */
        shareToSina: function() {
            var id = this.usrId;
            var self = this,
                title = '积金出行邀请码分享',
                content = '关注"积金出行"微信公众号并填入邀请码注册' + this.code + '即可获得10元抵扣券!',
                t = content + '→来自页面"' + title + '"的文字片段',
                url = decodeURI('http://wx.jijincar.com/wxmp/'),
                pic = 'http://qiniu.jijincar.com/zhuancheLogo.png',
                appkey = '积金出行公众号',
                site = '',
                u = 'http://v.t.sina.com.cn/share/share.php' + '?url=' + url + '&appkey=' + appkey + '&site=' + site + '&pic=' + pic + '&title=' + t;
            window.open(u);
        },
        /**
         * [shareToWeChat 调用微信JSSDK实现分享到微信好友,微信朋友圈,QQ好友的功能]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @return  {[type]}   [description]
         */
        shareToWeChat: function() {
            var id = this.usrId;
            var shareContent = {
                title: '积金出行邀请码',
                link: 'http://wx.jijincar.com/wxmp/center.html#/share?from=' + id,
                imgUrl: 'http://qiniu.jijincar.com/zhuancheLogo.png',
                trigger: function(res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，
                    // 因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    console.log('用户点击分享到朋友圈');
                },
                success: function(res) {
                    //alert('已分享');
                },
                cancel: function(res) {
                    //alert('已取消分享');
                },
                fail: function(res) {
                    alert(JSON.stringify(res));
                }
            };
            wx.ready(function() {
                wx.onMenuShareTimeline(shareContent); //分享到朋友圈
                wx.onMenuShareAppMessage(shareContent); //分享到微信好友
                wx.onMenuShareQQ(shareContent); //分享到QQ好友
            });
        }
    }
}
</script>
<style scoped lang="sass">
@import "../lib/variable.scss";
.my-icode-container {
    height: 100vh;
    .my-icode-msg {
        height: 65%;
        background-color: $ele-bgc;
        text-align: center;
        .my-icode-num {
            height: 50%;
            position: relative;
            div {
                position: absolute;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                font-size: 0.55rem;
                color: $main-fc;
                p:first-child {
                    width: 2.6rem;
                    height: 2.05rem;
                    text-align: center;
                    box-sizing: border-box;
                    padding-top: 0.2rem;
                    background: url('../assets/userCenter/code@2x.png') no-repeat;
                    background-size: cover;
                }
                p:nth-of-type(2) {
                    position: absolute;
                    left: 50%;
                    -webkit-transform: translateX(-50%);
                    transform: translateX(-50%);
                    margin-top: 0.2rem;
                    width: 5em;
                    font-size: 0.36rem;
                    color: $explain-fc;
                }
            }
        }
        .my-icode-tips {
            width: 90%;
            height: 33%;
            margin: 0 auto;
            border: 1px solid $money-fc;
            margin-top: 0.5rem;
            p:first-child {
                padding: 7% 0;
                font-size: $sub-fz;
            }
            p:last-child {
                font-size: $main-fz;
            }
        }
    }
    .my-icode-share {
        height: 35%;
        text-align: center;
        padding-top: 0.2rem;
        color: $main-fc;
        @-webkit-keyframes move {
            0% {
                background-position: 5.1rem 0.2rem;
            }
            50% {
                background-position: 5.1rem 0rem;
            }
            100% {
                background-position: 5.1rem 0.4rem;
            }
        }
        @keyframes move {
            0% {
                background-position: 5.1rem 0.2rem;
            }
            50% {
                background-position: 5.1rem 0rem;
            }
            100% {
                background-position: 5.1rem 0.4rem;
            }
        }
        /* 分享到朋友圈的遮罩 */
        #mcover {
            position: absolute;
            top: -65vh;
            left: 0;
            width: 100vw;
            height: 105vh;
            background: url('../assets/userCenter/jiantou.png') rgba(0, 0, 0, 0.7) no-repeat 5.1rem 0.2rem;
            background-size: 2rem 3rem;
            -webkit-animation: .5s move infinite alternate linear;
            animation: .5s move infinite alternate linear;
            z-index: 9999;
            .tips {
                width: 6.5rem;
                height: 3rem;
                margin: 3.3rem auto;
                text-align: center;
                line-height: 1rem;
                background-color: $ele-bgc;
                border-radius: 3.4rem/1.5rem;
                span {
                    color: $strong-fc;
                    font-size: $money-fz;
                }
                strong {
                    color: $main-fc;
                    font-size: 0.7rem;
                }
            }
        }
        hr {
            display: inline-block;
            width: 30%;
            vertical-align: middle;
        }
        span {
            vertical-align: middle;
            padding: 0 10%;
            color: $explain-fc;
            font-size: $money-fz;
        }
        .share-myfriends {
            display: -webkit-box;
            margin-top: 10%;
            .wx-friends {
                background: url("../assets/userCenter/weixin@2x.png") no-repeat;
                background-size: contain;
            }
            .wx-friends-circle {
                background: url("../assets/userCenter/friend@2x.png") no-repeat;
                background-size: contain;
            }
            .wx-friends-QQ {
                background: url("../assets/userCenter/QQ.png") no-repeat;
                background-size: contain;
            }
            .sina {
                background: url("../assets/userCenter/sina@2x.png") no-repeat;
                background-size: contain;
            }
            div {
                -webkit-box-flex: 1;
                font-size: $tips-fz;
                .share-icon {
                    width: 0.8rem;
                    height: 0.8rem;
                    display: inline-block;
                    margin-bottom: 0.3rem;
                }
            }
        }
    }
}
</style>
