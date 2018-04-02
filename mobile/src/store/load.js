/*
 *  全局加载动画
 *  日期：2017/7/17.
 *  作者：Math
 * */

export default {
    state: {
        pageScrollTop: 0,
        isLoading: false,
        direction: 'forward',
        showList: true
    },
    mutations: {
        updateScrollTop(state, payload) {
            state.pageScrollTop = payload.top
        },
        updateLoadingStatus(state, payload) {
            state.isLoading = payload.isLoading
        },
        updateDirection(state, payload) {
            state.direction = payload.direction
        },
    },
    actions: {
        updateScrollTop({ commit }, top) {
            commit({ type: 'updateScrollTop', top })
        }
    }
}
