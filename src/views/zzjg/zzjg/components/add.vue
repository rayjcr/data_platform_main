<template>
    <div class="addBox">
        <div class="content-head">{{title}}</div>
        <div class="addBox-content">
            <a-form :form="form" @submit="save">
                <!-- getLabel() 共用表单文字显示条件判断
                     根据activeIndex显示对应文字  -->
               
                <!-- 
                    组织 getCondition() 新增部门时 判断条件处理
                    //activeIndex 0 组织 1 集团 2 发展群
                -->
                <template v-if="activeIndex == 0">
                    <a-form-item label="机构编号" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }"  v-if="type == 'edit'">
                        <a-input   :maxLength="50" allowClear v-decorator="['code']" placeholder=" 请输入机构编号" disabled/>
                    </a-form-item>
                    <a-form-item label="机构统信码" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" v-if="getCondition()">
                        <a-input   :maxLength="18" allowClear v-decorator="['letters',{rules:[{pattern: /^[A-Za-z0-9]{18,18}$/,message: '机构统信码格式错误,请输入18位数字/字母组合！'}]}]" placeholder="请输入机构统信码,18位数字/字母组合"/>
                    </a-form-item>
                    <a-form-item label="机构名称" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                        <a-input   :maxLength="50" allowClear v-decorator="['deptName',{rules: [{ required: true, message: '请输入机构名称' }]}]" placeholder=" 请输入机构名称"/>
                    </a-form-item>
                    <a-form-item label="机构简称" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                        <a-input   :maxLength="50" allowClear v-decorator="['abbreviation']" placeholder=" 请输入机构简称"/>
                    </a-form-item>
                    <a-form-item label="机构类别" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }"  v-if="getCondition()">
                       <a-select   show-search option-filter-prop="children" :filter-option="filterOption"   v-decorator="['showType',{rules: [{ required: true, message: '请选择机构类别' }]}]" allowClear placeholder="请选择机构类别" :disabled="type == 'edit'" :getPopupContainer="triggerNode => {return triggerNode.parentNode || document.body;}">
                            <a-select-option v-for="(item,index) in typeList" :key="index" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="负责人" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                       <a-select   show-search option-filter-prop="children" :filter-option="filterOption" v-decorator="['administrator']" allowClear placeholder="请选择负责人"  :getPopupContainer="triggerNode => {return triggerNode.parentNode || document.body;}">
                            <a-select-option v-for="(item, index) in userList" :key="index" :value="item.userId">
                                {{item.nickname}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="联系电话" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                       <a-input   :maxLength="11" allowClear v-decorator="['phone',{rules:[{ pattern: /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\d3)|(\d{3}\-))?(1[34578]\d{9})$)/ , message: '联系电话格式错误！'}]}]" placeholder="请输入联系电话"/>
                    </a-form-item>
                    <a-form-item label="邮编" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                       <a-input   :maxLength="10" allowClear v-decorator="['postcode',{rules:[{pattern: /[1-9]\d{5}(?!\d)/, message: '邮编格式错误！'}]}]" placeholder="请输入邮编"/>
                    </a-form-item>
                    <a-form-item label="邮箱" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                       <a-input   :maxLength="50" allowClear v-decorator="['email',{rules:[{ type: 'email', message: '邮箱格式错误！'}]}]" placeholder="请输入邮箱"/>
                    </a-form-item>
                     <a-form-item label="地址" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                       <a-input   :maxLength="100" allowClear v-decorator="['address']" placeholder="请输入地址"/>
                    </a-form-item>
                    <a-form-item label="成立时间" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" v-if="getCondition()">
                       <a-date-picker   style="width:100%" allowClear v-model="foundTime" placeholder="请选择成立时间"/>
                    </a-form-item>
                     <a-form-item label="机构状态" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" v-if="getCondition()">
                       <a-select    v-decorator="['status']" allowClear placeholder="请选择机构状态" :getPopupContainer="triggerNode => {return triggerNode.parentNode || document.body;}">
                            <a-select-option :value="1">在用</a-select-option>
                            <a-select-option :value="2">在建</a-select-option>
                            <a-select-option :value="3">规划</a-select-option>
                            <a-select-option :value="4">停用</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="机构简介" class="mb10" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" v-if="getCondition()">
                        <div class="textareaBox">
                            <a-input  :maxLength="100" v-model="description" type="textarea" :rows="4" placeholder="请输入机构简介简介" />
                            <label class="len">
                                还可以输入
                                <span class="color_blue" >{{description ? 100 - description.length:100}}</span>字
                            </label>
                        </div>
                    </a-form-item>
                </template>
            </a-form>
            <div class="foot">
                <a-button class="dialogConfirm" type="primary" @click="save">保存</a-button>
            </div>   
        </div>
       
    </div>
</template>
<script>
import moment from 'moment'
export default {
    props:{
        info:{},
        type:{},
        typeList:{},
        userList:{},
        activeIndex:{},//0 组织 1 集团 2 发展群
        schoolList:{},//学校列表
    },
    data(){
        return{
            form:this.$form.createForm(this),   
            title:'',
            foundTime:null,
            description:null
        }
    },
    mounted(){
        this.init()
        // 回显数据
         // treeLevel 层级 0 教育局 1 机构类别 2 学校 3部门
        let deptname = this.$parent.currTreeNode.treeLevel == 0?'组织机构':'部门'
        this.title = (this.type == 'add')?'新增'+deptname:(this.type == 'edit'?'编辑' + this.$parent.currTreeNode.title:(this.type=='view'?'查看' + this.$parent.currTreeNode.title:''))
        if(this.type == 'edit'){
            this.$nextTick(()=>{
                if(this.activeIndex == 0){
                    this.form.setFieldsValue(this.info)
                    this.description = this.info.description
                    this.foundTime = !this.info.foundTime ? null:moment(this.info.foundTime,'YYYY-MM-DD')
                }
                
            }) 
        }
    },
    methods:{
        // 搜索select
        init(){
             this.form.resetFields()
             this.description = null
             this.foundTime = null
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        save(){
           this.form.validateFields((err) => {
                  if (!err) {
                    let form = this.form.getFieldsValue()
                    if(this.activeIndex == 0){
                        if(this.type == 'add'){
                            let time = !this.foundTime ? null : moment(this.foundTime).format('YYYY-MM-DD')
                            form = {
                                ...form,
                                // 学校用教育局的level 部门 学校level + 1
                                level:this.$parent.currTreeNode.treeLevel >= 2 ? this.$parent.currTreeNode.level + 1 : this.$parent.currTreeNode.level,
                                // type 2 校级 3 部门
                                type: this.$parent.currTreeNode.treeLevel >= 2 ? 3 : 2,
                                foundTime: time,
                                parentId: this.$parent.currTreeNode.treeLevel >= 2 ? this.$parent.currTreeNode.id : 0,
                                showType: form.showType || this.$parent.currTreeNode.showType,
                                description: this.description,
                            }
                            
                        }else{
                             let time = !this.foundTime ? null : moment(this.foundTime).format('YYYY-MM-DD')
                            form = {
                                ...form,
                                level:this.info.level,
                                type: this.info.type,
                                foundTime: time,
                                showType: this.info.showType,
                                deptId: this.info.deptId,
                                description: this.description,
                                parentId: this.info.parentId,
                            }
                        }
                        this.$emit('save',form)
                    }
                   
                } else {
                    return false;
                }
            });
        },
        // 处理判断条件
        getCondition(){
            //  新增 选中学校
            //  编辑 选中部门
            let {treeLevel} = this.$parent.currTreeNode
            if((this.type == 'add' && treeLevel == 2) || (this.type == 'edit' && treeLevel == 3)) return false
            else return true
        },
        getLabel(){
            if(this.activeIndex == 0) return '机构'
            if(this.activeIndex == 1) return '集团'
            if(this.activeIndex == 2) return '群'
        }
    }
}
</script>
<style lang="less" scoped>
.addBox{
    height: 100%;
    overflow-y: auto;
    flex: 1;
    .content-head{
        width: 100%;
        font-size: 16px;
        line-height: 50px;
        padding: 0 15px;
        border-bottom: 1px solid #eee;
        color: rgba(0,0,0,.65);
        font-weight: 700;
    }
    .addBox-content{
        padding: 20px;
    }
    .foot{
        text-align: center;
    }
}
.mb10{
    margin-bottom: 10px!important;
}
</style>