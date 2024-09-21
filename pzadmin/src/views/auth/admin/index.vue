<template>
     <panel-head :route="route"/>
  <div>
  <el-table :data="tableData.list" style="width: 100%;">
    <!-- 表格列：展示权限 ID -->
    <el-table-column prop="id" label="id" />
    <!-- 表格列：展示权限的名称 -->
    <el-table-column prop="name" label="昵称" />
    <!-- 表格列：展示菜单权限 -->
    <el-table-column prop="permisson_id" label="所属组别" >

      <template #default="scope">
  {{ permissionName (scope.row.permissions_id)}}
    </template>
  </el-table-column>
    <el-table-column prop="mobile" label="手机号" />

<el-table-column prop="active" label="状态" >
    <template #default="scope">
    <el-tag class="ml-2" :type="scope.row.active?'success':'danger'">{{  scope.row.active?'正常':'失效'}}</el-tag>
    </template>
</el-table-column>


<el-table-column  label="创建时间" >
<template #default="scope">
  <div class="flex-box">
    <el-icon ><Clock></Clock></el-icon>
  <span style="margin-left: 10px;">{{ scope.row.create_item }}</span>
  <!-- <span>{{ JSON.stringify($style) }}</span> -->
  </div>
</template>
</el-table-column>

<!-- 表格列：操作列，提供编辑功能 -->
<el-table-column label="操作">
      <!-- 插槽用于自定义列内容，传入表格行数据 scope --> 
      <template #default="scope">
        <div>
          <el-button type="primary" @click="open(scope.row)">
            编辑
          </el-button>
        </div>
      </template>
</el-table-column>

</el-table>
  </div>
  <div class="pagination-info">
  <el-pagination
  v-model:current-page="paginationData.pageNum"
  v-model:page-size="paginationData.pageSize"
  :disabled="disabled"
  size="small"
  :background="background"
  layout="prev, pager, next, jumper"
  :total="tableData.total"
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
/>
</div>
<el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="添加权限123"
    width="700"
    class="qus"
  >
  <el-form
      ref="formRef" 
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
    <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="form.mobile"
          disabled
        ></el-input>
      </el-form-item>

      <el-form-item label="昵称" prop="name">
        <el-input
          v-model="form.name"
        ></el-input>
      </el-form-item>

      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select
         v-model="form.permissions_id" 
         placeholder="请选择菜单权限" 
         style="width: 240px">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
      </el-form-item>

  </el-form>

  <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">
          确认
        </el-button>
      </div>
    </template>
</el-dialog>

</template>

<script setup>
import {authAdmin,menuSelectList,updateUser} from '../../../Api'
import { reactive,onMounted,ref} from 'vue';
import dayjs from'dayjs'
import {useRoute}from 'vue-router'
import { ta } from 'element-plus/es/locale/index.mjs';
import { List } from '@element-plus/icons-vue';
const route=useRoute()
// console.log(route,'route');

const disabled=false
const background=false
const tableData = reactive({
  list: [],  // 表格中的数据
  total: 0   // 总记录数
});

const paginationData=reactive({
  pageNum:1,
  pageSize:10
})


//获取注册的账户
onMounted(()=>{
  getListData()
//获取菜单管理中的添加的数据
  menuSelectList().then(({data})=>{
   options.value=data.data
  })
})
//请求列表
const getListData=()=>{
  authAdmin(paginationData).then(({data})=>{
    const {list,total}=data.data
    tableData.list=list
    tableData.total=total
    //下载了时间插件，可以展示时间
    list.forEach(item=>{
      item.create_item=dayjs( item.create_item).format('YYYY--MM--DD')
    })
  })
}
const dialogFormVisible=ref(false)
const options=ref([])
//根据权限id匹配权限名称
const permissionName=(id)=>{
const data=options.value.find(el=>el.id===id)
return data?data.name:'超级管理员'
}

const open=(rowData)=>{
dialogFormVisible.value=true
Object.assign(form,{mobile:rowData.mobile,name:rowData.name,permissions_id:form.permissions_id})
}
const handleSizeChange=(val)=>{
paginationData.pageSize=val,
getListData()
}

const handleCurrentChange=(val)=>{
paginationData.pageNum=val,
getListData()
}
const beforeClose=()=>{
dialogFormVisible.value=false
}

//编辑表单
const form=reactive({
  name:'',
  permissions_id:'',
  mobile:''
})

const rules = reactive({
  name: [{
    required: true,
    trigger: 'blur',
    message: '请填写昵称'
  }],
  permissions_id:[{
    required: true,
    trigger: 'blur',
    message: '请选择菜单权限'
  }]

});

const formRef=ref()
//表单提交
const confirm=async (formEl) => {
  if (!formEl) return;
  // 验证表单
  await formEl.validate((valid, fields) => {
    if (valid) {
  const {name,permissions_id}=form
  updateUser({name,permissions_id}).then(({data})=>{

    if(data.code===10000){
      dialogFormVisible.value=false
      getListData()
    }
  })
    } else {
      console.log('表单验证错误', fields);
    }
  });
}

</script>

<style lang="less" scoped>
.flex-box{
  display: flex;
  align-items: center;
}
.qus{
height: 1000px;
}
</style>