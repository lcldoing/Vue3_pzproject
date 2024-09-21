<template>
   <div class="common-layout">
    <el-container>
      <!-- <el-aside width="200px">Aside</el-aside> -->
<Aside></Aside>
      <el-container>
        <el-header><Header></Header></el-header>
         
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from '../components/aside.vue';
import Header from '../components/navHeader.vue'
</script>

<style lang="less" scoped>
.common-layout{
  height:1000px;//出现100%不生效的情况
  .el-container{
    height: 100%;
  }
}


</style>