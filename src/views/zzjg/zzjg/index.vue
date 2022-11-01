<template>
    <div class="zzjg">
        <div class="zzjgBox flex">
            <div class="treeBox flex flex_column">
                <div class="treeBox-title">组织机构</div>
                <div class="searchBox flex flex_column">
                    <!-- 机构管理员不需要搜索 -->
                <a-input-search placeholder="请输入机构名称" v-model="searchValue" enter-button @search="search"/>
                <tree ref="tree" class="treelist" v-if="!loading && orgTree && orgTree.length > 0"  :activeIndex="activeIndex" :orgTree="orgTree" :searchValue="searchValue" @del="del" @add="add" @onExpand="onExpand" :initNode="initNode" @rightClick="rightClick" @onSelect="onSelect"></tree>
                <a-spin class="loading" v-if="loading"/>
                <Empty tip="暂无数据" v-if="!loading && orgTree.length == 0"/>
                </div>
            </div>
            <div class="content flex flex_column">
                
                <!-- 新增 编辑 -->
                <add ref="add" v-if="type != 'view' && !content_loading && visible" :schoolList="schoolList" :activeIndex="activeIndex" :type="type" :info="info" :typeList="types" :userList="userList" @save="save"></add>
                <!-- 查看 -->
                <views v-else-if="type == 'view' && !content_loading && visible" :schoolList="schoolList" :activeIndex="activeIndex" :type="type" :info="info" :typeList="types"></views>
                <a-spin class="loading" v-if="content_loading"/>
                <Empty tip="暂无数据" v-if="!content_loading && !visible"/>
            </div>
        </div>
    </div>
</template>
<script>
import tree from './components/tree.vue'
import {
    // 组织
    getDeptList, getOrganizationTypeList,getDeptById,addDept,editDept,getUserListAll,getChildDept,delDept,
} from '@/api/data.js'
import Empty from "@/components/Empty/Empty"
import add from './components/add.vue'
import views from './components/view.vue'
export default {
    components:{
        tree, 
        Empty,
        views,
        add
    },
    data(){
        return{
            activeIndex:0,
            // 树
            searchValue:null,
            orgTree:[],
            loading:false,
            // 内容
            content_loading:false,
            visible:false,
            // 机构类别
            types:[],
            type:'',
            info:{},
            userList:[],
            
            currTreeNode:{},
            initNode:null,
            schoolList:[],
            expandedData:[],
            // orgTree 备份
            treeList:[]
        }
    },
    async mounted(){
        
        this.search()
    },
    methods:{
        // 切换type
        changeType(item, index){
            this.activeIndex = index
            // 清除树操作数据
            if(this.$refs.tree) this.$refs.tree.init()
            this.orgTree = []
            this.searchValue = null
            // 清除表单数据
            this.initAdd()
            this.search()
        },
        async search(){
            // 机构
            if(this.activeIndex == 0){
                // 获取机构类别列表
                await this.getOrganizationTypeList()
                await this.getList()
            }
            
        },
        /**
         * --------------机构---------------
         * 
         * 
         */
        // 获取机构 树
        async getList(){
            this.loading = true
            let res = await getDeptList({
                deptName: this.searchValue,
            })
            this.loading = false
            // 取第一条数据作为根节点
            if(res.rows.children){
                // 机构 treeLevel 层级 0 教育局 1 机构类别 2 学校 3部门
                // 集团 treeLevel 层级 0 教育局 1 集团 2 学校
                res.rows.children = res.rows.children.map(item=>{
                    let treeLevel = 0
                    if(item.id == '1') treeLevel = 0
                    else treeLevel = 2
                    return{
                        ...item,
                        treeLevel,
                        children:[]
                    }
                })
                // // 超级管理员 教育局登录
                let data = []
                let new_data = _.cloneDeep(res.rows.children)
                
                if(!this.searchValue){
                    // orgtree 备份 
                    this.treeList = _.cloneDeep(res.rows.children)
                    // 移除第一个
                    new_data.shift()
                 }
                let parent  = res.rows.children.filter(item=>item.id == '1')
                // 搜索返回的数据不带根节点
                if(parent&&parent.length > 0){
                    data = parent.map(item=>{
                        return{
                            ...item,
                            type:1,
                        }
                    })
                }else{
                    // 搜索时取根节点 orgtree 备份
                    let dept = this.treeList.filter(item=>item.id == '1')
                    if(dept && dept.length > 0){
                        data.push({
                            title: dept[0].title,
                            id: dept[0].id,
                            type:1,
                            treeLevel:0,
                            children:[]
                        })
                    }
                }    
                // 机构类别拼到树上
                this.types.forEach(item=>{
                    let typeData = new_data.filter(e=>e.showType == item.id)
                    typeData = typeData.map((item)=>{
                        return{
                            ...item,
                            parentId: data[0].id
                        }
                    })
                    data[0].children.push({
                        id: item.id,
                        title: item.name +'('+ (typeData ? typeData.length : 0) +')',
                        treeLevel:1,
                        name:'jglx',
                        type:1,//暂时先写type==1，图标用教育局
                        showType: item.id,
                        children: typeData
                    })
                })
                
                this.orgTree = data
               
                this.$nextTick(() =>{
                    if(this.orgTree.length > 0){
                        this.setData(this.orgTree)
                        
                    }
                    
                })
            } 
        },
        // 获取机构  机构类别
        async getOrganizationTypeList(){
            let res = await getOrganizationTypeList()
            this.types = res.value
        },      
        // 机构 集团 群 删除
        async del(data){
            // 学校下存在部门不可删除，先删光部门，再删学校
            if(data.children && data.children.length > 0){
                this.$warning({
                    centered: true,
                    title: '警告',
                    content: '当前机构使用中,不可删除！',
                    onOk() {},
                })
                return
            }
            this.$confirm({
                centered: true,
                title: '确认提示',
                content: '确认删除该组织机构吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: async() => {
                    let api = null
                    if(this.activeIndex == 0) api = delDept(data.id)
                    
                    let res = await api
                    this.$success({
                        centered: true,
                        title: '成功',
                        content: '删除成功',
                        onOk() {},
                    })
                    this.search()
                },
                onCancel: () => {
                    console.log('退出')
                },
            })
        },
        // 机构 获取详情
        async getInfo(deptId) {
            let res = await getDeptById({deptId})
            this.info = res.value
        },
        // 机构 保存组织机构
        async save(data){
            let api = null
            if(this.type == 'add'){
                api = addDept({...data})
            }else{
                api = editDept({...data})
            }
            let res = await api
            // if(res.resultCode == 200){
                this.$message.success('保存成功! ');
                // 清除表单数据
                this.initAdd()
                this.search()
            // }
        },       
        // 机构 取学校下的子部门
        async getChildDept(deptId,data){
            let res = await getChildDept({deptId})	
            if(res.value.length > 0){
                res.value =  res.value.map((item)=>{
                    return{
                        ...item,
                        treeLevel:3,
                        title: item.deptName,
                        id: item.deptId
                    }
                })
                this.setData(res.value)
                this.$set(data,'children',res.value)
            }
        },




        // 机构 集团 群 添加编辑查看
        async add(data){
            let {type,item} = data
            this.content_loading = true
            this.initAdd()
            this.type = type
            this.currTreeNode = item
            if(type != 'add'){
                if(this.activeIndex == 0){
                    await this.getInfo(item.value)
                }else{
                    // 集团  教育局点击查看数据
                    if((type == 'view' && item.treeLevel == 0)) await this.getInfo(item.value)
                    
                }
                // await this.getUserListAll(item.parentId)
            }
            else{
                // await this.getUserListAll(item.id)
                this.info = item
            }
            setTimeout(()=>{
                this.content_loading = false
                this.visible = true
            },100)    
        },
        // 机构 添加后查看当前信息，把保存新增编辑的信息清除
        initAdd(){
            this.visible = false
            this.type = ''
            this.info = {}
            if(this.$refs.add) this.$refs.add.init()

        },
        // 机构 获取负责人列表
        async getUserListAll(unitDeptId){
            // 集团 学校 教育局 新增传当前deptId
			 // 编辑 存在父id 传值就用parentId 父id == 0 就传当前deptId
            let res = await getUserListAll({unitDeptId})
            this.userList = res.value || []
        },
        setData(data){
            data.forEach((r) => {
                var Tree = r
                this.$set(Tree, 'rightClick', false)
                this.$set(Tree, 'value', Tree.id)
                this.$set(Tree, 'scopedSlots', {title: 'cus'})
                this.$set(Tree, 'children', Tree.children?Tree.children:[])
                // 机构 treeLevel 层级 0 教育局 1 机构类别 2 学校 3部门
                // 集团 treeLevel 层级 0 教育局 1 集团 2 学校
                if(this.activeIndex == 0){
                    this.$set(Tree, 'isLeaf', Tree.treeLevel == 3 || Tree.level == 2)
                    this.$set(Tree, 'key', Tree.treeLevel + '&' + Tree.id)
                    this.$set(Tree, 'title', Tree.title)
                }
               
                if (Tree.children && Tree.children.length > 0) {
                    this.setData(Tree.children)
                }
            })
        },
        // 树节点展开
        async onExpand(data){
            let dataRef = data.node.dataRef
            if(this.activeIndex == 0){
                if(data.expanded && dataRef.treeLevel == 2) this.getChildDept(dataRef.id, dataRef)
            }
            
            
        },
        // 树节点选中
        onSelect(data){
            if(this.activeIndex == 0){
                if(data.treeLevel != 1 && !data.rightClick ){
                    this.$refs.tree.add('view',data)    
                }
            }
           
        },
        // 树节点右键点击
        rightClick(data){
            // 机构
            if(this.activeIndex == 0){
                // 机构类型文件夹不可右键单击
                if(data.treeLevel == 1) return
                
            }
            
            
            data.rightClick = true
        }
    }
}
</script>
<style lang="less" scoped>
    .zzjg{
        width: 100%;
        height:100%;
        position: relative;
    }
    .zzjgBox{
        position: absolute;
        background: #FFF;
        overflow: hidden;
        top: 15px;
        bottom: 35px;
        left: 15px;
        right: 15px;
        border-radius: 10px;
        // box-shadow: 0 0 10px rgba(0,0,0,0.2);
        .treeBox{
            width: 25%;
            height: 100%;
            border-right: 1px solid #eee;
            .treeBox-title{
                width: 100%;
                font-size: 16px;
                line-height: 50px;
                padding: 0 15px;
                border-bottom: 1px solid #eee;
                color: rgba(0, 0, 0, 0.65);
                font-weight: 700;
            }
            .typeBox{
                padding: 10px 15px 0 15px;
                overflow: hidden;
                .typeBox-item{
                   float: left;
                    margin: 5px;
                    background: #eee;
                    padding: 0 10px;
                    border-radius: 20px;
                    line-height: 30px;
                    cursor: pointer;
                    &.active{
                        background: #168dff;
                        color: #fff;
                    }
                }
            }
            .searchBox{
                padding: 10px 15px;
                flex:1;
                position: relative;
                overflow: hidden;
                .treelist{
                     flex:1;
                }
            }
        }
        .content{
            flex: 1;
            height: 100%;
            position: relative;
            margin: 0!important;
        }
    }
    .loading{
        position: absolute;
        left: 50%;
        top: 50%;
    }
</style>