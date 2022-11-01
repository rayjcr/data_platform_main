<template>
    <div class="addBox">
        <a-form :form="form" @submit="save">
                <a-form-item
                  label="机构名称"
                  class="mb10"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    type="text"
                    v-decorator="['deptName',{rules: [{ required: true, message: '请输入机构名称' }]}]"
                    placeholder="请输入机构名称"
                  />
                </a-form-item>
                <a-form-item
                  label="机构类别"
                  class="mb10"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-select :disabled="(currInfo.level == 3 && type == 'add') || (currInfo.level == 4 && type == 'edit')" v-decorator="['showType',{rules: [{ required: true, message: '请选择机构类别！' }]}]" placeholder="请选择机构类别">
                    <a-select-option v-for="(item,key,index) in typeList" :key="index" :value="item">{{key}}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="负责人"
                  class="mb10"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    type="text"
                    v-decorator="['adminName']"
                    placeholder="请输入负责人"
                  />
                </a-form-item>

                <a-form-item
                  label="电话"
                  class="mb10"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    v-decorator="['mobile',{rules: [{ pattern: /^((0\d{2,3}-\d{7,8})|(\d{7,8})|(1[34578]\d{9}))$/ , message: '电话号码格式错误！' }]}]"
                    placeholder="请输入电话"
                  />
                </a-form-item>
                <a-form-item
                  label="地址"
                  class="mb10"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    type="text"
                    v-decorator="['address']"
                    placeholder="请输入地址"
                  />
                </a-form-item>
                <a-form-item
                  label="邮箱"
                  class="mb10"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    v-decorator="['email',{rules: [{ type: 'email', message: '邮箱格式错误！' }]}]"
                    placeholder="请输入邮箱"
                  />
                </a-form-item>
                <a-form-item
                  label="邮编"
                  class="mb10"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input
                    v-decorator="['postCode',{rules: [{ pattern: /^[1-9][0-9]{5}$/ , message: '邮编格式错误' }]}]"
                    placeholder="请输入邮编"
                  />
                </a-form-item>
                <a-form-item
                  label="排序号"
                  class="mb10"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 17 }"
                >
                  <a-input type="number" v-decorator="['orderNum']" placeholder="请输入排序号" />
                </a-form-item>
              </a-form>
              <div class="footer" style="text-align: center;" v-if="type != 'view'">
                <a-button type="primary" @click="save">保存</a-button>
              </div>
    </div>
</template>
<script>
export default {
    props:{
        type:{}, //add 新增 edit 编辑 view 查看
        info:{}, //当前选中树节点数据
        typeList:{}
    },
    data(){
        return{
            form:this.$form.createForm(this),
            currInfo:{},
            add_status:false,
            edit_status:false,
        }
    },
    // 学校新增部门
    // 部门编辑
    // 教育局新增学校
    // 学校编辑
    mounted(){
       this.currInfo = this.$parent.currInfo
        // 学校新增部门
        this.add_status = this.currInfo.level == 3 && this.type == 'add'
        // 部门编辑
        this.edit_status = this.currInfo.level == 4 && this.type == 'edit'
        if(this.type != 'add'){
          // 回显数据
            this.form.setFieldsValue(this.info)
        }else{
            this.form.resetFields()
            if(this.add_status || this.edit_status){
              this.form.setFieldsValue({
                showType: this.currInfo.showType
              })
            }
        }
    },
    methods:{
        save(){
            let data = this.form.getFieldsValue();
            // 学校新增部门 父级id赋值
            if(this.add_status) data['parentId'] = this.currInfo.value
            // 部门编辑 父级id赋值
            if(this.edit_status) data['parentId'] = this.info.parentId
            this.form.validateFields((err) => {
                if (!err) {
                    this.$emit('save',data)
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .addBox{
        width: 100%;
        height: 100%;
        padding: 20px;
    }
</style>