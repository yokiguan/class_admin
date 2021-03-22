<template>
    <div id="wrapper" style="width: 100%">
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">课表查看</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="#">学生课表</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="box">
            <a-card class="left">
                <a-row class="left_title">
                    <a-col :span="3"><a-icon type="reload" style="font-size: 1.5em;
                    font-weight: bold"/></a-col>
                    <a-col :span="12"><span style="font-size: 1.2em">刷新菜单</span></a-col>
                    <a-col><span style="font-size: 1.2em">全部展开</span></a-col>
                </a-row>
                <a-row>
                    <a-input-search placeholder="请输入学生姓名"  v-model="studentName" @search="onSearch" style="margin-top: 20px"/>
                </a-row>
                <div style="width: 100%; height: 1px;
            margin-top: 10px;
            border-top: solid black 1px;"/>
                <a-tree v-model="checkedKeys"
                        :tree-data="treeData"
                        checkable
                        @check="onCheck"
                        style="font-size: 1.3em;"/>
            </a-card>
            <div class="right">
                <div class="title">
                    <a-row>
                        <a-col :span="15"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                        <button style="background-color: #19b294;color: white;height: 40px;border: none;margin-left: 100px;
                        border-radius: 5px;width: 150px" @click="back">返回</button>
                    </a-row>
                </div>
                <a-card class="table-bg" >
                    <a-row class="buttons">
                        <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="allLook">整体查看</button></a-col>
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
                        width: 110px"  @click="placeLook">按场地查看</button></a-col>
                        <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="subjectLook">按科目查看</button></a-col>
                    </a-row>
                    <a-table v-if="showTable"
                            :columns="columns"
                            :data-source="tableData"
                            :pagination="false"
                            :bordered="true"
                            style="margin-top: 20px;white-space: pre">
                    </a-table>
                </a-card>
            </div>
        </div>
    </div>
</template>
<script>
    import {message} from "ant-design-vue"
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
            width:"5%",
        },
        {
            title: '一',
            dataIndex: 'one',
            align: 'center',
            width:"19%"
        },
        {
            title: '二',
            dataIndex: 'two',
            align: 'center',
            width:"19%"
        },
        {
            title: '三',
            dataIndex: 'three',
            align: 'center',
            width:"19%"
        },
        {
            title: '四',
            dataIndex: 'four',
            align: 'center',
            width:"19%"
        },
        {
            title: '五',
            dataIndex: 'five',
            align: 'center',
            width:"19%"
        },
    ];
    export default {
        data() {
            return {
                treeData:[],
                columns,
                tableData:[],
                planData:"",
                planId:"",
                scheduleTaskId:"",
                showTable:true,
                studentName:"",
                checkedKeys:[],
                allData:[],
            };
        },
        created() {
            this.chooseCourseInfo();
            this.treeInfo();
        },
        methods: {
            //获取单个选课计划信息
            async chooseCourseInfo(){
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
                    this.planData = result.name
                    console.log(result);
                }
            },
            //学生树查询
            async treeInfo(){
              let {data}=await this.$api.schedule.classTask.getStudentList({planId:this.planId});
              // console.log(data.result);
                this.treeData = [];
                for (let i in data.result) {
                    // 第一层
                    let numberTree = {}
                    //将Object转换为数组
                    let arr=Object.values(data.result[i].schWxUserEntity);
                    // let item = ;
                    // console.log(arr);
                    numberTree.title = arr[1];
                    numberTree.key = arr[2];
                    this.treeData.push(numberTree)
                }
                // console.log(this.treeData);
            },
            //根据学生姓名查询
            onSearch(value){
                console.log(value);
                this.nameInfo([value]);
                this.showTable=true;
            },
            //根据姓名查信息接口
            async nameInfo(value){
                 let {data}=await this.$api.schedule.classTask.getStudent({
                     planId:this.planId,
                     name:value.toString()});
                 console.log(data);
                if(data.success==true){
                    let subId=data.result[0].schWxUserEntity.wxUid;
                    console.log(subId);
                    this.checkedKeys=subId.split();
                    this.onCheck();
                }else{
                    message.info(data.message);
                }
            },
            //选择学生
            onCheck() {
                // console.log('onCheck', checkedKeys);
                let stuId=this.checkedKeys.toString();
                console.log(stuId);
                this.stuInfo(stuId);
                this.showTable=true;
            },
            //课表查看接口
            async stuInfo(stuId){
                let {data}=await this.$api.schedule.table.studentTable({
                    planId:this.planId,
                    stuId:stuId})
                console.log(data);
               if(data.success=false){
                   message.info(data.message);
               }else{
                   this.allData=data.result.syllabus;
                   console.log(this.allData);
                   this.showTable=true;
                   let dataSource=[];
                   for(let i=0;i<this.allData.length;i++){
                       let position=eval(this.allData[i].position);
                       const getInfo=(dataItem,sourceItem={})=>{
                           if(!sourceItem) sourceItem={};
                           // let content = dataItem.subChildName +dataItem.classNumId + '(' + dataItem.classroomName + ')';
                           let content = dataItem.subChildName +dataItem.classNumId+"_"+dataItem.teacherName+'(' +  dataItem.classroomName + ')';
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
                   console.log(dataSource);
                   this.tableData=dataSource;
                   console.log(this.tableData);
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
                   //编号
                   for(let i=0;i<this.tableData.length;i++){
                       this.tableData[i].key=i+1;
                   }
                   console.log(this.tableData);
               }
            },
            //按老师查看
            teacherLook(){
                this.$router.push(`/schedule/detail/task_mobile/teacher?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按场地查看
            placeLook(){
                this.$router.push(`/schedule/detail/task_mobile/room?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //整体查看
            allLook(){
                this.$router.push(`/schedule/detail/task_mobile/all?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按科目查看
            subjectLook(){
                this.$router.push(`/schedule/detail/task_mobile/course?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
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
        width: 19%;
        background-color: white;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }
    .right{
        border-radius: 5px;
        width: 80%;
    }
    .title{
        width: 100%;
        background-color: #fff;
        height: 120px;
        padding: 20px 25px;
        border-radius: 10px;
        margin-bottom: 50px;
    }
    .table-bg{
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        min-height: 670px;
        margin-top: -35px;
        width: 100%;
        background-color: #fff;
    }
</style>

