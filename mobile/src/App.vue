<template>
	<div id="app">
		<transition :name="'vux-pop-' + (direction)">
			<keep-alive>
				<router-view class="router-view" :class="'router-'+ (direction)" v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
		</transition>
		<transition :name="'vux-pop-' + (direction)">
			<router-view class="router-view" :class="'router-'+ (direction)" v-if="!$route.meta.keepAlive"></router-view>
		</transition>
		<loading v-model="isLoading"></loading>
	</div>
</template>
<script>
import { mapState } from 'vuex'
import { Loading } from 'vux'

export default {
    name: 'app',
    components: {
        Loading,
    },
    computed: {
        ...mapState({
            route: state => state.route,
            path: state => state.route.path,
            isLoading: state => state.load.isLoading,
            direction: state => state.load.direction,
        }),
    },
}
</script>

<style lang="scss">
@import "assets/css/common";

</style>
