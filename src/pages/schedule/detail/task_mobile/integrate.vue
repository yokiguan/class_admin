<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">走班排课任务</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">手动调课</a></a-breadcrumb-item>
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
            <a-row style="margin-top: 10px"><button style="background-color: #19b294;
                        color: white;
                        height: 35px;
                        border: none;
                        border-radius: 3px;
                        width: 150px">查看调课记录</button></a-row>
        </div>
        <a-card class="table-bg">
            <div class="class-table">
                <div class="table-header"><!-- 表头 -->
                    <div class="table-header_one"></div><!-- 左上角 -->
                    <div class="table-header_other" v-for="(item, index) in tableHeader">{{item}}</div>
                </div>
                <div class="table-body">
                    <div class="row-box" v-for="(item, rowIndex) in tableData" :key="rowIndex">
                        <div class="table-body_one">{{item.key}}</div><!-- 第一列 -->
                        <div class="table-body_two" @click="choose(rowIndex,1)">
                            {{item.one}}
                            <button class="bottom" @click="change">调换</button>
                        </div><!-- 第一列 -->
                        <div class="table-body_three" @click="choose(rowIndex,2)">
                            {{item.two}}
                            <button class="bottom" @click="change">调换</button>
                        </div><!-- 第一列 -->
                        <div class="table-body_four" @click="choose(rowIndex,3)">
                            {{item.three}}
                            <button class="bottom" @click="change">调换</button>
                        </div><!-- 第一列 -->
                        <div class="table-body_five" @click="choose(rowIndex,4)">
                            {{item.four}}
                            <button class="bottom" @click="change">调换</button>
                        </div><!-- 第一列 -->
                        <div class="table-body_six" @click="choose(rowIndex,5)">
                            {{item.five}}
                            <button class="bottom" @click="change">调换</button>
                        </div><!-- 第一列 -->
<!--                        <div class="table-body_other" v-for="(child, columnIndex) in item.rowList"-->
<!--                             :key="columnIndex + rowIndex + 1" :style="{ 'background-color': setColor(child) }"-->
<!--                             @click="getColumnRow(rowIndex,columnIndex)"></div>-->
<!--                    </div>&lt;!&ndash; 11个数据  &ndash;&gt;-->
                    </div>
                </div>
            </div>
        </a-card>
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
            scopedSlots: { customRender: 'change' },
        },
        {
            title: '二',
            dataIndex: 'two',
            align: "center",
            scopedSlots: { customRender: 'change' },
        },
        {
            title: '三',
            dataIndex: 'three',
            align: "center",
            scopedSlots: { customRender: 'change' },
        },
        {
            title: '四',
            dataIndex: 'four',
            align: "center",
            scopedSlots: { customRender: 'change' },
        },
        {
            title: '五',
            dataIndex: 'five',
            align: "center",
            scopedSlots: { customRender: 'change' },
        },
    ];
    export default {
        data() {
            return {
                columns,
                tableData:[],
                tableHeader: ['星期一','星期二','星期三','星期四','星期五'],
                planId:"",
                planData:"",
                scheduleTaskId:"",
                allData:[],
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
                    console.log(result);
                }
            },
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
                        let content = dataItem.subChildName +dataItem.classNumId + '(' + dataItem.classroomName + ')';
                        const column=eval(dataItem.position)[1];
                        switch (column) {
                            case 1:
                                sourceItem.one=sourceItem.one ?sourceItem.one+",\n"+content:content;
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
            //返回
            back(){
                this.$router.go(-1)
            },
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
    .change{
        display: flex;
        align-items:center;
        flex-direction: column;
    }
    .top{
        margin-bottom:40px;
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
        border: 1px solid;
        border-color: #f0f0f0;
        margin-left: 50px;
        padding:10px;

    }
    .table-header{
        height: 53.33px;
        display: flex;
        border-bottom: 1px solid;
        border-color: #f0f0f0;
        border:1px solid;

    }
    .table-header_one{
        flex: 12.5%;
        align:center;
        padding-top: 15px;
        border-right: 1px solid;
        border-color: black;
    }

    .table-header_other{
        flex: 12.5%;
        align:center;
        border-right: 1px solid;
        border-color: black;
        padding-top: 15px;
        font-weight: bold;
    }
    .table-body{
        display: flex;
        flex-direction: column;
        white-space: pre;
        border-bottom:1px solid;
        border-color: black;
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
        border-color: black;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_two{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: black;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_three{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: black;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_four{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: black;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_five{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: black;
        padding-top: 15px;
        flex-direction: column;
    }
    .table-body_six{
        /*width: 13.5%;*/
        border-right: 1px solid;
        border-top:1px solid;
        border-color: black;
        padding-top: 15px;
        flex-direction: column;
    }

    /*.table-body_other{*/
    /*    !*width: 13.5%;*!*/
    /*    height: 54px;*/
    /*    border-right: 1px solid;*/
    /*    border-color: #f0f0f0;*/
    /*    !*background-color: red;*!*/
    /*}*/
    /*.table-body_other:last-child{*/
    /*    border-right: none;*/
    /*}*/
</style>
