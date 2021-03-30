<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/schedule/template">排课计划</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><span @click="arrangeClass">排课详情</span></a-breadcrumb-item>
                <a-breadcrumb-item>行政班排课</a-breadcrumb-item>
                <a-breadcrumb-item><a href="#">班级设置</a></a-breadcrumb-item>
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
        <!-- /result -->
        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting" :disabled="choose">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="subjectSetting" >学科设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px;background-color:#b9b9b9" @click="classSetting">班级设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="ruleSetting" disabled>规则设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray" disabled>开始排课</a-button></a-col>
            </a-row>
            <a-table :rowKey="'classId'" :columns="columns" :dataSource="data" :pagination='false' bordered>
                <div slot="subjectTeacherList" slot-scope="text, record,index1">
                    <a-table :rowKey="'scheduleTeacherClassId'"
                             :dataSource="text"
                             :columns="columnsSubject"
                             :pagination="false"
                             bordered>
                        <template slot="class_day" slot-scope="text, record,index2">
                            <a-input :value="text" style="float: left;width: 200px" disabled/>
                            <a-icon type="edit"  style="color: #00ccff;font-size: 25px;font-weight: bold; float:right" @click="edit(index1,index2)"/>
                        </template>
                        <template  slot="blank" slot-scope="text,record">
                            <a-icon type="close" style="font-weight: bolder;font-size: 30px;color: #0099ff" @click="delet(record.scheduleTeacherClassId)"/>
                        </template>
                    </a-table>
                </div>
            </a-table>
            <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        margin-top:100px;
                        margin-bottom: 20px;
                        width: 200px" @click="Next">下一步</button>
        </div>
<!--        编辑教师名称-->
        <a-modal  title="修改教师名称"
                  :visible="editTeacherVisit"
                  :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOkTeacher">保存</a-button>
                <a-button key="back" @click="handleCancelTeacher">取消</a-button>
            </template>
            <a-radio-group v-model="form.teacherName" :options="optionTeacher"/>
        </a-modal>
    </div>
</template>
<script>
    import {message} from "ant-design-vue";
    const columns = [
        {
            title:'',
            dataIndex:'classId',
            align:'center',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title: '班级',
            dataIndex:'className',
            align:'center',
        },
        {
            title: '',
            dataIndex: 'subjectTeacherList',
            align:'center',
            scopedSlots: { customRender: 'subjectTeacherList' },
        },
    ];
    const columnsSubject=[
        {
            title:'',
            dataIndex:'scheduleTeacherClassId',
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
        {
            title: '任课教师',
            dataIndex: 'teacherName',
            align:'center',
            scopedSlots:{customRender:'class_day'}
        },
        {
            title: '  ',
            dataIndex: 'blank',
            align:'center',
            scopedSlots: { customRender: 'blank' },
        },
    ];
    export default {
        data() {
            return {
                data:[],
                columns,
                columnsSubject,
                editTeacherVisit:false,
                loading: false,
                planData:"",
                planId:"",
                gradeName:"",
                gradeId:"",
                subName:"",
                form:{
                    teacherName:"",
                },
                index1:null,
                index2:null,
                subRuleIds:"",
                addId:"",
                optionTeacher:[],
                subjects:"",
                classType:"",
                teacherName:"",
                subId:"",
                choose:false,
            };
        },
        async created() {
            this.chooseCourseInfo();
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
                    this.gradeName=result.gradeName;
                    this.gradeId=result.gradeId;
                    this.classType=result.type;
                    if(this.classType==2){
                        this.choose=true;
                    }
                }
                this.classSettingInfo();
            },
            //班级设置查看
            async classSettingInfo(){
                 console.log(this.gradeId);
                let {data:{result,success}}=await this.$api.schedule.adminClass.getClassSetting({
                    planId:this.planId,
                    gradeId:this.gradeId});
                console.log(result);
                let allData=[];
                for(let i=0;i<result.length;i++){
                    let addData={
                        classId:result[i].classId,
                        className:result[i].gradeName+result[i].className,
                        subjectTeacherList:result[i].subjectTeacherList,
                    }
                    allData[i]=addData;
                    console.log(result[i].subjectTeacherList)
                }
                console.log(allData);
                this.data=allData;
                console.log(this.data);
            },
            //编辑教师姓名
            async edit(index1,index2){
                console.log(index1);
                console.log(index2);
                // console.log(this.data[index1].subjectTeacherList[index2]);
                this.index1=index1;
                this.index2=index2;
                this.optionTeacher=[];
                this.subName=this.data[index1].subjectTeacherList[index2].subName;
                this.subId=this.data[index1].subjectTeacherList[index2].subId;
                this.teacherName=this.data[index1].subjectTeacherList[index2].teacherName;
                console.log(this.teacherName);
                this.editTeacherVisit=true;
                this.teacherInfo();
            },
            //获取老师信息
            async teacherInfo(){
                let {data:{result,success}}=await this.$api.schedule.setting.lookTeacher({
                    gradeId:this.gradeId,subChildId:this.subId});
                console.log(result);
                let teachers=result.teachers;
                console.log(teachers)
                for(let i in teachers){
                    let pushData={
                        label:teachers[i].teacherName,
                        value:teachers[i].teacherId,
                        disabled: false,
                    };
                    this.optionTeacher.push(pushData);
                }
                console.log(this.optionTeacher);
                //已选时禁选
                for(let i=0;i<this.optionTeacher.length;i++){
                    if(this.optionTeacher[i].label===this.teacherName){
                        this.optionTeacher[i].disabled=true;
                    }
                }
            },
            //选择老师
            chooseTeacher(e){
                console.log(e.target.value);
            },
            //保存教师姓名
            async handleOkTeacher(){
                this.editTeacherVisit=false;
               console.log(this.form.teacherName);
                for(let i in this.optionTeacher){
                    if(this.form.teacherName===this.optionTeacher[i].value){
                        this.data[this.index1].subjectTeacherList[this.index2].teacherName=this.optionTeacher[i].label
                        this.data[this.index1].subjectTeacherList[this.index2].teacherId=this.optionTeacher[i].value;
                    }
                }
                console.log(this.data[this.index1].subjectTeacherList[this.index2].teacherName);
                // console.log(this.data);
                let pushData=[];
                if(this.teacherName==undefined){
                    pushData={
                        planId:this.planId,
                        type:1,
                        subId:this.data[this.index1].subjectTeacherList[this.index2].subId,
                        teacherId:this.data[this.index1].subjectTeacherList[this.index2].teacherId,
                        classId:this.data[this.index1].classId,
                    }
                }else{
                    pushData={
                        id:this.data[this.index1].subjectTeacherList[this.index2].scheduleTeacherClassId,
                        planId:this.planId,
                        type:1,
                        subId:this.data[this.index1].subjectTeacherList[this.index2].subId,
                        teacherId:this.data[this.index1].subjectTeacherList[this.index2].teacherId,
                        classId:this.data[this.index1].classId,
                    }
                }
                console.log(pushData);
                let {data}=await this.$api.schedule.adminClass.addClassSetting(pushData);
                console.log(data);
                this.classSettingInfo();
            },
            //取消教师姓名
            handleCancelTeacher(){
                this.editTeacherVisit=false;
            },
            //删除老师
            async delet(id){
                console.log(id);
                let {data}=await this.$api.schedule.adminClass.deleteCoursesetting({ids:[id]});
                if(data&&data.success){
                    console.log(data);
                    message.success("删除成功！");
                }else{
                    message.error(data.message);
                }
            },
            //课时设置
            timesSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/index?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/index?planId=${this.planId}`);
                }
            },
            //课节设置
            oncesSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/time?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/time?planId=${this.planId}`);
                }
            },
            //学科设置
            subjectSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/course?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/course?planId=${this.planId}`);
                }
            },
            //班级设置
            classSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/class?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/class?planId=${this.planId}`);
                }
            },
            //规则设置
            ruleSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/rule?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/rule?planId=${this.planId}`);
                }
            },
            //开始排课
            startArray(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            //下一步
            Next(){
                let flag=1;
                loop0:
                for(let i in this.data){
                    console.log(this.data[i]);
                    let subjectTeacherList=this.data[i].subjectTeacherList;
                    for(let j=0;j<subjectTeacherList.length;j++){
                        console.log(subjectTeacherList[j].scheduleTeacherClassId);
                        if(subjectTeacherList[j].scheduleTeacherClassId===undefined){
                            message.warning("存在任课教师为空，请检查！");
                            flag=0;
                            break loop0;
                        }
                    }
                }
                if(flag===1){
                    if(this.classType==2){
                        this.$router.push(`/schedule/detail/class_admin/rule?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
                    }else{
                        this.$router.push(`/schedule/detail/class_admin/rule?planId=${this.planId}`);
                    }
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
            //保存接口
            async saveData(index1,index2){
                let pushData={
                    planId:this.planId,
                    type:"1",
                    subId:this.data[index1].subjectTeacherList[index2].subId,
                    teacherId:this.data[index1].subjectTeacherList[index2].teacherId,
                    classId:this.data[index1].classId,
                }
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
    .table{
        margin-left: 48px;
        width: 56%;
    }
    /deep/ Table {
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
    }
</style>
