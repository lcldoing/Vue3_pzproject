an<template>
  <template v-for="(item) in props.menuData" >
    <el-menu-item 
    :collapse="isCollapse"
    @click="handleClick(item,`${props.index}-${item.meta.id}`)"
    v-if="!item.children || item.children.length === 0" 
:index="`${props.index}-${item.meta.id}`"  
:key="`${props.index}-${item.meta.id}`">  
  <el-icon size="20">
    <component :is="item.meta.icon"></component>
  </el-icon>
  <span>{{ item.meta.name }}</span>
    </el-menu-item>

 <el-sub-menu
  v-else :index="`${props.index}-${item.meta.id}`" 
  :key="`${props.index}+1-${item.meta.id}`">
<template #title>
<el-icon size="20">
    <component :is="item.meta.icon"></component>
  </el-icon>
  <span>{{ item.meta.name }}</span>
</template>
<tree-menu :index="`${props.index}-${item.meta.id}`" :menuData="item.children"></tree-menu>
</el-sub-menu>

</template>

  </template>
  

<script setup>
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
const props=defineProps(['menuData','index'])//此时props是一个对象
const router=useRouter()
const store=useStore()
const isCollapse=false
// console.log(router,'router');

// console.log('props.menuData.children',props.menuData[1].children)
// console.log(props);
const handleClick=(item,active)=>{
// console.log(item);
// console.log(item.meta.path);
store.commit('addMenu',item.meta)
router.push(item.meta.path)
store.commit('updateMenuActive',active)
}
</script>

<style>

</style>
