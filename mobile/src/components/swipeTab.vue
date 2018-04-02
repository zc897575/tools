<template>
	<div class="tab-title">
		<div class="text" v-for="(item, index) in tabData"
		     @click="setTab(index, item.type)"
		     :class="{'active': showtab === index }"
		     :style="{ 'width': 100/tabNum + '%'}"
		>
			{{ item.text }}
		</div>
		<span class="line-box" :style="{ 'width': 100/tabNum +'%', 'transform': 'translateX('+ 100*showtab + '%)'}">
			    <span class="lines"></span>
		    </span>
	</div>
</template>

<script>

export default {
    props: {
        tabData: { // 选项卡数据
            type: Array,
            default: []
        },
        showindex: {
            type: Number,
            defalut: 0
        }
    },
    computed: {
        tabNum() {
            return this.tabData.length
        }
    },
    data() {
        return {
            showtab: 0
        }
    },
    mounted() {
        this.showtab = this.showindex
    },
    watch: {
        showindex() {
            this.showtab = this.showindex
        }
    },
    methods: {
        setTab(index, type) { // 设置选项卡选中索引
            this.showtab = index
            this.$emit('set-tab', index, type)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/base";

.tab-title {
    width: 100%;
    padding: 0 rpx(50);
    box-sizing: border-box;
    height: rpx(88);
    line-height: rpx(88);
    text-align: center;
    margin-bottom: rpx(16);
    background: #fff;
    font-size: 0;

    @include setLine(bottom, #e6e6e6);

    .text {
        display: inline-block;
        font-size: rpx(34);
        color: #333;
        position: relative;
        top: rpx(5);
    }

    .active {
        color: $main-color;
    }
}

.line-box {
    position: relative;
    transition: transform .5s;
    top: -4px;
    display: block;
}

.lines {
    display: block;
    width: rpx(50);
    left: 50%;
    margin-left: rpx(-25);

    @include setLine(bottom, $main-color, ':before', 2px);
}
</style>
