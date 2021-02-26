<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">课表查看</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">整体查看</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <a-card class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.7em">{{this.planData}}</span></a-col>
                <a-col>
                    <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px" @click="back">返回</button>
                </a-col>
            </a-row>
        </a-card>
        <div class="table-bg">
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
            <a-table :rowKey="''"
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :bordered="true"
                    style="margin-top: 20px;width:1200px;height: 700px">
            </a-table>
        </div>
    </div>
</template>
<script>
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
            width:'5%',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title: '一',
            dataIndex: 'one',
            key:'one',
            width:'19%'
        },
        {
            title: '二',
            dataIndex: 'two',
            key:'two',
            width:'19%'
        },
        {
            title: '三',
            dataIndex: 'three',
            key:'three',
            width:'19%'
        },
        {
            title: '四',
            dataIndex: 'four',
            key: 'four',
            width:'19%'
        },
        {
            title: '五',
            dataIndex: 'five',
            key: 'five',
            width:'19%'
        },
    ];
    export default {
        data() {
            return {
                columns,
                tableData:[],
                visible: false,
                loading: false,
                planId:"",
                planData:"",
                allData:[],
            };
        },
        created() {
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
                console.log(result[0]);
                this.allData=result[0].syllabus;
                console.log(this.allData);
                for(let i=0;i<this.allData.length;i++){
                    let position=this.allData[i].position
                    // console.log(this.allData[i].position);
                    console.log(position);
                    let positionArr=eval(position);
                    // console.log(positionArr);
                    // for(let j=0;j<positionArr.length;j++){
                    // let rowData=
                        console.log(positionArr[0]);
                    // }
                }

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
        background-color: white;
        height: 90px;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
    }
    .table-bg{
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
        text-align: center;
        height: 1000px;
        width: 100%;
    }
    /deep/ Table {
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
    }
</style>
