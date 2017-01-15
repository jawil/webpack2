<template id="myInfo">
    <!-- 个人信息组件 -->
    <div class="wrap">
        <div class="my-Info-container">
            <div class="my-info-detail">
                <p><span class="user-img"><img :src='imgsrc' alt=""></span></p>
                <p class="user-name">{{usrData.name}}</p>
                <p class="tel">{{usrData.mobile}}</p>
            </div>
            <button class="logout" v-on:click="logout">退出登录</button>
        </div>
    </div>
</template>
<script>
import wx from '../utils/config';
export default {
    name: 'myInfo',
    data: function() {
        return {
            usrId: '',
            openid: '',
            usrData: {},
            imgsrc: ''
        }
    },
    created: function() {
        var getMyId = (() => {
            var userdata = JSON.parse(localStorage.getItem('userData'));
            this.openid = userdata.openId;
            this.usrId = userdata.usrId;
        })();
        this.getMyInfo();
    },
    methods: {
        /**
         * [getMyInfo 获取我的个人信息]
         * This is a garbage function,Do you agree with me?
         * @Author  jawil
         * @date    2016-12-09
         * @return  {[type]}   [description]
         */
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
                        //没有图像则使用默认图像
                        this.imgsrc = data.imgUsr || 'http://qiniu.jijincar.com/headImg.png';
                        this.usrData = data;
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
        getOS: function() {
            //获取用户代理
            var ua = navigator.userAgent;
            if (ua.indexOf("Windows NT 5.1") != -1) return "Windows XP";
            if (ua.indexOf("Windows NT 6.0") != -1) return "Windows Vista";
            if (ua.indexOf("Windows NT 6.1") != -1) return "Windows 7";
            if (ua.indexOf("iPhone") != -1) return "iPhone";
            if (ua.indexOf("iPad") != -1) return "iPad";
            if (ua.indexOf("Linux") != -1) {
                var index = ua.indexOf("Android");
                if (index != -1) {
                    //os以及版本
                    var os = ua.slice(index, index + 13);
                    //手机型号
                    var index2 = ua.indexOf("Build");
                    var type = ua.slice(index1 + 1, index2);
                    return type + os;
                } else {
                    return "Linux";
                }
            }

            return "未知操作系统";
        },
        logout: function() {
            var data = {
                usrId: this.usrId,
                devId: '',
                devInfo: '',
                devType: 3,
                devToken: this.openid
            }
            axios({
                    method: 'post',
                    url: wx.getUrl('logout'),
                    data: wx.stringify(data),
                    headers: wx.getHeaders(data)
                })
                .then((res) => {
                    var data = res.data;
                    if (data.rspCode == "00") {
                        localStorage.removeItem('userData');
                        localStorage.setItem('logout', 'true');
                        window.location.href = wx.jumpLogin;
                    } else {
                        localStorage.removeItem('userData');
                        localStorage.setItem('logout', 'true');
                        window.location.reload();

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
.my-Info-container {
    height: 100vh;
    overflow: hidden;
    position: relative;
    background: url("../assets/userCenter/info-bg@2x.png") no-repeat;
    background-size: 7.2rem 3.05rem;
    .my-info-detail {
        text-align: center;
        font-size: $money-fz;
        margin-top: 3.05rem;
        p:nth-of-type(1) {
            margin-top: -0.4rem;
            span.user-img {
                display: inline-block;
                width: 1.5rem;
                height: 1.5rem;
                box-shadow: 0 0 0 .15rem $body-bgc;
                border-radius: 50%;
                position: relative;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: none;
                }
            }
        }
        p:nth-of-type(2) {
            margin-top: .3rem;
            margin-bottom: .6rem;
        }
        p:nth-of-type(3) {
            font-size: 1.5em;
            color: $money-fc;
        }
    }
    .logout {
        position: absolute;
        bottom: 10%;
        left: 50%;
        width: 4rem;
        height: .8rem;
        font-size: $btn-fz;
        border: 0.02rem solid $money-fc;
        background-color: $body-bgc;
        color: $main-fc;
        outline: none;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
    }
}
</style>
