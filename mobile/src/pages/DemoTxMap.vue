<template>
	<div class="map-body">
        <tx-map :lng="121.5447" :lat="31.22249" ref="map"></tx-map>
	</div>
</template>

<script>
import txMap from '../components/TxMap'

export default {
    components: {
        txMap
    },
    data() {
        return {

        }
    },
    created() {
        this.setTitle('腾讯地图')
        setTimeout(() => {
            this.$refs.map.init()
        }, 100)
    },
    methods: {

    },
}
</script>

<style lang="scss" scoped>
.map-body {
    text-align: center;
}

</style>
