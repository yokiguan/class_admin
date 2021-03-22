<template>
    <div id="wrapper" style="width: 100%">
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">课表查看</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">科目课表</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="box">
            <a-card class="left">
                <a-row class="left_title">
                    <a-icon type="reload" style="font-size: 1.5em;
                    font-weight: bold"/>
                    <span style="font-size: 1.2em;margin-left: 20px">刷新菜单</span>
                    <span style="font-size: 1.2em;margin-left: 20px">全部展开</span>
                </a-row>
                <div style="width: 100%; height: 1px;
            margin-top: 10px;
            border-top: solid black 1px;"></div>
                <a-tree v-model="checkedKeys"
                        :tree-data="treeData"
                        @check="onCheck"
                        checkable
                        style="font-size: 1.3em;"/>
            </a-card>
            <div class="right">
                <div class="title">
                    <a-row>
                        <a-col :span="18"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                        <a-col><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px" @click="back">返回</button></a-col>
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
                        width: 110px" @click="placeLook">按场地查看</button></a-col>
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
                        width: 110px" @click="studentLook">按学生查看</button></a-col>
                    </a-row>
                    <a-table v-if="showTable"
                            :columns="columns"
                            :data-source="tableData"
                            :pagination="false"
                            :bordered="true"
                            style="margin-top: 20px;height:100%;white-space:pre">
                    </a-table>
                </a-card>
            </div>
        </div>
    </div>
</template>
<script>
    import {message} from 'ant-design-vue'
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
            width:'5%',
        },
        {
            title: '一',
            dataIndex: 'one',
            width:'19%',
            align: 'center'
        },
        {
            title: '二',
            dataIndex: 'two',
            width:'19%',
            align: 'center'
        },
        {
            title: '三',
            dataIndex: 'three',
            width:'19%',
            align: 'center'
        },
        {
            title: '四',
            dataIndex: 'four',
            width:'19%',
            align: 'center'
        },
        {
            title: '五',
            dataIndex: 'five',
            width:'19%',
            align: 'center'
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
                allData:[],
                checkedKeys:[],
                showTable:false,
            };
        },
        created() {
            this.chooseCourseInfo();
            this.courseInfo();
        },
        methods: {
            //获取单个选课计划信息
            async chooseCourseInfo(){
                let queryString = (window.location.hash || " ").split('?')[1]
                let planId = (queryString || " ").split('=')[1]
                this.planId = planId;
                if (planId) {
                    //获取单个选课计划的信息
                    let {data: {result, success}} = await this.$api.schedule.plan.schedulegetInfo({planId})
                    this.planData = result.name
                }
            },
            //课程树查看
            async courseInfo(){
                let {data:{result,success}}=await this.$api.schedule.table.courseClasstree({planId:this.planId});
                console.log(result);
                this.treeData=[];
                for(let i=0;i<result.length;i++){
                    let numberTree={};
                    numberTree.title=result[i].subName+result[i].className;
                    numberTree.key=result[i].subId+','+result[i].classId+','+result[i].scheduleTaskId+','+result[i].type;
                    this.treeData.push(numberTree);
                }
                console.log(this.treeData);
            },
            //选择课程
            onCheck(checkedKeys) {
                console.log('onCheck', checkedKeys);
                let arr=Object.values(checkedKeys);
                console.log(arr);
                for(let i=0;i<arr.length;i++){
                    let courseData=arr[i].toString();
                    console.log(courseData);
                    let subChildId= courseData.split(',')[0];
                    console.log(subChildId);
                    let classId=courseData.split(',')[1];
                    console.log(classId);
                    let scheduleTaskId=courseData.split(',')[2];
                    console.log(scheduleTaskId);
                    let type=courseData.split(',')[3];
                    console.log(type);
                    this.courseLookInfo(subChildId,classId,scheduleTaskId,type);
                }
                this.showTable=true;
            },
            //课程课表查看
            async courseLookInfo(subChildId,classId,scheduleTaskId,type){
                let {data}=await this.$api.schedule.table.courseClassTable({
                    planId:this.planId,
                    scheduleTaskId:scheduleTaskId,
                    subId:subChildId,
                    classId:classId,
                    type:type});
                console.log(data.result);
                this.allData=data.result;
                console.log(this.allData);
                let dataSource=[];
                for(let i=0;i<this.allData.length;i++){
                    let position=eval(this.allData[i].position);
                    const getInfo=(dataItem,sourceItem={})=>{
                        if(!sourceItem) sourceItem={};
                        // let content = dataItem.subChildName +dataItem.classNumId + '(' + dataItem.classroomName + ')';
                        let content = dataItem.subChildName +dataItem.className+"_"+dataItem.teacherName+'(' +  dataItem.classroomName + ')';
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
            },
            //整体查看
            allLook(){
                this.$router.push(`/schedule/detail/curriculum/index?planId=${this.planId}`);
            },
            //按老师查看
            teacherLook(){
                this.$router.push(`/schedule/detail/curriculum/teacher?planId=${this.planId}`);
            },
            //按教室查看
            placeLook(){
                this.$router.push(`/schedule/detail/curriculum/place?planId=${this.planId}`);
            },
            //按科目查看
            subjectLook(){
                this.$router.push(`/schedule/detail/curriculum/subject?planId=${this.planId}`);
            },
            //按学生查看
            studentLook(){
                this.$router.push(`/schedule/detail/curriculum/student?planId=${this.planId}`);
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

