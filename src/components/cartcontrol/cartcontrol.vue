<template>
    <div class="cart-control" @click.stop.prevent="">
        <transition name="slide-fade">
            <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)"></div>
        </transition>
        <div class="cart-count" v-show="food.count>0">
            {{food.count}}
        </div>
        <div class="cart-add" @click.stop.prevent="addCart($event)"></div>
    </div>
</template>
<script>
export default {
    props: {
        food: {
            type: Object,
            default () {
                return {}
            }
        }
    },

    created() {},

    methods: {
        addCart(ev) {
            if (!ev._constructed) {
                return
            }
            if (!this.food.count) {
                this.$set(this.food, 'count', 1)
            } else {
                this.food.count++
            }
            this.$emit('message', ev.target)
        },

        decreaseCart(ev) {
            if (!ev._constructed) {
                return
            }
            this.food.count--
        }

    }

}
</script>
<style lang="sass">
.cart-control {
    font-size: 0;
    div {
        display: inline-block;
        width: 0.48rem;
        height: 0.48rem;
        vertical-align: middle;
        border-radius: 50%;
    }
    .cart-decrease {
        background: url('./icon/decrease.png') no-repeat;
        background-size: contain;
        padding: 0.06rem;
    }
    .cart-count {
        font-size: 12px;
        color: rgb(147, 153, 159);
        width: 0.3rem;
        line-height: 0.55rem;
        text-align: center;
    }
    .cart-add {
        background: url('./icon/add.png') no-repeat;
        background-size: contain;
        padding: 0.06rem;
    }
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter {
        transform: translateX(0.78rem) rotate(180deg);
        opacity: 0;
    }
    .slide-fade-leave-active {
        transform: translateX(0.42rem) rotate(180deg);
        opacity: 0;
    }
}
</style>
