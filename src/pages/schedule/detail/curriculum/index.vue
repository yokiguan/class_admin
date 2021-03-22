<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item>课表查看</a-breadcrumb-item>
                <a-breadcrumb-item>整体查看</a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
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
        </div>
        <a-card class="table-bg">
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
                    :rowKey="'key'"
                     :columns="columns"
                     :data-source="tableData"
                     :pagination="false"
                     :bordered="true"
                     style="margin-top: 20px;width:1200px;white-space: pre">
            </a-table>
        </a-card>
    </div>
</template>
<script>
    import {message} from "ant-design-vue"
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
        },
        {
            title: '一',
            dataIndex: 'one',
        },
        {
            title: '二',
            dataIndex: 'two',
        },
        {
            title: '三',
            dataIndex: 'three',
        },
        {
            title: '四',
            dataIndex: 'four',
        },
        {
            title: '五',
            dataIndex: 'five',
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
                showTable:false,
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
                let {data}=await this.$api.schedule.table.allTable({planId:this.planId});
                // console.log(result);
                if(data.success==false){
                    message.info("课表不存在！")
                }else{
                    this.allData=data.result;
                    console.log(this.allData);
                    this.showTable=true;
                    //创建数组
                    let dataSource=[];
                    for(let i=0;i<this.allData.length;i++){
                        if(this.allData[i].position){
                            let position = eval(this.allData[i].position);
                            const getInfo=(dataItem,sourceItem={})=>{
                                if(!sourceItem) sourceItem={}
                                let content = dataItem.subChildName +dataItem.className+"_"+dataItem.teacherName;
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
                            dataSource[position[0]]=getInfo(this.allData[i],dataSource[position[0]]);
                            // dataSource[position[0]-1]=getInfo(this.allData[i],dataSource[position[0]-1]);
                        }
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
                    //编号
                    for(let i=0;i<this.tableData.length;i++){
                        this.tableData[i].key=i+1;
                    }
                    console.log(this.tableData);
                }
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
        width: 100%;
        min-height: 670px;
    }
</style>
