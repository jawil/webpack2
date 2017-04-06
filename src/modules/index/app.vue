<template>
    <div>
        <v-header :seller="seller"></v-header>
        <div class="tab-control border-1px">
            <div class="tab-item">
                <router-link to="/goods">商品</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/ratings">评价</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/seller">商家</router-link>
            </div>
        </div>
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view :seller="seller"></router-view>
    </div>
</template>
<script>
import header from 'components/header/header.vue'
import {
    urlParse
} from 'common/js/util.js'
const ERR_OK = 0
const appData = require('../../../data.json')
const seller = appData.seller
export default {
    data() {
            return {
                seller: {
                    id: (f => {
                        let queryParam = urlParse()
                        return queryParam.id
                    })()
                }
            }
        },
        created() {
            this.seller = Object.assign({}, this.seller, seller)
        },
        components: {
            'v-header': header
        },
        methods: {
            getSeller() {
                // Vue.prototype.$http = axios
                this.$http({
                        method: 'get',
                        url: 'api/seller',
                        params: {
                            ID: 12345
                        }
                    })
                    .then((res) => {
                        let data = res.data
                        if (data.errno === ERR_OK) {
                            this.seller = Object.assign({}, this.seller, data.data)
                        }
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            }
        }
}
</script>
<style lang="sass">
@import '../../common/stylus/mixin.scss';
.tab-control {
    width: 100%;
    display: flex;
    @include border-1px(rgba(7, 17, 27, 0.1));
    .tab-item {
        flex: 1;
        text-align: center;
        line-height: 0.8rem;
        font-size: 14px;
        &>a {
            display: block;
            color: rgb(77, 85, 93);
            &.active {
                color: rgb(240, 20, 20);
            }
        }
    }
}
</style>
