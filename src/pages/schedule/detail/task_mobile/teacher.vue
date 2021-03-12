<template>
    <div id="wrapper" style="width: 100%">
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">走班排课任务</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">老师查看</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="box">
            <a-card class="left">
                <a-row style="width: 100%">
                    <a-icon type="reload" style="font-size: 1.0em;font-weight: bold"/>
                    <span style="font-size: 1.0em;margin-left: 10px">刷新菜单</span>
                    <span style="font-size: 1.0em;margin-left: 10px">全部展开</span>
                </a-row>
                <div style="margin-top: 10px;border-top: solid black 1px;"/>
                <div>
                    <a-tree v-model="checkedKeys"
                            :tree-data="treeData"
                            checkable
                            @check="onCheck"
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
                    <a-row style="margin-top: 20px">
                        <a-col :span="7"><span style="font-size: 1.2em ">高二2019-2020第一学期排课计划A</span></a-col>
                        <button @click="maxTime" style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px">查看学生冲突</button>
                        <button style="background-color: #19b294;margin-left: 30px;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px" @click="changeCourse">手动调课</button>
                        <button style="background-color: #19b294;margin-left: 30px;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px" @click="changClass">学生调班</button>
                    </a-row>
                    <a-row><a-col><span style="font-size: 1.2em ">结果：无冲突</span></a-col></a-row>
                </div>
                <a-card class="table-bg" v-if="showTable">
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
                        width: 110px" @click="placeLook">按场地查看</button></a-col>
                        <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="subjectLook">按科目查看</button></a-col>
                    </a-row>
                    <a-table :columns="columns"
                            :data-source="tableData"
                            :pagination="false"
                            :bordered="true"
                            style="margin-top: 20px;height:100% ">
                    </a-table>
                </a-card>
            </div>
        </div>
    </div>
</template>
<script>
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
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
                planData:"",
                planId:"",
                checkedKeys:[],
                showTable:false,
                allData:[],
                gradeId:"",
            };
        },
        created() {
            this.treeTeacher();
            this.chooseCourseInfo();
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
                    this.planData = result.name;
                    this.gradeId=result.gradeName;
                }
            },
            onCheck(checkedKeys) {
                console.log('onCheck', checkedKeys);
                this.checkedKeys=checkedKeys;
                this.showTable=true;
                this.teacherInfo();
            },
            //获取左侧的教室树
            async treeTeacher(){
                //根据年级信息调用接口
                let {data}=await this.$api.basic.teacher.fetchTeacherList({gradeId:this.gradeId});
                // console.log(data);
                // console.log(data.rows);
                this.treeData=[];
                for(let i=0;i<data.rows.length;i++){
                    let numberTree={};
                    numberTree.title=data.rows[i].teacherName;
                    numberTree.key=data.rows[i].teacherId;
                    this.treeData.push(numberTree);
                }
            },
            //教师课表查看
            async teacherInfo() {
                // teacherId还没传变量
                let {data: {result, success}} = await this.$api.schedule.classTask.teacherLook({
                    planId: this.planId,
                    scheduleTaskId: this.scheduleTaskId,
                    teacherId: this.checkedKeys.toString()
                });
                // console.log(result);
                this.allData=result.teacherCurriDtos;
                // console.log(this.allData);
                let dataSource=[];
                for(let i=0;i<this.allData.length;i++){
                    let position=eval(this.allData[i].position);
                    const getInfo=(dataItem,sourceItem={})=>{
                        if(!sourceItem) sourceItem={};
                let content = dataItem.subChildName +dataItem.classNumId+"_"+result.teacherName+'(' +  dataItem.classroomName + ')'+"共"+dataItem.classStuNum+"人";;
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
                // console.log(this.tableData);
                // 编号
                for(let i=0;i<this.tableData.length;i++){
                    this.tableData[i].key=i+1;
                }
                console.log(this.tableData);
            },
            // },
            //手动调课
            changeCourse(){
                this.$router.push(`/schedule/detail/task_mobile/integrate?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //学生调班
            changClass(){
                this.$router.push(`/schedule/detail/task_mobile/change_student?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //整体查看
            allLook(){
                this.$router.push(`/schedule/detail/task_mobile/all?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按场地查看
            placeLook(){
                this.$router.push(`/schedule/detail/task_mobile/room?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按科目查看
            subjectLook(){
                this.$router.push(`/schedule/detail/task_mobile/course?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            async deletPublic(){
                let {data}=await this.$api.schedule.classTask.reBack({planId:this.planId,scheduleTaskId:this.scheduleTaskId});
                console.log(data);
                if(data&&data.success){
                    alert("删除已发布课表成功");
                }
            },
            //返回
            back(){
                this.$router.go(-1)
            },
            maxTime(){},
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
    }
    .right{
        border-radius: 5px;
        width: 81%;
    }
    .title{
        width: 100%;
        background-color: #fff;
        height: 170px;
        padding: 20px 25px;
        border-radius: 10px;
        margin-bottom: 50px;
    }
    .table-bg{
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        height: 670px;
        margin-top: -35px;
        width: 100%;
        background-color: #fff;
    }
</style>

