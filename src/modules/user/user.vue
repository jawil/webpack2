<template id="userCenter">
    <router-view></router-view>
</template>
<script>
import wxData from '../../utils/config';
export default {
    data: function() {
        return {
            getSignUrl: wxData.getSignUrl,
            jumpLogin:wxData.jumpLogin
        }
    },
    created: function() {
        // document.location.reload();
        this.getJSSDKsign();

        var isLogin = (() => {
            var hash = window.location.hash;
            var userData = localStorage.getItem('userData');
            if (!userData&&!hash.match('#/share')) {
                function getParamName(name) {
                    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
                    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
                };
                var code = getParamName('code');
                var hashData = '';
                switch (hash) {
                    case '#/trip':
                        hashData = 'trip';
                        break;
                    case '#/wallet':
                        hashData = 'wallet';
                        break;
                    case '#/info':
                        hashData = 'info';
                        break;
                    case '#/icode':
                        hashData = 'icode';
                        break;
                }
                if (localStorage.getItem('logout')) {
                    window.location.href = this.jumpLogin;
                    localStorage.removeItem('logout');
                } else {
                    localStorage.setItem('from',hashData);
                    window.location.href = this.jumpLogin;
                }
            }
        })();
    },
    methods: {
        /**
         * [getJSSDKsign 获取微信支付,分享朋友圈JSSDK的config签名]
         * This is a garbage function,Do you agree with me?
         * @Author jawil
         * @date   2016-12-10
         * @return {[type]}   [description]
         */
        getJSSDKsign: function() {
            var data = {
                url: this.getSignUrl
            };
            axios({
                method: 'post',
                url: wxData.getUrl('getwxconfig'),
                data: wxData.stringify(data),
                headers: wxData.getHeaders(data)
            }).then((res) => {
                var data = res.data;
                if (data.rspCode == "00") {
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline', //分享到朋友圈
                            'onMenuShareAppMessage', //分享到我的微信好友
                            'onMenuShareQQ', //分享到我的QQ好友
                            'chooseWXPay' //支付
                        ]
                    });
                }
                else {
                    alert(data.rspDesc);
                }
            }).catch((err) => {
                console.error(err);
            });
        }
    }

}
</script>
<style lang="sass">
@import "../../lib/reset.scss";
</style>
