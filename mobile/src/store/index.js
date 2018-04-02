import Vue from 'vue'
import Vuex from 'vuex'

import load from './load'

Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        load,
    },
})
