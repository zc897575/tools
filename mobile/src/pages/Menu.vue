<template>
	<div class="index-body">
		<h1>{{ msg }}</h1>
		<router-link to="/scroller">滚动组件</router-link>
        <router-link to="/loading">loading组件</router-link>
        <router-link to="/search">搜索组件</router-link>
        <router-link to="/signature">签名组件</router-link>
        <router-link to="/txMap">腾讯地图组件</router-link>
        <router-link to="/swipeTab">选项卡组件</router-link>
	</div>
</template>

<script>
export default {
    name: 'menu',
    data() {
        return {
            msg: 'demo演示',
        }
    },
    created() {
        this.setTitle('菜单页')
    },
    methods: {

    },
}
</script>

<style lang="scss" scoped>
.index-body {
    padding-top: 20px;
    text-align: center;
}

h1 {
    font-size: 22px;
    padding-bottom: 20px;
}

a {
    color: blue;
    display: block;
    line-height: 28px;
}
</style>
