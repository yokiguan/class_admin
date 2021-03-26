<template>
    <div id="wrapper" style="width: 100%">
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item>基础设置</a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/basic/classroom/admin">教室管理</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="#">规则设置</router-link></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <a-card class="right">
            <a-card class="location_content" v-if="showcomLocation">
                <a-row style="height: 40px;width:100%;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;margin-left: -35px;margin-top: -30px"><span style="float: left;padding: 10px;">场地规则</span></a-row>
                <a-form :modal="form" :label-col="{ span: 3}" :wrapper-col="{ span:8}" style="margin-top: 20px">
                    <a-form-item label="选择课表模板" ref="modal" prop="modal">
                        <a-select v-model="form.modal" placeholder="请选择课表模板" @change="handleSelectChange">
                            <a-select-option v-for="(modalName,index) in this.modalInfo" :value="modalName.id">
                                {{modalName.templateName}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </a-card>
            <a-card class="curriculum_content" v-if="showcomCurriculum">
                <a-row style="height: 40px;width: 100%;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black">
                    <a-col>
                        <span style="float: left;padding: 10px;">课表</span>
                    </a-col>
                </a-row>
                <a-row class="buttons-sub">
                    <a-button type="danger" style="color:white;width: 100px;height: 40px;float:left" @click="diasbleBtn">禁选</a-button>
                    <a-button style="background-color:grey;width: 100px;height: 40px;color:white;float:left;margin-left: 20px" @click="normalBtn">普通</a-button>
                    <h3 style="float:left;margin-left: 20px">{{this.reguleName}}</h3>
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
                <a-modal :visible='saveVisit'
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
                showcomLocation:true,
                showcomCurriculum:false,
                adminClass:"",
                modelName:[],
                modalInfo:[],
                modalName:"",
                modalIds:"",
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
                ruleInfo: "",
                reguleName:"",
                classRoomId:"",
                ruleId:"",
                form:{
                    modal:" ",
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
                },
            };
        },
        async created(){
            this.classroomId();
            this.getModalInfo();
        },
        methods: {
            //获取教室Id
            async classroomId(){
                let queryString = (window.location.hash || " ").split('?')[1]
                let classRoomId = (queryString || " ").split('=')[1]
                this.classRoomId = classRoomId;
                console.log(this.classRoomId);
            },
            //获得课表模板信息
            async getModalInfo(){
                //获取课表模板信息
                let {data}=await this.$api.basic.template.fetchList()
                this.modalInfo=data.rows;
                // console.log(this.modalInfo);
            },
            //选择课表模板
            handleSelectChange(){
                this.showcomCurriculum=true;
                this.placeInfo(this.form.modal);
                this.initData();
            },
            //场地规则查看
            async placeInfo(currId){
                this.reguleName="";
                this.ruleInfo="";
                this.ruleId="";
              let {data}=await this.$api.basic.classroom.fetchRule({
                  currId:currId,
                  roomId:this.classRoomId
              });
              if(data&&data.success){
                  console.log(data.result);
                  this.reguleName=data.result.name;
                  this.ruleInfo=data.result.ruleInfo;
                  this.ruleId=data.result.ruleId;
                  this.settingInfo();
              }else{
                  message.warning(data.message);
              }
            },
            //查看课表信息
            async settingInfo(){
                // console.log(this.tableData)
                this.disableData=[];
                //字符串转化为数组
                console.log(this.ruleInfo);
                this.disable=eval(this.ruleInfo);
                console.log(this.disable);
                // console.log(this.disable.length);
                //后端获取数据的显示
                let getRRow=0;
                let getRColumn=0;
                for (let i in this.disable){
                    console.log(this.disable[i][0]);
                    console.log(this.disable[i][1]);
                    getRRow=this.disable[i][0];
                    getRColumn=this.disable[i][1];
                    // console.log(getRRow);
                    // console.log(getRRow);
                    this.tableData[getRRow].rowList[getRColumn].defaultCheck = 1;
                    this.disableData.push([getRRow,getRColumn]);
                }
                console.log(this.disableData);
            },
            //获取课表的具体信息
            async initData(){
                let {data}=await this.$api.basic.template.fetchTemplate({id:this.form.modal})
                console.log(data.result);
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
                    console.log(this.disableData);
                }
                this.cellCheck=[];
            },
            //设置普通按钮方法
            normalBtn(){
                let cellRow=0;
                let cellColumn=0;
                //设置多选
                for(let i=0;i<this.cellCheck.length;i++){
                    cellRow=this.cellCheck[i][0];
                    cellColumn=this.cellCheck[i][1];
                    // console.log(this.cellCheck[i][0])
                    // console.log(this.cellCheck[i][1])
                    if(this.tableData[cellRow].rowList[cellColumn].defaultCheck === 0) {
                        // 修改颜色为白色
                        this.tableData[cellRow].rowList[cellColumn].defaultCheck = -1
                        for(let j in this.disableData){
                            // console.log(this.disableData);
                            let row=this.disableData[j][0];
                            let col=this.disableData[j][1];
                            // console.log(row);
                            // console.log(col);
                            if(cellRow==row && cellColumn==col){
                                console.log("删除元素下标"+j);
                                console.log("删除元素个数"+this.cellCheck.length);
                                this.disableData.splice(j,1);
                                console.log(this.disableData);
                            }
                        }
                    }
                }
                console.log(this.disableData);
                this.setStore(this.tableData);
                this.cellCheck=[];
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
                    default:
                        color = '#fff'
                }
                return color
            },
            //重置
            reSet(){
                this.initData();
            },
            //打开弹框
            saveData(){
                this.saveVisit=true;
                if(this.reguleName!=""){
                    this.form.ruleName=this.reguleName;
                }
            },
            async handleOk(){
               console.log(this.disableData);
                //保存场地规则
                let addData={};
                if(this.ruleId==""){
                    addData={
                        classroomIds: [this.classRoomId],
                        classroomRuleEntity:{
                            name:this.form.ruleName,
                            currId:this.form.modal,
                            number:1,
                            ruleInfo:JSON.stringify(this.disableData),
                        }
                    }
                }else{
                    addData={
                        classroomIds:[this.classRoomId],
                        classroomRuleEntity:{
                            ruleId:this.ruleId,
                            name:this.form.ruleName,
                            currId:this.form.modal,
                            number:1,
                            ruleInfo:JSON.stringify(this.disableData),
                        }
                    }
                }
                console.log(addData);
                let {data}=await this.$api.basic.classroom.saveRule(addData);
                console.log(data);
                this.saveVisit = false;
                if(data&&data.success){
                    message.success("保存成功");
                    this.reguleName=this.form.ruleName;
                    this.form.ruleName=="";
                    this.placeInfo(this.form.modal);
                }else{
                    message.error("保存失败！");

                }
            },
            //取消
            handleCancel(){
                this.saveVisit=false;
                this.form.ruleName=="";
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
    .right{
        border-radius: 5px;
        width:100%;
    }
    .location_content{
        background-color: white;
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        min-height: 100px;
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
