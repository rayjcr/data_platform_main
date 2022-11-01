<template>
    <div class="viewBox">
        <div class="content-head">{{title}}</div>
        <div class="viewBox-content" v-if="info">
            <div class="viewBox-item">
                <label class="viewBox-item-title">{{getLabel()}}编号 : </label>
                <label class="viewBox-item-value">{{info.code}}</label>
            </div>
            <template v-if="getIndexCondition()">
                <div class="viewBox-item" v-if="getCondition()">
                    <label class="viewBox-item-title">机构统信码 : </label>
                    <label class="viewBox-item-value">{{info.letters}}</label>
                </div>
                <div class="viewBox-item">
                    <label class="viewBox-item-title">机构简称 : </label>
                    <label class="viewBox-item-value">{{info.abbreviation}}</label>
                </div>
             </template>
            <div class="viewBox-item">
                <label class="viewBox-item-title">{{getLabel()}}名称 : </label>
                <label class="viewBox-item-value">{{info.deptName || info.name}}</label>
            </div>
            <div v-if="getIndexCondition()" class="organBox">
                <div class="viewBox-item w66">
                    <label class="viewBox-item-title">机构类别 : </label>
                    <label class="viewBox-item-value">{{ getTypeValue()}}</label>
                </div>
                <div class="viewBox-item w33"  v-if="getCondition()">
                    <label class="viewBox-item-title">成立时间 : </label>
                    <label class="viewBox-item-value">{{info.foundTime ? info.foundTime.substring(0,10) : ''}}</label>
                </div>
             </div>
            <div class="organBox">
                <div class="viewBox-item w66">
                    <label class="viewBox-item-title">负责人 : </label>
                    <label class="viewBox-item-value">{{info.administratorName || info.administrator}}</label>
                </div>
                <div class="viewBox-item w33">
                    <label class="viewBox-item-title">联系电话 : </label>
                    <label class="viewBox-item-value">{{info.phone}}</label>
                </div>
            </div>
            <template v-if="getIndexCondition()">
                <div class="organBox">
                    <div class="viewBox-item w33">
                        <label class="viewBox-item-title">邮编 : </label>
                        <label class="viewBox-item-value">{{info.postcode}}</label>
                    </div>
                    <div class="viewBox-item w33">
                        <label class="viewBox-item-title">邮箱 : </label>
                        <label class="viewBox-item-value">{{info.email}}</label>
                    </div>
                    <div class="viewBox-item w33"  v-if="getCondition()">
                        <label class="viewBox-item-title">机构状态 : </label>
                        <label class="viewBox-item-value">{{getStatus()}}</label>
                    </div>
                </div>
                <div class="viewBox-item flex w100">
                    <label class="viewBox-item-title">地址 : </label>
                    <label class="viewBox-item-value">{{info.address}}</label>
                </div>
             </template>
            <template v-if="getSchoolShow()">
                <div class="viewBox-item flex">
                    <label class="viewBox-item-title">{{getLabel()}}学校 : </label>
                    <label class="viewBox-item-value">
                        <span class="school-item" v-for="(item,index) in  info.list"  :key="index">{{item.deptName}}</span>
                    </label>
                </div>
            </template>
            <div class="viewBox-item flex align_baseline"  v-if="getCondition()">
                <label class="viewBox-item-title">{{getLabel()}}简介 : </label>
                <label class="viewBox-item-value">{{info.description}}</label>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props :{
        type :{},
        info :{},
        typeList :{},
        activeIndex :{},//0 组织 1 集团 2 发展群
        schoolList :{},//学校列表
    },
    data(){
        return{
            title :''
        }
    },
    mounted(){
        // 回显数据
         // treeLevel 层级 0 教育局 1 机构类别 2 学校 3部门
         this.$nextTick(()=>{
             let deptname = this.$parent.currTreeNode.treeLevel == 0?'组织机构' :'部门'
            this.title = (this.type == 'add')?'新增'+deptname :(this.type == 'edit'?'编辑' + this.$parent.currTreeNode.title :(this.type=='view'?'查看' + this.$parent.currTreeNode.title :''))
        
         })
    },
    methods :{
        // 处理判断条件
        getCondition(){
            //  查看 选中部门
            let {treeLevel} = this.$parent.currTreeNode
            if(this.type == 'view' && treeLevel == 3) return false
            else return true
        },
        getStatus(){
            let status = ''
            if(this.info.status == 1) status = '在用'
            if(this.info.status == 2) status = '在建'
            if(this.info.status == 3) status = '规划'
            if(this.info.status == 4) status = '停用'
            return status
        },
        getLabel(){
            let treeLevel = this.$parent.currTreeNode.treeLevel
            if(this.activeIndex == 0 || (this.activeIndex == 1 && treeLevel == 0) || (this.activeIndex == 2 && treeLevel == 0) || (this.activeIndex == 1 && treeLevel == 2) || (this.activeIndex == 2 && treeLevel == 2)) return '机构'
            if(this.activeIndex == 1 && treeLevel != 0) return '集团'
            if(this.activeIndex == 2) return '群'
        },
        // 判断条件
        getIndexCondition(){
            let treeLevel = this.$parent.currTreeNode.treeLevel
             if(this.activeIndex == 0 || (this.activeIndex == 1 && treeLevel == 0) || (this.activeIndex == 2 && treeLevel == 0) || (this.activeIndex == 1 && treeLevel == 2) || (this.activeIndex == 2 && treeLevel == 2)) return true
             else return false
        },
        // 获取机构类别中文名
        getTypeValue(){
            let curr = this.typeList.filter(item=>item.id == this.info.showType)
            if(curr && curr.length > 0) return curr[0].name
        },
        getSchoolShow(){
            let treeLevel = this.$parent.currTreeNode.treeLevel
            if((this.activeIndex == 1 || this.activeIndex == 2)&& treeLevel == 1) return true
        }
    }
}
</script>
<style lang="less" scoped>
    .viewBox{
        height : 100%;
        overflow-y : auto;
        .content-head{
            width : 100%;
            font-size : 16px;
            line-height : 50px;
            padding : 0 15px;
            border-bottom : 1px solid #eee;
            color : rgba(0,0,0,.65);
            font-weight : 700;
        }
        .viewBox-content{
            padding : 20px;
            .viewBox-item{
                display: flex;
                margin-bottom : 10px;
                .viewBox-item-title{
                    line-height: 39.9999px;
                    white-space: nowrap;
                    text-align: right;
                    font-size: 16px;
                    color: #747e93;
                    width: 100px;
                }
                .viewBox-item-value{
                    line-height: 1.5;
                    background-color: #fff;
                    background-image: none;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    min-height: 40px;
                    padding: 6px 11px;
                    font-size: 16px;
                    width: 100%;
                    display: block;
                    flex: 1;
                    color: rgba(0, 0, 0, 0.65);
                    margin-left: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    .school-item{
                        float: left;
                        max-width: 99%;
                        margin-right: 4px;
                        padding: 0 20px 0 10px;
                        overflow: hidden;
                        color: rgba(0, 0, 0, 0.65);
                        background-color: #fafafa;
                        border: 1px solid #e8e8e8;
                        border-radius: 2px;
                        cursor: default;
                        height: 32px;
                        line-height: 32px;
                        margin-top: 3px;
                    }
                }
                &.school{
                    .viewBox-item-value{
                        word-break: break-all;
                        overflow: inherit;
                        text-overflow: inherit;
                        white-space: inherit;
                        padding: 3px 5px;
                    }
                }
                .xxjj{
                    word-break: break-all;
                    overflow: inherit;
                    text-overflow: inherit;
                    white-space: inherit;
                }
            }
            .organBox{
                display: flex;
                .w66{
                    width: 66.6%;
                }
                .w33{
                    width: 33.3%;
                }
                .w100{
                    width: 100%;
                }
            }
        }
        
    }
</style>