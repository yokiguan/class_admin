<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">行政班排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">学科设置</a></a-breadcrumb-item>
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
                        width: 100px" @click="back">返回</button>
                </a-col>
            </a-row>
        </div>
        <a-card class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="subjectSetting" >学科设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="classSetting">班级设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="ruleSetting">规则设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <a-table :rowKey="'subId'"
                    :columns="columns"
                     :data-source="dataSource"
                     :pagination="false"
                     :bordered="true">
<!--                <input slot="priority" slot-scope="text, record"/>-->
                <template slot="lessonWeek" slot-scope="lessonWeektext, lessonWeekrecord,leWeIndex">
                    <a-input v-model="lessonWeektext" @blur="lessonWeekChange(leWeIndex,lessonWeektext)"/>
                </template>
                <template slot="dayNums" slot-scope="text, record,index">
                    <a-icon type="edit"  style="color: #00ccff;font-size: 25px;font-weight: bold" :default-value="text" @click="editDays(text,index)"/>
                </template>
                <a-input slot="lessonMax"  slot-scope="text, record,index"  v-model="text" @blur="lessonMaxChange(index,text)"/>
                <a-input slot="lessonDaily" slot-scope="text, record,index" v-model="text" @blur="lessonDailyChange(index,text)"/>
                <a-input slot="lessonMorning" slot-scope="text, record,index" v-model="text" @blur="lessonMorningChange(index,text)"/>
                <a-input slot="lessonAfternoon" slot-scope="text, record,index" v-model="text" @blur="lessonAfternoonChange(index,text)"/>
                <template slot="action" slot-scope="text, record">
                    <a-popconfirm
                            v-if="dataSource.length"
                            title="确认删除?"
                            @confirm="() => onDelete(record.id)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
            <a-button icon="plus" style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        font-size: 20px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-top: 30px;
                        width: 150px" @click="add">添加</a-button>
        </a-card>
            <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        margin-top: 150px;
                        margin-bottom: 20px;
                        width: 150px" @click="Next">下一步</button>
<!--            添加课程弹窗-->
            <a-modal title="添加课程"
                    :visible='addCourseModal'
                    :closable="false">
                <template slot="footer">
                    <a-button key="Save" type="primary" :loading="loading" @click="handleOkAdd">保存</a-button>
                    <a-button key="back" @click="handleCancelAdd">取消</a-button>
                </template>
                <template>
                    <a-form-model :form="form">
                        <a-form-model-item>
                            <a-tree-select
                                    v-model="form.value"
                                    style="width: 100%"
                                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                    :tree-data="gData"
                                    placeholder="Please select"
                                    tree-default-expand-all
                                    :checkedKeys="checkedKeys"/>
                        </a-form-model-item>
                    </a-form-model>
                </template>
            </a-modal>
        <!--        编辑弹窗-->
        <a-modal  title="设置上课天数"
                  :visible='settingLessonDays'
                  :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <div></div>
            <a-form-model  style="margin-top: 30px;" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 18}">
                <a-form-model-item label="类型" ref="type" props="type">
                    <a-select placeholder="小于/大于/等于" :default-value="type" @change="changType">
                        <a-select-option value="小于">小于</a-select-option>
                        <a-select-option value="大于">大于</a-select-option>
                        <a-select-option value="等于">等于</a-select-option>
                        <!--                            <a-select-option value="0">{{record}}</a-select-option>-->
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="天数" ref="days" props="days">
                    <a-input placeholder="请输入上课天数" :default-value="days"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>

    </div>
</template>
<script>
    import { TreeSelect } from 'ant-design-vue';
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const columns = [
        {
            title:'',
            dataIndex:'subId',
            align:'center',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title: '学科名称',
            dataIndex: 'subName',
            align:'center',
        },
        // {
        //     title: '优先级',
        //     dataIndex: 'priority',
        //     align:'center',
        //     scopedSlots: { customRender: 'priority' },
        // },
        {
            title: '每周节数',
            dataIndex: 'lessonWeekly',
            scopedSlots: { customRender: 'lessonWeek' },
            align:'center',
        },
        {
            title: '上课天数',
            dataIndex: 'dayNum',
            scopedSlots: { customRender: 'dayNums' },
            align:'center',
        },
        {
            title: '最大开课数',
            dataIndex: 'lessonMax',
            scopedSlots: { customRender: 'lessonMax' },
            align:'center',
        },
        {
            title: '每天课时数设置',
            dataIndex: 'lessonDaily',
            scopedSlots: { customRender: 'lessonDaily' },
            align:'center',
        },
        {
            title: '上午课时数',
            dataIndex: 'lessonMorning',
            scopedSlots: { customRender: 'lessonMorning' },
        },
        {
            title: '下午课时数',
            dataIndex: 'lessonAfternoon',
            scopedSlots: { customRender: 'lessonAfternoon' },
        },
        {
            title: '操作',
            dataIndex: 'opt',
            scopedSlots: { customRender: 'action' },
            align:'center',

        },
    ];
    export default {
        data() {
            return {
                inputData: null,
                dataSource: [],
                gData: [],
                SHOW_PARENT,
                checkedKeys:[],
                columns,
                planData: "",
                count: 5,
                form: {},
                id: null,
                addCourseModal: false,
                loading: false,
                expandedKeys: [],
                searchValue: '',
                autoExpandParent: true,
                settingLessonDays: false,
                days: "",
                type:"",
                chooseType:"",
                editIndex:null,
                form:{
                    value:[],
                },
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
            this.subjectInfo();
        },
        methods: {
            //每周课节数设置
            lessonWeekChange(index,value){
                console.log(index);
                console.log(value);
                this.dataSource[index].lessonWeekly=value;
                this.saveData(index);
                console.log(this.dataSource);
            },
            //最大开课数
            lessonMaxChange(index,value){
                console.log(index);
                console.log(value);
                this.dataSource[index].lessonMax=value;
                this.saveData(index);
                console.log(this.dataSource);
            },
            //每天课时数设置
            lessonDailyChange(index,value){
                console.log(index);
                console.log(value);
                this.dataSource[index].lessonDaily=value;
                this.saveData(index);
                console.log(this.dataSource);
            },
            //上午课时数
            lessonMorningChange(index,value){
                console.log(index);
                console.log(value);
                this.dataSource[index].lessonMorning=value;
                this.saveData(index);
                console.log(this.dataSource);
            },
            //下午课时数
            lessonAfternoonChange(index,value){
                console.log(index);
                console.log(value);
                this.dataSource[index].lessonAfternoon=value;
                this.saveData(index);
                console.log(this.dataSource);
            },
            //改变类型
            changType(info){
                console.log(info);
                this.chooseType=info;
            },
            //学科设置查看
            async subjectInfo(){
                let {data}=await this.$api.schedule.adminClass. getCourseSetting({planId:this.planId,scheduleType:1});
                console.log(data)
                this.dataSource=data.rows;
                console.log(this.dataSource);
            },
            //删除行数据
            async onDelete(ids){
                let {data}=await this.$api.schedule.adminClass.deleteCourseSetting({ids:[ids]});
                console.log(data);
                if(data&&data.success){
                    message.info("删除成功");
                    this.subjectInfo();
                }else{
                    message.info("删除失败");
                }
            },
            //编辑上课天数
            editDays(value,index){
                // // console.log(index);
                // console.log(this.dataSource[index]);
                this.editIndex=index;
                console.log(index);
                this.type=this.dataSource[index].type;
                this.days=value;
                console.log(this.type);
                console.log(this.days);
                this.settingLessonDays=true;
            },
            //添加课程方法
            add(){
                this.addCourseModal=true;
                this.lookCourse();
            },
            //查看课程接口
            async lookCourse(){
                this.gData=[];
                let {data}=await this.$api.basic.subject.fetchSubjectList({subType:1})
                // console.log(data.result);
                for(let i in data.result){
                    //第一层(级部）
                    let mainCourseTree={};
                    mainCourseTree.title=data.result[i].subName;
                    mainCourseTree.key=mainCourseTree.value=data.result[i].id;
                    if(data.result[i].subjectChildEntitys.length){
                        //第二层(年级）
                        mainCourseTree.children=[];
                        for(let j=0;j<data.result[i].subjectChildEntitys.length;j++){
                            let gradeItem=data.result[i].subjectChildEntitys[j];
                            let childData={}
                            childData.key=childData.value=gradeItem.subChildId;
                            childData.title=gradeItem.name;
                            mainCourseTree.children.push(childData);
                        }
                    }
                    this.gData.push(mainCourseTree);
                }
                // console.log(this.gData);
            },
            //保存上课天数
            handleOk(){
              this.settingLessonDays =false;
              this.dataSource[this.editIndex].type=this.form.type;
              this.dataSource[this.editIndex].dayNum=this.form.days;
              this.saveData(this.editIndex);
            },
            //保存添加
            async handleOkAdd(){
                this.addCourseModal=false;
               let addData={
                   planId:this.planId,
                   subId:this.form.value,
                   scheduleType: 1,
               }
                let {data}=await this.$api.schedule.adminClass.addCourseSetting(addData);
                console.log(data);
                if(data&&data.success){
                    this.subjectInfo();
                }
            },
            //关闭编辑上课天数
            handleCancel(){
                this.settingLessonDays =false;
            },
            //关闭添加
            handleCancelAdd(){
                this.addCourseModal=false;
            },
            async saveData(index){
                let addData={
                    id:this.dataSource[index].id,
                    planId:this.planId,
                    subId:this.dataSource[index].subName,
                    scheduleType: 1,
                    lessonWeekly:Number(this.dataSource[index].lessonWeekly),
                    type:this.dataSource[index].type,
                    dayNum:Number(this.dataSource[index].dayNum),
                    lessonMax:Number(this.dataSource[index].lessonMax),
                    lessonDaily:Number(this.dataSource[index].lessonDaily),
                    lessonMorning:Number(this.dataSource[index].lessonMorning),
                    lessonAfternoon:Number(this.dataSource[index].lessonAfternoon),
                    };
                console.log(addData);
               let {data}=await this.$api.schedule.adminClass.addCourseSetting(addData);
               console.log(data);
               if(data&&data.success){
                   this.subjectInfo();
               }
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
                this.$router.push(`/schedule/detail/class_admin/class?planId=${this.planId}`);
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
                this.$router.push(`/schedule/detail/class_admin/class?planId=${this.planId}`)
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
    .result-left{
        width: 50%;
    }
    .link-font-color{
        color: #0000ff;
    }
    .info{
        height: 50px;
        width: 100%;
        margin: 0px 0px 10px 0px;
        padding: 10px 5px;
        background-color: white;
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
    .editable-cell {
        position: relative;
    }
    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
        padding-right: 24px;
    }
    .editable-cell-text-wrapper {
        padding: 5px 24px 5px 5px;
    }
    .editable-cell-icon,
    .editable-cell-icon-check {
        position: absolute;
        right: 0;
        width: 20px;
        cursor: pointer;
    }
    .editable-cell-icon {
        line-height: 18px;
        display: none;
    }
    .editable-cell-icon-check {
        line-height: 28px;
    }
    .editable-cell:hover .editable-cell-icon {
        display: inline-block;
    }
    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
        color: #108ee9;
    }
    .editable-add-btn {
        margin-bottom: 8px;
    }
</style>
