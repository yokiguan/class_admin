<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/schedule/template">排课计划</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><span @click="arrangeClass">排课详情</span></a-breadcrumb-item>
                <a-breadcrumb-item><a href="#">整体课表</a></a-breadcrumb-item>
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
            <a-table :rowKey="'activity'"
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
    const activity = [
        {
            name: "早读",
            options: [0, 1, 2],
            value: "morningread"
        },
        {
            name: "上午",
            options: [0, 1, 2, 3, 4],
            value: "morning"
        },
        {
            name: "中午",
            options: [0, 1, 2],
            value: "noon"
        },
        {
            name: "下午",
            options: [0, 1, 2, 3, 4],
            value: "afternoon"
        },
        {
            name: "晚自习",
            options: [0, 1, 2, 3, 4],
            value: "evening"
        }
    ];
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'activity',
            width:"3.4%"
        },
        {
            title: '星期一',
            dataIndex: 'one',
            align: "center",
            width: "13.8%"
        },
        {
            title: '星期二',
            dataIndex: 'two',
            align: "center",
            width: "13.8%"
        },
        {
            title: '星期三',
            dataIndex: 'three',
            align: "center",
            width: "13.8%"
        },
        {
            title: '星期四',
            dataIndex: 'four',
            align: "center",
            width: "13.8%"
        },
        {
            title: '星期五',
            dataIndex: 'five',
            align: "center",
            width: "13.8%"
        },{
            title: '星期六',
            dataIndex: 'six',
            align: "center",
            width: "13.8%"
        },{
            title: '星期日',
            dataIndex: 'seven',
            align: "center",
            width: "13.8%"
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
                activity,
            };
        },
        created() {
            this.chooseCourseInfo();
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
                    this.planData = result.name;
                    this.modalInfo(result.currId);
                }
            },
            //获取课表模板相关信息
            async modalInfo(currId) {
                // console.log(currId);
                let {data}=await this.$api.basic.template.fetchTemplate({id:currId})
                console.log(data.result);
                let activities = [];
                let list = [...this.activity];
                list.forEach(item => {
                    for (let i = 1; i <= data.result[item.value]; i++) {
                        activities.push({
                            activity: item.name + i,
                            value: item.value + i
                        });
                    }
                });
                this.tableData = activities;
                this.allLookInfo();
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
                                    case 0:
                                        sourceItem.one=sourceItem.one ?sourceItem.one+"\n"+content:content;
                                        break;
                                    case 1:
                                        sourceItem.two=sourceItem.two ?sourceItem.two+',\n'+content:content;
                                        break;
                                    case 2:
                                        sourceItem.three=sourceItem.three ?sourceItem.three+',\n'+content:content;
                                        break;
                                    case 3:
                                        sourceItem.four=sourceItem.four ?sourceItem.four+',\n'+content:content;
                                        break;
                                    case 4:
                                        sourceItem.five=sourceItem.five ?sourceItem.five+',\n'+content:content;
                                        break;
                                    case 5:
                                        if(sourceItem.six){
                                            sourceItem.six=sourceItem.six ?sourceItem.six+',\n'+content:content;
                                            break;
                                        }
                                    case 6:
                                        if(sourceItem.seven){
                                            sourceItem.seven=sourceItem.seven ?sourceItem.seven+',\n'+content:content;
                                            break;
                                        }
                                }
                                return sourceItem
                            };
                            dataSource[position[0]]=getInfo(this.allData[i],dataSource[position[0]]);
                            // dataSource[position[0]-1]=getInfo(this.allData[i],dataSource[position[0]-1]);
                        }
                    }
                    for(let i=0;i<this.tableData.length;i++){
                        // console.log(i,this.tableData[i]);
                        if(dataSource[i]===undefined){
                            // console.log(i);
                            let pushData={
                                one:"",
                                two:"",
                                three:"",
                                four:"",
                                five:"",
                                six:"",
                                seven:"",
                            }
                            dataSource[i]=pushData;
                        }
                    }
                    console.log(dataSource);
                    for(let i=0;i<this.tableData.length;i++){
                        this.tableData[i].one=dataSource[i].one;
                        this.tableData[i].two=dataSource[i].two;
                        this.tableData[i].three=dataSource[i].three;
                        this.tableData[i].four=dataSource[i].four;
                        this.tableData[i].five=dataSource[i].five;
                        this.tableData[i].six=dataSource[i].six;
                        this.tableData[i].seven=dataSource[i].seven;
                    }
                    console.log(this.tableData);
                    this.$set(this.tableData);
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
            //排课详情查看
            arrangeClass(){
                this.$router.push(`/schedule/detail/index?planId=${this.planId}`)
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
