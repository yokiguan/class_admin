<template>
    <div id="wrapper" style="width: 600px">
        <div style="width: 1800px">
            <div class="result">
                <a-breadcrumb>
                    <a-breadcrumb-item>首页</a-breadcrumb-item>
                    <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                    <a-breadcrumb-item><a href="">走班排课任务</a></a-breadcrumb-item>
                    <a-breadcrumb-item><a href="">教室查看</a></a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <div class="left">
                <a-row class="left_title">
                    <a-col :span="3"><a-icon type="reload" style="font-size: 1.5em;
                    font-weight: bold"/></a-col>
                    <a-col :span="12"><span style="font-size: 1.2em">刷新菜单</span></a-col>
                    <a-col><span style="font-size: 1.2em">全部展开</span></a-col>
                </a-row>
                <div style="width: 100%; height: 1px;margin-top: 10px;border-top: solid black 1px;"></div>
                <a-tree v-model="checkedKeys"
                        :tree-data="treeData"
                        checkable
                        @check="onCheck"
                        style="font-size: 1.3em;"/>
            </div>
            <div class="right">
                <div class="title">
                    <a-row>
                        <a-col :span="12"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                        <a-col :span="3"><button style="background-color: #19b294;color: white;height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px" @click="deletPublic">删除已发布课表</button></a-col>
                        <button style="background-color: #19b294;color: white;height: 40px;border: none;
                        border-radius: 5px;width: 150px" @click="back">返回</button>
                    </a-row>
                    <a-row style="margin-top: 20px">
                        <a-col :span="5"><span style="font-size: 1.2em ">高二2019-2020第一学期排课计划A</span></a-col>
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
                        width: 110px" @click="teacherLook">按老师查看</button></a-col>
                        <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="subjectLook">按科目查看</button></a-col>
                    </a-row>
                    <a-table
                            :columns="columns"
                            :data-source="tableData"
                            :pagination="false"
                            :bordered="true"
                            style="margin-top: 20px;width:75%;height:100% ">
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
                columns,
                tableData:[],
                planId:"",
                planData:"",
                scheduleTaskId:"",
                disabled: false,
                checkedKeys: [],
                treeData:[],
                allData:[],
                showTable:false,
                classroom:"",

            };
        },
        watch:{
            checkedKeys(val) {
                console.log('watchDataOfKeys', val);
            },
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
                let classroomId=[];
                this.checkedKeys.forEach((item,index)=>{
                    console.log(item);
                    console.log(index);
                    let parentNode=this.treeData.filter(child=>child.key===item)
                    console.log(parentNode);
                    if(parentNode.length>0&&Object.prototype.hasOwnProperty.call(parentNode[0],'children')){
                        parentNode[0].children.forEach(chr=>{
                            console.log(chr.key);
                            classroomId.push(chr.key);
                        });
                    }else if(parentNode.length==0){
                        console.log(item);
                        classroomId.push(item);
                    }
                })
                console.log(classroomId);
                // 去除重复的
                for(let i=0;i<classroomId.length-1;i++){
                    for(let j=i+1;j<classroomId.length;j++){
                        if(classroomId[i]==classroomId[j]){
                            classroomId[j]=classroomId[j+1];
                            classroomId.length=classroomId.length-1
                        }
                    }
                }
                console.log(classroomId);
                this.checkedKeys=classroomId;
                console.log(this.checkedKeys);
                console.log(this.treeData);
                for(let i=0;i<this.treeData.length;i++){
                    let teacherData=this.treeData[i].children;
                    for(let j=0;j<teacherData.length;j++){
                        if(teacherData[j].key===this.checkedKeys.toString()){
                            this.classroom=teacherData[j].title;
                        }
                    }
                }
                this.classroomInfo();
                // console.log( this.classroom)
                this.showTable=true;
            },
            //教室设置查看
            async classroomInfo(){
              let {data:{result,success}}=await this.$api.schedule.classTask.getClassroomList({planId:this.planId,scheduleTaskId:this.scheduleTaskId,classroomId:this.checkedKeys.toString()});
              this.allData=result.classroomCurriDtos;
              console.log(this.allData);
              let dataSource=[];
              for(let i=0;i<this.allData.length;i++){
                  let position=eval(this.allData[i].position);
                  const getInfo=(dataItem,sourceItem={})=>{
                      if(!sourceItem) sourceItem={};
                      // let content = dataItem.subChildName +dataItem.classNumId + '(' + dataItem.classroomName + ')';
                      let content = dataItem.subChildName +dataItem.classNumId+"_"+dataItem.teacherName+'(' +  this.classroom + ')'+"共"+dataItem.classStuNum+"人";
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
                //编号
                for(let i=0;i<this.tableData.length;i++){
                    this.tableData[i].key=i+1;
                }
                console.log(this.tableData);

            },
            //手动调课
            changeCourse(){
                this.$router.push(`/schedule/detail/task_mobile/integrate?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //学生调班
            changClass(){
                this.$router.push(`/schedule/detail/task_mobile/change_student?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按老师查看
            teacherLook(){
                this.$router.push(`/schedule/detail/task_mobile/teacher?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //整体查看
            allLook(){
                this.$router.push(`/schedule/detail/task_mobile/all?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按科目查看
            subjectLook(){
                this.$router.push(`/schedule/detail/task_mobile/course?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //删除已发布课表
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
    .left{
        width: 13%;
        height: 900px;
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 10px;
    }
    .right{
        border-radius: 5px;
        margin-top: -955px;
        float: right;
        width: 86%;
    }
    .title{
        background-color: #fff;
        height: 170px;
        padding: 20px 25px;
        border-radius: 10px;
        margin-top: 35px;
        margin-bottom: 50px;
        width: 100%;
    }
    .table-bg{
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        margin-top: -35px;
        width: 100%;
        background-color: #fff;
    }
</style>

