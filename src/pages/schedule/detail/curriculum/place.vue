<template>
    <div id="wrapper" style="width:100%">
        <div style="width:100%">
            <div class="result">
                <a-breadcrumb>
                    <a-breadcrumb-item>首页</a-breadcrumb-item>
                    <a-breadcrumb-item><router-link to="/schedule/template">排课计划</router-link></a-breadcrumb-item>
                    <a-breadcrumb-item><span @click="arrangeClass">排课详情</span></a-breadcrumb-item>
                    <a-breadcrumb-item><a href="#">教室课表</a></a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <div class="left">
                <a-row class="left_title">
                    <a-col :span="3"><a-icon type="reload" style="font-size: 1.5em;font-weight: bold"/></a-col>
                    <a-col :span="12"><span style="font-size: 1.2em">刷新菜单</span></a-col>
                    <a-col><span style="font-size: 1.2em">全部展开</span></a-col>
                </a-row>
                <div style="width: 100%; height: 1px;margin-top: 10px;border-top: solid black 1px;"/>
                <a-tree :tree-data="treeData"
                        v-model="checkedKeys"
                        @select="onCheck"
                        style="font-size: 1.3em;"/>
            </div>
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
                             :rowKey="'activity'"
                            :columns="columns"
                            :data-source="tableData"
                            :pagination="false"
                            :bordered="true"
                            style="margin-top: 20px;width:75%;white-space:pre">
                    </a-table>
                </a-card>
            </div>
        </div>
    </div>
</template>
<script>
    import {message} from "ant-design-vue";
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
                treeData:[],
                columns,
                tableData:[],
                checkedKeys:[],
                planData:"",
                planId:"",
                showTable:false,
                activity,
                currId:"",
            };
        },
        created() {
            this.chooseCourseInfo();
            this.treeInfo();
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
                    this.currId=result.currId;
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
                this.classroomInfo();
            },
            //教室树形列表查询
            async treeInfo() {
                let {data} = await this.$api.schedule.classTask.getClassList({planId: this.planId});
                console.log(data.result);
                this.treeData = [];
                for (let i in data.result) {
                    // 第一层
                    let numberTree = {}
                    numberTree.title = data.result[i].name;
                    numberTree.key = data.result[i].buildingId;
                    if (data.result[i].classroomEntities.length) {
                        //    第二层
                        numberTree.children = []
                        for (let j = 0; j < data.result[i].classroomEntities.length; j++) {
                            let item = data.result[i].classroomEntities[j]
                            let childData = {}
                            childData.key = item.roomId;
                            childData.title = item.name;
                            numberTree.children.push(childData)
                        }
                    }
                    this.treeData.push(numberTree)
                    console.log(this.treeData);
                }
            },
            //教室选择
            onCheck(checkedKeys) {
             this.checkedKeys=checkedKeys;
             console.log(this.checkedKeys);
             this.modalInfo(this.currId)
            },
            //教室设置查看
            async classroomInfo(){
                let {data}=await this.$api.schedule.table.placeTable({
                    planId:this.planId,classroomId:this.checkedKeys.toString()});
                console.log(data.result);
               if(data.success==false){
                    message.info(data.message);
               }else{
                   this.allData=data.result.classroomCurriDtos;
                   console.log(this.allData);
                   this.showTable=true;
                   let dataSource=[];
                   for(let i=0;i<this.allData.length;i++){
                       let position=eval(this.allData[i].position);
                       const getInfo=(dataItem,sourceItem={})=>{
                           if(!sourceItem) sourceItem={};
                           // let content = dataItem.subChildName +dataItem.classNumId + '(' + dataItem.classroomName + ')';
                           let content = dataItem.subChildName +dataItem.classNumId+"_"+dataItem.teacherName;
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
    .left{
        width: 300px;
        height: 900px;
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 10px;
    }
    .right{
        border-radius: 5px;
        margin-top: -935px;
        margin-left: 320px;
    }
    .title{
        width: 100%;
        background-color: #fff;
        height: 140px;
        padding: 20px 25px;
        border-radius: 10px;
        margin-top: 35px;
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

