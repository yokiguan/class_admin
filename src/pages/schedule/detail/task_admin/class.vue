<template>
    <div id="wrapper" style="width: 100%">
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">班级课表</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="box">
            <a-card class="left">
                <a-row>
                    <a-icon type="reload" style="font-size: 1.5em;font-weight: bold"/>
                    <span style="font-size: 1.2em;margin-left: 10px">刷新菜单</span>
                    <span style="font-size: 1.2em;margin-left: 10px">全部展开</span>
                </a-row>
                <div style="width: 100%; height: 1px;margin-top: 10px;border-top: solid black 1px;"/>
                <div>
                    <a-tree v-model="checkedKeys"
                            :tree-data="treeData"
                            @check="onCheck"
                            checkable
                            style="font-size: 1.3em;"/>
                </div>
            </a-card>
            <div class="right">
                <div class="title">
                    <a-row>
                        <a-col :span="15"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                        <a-col :span="5"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px" @click="deletPublic">删除已发布课表</button></a-col>
                        <a-col><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px" @click="back">返回</button></a-col>
                    </a-row>
                </div>
                <a-card class="table-bg">
                    <a-row class="buttons">
                        <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="teacherLook">按老师查看</button></a-col>
                        <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="subjectLook">按科目查看</button></a-col>
                        <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="classLook">按班级查看</button></a-col>
                    </a-row>
                    <a-table v-if="showTable"
                            :rowKey="'key'"
                            :columns="columns"
                            :data-source="tableData"
                            :pagination="false"
                            :bordered="true"
                            style="margin-top: 20px;height:100%;white-space: pre">
                    </a-table>
                </a-card>
            </div>
        </div>
    </div>
</template>
<script>
    import {message} from "ant-design-vue";
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
        },
        {
            title: '一',
            dataIndex: 'one',
            align: "center",
        },
        {
            title: '二',
            dataIndex: 'two',
            align: "center",
        },
        {
            title: '三',
            dataIndex: 'three',
            align: "center",
        },
        {
            title: '四',
            dataIndex: 'four',
            align: "center",
        },
        {
            title: '五',
            dataIndex: 'five',
            align: "center",
        },
    ];
    export default {
        data() {
            return {
                treeData:[],
                columns,
                tableData:[],
                checkedKeys:[],
                planData:"",
                planId:"",
                scheduleTaskId:"",
                showTable:false,
                gradeName:"",
            };
        },
        async created() {
            //获取planId
            let queryString = (window.location.hash || " ").split(/[?&]/)[1];
            let planId = (queryString || " ").split('=')[1];
            // console.log(planId);
            this.planId = planId;
            //获取scheduleTaskId
            let queryTaskString = (window.location.hash || " ").split(/[?&]/)[2];
            let scheduleTaskId = (queryTaskString || " ").split('=')[1];
            this.scheduleTaskId= scheduleTaskId;
            // console.log( this.scheduleTaskId);
            if (planId) {
                //获取单个选课计划的信息
                let {data: {result, success}} = await this.$api.schedule.plan.schedulegetInfo({planId})
                this.planData = result.name;
                this.gradeName=result.gradeName;
            }
            this.treeClass();
        },
        methods: {
            onCheck(checkedKeys) {
                console.log('onCheck', checkedKeys);
                this.checkedKeys=checkedKeys;
                this.classInfo();
            },
            //获取左侧的教室树
            async treeClass(){
                //根据年级信息调用接口
                let {data:{result,success}}=await this.$api.schedule.adminTask.lookClassList({planId:this.planId});
                console.log(result);
                // this.treeData=[];
                for(let i=0;i<result.length;i++){
                    let numberTree={};
                    numberTree.title=this.gradeName+result[i].departName;
                    numberTree.key=result[i].id;
                    this.treeData.push(numberTree);
                }
            },
            //班级课表查看
            async classInfo() {
                // teacherId还没传变量
                let {data} = await this.$api.schedule.adminTask.classTable({
                    planId: this.planId,
                    scheduleTaskId:this.scheduleTaskId,
                    classId: this.checkedKeys.toString(),
                });
                // console.log(result);
               if(data.success==false){
                   message.info(data.message);
               }else{
                   this.allData=data.result;
                   console.log(this.allData);
                   let dataSource=[];
                   this.showTable=true;
                   for(let i=0;i<this.allData.length;i++){
                       let position=eval(this.allData[i].position);
                       const getInfo=(dataItem,sourceItem={})=>{
                           if(!sourceItem) sourceItem={};
                           let content = this.gradeName+dataItem.subName+"————"+dataItem.teacherName;
                           const column=eval(dataItem.position)[1];
                           switch (column) {
                               case 1:
                                   sourceItem.one=sourceItem.one ?sourceItem.one+"\n"+content:content;
                                   break;
                               case 2:
                                   sourceItem.two=sourceItem.two ?sourceItem.two+',\n'+content:content;
                                   break;
                               case 3:
                                   sourceItem.three=sourceItem.three ?sourceItem.three+',\n'+content:content;
                                   break;
                               case 4:
                                   sourceItem.four=sourceItem.four ?sourceItem.four+',\n'+content:content;
                                   break;
                               case 5:
                                   sourceItem.five=sourceItem.five ?sourceItem.five+',\n'+content:content;
                                   break;
                           }
                           return sourceItem
                       };
                       dataSource[position[0]-1]=getInfo(this.allData[i],dataSource[position[0]-1]);
                   }
                   // console.log(dataSource);
                   this.tableData=dataSource;
                   for(let i=0;i<this.tableData.length;i++){
                       // console.log(i,this.tableData[i]);
                       if(this.tableData[i]===undefined){
                           // console.log(i);
                           let pushData={
                               one:"",
                               two:"",
                               three:"",
                               four:"",
                               five:"",
                           }
                           this.tableData[i]=pushData;
                           // this.tableData[i].one="";
                       }
                   }
                   console.log(this.tableData);
                   // console.log(this.tableData);
                   // 编号
                   for(let i=0;i<this.tableData.length;i++){
                       this.tableData[i].key=i+1;
                   }
                   console.log(this.tableData);
               }
            },
            //按老师查看
            teacherLook(){
                this.$router.push(`/schedule/detail/task_admin/teacher?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`);
            },
            //按科目查看
            subjectLook(){
                this.$router.push(`/schedule/detail/task_admin/subject?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按班级查看
            classLook(){
                this.$router.push(`/schedule/detail/task_admin/class?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //删除已发布课表
            async deletPublic(){
                let {data}=await this.$api.schedule.classTask.reBack({planId:this.planId,scheduleTaskId:this.scheduleTaskId});
                console.log(data);
                if(data&&data.success){
                    message.info("删除已发布课表成功");
                }else{
                    message.info("删除已发布课表失败");
                }
            },
            //返回
            back(){
                this.$router.go(-1)
            },
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
    .box{
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction:row;
    }
    .left{
        width: 18%;
        background-color: white;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        min-height: 700px;
    }
    .right{
        border-radius: 5px;
        width: 81%;
    }
    .title{
        width: 100%;
        background-color: #fff;
        height: 140px;
        padding: 20px 25px;
        border-radius: 10px;
        margin-bottom: 50px;
    }
    .table-bg{
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        margin-top: -35px;
        width: 100%;
        background-color: #fff;
        min-height: 670px;
    }
</style>

