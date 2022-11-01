<template>
  <div class="main">
    <div class="wrap">
      <div class="content flex">
          <!-- 2022-1-26 组织机构采用8438的树 -->
          <div class="treeBox flex flex-column">
            <div class="treeBox-head">组织机构</div>
            <div  class="treeBox-content flex flex-column">
              <!-- 搜索 -->
              <div class="search">
                  <a-input-search v-model="searchValue" placeholder="请输入机构名称" enter-button @search="search" />
              </div>
              <div class="tree">
                <!-- 树 -->
                <Tree v-if="!treeLoading && orgTree && orgTree.length > 0" :searchValue="searchValue" :saveInfo="saveInfo" :orgTree="orgTree" @search="search" @add="add" @del="del" :selectInfo="selectInfo"></Tree>
                <a-spin class="loading" v-if="treeLoading"/>
                <Empty tip="暂无数据" v-if="!treeLoading && !orgTree"/>
              </div>
            </div>
          </div>
          <div class="treeContent flex flex-column">
            <!-- 详情 -->
              <div class="treeContent-head">{{title}}</div>
              <div class="treeContent-box">
                 <Add v-if="!addLoading && visible" :type="type" :info="info" @save="save" :typeList="typeList"></Add>
                 <a-spin class="loading" v-if="addLoading"/>
                 <Empty tip="暂无数据" v-if="!addLoading && !visible"/>
              </div>
             
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as API from '@/api/data'
import Empty from "@/components/Empty/Empty"
import Tree from './components/tree.vue'
import Add from './components/add.vue'
export default {
    name: 'Zzjg',
    components: { Empty,Tree,Add},
    data() {
        return {
           orgTree:[],
           treeLoading:false, 
            // 搜索
            searchValue:null,
            // 机构类别 先写死
            typeList:{
              '局机关':1,
              '直属单位':2,
              '幼儿园':3,
              '小学':4,
              '初级中学':5,
              '九年一贯制学校':6,
              '高级中学':7,
              '其他':8
            },
            // 新增编辑
            visible:false,
            type:'',
            info:{},
            title:'',
            currInfo:{},
            addLoading:false,
            saveInfo:null,//添加后展开文件夹选中当前项
            selectInfo:{},
        }
    },
    mounted() {
        this.init()
    },
    methods: {
      init(){
        this.search()
      },
      // 搜索
      search(){
        this.getDeptList()
        this.title = ''
        this.visible =false
      },
      // 获取树 数据
      getDeptList() {
          this.treeLoading = true
          API.getDeptList({
              deptName: this.searchValue
          }).then((res) => {
            this.$nextTick(()=>{
              // 添加教育局 先写死教育局 level 1教育局 2机构类别 3学校 4部门
              let typeData = []
              // 取第一条数据
              let parent_c = _.cloneDeep(res.rows.children)
              let parent = parent_c[0]
              // 移除第一条
              res.rows.children.shift()
              const setData = (data,level) =>{
                  data.forEach(item=>{
                     this.$set(item,'level',level + 1)
                     if(item.children){
                       setData(item.children,level + 1)
                     }
                  })
              }
              // 设置学校 部门层级为34
              setData(res.rows.children,2)
              // 添加机构类别到树
              Object.keys(this.typeList).forEach((item,index)=>{
                let arr = res.rows.children.filter(e=>e.showType == this.typeList[item])
                // 设置机构类型值为key值
                typeData.push({
                  title: item,
                  value: this.typeList[item],
                  type:'1',
                  level:2,
                  key: String(this.typeList[item]),
                  children:arr
                })
              })
              parent = {
                ...parent,
                type:'1',//写死 教育局type 1 学校type 2 区分图标
                level:1,
                key:'0',
                children: typeData
              }
              let data = [parent]
              // 当前操作属于保存后刷新 
              // 取出操作前选中的树节点信息或者新增的树节点信息
              // 选中操作前选中的树节点或者新增的树节点
              // 展开对应的机构类型或学校
              if(this.saveInfo){
                let arr = {}
                const setData = (data,value,saveValue) =>{
                   data.forEach(item=>{
                     if(item[value] == saveValue){
                       arr = item
                     }
                     if(item.children){
                       setData(item.children,value,saveValue)
                     }
                   })
                }
                // 新增学校
                if(this.currInfo.level == 1 && this.type == 'add'){
                  this.selectInfo = res.rows.children.filter(e=>e.title == this.saveInfo.deptName)[0]
                }
                // 新增部门
                if(this.currInfo.level == 3 && this.type == 'add'){
                   setData(res.rows.children,'title',this.saveInfo.deptName)
                   this.selectInfo = arr
                }
                // 编辑学校
                if(this.currInfo.level == 3 && this.type == 'edit'){
                  this.selectInfo = res.rows.children.filter(e=>e.key == this.saveInfo.deptId)[0]
                }
                // 编辑部门
                if(this.currInfo.level == 4 && this.type == 'edit'){
                  setData(res.rows.children,'key',this.saveInfo.deptId)
                  this.selectInfo = arr
                }
                // 删除部门 展开学校 选中学校 查看学校的信息
                if(this.currInfo.level == 4 && this.type == 'del'){
                  this.selectInfo = res.rows.children.filter(e=>e.key == this.saveInfo.parentId)[0]
                }
                // 删除学校 隐藏详情
                 if(this.currInfo.level == 3 && this.type == 'del'){
                  this.visible = false
                  this.title = ''
                }
              }
               // 处理数据
              this.setData(data)
              this.orgTree = [...data]
              // 加载结束
              this.treeLoading = false
              
            })
          }).catch(err=>{
            // 加载结束
              this.treeLoading = false
          })
      },
      setData(data,level){
        data.forEach((r) => {
          var Tree = r
					this.$set(Tree, 'rightClick', false)
					this.$set(Tree, 'scopedSlots', { title: 'cus' })
					this.$set(Tree, 'children', Tree.children?Tree.children:[])
					this.$set(Tree, 'isLeaf', Tree.level == 4)
          this.$set(Tree, 'type', Tree.type || '2')
					if (Tree.children && Tree.children.length > 0) {
						this.setData(Tree.children)
					} 
				})
      },
      // 新增编辑
     async add(data){
        let {type,item} = data
        // 清除数据
        this.initAdd()
        this.type = type
        this.currInfo = item
        if(type != 'add') await this.getDeptById(item.value)
        setTimeout(()=>{
          this.addLoading = false
          this.visible = true
          let deptname = item.level == 1?'学校':'部门'
          this.title = (type == 'add')?'新增'+deptname:(type == 'edit'?'编辑' + item.title:(type=='view'?'查看' + item.title:''))
        },100)

      },
      initAdd(){
        this.visible = false
        this.addLoading = true
        this.type = ''
        this.info = {}
        // 添加后查看当前信息，把保存新增编辑的信息清除
        this.saveInfo = null
        this.selectInfo = {}
      },
      // 删除
      del(data){
        // 学校下存在部门不可删除，先删光部门，再删学校
        if(data.children && data.children.length > 0){
          this.$warning({
              centered: true,
              title: '警告',
              content: '当前学校使用中,不可删除！',
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
            onOk: () => {
                API.delDept(data.value).then((res) => {
                    this.$success({
                        centered: true,
                        title: '成功',
                        content: '删除成功',
                        onOk() {},
                    })
                    this.type = 'del'
                    this.saveInfo = data
                    this.init()

                })
                .catch((err) => {
                    console.log('删除失败')
                })
            },
            onCancel: () => {
                console.log('退出')
            },
        })
      },
      // 查询部门详细信息
      async getDeptById(deptId) {
        let res = await API.getDeptById({deptId})
        if(res.resultCode == 200) {
            this.info = res.value;
        }
      },
      // 保存
      async save(data){
        let api = null
        if(this.type == 'add'){
          // 新增
          api = API.addDept(data)
        }
        if(this.type == 'edit'){
          // 编辑
          data = {
            ...data,
            deptId: this.currInfo.value
          }
          api = API.editDept(data)
        }
        // 新增编辑删除信息
        this.saveInfo = data
        let res = await api
        if(res.resultCode == 200) {
            this.$success({
                centered: true,
                title: '成功',
                content: '保存成功',
                onOk() {},
            })
            this.init()
          }  
      }
    },
}
</script>

<style lang="less" scoped>
  .main{
    padding: 0 15px;
    height: 100%;
    .wrap{
      height: 100%;
      width: 100%;
      position: relative;
      .content{
        margin: 0!important;
        width: 100%;
        position: absolute;
        left: 0;
        top: 15px;
        bottom: 34px;
        right: 0;
        background: #fff;
        border-radius: 2px;
        overflow-y: auto;
        overflow-x: hidden;
        .treeBox-head,
        .treeContent-head{
            width: 100%;
            font-size: 16px;
            line-height: 50px;
            padding: 0 15px;
            border-bottom: 1px solid #eee;
            color: rgba(0,0,0,.65);
            font-weight: 700;
          }
        // 树
        .treeBox{
          width: 30%;
          position: relative;
          border-right: 1px solid #eee;
          
          .treeBox-content{
            flex: 1;
            overflow: hidden;
            position: relative;
            .search{
                  padding: 10px 20px ;
                  /deep/.ant-input-search{
                      padding-right: 46px;
                      input{
                          padding-right: 0;
                          border-radius: 4px 0 0 4px!important;
                          height: 30px;
                      }
                  }
                  /deep/.ant-input-search-button{
                      border-radius: 0 4px 4px 0!important;
                      border: 1px solid #1890ff!important;
                  }
              }
              .tree{
                  flex:1;
                  overflow: hidden;
              }
          }
        }
        .treeContent{
          flex: 1;
          .treeContent-box{
            flex: 1;
            overflow-y: auto;
            position: relative;
          }
        }
      }
    }
  }
  .loading{
    position: absolute;
    left: 50%;
    top: 50%;
  }
</style>
