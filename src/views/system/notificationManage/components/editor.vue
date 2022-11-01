<template>
	<div>
		<quill-editor class="editor ql-editor" ref="myTextEditor" v-model="content" :options="editorOption">
		</quill-editor>
		 <input type="file" @change="change" id="upload" style="display:none;" />
	</div>
</template>
<script>
	import { quillEditor, Quill } from 'vue-quill-editor'
	import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'

	Quill.register('modules/ImageExtend', ImageExtend)

	export default {
        props: {
            uploadParams: {} // 内容图片上传的配置， reqMethod： 上传方法 params： 上传接口参数
        },
		components: {
			quillEditor
		},
		data() {
			return {
				content: null,
				editorOption: {
					modules: {
						ImageExtend: {},
						toolbar: {
							container: [
								["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
								// ["blockquote", "code-block"], // 引用  代码块
								[{
									header: 1
								}, {
									header: 2
								}], // 1、2 级标题
								[{
									list: "ordered"
								}, {
									list: "bullet"
								}], // 有序、无序列表
								[{
									script: "sub"
								}, {
									script: "super"
								}], // 上标/下标
								[{
									indent: "-1"
								}, {
									indent: "+1"
								}], // 缩进
								[{
									'direction': 'rtl'
								}], // 文本方向
								[{
									size: ["small", false, "large", "huge"]
								}], // 字体大小
								[{
									header: [1, 2, 3, 4, 5, 6, false]
								}], // 标题
								[{
									color: []
								}, {
									background: []
								}], // 字体颜色、字体背景颜色
								[{
									font: []
								}], // 字体种类
								[{
									align: []
								}], // 对齐方式
								["clean"], // 清除文本格式
								["image"], // 链接、图片、视频
							],
							handlers: {
								image: function(value) {
									// 劫持原来的图片点击按钮事件
									console.log(value)
									// QuillWatch.emit(this.quill.id);
									if (value) {
										document.querySelector('#upload').click()
									} else {
										this.quill.format('image', false)
									}
								}
							}
						}, //工具菜单栏配置

					},
					placeholder: '请输入内容', //提示
					readyOnly: false, //是否只读
					theme: 'snow', //主题 snow/bubble
					syntax: true, //语法检测
				}
			}
		},
		methods: {
			// 失去焦点
			onEditorBlur(editor) {},
			// 获得焦点
			onEditorFocus(editor) {},
			// 开始
			onEditorReady(editor) {},
			// 值发生变化
			onEditorChange(editor) {
				this.content = editor.html;
			},
			change(e) {
                let file = e.target.files[0]
                const formData = new FormData()
                let params = {
                    ...this.uploadParams.params,
                    file: file
                }
                for(let k in params){
                    formData.append(k, params[k])
                }
                this.uploadParams.reqMethod(formData).then(res => {
                    let quill = this.$refs.myTextEditor.quill
                    if (res.resultCode === 200) {
                        // const formdata = _.extend({}, this.formdata)
                        let length = quill.getSelection().index//光标位置
                        // 插入图片  图片地址
                        quill.insertEmbed(length, 'image', '/api/' +res.value)
                        // 调整光标到最后
                        quill.setSelection(length + 1)//光标后移一位
                    }
                })
			}
		},
		computed: {
			editor() {
				return this.$refs.myTextEditor.quillEditor;
			}
		},
		mounted() {
			// console.log('this is my editor',this.editor);、
		}
	}
</script>

<style lang="less" scoped="scoped">
	.editor {
		line-height: normal !important;
		height: 300px;
		display: flex;
		flex-direction: column;
		padding: 0;
	}

	/deep/.ql-container {
		height: 210px;
	}

	.ql-snow .ql-tooltip[data-mode=link]::before {
		content: "请输入链接地址:";
	}

	.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
		border-right: 0px;
		content: '保存';
		padding-right: 0px;
	}

	.ql-snow .ql-tooltip[data-mode=video]::before {
		content: "请输入视频地址:";
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item::before {
		content: '14px';
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
		content: '10px';
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
		content: '18px';
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
		content: '32px';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item::before {
		content: '文本';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
		content: '标题1';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
		content: '标题2';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
		content: '标题3';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
		content: '标题4';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
		content: '标题5';
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
		content: '标题6';
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item::before {
		content: '标准字体';
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
		content: '衬线字体';
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
		content: '等宽字体';
	}

	/deep/.editor img {
		width: 100%;
	}
</style>
