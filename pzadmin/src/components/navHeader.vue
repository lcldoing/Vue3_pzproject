<template>
  <div class="header-container">
<div class="header-left flex-box">
    <el-icon class="icon" size="20" @click="store.commit('collapaseMenu')"><Fold /></el-icon>
    <ul class="flex-box">
      <li 
      v-for="(item,index) in selectMenu" 
      :key="item.path" 
      class="tab flex-box"
      :class="{selected: $route.path===item.path}">
<el-icon class="icon" size="20px"><component :is="item.icon"></component></el-icon>
<router-link :to="item.path" >
  {{ item.name }}
</router-link>
<el-icon class="close" size="20px"><Close @click="closeTab(item,index)" /></el-icon>
      </li>
    </ul>
</div>
<div class="header-rigth">
    <el-dropdown  @command="handleClick">
  <div class="el-dropdown-link flex-box">
    <el-avatar
        :src="userInfo.avatar"
      />
      <p class="user-name">{{userInfo.name}}</p>
     </div>
    <template #dropdown>
      <el-dropdown-menu >
        <el-dropdown-item command="cancel">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown> </div>
  </div>
</template>

<script setup>
import{computed} from 'vue'
import {useStore} from 'vuex'
import {useRoute,useRouter} from 'vue-router'
const router=useRouter()
const route=useRoute()
const store=useStore()
const selectMenu=computed(()=>store.state.menu.selectMenu)

const userInfo=JSON.parse(localStorage.getItem('pz_userInfo'))
//点击关闭tab 
const closeTab =(item,index)=>{
  store.commit('closeMenu',item)
  // if(route.path!==item.path){
  //   return
  // }
  //删除最后一项
  const selectMenuData=selectMenu.value
  //是先删除了一个元素，所以此时判断就是剩下数组的长度与最后的索引值是否相等
  if(index===selectMenuData.length){
//如果tag只有一个元素
    if(!selectMenuData.length){
router.push('/')
    }else{
      router.push({
        path:selectMenuData[index-1].path
      })
    }
  }else{//删除的是中间位置tag
    router.push({
        path:selectMenuData[index].path
      })}
}

//没有办法清空localstorage
const handleClick=(command)=>{
if(command === 'cancel'){
  localStorage.removeItem('pz_token')
  localStorage.removeItem('pz_userInfo')
  localStorage.removeItem('pz_v3pz')

window.location.href=window.location.origin
}}
</script>

<style lang="less" scoped>
.flex-box{//这个是经常使用的样式，可以单独提取出来，在要使用的地方加上去就行
    display: flex;
    align-items: center;
    height: 100%;
}
.header-container{
display: flex;
justify-content: space-between;
// flex-direction: row;
align-items: center;
height: 100%;
background-color: #fff;
padding-right: 25px;
.header-left{
    display: flex;
    align-items: center;
    .icon{
width: 45px;
height: 100%;
    }
    .icon:hover{
        background-color: #f5f5f5;
        cursor:pointer;
        height: 100%;
    }
    .tab{
      padding: 0 10px;
      height: 100%;
      .text{
        margin:0 5px;
      }
      .close{
          visibility: hidden;
        }
        &.selected{
          a{
            color: #409eff;
          }
          i{
            color:#409eff;

          }
          background-color: #f5f5f5;
        }
    }
    .tab:hover{
        background-color: #f5f5f5;
        .close{
          visibility: inherit;
          cursor:pointer; 
          color:#000
        }
      }
}
.header-right{
    .user-name{
        margin-left: 10px;
    }
}
// a{
//   height: 100px;
//   color:#333 ;
//   font-size: 15px;
// }
}
</style>