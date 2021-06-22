<template>
    <div id="wrapper" style="width: 100%">
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/schedule/template">排课计划</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><span @click="arrangeClass">排课详情</span></a-breadcrumb-item>
                <a-breadcrumb-item><span @click="adminTask">行政班排课任务</span></a-breadcrumb-item>
                <a-breadcrumb-item><a href="#">老师课表</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="box">
            <a-card class="left">
                <a-row style="width: 100%">
                    <a-icon type="reload" style="font-size: 1.5em;font-weight: bold"/>
                    <span style="font-size: 1.2em;margin-left: 10px">刷新菜单</span>
                    <span style="font-size: 1.2em;margin-left: 10px;float: right">全部展开</span>
                </a-row>
                <div style="margin-top: 10px;height:1px;border-top: solid black 1px;"/>
                    <a-tree v-model="checkedKeys"
                            :tree-data="treeData"
                            @select="onCheck"
                            style="font-size: 1.3em;"/>
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
                    <a-table :rowKey="'activity'"
                             v-if="showTable"
                             :columns="columns"
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
    import {message} from "ant-design-vue";
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
                gradeId:"",
                currId:"",
                activity,
            };
        },
        created() {
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
                    this.gradeName=result.gradeName;
                    this.gradeId=result.gradeId;
                    console.log(this.gradeId);
                    this.currId=result.currId;
                }
                this.treeTeacher();
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
                this.teacherInfo();
            },
            onCheck(checkedKeys) {
                console.log('onCheck', checkedKeys);
                this.checkedKeys=checkedKeys;
                this.modalInfo(this.currId);
            },
            //获取左侧的教室树
            async treeTeacher(){
                console.log(this.gradeId);
                //根据年级信息调用接口
                let {data}=await this.$api.schedule.adminTask.lookTeacher({gradeId:this.gradeId});
                console.log(data);
                let addData=[];
                this.treeData=[];
                let allData=data.rows;
                console.log(allData);
                for(let i=0;i<allData.length;i++){
                    let pushData={};
                    pushData.title=allData[i].teacherName;
                    pushData.key=allData[i].teacherId;
                    this.treeData.push(pushData);
                }
                console.log(this.treeData);
            },
            //教师课表查看
            async teacherInfo() {
                let {data} = await this.$api.schedule.adminTask.teacherTable({
                    planId: this.planId,
                    scheduleTaskId: this.scheduleTaskId,
                    teacherId: this.checkedKeys.toString(),
                });
                // console.log(this.allData);
                console.log(data.success);
              if(data.success==false){
                  message.info(data.message);
              }else{
                  console.log(data.result);
                  this.allData=data.result.teacherCurriDtos;
                  let dataSource=[];
                  this.showTable=true;
                  for(let i=0;i<this.allData.length;i++){
                      let position=eval(this.allData[i].position);
                      const getInfo=(dataItem,sourceItem={})=>{
                          if(!sourceItem) sourceItem={};
                          let content =this.gradeName+dataItem.subChildName +"_"+this.gradeName+dataItem.className;
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
                  console.log(this.tableData);
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
            //排课详情查看
            arrangeClass(){
                this.$router.push(`/schedule/detail/index?planId=${this.planId}`)
            },
            //排课任务查看
            adminTask(){
                this.$router.push(`/schedule/detail/task_admin/index?planId=${this.planId}`)
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
        background-color: #fff;
        min-height: 670px;
    }
</style>

