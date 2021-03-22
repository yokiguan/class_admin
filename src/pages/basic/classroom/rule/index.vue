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
        <div class="box">
                <a-card class="left">
                    <a-row style="width:100%">
                        <a-icon type="reload" style="font-size: 1.5em;font-weight: bold"/>
                        <span style="font-size: 1.2em;margin-left: 10px">刷新菜单</span>
                        <span style="font-size: 1.2em;margin-left: 10px">全部展开</span>
                    </a-row>
                    <div style="width: 100%; height: 1px;margin-top: 10px;border-top: solid black 1px;"/>
                    <a-tree :tree-data="buildingsData"
                            checkable
                            v-model="checkedKeys"
                            @check="onCheck"
                            style="font-size: 1.3em;"/>
                </a-card>
                <div class="right">
                    <a-card class="location_content" v-if="showcomLocation">
                        <a-row style="height: 40px;width:100%;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;margin-left: -35px;margin-top: -30px">
                            <span style="float: left;padding: 10px;">场地规则</span>
                        </a-row>
                        <a-form :modal="form" :label-col="{ span: 3}" :wrapper-col="{ span:8}" >
                            <a-form-item label="选择课表模板" ref="modal" prop="modal">
                                <a-select v-model="form.modal" placeholder="请选择课表模板" @change="handleSelectChange">
                                    <a-select-option v-for="(modalName,index) in this.modalInfo" :value="modalName.id">
                                        {{modalName.templateName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                       <a-col :span="3"><a-button type="danger" style="width: 150px;margin-left: 600px;margin-top: -800px" @click="deleteRule">删除规则</a-button></a-col>
                        <a-row>
                            <a-table :rowKey="'ruleId'" :columns="columnsPlace"
                                     :bordered="true" :pagination="false"
                                     :data-source="placeData"
                                     :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                                     :selectedRows="selectedRows"
                                     style="width: 50%;margin-left: 50px;margin-top: 20px">
                                <span slot="action" slot-scope="text,record">
                                    <a  @click="lookInfo(record.ruleId)">查看</a>
                                </span>
                            </a-table>
                        </a-row>
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
                </div>
            </div>
    </div>
</template>
<script>
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
                buildingsData:[],
                columnsPlace,
                placeData:[],
                checkedKeys:[],
                showcomLocation:false,
                showcomCurriculum:false,
                adminClass:"",
                modelName:[],
                modalInfo:[],
                modalName:"",
                modalIds:"",
                selectedRowKeys: [], // Check here to configure the default column
                selectedRows:[],
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
                disable:[],
                ruleInfo: "",
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
            this.getData();
            this.getModalInfo();
        },
        methods: {
            //查看信息树
            async getData () {
                let {data} = await this.$api.basic.classroom.fetchRoomList();
                // console.log(data.result)
                for(let i in data.result) {
                    // 第一层
                    let numberTree = {}
                    numberTree.title = data.result[i].building_name
                    numberTree.key = data.result[i].building_Id;
                    // console.log(data.result[i].floor_list)
                    if (data.result[i].floor_list.length) {
                        //    第二层
                        numberTree.children = []
                        for (let j = 0; j < data.result[i].floor_list.length; j++) {
                            let item = data.result[i].floor_list[j]
                            let childData = {}
                            childData.key = data.result[i].building_Id + item.floor
                            childData.title = '第' + item.floor + '层'
                            // console.log(item.classroom_list);
                            if(item.classroom_list.length) {
                                childData.children = []
                                //第三层
                                for (let k in item.classroom_list) {
                                    let dataThree = {}
                                    dataThree.key = item.classroom_list[k].room_id;
                                    dataThree.title = item.classroom_list[k].classroom_name;
                                    childData.children.push(dataThree)
                                }
                            }
                            numberTree.children.push(childData)
                        }
                    }
                    this.buildingsData.push(numberTree)
                    // console.log(data.result[i])
                }
                // console.log(this.buildingsData)
            },
            //获得课表模板信息
            async getModalInfo(){
                //获取课表模板信息
                let {data}=await this.$api.basic.template.fetchList()
                this.modalInfo=data.rows;
                // console.log(this.modalInfo);
            },
            //监控选择的数
            onCheck(checkedKeys){
                console.log(checkedKeys);
                this.showcomLocation=true;
                let classroomId=[];
                this.checkedKeys.forEach((item,index)=>{
                    console.log(item);
                    console.log(index);
                    let parentNode=[];
                    for(let i=0;i<this.buildingsData.length;i++){
                        if(this.buildingsData[i].key!==item){
                            let classroomData=this.buildingsData[i].children;
                            for(let j=0;j<classroomData.length;j++){
                                if(classroomData[j].key===item){
                                    parentNode.push(classroomData[j]);
                                }
                            }
                        }
                    }
                    console.log(parentNode);
                    if(parentNode.length>0&& Object.prototype.hasOwnProperty.call(parentNode[0],'children')){
                        parentNode[0].children.forEach(chr=>{
                            console.log(chr.key);
                            classroomId.push(chr.key);
                        });
                    }else{
                        classroomId.push(item)
                    }
                })
                // console.log(classroomId);
                //去除重复的
                for(let i=0;i<classroomId.length-1;i++){
                    for(let j=i+1;j<classroomId.length;j++){
                        if(classroomId[i]==classroomId[j]){
                            classroomId[j]=classroomId[j+1];
                            classroomId.length=classroomId.length-1
                        }
                    }
                }
                this.checkedKeys=classroomId;
                console.log(this.checkedKeys);
            },
            //选择课表模板
            handleSelectChange(){
                this.placeInfo();
                this.initData();
                this.settingInfo();
                this.showcomCurriculum=true;
            },
            //获取场地信息
            async placeInfo(){
                let {data:placeData}=await this.$api.basic.classroom.fetchRuleList({currId:this.form.modal});
                console.log(placeData);
                this.placeData=placeData.rows;
            },
            //复选框(删除时选中)
            onSelectChange( selectedRowKeys,selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows=selectedRows
                console.log(this.selectedRowKeys);
                console.log(this.selectedRows);
            },
            //删除场地规则
            async deleteRule(){
                let {data}=await this.$api.basic.classroom.deleteRule({ids:this.selectedRowKeys});
                console.log(data);
                if(data&&data.success){
                    this.placeInfo();
                    message.info('删除成功');
                }else{
                    message.info('删除失败');
                }
            },
            //场地规则查看
            async lookInfo(id){
                let {data:{result,success}}=await this.$api.basic.classroom.fetchRule({id:id});
                console.log(result);
                this.ruleInfo=result.ruleInfo;
                console.log(this.ruleInfo);
                this.settingInfo();
                this.getModalInfo();
            },
            async settingInfo(){
                // console.log(this.tableData)
                //字符串转化为数组
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
                    this.disableData.push([getRColumn,getRRow]);
                }
                console.log(this.disableData);
            },
            //获取课表的具体信息
            async initData(){
                let {data}=await this.$api.basic.template.fetchTemplate({id:this.form.modal})
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
                this.disableData=[];
                for(let i=0;i<this.cellCheck.length;i++){
                    cellRow=this.cellCheck[i][0];
                    cellColumn=this.cellCheck[i][1];
                    console.log(this.cellCheck[i][0])
                    console.log(this.cellCheck[i][1])
                    if(this.tableData[cellRow].rowList[cellColumn].defaultCheck === 0){
                        // 修改颜色为红色
                        this.tableData[cellRow].rowList[cellColumn].defaultCheck = 1
                        this.disableData.push([cellRow,cellColumn])
                    }
                    this.setStore(this.tableData);
                    console.log(this.disableData);
                    console.log(JSON.stringify(this.disableData));
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
                        // 修改颜色为白色
                        this.tableData[this.defaultRow].rowList[this.defaultColumn].defaultCheck = -1
                    }
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
            },
            async handleOk(){
                //保存场地规则
                let addData={
                    classroomIds: this.checkedKeys,
                    classroomRuleEntity:{
                        name:this.form.ruleName,
                        currId:this.form.modal,
                        number:this.checkedKeys.length,
                        ruleInfo:JSON.stringify(this.disableData),
                    }
                }
                let {data}=await this.$api.basic.classroom.saveRule(addData);
                console.log(data);
                this.saveVisit = false;
                if(data&&data.success){
                    alert("保存成功");
                    this.initData();
                }
                this.placeInfo();
            },
            //取消
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
        /*margin: 0px 0px 20px 0px;*/
        /*padding: 20px 25px;*/
        border-radius: 10px;
        display: flex;
        min-height: 800px;
    }
    .right{
        border-radius: 5px;
        width: 79%;
    }
    .title{
        width: 100%;
        background-color: #fff;
        height: 170px;
        padding: 20px 25px;
        border-radius: 10px;
        margin-bottom: 50px;
    }
    .location_content{
        background-color: white;
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
