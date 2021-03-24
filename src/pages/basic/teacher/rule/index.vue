<template>
    <div id="wrapper" style="width:100%">
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item>基础设置</a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/basic/teacher/admin">教师</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="#">规则设置</router-link></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="box">
            <a-card class="left">
                <a-row style="width:100%">
                    <a-icon type="reload" style="font-size: 1.5em;font-weight: bold"/>
                    <span style="font-size: 1.2em;margin-left: 10px">刷新菜单</span>
                    <span style="font-size: 1.2em;margin-left: 10px">全部展开</span>
                </a-row>
                <div style="width: 100%; height: 1px;
            margin-top: 10px;
            border-top: solid black 1px;"></div>
                <a-tree :tree-data="treeData"
                        checkable
                        v-model="checkedKeys"
                        @check="onCheck"
                        style="font-size: 1.3em;"/>
            </a-card>
            <div class="right">
                <a-card class="class_content" v-if="showcomClass">
                    <a-row style="height: 40px;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;">
                        <a-col><span style="float: left;padding:10px">班级规则</span></a-col>
                    </a-row>
                    <a-row style="float: left;margin-top: 10px"><h3>{{this.teacherName}}老师：</h3></a-row>
                    <a-row><a-form-model :form="form" :label-col="{span:4}" :wrapper-col="{span:5}" >
                            <a-form-model-item label="选择授课年级/班级">
                                <a-tree-select v-model="form.grade"
                                               placeholder="请选择年级"
                                               style="width: 275px"
                                               :tree-data="gradeData"
                                               tree-checkable
                                               :checkedKeys="gradeCheckedKeys"
                                               @change="selectGrade"
                                               :show-checked-strategy="SHOW_PARENT">
                                </a-tree-select>
                            </a-form-model-item>
                        </a-form-model></a-row>
                </a-card>
                <a-card class="location_content" v-if="showcomLocation">
                    <a-row style="height: 40px;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;">
                        <a-col><span style="float: left;padding: 10px;">场地规则</span></a-col>
                    </a-row>
                    <a-form-model :modal="form" :label-col="{ span: 3 }" :wrapper-col="{ span:8}" >
                        <a-form-model-item label="选择课表模板">
                            <a-select @change="handleSelectChange" v-model="form.modal">
                                <a-select-option v-for="(modalName,index) in this.modalInfo" :value="modalName.id">
                                    {{modalName.templateName}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-form-model>
                    <a-button type="danger" style="width: 150px;margin-left: 600px;margin-top: -800px" @click="deleteRule">删除规则</a-button>
                    <a-row>
                        <a-table :rowKey="'ruleId'"
                                 :columns="columnsPlace"
                                 :bordered="true" :pagination="false"
                                 :data-source="placeData"
                                 :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                                 :selectedRows="selectedRows"
                                 style="width: 45%;margin-left: 50px;margin-top: 20px">
                            <span slot="action" slot-scope="text,record">
                                    <a  @click="lookInfo(record.ruleId)">查看</a>
                                </span>
                        </a-table>
                    </a-row>
                </a-card>
                <a-card class="curriculum_content" v-if="showcomCurriculum">
                    <a-row style="height: 40px;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;">
                        <a-col><span style="float: left;padding: 10px;">课表</span></a-col>
                    </a-row>
                    <a-row class="buttons-sub">
                        <a-button type="danger" style="color:white;width: 100px;height: 40px;float:left" @click="diasbleBtn">禁选</a-button>
                        <a-button style="background-color:grey;width: 100px;height: 40px;color:white;float:left;margin-left: 20px" @click="normalBtn">普通</a-button>
                        <a-button type="primary" style="color:white;width: 100px;height: 40px;margin-left: 20px;float:left;" @click="priorityBtn">优先</a-button></a-col>
                        <h3 style="float:left;margin-left: 20px">未设置默认为普通</h3>
                        <a-button style="background-color:#1abc9c;width: 100px;height: 40px;color:white" @click="saveData">保存</a-button>
                        <a-button style="background-color:#1abc9c;width: 100px;height: 40px;color:white;margin-left: 20px" @click="reSet">重置</a-button>
                    </a-row>
                    <div class="class-table">
                        <div class="table-header"><!-- 表头 -->
                            <div class="table-header_one"></div><!-- 左上角 -->
                            <div class="table-header_other" v-for="(item, index) in tableHeader">{{item}}</div>
                        </div>
                        <div class="table-body">
                            <div class="row-box" v-for="(item, rowIndex) in tableData" :key="rowIndex">
                                <div class="table-body_one">{{item.activity}}</div><!-- 第一列 -->
                                <!--                        :style="{ 'background-color': setColor(child) }"-->
                                <div class="table-body_other" v-for="(child, columnIndex) in item.rowList"
                                     :key="columnIndex + rowIndex + 1" :style="{ 'background-color': setColor(child) }"
                                     @click="getColumnRow(rowIndex,columnIndex)"></div>
                            </div><!-- 11个数据  -->
                        </div>
                    </div>
                    <a-modal
                            :visible='saveVisit'
                            :closable="false">
                        <template slot="footer">
                            <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                            <a-button key="back" @click="handleCancel">取消</a-button>
                        </template>
                        <a-form-model :model="form" :rules="rules" :label-col="{span:5}" :wrapper-col="{span:18}">
                            <a-form-model-item label="规则名称" prop="ruleName" ref="ruleName">
                                <a-input placeholder="请输入" v-model="form.ruleName"></a-input>
                            </a-form-model-item>
                        </a-form-model>
                    </a-modal>
                </a-card>
            </div>
        </div>
    </div>
</template>
<script>
    import {message} from "ant-design-vue"
    import { TreeSelect } from 'ant-design-vue';
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const columnsPlace=[
        {
            title:'序号',
            dataIndex:'ruleId',
            align:'center',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title:'规则名称',
            dataIndex:'name',
            align:'center',
        },
        {
            title:'包含教室数量',
            dataIndex:'number',
            align:'center',
        },
        {
            title:'操作',
            dataIndex:'opts',
            align:'center',
            scopedSlots: { customRender: 'action' },
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
                showcomClass:false,
                showcomCurriculum:false,
                showcomLocation:false,
                checkedKeys:[],
                classroomId:[],
                gradeCheckedKeys:[],
                gradeData:[],
                teacherName:"",
                SHOW_PARENT,
                form:{
                    ruleName:undefined,
                },
                columnsPlace,
                placeData:[],
                modelName:[],
                modalInfo:[],
                modalName:"",
                modalIds:"",
                selectedRowKeys: [],
                selectedRows:[],
                tableData:[],
                timeData:[],
                defaultRow: -1,
                defaultColumn: -1,
                cellCheck:[],
                //需要传到后端的数据
                settingLessonInfo:{},
                disableData:[],
                priorityData:[],
                disable:[],
                priority:[],
                tableHeader: ['星期一','星期二','星期三','星期四','星期五','星期六','星期天'],
                currId:"",
                saveVisit:false,
                loading:false,
                activity,
                ruleInfo: "",
                rules:{
                    ruleName:[
                        {
                            required:true,
                            message:"请输入规则名称",
                            trigger:"blur"
                        }
                    ]
                }
            };
        },
        created() {
            this.getData();
            this.grade();
            this.getModalInfo();
        },
        methods: {
            //获取数据
            async getData(){
                let {data:{result,success}}=await this.$api.basic.teacher.AdminGradeSubTec();
                // console.log(result);
                for(let i=0;i<result.length;i++){
                    //第一层(级部）
                    let adminTree={};
                    adminTree.title=result[i].adminName;
                    adminTree.key=result[i].adminId;
                    if(result[i].adminGrades.length){
                        //第二层(年级）
                        adminTree.children=[];
                        for(let j=0;j<result[i].adminGrades.length;j++){
                            let gradeItem=result[i].adminGrades[j];
                            let childData={}
                            childData.key=gradeItem.gradeId;
                            childData.title=gradeItem.gradeName;
                            if(gradeItem.subSubjectDtos.length){
                                //第三层(主课程)
                                childData.children=[];
                                for(let k in gradeItem.subSubjectDtos){
                                    let mainCourseItem=gradeItem.subSubjectDtos[k];
                                    let mainCourse={};
                                    mainCourse.key=mainCourseItem.subId;
                                    mainCourse.title=mainCourseItem.subName;
                                    if(mainCourseItem.teacherDtos){
                                        //第四层（教师）
                                        mainCourse.children=[];
                                        for (let l in mainCourseItem.teacherDtos){
                                            let teacher={};
                                            teacher.key=mainCourseItem.teacherDtos[l].teacherId;
                                            teacher.title=mainCourseItem.teacherDtos[l].teacherName;
                                            mainCourse.children.push(teacher)
                                        }
                                    }
                                    childData.children.push(mainCourse)
                                }
                            }
                            adminTree.children.push(childData);
                        }
                    }
                    this.treeData.push(adminTree);
                    // console.log(this.treeData);
                }
            },
            //获取年级班级信息
            async grade(){
                this.gradeData = []
                let {data:{result,success}}=await this.$api.basic.grade.fetchList();
                // console.log(result);
                for(let i in result){
                    //第一层（级部）
                    let adminData={};
                    adminData.title=result[i].adminName;
                    adminData.key=adminData.value=result[i].adminId;
                    if(result[i].adminGrades.length){
                        //第二层（年级）
                        adminData.children=[];
                        for(let j=0;j<result[i].adminGrades.length;j++){
                            let item=result[i].adminGrades[j];
                            let gradeData={};
                            gradeData.key=gradeData.value=item.gradeId;
                            gradeData.title=item.gradeName;
                            adminData.children.push(gradeData);
                        }
                    }
                    this.gradeData.push(adminData);
                }
                // console.log("this.gradeData",this.gradeData)
            },
            //选择老师
            onCheck(){
                console.log(this.checkedKeys);
                this.showcomClass=true;
                let classroomId=[];
                this.checkedKeys.forEach((item,index)=>{
                    // console.log(item);
                    // console.log(index);
                    for(let i=0;i<this.treeData.length;i++){
                        if(this.treeData[i].key!=item){
                            let grade=this.treeData[i].children
                            for(let j=0;j<grade.length;j++){
                                if(grade[i]!==item){
                                    let teacherData=grade[j].children;
                                    // console.log(teacherData);
                                    for(let k in teacherData){
                                        if(teacherData[k].key!==item){
                                            let pushData=teacherData[k].children;
                                            // console.log(pushData);
                                            for(let w in pushData){
                                                if(pushData[w].key===item){
                                                   this.teacherName=pushData[w].title;
                                                   classroomId.push(pushData[w].key);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.classroomId=classroomId;
                    // console.log(this.teacherName);
                    // console.log(classroomId);
                    // console.log(this.classroomId);
                })
            },
            //选择年级
            selectGrade(checkInfo){
                console.log(checkInfo);
                //选择模板界面弹出
                this.showcomLocation=true;
            },
            //获取课表模板信息
            async getModalInfo(){
                //获取课表模板信息
                let {data}=await this.$api.basic.template.fetchList()
                this.modalInfo=data.rows;
                console.log(this.modalInfo);
            },
            //选择课表模板
            async handleSelectChange(){
                this.showcomCurriculum=true;
                this.teacherRuleInfo();
                this.initData();
                this.settingInfo();
            },
            //查看场地规则信息
            async teacherRuleInfo(){
                let {data:{result,success}}=await this.$api.basic.teacher.fetchList({currId:this.form.modal});
                // console.log(result);
                this.placeData=result;
                // console.log(this.placeData);
            },
            //删除规则
            async deleteRule(){
                let {data}=await this.$api.basic.teacher.deleteRule({ids:[this.selectedRowKeys.toString()]});
                console.log(data);
                if(data&&data.success){
                    message.info('删除成功');
                    this.teacherRuleInfo();
                }else{
                    message.info("删除失败！");
                }
            },
            //复选框
            onSelectChange( selectedRowKeys,selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows=selectedRows
                console.log(this.selectedRowKeys);
                console.log(this.selectedRows);
            },
            //初始化课表
            async initData(){
                let {data}=await this.$api.basic.template.fetchTemplate({id:this.form.modal})
                console.log(data.result);
                this.currId= this.form.modal;
                let activities = [];
                let timeDatas = [];
                let list = [...this.activity];
                list.forEach(item => {
                    for (let i = 1; i <= data.result[item.value]; i++) {
                        activities.push({
                            activity: item.name + i,
                            value: item.value + i
                        });
                        timeDatas.push({
                            activity: item.name + i,
                            value: item.value + i,
                            // time: [moment(undefined), moment(undefined)]
                        });
                    }
                });
                this.tableData = activities;
                //设置单元格颜色未设置为-1
                for(let i in this.tableData) {
                    this.tableData[i].rowList = []
                    for(let index = 0; index < 7;index++){
                        let pushData = {
                            data: '',
                            defaultCheck: -1
                        }
                        this.tableData[i].rowList.push(pushData)
                    }
                }
                // console.log(this.tableData)
                this.timeData = timeDatas;
            },
            //数据刷新
            setStore(data) {
                let newData = JSON.parse(JSON.stringify(data))
                this.tableData = JSON.parse(JSON.stringify(newData))
            },
            //获取表格的行和列
            getColumnRow(row,column){
                //某一单元格被选中
                this.tableData[row].rowList[column].defaultCheck = 0
                this.defaultRow = row;
                this.defaultColumn = column;
                this.setStore(this.tableData);
                this.cellCheck.push([this.defaultRow,this.defaultColumn])
                // console.log(this.cellCheck);
            },
            //设置禁选按钮方法
            diasbleBtn(){
                let cellRow=-1;
                let cellColumn=-1;
                this.disableData=[];
                console.log(this.disableData);
                for(let i=0;i<this.cellCheck.length;i++){
                    cellRow=this.cellCheck[i][0];
                    cellColumn=this.cellCheck[i][1];
                    console.log(this.cellCheck[i][0])
                    console.log(this.cellCheck[i][1])
                    if(this.tableData[cellRow].rowList[cellColumn].defaultCheck === 0){
                        // 修改颜色为红色
                        this.tableData[cellRow].rowList[cellColumn].defaultCheck = 1
                    }
                    this.setStore(this.tableData);
                    if(this.tableData[cellRow].rowList[cellColumn].defaultCheck === 1){
                        this.disableData.push([cellRow,cellColumn])
                        console.log(this.disableData);
                    }
                }

            },
            //设置普通按钮方法
            normalBtn(){
                let cellRow=0;
                let cellColumn=0;
                //设置多选
                for(let i=0;i<this.cellCheck.length;i++){
                    cellRow=this.cellCheck[i][0];
                    cellColumn=this.cellCheck[i][1];
                    console.log(this.cellCheck[i][0])
                    console.log(this.cellCheck[i][1])
                    if(this.tableData[this.defaultRow].rowList[this.defaultColumn].defaultCheck === 0) {
                        // 修改颜色为绿色
                        this.tableData[this.defaultRow].rowList[this.defaultColumn].defaultCheck = -1
                    }
                }
                this.setStore(this.tableData)
            },
            //设置优先按钮方法
            priorityBtn(){
                let cellRow=0;
                let cellColumn=0;
                this.priorityData=[];
                console.log(this.priorityData);
                // console.log(this.cellCheck);
                for(let i=0;i<this.cellCheck.length;i++){
                    cellRow=this.cellCheck[i][0];
                    cellColumn=this.cellCheck[i][1];
                    // console.log(this.cellCheck[i][0])
                    // console.log(this.cellCheck[i][1])
                    if(this.tableData[cellRow].rowList[cellColumn].defaultCheck === 0){
                        // 修改颜色为绿色
                        this.tableData[cellRow].rowList[cellColumn].defaultCheck = 3
                        this.priorityData.push([cellRow,cellColumn])
                    }
                    this.setStore(this.tableData)
                    console.log(this.priorityData);
                }
            },
            //颜色设置
            setColor(child){
                let cellCheck = child.defaultCheck;
                // console.log(cellCheck)
                let color = '#fff'
                switch (cellCheck) {
                    case 0:
                        color = '#ccc'
                        break
                    case 1:
                        color = 'red'
                        break
                    case 2:
                        color = '#fff'
                        break
                    case 3:
                        color = '#13c2c2'
                        break
                    default:
                        color = '#fff'
                }
                return color
            },
            //settingInfo显示
            async settingInfo(){
                // console.log(this.tableData)
                //字符串转化为数组
                this.priority=eval(this.ruleInfo.priority);
                this.disable=eval(this.ruleInfo.disable);
                // console.log(this.priority);
                // console.log(this.priority.length);
                // console.log(this.disable);
                // console.log(this.disable.length);
                //后端获取数据的显示
                let getRRow=0;
                let getRColumn=0;
                for (let i in this.disable){
                    getRRow=this.disable[i][0];
                    getRColumn=this.disable[i][1];
                    // console.log(getRRow);
                    // console.log(getRRow);
                    this.tableData[getRRow].rowList[getRColumn].defaultCheck = 1;
                }
                this.disableData.push([getRRow,getRColumn]);
                console.log(this.disableData);
                let getGRow=0;
                let getGColumn=0;
                for (let j in this.priority){
                    getGRow=this.priority[j][0];
                    getGColumn=this.priority[j][1];
                    // console.log(getGRow);
                    // console.log(getGColumn);
                    this.tableData[getGRow].rowList[getGColumn].defaultCheck = 3;
                }
                this.priorityData.push([getGRow,getGColumn]);
                console.log(this.priorityData);
            },
            //教师规则的详细查看
            //场地规则查看
            async lookInfo(id){
                this.initData();
                let {data:{result,success}}=await this.$api.basic.teacher.fetchRule({ruleId:id});
                console.log(result);
                this.ruleInfo=result[0].ruleInfo;
                console.log(this.ruleInfo);
                this.settingInfo();
                this.getModalInfo();
            },
            //打开输入规则弹框
            saveData(){
                this.saveVisit=true;
            },
            //重置
            reSet(){
                this.initData();
            },
            //保存场地规则
            async handleOk(){
                // console.log(this.classroomId);
                let addData={
                    teacherIds:this.classroomId,
                    teacherRuleEntity:{
                        currId:this.currId,
                        name:this.form.ruleName,
                        ruleInfo:{
                            disable: JSON.stringify(this.disableData),
                            priority:JSON.stringify(this.priorityData),
                        }
                    }
                }
                console.log(addData);
                let {data}=await this.$api.basic.teacher.saveRule(addData);
                console.log(data);
                if(data&&data.success){
                    this.saveVisit=false;
                    this.teacherRuleInfo();
                    this.initData();
                }else{
                    message.info("保存失败！");
                }
            },
            //关闭规则弹框
            handleCancel(){
                this.saveVisit=false;
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
        width: 20%;
        background-color: white;
        border-radius: 10px;
        display: flex;
        min-height: 800px;
    }
    .right{
        border-radius: 5px;
        width: 79%;
    }
    /*.title{*/
    /*    width: 100%;*/
    /*    background-color: #fff;*/
    /*    height: 170px;*/
    /*    padding: 20px 25px;*/
    /*    border-radius: 10px;*/
    /*    margin-bottom: 50px;*/
    /*}*/
    .class_content{
        height:190px;
        background-color: white;
        border-radius: 5px;
        padding: 20px 25px;
        text-align: center;
        width: 100%;
    }
    .location_content{
        background-color: white;
        margin-top: 10px;
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        min-height: 440px;
    }
    .curriculum_content{
        background-color: white;
        margin-top: 10px;
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        min-height: 800px;
    }
    /*.buttons{*/
    /*    margin:0px 5px 20px 5px;*/
    /*    padding:2px 4px;*/
    /*    margin-left: 30px;*/
    /*}*/
    .buttons button{
        width: 110px;
        height: 45px;
        color:white;
    }
    .buttons-sub{
        margin-top: 10px;
        padding:2px 4px;
    }
    .class-table{
        width: 93%;
        height: auto;
        border: 1px solid;
        border-color: #f0f0f0;
        margin-left: 50px;
        margin-top: 30px;
    }
    .table-header{
        height: 53.33px;
        display: flex;
        border-bottom: 1px solid;
        border-color: #f0f0f0;
    }
    .table-header_one{
        flex: 12.5%;
        align:center;
        padding-top: 15px;
        border-right: 1px solid;
        border-color: #f0f0f0;
    }
    .table-header_other{
        flex: 12.5%;
        align:center;
        border-right: 1px solid;
        border-color: #f0f0f0;
        padding-top: 15px;
        font-weight: bold;
    }
    .table-body{
        display: flex;
        flex-direction: column;
    }
    .row-box {
        display: flex;
    }
    .row-box div {
        flex: 1;
        border-bottom: 1px solid #f0f0f0;
    }
    .row-box:last-child {
        border-bottom: none;
    }
    .table-body_one{
        height: 54px;
        border-right: 1px solid;
        border-color: #f0f0f0;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_other{
        height: 54px;
        border-right: 1px solid;
        border-color: #f0f0f0;
    }
    .table-body_other:last-child{
        border-right: none;
    }
</style>

