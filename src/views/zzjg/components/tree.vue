<template>
        <div class="treeList">
            <a-tree :expandedKeys="expandedKeys" :selectedKeys="selectedKeys" showIcon :defaultExpandParent="autoExpand"
                @rightClick="rightClick" @select="onSelect" @expand="onExpand" :treeData="orgTree" ref="tree"
                class="treeStyle">
                <template slot="cus" slot-scope="item">
                    <!-- 图标 -->
                    <span class="tree_folder_icon" :class="getClass(item)"></span>
                    <!-- 搜索标红文字 -->
                    <label v-html="common.KeyRegExp(item.title, searchValue)"></label>
                    <!-- 右键显示 -->
                    <div class="ways" v-if="item.rightClick" @mouseleave="e=>leave(e,item)">
                        <!-- 教育局暂时 -->
                        <div class="ways-item" @click="add('add',item)" v-if="item.level <= 3">添加</div>
                        <div class="ways-item" @click="add('edit',item)" v-if="item.level > 2">编辑</div>
                        <div class="ways-item" @click="del(item)" v-if="item.level > 2">删除</div>
                    </div>
                </template>
            </a-tree>
        </div>
</template>
<script>
export default {
    props:{
        orgTree:{},//数据
        searchValue:{},//搜索内容
        saveInfo:{},// 新增编辑保存的数据
        selectInfo:{},//新增编辑时选中的树节点
    },
    data(){
        return{
            // 树
            expandedKeys:[],
            selectedKeys:[],
            autoExpand:true,
            // 操作前选中的节点信息
            currInfo:{},
        }
    },
    mounted(){
        // 默认展开第一级
         // 默认选中根节点
         this.currInfo = this.$parent.currInfo
        this.type = this.$parent.type
        if(this.orgTree && this.orgTree.length > 0){
            this.expandedKeys = [this.orgTree[0].key]
            // 新增后默认选中当前添加项 展开文件夹 查看当前新增信息
            if(this.saveInfo){
                this.expandedKeys.push(String(this.saveInfo.showType))
                // 新增学校
                // 编辑学校
                // 删除部门
                if((this.currInfo.level == 1 && this.type == 'add') || (this.currInfo.level == 3 && this.type == 'edit') || (this.currInfo.level == 4 && this.type == 'del')){
                   this.selectedKeys = [this.selectInfo.key]
                   this.add('view',this.selectInfo)
                }
                // 新增部门
                 // 编辑部门
                if((this.currInfo.level == 3 && this.type == 'add') || (this.currInfo.level == 4 && this.type == 'edit')){
                    this.selectedKeys = [this.selectInfo.key]
                    this.expandedKeys.push(String(this.selectInfo.parentId))
                    this.add('view',this.selectInfo)
                }
                // 删除部门 展开学校
                if(this.currInfo.level == 4 && this.type == 'del'){
                    this.expandedKeys.push(String(this.saveInfo.parentId))    
                }
               
            }else{
                this.selectedKeys = [this.orgTree[0].key]     
            }
           
        }
    },
    methods:{
        // 右键点击事件------显示添加 编辑 删除
        rightClick(event){
            let {level} = event.node.dataRef
            // 机构类型文件夹不可右键单击
            // 部门下子目录不可编辑
            if(level == 2 || level == 5) return
            event.node.dataRef.rightClick = true
        },
        // 选中事件
        onSelect(keys, event){
            let {level,rightClick,key} = event.node.dataRef
            if(!rightClick) this.selectedKeys = keys
            if(rightClick){
                // 右键选中，如果右键key与当前选中值不一样 赋值
                if(key != this.selectedKeys[0]) this.selectedKeys = keys
            }
            // 教育局选中不进行操作
            if(level == 1) return
            if(level != 2 && !rightClick) this.add('view',event.node.dataRef)

        },
        // 展开
        onExpand(keys, event){
            this.expandedKeys = keys
        },
        // 搜索
        search(){
            this.$emit('search', this.searchValue)
        },
        // 返回节点对应的图标class
        getClass(item){
            return item.type == '1'?'edu':'school'
        },
        // 鼠标离开增删改
        leave(e,data) {
            // 鼠标离开增删改，隐藏
            data.rightClick = false
            data = {...data}
        },
        // 新增树节点
        add(type,item){
            this.$emit('add',{type,item})
        },
        // 删除树节点
        del(item){
            this.$emit('del',item)
        }
    }
}
</script>
<style lang="less" scoped>
    
    .treeList{
        width: 100%;
        height: 100%;
        padding: 0 20px;
        overflow-y: auto;
        .treeStyle{
            overflow-x:hidden;
            height:100%;
            .tree_folder_icon{
                width: 14px;
                height: 14px;
                display: inline-block;
            }
            .edu{
                background: url('../../../assets/jyj.png') center center no-repeat;
		        background-size: 100%;
            }
            .school{
                background: url('../../../assets/xx.png') center center no-repeat;
		        background-size: 100%;
            }
            /deep/.ant-tree-node-content-wrapper-close .ant-tree-title,
            /deep/.ant-tree-node-content-wrapper-open .ant-tree-title {
                margin-left: 0;
            }
            /deep/.ant-tree{
                color: rgba(0, 0, 0, 0.65);
            }
            /deep/li .ant-tree-title {
                position: relative;
                padding: 0;
                display: flex;
                align-items: center;
            }

            /deep/.ant-tree li .ant-tree-node-content-wrapper {
                padding: 0;
            }

            .tree_folder_icon {
                color: #ffc600;
                margin-right: 5px;
            }

            .ways {
                position: absolute;
                // right: -110px;
                left: 0;
                background: #fffffffa;
                z-index: 9;
                border-radius: 4px;
                border: 1px solid #eee;
                font-size: 14px;
                line-height: 35px;
                width: 100px;
                text-align: center;
                top: 25px;
            }

            .ways .ways-item {
                border-bottom: 1px solid #F5F5F5;
                color: rgba(0, 0, 0, 0.65)!important;
            }

            .ways .ways-item:last-child {
                border-bottom: 0;
            }

            .ways .ways-item:hover {
                // background: #1890ff;
                background: #168dff;
                color: #fff!important;
            }
            /deep/.ant-tree-iconEle{
                display: none;
            }
            /deep/.ant-tree li .ant-tree-node-content-wrapper{
                padding: 0;
            }
            /deep/.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected,
           /deep/.ant-tree li .ant-tree-node-content-wrapper:hover {
            background-color: #319cff !important;
            color: #fff !important;

            }
        }   
    }
</style>