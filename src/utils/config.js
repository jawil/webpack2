import querystring from 'querystring';
import MD5 from './md5.js';
module.exports = {
    jssort: function(postData){
        var arr = [];
        for (var attr in postData) {
            arr.push(attr);
        }
        arr.sort();
        var obj = {};
        arr.forEach(function(ele, index) {
            obj[ele] = postData[ele];
        });
        return obj;
    },
    getHeaders: function(postData){
        var token = '';
        if (localStorage.getItem('userData')) {
            var userdata = JSON.parse(localStorage.getItem('userData'));
            var token = userdata.token || '';
        }
        var version = '1.0';
        var getSign = function(data){
            var MD5_Key = '07500o0wQt19000000l30U0P0XvgH093Y0XaA050620zZ50r0h7O1094qD0x';
            var data = this.jssort(data);
            var data = querystring.stringify(data);
            var str = data + version + MD5_Key;
            var str = decodeURIComponent(str);
            var singV = MD5(str);
            return singV;
        }.bind(this);
        var sign = getSign(postData);
        return {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Jijin-Vern': version,
            'Jijin-Token': token,
            'Jijin-Sign': sign
        }
    },
    getUrl(api) {
        const APINAME = this.api[api];
        if (!APINAME) {
            console.error(`${api}error，config.js中查看是否配置正确`);
            return;
        }
        let host = window.location.host;
        host = this.host.test(host) ? this.pro : this.dev;
        return `${host}${APINAME}`;
    },
    api: {
        //获取系统配置
        getdatadict: '/usr/passenger/getdatadict',
        //充值钱包
        paywallet: '/usr/passenger/paywallet',
        //微信支付JSSDK config 签名
        getwxconfig: '/usr/passenger/getwxconfig',
        //获取钱包信息
        qrywallet: '/usr/passenger/qrywallet',
        //获取钱包流水
        qrywalletlog: '/usr/passenger/qrywalletlog',
        //获取可用优惠劵
        listcoupon: '/usr/passenger/listcoupon',
        //个人行程
        listorder: '/usr/passenger/listorder',
        //获取用户基本信息
        getinfo: '/usr/passenger/getinfo',
        //订单评价
        cmtorder: '/usr/passenger/cmtorder',
        //充值钱包回调
        walletpayback: '/usr/passenger/walletpayback',
        //支付宝同步回调验证
        aliverify: '/usr/passenger/aliverify',
        //订单详情
        qryorder: '/usr/passenger/qryorder',
        //获取订单费用
        orderfee: '/usr/passenger/orderfee',
        //获取订单可用优惠券
        listcoupon4order: '/usr/passenger/listcoupon4order',
        //支付订单
        payorder: '/usr/passenger/payorder',
        //支付结果回调
        payback: '/usr/passenger/payback',
        //订单评价
        cmtorder: '/usr/passenger/cmtorder',
        //退出
        logout: '/usr/passenger/logout',
        // 获取验证码
        getvcode: '/usr/passenger/getvcode',
        // 登录
        login: '/usr/passenger/login',
        // 注册
        wxreg: '/usr/passenger/wxreg',
        // 获取用户基本数据数据
        getinfo: '/usr/passenger/getinfo',
        // 城市服务是否开通
        pingservice: '/usr/passenger/pingservice',
        // 现在用车
        puborder: '/usr/passenger/puborder',
        // 取消用车
        cancelorder: '/usr/passenger/cancelorder',
        // 获取订单详情
        qryorder: '/usr/passenger/qryorder',
        // 获取司机坐标
        getdriverloc: '/geo/passenger/getdriverloc',
        // 预估费用
        planfee: '/usr/passenger/planfee',
        // 用户的实时计费
        curfee: '/usr/passenger/curfee',
        // 获取活动列表
        listactivity: '/usr/passenger/listactivity',
        // 获取订单状态
        latest: '/usr/passenger/latest',
        // 乘客 获取系统配置
        getdatadict: '/comm/getdatadict',
        // 获取家或者公司常用地址
        qryusraddr: '/usr/passenger/qryusraddr',
        // 设置家或者公司常用地址
        setaddr: '/usr/passenger/setaddr'
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    //测试站jssdk验签的页面
    getSignUrl: 'http://wx.jijincar.com/wxmp/center.html',
    //测试站未登录跳转的页面
    jumpUrl: 'http://wx.jijincar.com/wxmp?code=',
    //未登录跳转的页面
    jumpLogin:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0fff01f8cfa13612&redirect_uri=http%3a%2f%2fwx.jijincar.com%2fwxmp&response_type=code&scope=snsapi_userinfo&state=STATE',
    // 测试环境
    dev: 'http://test.jijincar.com:8018',
    // 生产环境
    pro: 'http://api.jijincar.com:8018',
    // 配置线上环境域名
    host: /wx\.jijincar\.com/,
    // 根据post请求的数据类型需要进行数据转化,axios请求的数据data需要stringify转化from格式
    stringify(data) {
        var data = this.jssort(data);
        var data = querystring.stringify(data);
        var data = decodeURIComponent(data);
        return data;
    },
    qiniu: 'http://qiniu.jijincar.com/',
}
