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
            <a-table :rowKey="'classId'" :columns="columns" :dataSource="data" :pagination='false'>
                <div slot="subjectTeacherList" slot-scope="text, record,index1">
                    <a-table :rowKey="'text.subId'"
                             :dataSource="text"
                             :columns="columnsSubject"
                             :pagination="false"
                             bordered>
                    </a-table>
                    <template slot="class_day" slot-scope="text, record,index2">
                        <a-icon type="edit"  style="color: #00ccff;font-size: 25px;font-weight: bold; float:right" @click="edit"/>
                    </template>
                    <a-icon type="close" slot="blank" style="font-weight: bolder;font-size: 30px;color: #0099ff" @click="delet" />
                </div>
                <template slot="action" slot-scope="text, record">
                    <a-popconfirm
                            v-if="data.length"
                            title="确认删除?"
                            @confirm="() => onDelete(record.id)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
<!--


<!--&lt;!&ndash;                <span slot="add" style="color:blue">+添加一项</span>&ndash;&gt;-->

<!--&lt;!&ndash;                <span slot="action" slot-scope="text" @click="editInfo(record.key)" style="background-color:blue">{{text}}</span>&ndash;&gt;-->
<!--            </a-table>-->
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
                dataSource:[],
                columns,
                columnsSubject,
                visible: false,
                loading: false,
                planData:"",
                gradeId:"",
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
                let {data:{result,success}}=await this.$api.schedule.adminClass.getClassSetting({gradeId:this.gradeId});
                console.log(result);
                this.data=result;
                for(let i=0;i<result.length;i++){
                    console.log(result[i].subjectTeacherList)
                }

            },
            //
            delet(){

            },
            add_course: function () {
                this.visible = true;
            },
            change: function () {
                this.visible = true;
            },
            closed: function () {
                this.visible = false
                this.loading = false
            },
            handleSubmit1: function () {
                const that = this
                console.log(that.$refs.createForm)
                that.loading = true
                setTimeout(() => {
                    that.visible = false
                    that.loading = false
                }, 2000)
            },
            onChange(e){
                console.log('radio checked',e.target.value)
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
            back(){
                this.$router.go(-1)
            },
            edit(){},
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
