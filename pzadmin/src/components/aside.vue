<template>
 <el-menu
        :style="{width:  !isCollapse?'230px':''}"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-container"
        :default-active="active"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >
      <p class="log-lg">{{ isCollapse? 'DIDI':'DIDI陪诊'}} </p>
      <treeMenu  :menuData="menuData" :index=1></treeMenu>
 </el-menu>

</template>

<script setup>
import treeMenu from './treeMenu.vue';
import { useRouter } from 'vue-router';
import {reactive, computed } from 'vue'
import { useStore } from 'vuex'
const store=useStore() 
const router=useRouter()
// console.log(store.state.menu,'asidestore');
const isCollapse=computed(()=>store.state.menu.isCollapse)  //isCollapse没有办法获取，很奇怪 
// const menuData=(router.options.routes[0].children)
const menuData=computed(()=>
    store.state.menu.routerList
)
// console.log('router',router);

const active=computed(()=>store.state.menu.menuActive)
const handleClose=()=>{};
const handleOpen=()=>{}
</script>

<style lang="less" scoped>
.aside-container{
    height: 100%;
    .log-lg{
        font-size: 20px;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #fff;
    }

}

</style>