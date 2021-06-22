<template>
    <div id="wrapper" style="width:100%">
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/schedule/template">排课计划</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><span @click="arrangeClass">排课详情</span></a-breadcrumb-item>
                <a-breadcrumb-item><span @click="arrayTask">走班排课任务</span></a-breadcrumb-item>
                <a-breadcrumb-item><a href="#">课程查看</a></a-breadcrumb-item>
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
                            @select="onCheck"
                            style="font-size: 1.3em;"/>
                </div>
            </a-card>
            <div class="right">
                <div class="title">
                    <a-row>
                        <a-col :span="15"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                        <a-col :span="5"><button style="background-color: #19b294;color: white;height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px" @click="deletPublic">删除已发布课表</button></a-col>
                        <button style="background-color: #19b294;color: white;height: 40px;border: none;
                        border-radius: 5px;width: 150px" @click="back">返回</button>
                    </a-row>
                    <a-row style="margin-top: 20px">
                        <button @click="studentContrast" style="background-color: #19b294;
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
        <!--        查看学生冲突弹框-->
        <a-modal :visible="contrastModal"
                 :closable="false">
            <template slot="footer">
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <div class="class_title"><h3 style="color: white;padding-top: 8px;margin-left: 15px">查看学生冲突(共{{pagination.total}}名学生发生冲突)</h3></div>
            <a-table :rowKey="'id'"
                     :columns="stuColumns"
                     :data-source="stuTableData"
                     :pagination="pagination"
                     :bordered="true"
                     @change="handleTableChange"
                     style="margin-top: 20px">
                <template slot="operation" slot-scope="text,record,index">
                    <a-button type="primary" @click="lookInfo(index)">查看</a-button>
                </template>
            </a-table>
        </a-modal>
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
    const stuColumns=[
        {
            title:'',
            dataIndex:'id',
            align:'center',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title:'学生',
            dataIndex:'studentName',
            align:'center',
        },
        {
            title:'课程班',
            dataIndex:'course',
            align:'center'
        },
        {
            title:'说明',
            dataIndex:'information',
            align:'center'
        },{
            title:'操作',
            dataIndex:'opt',
            align:'center',
            scopedSlots:{customRender:"operation"}
        },
    ];
    export default {
        data() {
            return {
                treeData:[],
                columns,
                tableData:[],
                activity,
                planData:"",
                planId:"",
                scheduleTaskId:"",
                showTable:false,
                checkedKeys:[],
                allData:[],
                stuColumns,
                stuTableData:[],
                contrastModal:false,
                currId:"",
                pagination:{
                    total:0,    //默认的总数据条数，在后台获取列表成功之后对其进行赋值
                    pageSize:20,    //默认每页显示的数据总数
                    showSizeChanger:true,
                    onShowSizeChange:(current,pageSize)=>{
                        this.pageSize=pageSize
                    },
                    showTotal:total=>`共有${total}条数据`,
                },
                //查询参数
                queryParam:{
                    page:1,//第几页
                    size:20,   //每页中显示的数据条数
                },
            };
        },
        created() {
            this.chooseCourseInfo();
            this.courseInfo();
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
                    this.currId=result.currId;
                }
            },
            //获取课表模板相关信息
            async modalInfo(currId) {
                // console.log(currId);
                this.tableData=[];
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
            },
            //课程树查看
            async courseInfo(){
              let {data:{result,success}}=await this.$api.schedule.classTask.getCourseList({planId:this.planId,scheduleTaskId:this.scheduleTaskId});
              console.log(result);
              this.treeData=[];
              for(let i=0;i<result.length;i++){
                  let numberTree={};
                  numberTree.title=result[i].subChildName+result[i].classNumId;
                  numberTree.key=result[i].subChildId+','+result[i].classId;
                  this.treeData.push(numberTree);
              }
              // console.log(this.treeData);
            },
            //选择课程
            onCheck(checkedKeys) {
                console.log('onCheck', checkedKeys);
                let arr=Object.values(checkedKeys);
                console.log(arr);
                let courseData=arr[0].toString();
                console.log(courseData);
                let subChildId= courseData.split(',')[0];
                console.log(subChildId);
                let classId=courseData.split(',')[1];
                console.log(classId);
                this.modalInfo(this.currId);
                this.courseLookInfo(subChildId,classId);
                this.showTable=true;
            },
            //课程课表查看
            async courseLookInfo(subChildId,classId){
                let {data:{result,success}}=await this.$api.schedule.classTask. courseLook({
                    planId:this.planId,
                    scheduleTaskId:this.scheduleTaskId,
                    subChildId:subChildId,classId:classId});
                console.log(result);
                this.allData=result.subjectCurriDtoList;
                console.log(this.allData);
                let dataSource=[];
                for(let i=0;i<this.allData.length;i++){
                    let position=eval(this.allData[i].position);
                    const getInfo=(dataItem,sourceItem={})=>{
                        if(!sourceItem) sourceItem={};
                        // let content = dataItem.subChildName +dataItem.classNumId + '(' + dataItem.classroomName + ')';
                        let content = dataItem.subChildName +dataItem.classNumId+"_"+dataItem.teacherName+'(' +  dataItem.classroomName + ')'+"共"+dataItem.classStuNum+"人";
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
            },
            //查看学生冲突
            studentContrast(){
                this.contrastModal=true;
                this.lookConflict();
            },
            //查看学生冲突接口
            async lookConflict(){
                let {data}=await this.$api.schedule.classTask.contrastLook({rowCount: this.queryParam.size,current:this.queryParam.page,planId:this.planId,scheduleTaskId:this.scheduleTaskId});
                let addData=[];
                console.log(data);
                addData=data.rows;
                console.log(addData);
                for(let i=0;i<addData.length;i++){
                    let course = (addData[i].info || " ").split('---')[0];
                    // console.log(course);
                    let information = (addData[i].info || " ").split('---')[1];
                    // console.log(information);
                    let pushData={
                        id:addData[i].id,
                        stuId:addData[i].schWxUserEntity.wxUid,
                        studentName:addData[i].schWxUserEntity.userName,
                        course:course,
                        information:information,
                    }
                    this.stuTableData.push(pushData);
                }
                console.log(this.stuTableData);
                const pagination={...this.pagination};
                pagination.total=data.total;
                this.pagination=pagination;
            },
            //表格监听
            async handleTableChange(pagination) {
                this.pagination.current = pagination.current;
                this.pagination.pageSize = pagination.pageSize;
                this.queryParam.page = pagination.current;
                this.queryParam.size = pagination.pageSize;
                console.log(this.pagination.current)
                console.log(this.pagination.pageSize);
                this.lookConflict();
            },
            //关闭学生冲突弹框
            handleCancel(){
                this.contrastModal=false;
            },
            //学生冲突详细信息查看
            lookInfo(id){
                console.log(id);
                console.log(this.stuTableData[id].stuId);
                let stuId=this.stuTableData[id].stuId
                this.$router.push(`/schedule/detail/task_mobile/change_student?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}&stuId=${stuId}`);
            },
            //手动调课
            changeCourse(){
                this.$router.push(`/schedule/detail/task_mobile/integrate?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //学生调班
            changClass(){
                this.$router.push(`/schedule/detail/task_mobile/change_student?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            teacherLook(){
                this.$router.push(`/schedule/detail/task_mobile/teacher?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //整体查看
            allLook(){
                this.$router.push(`/schedule/detail/task_mobile/all?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按场地查看
            placeLook(){
                this.$router.push(`/schedule/detail/task_mobile/room?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
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
                this.$router.push(`/schedule/detail/index?planId=${this.planId}`);
            },
            //走班排课任务
            arrayTask(){
                this.$router.push(`/schedule/detail/task_mobile/index?planId=${this.planId}`)
            }
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
        min-height: 670px;
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
        margin-top: -35px;
        background-color: #fff;
        min-height: 670px;
    }
    .class_title{
        height: 40px;
        background-color: #6Db5a7;
        border-radius: 5px;
    }
</style>

