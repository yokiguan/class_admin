<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">行政班排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">课节设置</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                <a-col>
                    <button style="background-color: blue;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 100px" @click="back">返回</button>  </a-col>
            </a-row>
        </div>
        <!-- /result -->
        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="subjectSetting" >学科设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="classSetting">班级设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="ruleSetting">规则设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <a-row class="buttons-sub">
                <a-col :span="3"><a-button type="danger" style="color:white;width: 100%;height: 30px;" @click="diasbleBtn">禁选</a-button></a-col>
                <a-col :span="3"><a-button style="background-color:grey;width: 100px;height: 30px;color:white" @click="normalBtn">普通</a-button></a-col>
                <a-col :span="3"><a-button type="primary" style="color:white;width: 100px;height: 30px;" @click="priorityBtn">优先</a-button></a-col>
                <a-col :span="3"><a-button style="background-color:#0099cc;width: 100px;height: 30px;color:white" @click="classBtn">走班课</a-button></a-col>
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
            <button style="background-color: blue;color: white;height: 40px;border: none;border-radius: 5px;margin-top: 50px;width: 100px" @click="Next">
                下一步
            </button>
        </div>
    </div>
</template>
<script>
    import moment from "moment";
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
                count:1,
                defaultRow: -1,
                defaultColumn: -1,
                cellCheck:[],
                //需要传到后端的数据
                disableData:[],
                priorityData:[],
                settingLessonInfo:{},
                disable:[],
                priority:[],
                classData:[],
                tableData:[],
                tableHeader: ['星期一','星期二','星期三','星期四','星期五','星期六','星期天'],
                planData:"",
                visible: false,
                loading: false,
                planId:"",
                activity,
                timeData:[],
                modalId:"",
                count:0,
            };
        },
        async created() {
            let queryString = (window.location.hash || " ").split('?')[1]
            let planId = (queryString || " ").split('=')[1]
            this.planId = planId;
            if (planId) {
                //获取单个选课计划的信息
                let {data: {result, success}} = await this.$api.schedule.plan.schedulegetInfo({planId})
                this.planData = result.name
            }
            //课节设置查看
            let {data:{result,success}}=await this.$api.schedule.arrangeClass.getLesson({planId})
            console.log(result);
            this.modalId=result.currId;
            // console.log(result.lessonMax)
            this.tableData4=result.lessonMax;
            console.log(this.tableData4);
            // for(let i=0;i<this.tableData4.length;i++){
            //     this.tableData4[i].id=i;
            //     this.selectUseMax[i]=this.tableData4[i].useMax;
            // }
            this.tableData4.forEach((item,i)=>{
                item.id=i
            })
            // console.log(this.tableData4);
            this.settingLessonInfo=result.settingLessonInfo;
            // console.log(this.settingLessonInfo.disable);
            this.modalInfo();
        },
        methods: {
            //获取课表模板相关信息
            async modalInfo() {
                let {data}=await this.$api.basic.template.fetchTemplate({id:this.modalId})
                console.log(data.result);
                this.currId=this.modalId;
                // console.log(this.currId);
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
                            time: [moment(undefined), moment(undefined)]
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
                this.settingInfo();
            },
            //数据刷新
            setStore (data) {
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
                let cellRow=0;
                let cellColumn=0;
                //设置多选
                for(let i=0;i<this.cellCheck.length;i++){
                    cellRow=this.cellCheck[i][0];
                    cellColumn=this.cellCheck[i][1];
                    console.log(this.cellCheck[i][0])
                    console.log(this.cellCheck[i][1])
                    if(this.tableData[cellRow].rowList[cellColumn].defaultCheck === 0){
                        // 修改颜色为红色
                        this.tableData[cellRow].rowList[cellColumn].defaultCheck = 1
                        this.disableData.push([cellRow,cellColumn]);
                    }
                    this.setStore(this.tableData);
                    //如果禁选，则存入disableData
                    // if(this.tableData[cellRow].rowList[cellColumn].defaultCheck === 1){
                    //     this.disableData.push([cellRow,cellColumn])
                    //     console.log(this.disableData);
                    // }
                    console.log(this.disableData);
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
                console.log(this.cellCheck);
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
            //设置走班课按钮
            classBtn(){
                let cellRow=0;
                let cellColumn=0;
                console.log(this.cellCheck);
                for(let i=0;i<this.cellCheck.length;i++) {
                    cellRow = this.cellCheck[i][0];
                    cellColumn = this.cellCheck[i][1];
                    // console.log(this.cellCheck[i][0])
                    // console.log(this.cellCheck[i][1])
                    if (this.tableData[cellRow].rowList[cellColumn].defaultCheck === 0) {
                        // 修改颜色为蓝色
                        this.tableData[cellRow].rowList[cellColumn].defaultCheck = 4
                        this.classData.push([cellRow, cellColumn])
                    }
                    this.setStore(this.tableData)
                    console.log(this.classData);
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
                    case 4:
                        color='#0099cc'
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
                this.priority=eval(this.settingLessonInfo.priority);
                this.disable=eval(this.settingLessonInfo.disable);
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
                    this.tableData[getRColumn].rowList[getRRow].defaultCheck = 1;
                }
                this.disableData.push([getRColumn,getRRow]);
                console.log(this.disableData);
                let getGRow=0;
                let getGColumn=0;
                for (let j in this.priority){
                    getGRow=this.priority[j][0];
                    getGColumn=this.priority[j][1];
                    // console.log(getGRow);
                    // console.log(getGColumn);
                    this.tableData[getGColumn].rowList[getGRow].defaultCheck = 3;
                }
                this.priorityData.push([getGColumn,getGRow]);
                console.log(this.priorityData);
            },
            //课时设置
            timesSetting(){
                this.$router.push(`/schedule/detail/class_admin/index?planId=${this.planId}`)
            },
            //课节设置
            oncesSetting(){
                this.$router.push(`/schedule/detail/class_admin/time?planId=${this.planId}`)
            },
            //学科设置
            subjectSetting(){
                this.$router.push(`/schedule/detail/class_admin/course?planId=${this.planId}`)
            },
            //班级设置
            classSetting(){
                this.$router.push(`/schedule/detail/class_admin/class?planId=${this.planId}`)
            },
            //规则设置
            ruleSetting(){
                this.$router.push(`/schedule/detail/class_admin/rule?planId=${this.planId}`)
            },
            //开始排课
            startArray(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            //下一步
            Next(){
                this.$router.push(`/schedule/detail/class_admin/course?planId=${this.planId}`);
                this.saveInfo();
            },
            //保存
            async saveInfo(){
                let addData={
                    planId:this.planId,
                    currId:this.currId,
                    settingLessonInfo:{
                        disable: JSON.stringify(this.disableData),
                        priority:JSON.stringify(this.priorityData),
                        // class:JSON.stringify(this.classData),
                    },
                }
                let {data}=await this.$api.schedule.arrangeClass.saveLesson(addData);
                console.log(data);
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
        height: 300px;
        background-color: white;
        height: 100px;
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
    }
    .buttons{
        margin:5px 5px 20px 5px;
        padding:2px 4px;
    }
    .buttons button{
        background-color:#e4e4e4;
        color:black;
    }
    .buttons-sub{
        margin:5px 5px 20px 5px;
        padding:2px 4px;
    }
    .time1{
        width: 100%;
        height: 30px;
        padding-top:5px;
        background-color: #d9d9d9;
    }
    .class-table{
        width: 93%;
        height: auto;
        border: 1px solid;
        border-color: #f0f0f0;
        margin-left: 50px;
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
        /*width: 13.5%;*/
        height: 54px;
        border-right: 1px solid;
        border-color: #f0f0f0;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_other{
        /*width: 13.5%;*/
        height: 54px;
        border-right: 1px solid;
        border-color: #f0f0f0;
        /*background-color: red;*/
    }
    .table-body_other:last-child{
        border-right: none;
    }
</style>
