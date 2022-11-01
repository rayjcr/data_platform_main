<template>
        <div class="treeList">
            <a-tree :expandedKeys="expandedKeys" :selectedKeys="selectedKeys" showIcon :defaultExpandParent="autoExpand" @select="onSelect" @expand="onExpand" :treeData="orgTree" ref="tree"
                class="treeStyle">
                <template slot="cus" slot-scope="item">
                    <!-- 图标 -->
                    <span class="tree_folder_icon" :class="getClass(item)"></span>
                    <!-- 搜索标红文字 -->
                    <label v-html="common.KeyRegExp(item.title, searchValue)"></label>
                </template>
            </a-tree>
        </div>
</template>
<script>
export default {
    props:{
        orgTree:{},//数据
        searchValue:{},//搜索内容
        initNode:{},//初始化节点 展开那个节点 选中哪个节点
        activeIndex:{},//0 组织 1 集团 2 发展群
    },
    data(){
        return{
            // 树
            expandedKeys:[],
            selectedKeys:[],
            autoExpand:true,
        }
    },
    mounted(){
        // 默认展开第一级
        // 默认选中根节点
        this.$nextTick(()=>{
            if(!this.initNode) this.initKey(this.orgTree[0])
            else this.initKey(this.initNode)
        })
        
    },
    methods:{
        init(){
            this.selectedKeys = []
            this.expandedKeys = []
        },
        initKey(initNode){
            this.selectedKeys.push(initNode.key)
            this.expandedKeys.push(initNode.key)
            this.add('view',initNode)
        },
        // 右键点击事件------显示添加 编辑 删除
        rightClick(event){
            this.$emit('rightClick',event.node.dataRef)
        },
        // 选中事件
        onSelect(keys, event){
            let {treeLevel,rightClick,key} = event.node.dataRef
            if(!rightClick) this.selectedKeys = keys
            if(rightClick){
                // 右键选中，如果右键key与当前选中值不一样 赋值
                if(key != this.selectedKeys[0]) this.selectedKeys = keys
            }
            this.$emit('onSelect',event.node.dataRef)
            

        },
        // 展开
        onExpand(keys, event){
            this.expandedKeys = keys
            // 展开学校去取部门
            this.$emit('onExpand', event)
        },
        // 返回节点对应的图标class
        getClass(item){
            return item.type == 1?'edu':'school'
        },
          // 鼠标离开增删改，隐藏
        leave(e,data) {
            console.log(data,1)
            data.rightClick = false
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
        // padding: 0 20px;
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
                background: url('../../../../assets/jyj.png') center center no-repeat;
		        background-size: 100%;
            }
            .school{
                background: url('../../../../assets/xx.png') center center no-repeat;
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