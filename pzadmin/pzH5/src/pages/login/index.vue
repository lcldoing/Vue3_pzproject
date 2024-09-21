<template>
<h1></h1>
<van-form @submit="onSubmit">
<h1>  用户登录</h1>
  <van-cell-group inset>
    <van-field
      v-model="form.userName"
      name="用户名"
      label="用户名"
      placeholder="用户名"
      :rules="[{ required: true, message: '请填写用户名' }]"
    />
    <van-field
      v-model="form.passWord"
      type="password"
      name="密码"
      label="密码"
      placeholder="密码"
      :rules="[{ required: true, message: '请填写密码' }]"
    />
  </van-cell-group>
  <div style="margin: 16px;" class="btn">
    <van-button round block type="primary" native-type="submit">
      提交
    </van-button>
  </div>
</van-form>

</template>

<script setup>
//表单数据

import {ref,reactive,getCurrentInstance} from 'vue'
import { useRouter } from 'vue-router';
const router=useRouter()
//获取当前vue实例
const {proxy}=getCurrentInstance()
const form=reactive({
    userName :"",
    passWord :"",
})
const onSubmit=async ()=>{
  router.push('/')
const {data}= await proxy.$api.login(form)
console.log(data,'data');

if(data.code===10000){
    localStorage.setItem('h5_token',data.data.token)
    localStorage.setItem('h5_userInfo',JSON.stringify(data.data.userInfo))
    router.push('/')
}
}

</script>

<style lang="less">
h1{
    text-align: center;
}
btn{
    margin: 16px;
}
</style>