<template>
    <div class="map-content" id="mapContent">
    
    </div>
</template>
<script>
export default {
    name: 'qqMap',
    props: {
        lat: {
            type: Number,
            default: 0
        },
        lng: {
            type: Number,
            default: 0
        }
    },
    mounted() {
        window.addMap = this.addMap.bind(this)
    },
    methods: {
        init() {
            if (window.qq) {
                this.addMap()
                return
            }
            const script = document.createElement('script')
            script.src = 'http://map.qq.com/api/js?v=2.exp&key=DYDBZ-XAR3D-LFT44-P4WQB-HACWO-2EBFX&libraries=convertor&callback=addMap'
            script.defer = true
            script.async = true
            document.body.appendChild(script)
        },
        addMap() {
            const qq = window.qq
            try {
                if (!this.lat) {
                    setTimeout(this.addMap, 50)
                    return
                }
                const center = new qq.maps.LatLng(this.lat, this.lng)
                // 坐标转换，将其他地图经纬度转换为腾讯地图经纬度坐标  http://lbs.qq.com/javascript_v2/doc/convertor.html
                qq.maps.convertor.translate(center, 3, ((res) => {
                    const map = new qq.maps.Map(document.getElementById('mapContent'), {
                        center: res[0],
                        zoom: 16
                    })
                    return new qq.maps.Marker({
                        position: res[0],
                        map,
                        animation: qq.maps.MarkerAnimation.BOUNCE
                    })
                }))
            } catch (err) {
                console.log(err)
            }
        }
    },
}
</script>

<style lang="scss">
.map-content {
    width: 100%;
    height: 100%;
    text-align: left;

    .smnoprint {
        bottom: 1.5rem !important;
    }

    div[title='放大'],
    div[title='缩小'] {
        width: .6rem !important;
        height: .6rem !important;
    }
}
</style>

