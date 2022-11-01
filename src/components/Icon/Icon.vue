<template>
  <a-modal :title="title" :visible="visible" width="50%" style="min-width:500px" @cancel="handleCancel"
    :maskClosable='false' :keyboard='false' centered>
    <a-form :form="form" @submit="submit">
        <a-form-item label='id' style="display:none" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['id']" />
        </a-form-item>
      <div class="first_menu" v-if="isFirstMenu">
        <a-form-item label='菜单名称' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['cdmc',{rules: [{ required: true, message: '请输入菜单名称！' }]}]" placeholder="请输入菜单名称" />
        </a-form-item>
        <a-form-item label='菜单URL' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['cdurl',{rules: [{ required: true, message: '请输入菜单URL！' }]}]" placeholder="请输入菜单URL" />
        </a-form-item>
  
        <a-form-item label='组件地址' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-select defaultValue="" v-decorator="['zjdz',{rules: [{ required: true, message: '请选择组件地址！' }]}]"
            placeholder="请选择组件地址">
            <a-select-option value="">请选择组件地址</a-select-option>
            <a-select-option value="1">BasicLayout</a-select-option>
            <a-select-option value="2">PageView</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label='相关权限' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-select defaultValue="" v-decorator="['xgqx']" placeholder="请选择相关权限">
            <a-select-option value="">请选择相关权限</a-select-option>
            <a-select-option value="1">admin</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label='菜单图标' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input defaultValue="mysite" v-decorator="['cdtb',{rules:[{ required: true, message: '请选择菜单图标！' }]}]"
            placeholder="请选择菜单图标">
            <a-icon slot="addonAfter" type="setting" @click="iconShow = true"/>
          </a-input>
        </a-form-item>
        <a-form-item label='菜单排序' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-input v-decorator="['cdmc']" placeholder="请输入菜单排序" />
        </a-form-item>
       </div>
       
       <div class="second_menu" v-else>
         <a-form-item label='按钮名称' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
           <a-input v-decorator="['anmc',{rules: [{ required: true, message: '请输入按钮名称！' }]}]" placeholder="请输入按钮名称" />
         </a-form-item>
         <a-form-item label='相关权限' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
           <a-select defaultValue="" v-decorator="['xgqx']" placeholder="请选择相关权限">
             <a-select-option value="">请选择相关权限</a-select-option>
             <a-select-option value="1">admin</a-select-option>
           </a-select>
         </a-form-item>
       </div>
      <a-form-item label='上级菜单' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-tree checkable @expand="onExpand" :expandedKeys="expandedKeys" :autoExpandParent="autoExpandParent"
          v-model="checkedKeys" @select="onSelect" :selectedKeys="selectedKeys" :treeData="treeData" />
      </a-form-item>
    </a-form>
    
    <div slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button type="primary" :loading="confirmLoading" @click="submit">保存</a-button>
  
    </div>
  </a-modal>
</template>

<script>
</script>

<style>
</style>
