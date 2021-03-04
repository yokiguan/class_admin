<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">走班排课任务</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">整体查看</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content ">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                <a-col><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px" @click="back">返回</button></a-col>
            </a-row>
            <a-row style="margin-top: 20px">
                <a-col :span="5"><span style="font-size: 1.2em ">高二2019-2020第一学期排课计划A</span></a-col>
                    <button @click="showModal" style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px">查看学生冲突</button>
                    <button type="primary" style="background-color: #19b294;margin-left: 30px;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px" @click="manualChangeClass">手动调课</button>
                    <button style="background-color: #19b294;margin-left: 30px;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px" type="primary" @click="changClass">学生调班</button>
            </a-row>
            <a-row><a-col><span style="font-size: 1.2em ">结果：无冲突</span></a-col></a-row>
        </div>
        <a-card class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px"  @click="teacherLook">按老师查看</button></a-col>
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
                        width: 110px"  @click="subjectLook">按科目查看</button></a-col>
                <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px"  @click="studentLook">按学生查看</button></a-col>
            </a-row>
            <a-table :rowKey="'key'"
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :bordered="true"
                    style="margin-top: 20px;width:1200px;white-space: pre"/>
        </a-card>
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
                columns,
                tableData:[],
                visible: false,
                loading:false,
                planId:"",
                planData:"",
                allData:[]
            };
        },
        async created() {
           this.chooseCourseInfo();
           this.allLookInfo();
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
            //获取整体查看数据
            async allLookInfo(){
                let {data:{result,success}}=await this.$api.schedule.classTask.getData({planId:this.planId,scheduleTaskId:"1e86be510ab94a99801802d52740da40"})
                // console.log(result[0]);
                this.allData=result[0].syllabus;
                console.log(this.allData);
                console.log(this.tableData);
                //创建数组
                let dataSource=[];
                for(let i=0;i<this.allData.length;i++){
                    let position = eval(this.allData[i].position);
                    const getInfo=(dataItem,sourceItem={})=>{
                        if(!sourceItem) sourceItem={}
                        let content = dataItem.subChildName +dataItem.classNumId + '(' + dataItem.classStuNum + ')';
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
            },
            //手动调课
            manualChangeClass(){
                this.$router.push(`/schedule/detail/task_mobile/integrate?planId=${this.planId}`)
            },
            //学生调班
            changClass(){
                this.$router.push(`/schedule/detail/task_mobile/change_student?planId=${this.planId}`)
            },
            //按老师查看
            teacherLook(){
                this.$router.push(`/schedule/detail/task_mobile/teacher?planId=${this.planId}`)
            },
            //按场地查看
            placeLook(){
                this.$router.push(`/schedule/detail/task_mobile/room?planId=${this.planId}`)
            },
            //按科目查看
            subjectLook(){
                this.$router.push(`/schedule/detail/task_mobile/course?planId=${this.planId}`)
            },
            //按学生查看
            studentLook(){
                this.$router.push(`/schedule/detail/curriculum/student?planId=${this.planId}`)
            },
            back(){
                this.$router.go(-1)
            },
            click(){},
            showModal(){},
            onChange(){},
            maxTime(){},
        }
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
    .content{
        width: 100%;
        height: 300px;
        background-color: white;
        height: 150px;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        vertical-align: top;
        border-radius: 5px;
    }
    .result-left{
        width: 50%;
    }
    .link-font-color{
        color: #0000ff;
    }
    .info{
        height: 50px;
        width: 100%;
        margin: 0px 0px 10px 0px;
        padding: 10px 5px;
        background-color: white;
        border-radius: 5px;
    }
    .table-bg{
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
        text-align: center;
        width: 100%;
    }
</style>
