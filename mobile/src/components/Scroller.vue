<template lang="ejs">
    <div class="scroll-wrapper" ref="wrapper">
        <div class="list-animate">
            <slot>
                <ul class="scroll-wrap">
                    <li>这里放置列表内容</li>
				</ul>
			</slot>
		</div>
        <div class="loading-wrapper loading-top" v-if="pulldown" v-show="loaddingDown">
            <div class="uil-default-css" v-show="!noMore">
                <% for (var i = 0; i < 12; i++) { %>
                <span class="loading-item" style="-webkit-transform: rotate(<%= 30*i %>deg) translate(0,-60px); transform:rotate(<%= 30*i %>deg) translate(0,-60px);"></span>
                <% } %>
            </div>
            <div class="no-more" v-show="noMore"><span>没有更多数据啦...</span></div>
        </div>
        <div class="loading-wrapper loading-bottom" v-if="pullup" v-show="loaddingUp">
            <div class="uil-default-css" v-show="!noMore">
                <% for (var i = 0; i < 12; i++) { %>
                <span class="loading-item" style="-webkit-transform:rotate(<%= 30*i %>deg) translate(0,-60px); transform:rotate(<%= 30*i %>deg) translate(0,-60px);"></span>
                <% } %>
            </div>
            <div class="no-more" v-show="noMore"><span>没有更多数据啦...</span></div>
        </div>
        <div class="loading-more" v-if="loadMore" :class="{'show': loadingMore}" v-show="!emptyShow" ref="load">
            <div class="uil-default-css" v-show="!noMore">
                <% for (var i = 0; i < 12; i++) { %>
                <span class="loading-item" style="-webkit-transform:rotate(<%= 30*i %>deg) translate(0,-60px); transform:rotate(<%= 30*i %>deg) translate(0,-60px);"></span>
                <% } %>
            </div>
            <div class="no-more" v-show="noMore"><span>没有更多数据啦...</span></div>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
    props: {
        /**
         * 1 会截流,只有在滚动结束的时候派发一个 scroll 事件
         * 2在手指 move 的时候也会实时派发 scroll 事件，不会截流
         * 3除了手指 move 的时候派发scroll事件，在 swipe（手指迅速滑动一小段距离）的情况下，列表会有一个长距离的滚动动画，这个滚动的动画过程中也会实时派发滚动事件
         */
        probeType: {
            type: Number,
            default: 1
        },
        /**
         * 点击列表是否派发click事件
         */
        click: {
            type: Boolean,
            default: true
        },
        /**
         * 是否开启横向滚动
         */
        scrollX: {
            type: Boolean,
            default: false
        },
        /**
         * 是否派发滚动事件
         */
        listenScroll: {
            type: Boolean,
            default: false
        },
        /**
         * 列表的数据
         */
        data: {
            type: Array,
            default: null
        },
        /**
         * 是否派发滚动到底部的事件，用于上拉加载
         */
        pullup: {
            type: Boolean,
            default: false
        },
        /**
         * 是否派发顶部下拉的事件，用于下拉刷新
         */
        pulldown: {
            type: Boolean,
            default: false
        },
        /*
         * 自动加载更多
         * */
        loadMore: {
            type: Boolean,
            default: true
        },
        /**
         * 是否派发列表滚动开始的事件
         */
        beforeScroll: {
            type: Boolean,
            default: false
        },
        /**
         * 当数据更新后，刷新scroll的延时。
         */
        refreshDelay: {
            type: Number,
            default: 20
        },
        /*
         *  回弹时间
         * */
        bounceTime: {
            type: Number,
            default: 700
        },
        /*
         * 放置列表内容的容器
         * */
        listClass: {
            type: String,
            default: '.scroll-wrap'
        },
        /*
         * 是否开启滚动条
         * */
        scrollbar: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        // 保证在DOM渲染完毕后初始化better-scroll
        setTimeout(() => {
            this._initScroll()
        }, 20)
    },
    data() {
        return {
            loaddingUp: false, // 上拉loading
            loaddingDown: false, // 下拉loading
            loadingMore: false, // 翻动loading
            noMore: false, // 没有更多数据提示
            emptyShow: false, // 不足翻页时隐藏loading
            isLoding: false, // 接口请求中
        }
    },
    methods: {
        _initScroll() {
            if (!this.$refs.wrapper) {
                return
            }
            this.content = this.$refs.wrapper.querySelector(this.listClass)
            this.$refs.load && this.content.parentNode.appendChild(this.$refs.load)
            // better-scroll的初始化
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click,
                scrollX: this.scrollX,
                bounceTime: this.bounceTime,
                scrollbar: this.scrollbar
            })
            // 是否派发滚动事件
            if (true) {
                this.scroll.on('scroll', (pos) => {
                    this.$emit('scroll', pos)
                })
            }

            // 滚动加载方式
            if (this.loadMore) {
                this.scroll.on('scrollEnd', () => {
                    // 滚动到底部
                    if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                        this.$emit('scrollToEnd')
                        !this.isLoding && this.$emit('pullup')
                        this.isLoding = true
                    }
                })
                this.scroll.on('refresh', () => {
                    // 监听刷新
                    if (-1 * this.scroll.maxScrollY <= 50) { // 不足一屏
                        this.emptyShow = true
                    } else {
                        this.loadingMore = true
                        if (this.emptyShow) {
                            this.emptyShow = false
                            setTimeout(() => {
                                this.refresh()
                            })
                        }
                    }
                })
            }

            // 上拉刷新加载方式
            if (this.pullup) {
                this.scroll.on('scrollEnd', () => {
                    // 滚动到底部
                    if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                        this.$emit('scrollToEnd')
                    }
                })
            }
            if (this.pullup) {
                this.scroll.on('touchEnd', (pos) => {
                    // 上拉动作
                    if (pos.y * -1 > this.content.offsetHeight - this.$refs.wrapper.clientHeight) {
                        this.setStyle(500, -50)
                        !this.isLoding && this.$emit('pullup')
                        this.isLoding = true
                    }
                })
            }

            // 下拉刷新加载方式
            if (this.pulldown) {
                this.scroll.on('touchEnd', (pos) => {
                    // 下拉动作
                    if (pos.y > 50) {
                        this.setStyle(500, 50)
                        !this.isLoding && this.$emit('pulldown')
                        this.isLoding = true
                    }
                })
            }

            this.scroll.on('scrollEnd', () => {
                this.setStyle(500, 0)
            })

            // 是否派发列表滚动开始的事件
            if (this.beforeScroll) {
                this.scroll.on('beforeScrollStart', () => {
                    this.$emit('beforeScroll')
                })
            }
        },
        disable() {
            // 代理better-scroll的disable方法
            this.scroll && this.scroll.disable()
        },
        enable() {
            // 代理better-scroll的enable方法
            this.scroll && this.scroll.enable()
        },
        refresh() {
            // 代理better-scroll的refresh方法
            this.setStyle(1000, 0)
            this.scroll && this.scroll.refresh()
        },
        scrollTo(...arg) {
            // 代理better-scroll的scrollTo方法
            this.scroll && this.scroll.scrollTo(...arg)
        },
        scrollToElement(...arg) {
            // 代理better-scroll的scrollToElement方法
            this.scroll && this.scroll.scrollToElement(...arg)
        },
        // 翻页时没有更多数据 ture显示false隐藏
        noMoreChange(status) {
            this.noMore = status
            if (status) {
                this.setStyle(1000, 0)
            }
        },
        setStyle(time, top) {
            if (!this.content) {
                return
            }
            this.content.style.webkitTransition = this.content.style.transition = `top ${time}ms`
            this.content.style.top = `${top}px`
        }
    },
    watch: {
        // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
        data() {
            setTimeout(() => {
                this.isLoding = false
                this.loaddingUp = this.loaddingDown = true
                this.refresh()
            }, this.refreshDelay)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/base";

.scroll-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    ul {
        position: relative;
    }
}

.list-animate {
    position: relative;
    z-index: 3;
}

@keyframes uil-default-anim {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.uil-default-css {
    position: relative;
    background: none;
    width: 100%;
    height: 60px;
    transform: scale(.15);

    .loading-item {
        top: 80px;
        left: 93px;
        width: 14px;
        height: 40px;
        background: $main-color;
        transform: rotate(0deg) translate(0, -60px);
        border-radius: 10px;
        position: absolute;
        animation: uil-default-anim 1s linear infinite;
    }

    @for $i from 0 through 11 {
        .loading-item:nth-of-type(#{$i}) {
            animation-delay: -.5 + $i*.08333333333333331s !important;
        }
    }
}

.no-more {
    width: 100%;
    min-width: 140px;
    margin: 22px auto 0;
    padding: 0;
    text-align: center;
    height: 22px;
    line-height: 18px;
    position: relative;

    &:before {
        content: "";
        position: absolute;
        transform-origin: 0 0;
        transform: scaleY(0.5);
        z-index: -1;
        top: 1px;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(204,204,204,0.7) 25%, rgba(204,204,204,1) 35%, rgba(204,204,204,0) 36%, rgba(204,204,204,0) 64%, rgba(204,204,204,1) 65%, rgba(204,204,204,0.7) 75%, rgba(255,255,255,0) 100%);
    }

    span {
        position: relative;
        padding: 0 10px;
        top: -8px;
    }
}

.loading-wrapper {
    position: absolute;
    left: 0;
    width: 100%;

    &.loading-top {
        top: -4px;

        .no-more {
            margin-top: 25px;
        }
    }

    &.loading-bottom {
        bottom: 4px;

        .no-more {
            margin-top: 10px;
        }
    }
}

.loading-more {
    width: 100%;
    position: relative;
    top: -10px;
    opacity: 0;

    &.show {
        opacity: 1;
    }
}

</style>