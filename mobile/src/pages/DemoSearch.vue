<template>
	<div class="search-body">
        <search
            placeholder="输入区域、地铁、小区名"
            @result-click="resultClick"
            @on-change="getResult"
            :results="results"
            v-model="value"
            auto-scroll-to-top
            @on-submit="onSubmit"
            ref="search"
        >
        </search>
	</div>
</template>

<script>
import Search from '../components/VuxSearch'

export default {
    components: {
        Search
    },
    data() {
        return {
            results: [],
            value: '',
            hotShow: true, // 显示热搜内容
        }
    },
    created() {
        this.setTitle('搜索')
    },
    methods: {
        resultClick(item) {
            this.value = item.text
        },
        getResult(val) {
            const data = [1, 2, 3, 4, 5]
            data.forEach((item, index) => {
                data[index] = {
                    title: '这是非关键字<span class="search-point">' + val + '</span>',
                    text: val,
                    num: index
                }
            })
            this.results = data
        },
        onSubmit() {
            this.$refs.search.setBlur()
        },
    },
}
</script>

<style lang="scss" scoped>
.search-body {
    text-align: center;
}

.load-box {
    width: 100%;
    height: 100px;
    position: relative;
}
</style>
