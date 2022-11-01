<template>
    <div class="addBox flex flex-column">
        <div class="addBox-head">{{title}}</div>
        <div class="addBox-content">
            <a-form :form="form" class="commForm" ref="form">
                <a-form-item label='文档名称' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <a-input  placeholder="请输入标题" :maxLength="100" v-decorator="['title',{rules: [{ required: true, message: '请输入标题'}]}]" />
                </a-form-item>
                <a-form-item label='文档分类' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <div class="flex">
                    <a-select v-decorator="['firstId',{rules: [{ required: true, message: '请选择一级分类！' }]}]" placeholder="请选择一级分类" @change="firstChange">
                        <a-select-option v-for="(item,index) in first" :key="index" :value="item.id">{{item.name}}</a-select-option>
                    </a-select>
                    <a-select style="margin-left:10px!important" v-decorator="['typeId',{rules: [{ required: true, message: '请选择二级分类！' }]}]" placeholder="请选择二级分类">
                        <a-select-option v-for="(item,index) in second" :key="index" :value="item.id">{{item.name}}</a-select-option>
                    </a-select>
                </div>
                </a-form-item>
                
                <a-form-item label='内容' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                    <mavon-editor
                        v-model="content"
                        ref="md"
                        :toolbars="markdownOption"
                        @imgAdd="$imgAdd"
                        style="min-height: 600px"
                    />
                </a-form-item>
                <a-form-item label='状态' style="margin-bottom:10px" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <a-radio-group v-decorator="['status',{initialValue:1}]">
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
		<div class="addBox-foot flex alignCenter justifyCenter">
		    <a-button class="dialogClose" @click="exit">关闭</a-button>
		    <a-button class="dialogConfirm" type="primary" @click="save">保存</a-button>
		</div>
	</div>
</template>
<script>
import { fileUpload,getDocTypeList } from '@/api/documentCenter.js'
// import editormd from './editorMd.vue'
export default {
    props:{
        info:{},
        type:{}
    },
    // components:{editormd},
    data(){
        return{
            title:null,
            form: this.$form.createForm(this),
            filename:null,
            first:[],
            second:[],
            content:null,
            markdownOption:{
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: true, // 标记
                superscript: true, // 上角标
                subscript: true, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: false, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: false, // 沉浸式阅读
                htmlcode: false, // 展示html源码
                help: false, // 帮助
                /* 1.3.5 */
                undo: false, // 上一步
                redo: false, // 下一步
                trash: true, // 清空
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                /* 2.2.1 */
                subfield: true, // 单双栏模式
                preview: false, // 预览
            }
        }
    },
    
    async mounted(){
         this.title = this.type == 'add'?'添加文档':'编辑文档'
        // 获取一级分类
        await this.getDocTypeList(0,1)
        if(this.type == 'edit'){
            await this.getDocTypeList(this.info.firstId,2,this.info.typeId)
            this.$nextTick(()=>{
                this.form.setFieldsValue({
                    title:this.info.title,
                    firstId:this.info.firstId,
                    typeId: this.info.typeId,
                    status:this.info.status,
                })
                this.filename = this.info.fileName
                this.file = this.info.filePath
                this.content = this.info.content
            })
        }
    },
    methods:{
        init(){
            this.form.resetFields()
            this.file = null
            this.filename = ''
            this.content = null
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
                        content: this.content,
                        id: this.type == 'edit' ? this.info.id : null
                    }
                    this.$emit('save',data)
                }
            })

        },
        // 一级分类切换
        firstChange(e){
            this.form.setFieldsValue({
                typeId:undefined
            })
            this.getDocTypeList(e,2)
        },
        // 获取一级二级分类
        async getDocTypeList(parentId,type,secondId){
            let res = await getDocTypeList({parentId,secondId})
            if(type == 1) this.first = res.value
            else this.second = res.value
        },
        // 上传附件
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
        // 文档上传图片
        async $imgAdd(pos, file) {
            var formdata = new FormData();
            formdata.append("file", file);
            //将下面上传接口替换为你自己的服务器接口
            console.log(file,1)
            console.log(this.$refs,2)
            await fileUpload(formdata).then(async res => {
                // 返回的地址含\，被转义图片显示不了
                let _res = res.value.replace(/\\/g,"/");
                // 获取http
                let protocol = window.location.protocol
                // 取当前host
                let host = window.location.host
                // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                this.$refs.md.$img2Url(pos, protocol+'//'+host + '/api/'+_res);
            })
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
    .addBox{
        height: 100%;
        .addBox-head{
            font-size: 16px;
            height: 50px;
            line-height: 50px;
            padding: 0 15px;
            border-bottom: 1px solid #e8e8e8;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
        }
        .addBox-foot{
            height: 60px;
            border-top: 1px solid #e8e8e8;
        }
        .addBox-content{
            flex:1;
            padding: 15px 0;
            overflow-y: auto;
        }
    }
</style>