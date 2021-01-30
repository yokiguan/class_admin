<template>
    <a-card class="curriculum_content">
        <a-row style="height: 40px;width: 1300px;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;margin-left: -35px;margin-top: -30px">
            <a-col>
                <span style="float: left;padding: 10px;">课表</span>
            </a-col>
        </a-row>
        <a-row class="buttons-sub">
            <a-button type="danger" style="color:white;width: 100px;height: 40px;float:left" @click="diasbleBtn">禁选</a-button>
            <a-button style="background-color:grey;width: 100px;height: 40px;color:white;float:left;margin-left: 20px" @click="normalBtn">普通</a-button>
            <h3 style="float:left;margin-left: 20px">未设置默认为普通</h3>
            <a-button style="background-color:#1abc9c;width: 100px;height: 40px;color:white" @click="saveData">保存</a-button>
            <a-button style="background-color:#1abc9c;width: 100px;height: 40px;color:white;margin-left: 20px">重置</a-button>
            <a-button type="danger" style="color:white;width: 100px;height: 40px;margin-left: 20px">删除</a-button>
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
</template>
<script>
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
        data(){
            return{
                tableData:[],
                timeData:[],
                defaultRow: -1,
                defaultColumn: -1,
                cellCheck:[],
                //需要传到后端的数据
                disableData:[],
                tableHeader: ['星期一','星期二','星期三','星期四','星期五','星期六','星期天'],
                currId:"",
                saveVisit:false,
                loading:false,
                activity,
                form:{
                    ruleName:undefined,
                },
                rules:{
                    ruleName:[
                        {
                            required:true,
                            message:"请输入规则名称",
                            trigger:"blur"
                        }
                    ]
                }
            }
        },
        props:['templateId'],
        watch:{
            'templateId':{
                handler(val){
                    console.log("templateId val",val)
                    this.initData()
                },
                immediate:true
            }
        },
        methods:{
            async initData(){
                console.log("this.tem",this.templateId)
                let {data}=await this.$api.basic.template.fetchTemplate({id:this.templateId})
                console.log(data.result);
                this.currId= this.templateId
                console.log(this.templateId);
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
                if(this.tableData[this.defaultRow].rowList[this.defaultColumn].defaultCheck === 0){
                    // 修改颜色为绿色
                    this.tableData[this.defaultRow].rowList[this.defaultColumn].defaultCheck = -1
                }
                this.setStore(this.tableData)
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
            async saveData(){
                this.saveVisit=true;
                //保存场地规则
                // let addData={
                //     currId:
                //     name:
                //
                // }
                let {data}=await this.$api.basic.classroom.saveRule(addData);
            },
            handleOk(){},
            handleCancel(){
                this.saveVisit=false;
            },
        }
    }
</script>
<style lang="less" scoped>
    .curriculum_content{
        background-color: white;
        margin-top: 10px;
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        min-height: 800px;
    }
    .buttons{
        margin:0px 5px 20px 5px;
        padding:2px 4px;
        margin-left: 30px;
    }
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
