<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">行政班排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">班级设置</a></a-breadcrumb-item>
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
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="subjectSetting" >学科设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="classSetting">班级设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="ruleSetting">规则设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
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
                        <a-icon type="close" slot="blank" slot-scope="text,record,index2" style="font-weight: bolder;font-size: 30px;color: #0099ff" @click="delet(index1,index2)" />
                    </a-table>
                    <span slot="add" style="color:blue;margin-top: 20px;float: left;font-size: 18px;margin-left: 10px" @click="addSubject(index1)">+添加学科</span>
                </div>
                <template slot="action" slot-scope="text, record,index">
                    <a-popconfirm
                            v-if="data.length"
                            title="确认删除?"
                            @confirm="() => onDelete(index)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>
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
            <a-radio-group v-model="form.teacherName" :options="optionTeacher" @change="chooseTeacher" />
        </a-modal>
<!--        添加课程弹框-->
        <a-modal  title="添加学科"
                  :visible="addSubjectVisit"
                  :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOkSubject">保存</a-button>
                <a-button key="back" @click="handleCancelSubject">取消</a-button>
            </template>
<!--            @check="onCheck"-->
            <a-radio-group v-model="subjects" :options="options" @change="chooseSubject"/>
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
        {
            title: '操作',
            dataIndex: 'action',
            align:'center',
            scopedSlots: { customRender: 'action' },
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
                addSubjectVisit: false,
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
                options:[],
                subRuleIds:"",
                addId:"",
                optionTeacher:[],
                subjects:"",
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
                console.log(result);
                this.gradeName=result.gradeName;
                this.gradeId=result.gradeId;
            }
            this.classSettingInfo();
        },
        methods: {
            //班级设置查看
            async classSettingInfo(){
                let {data:{result,success}}=await this.$api.schedule.adminClass.getClassSetting({planId:this.planId,gradeId:this.gradeId});
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
            //删除学科老师
            delet(index1,index2){
                // console.log(index1);
                // console.log(index2);
                // console.log(this.data[index1])
                let index=this.data[index1].subjectTeacherList[index2].scheduleTeacherClassId;
                console.log(index);
                this.delete(index);
                // this.data[index1].subjectTeacherList.splice(index2,1);
                // console.log(this.data);
            },
            //添加学科
            addSubject(id){
                this.addId=id;
                console.log(this.addId);
                this.addSubjectVisit=true;
                this.options=[];
                this.subjectInfo();
            },
            //获取学科信息
            async subjectInfo(){
                let {data}=await this.$api.schedule.adminClass. getCourseSetting({planId:this.planId,scheduleType:1});
                console.log(data.result);
                for(let i in data.result){
                    let pushData={
                        label:data.result[i].subName,
                        value:data.result[i].subId
                    }
                    this.options.push(pushData);
                }
                // console.log(this.options);
            },
            //选择学科
            chooseSubject(e){
                console.log(e.target.value);
                this.subRuleIds=e.target.value;
                console.log(this.subRuleIds);
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
                let subId=this.data[index1].subjectTeacherList[index2].subId;
                this.editTeacherVisit=true;
                let {data:{result,success}}=await this.$api.schedule.setting.lookTeacher({gradeId:this.gradeId,subChildId:subId});
                console.log(result);
                let teachers=result.teachers;
                console.log(teachers)
                for(let i in teachers){
                    let pushData={
                        label:teachers[i].teacherName,
                        value:teachers[i].teacherId,
                    };
                    this.optionTeacher.push(pushData);
                }
                console.log(this.optionTeacher);
            },
            //选择老师
            chooseTeacher(e){
                console.log(e.target.value);
            },
            //保存添加学科
            async handleOkSubject(){
                this.addSubjectVisit=false;
                console.log(this.subjects);
                // console.log(this.options);
                let subRuleName="";
                for(let i in this.options){
                    if(this.subRuleIds===this.options[i].value){
                        subRuleName=this.options[i].label;
                    }
                }
                let pushData={
                    subId:this.subjects,
                    subName:subRuleName,
                    teacherName:"",
                }
                console.log(pushData);
                this.data[this.addId].subjectTeacherList.push(pushData);
                console.log(this.data[this.addId].subjectTeacherList);
                console.log(this.data);
                // let addData={
                //     planId:this.planId,
                //     type:1,
                //     classId:this.data[this.addId].classId,
                //     // subId:this.data[index1].subjectTeacherList[index2].subId,
                // };
                // console.log(addData);
                // let {data}=await this.$api.schedule.adminClass.addClassSetting(addData);
                // console.log(data);
            },
            //取消添加学科
            handleCancelSubject(){
                this.addSubjectVisit=false;
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
                let pushData={
                    planId:this.planId,
                    type:1,
                    subId:this.data[this.index1].subjectTeacherList[this.index2].subId,
                    teacherId:this.data[this.index1].subjectTeacherList[this.index2].teacherId,
                    classId:this.data[this.index1].classId,
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
            //删除班级
            async onDelete(id){
                // console.log(id);
                // console.log();
                let index=this.data[id].classId;
                this.delete(index);
            },
            //获取删除接口
            async delete(id){
                let {data}=await this.$api.schedule.adminClass.deleteCoursesetting({ids:[id]});
                console.log(data);
                if(data&&data.success){
                    message.info("删除成功");
                    this.classSettingInfo();
                }else{
                    message.info("删除失败");
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
            Next(){
                this.$router.push(`/schedule/detail/class_admin/rule?planId=${this.planId}`)
            },
            //返回
            back(){
                this.$router.go(-1)
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
