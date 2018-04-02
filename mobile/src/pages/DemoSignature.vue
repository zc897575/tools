<template>
	<div class="signature-demo">
		<div class="signature-box">
			<signature ref="signature"></signature>
		</div>
		<div class="btn-box">
			<button type="button" class="save" @click="save">保存</button>
			<button type="button" class="clear" @click="clear">清除</button>
		</div>
	</div>
</template>

<script>
import Signature from '../components/Signature'

export default {
    components: {
        Signature
    },
    data() {
        return {

        }
    },
    created() {
        this.setTitle('签名')
    },
    methods: {
        save() {
            this.$refs.signature.save().then((res) => {
                console.log(res)
            })
        },
        clear() {
            this.$refs.signature.clear()
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/base";

.signature-demo {
    width: 100%;
    height: 100%;
}

.signature-box {
    width: 260px;
    height: 200px;
    position: relative;
    border: 1px solid #ccc;
    margin: 30px auto;
}

.btn-box {
    width: 100%;
    text-align: center;

    button {
        width: 60px;
        height: 30px;
        line-height: 28px;
        border-radius: 3px;
    }

    .save {
        background: $main-color;
        border: 1px solid $main-color;
        color: #fff;
        margin-right: 20px;
    }

    .clear {
        border: 1px solid #ddd;
    }
}
</style>
