import { createStore } from 'vuex'
import menu from "./menu"
import createPersistedstate from 'vuex-persistedstate'//实现store的持久化，当刷新的时候，vue实例会重新创建，store会被初始化，所以导入这个插件保证store的持久化
export default createStore({
    plugins: [new createPersistedstate({
        key: 'pz_v3pz'
    })],
    modules: {
        menu,
    }
})