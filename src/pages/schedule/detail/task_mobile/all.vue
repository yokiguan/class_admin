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
                    <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px" @click="studentContrast">查看学生冲突</button>
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
            </a-row>
            <a-table :rowKey="'key'"
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :bordered="true"
                    style="margin-top: 20px;width:1200px;white-space: pre"/>
        </a-card>
        <a-modal :visible="contrastModal"
                 :closable="false">
            <template slot="footer">
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <div class="title"><h3 style="color: white;padding-top: 8px;margin-left: 15px">查看学生冲突(共{{pagination.total}}名学生发生冲突)</h3></div>
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
                columns,
                tableData:[],
                stuColumns,
                stuTableData:[],
                visible: false,
                loading:false,
                planId:"",
                planData:"",
                allData:[],
                contrastModal:false,
                scheduleTaskId:"",
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
        async created() {
           this.chooseCourseInfo();
           this.allLookInfo();
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
            //获取整体查看数据
            async allLookInfo(){
                let {data:{result,success}}=await this.$api.schedule.classTask.getData({planId:this.planId,scheduleTaskId:this.scheduleTaskId})
                // console.log(result[0]);
                this.allData=result[0].syllabus;
                // console.log(this.allData);
                //创建数组
                let dataSource=[];
                for(let i=0;i<this.allData.length;i++){
                    let position = eval(this.allData[i].position);
                    const getInfo=(dataItem,sourceItem={})=>{
                        if(!sourceItem) sourceItem={}
                        let content = dataItem.subChildName +dataItem.classNumId +"_"+dataItem.teacherName+'(' + dataItem.classroomName + ')'+"共"+dataItem.classStuNum+"人";
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
                // console.log(dataSource);
                this.tableData=dataSource;
                // console.log(this.tableData);
                //编号
                for(let i=0;i<this.tableData.length;i++){
                    this.tableData[i].key=i+1;
                }
                console.log(this.tableData);
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
            //手动调课
            manualChangeClass(){
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
            //按场地查看
            placeLook(){
                this.$router.push(`/schedule/detail/task_mobile/room?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
            //按科目查看
            subjectLook(){
                this.$router.push(`/schedule/detail/task_mobile/course?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
            },
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
        height: 150px;
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        vertical-align: top;
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
    .title{
        height: 40px;
        background-color: #6Db5a7;
        border-radius: 5px;
    }
</style>
