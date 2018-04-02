<template>
	<div class="loading-body">
        <div class="load-box">
            <loading :show="isShow"></loading>
        </div>
        <button type="button" @click="onOff">{{ text }}</button>
	</div>
</template>

<script>
import Loading from '../components/Loading'

export default {
    components: {
        Loading
    },
    data() {
        return {
            isShow: false,
            text: ''
        }
    },
    created() {
        this.setTitle('loading')
        this.onOff()
    },
    methods: {
        onOff() {
            this.isShow = !this.isShow
            if (this.isShow) {
                this.text = '隐藏'
            } else {
                this.text = '显示'
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.loading-body {
    padding-top: 20px;
    text-align: center;
}

.load-box {
    width: 100%;
    height: 100px;
    position: relative;
}
</style>
