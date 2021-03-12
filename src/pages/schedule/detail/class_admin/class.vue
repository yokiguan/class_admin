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
                    <a-table :rowKey="'text.scheduleTeacherClassId'"
                             :dataSource="text"
                             :columns="columnsSubject"
                             :pagination="false"
                             bordered>
                        <template slot="class_day" slot-scope="text, record,index2">
                            <a-input :value="text" style="float: left;width: 200px" disabled/>
                            <a-icon type="edit"  style="color: #00ccff;font-size: 25px;font-weight: bold; float:right" @click="edit(index1,index2)"/>
                        </template>
                        <a-icon type="close" slot="blank" style="font-weight: bolder;font-size: 30px;color: #0099ff" @click="delet(index1,index2)" />
                    </a-table>
                    <span slot="add" style="color:blue;margin-top: 20px;float: left;font-size: 18px;margin-left: 10px" @click="addSubject">+添加学科</span>
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
           <a-form-model :modal="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 18}">
               <a-form-model-item label="教师姓名：">
                   <a-input v-model="form.teacherName"/>
               </a-form-model-item>
           </a-form-model>
        </a-modal>
<!--        添加课程弹框-->
        <a-modal  title="添加学科"
                  :visible="addSubjectVisit"
                  :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
                <a-tree></a-tree>
        </a-modal>
    </div>
</template>
<script>
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
                gradeId:"",
                form:{
                    teacherName:"",
                },
                index1:null,
                index2:null,
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
                // console.log(result);
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
                this.data[index1].subjectTeacherList.splice(index2,1);
                console.log(this.data);
            },
            //添加学科
            addSubject(){
                this.addSubjectVisit=true;
                this.subjectInfo();
            },
            //获取学科信息
            async subjectInfo(){
                let {data}=await this.$api.schedule.adminClass. getCourseSetting({planId:this.planId,scheduleType:1});
                console.log(data);
            },
            //编辑教室姓名
            edit(index1,index2){
                console.log(index1);
                console.log(index2);
                this.index1=index1;
                this.index2=index2;
                this.editTeacherVisit=true;
            },
            //保存添加学科
            handleOk(){
                this.addSubjectVisit=false;
            },
            //取消添加学科
            handleCancel(){
                this.addSubjectVisit=false;
            },
            //保存教师姓名
            handleOkTeacher(){
                this.editTeacherVisit=false;
                console.log(this.form.teacherName);
                this.data[this.index1].subjectTeacherList[this.index2].teacherName=this.form.teacherName;
                console.log(this.data[this.index1].subjectTeacherList[this.index2].teacherName);
            },
            //取消教师姓名
            handleCancelTeacher(){
                this.editTeacherVisit=false;
            },
            //删除班级
            async onDelete(id){
                // console.log(id);
                // console.log(this.data[id].classId);
                let {data}=await this.$api.schedule.adminClass.deleteCoursesetting({ids:[this.data[id].classId]});
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
