const localData = localStorage.getItem('pz_v3pz')

const state = localData ? localData.menu : {
    isCollapse: false,
    selectMenu: [],//这里的数据是由treeMenu组件传递，为routes中的meta，meta: { id: '1', name: '控制台', icon: 'Platform', path: '/dashboard', describe: '用于展示当前系统中的统计数据、统计报表及重要实时数据' },
    routerList: [],
    menuActive: '1-1'

}

const mutations = {
    collapaseMenu(state) {
        state.isCollapse = !state.isCollapse
    },
    addMenu(state, payload) {
        if (state.selectMenu.findIndex(item => item.path == payload.path) === -1) {
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state, payload) {
        const index = state.selectMenu.findIndex(val => val.name === payload.name)
        state.selectMenu.splice(index, 1)
    },
    dynamicMenu(state, payload) {
        // 通过 GLOB 动态导入文件
        const modules = import.meta.glob('../views/**/**/*.vue');
        // 递归处理路由
        function routerSet(router) {
            router.forEach(route => {
                if (!route.children) {
                    const url = `../views${route.meta.path}/index.vue`;
                    // 拿到获取的 Vue 组件，使用懒加载函数
                    if (modules[url]) {
                        route.component = modules[url];  // 懒加载函数
                    } else {
                        console.warn(`Component not found at: ${url}`);
                    }
                } else {
                    routerSet(route.children);  // 递归处理子路由
                }
            });
        }
        routerSet(payload);  // 开始处理路由
        state.routerList = payload;
    },
    updateMenuActive(state, payload) {
        state.menuActive = payload
    }
}
export default {
    state,
    mutations
}