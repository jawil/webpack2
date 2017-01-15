<template id="myShare">
    <!-- 分享后打开的页面组件 -->
    <div class="my-share-container">
        <div class="share-title">
            <p>Hi,我是{{name}}</p>
            <p>关注积金出行,注册输入我的邀请码</p>
        </div>
        <div class="my-icode-msg">
            <div class="code-detail">
                <p>{{code}}</p>
                <p>我的邀请码</p>
            </div>
        </div>
        <div class="my-icode-tips">
            <div> <i class="my-code-num">10元</i> <strong>可以获得一张10元抵扣券</strong> </div>
        </div>
        <div class="QR-code"> <i class="QR-code-icon">
        <img src="http://qiniu.jijincar.com/jijincarCode.jpg">
        </i>
            <p>长按或保存扫描关注微信公众号&nbsp;"积金出行"</p>
        </div>
    </div>
</template>
<script>
import wx from '../utils/config';
export default {
    name: 'myShare',
    data() {
        return {
            usrId: '',
            name: '',
            code: ''
        }
    },
    created: function() {
        this.usrId = this.getUsrId();
        this.getMyInfo();
    },
    methods: {
        getUsrId: function() {
            function getParamName(name) { //正则表达式实现
                var match = RegExp('[?&]' + name + '=([^&]*)')
                    .exec(window.location.hash);
                return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
            };
            return getParamName('from');
        },
        getMyInfo: function(callback) {
            var data = {
                usrId: this.usrId
            };
            axios({
                    method: 'post',
                    url: wx.getUrl('getinfo'),
                    data: wx.stringify(data),
                    headers: wx.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        var data = data.usr;
                        this.code = data.icode;
                        this.name = data.name;
                        callback && callback();

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
.my-share-container {
    height: 100vh;
    overflow: hidden;
    font-size: $main-fz;
    color: $second-fc;
    div {
        background-color: $ele-bgc;
    }
    .share-title {
        line-height: 0.5rem;
        text-align: center;
        padding: 0.3rem 0;
    }
    .my-icode-msg {
        height: 30%;
        position: relative;
        .code-detail {
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
                box-sizing: border-box;
                padding-top: 0.2rem;
                text-align: center;
                background: url('../assets/userCenter/code@2x.png') no-repeat;
                background-size: contain;
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
        text-align: center;
        padding: 0.3rem 0;
        div {
            border: 0.02rem solid $money-fc;
            display: inline-block;
            padding: 0.18rem 0.5rem;
            i {
                display: inline-block;
                width: 1.65rem;
                height: 0.85rem;
                line-height: 0.85rem;
                white-space: nowrap;
                font-size: $money-fz;
                color: $strong-fc;
                font-weight: bold;
                text-indent: 0.2rem;
                background: url('../assets/userCenter/quan@2x.png') no-repeat;
                background-size: contain;
            }
            strong {
                font-size: $sub-fz;
                color: $main-fc;
            }
        }
    }
    .QR-code {
        text-align: center;
        font-size: 0;
        background-color: $body-bgc;
        padding-top: 0.4rem;
        i {
            display: inline-block;
            width: 2.2rem;
            height: 2.2rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
        p {
            margin-top: 0.3rem;
            font-size: $tips-fz;
            color: $explain-fc;
        }
    }
}
</style>
