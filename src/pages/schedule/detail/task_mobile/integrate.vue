<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/schedule/template">排课计划</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><span @click="arrangeClass">排课详情</span></a-breadcrumb-item>
                <a-breadcrumb-item><span @click="arrayTask">走班排课任务</span></a-breadcrumb-item>
                <a-breadcrumb-item><a href="#">手动调课</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
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
            <!--            <a-row style="margin-top: 10px"><button style="background-color: #19b294;-->
            <!--                        color: white;-->
            <!--                        height: 35px;-->
            <!--                        border: none;-->
            <!--                        border-radius: 3px;-->
            <!--                        width: 150px">查看调课记录</button></a-row>-->
        </div>
        <a-card class="table-bg">
            <div class="class-table">
                <div class="table-header"><!-- 表头 -->
                    <div class="table-header_one"></div><!-- 左上角 -->
                    <div class="table-header_other" v-for="(item, index) in tableHeader">{{item}}</div>
                </div>
                <div class="table-body">
                    <div class="row-box" v-for="(item,rowIndex) in tableData" :key="rowIndex">
                        <div class="table-body_one">{{item.activity}}</div>
                        <!-- 第一列 -->
                        <div class="table-body_two" @click="choose(rowIndex,0)" :class="{chooseCell:rowIndex===firstRow&&firstCol===0}">
                            <span>{{item.one}}</span>
                            <button class="bottom" @click="change(rowIndex,0)">调换</button>
                        </div><!-- 第二列 -->
                        <div class="table-body_three" @click="choose(rowIndex,1)" :class="{chooseCell:rowIndex===firstRow&&firstCol===1}">
                            <span>{{item.two}}</span>
                            <button class="bottom" @click="change(rowIndex,1)">调换</button>
                        </div><!-- 第三列 -->
                        <div class="table-body_four" @click="choose(rowIndex,2)" :class="{chooseCell:rowIndex===firstRow&&firstCol===2}">
                            <span>{{item.three}}</span>
                            <button class="bottom" @click="change(rowIndex,2)">调换</button>
                        </div><!-- 第四列 -->
                        <div class="table-body_five" @click="choose(rowIndex,3)" :class="{chooseCell:rowIndex===firstRow&&firstCol===3}" >
                            <span>{{item.four}}</span>
                            <button class="bottom" @click="change(rowIndex,3)">调换</button>
                        </div><!-- 第五列 -->
                        <div class="table-body_six" @click="choose(rowIndex,4)" :class="{chooseCell:rowIndex===firstRow&&firstCol===4}">
                            <span>{{item.five}}</span>
                            <button class="bottom" @click="change(rowIndex,4)">调换</button>
                        </div>
                        <div class="table-body_seven" @click="choose(rowIndex,5)" :class="{chooseCell:rowIndex===firstRow&&firstCol===5}">
                            <span>{{item.six}}</span>
                            <button class="bottom" @click="change(rowIndex,5)">调换</button>
                        </div>
                        <div class="table-body_eight" @click="choose(rowIndex,6)" :class="{chooseCell:rowIndex===firstRow&&firstCol===6}">
                            <span>{{item.seven}}</span>
                            <button class="bottom" @click="change(rowIndex,6)">调换</button>
                        </div>
                    </div>
                </div>
            </div>
        </a-card>
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
    export default {
        data() {
            return {
                tableData:[],
                activity,
                tableHeader: ['星期一','星期二','星期三','星期四','星期五','星期六','星期天'],
                planId:"",
                planData:"",
                scheduleTaskId:"",
                allData:[],
                firstRow:-1,
                firstCol:-1,
                tableId:"",
                firstRows:-1,
            };
        },
        created() {
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
                console.log(this.tableData);
                this.allLookInfo();
            },
            //课表查看
            async allLookInfo(){
                let {data}=await this.$api.schedule.classTask.getData({planId:this.planId,
                    scheduleTaskId:this.scheduleTaskId})
                console.log(data);
                if(data.success==false){
                    message.info(data.code);
                }else{
                    this.tableId=data.result[0].id;
                    this.allData=data.result[0].syllabus;
                    console.log(this.allData);
                    //创建数组
                    let dataSource=[];
                    for(let i=0;i<this.allData.length;i++){
                        let position = eval(this.allData[i].position);
                        const getInfo=(dataItem,sourceItem={})=>{
                            if(!sourceItem) sourceItem={}
                            let content = dataItem.subChildName +dataItem.classNumId + '(' + dataItem.classroomName + ')';
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
                    //代码合并
                    // for(let i=0;i<this.tableData.length;i++){
                    //     this.tableData[i].one=[];
                    //     this.tableData[i].two=[];
                    //     this.tableData[i].three=[];
                    //     this.tableData[i].four=[];
                    //     this.tableData[i].five=[];
                    //     this.tableData[i].six=[];
                    //     this.tableData[i].seven=[];
                    //     this.tableData[i].one.push({
                    //         one:dataSource[i].one,
                    //         showButton:false,
                    //     });
                    //     this.tableData[i].two.push({
                    //         two:dataSource[i].two,
                    //         showButton:false,
                    //     });
                    //     this.tableData[i].three.push({
                    //         three:dataSource[i].three,
                    //         showButton:false,
                    //     });
                    //     this.tableData[i].four.push({
                    //         four:dataSource[i].four,
                    //         showButton:false,
                    //     });
                    //     this.tableData[i].five.push({
                    //         five:dataSource[i].five,
                    //         showButton:false,
                    //     });
                    //     this.tableData[i].six.push({
                    //         six:dataSource[i].six,
                    //         showButton:false,
                    //     });
                    //     this.tableData[i].seven.push({
                    //         seven:dataSource[i].seven,
                    //         showButton:false,
                    //     });
                    //
                    // }
                    // console.log(this.tableData);
                    // for(let i=0;i<this.tableData.length;i++){
                    //     console.log(this.tableData[i].one[0].one);
                    //     console.log(this.tableData[i].two[0].two);
                    //     console.log(this.tableData[i].three[0].three);
                    //     console.log(this.tableData[i].four[0].four);
                    //     console.log(this.tableData[i].five[0].five);
                    //     console.log(this.tableData[i].six[0].six);
                    //     console.log(this.tableData[i].seven[0].seven);
                    // }
                    this.$set(this.tableData);
                }
            },
            //选择单元格
            choose(rowIndex,colIndex){
                console.log(rowIndex);
                this.firstRows=rowIndex;
                console.log(colIndex);
                this.firstRow=rowIndex;
                this.firstCol=colIndex;
                // if(this.firstCol===-1||this.firstRow===-1){
                //
                // }
                // message.info("已选中的单元格("+rowIndex+","+colIndex+")");
            },
            //调换
            async change(row,col){
                let changPos=[[ this.firstRows,this.firstCol],[row,col]];
                console.log(JSON.stringify(changPos));
                let {data}=await this.$api.schedule.classTask.manualClass({id:this.tableId,info:JSON.stringify(changPos)});
                console.log(data);
                if(data&&data.success){
                    this.allLookInfo();
                    message.success("调换成功！");
                }else{
                    message.error("调换失败！");
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
    }
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
        height: 150px;
        background-color: white;
        height: 130px;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        vertical-align: top;
        border-radius: 5px;
    }
    .table-bg{
        background-color: white;
        margin: -10px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
        text-align: center;
        width: 100%;
    }
    .bottom{
        display: flex;
        background-color: #19b294;
        color: white;
        width: 42px;
        height: 25px;
        margin-bottom: 0px;
        border: 0px;
        border-radius: 5px;
        /*padding: center;*/
    }
    .class-table{
        width: 93%;
        height: auto;
        /*border: 1px solid;*/
        /*border-color: #f0f0f0;*/
        margin-left: 50px;
        padding:10px;
    }
    .table-header{
        height: 53.33px;
        display: flex;
        border:1px solid #f0f0f0;
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
        white-space: pre;
        border-bottom:1px solid;
        border-color: #f0f0f0;
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
        border-right: 1px solid;
        border-left: 1px solid;
        border-top:1px solid;
        border-color: #f0f0f0;
        padding-top: 90px;
        flex-direction: column;
    }
    .table-body_two{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: #f0f0f0;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_three{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: #f0f0f0;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_four{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: #f0f0f0;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_five{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: #f0f0f0;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_six{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: #f0f0f0;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_seven{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: #f0f0f0;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_eight{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: #f0f0f0;
        padding-top: 15px;
        flex-direction: column;
    }
    .bottom{
        margin-left: 35px;
        margin-top: 5px;
        margin-bottom: 5px;
    }
    .chooseCell{
        background-color:#c2f2f2;
    }
</style>
