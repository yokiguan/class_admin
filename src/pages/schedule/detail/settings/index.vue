<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">选课设置</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <a-card>
            <a-form-model layout="horizontal" ref="ruleForm" :model="form" :rules="rules" style="overflow: hidden;margin-bottom: 30px" :label-col="{span:4}" :wrapper-col="{span:10}">
                <a-form-model-item label="选课类型" prop="selectType">
                    <a-select placeholder="请选择" v-model="form.selectType" @change="chooseTeacher">
                        <a-select-option value="1">按照老师选择</a-select-option>
                        <a-select-option value="0">不按照老师选择</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-item label="选课开始时间：" prop="time" ref="time">
                    <a-date-picker v-model="startValue"
                                   :disabled-date="disabledStartDate"
                                   show-time
                                   format="YYYY-MM-DD HH:mm:ss"
                                   placeholder="Start"
                                   @openChange="handleStartOpenChange"
                                   valueFormat="YYYY-MM-DD HH:mm:ss"/>
                </a-form-item>
                <a-form-model-item label="选课结束时间">
                    <a-date-picker v-model="endValue"
                            :disabled-date="disabledEndDate"
                            show-time
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="End"
                            :open="endOpen"
                            @openChange="handleEndOpenChange"
                            valueFormat="YYYY-MM-DD HH:mm:ss"/>
                </a-form-model-item>
            </a-form-model>
            <a-table :rowKey="'id'" :columns="columns" :dataSource="dataSource" :pagination='false'>
                <div slot="subChildIds" slot-scope="text, record,index_1">
                    <a-table :rowKey="'text.subChildId'"
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
                                <a-form-model-item
                                        v-for="(domain, index) in text"
                                        :key="domain.key">
                                    <a-input
                                            style="float: left;color: black;width: 80px;border:none;background-color:#fff"
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
                    <a-select placeholder="请选择覆盖科目" style="width: 150px" @change="handleChange($event,index3)">
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
        components: {},
        data() {
            return {
                columns,
                columnsSubjects,
                columnsSubjectsTeacher,
                changeColumns:columnsSubjects,
                dataSource: [],
                loading:false,
                addVisit: false,
                value: [''],
                treeData:[],
                subTimes:[],
                SHOW_PARENT,
                startValue: null,
                endValue: null,
                endOpen: false,
                dynamicValidateForm: {
                    teacherIds:[{teacherName:'',capacity:''}]
                },
                select_type:"",
                form: {
                    explanation:"",
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
            };
        },
        async created(){
            this. lookInfo();
        },
        //监测选课时间
        watch: {
            startValue(val) {
                console.log('startValue', val);
            },
            endValue(val) {
                console.log('endValue', val);
            },
        },
        methods: {
            //指定排课计划信息查看
            async lookInfo(){
                this.planId = window.location.href.split('?')[1].split('=')[1];
                let {data:{result,success}}=await this.$api.schedule.plan.schedulegetInfo({planId:this.planId});
                console.log(result);
                this.gradeId=result.gradeId;
                this.chooseClassSettingInfo();
            },
            // 选课设置查看
            async chooseClassSettingInfo(){
                let {data:{result,success}} = await this.$api.schedule.setting.settingGet({planId:this.planId,gradeId:this.gradeId});
                console.log(result);
                console.log(result[0].setInfo);
                // console.log(settingData.result);
                this.dataSource =result[0].setInfo;
                this.dataSource.forEach((item,i)=>{
                    item.id=i
                })
                // console.log(this.dataSource);
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
                let {data:{result}}=await this.$api.schedule.setting.lookTeacher({gradeId:this.gradeId,subChildId:id})
                this.treeData[0] = {
                    ...this.treeData[0],
                    key:result.gradeId,
                    value:result.gradeId,
                    title:result.gradeName + result.subName
                }
                this.treeData[0].children = []
                result.teachers.forEach((chr)=>{
                    let child = {
                        key:chr.teacherId,
                        value:chr.teacherId,
                        title:chr.teacherName
                    }
                    this.treeData[0].children.push(child)
                })
                console.log("this.treedata",this.treeData)
            },
            //选择老师
            chooseTeacher(){
                console.log(this.changeColumns);
                if(this.form.selectType==1){
                    this.changeColumns=columnsSubjectsTeacher;
                    this.chooseClassSettingInfo();
                }
                else {
                    this.changeColumns=columnsSubjects;
                    this.chooseClassSettingInfo();
                }
            },
            //添加教师
            addTeacher(id,index_1,index_2){
                this.index_1 = index_1
                this.index_2 = index_2
                this.addVisit=true;
                this.lookTeacherInfo(this.dataSource[index_1].subChildIds[index_2].subChildId);
            },
            //保存新增老师
            handleOk() {
                this.dataSource[this.index_1].subChildIds[this.index_2].teacherIds = []
                this.dataSource[this.index_1].subChildIds[this.index_2].teacherIds[0] = {}
                let childTeachers = []
                for(let item of this.value){
                    if(item === this.treeData[0].key && this.value.length === 1){
                        this.treeData[0].children.forEach(chr=>{
                            childTeachers.push({teacherName:chr.title,teacherId:chr.key,capacity:'10'})
                        })
                        break
                    }else{
                        let teacherIds = this.treeData[0].children.filter(chr=>{
                            return chr.key === item
                        })
                        teacherIds.forEach(chr=>{
                            childTeachers.push({teacherName:chr.title,teacherId:chr.key,capacity:'10'})
                        })
                    }
                }
                this.$set(this.dataSource[this.index_1].subChildIds,this.index_2,{...this.dataSource[this.index_1].subChildIds[this.index_2],teacherIds:childTeachers})
                this.addVisit = false
                console.log("this.dataSource",this.dataSource)
            },
            //关闭添加老师弹框
            handleCancel() {
                this.addVisit=false;
            },
            // //选择覆盖科目
            handleChange($event,index){
                console.log(index);
            //     console.log(index);
                console.log($event);
                this.dataSource[index].coverRule=$event;
                console.log(this.dataSource[index].coverRule);
            },
            //保存
            async saveAll(){
                //数组转化为字符串
                //JSON.stringify(this.disableData)
                let pushData=[];
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
                console.log(pushData);
                let addData = {
                    planId:this.planId,
                    selectType:this.form.selectType,
                    timeLimit: this.startValue + ' - '+this.endValue,
                    tips:this.form.explanation,
                    setInfo:pushData,
                }
            let {data} = await this.$api.schedule.setting.settingAdd(addData);
                console.log(data);

            },
            //清空
            Clear(){
                this.form.setFieldsValue();
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
