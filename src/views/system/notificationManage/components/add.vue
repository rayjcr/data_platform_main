<template>
    <div class="noticeBox flex flex-column">
        <div class="noticeBox-head">{{title}}</div>
        <div class="noticeBox-content">
            <a-form :form="form" class="commForm" ref="form">
                <a-form-item label='标题' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-input size='large' placeholder="请输入标题" :maxLength="50" v-decorator="['title',{rules: [{ required: true, message: '请输入标题'}]}]" />
                </a-form-item>
                <a-form-item label='概要' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <a-textarea class="ant-textarea-lg" placeholder="请输入概要" :rows="3" v-decorator="['shortContent']" />
                </a-form-item>
                <!-- <a-form-item label='类型' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" >
                <a-select size='large' placeholder="请选择类型"  v-decorator="['type',{initialValue:0}]">
                    <a-select-option :value="1">置顶</a-select-option>
                    <a-select-option :value="0">普通</a-select-option>
                </a-select>
                </a-form-item> -->
                <a-form-item label='内容' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <editor ref="editor" :uploadParams="uploadParams"></editor>
                </a-form-item>
                <a-form-item label='状态' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <a-radio-group size='large' v-decorator="['status',{initialValue:1}]">
                    <a-radio :value="1" class="font_size_16">发布</a-radio>
                    <a-radio :value="0" class="font_size_16">未发布</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label='附件' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" >
                    <button type="primary" class="btn-change btn-head dialogConfirm">
                        <label>上传附件</label>
                        <input type="file" ref="file" name="file" id="file" @change="fileChange($event)" accept="application/msword,application/pdf,.wps,.zip,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel," />
                    </button>
                    <label class="fjwz">{{filename?filename:''}}</label>
                </a-form-item>
            </a-form>
        </div>
		<div class="noticeBox-foot flex alignCenter justifyCenter">
		    <a-button class="dialogClose" @click="exit">关闭</a-button>
		    <a-button class="dialogConfirm" type="primary" @click="save">保存</a-button>
		</div>
	</div>
</template>
<script>
import editor from './editor.vue'
import { fileUpload } from '@/api/notification.js'
export default {
    components:{
        editor
    },
    props:{
        info:{},
        type:{}
    },
    data(){
        return{
            title:null,
            form: this.$form.createForm(this),
            uploadParams:null,
            filename:null,
            uploadParams: {
                reqMethod: fileUpload,
                params: {
                    file: ''
                }
            }
        }
    },
    mounted(){
        this.title = this.type == 'add'?'添加通知公告':'编辑通知公告'
        if(this.type == 'edit'){
            this.$nextTick(()=>{
                let ids = this.info.shareDeptId?this.info.shareDeptId.split(','):[]
                this.form.setFieldsValue({
                    title:this.info.title,
                    shortContent:this.info.shortContent,
                    type:this.info.type,
                    status:this.info.status,
                })
                this.filename = this.info.fileName
                this.file = this.info.filePath
                this.$refs.editor.content = this.info.content
            })
        }
    },
    methods:{
        init(){
            this.$refs.editor.content = ''
            if(this.$refs.file) this.$refs.file.value = ''
            this.form.resetFields()
            this.file = null
            this.filename = ''
        },
        exit(){
            this.$emit('exit')
            this.init()
        },
        save(){
            this.form.validateFieldsAndScroll(async err => {
                if (!err) {
                    let data = this.form.getFieldsValue()
                    data = {
                        ...data,
                        filePath: this.file,
                        fileName: this.filename,
                        content: this.$refs.editor.content,
                        id: this.type == 'edit' ? this.info.id : null
                    }
                    this.$emit('save',data)
                }
            })

        },
        // 上传头像
        async fileChange(e) {
            let file = e.target.files[0]
            let name = e.target.files[0].name.split('.')
            if(['zip','xls','xlsx','doc','pdf','docx'].indexOf(name[name.length - 1]) == -1){
                this.$info({
                    centered: true,
                    title: '提示',
                    content: '当前选择文件不支持，请重新选择!',
                    onOk() {}
                })
                file = null
                this.$refs.file.value = ''
            }else{
                this.filename = e.target.files[0].name
                let data = new FormData()
                data.append('file', file)
                await fileUpload(data).then(async res => {
                    this.file = res.value
                    this.$refs.file.value = ''
                })
            }
        },
    },
}
</script>
<style lang="less" scoped>
    .btn-head {
		background: #fff;
		color: #fff;
		border: 1px solid #ebeef2;
		margin-left: 0;
		position: relative;
		width: 90px;
        height: 35px;
        line-height: 30px;
        border-radius: 4px;
	}
	#file {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 100;
		outline: 0;
		border-radius: 15px;
		cursor: pointer;
		opacity: 0;
	}
	.fjwz{
		display: block;
		margin: 10px 0;
	}
	.dialogConfirm{
		background: #168dff !important;
	}
    .noticeBox{
        height: 100%;
        .noticeBox-head{
            font-size: 16px;
            height: 50px;
            line-height: 50px;
            padding: 0 15px;
            border-bottom: 1px solid #e8e8e8;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
        }
        .noticeBox-foot{
            height: 60px;
            border-top: 1px solid #e8e8e8;
        }
        .noticeBox-content{
            flex:1;
            padding: 15px 0;
            overflow-y: auto;
        }
    }
    /deep/.editor{
        height: 600px;
        .ql-editor{
            overflow: hidden;
        }
        .ql-container{
            height: 530px;
            .ql-editor{
                overflow-y: auto;
            }
        }
        
    }
</style>