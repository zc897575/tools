<template>
	<div class="vux-search-box" ref="searchBox" :class="{'vux-search-fixed':isFixed}" :style="{top: isFixed ? top : '', position: fixPosition }">
		<div class="weui-search-bar" :class="{'weui-search-bar_focusing': !isCancel || currentValue}">
			<slot name="left"></slot>
			<form class="weui-search-bar__form" @submit.prevent="$emit('on-submit', value)" action=".">
				<div class="vux-search-mask" @click="touch" v-show="!isFixed && autoFixed"></div>
				<div class="weui-search-bar__box">
					<i class="weui-icon-search"></i>
					<input type="search" class="weui-search-bar__input" :id="`search_input_${uuid}`" :placeholder="placeholder" autocomplete="off" :required="required" v-model="currentValue" ref="input"
					       @focus="onFocus"
					       @blur="onBlur"/>
					<a href="javascript:" class="weui-icon-clear" @click="clear" v-show="currentValue"></a>
				</div>
				<label :for="`search_input_${uuid}`" class="weui-search-bar__label" v-show="!isFocus && !value">
					<i class="weui-icon-search"></i>
					<span>{{ placeholder }}</span>
				</label>
			</form>
			<a href="javascript:" class="weui-search-bar__cancel-btn" @click="cancel">{{ cancelText }}</a>
			<slot name="right"></slot>
		</div>
		<div class="weui-cells vux-search_show" v-show="isFixed">
			<slot></slot>
			<div class="weui-cell weui-cell_access" v-for="item in results" @click="handleResultClick(item)">
				<div class="weui-cell__bd weui-cell_primary">
					<div class="search-list">
						<i class="marker"></i>
						<span class="result-num">{{ item.num }}</span>
						<span class="list-result" v-html="item.title">
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
    name: 'search',
    mixins: [{
        created() {
            this.uuid = Math.random().toString(36).substring(3, 8)
        }
    }],
    props: {
        required: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '搜索'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        value: {
            type: String,
            default: ''
        },
        results: {
            type: Array,
            default() {
                return []
            }
        },
        autoFixed: {
            type: Boolean,
            default: true
        },
        top: {
            type: String,
            default: '0px'
        },
        position: {
            type: String,
            default: 'fixed'
        },
        autoScrollToTop: Boolean
    },
    created() {
        if (this.value) {
            this.currentValue = this.value
        }
    },
    computed: {
        fixPosition() {
            if (this.isFixed) {
                return this.position === 'absolute' ? 'absolute' : 'fixed'
            }
            return 'static'
        }
    },
    methods: {
        clear() {
            this.currentValue = ''
            this.isFocus = true
            this.setFocus()
            if (this.autoFixed && !this.isFixed) {
                this.isFixed = true
            }
        },
        cancel() {
            this.isCancel = true
            this.currentValue = ''
            this.isFixed = false
            this.$emit('on-cancel')
        },
        handleResultClick(item) {
            this.$emit('result-click', item) // just for compatibility
            this.$emit('on-result-click', item)
            this.isCancel = true
            this.isFixed = false
        },
        touch() {
            this.isCancel = false
            if (this.autoFixed) {
                this.isFixed = true
            }
            this.$emit('on-touch')
        },
        setFocus() {
            this.$refs.input.focus()
        },
        setBlur() {
            this.$refs.input.blur()
            this.isFixed = false
        },
        onFocus() {
            this.isFocus = true
            this.$emit('on-focus')
            this.touch()
        },
        onBlur() {
            this.isFocus = false
        }
    },
    data() {
        return {
            currentValue: '',
            isCancel: true,
            isFocus: false,
            isFixed: false
        }
    },
    watch: {
        isFixed(val) {
            if (val === true) {
                this.setFocus()
                this.isFocus = true

                if (this.autoScrollToTop) {
                    setTimeout(() => {
                        window.scrollTo(0, 0)
                    }, 150)
                }
            }
        },
        value(val) {
            this.currentValue = val
        },
        currentValue(val) {
            this.$emit('input', val)
            this.$emit('on-change', val)
        },
        isFocus() {
            if (!this.isFocus) {
                this.$emit('on-blur')
            }
        }
    }
}
</script>

<style lang="less">
@import '~vux/src/styles/weui/icon/weui_icon_font';
@import '~vux/src/styles/weui/widget/weui_searchbar/weui_searchbar';
@import '~vux/src/styles/weui/widget/weui_cell/weui_cell_global';
@import '~vux/src/styles/weui/widget/weui_cell/weui_access';
</style>

<style lang="scss">
@import "../assets/css/base";

$search-bg: #fff;
$search-height: 36px;

.vux-search-fixed {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 5;
    background: rgba(255, 255, 255, 1);
    backdrop-filter: blur(5px);
}

.vux-search-box {
    width: 100%;
}

.weui-cells.vux-search_show {
    margin-top: 0!important;
    overflow-y: auto;
    max-height: 400px;

    &::-webkit-scrollbar {
        display: none;
    }

    &::after {
        display: none;
    }
}

.vux-search-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 94%;
    height: 100%;
    z-index: 5;
}

.weui-search-bar__label {
    top: 4px;
}

.weui-search-bar__box .weui-search-bar__input,
.weui-search-bar__label span {
    font-size: .28rem;
}

.weui-search-bar__cancel-btn {
    color: #333;
    line-height: $search-height;
}

.search-list{
    text-align: left;
    overflow: hidden;
    font-size: .28rem;
}

.list-result {
    display: block;
    margin: 0 50px 0 18px;

    @include ellipsis(1);
}

.result-num {
    float: right;
    color: $main-color;
}

.weui-cell {
    padding: .3rem 14px;
    position: relative;
    display: block;

    &:before{
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 2px;
        border-top: 1px solid #eee;
        transform-origin: 0 0;
        transform: scaleY(.5);
        left: 15px;
    }
}

.weui-icon-search {
    line-height: 26px;
    display: none;
}

.weui-search-bar__label {
    text-align: left;
    padding: 0 0 0 10px;
    border-radius: 10px;
    background: $search-bg;
    height: 34px;
    line-height: 34px;
    top: 1px;
    left: 1px;

    .weui-icon-search {
        margin-right: -4px;
    }
}

.weui-search-bar__label span {
    vertical-align: 1px;
}

.weui-cells.vux-search_show {
    position: absolute;
    width: 100%;
    -webkit-overflow-scrolling : touch;
    top: 50px;
    bottom: 0;
    left: 0;
    max-height: 1000px;
}

.vux-search-fixed {
    height: 100%;
}

.weui-search-bar__form,
.weui-search-bar {
    background: #fff;
}
.weui-search-bar__form:after {
    background: $search-bg;
    border: 0;
    border-radius: 12px 0 0 12px;
}

.weui-search-bar__box {
    padding-right: 10px;
    padding-left: 10px;

    @include setLine(all, #dedede);

    &:before {
        width: 200%;
        border-radius: 10px;
    }
}

.search-point {
    color: $main-color;
}

.weui-search-bar__box .weui-search-bar__input {
    padding: 8px 20px 8px 0;
    height: $search-height;
    box-sizing: border-box;
}

.weui-search-bar__box .weui-icon-clear {
    line-height: $search-height;
}

.weui-search-bar {
    &:before,
    &:after {
        display: none;
    }
}
</style>