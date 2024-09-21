<template>
      <panel-head :route="route"/>
<div class="btns">
    <el-popconfirm
    confirm-button-text="是"
    cancel-button-text="否"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="是否确认删除"
    @confirm="confirmEvent"
    @cancel="cancelEvent"
  >
  <template #reference>
    <el-button  type="danger" size="small" :icon="Delete">删除</el-button>
  </template>
</el-popconfirm>
    <el-button :icon="Plus" @click="open(null)" type="primary" size="small">新增</el-button>
   </div>

   <el-table :data="tableData.list" style="width: 100%;" @current-change="handleSelectionChange(tableData.list)">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="id" />
    <!-- 表格列：展示权限的名称 -->
    <el-table-column prop="name" label="昵称" />
    <!-- 表格列：展示菜单权限 -->
    <el-table-column prop="avatar" label="头像" >
        <template #default="scope">
            <el-image 
            style="width: 50px;height: 50px;"
            :src="scope.row.avatar"
            >
            </el-image>
        </template>
    </el-table-column>
   
 
    <el-table-column prop="sex" label="性别" >
        <template #default="scope">
          {{ scope.row.sex?"男":"女" }}
        </template>
    </el-table-column>

    <el-table-column prop="mobile" label="手机号" />

    <el-table-column prop="active" label="状态" >
        <template #default="scope">
            <el-tag :type="scope.row.active?'success':'dange'">{{ scope.row.active?'正常':'失效' }}</el-tag>
        </template>
    </el-table-column>

    
<el-table-column  label="创建时间" >
<template #default="scope">
  <div class="flex-box">
    <el-icon ><Clock></Clock></el-icon>
  <span style="margin-left: 10px;">{{ scope.row.create_item }}</span>
  </div>
</template>
</el-table-column>

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

   <el-pagination
  v-model:current-page="paginationData.pageNum"
  v-model:page-size="paginationData.pageSize"
  size="small"
  layout="prev, pager, next, jumper"
  :total="tableData.total"
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"  
/>

<el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="陪护师添加"
    width="500"
  >
  <el-form
      ref="formRef" 
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <!-- 隐藏的表单项，用于记录权限 ID -->
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>

      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
      </el-form-item>

      <el-form-item label="头像" prop="avatar">
       <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisible=true">点击上传</el-button>
       <el-image
       v-else
       :src="form.avatar"
       style="width:100px;height: 200px;"/>
      </el-form-item>

      <el-form-item label="性别" prop="sex">
      <el-select v-model="form.sex" placeholder="请输入性别">
        <el-option label="男" value="1"></el-option>
        <el-option label="女 " value="2"></el-option>
      </el-select>
    </el-form-item>

      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="50" @change="handleChange" />
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
     
      <el-form-item label="是否生效" prop="active">
    <el-radio-group v-model="form.active">
      <el-radio :value="0" >失效</el-radio>
      <el-radio :value="1" >生效</el-radio>
    </el-radio-group>
    
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

  <el-dialog
    v-model="dialogImgVisible"
    :before-close="beforeCloseImg"
    title="选择图片"
    width="680"
  >
  <div class="image_list">
<div v-for="(item,index) in fileList" :key="item.name" class="img-box" @click="handlebox(index)">
    <div v-if="selectIndex===index" class="select">
        <el-icon color="#fff"><CircleCheck/></el-icon>
    </div>
    <el-image style="width: 148px; height: 148px;" :src="item.url"/>
</div>
  </div>
  <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogImgVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmImg">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { styleType } from 'element-plus/es/components/table-v2/src/common.mjs';
import {onMounted, reactive, ref,nextTick} from'vue'
import {Plus,InfoFilled,Delete} from '@element-plus/icons-vue'
import {photoList,companion,companionList,deleteCompanion} from '../../../Api'
import { ElMessage } from 'element-plus';
import {useRoute}from 'vue-router'

const route=useRoute()

onMounted(()=>{
    photoList().then(({data})=>{ 
fileList.value=data.data
    })
    getListData()
    
})

const tableData = reactive({
  list: [],  // 表格中的数据
  total: 0   // 总记录数
});

const paginationData=reactive({
  pageNum:1,
  pageSize:10
})

const getListData=()=>{
    companionList(paginationData).then(({data})=>{
        const {list,total}=data.data
        tableData.list=list
        tableData.total=total
    })
}

const handleSizeChange=(val)=>{
paginationData.pageSize=val,
getListData()
}

const handleCurrentChange=(val)=>{
paginationData.pageNum=val,
getListData()
}

const fileList=ref([])
const dialogFormVisible = ref(false);
const dialogImgVisible=ref(false)
const beforeClose = () => {
  dialogFormVisible.value = false;
  formRef.value.resetFields()
};
const beforeCloseImg=()=>{
    dialogImgVisible.value=false
}
const handlebox=(index)=>{
    selectIndex.value=index
}
const confirm=async (formEl) => {
  if (!formEl) return;
  // 验证表单
  await formEl.validate((valid, fields) => {
    if (valid) {
        companion(form).then(({data})=>{
            if(data.code===10000){
    ElMessage.success('成功')
    beforeClose()
    getListData()
            }else{
                ElMessage.error(data.message)
            }
        })
    }else {
    
    }
  })};
const handleChange=()=>{
}
const confirmImg=()=>{
form.avatar=fileList.value[selectIndex.value].url
dialogImgVisible.value=false
}
const formRef=ref()
const form =reactive({
    id: "",
    mobile: "",
    active: 1,
    age: 28,
    avatar: "",
    name: "",
    sex: ""
})
const rules=reactive({
    name: [{
    required: true,
    trigger: 'blur',
    message: '请填写昵称'
  }],
  avatar: [{
    required: true,
    trigger: 'blur',
    message: '请选择头像'
  }],
  sex: [{
    required: true,
    trigger: 'change',
    message: '请选择性别'
  }],
  mobile: [{
    required: true,
    trigger: 'blur',
    message: '请填写手机号'
  }],
})

const open=(rowData={})=>{
    dialogFormVisible.value=true
    nextTick(()=>{
        if(rowData){
          Object.assign(form,rowData)
        }
    })
}
const selectIndex=ref(0)
const selectTableData=ref([])

const handleSelectionChange=(val)=>{
    selectTableData.value=val
}

const confirmEvent=()=>{

  if (selectTableData.value.length === 0) {
        return ElMessage.warning('请选择至少一项数据');
    }

deleteCompanion({id:selectTableData.value}).then(({data})=>{
    if(data.code===10000){
        getListData()
        console.log('更新陈工');
    }
}).catch(()=>{
  console.log('错误');
  
})

}
const cancelEvent=()=>{
console.log('cancel');
ElMessage.warning('请选择至少一项数据')

}


</script>

<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>