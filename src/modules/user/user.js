import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './user.vue';
import myIcode from '../../components/myIcode.vue';
import myAccount from '../../components/myAccount.vue';
import myShare from '../../components/myShare.vue';
import myCharge from '../../components/myCharge.vue';
import myCoupon from '../../components/myCoupon.vue';
import myInfo from '../../components/myInfo.vue';
import myTrip from '../../components/myTrip.vue';
import myTripend from '../../components/myTripend.vue';
import myWallet from '../../components/myWallet.vue';
Vue.use(VueRouter);
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title;
  }
});

var routes = [{
    path: '/icode',
    component: myIcode,
    meta: {
        title: '我的邀请码'
    }
}, {
    path: '/account',
    component: myAccount,
    meta: {
        title: '余额流水'
    }
}, {
    path: '/share',
    component: myShare,
    meta: {
        title: '输入邀请码注册积金出行得抵扣券'
    }
}, {
    path: '/charge',
    component: myCharge,
    meta: {
        title: '充值'
    }
}, {
    path: '/coupon',
    component: myCoupon,
    meta: {
        title: '我的优惠券'
    }
}, {
    path: '/info',
    component: myInfo,
    meta: {
        title: '个人信息'
    }
}, {
    name: 'trip',
    path: '/trip',
    component: myTrip,
    meta: {
        title: '我的行程'
    }
}, {
    path: '/tripend',
    component: myTripend,
    meta: {
        title: '行程结束'
    }
}, {
    path: '/wallet',
    component: myWallet,
    meta: {
        title: '我的钱包'
    }
}];
var router = new VueRouter({
    //mode: 'history',
    // base: __dirname,
    routes
});
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});

var vm = new Vue({
    el: "#main",
    render: x => x(App),
    router
})

