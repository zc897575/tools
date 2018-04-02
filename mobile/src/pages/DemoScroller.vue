<template>
    <div class="demo-scroller">
        <div class="list-wrapper">
            <scroller ref="dragScroller"
                    listClass=".list-content"
                    :loadMore="false"
                    :data="dataList"
                    :pullup="true"
                    :pulldown="true"
                    @pulldown="loadDownData"
                    @pullup="loadUpData">
                <ul class="list-content">
                    <li class="list-item" v-for="item in dataList">{{ item }}</li>
                </ul>
            </scroller>
        </div>
        <div class="list-wrapper">
            <scroller ref="scrollScroller"
                    listClass=".list-content"
                    :loadMore="true"
                    :data="dataList2"
                    @pullup="loadUpData2">
                <ul class="list-content">
                    <li class="list-item" v-for="item in dataList2">{{ item }}</li>
                </ul>
            </scroller>
        </div>
    </div>
</template>

<script>
import Scroller from '../components/Scroller'

export default {
    components: {
        Scroller
    },
    data() {
        return {
            dataList: [], // 拖动数据列表
            dataList2: [], // 滚动数据列表
            number: 0,
        }
    },
    created() {
        this.setTitle('滚动组件')
        this.loadUpData()
        this.loadUpData2()
    },
    methods: {
        loadDownData() {
            setTimeout(() => {
                if (this.dataList.length > 30) {
                    this.$refs.dragScroller.noMoreChange(true)
                    return
                }
                const data = []
                for (let i = 0; i < 16; i++) {
                    this.number += 1
                    data.push(`这是第${this.number}条数据`)
                }
                this.dataList = data.concat(this.dataList)
            }, 1000)
        },
        loadUpData() {
            setTimeout(() => {
                if (this.dataList.length > 40) {
                    this.$refs.dragScroller.noMoreChange(true)
                    return
                }
                const data = []
                for (let i = 0; i < 20; i++) {
                    this.number += 1
                    data.push(`这是第${this.number}条数据`)
                }
                this.dataList = this.dataList.concat(data)
            }, 1000)
        },
        loadUpData2() {
            setTimeout(() => {
                if (this.dataList2.length > 40) {
                    this.$refs.scrollScroller.noMoreChange(true)
                    return
                }
                const data = []
                for (let i = 0; i < 16; i++) {
                    this.number += 1
                    data.push(`这是第${this.number}条数据`)
                }
                this.dataList2 = this.dataList2.concat(data)
            }, 1000)
        }
    },
}
</script>

<style lang="scss">
.demo-scroller {
    display: flex;
    justify-content: space-around;
}

.list-wrapper {
    width: 49%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .list-content {
        position: relative;
        z-index: 10;
        background: #fff;
    }

    .list-item {
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        padding-left: 20px;
        border-bottom: 1px solid #e5e5e5;
    }
}
</style>
