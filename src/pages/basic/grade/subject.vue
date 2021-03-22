<template>
    <a-card>
        <div class="operator">
            <a-button @click="addNew" type="primary">新建</a-button>
            <a-button @click="backGrade" type="success" style="margin-left: 20px">返回</a-button>
        </div>
        <a-table
                :rowKey="'subChildId'"
                :columns="columns"
                :dataSource="dataSource">
          <span slot="operation" slot-scope="text, record">
              <a-popconfirm v-if="dataSource.length"
                            title="确认删除?"
                            cancelText="取消"
                            okText="确定"
                            @confirm="() => deleteItem(record.subChildId)">删除
              </a-popconfirm>
          </span>
        </a-table>
        <a-modal title="新增课程"
                 :visible='showSubject'
                 :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <a-form-model :model="form" :rules="rules":label-col="{span:5}" :wrapper-col="{span:12}">
                <a-form-model-item label='课程名' prop="addsub" ref="addsub">
                    <a-tree-select v-model="form.addSub"
                                   placeholder="请选择课程"
                                   style="width: 275px"
                                   :checkedKeys="checkedKeys"
                                   :tree-data="treeData"
                                   checkStrictly="true"
                                   tree-checkable
                                   :show-checked-strategy="SHOW_PARENT">
                    </a-tree-select>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </a-card>
</template>

<script>
    import { TreeSelect } from 'ant-design-vue';
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const columns = [
        {
            title: "课程编号",
            dataIndex: "subChildId",
            align:"center",
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title: "课程名称",
            dataIndex: "name",
            align:"center",
        },
        {
            title: "操作",
            dataIndex: "text,value",
            align:"center",
            scopedSlots: { customRender: "operation" },
        },
    ];
    export default {
        data() {
            return {
                columns,
                loading:false,
                showSubject:false,
                treeData:[],
                SHOW_PARENT,
                dataSource: [],
                treeExpandedKeys: [],
                checkedKeys:[],
                subject:[],
                allSubjectId:[],
                form:{
                },
                rules:{
                    addSub:[
                        {
                            required:true,
                            message:"请输入要加入的课程名称！",
                            trigger:"blur"
                        }
                    ]
                },
            };
        },
        async created(){
            this.gainBaseInfo();
            this.courseInfo();
        }  ,
        methods: {
            //获取课程基本信息
            async gainBaseInfo(){
                let querystring=(window.location.hash ||" ").split('?')[1]
                let id=(querystring || " ").split('=')[1];
                if(id){
                    let {data:{result,success}}=await this.$api.basic.grade.fetchGrade({gradeId:id});
                    console.log(result.subjectEntities);
                    this.dataSource=result.subjectEntities;
                }
                console.log(this.dataSource);
                for(let i in this.dataSource){
                    this.allSubjectId.push(this.dataSource[i].subChildId);
                }
                console.log(this.allSubjectId);
            },
            async courseInfo(){
                this.treeData = []
                let {data:{result,success}}=await this.$api.basic.subject.fetchSubjectList();
                console.log(result);
                for(let i in result){
                    //第一层（级部）
                    let mainCourseData={};
                    mainCourseData.title=result[i].subName;
                    mainCourseData.key=mainCourseData.value=result[i].id;
                    if(result[i].subjectChildEntitys.length){
                        //第二层（年级）
                        mainCourseData.children=[];
                        for(let j=0;j<result[i].subjectChildEntitys.length;j++){
                            let item=result[i].subjectChildEntitys[j];
                            let courseData={};
                            courseData.key=courseData.value=item.subChildId;
                            courseData.title=item.name;
                            mainCourseData.children.push(courseData);
                        }
                    }
                    this.treeData.push(mainCourseData);
                }
                console.log('ths.reee',this.treeData)
            },
             addNew() {
                this.showSubject=true;
                //获取课程信息
                this.checkedKeys=this.allSubjectId;
            },
            //取消
            handleCancel(){
                this.showSubject=false
            },
            //保存
            async handleOk(){
                console.log(this.form.addSub);
                let subChildIds = []
                this.form.addSub.forEach((item,index) =>{
                    let parentNode = this.treeData.filter(child => child.key === item)
                    console.log(parentNode);
                    if(parentNode.length > 0 && Object.prototype.hasOwnProperty.call(parentNode[0],'children')){
                        parentNode[0].children.forEach(chr=>{
                            console.log(chr.key);
                            subChildIds.push(chr.key)
                        });
                    }else{
                        console.log(item);
                        subChildIds.push(item)
                    }
                })
                this.form.addSub = subChildIds
                let {data}=await this.$api.basic.grade.saveGrade({gradeId:this.$router.history.current.query.id,gradeSubChildIds:this.form.addSub});
                console.log(data);
                this.showSubject=false;
                this.gainBaseInfo();
            },
            //返回年级
            backGrade(){
                this.$router.go(-1);
            },
            async deleteItem(id){
                let {data}=await this.$api.basic.grade.deleteGradeSubject({gradeId:this.$router.history.current.query.id,gradeSubChildIds:[id]});
                console.log(data);
                this.gainBaseInfo();
            }
        },
    };
</script>

<style lang="less" scoped>
    .search {
        margin-bottom: 54px;
    }
    .fold {
        width: calc(100% - 216px);
        display: inline-block;
    }
    .operator {
        margin-bottom: 18px;
    }
    @media screen and (max-width: 900px) {
        .fold {
            width: 100%;
        }
    }
</style>
