<template>
  <div>
<el-row class="login-container" justify="center" :align="middle">
  <el-card style="max-width: 480px;">
    <template #header>
<div class="card-header">
<img :src="imgUrl" alt="">
</div>
<div class="jump-link">
  <el-link type="primary" @click="handleChange">{{formType?'返回登录':'注册账号'}}</el-link>
</div>
<el-form
ref="loginFormRef"
 :model="loginForm"  
 style="max-width: 600px" 
 class="demo-ruleForm"
 :rules="rules">
 


  <el-form-item prop="userName">
    <el-input v-model="loginForm.userName"  placeholder="手机号" :prefix-icon="UserFilled"/>
  </el-form-item>

  <el-form-item prop="passWord">
    <el-input v-model="loginForm.passWord" type="password" placeholder="密码" :prefix-icon="Lock"/>
  </el-form-item>
 
  <el-form-item prop="validCode" v-if="formType">
    <el-input v-model="loginForm.validCode" placeholder="验证码" :prefix-icon="Lock" >
      <template #append>
        <span @click="countdownchange">{{ countdown.validText}}</span>
      </template>
  </el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" :style="{width:'100%'}" @click="submitForm(loginFormRef)">
{{ formType?"注册账号":"登录" }}
    </el-button>
  </el-form-item>
</el-form>  
    </template>
  </el-card>
</el-row>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';
import {ref,reactive,computed,toRaw} from 'vue'
import {getCode, userAuthentication,login,menuPermission} from '../../Api/index'
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex'
import {Lock,UserFilled} from '@element-plus/icons-vue'
const router=useRouter()
const loginFormRef= ref()  //这里是ref对象，不是login对象，不是一个东西！loginform里面存储的是数据
 const imgUrl=new URL('../../../public/login-head.png', import.meta.url).href
 //切换表单（0登录 1注册）
 const formType=ref(0)
 let flag=false //用于防止用户多次点击
 //账号校验规则
 const validateUser=(rule,value,callback)=>{
//校验不能为空
if(value==''){
  callback(new Error('请输入账号'))
}else{
   const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
   phoneReg.test(value)?callback():callback(new Error('手机号格式不对，请输入正确手机号'))
}
 }
 //密码校验
 const validatePass=(rule,value,callback)=>{
//校验不能为空
if(value==''){
  callback(new Error('请输入密码'))
}else{
  const passReg=/^[a-zA-Z0-9_-]{4,16}$/;
  passReg.test(value)?callback():callback(new Error('密码格式不对，格式为字母数字下划线'))
}
 }
 //表单校验
 const rules=reactive({
  userName:[{validator:validateUser,trigger:'blur'}],
  passWord:[{validator:validatePass,trigger:'blur'}]

 })
 const loginForm=reactive({
    "userName": "",
    "passWord": "",
    "validCode": ""
})
 //发送短信
 const countdown=reactive({
  validText:'获取验证码',
  time:60
 })
 const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
 //点击切换登录和注册
 const handleChange=()=>{
  formType.value=!formType.value
 }

 const countdownchange=()=>{
//如果已发送则不处理
  if(flag) return ;
//判断手机号是否正确，采用正则表达式
if(!loginForm.userName||!phoneReg.test(loginForm.userName)){
  return  ElMessage.error('请检查手机号是否正确')
}
//怎么过60s后会自动点击呢
const time=setInterval(()=>{
    if(countdown.time>0) {countdown.time=countdown.time-1,countdown.validText=`剩余${countdown.time}s`} else{
      countdown.time=60,countdown.validText='获取验证码',flag=false,clearInterval(time)
    }
  },1000)
  flag=true
  getCode({
    tel:loginForm.userName
  }).then((data)=>{
    // console.log(data,'data');
    if (data.code===10000) {
      ElMessage.success('发送成功')
    }
  })
 }
 const store=useStore()

const routerList=computed(()=>
  store.state.menu.routerList
)

 //表单提交
const submitForm = async (formEl) => {
  // console.log(routerList,'routerList1');
  
  if (!formEl) return
  //手动触发校验
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!',formEl,loginForm)
//注册页面,注册按钮和登录按钮是一个按钮
if(formType.value){
  userAuthentication(loginForm).then(({data})=>{
    if(data.code===10000){ 
      ElMessage.success('注册成功，请登录')
      formType.value=0
    }
  })
}else{
      //登录页面
      login(loginForm).then(({data})=>{
    if(data.code===10000){
      ElMessage.success('登录成功')
      //将token和用户信息缓存到浏览器
      localStorage.setItem('pz_token',data.data.token)
      localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
      menuPermission().then(({data})=>{
   store.commit('dynamicMenu',data.data)//routerList.value这里需要写value吗，不是本来就是数组对象吗
   routerList.value.forEach(item => {
    router.addRoute('main',item)
  // console.log(item,'检测item路径是否正常');
  });
  // console.log(router,'检测router路径是否添加');
  router.push('/')
      })
    }
  })
    }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="less">
:deep(.el-card__header) {
    padding: 0
  }
  .login-container {
    height: 100%;
    .card-header{
      background-color: #899fe1;
      img {
        width: 430px;
      }
    }
    .jump-link {
      text-align: right;
      margin-bottom: 10px;
    }
  }
</style>