<template>
    <div class="swipe-tab">
	    <swipe-tab :tabData="tabData" :showindex="showtab" @set-tab="setTab"></swipe-tab>
	    <div class="tab-content">
		    <swiper :options="swiperOption" ref="swipers">
			    <swiper-slide v-for="(slide, index) in tabData" :key="index">
				    <scroller :data="listData[index]" @pullup="loadMore" ref="scroll">
					    <ul class="scroll-wrap">
						    <li v-for="value in listData[index]">{{ value }}</li>
					    </ul>
				    </scroller>
			    </swiper-slide>
		    </swiper>
	    </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Scroller from '../components/Scroller'
import SwipeTab from '../components/SwipeTab'

require('swiper/dist/css/swiper.css')

const tabData = [
    {
        id: 1,
        text: 'tab1'
    },
    {
        id: 2,
        text: 'tab2'
    },
    {
        id: 3,
        text: 'tab3'
    },
    {
        id: 4,
        text: 'tab4'
    }
]

export default {
    components: {
        swiper,
        swiperSlide,
        Scroller,
        SwipeTab
    },
    computed: {
        tabNum() {
            return this.tabData.length
        }
    },
    data() {
        const self = this
        return {
            showtab: 0, // 顶部选项卡索引
            listData: [],
            tabData,
            swiperOption: {
                autoplay: false,
                setWrapperSize: true, // 在对flexbox布局的支持不是很好的浏览器中可能需要用到
                mousewheelControl: false,
                observeParents: true, // 当Swiper的父元素变化时，例如window.resize，Swiper更新
                threshold: 50, // 如果触摸距离小于该值滑块不会被拖动
                on: {
                    slideChange() {
                        self.showtab = this.activeIndex
                    }
                }
            },
        }
    },
    created() {
        this.setTitle('tab组件')
        const list = []
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        this.tabData.forEach((item, index) => {
            const temp = arr.map(val => val * (index + 1))
            this.$set(list, index, temp)
        })
        setTimeout(() => {
            this.listData = list
        }, 100)
    },
    methods: {
        setTab(index) { // 设置选项卡选中索引
            this.$refs.swipers.swiper.slideTo(index, 600)
        },
        loadMore() {
            if (this.listData[this.showtab].length > 20) {
                this.$refs.scroll[this.showtab].noMoreChange(true)
                return
            }
            this.$refs.scroll[this.showtab].noMoreChange(false)

            const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            arr.map(val => val * (this.showtab + 3))
            const list = this.listData[this.showtab].concat(arr)
            this.$set(this.listData, this.showtab, list)
        }
    }
}
</script>

<style lang="scss">

@import "../assets/css/base";

.swipe-tab {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;

    .tab-content {
        width: 100%;
        height: 100%;
        display: flex;
        transition: transform .5s;
        background: #fff;

        .tab-box {
            width: 100%;
            height: 100%;
        }
    }

    .scroll-wrap li {
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        padding-left: 20px;
        border-bottom: 1px solid #e5e5e5;
    }
}
</style>
