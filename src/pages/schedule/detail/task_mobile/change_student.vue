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
                       <a-input-search placeholder="请输入老师姓名"  v-model="studentName" @search="onSearch" style="margin-top: 20px"/>
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
                           <a-col ><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                           <a-col>
                               <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px" @click="back">返回</button>
                           </a-col>
                           <a-col><span style="font-size: 1.2em ">XXX-101</span></a-col>
                       </a-row>
                   </div>
                   <div class="table-bg">
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
                       <a-table
                               :columns="columns"
                               :data-source="tableData"
                               :pagination="false"
                               :bordered="true"
                               style="margin-top: 20px;width:50%;">
                           <a-button slot="change"
                                     @click="change_class"
                                     style="background-color: #19b294;
                                      width: 80px;
                                      height: 40px;
                                      color:white">调班</a-button>
                       </a-table>
                   </div>
               </div>
           </div>
            <!--                调班窗口-->
            <create-modal
                    :visible="visible"
                    :loading="loading"
                    @modalClosed="closed"
                    @modalSubmit="handleSubmit">
                <div slot="content">
                    <div class="title" style="width:520px;height: 50px;
                        margin-top:-24px;
                        margin-left:-24px;
                        border-radius: 3px;
                        background-color: #6Db5a7">
                        <h4 style="color: white">学生调班</h4>
                    </div>
                    <div class="content_table">
                        <a-table
                                :columns="columns_class"
                                :data-source="classData"
                                :pagination="false"
                                :bordered="true"
                                :cell-style="changeCellStyle"
                                style="">
                            <a-checkbox slot="radio" @change="onChange">
                            </a-checkbox>
                        </a-table>
                    </div>
                </div>
            </create-modal>
    </div>
</template>
<script>
    import CreateModal from "../../../../components/modal/CreateModal";
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
        },
        {
            title: '课程',
            dataIndex: 'subject',
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
    const tableData=[
        {
            key: '1',
            subject:'物理选考',
            class:'物理选考1班_吴昊(108)'
        },
        {
            key: '2',
            subject:'政治选考',
            class:'政治选考2班_李援朝(202)'
        },
        {
            key: '3',
            class:'政治选考1班_李援朝(106)'
        },{
            key:'4',
            class:'政治选考3班_李援朝(108)'
        },{
            key:'5'
        }
    ];
    const columns_class = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
            scopedSlots: { customRender: 'radio' },
        },
        {
            title: '课程班',
            dataIndex: 'subject',
            align: "center",
        },
        {
            title: '人数',
            dataIndex: 'number',
            align: "center",
        },
        {
            title: '说明',
            dataIndex: 'text',
            align:'center'
        },
    ];
    const classData=[
        {
            subject:'物理选考3班_吴昊(308)',
            number:'27',
            text:'当前所在班级'
        },
        {
            subject:'物理选考1班_吴昊(108)',
            number:'30',
            text:'与生物学考1班有时间冲突'
        },
        {
            subject:'物理选考2班_吴昊(308)',
            number:'36',
            text:'与生物学考2班有时间冲突'
        },{
            subject:'物理选考4班_吴昊(308)',
            number:'38',
            text:'与生物学考3班有时间冲突'
        },{
            subject:'物理选考5班_赵海涛(308)',
            number:'21',
            text:'可调'
        },
    ];
    export default {
        components: {CreateModal},
        data() {
            return {
                treeData:[],
                columns,
                tableData,
                columns_class,
                classData,
                planData:"",
                planId:"",
                scheduleTaskId:"",
                studentName:"",
                visible: false,
                loading: false,
                checkedKeys:[],
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
            onCheck(checkedKeys, info) {
                console.log('onCheck', checkedKeys, info);
            }, //学生树查询
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
                    console.log(arr);
                    numberTree.title = arr[1];
                    numberTree.key = arr[2];
                    this.treeData.push(numberTree)
                }
                console.log(this.treeData);
            },
            //根据学生姓名查询
            onSearch(value){
                console.log(value);
                this.nameInfo([value]);
            },
            //根据姓名查信息接口
            async nameInfo(value){
                let {data:{result,success}}=await this.$api.schedule.classTask.getStudent({planId:this.planId,name:value.toString()});
                console.log(result);
                let subId=result[0].schWxUserEntity.wxUid;
                console.log(subId);
                this.conflictLook(subId);
            },
            //选择学生
            onCheck(checkedKeys) {
                console.log('onCheck', checkedKeys);
                let stuId=checkedKeys.toString();
                this.conflictLook(stuId);
            },
            //课表查看接口
            async conflictLook(stuId){
              let {data}=await this.$api.schedule.classTask.conflictInfo({planId:this.planId,scheduleTaskId:this.scheduleTaskId,stuId:stuId});
              console.log(data);
            },

            change_class: function () {
                this.visible = true;
            },
            change() {
                this.visible = true;
            },
            closed () {
                this.visible = false
                this.loading = false
            },
            handleSubmit: function () {
                const that = this
                console.log(that.$refs.createForm)
                that.loading = true
                setTimeout(() => {
                    that.visible = false
                    that.loading = false
                }, 2000)
            },
            changeCellStyle (row, column, rowIndex, columnIndex) {
                if(columnIndex === "1 "){
                    return 'background-color: blue'  // 修改的样式
                }else{
                    return ''
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
            //返回
            back(){
                this.$router.go(-1)
            },
            onChange(){},

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
</style>

