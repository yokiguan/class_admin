<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/schedule/template">排课计划</router-link></a-breadcrumb-item>
                <a-breadcrumb-item @click="classDetail">排课详情</a-breadcrumb-item>
                <a-breadcrumb-item><a href="#">选课设置</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <a-card>
            <a-form-model layout="horizontal" ref="ruleForm" :model="form" :rules="rules" style="overflow: hidden;margin-bottom: 30px" :label-col="{span:4}" :wrapper-col="{span:10}">
                <a-form-model-item label="选课类型" prop="selectType">
                    <a-select placeholder="请选择"  v-model="form.selectType" @change="chooseTeacher($event)">
                        <a-select-option value="0">按照老师选择</a-select-option>
                        <a-select-option value="1">不按照老师选择</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-item label="选课开始时间：" prop="time" ref="time">
                    <a-date-picker v-model="startValue"
                                   :disabled-date="disabledStartDate"
                                   format="YYYY-MM-DD HH:mm:ss"
                                   placeholder="开始时间"
                                   @openChange="handleStartOpenChange"
                                   valueFormat="YYYY-MM-DD HH:mm:ss"/>
                </a-form-item>
                <a-form-model-item label="选课结束时间">
                    <a-date-picker v-model="endValue"
                            :disabled-date="disabledEndDate"
                            show-time
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="结束时间"
                            :open="endOpen"
                            @openChange="handleEndOpenChange"
                            valueFormat="YYYY-MM-DD HH:mm:ss"/>
                </a-form-model-item>
            </a-form-model>
            <a-table :rowKey="'id'" :columns="columns" :dataSource="dataSource" :pagination='false'>
                <div slot="subChildIds" slot-scope="text, record,index_1">
                    <a-table :rowKey="'subChildId'"
                            :dataSource="text"
                            :columns="changeColumns"
                            :showHeader="false"
                            :pagination="false"
                            bordered>
                        <div slot="isable" slot-scope="text,record,index_2">
                            <a-select  style="width: 100px" v-model="dataSource[index_1].subChildIds[index_2].isable">
                                <a-select-option :value="0"> 可选 </a-select-option>
                                <a-select-option :value="1"> 必选 </a-select-option>
                            </a-select>
                        </div>
                        <div slot="teacherIds" slot-scope="text,record,index_2">
                            <a-form-model ref="dynamicValidateForm">
                                <a-form-model-item v-for="(domain, index) in text" :key="domain.key">
                                    <a-input style="float: left;color: black;width: 80px;border:none;background-color:#fff"
                                            :value="domain.teacherName"
                                            v-model="dataSource[index_1].subChildIds[index_2].teacherIds[index].teacherName"
                                            disabled>
                                    </a-input>
                                    <a-input placeholder="请输入人数" style="width: 60%; margin-right: 8px"
                                             v-model="dataSource[index_1].subChildIds[index_2].teacherIds[index].capacity"
                                             :value="domain.capacity"/>
                                    <a class="dynamic-delete-button" type="minus-circle-o" @click="removeDomain(domain.teacherId,index_1,index_2)"
                                       style="color: blue;float: right">删除</a>
                                </a-form-model-item>
                                <a-form-model-item>
                                    <a-button class="add-btn" @click="addTeacher(dataSource,index_1,index_2)"><a-icon type="plus" />新增老师</a-button>
                                </a-form-model-item>
                            </a-form-model>
                        </div>
                    </a-table>
                </div>
                <template  slot="regular" slot-scope="text,record,index3">
                    <a-select placeholder="请选择覆盖科目" style="width: 150px" v-model="text" @change="handleChange($event,index3)">
                        <a-select-option value="2">2</a-select-option>
                        <a-select-option value="3">3</a-select-option>
                        <a-select-option value="4">4</a-select-option>
                        <a-select-option value="5">5</a-select-option>
                        <a-select-option value="6">6</a-select-option>
                    </a-select>
                </template>
<!--                <a slot='operate' @click="deleteTypical">删除</a>-->
            </a-table>
            <div style="margin-top: 30px">
                <a-form>
                    <a-form-item label="选课说明：" :model="form">
                        <a-input type="textarea" placeholder="请输入" v-model="form.explanation" style="min-height: 100px"></a-input>
                    </a-form-item>
                </a-form>
            </div>
            <a-row style=" margin-left:500px;margin-top:50px;margin-bottom:10px">
                <a-col :span="5"><a-button style="width: 100px;height: 40px;background-color: red;color: white" @click="Clear">清空</a-button></a-col>
                <a-col :span="5"> <a-button style="width: 100px;height: 40px;background-color:blue;color: white" @click="back">返回</a-button></a-col>
                <a-col :span="5"><a-button  style="width: 100px;height: 40px;background-color: #1abc9c;color: white;" @click="saveAll">保存</a-button></a-col>
            </a-row>
<!--            添加老师弹框-->
            <a-modal :visible='addVisit' width="800px" :closable="false">
                <template slot="footer">
                    <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                    <a-button key="back" @click="handleCancel">取消</a-button>
                </template>
                <a-form :label-col="{ span:6 }" :wrapper-col="{ span: 13 }" style="margin-bottom: 300px;margin-top: 50px">
                    <a-form-item label="标题：">
                        <a-tree-select
                                v-model="value"
                                style="width: 100%"
                                :tree-data="treeData"
                                tree-checkable
                                :checkedKeys="checkedKeys"
                                :show-checked-strategy="SHOW_PARENT"
                                placeholder="请选择"/>
                    </a-form-item>
                </a-form>
            </a-modal>
        </a-card>
    </div>
</template>

<script>
    import {message} from "ant-design-vue";
    import { TreeSelect } from 'ant-design-vue';
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const columns = [
        {
            title: "编号",
            dataIndex: "id",
            align:'center',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title: "类型",
            dataIndex: "name",
            align:'center',
        },
        {
            title: "课程",
            dataIndex: "subChildIds",
            scopedSlots:{ customRender: 'subChildIds' },
            align:'center',
        },
        {
            title: "规则",
            dataIndex: "coverRule",
            scopedSlots: { customRender: "regular" },
            align:'center',
        },
        // {
        //     title: "操作",
        //     dataIndex: "operate",
        //     scopedSlots: { customRender: "operate" },
        //     align:'center',
        // },
    ];
    const columnsSubjects = [
        {
            title: " ",
            dataIndex: "subChildId",
            align:'center',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title: "科目",
            dataIndex: "subChildName",
            align:'center',
        },
        {
            title: "是否可选",
            dataIndex: "isable",
            scopedSlots: { customRender: "isable" },
            align:'center',
        },
    ];
    const columnsSubjectsTeacher = [
        {
            title: "科目",
            dataIndex: "subChildName",
            align:'center',
        },
        {
            title: "是否可选",
            dataIndex: "isable",
            scopedSlots: { customRender: "isable" },
            align:'center',
        },
        {
            title: "老师",
            dataIndex: "teacherIds",
            scopedSlots: { customRender: "teacherIds" },
            align:'center',
        },
    ];
    export default {
        name: "QueryList",
        data() {
            return {
                columns,
                columnsSubjects,
                columnsSubjectsTeacher,
                changeColumns:columnsSubjects,
                dataSource: [],
                loading:false,
                addVisit: false,
                value: [],
                treeData:[],
                subTimes:[],
                SHOW_PARENT,
                startValue: null,
                endValue: null,
                endOpen: false,
                dynamicValidateForm: {
                    teacherIds:[{teacherName:'',capacity:''}]
                },
                form: {
                    explanation:"",
                    selectType:"",
                },
                rules: {
                    selectType: [
                        {
                            required: true,
                            message: "请选择选课类型",
                            trigger: "blur",
                        },
                    ],
                    beginTime: [
                        {
                            required: true,
                            message: "请选择选课开始时间",
                            trigger: "change",
                        },
                    ],
                    endTime: [
                        {
                            required: true,
                            message: "请选择选课结束时间",
                            trigger: "change",
                        },
                    ],
                },
                planId:"",
                gradeId:"",
                editText:-1,
                index_1:null,
                index_2:null,
                checkedKeys:[],
                timeLimit:"",
            };
        },
        async created(){
            this. lookInfo();
        },
        methods: {
            //指定排课计划信息查看
            async lookInfo(){
                this.planId = window.location.href.split('?')[1].split('=')[1];
                let {data}=await this.$api.schedule.plan.schedulegetInfo({planId:this.planId});
                console.log(data.result);
                this.gradeId=data.result.gradeId;
                this.chooseClassSettingInfo();
            },
            // 选课设置查看
            async chooseClassSettingInfo(){
                let {data} = await this.$api.schedule.setting.settingGet({planId:this.planId,gradeId:this.gradeId});
                console.log(data.result);
                if(data&&data.success==false){
                    message.warning(data.message);
                }else{
                    this.dataSource =data.result[0].setInfo;
                    this.form.explanation=data.result[0].tips;
                    this.timeLimit=data.result[0].timeLimit;
                    this.startValue=this.timeLimit.split(" - ")[0];
                    this.endValue=this.timeLimit.split(" - ")[1];
                    // this.form.selectType=data.result[0].selectType;
                    // // this.form.selectType=this.form.selectType;
                    if(data.result[0].selectType==0){
                        this.form.selectType="按老师选择";
                        this.changeColumns=columnsSubjectsTeacher;
                    }else{
                        this.form.selectType="不按老师选择";
                        this.changeColumns=columnsSubjects;
                    }
                }
                console.log(data.result[0].setInfo);
            },
            //开始选课时间
            disabledStartDate(startValue) {
                const endValue = this.endValue;
                if (!startValue || !endValue) {
                    return false;
                }
                return startValue.valueOf() > endValue.valueOf();
            },
            //选课截止时间
            disabledEndDate(endValue) {
                const startValue = this.startValue;
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            },
            handleStartOpenChange(open) {
                if (!open) {
                    this.endOpen = true;
                }
            },
            handleEndOpenChange(open) {
                this.endOpen = open;
            },
            //查看教师
            async lookTeacherInfo(id){
                let {data}=await this.$api.schedule.setting.lookTeacher({
                    gradeId:this.gradeId,
                    subChildId:id})
                this.treeData=[];
               if(data.success){
                   if(data.result){
                       this.addVisit=true;
                       this.treeData[0] = {
                           ...this.treeData[0],
                           key:data.result.gradeId,
                           value:data.result.gradeId,
                           title:data.result.gradeName + data.result.subName
                       }
                       this.treeData[0].children = []
                       data.result.teachers.forEach((chr)=>{
                           let child = {
                               key:chr.teacherId,
                               value:chr.teacherId,
                               title:chr.teacherName
                           }
                           this.treeData[0].children.push(child)
                       })
                       console.log("this.treeData",this.treeData)
                   }else{
                       message.info(data.message);
                   }
               }else {
                    message.info("获取教师信息失败！");
               }
            },
            //选择老师
            chooseTeacher(info){
                this.form.selectType="";
                console.log(info);
                if(info==0){
                    this.changeColumns=columnsSubjectsTeacher;
                    this.form.selectType="按老师选择";
                }
                else{
                    this.changeColumns=columnsSubjects;
                    this.form.selectType="不按老师选择";
                }
                console.log(this.form.selectType);
            },
            //添加教师
            addTeacher(id,index_1,index_2){
                this.index_1 = index_1
                this.index_2 = index_2
                console.log(this.dataSource[index_1].subChildIds[index_2]);
                console.log(this.dataSource[index_1].subChildIds[index_2].subChildId);
                this.lookTeacherInfo(this.dataSource[index_1].subChildIds[index_2].subChildId);
            },
            //保存新增老师
            handleOk() {
                this.addVisit = false;
                this.dataSource[this.index_1].subChildIds[this.index_2].teacherIds = []
                this.dataSource[this.index_1].subChildIds[this.index_2].teacherIds[0] = {}
                let childTeachers = []
                for(let item of this.value){
                    if(item === this.treeData[0].key && this.value.length === 1){
                        this.treeData[0].children.forEach(chr=>{
                            childTeachers.push({teacherName:chr.title,teacherId:chr.key,capacity:'0'})
                        })
                        break
                    }else{
                        let teacherIds = this.treeData[0].children.filter(chr=>{
                            return chr.key === item
                        })
                        teacherIds.forEach(chr=>{
                            childTeachers.push({teacherName:chr.title,teacherId:chr.key,capacity:'0'})
                        })
                    }
                }
                this.$set(this.dataSource[this.index_1].subChildIds,this.index_2,{...this.dataSource[this.index_1].subChildIds[this.index_2],teacherIds:childTeachers})
                console.log("this.dataSource",this.dataSource);
                this.value=[];
            },
            //关闭添加老师弹框
            handleCancel() {
                this.addVisit=false;
                this.value=[];
            },
            // //选择覆盖科目
            handleChange($event,index){
                console.log(index);
                console.log($event);
                this.dataSource[index].coverRule=$event;
                console.log(this.dataSource[index].coverRule);
            },
            //保存
            async saveAll(){
                //数组转化为字符串
                //JSON.stringify(this.disableData)
                console.log(this.form.selectType);
                let type=null;
                if(this.form.selectType=="不按老师选择"){
                    type=1;
                }else{
                    type=0;
                }
                if(this.startValue==null ||this.endValue==null){
                    message.warning("选课时间为空，请设置选课时间！")
                }else{
                    let pushData=[];
                    if(type==1){
                        for(let i=0;i<this.dataSource.length;i++){
                            pushData[i]={
                                id:this.dataSource[i].id,
                                name:this.dataSource[i].name,
                                coverRule:this.dataSource[i].coverRule,
                                subChildIds:[],
                            }
                            for(let j=0;j<this.dataSource[i].subChildIds.length;j++) {
                                pushData[i].subChildIds[j] = {
                                    subChildName: this.dataSource[i].subChildIds[j].subChildName,
                                    subChildId: this.dataSource[i].subChildIds[j].subChildId,
                                    isable: this.dataSource[i].subChildIds[j].isable,
                                    teacherIds: [],
                                }
                            }
                        }
                    }else{
                        for(let i=0;i<this.dataSource.length;i++){
                            pushData[i]={
                                id:this.dataSource[i].id,
                                name:this.dataSource[i].name,
                                coverRule:this.dataSource[i].coverRule,
                                subChildIds:[],
                            }
                            for(let j=0;j<this.dataSource[i].subChildIds.length;j++){
                                pushData[i].subChildIds[j]={
                                    subChildName:this.dataSource[i].subChildIds[j].subChildName,
                                    subChildId:this.dataSource[i].subChildIds[j].subChildId,
                                    isable:this.dataSource[i].subChildIds[j].isable,
                                    teacherIds: [],
                                }
                                for(let k in this.dataSource[i].subChildIds[j].teacherIds){
                                    pushData[i].subChildIds[j].teacherIds[k]={
                                        teacherId:this.dataSource[i].subChildIds[j].teacherIds[k].teacherId,
                                        teacherName:this.dataSource[i].subChildIds[j].teacherIds[k].teacherName,
                                        capacity:this.dataSource[i].subChildIds[j].teacherIds[k].capacity,
                                    }
                                }
                            }
                        }
                    }
                    console.log(pushData);
                    let addData = {
                        planId:this.planId,
                        selectType:type,
                        timeLimit: this.startValue + ' - '+this.endValue,
                        tips:this.form.explanation,
                        setInfo:pushData,
                    }
                    console.log(addData);
                    let {data} = await this.$api.schedule.setting.settingAdd(addData);
                    console.log(data);
                    if(data&&data.success){
                        message.success("保存成功");
                        this.classDetail();
                    }else{
                        message.error("保存失败！");
                    }
                }
            },
            //清空
            Clear(){
                for(let i=0;i<this.dataSource.length;i++){
                    for(let j=0;j<this.dataSource[i].subChildIds.length;j++){
                        this.dataSource[i].subChildIds[j].isable="";
                        for(let k=0;k<this.dataSource[i].subChildIds[j].teacherIds.length;k++){
                            this.dataSource[i].subChildIds[j].teacherIds[k]={};
                        }
                    }
                }
                this.form.explanation="";
            },
            //返回
            back(){
                this.$router.go(-1)
            },
            //删除
            removeDomain(id,index1,index2) {
               // console.log(id);
               // console.log(index1);
               // console.log(index2);
               // console.log(this.dataSource)
               // console.log(this.dataSource[index1].subChildIds);
               // console.log(this.dataSource[index1].subChildIds[index2].teacherIds);
               this.editText=this.dataSource[index1].subChildIds[index2].teacherIds.findIndex(item=>item.teacherId===id);
               console.log(this.editText);
               const dataSource = [...this.dataSource[index1].subChildIds[index2].teacherIds];
                dataSource.splice(this.editText,1);
                this.dataSource[index1].subChildIds[index2].teacherIds= dataSource
            },
            //排课详情查看
            classDetail(){
                this.$router.push(`/schedule/detail/index?planId=${this.planId}`)
            }
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
    .search {
        margin-bottom: 54px;
    }
    .fold {
        width: calc(100% - 216px);
        display: inline-block;
    }
    .operator {
        margin-bottom: 18px;
    }
    .teacher {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin: 5px;
    }
    .add-btn {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100px;
        margin: 10px auto 0 auto;
        padding: 5px;
        border: 1px solid;
        border-radius: 6px;
    }
    @media screen and (max-width: 900px) {
        .fold {
            width: 100%;
        }
    }
</style>
