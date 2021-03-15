<template>
    <div id="wrapper">
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">走班排课任务</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">学生调班</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="box">
            <a-card class="left">
                <a-row class="left_title">
                    <a-col :span="3"><a-icon type="reload" style="font-size: 1.5em;
                    font-weight: bold"/></a-col>
                    <a-col :span="12"><span style="font-size: 1.2em">刷新菜单</span></a-col>
                    <a-col><span style="font-size: 1.2em">全部展开</span></a-col>
                </a-row>
                <a-row>
                    <a-input-search placeholder="请输入学生姓名"  v-model="studentName" @search="onSearch" style="margin-top: 20px"/>
                </a-row>
                <div style="width: 100%; height: 1px;
            margin-top: 10px;
            border-top: solid black 1px;"></div>
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
                        <a-col><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                        <a-col :span="20"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px" @click="studentContrast">查看冲突</button></a-col>
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
                <div class="table-bg" v-if="showTable">
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
                        width: 110px" @click="subjectLook">按科目查看</button> </a-col>
                        <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px"  @click="studentLook">按学生查看</button></a-col>
                    </a-row>
                    <a-table :rowKey="'classId'"
                             :columns="columns"
                             :data-source="tableData"
                             :pagination="false"
                             :bordered="true"
                             style="margin-top: 20px;width:50%;">
                        <a-button slot="change" slot-scope="text,record,index" @click="change_class(record.subChildId,index)" style="background-color: #19b294;
                                      width: 80px;
                                      height: 40px;
                                      color:white">调班</a-button>
                    </a-table>
                </div>
            </div>
        </div>
        <!--                调班窗口-->
        <a-modal   :visible="visible"
                   :closable="false"
                   title="学生调班">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                     :selectedRows="selectedRows"
                     :columns="columns_class"
                     :data-source="classData"
                     :pagination="false"
                     :bordered="true"
                     style="">
            </a-table>
        </a-modal>
        <a-modal :visible="contrastModal"
                 :closable="false">
            <template slot="footer">
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <div class="right_title"><h3 style="color: white;padding-top: 8px;margin-left: 15px">查看学生冲突(共{{pagination.total}}名学生发生冲突)</h3></div>
            <a-table :rowKey="'id'"
                     :columns="stuColumns"
                     :data-source="stuTableData"
                     :pagination="pagination"
                     :bordered="true"
                     @change="handleTableChange"
                     style="margin-top: 20px;"/>
        </a-modal>
    </div>
</template>
<script>
    import {message} from "ant-design-vue";
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'subChildId',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            },
        },
        {
            title: '课程',
            dataIndex: 'subChildName',
            align: "center",
        },
        {
            title: '所分班级',
            dataIndex: 'class',
            align: "center",
        },
        {
            title: '操作',
            dataIndex: 'opt',
            scopedSlots: { customRender: 'change' },
            align:'center'
        },
    ];
    const columns_class = [
        {
            align: "center",
            title: " ",
            dataIndex: 'classId',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            },
        },
        {
            title: '课程班',
            dataIndex: 'className',
            align: "center",
        },
        {
            title: '人数',
            dataIndex: 'num',
            align: "center",
        },
        {
            title: '说明',
            dataIndex: 'info',
            align:'center'
        },
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
        },
    ]
    export default {
        data() {
            return {
                treeData:[],
                columns,
                tableData:[],
                columns_class,
                classData:[],
                planData:"",
                planId:"",
                scheduleTaskId:"",
                studentName:"",
                visible: false,
                loading: false,
                checkedKeys:[],
                lookSubId:"",
                editId:-1,
                selectedRowKeys: [], // Check here to configure the default column
                selectedRows:[],
                stuId:"",
                showTable:false,
                contrastModal:false,
                stuColumns,
                stuTableData:[],
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
                }
            },
            //学生树查询
            async treeInfo(){
                let {data}=await this.$api.schedule.classTask.getStudentList({planId:this.planId});
                console.log(data.result);
                this.treeData = [];
                for (let i in data.result) {
                    // 第一层
                    let numberTree = {}
                    //将Object转换为数组
                    let arr=Object.values(data.result[i].schWxUserEntity);
                    // let item = ;
                    // console.log(arr);
                    numberTree.title = arr[1];
                    numberTree.key = arr[2];
                    this.treeData.push(numberTree)
                }
                // console.log(this.treeData);
            },
            //根据学生姓名查询
            onSearch(value){
                console.log(value);
                this.nameInfo([value]);
                this.showTable=true;
            },
            //根据姓名查信息接口
            async nameInfo(value){
                let {data:{result,success}}=await this.$api.schedule.classTask.getStudent({planId:this.planId,name:value.toString()});
                console.log(result);
                let stuId=result[0].schWxUserEntity.wxUid;
                this.checkedKeys=stuId.split();
                // console.log(this.stuId);
                // console.log();
                this.onCheck();
            },
            //选择学生
            onCheck() {
                // console.log('onCheck', checkedKeys);
                this.stuId=this.checkedKeys.toString();
                console.log(this.stuId);
                this.studentInfo();
                this.showTable=true;
            },
            //学生调班接口查看
            async studentInfo(){
                this.tableData=[];
                let {data:{result,success}}=await this.$api.schedule.classTask.changeStuClass({
                    planId:this.planId,
                    scheduleTaskId:this.scheduleTaskId,
                    stuId:this.stuId})
                console.log(result);
                for(let i in result){
                    let pushData={
                        subChildId:result[i].subChildId,
                        subChildName: result[i].subChildName,
                        classId:result[i].classId,
                        class:result[i].subChildName+result[i].classNumId+"_"+result[i].teacherName+"("+result[i].classroomName+")",
                    }
                    // console.log(pushData);
                    this.tableData.push(pushData);
                }
                console.log(this.tableData);
            },
            //点击调班按钮
            change_class(id,index){
                this.visible = true;
                this.lookSubId=id;
                this.editId=index;
                this.conflictLook(id);
            },
            //调班查看接口
            async conflictLook(subId){
                let {data:{result,success}}=await this.$api.schedule.classTask.conflictInfo({
                    planId:this.planId,
                    scheduleTaskId:this.scheduleTaskId,
                    stuId:this.stuId,
                    subId:subId,
                });
                console.log(result);
                this.classData=result;
                console.log(this.classData);
            },
            //选择调课班级
            onSelectChange( selectedRowKeys,selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows=selectedRows
                console.log(this.selectedRowKeys);
                console.log(this.selectedRows);
            },
            //保存调课弹框
            handleOk(){
                this.visible=false;
                console.log(this.tableData[this.editId].classId);
                this.saveData();
            },
            //关闭调课弹框
            handleCancel () {
                this.visible = false;
                this.loading = false;
            },
            //获取保存接口
            async saveData(){
                console.log(this.selectedRows[0].classId);
                let addData={
                    planId:this.planId,
                    stuId:this.stuId,
                    scheduleTaskId:this.scheduleTaskId,
                    subId:this.lookSubId,
                    classConflict:this.tableData[this.editId].classId,
                    classId:this.selectedRows[0].classId,
                }
                console.log(addData);
                let {data}=await this.$api.schedule.classTask.saveClassData(addData);
                console.log(data);
                if(data&&data.success){
                    message.info("调换成功");
                    this.studentInfo();
                }else{
                    message.info("调换失败");
                }
            },
            //整体查看
            allLook(){
                this.$router.push(`/schedule/detail/task_mobile/all?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按老师查看
            teacherLook(){
                this.$router.push(`/schedule/detail/task_mobile/teacher?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按场地查看
            placeLook(){
                this.$router.push(`/schedule/detail/task_mobile/room?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按科目查看
            subjectLook(){
                this.$router.push(`/schedule/detail/task_mobile/course?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按学生查看
            studentLook(){
                this.$router.push(`/schedule/detail/task_mobile/student?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
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
        width: 22%;
        background-color: white;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
    }
    .right{
        border-radius: 5px;
        width: 77%;
    }
    .title{
        background-color: #fff;
        height: 110px;
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
    }
    .right_title{
        height: 40px;
        background-color: #6Db5a7;
        border-radius: 5px;
    }
</style>

