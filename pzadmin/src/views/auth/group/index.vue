<template>
  <!-- 按钮：点击后打开弹窗 -->
   <div class="btns">
    <el-button :icon="Plus" @click="open(null)" type="primary" size="small">新增</el-button>
   </div>

   <!-- 弹窗组件，用于添加或编辑权限 -->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="添加权限"
    width="700"
  >
    <!-- 表单组件，用于输入权限数据 -->
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
      
      <!-- 表单项：输入权限的名称 -->
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请填写权限名称"
        ></el-input>
      </el-form-item>

      <!-- 表单项：树形菜单权限，选择权限 -->
      <el-form-item label="权限" prop="permissions">
        <el-tree 
          ref="treeRef"
          :data="PermissionData" 
          style="max-width: 600px;" 
          node-key="id" 
          show-checkbox
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="[2]"
        >
        </el-tree>
      </el-form-item>
    </el-form>

    <!-- 弹窗底部的确认按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>

   <panel-head :route="route"/>
  <!-- 表格组件，用于展示权限数据 -->
  <el-table :data="tableData.list" style="width: 100%;">
    <!-- 表格列：展示权限 ID -->
    <el-table-column prop="id" label="id" />
    <!-- 表格列：展示权限的名称 -->
    <el-table-column prop="name" label="昵称" />
    <!-- 表格列：展示菜单权限 -->
    <el-table-column prop="permissionName" label="菜单权限"/>
    <!-- 表格列：操作列，提供编辑功能 -->
    <el-table-column label="操作">
      <!-- 插槽用于自定义列内容，传入表格行数据 scope -->
      <template #default="scope">
        <div>
          <!-- 编辑按钮，点击时打开弹窗，并传入该行数据 -->
          <el-button type="primary" @click="open(scope.row)">
            编辑
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

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
 

  
</template>

<script setup>
import { ref, reactive, onMounted, nextTick} from 'vue';
import { userGetMenu, userSetMenu, menulist } from '../../../Api';   //userGetMenu只是获取权限之类的数据,而userSetMenu是将你的数据放进服务器的数据库中，menulist就是直接展示你放进去的数据
import {Plus} from '@element-plus/icons-vue'
import {useRoute}from 'vue-router'
const route=useRoute()
// 在组件挂载时执行，获取菜单权限数据和列表数据
onMounted(() => {
  // 获取菜单权限数据
  userGetMenu().then(({data}) => {
    PermissionData.value = data.data;
    // console.log('PermissionData:', data.data);
  });
 // 获取用户列表数据
 getListData();
});
const background=false
// 打开弹窗并处理表单初始化数据
const open = (rowData={}) => {
  // 显示弹窗
  dialogFormVisible.value = true;
  // 使用 nextTick 确保弹窗组件完全渲染后执行
  nextTick(() => {
    if (rowData) {
      
      // 如果传入的有数据，将其赋值到表单
      Object.assign(form, { id: rowData.id, name: rowData.name});

      //设置树形组件的已选中权限
      treeRef.value.setCheckedKeys(rowData.permission);

    }
  });
};

const paginationData = reactive({
  pageNum: 1,   // 当前页码
  pageSize: 15  // 每页显示的记录数
});

const handleSizeChange=(val)=>{
paginationData.pageSize=val,
getListData()
}

const handleCurrentChange=(val)=>{
paginationData.pageNum=val,
getListData()
}
// 定义表单的引用，用于后续调用 resetFields 和 validate 等方法
const formRef = ref();

// 定义表单数据，包含名称、权限和 ID
const form = reactive({
  name: '',
  permissions: '',
  id: '',
});

// 弹窗显示与隐藏的状态管理
const dialogFormVisible = ref(false);

// 树形菜单的权限数据，展示给用户选择
const PermissionData = ref([]);
// 定义列表数据和分页信息
const tableData = reactive({
  list: [],  // 表格中的数据
  total: 0   // 总记录数
});

// 默认选中的权限项
const defaultKeys = [4, 5];

// 定义树形组件的引用，用于调用 setCheckedKeys
const treeRef = ref();

const disabled=false
// 表单的验证规则
const rules = reactive({
  name: [{
    required: true,
    trigger: 'blur',
    message: '请输入权限名称'
  }]
});

// 获取列表数据的方法
const getListData = () => {
  //这里面的（{data}）是直接解构了对象，直接获取对象中的data参数
  menulist(paginationData).then(({data}) => {
    const { list, total } = data.data;
    // console.log(list,'234');
    
    // 更新表格数据
    tableData.list = list;
    tableData.total = total;
  }) .catch((error) => {
      console.error("获取列表数据失败：", error);
    });;
};

// 弹窗关闭前的操作，重置表单和树形选择
const beforeClose = () => {
  dialogFormVisible.value = false;
  formRef.value.resetFields(); // 重置表单字段
  treeRef.value.setCheckedKeys(defaultKeys); // 重置树形组件的选择
};

// 弹窗确认按钮点击时的处理逻辑
const confirm = async (formEl) => {
  if (!formEl) return;
  // 验证表单
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 获取树形组件选中的权限
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      // 提交表单数据到后端接口
      userSetMenu({
        name: form.name,
        permissions: permissions,
        id: form.id
      }).then((data) => {
        // console.log(data, '后端返回的数据');
        getListData(); 
        dialogFormVisible.value = false; 
      }).catch((error) => {
        console.error('提交表单出错', error);
      });
    } else {
      console.log('表单验证错误', fields);
    }
  });
}
</script>

<style lang="less" scoped>
/* 样式部分可以根据需求进行定制 */
.btns{
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
