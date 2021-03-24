<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item>基础设置</a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/basic/grade/admin">年级</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="#">课程</router-link></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
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
                            @confirm="() => deleteItem(record.subChildId)"><a>删除</a>
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
                    <a-tree-select :default-value="form.addSub"
                                   placeholder="请选择课程"
                                   style="width: 275px"
                                   :checkedKeys="checkedKeys"
                                   :tree-data="treeData"
                                   tree-checkable
                                   @change="changeCourse"
                                   :show-checked-strategy="SHOW_PARENT">
                    </a-tree-select>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </a-card>
    </div>
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
                checkCourseInfo:[],
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
                    // console.log(result.subjectEntities);
                    this.dataSource=result.subjectEntities;
                }
                // console.log(this.dataSource);
                for(let i in this.dataSource){
                    this.allSubjectId.push(this.dataSource[i].subChildId);
                }
                // console.log(this.allSubjectId);
            },
            //获取班级树
            async courseInfo(){
                this.treeData = []
                let {data:{result,success}}=await this.$api.basic.subject.fetchSubjectList();
                // console.log(result);
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
                // console.log('ths.reee',this.treeData)
            },
            //新建
            addNew() {
                this.showSubject=true;
                //获取课程信息
                console.log(this.treeData);
                this.form.addSub=this.allSubjectId;
                console.log(this.form.addSub);
            },
            //选择课程
            changeCourse(info){
                console.log(info);
                // this.checkCourseInfo=info;
                let list=[...this.treeData];
                list.forEach(item=>{
                    console.log(item);
                    let infoList=[...info];
                    infoList.forEach(itemInfo=>{
                        console.log(itemInfo);
                        if(itemInfo==item.key){
                            let children=item.children;
                            for(let i=0;i<children.length;i++){
                                this.checkCourseInfo.push(children[i].key)
                            }
                        }else{
                            this.checkCourseInfo.push(itemInfo);
                        }
                    })
                })
                console.log(this.checkCourseInfo);
                //去除重复
                let course=[];
                for(let i=0;i<this.checkCourseInfo.length;i++){
                    for(let j=i+1;j<this.checkCourseInfo.length;j++){
                        if(this.checkCourseInfo[i]===this.checkCourseInfo[j]) {
                            for(let temp=j;temp<this.checkCourseInfo.length;temp++){
                                this.checkCourseInfo[temp] = this.checkCourseInfo[temp + 1];
                            }
                            j--;
                            this.checkCourseInfo.length = this.checkCourseInfo.length - 1;
                        }
                    }
                }
                console.log(this.checkCourseInfo);
            },
            //取消
            handleCancel(){
                this.showSubject=false
            },
            //保存
            async handleOk(){
                console.log(this.checkCourseInfo);
                let {data}=await this.$api.basic.grade.saveGrade({
                    gradeId:this.$router.history.current.query.id,
                    gradeSubChildIds:this.checkCourseInfo});
                console.log(data);
                this.showSubject=false;
                this.gainBaseInfo();
            },
            //返回年级
            backGrade(){
                this.$router.go(-1);
            },
            //删除
            async deleteItem(id){
                let {data}=await this.$api.basic.grade.deleteGradeSubject({gradeId:this.$router.history.current.query.id,gradeSubChildIds:[id]});
                console.log(data);
                this.gainBaseInfo();
            }
        },
    };
</script>

<style lang="less" scoped>
    .result{
        width: 100%;
        background-color: white;
        height:50px;
        margin: 20px 0px 10px 0px;
        padding-left: 25px;
        padding-top: 15px;
        vertical-align: top;
        border-radius: 5px;
    }
    .operator {
        margin-bottom: 18px;
    }
    @media screen and (max-width: 900px) {

    }
</style>
