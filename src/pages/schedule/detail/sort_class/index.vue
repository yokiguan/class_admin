<template>
    <div>
        <div class="result">
            <a-row>
                <a-col :span="12">
                    <span style="font-size:1.5em">{{this.planData}}</span>
                    <br>
                    <span style="margin-left:2em">未分班人数<font style="color:red">100</font>人</span>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: #1abc9c;color: white" @click="autoSortClass">自动分班</a-button></a-col>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: #1abc9c;color: white" @click="manaulSortClass">手动分班</a-button></a-col>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: red;color: white" @click="clearTable">清空</a-button></a-col>
                        <a-col :span="6" ><a-button style="width: 150px;height: 50px;background-color: blue;color: white" @click="back" >返回</a-button></a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <div class="table-bg">
            <a-table :rowKey="'subId'"
                     :columns="columns"
                     :data-source="dataSource"
                     :bordered="true"
                     :pagination="false">
                <div slot="action" slot-scope="scheduleTeacherClassEntities">
                    <template v-if="scheduleTeacherClassEntities.length">
                        <li v-for="(s, index) in scheduleTeacherClassEntities" :key="index" class="situation">
                            <a-row>
                                <a-col :span="7" ><span>{{s.className}}</span></a-col>
                                <a-col :span="4">
                                    <span v-if="s.schWxUserEntity && s.schWxUserEntity.userName">{{s.schWxUserEntity.userName}}</span>
                                    <span v-else>-</span>
                                </a-col>
                                <a-col  :span="4"><span>{{s.number}}</span></a-col>
                                <a-col  :span="4"><a style="color:blue" @click="edit(s.id)" type="dashed">修改</a></a-col>
                                <a-col  :span="4"><a style="color:red" @click="onDelete(s)" type="dashed">删除</a></a-col>
                            </a-row>
                        </li>
                    </template>
                    <div v-else>--</div>
                </div>
            </a-table>
        </div>
        <!--  选课分班修改-->
        <a-modal
                :visible="chooseSortClass"
                :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk()">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <a-form-model :model="form" :rules="rules" :label-col="{span:5}" :wrapper-col="{span:15}" style="margin-left: 30px">
                <a-form-model-item label="班级名称：" props="name" ref="name" >
                    <!-- <a-date-picker v-decorator="['date-picker', config]" /> -->
                    <a-input placeholder="请输入" v-model="form.className"/>
                </a-form-model-item>
                <a-form-model-item label="任课教师：" props="teacher" ref="teacher">
                    <a-select placeholder="请选择任课教师" v-model="form.teacherId">
                        <a-select-option value="0">智能</a-select-option>
                        <a-select-option value="1">赵老师</a-select-option>
                    </a-select>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>
<script>
    import CreateModal from "@/components/modal/CreateModal";
    import TagSelectOption from "../../../../components/tool/TagSelectOption";
    const columns = [
        {   title: '课程名称',
            dataIndex: 'subjectChildEntity.name',
            align:'center',
            width:'12%',
        },
        {
            title: '总人数',
            dataIndex: 'total',
            align:'center',
            width:'12%',
        },
        {
            title: '未分班人数',
            dataIndex: 'unscheduled',
            align:'center',
            width:'12%',
        },
        {
            title: '分班个数',
            dataIndex: 'classNum',
            align:'center',
            width:'12%',
        },
        {
            title: '分班情况',
            dataIndex: 'scheduleTeacherClassEntities',
            scopedSlots: { customRender: 'action' },
            align:'center',
        },
    ];
    export default {
        components: {TagSelectOption, CreateModal},
        data() {
            return {
                dataSource:[],
                columns,
                chooseSortClass: false,
                loading:false,
                planData:"",
                planId:"",
                editText:-1,
                id:"",
                form:{
                    name:"",
                    teacher:"",
                },
                rules:{
                    name:[
                        {
                            required:true,
                            message:"请输入人数！",
                            trigger:"blur"
                        }
                    ],
                    teacher:[
                        {
                            required:true,
                            message:"请选择任课教师！",
                            trigger:"blur"
                        }
                    ],
                },
                chooseId:''
            };
        },
        async created() {
            let queryString = (window.location.hash || " ").split('?')[1]
            let planId = (queryString || " ").split('=')[1]
            this.planId = planId;
            if (planId) {
                //获取单个选课计划的信息
                let {data: {result, success}} = await this.$api.schedule.plan.schedulegetInfo({planId})
                console.log(result)
                this.planData = result.name
                console.log(this.planData);
            };
            //选课分班信息查看
            let {data}=await this.$api.schedule.sortClass.classGet({planId});
            this.dataSource=data.rows;
            console.log(this.dataSource);
        },
        methods: {
            edit (value) {
                this.chooseId = value
                this.chooseSortClass = true;
            },
            //保存修改
            async handleOk(){
                // 老师id未查询？？？？？？
                let formData={
                    id:this.chooseId,
                    ...this.form
                }
                let {data}=await this.$api.schedule.sortClass.classAlter(formData)
                alert(data.result?'修改成功':'修改失败')
                this.chooseSortClass=false;
            },
            //取消
            handleCancel(){
                this.chooseSortClass=false;
            },
            back(){
                this.$router.go(-1)
            },
            async onDelete(row){
                console.log(row.id)
                let {data} = await this.$api.schedule.sortClass.classDelete({"ids":[row.id]});
                console.log(data);
                if (data.result) {
                    // 表示请求成功，我们刷新表格数据，重新加载  调用请求表格数据接口函数
                    // this.getTableDat()
                } else {
                    this.$message.error('请求失败')
                }
                // const dataSource = [...this. dataSource];
                // dataSource.splice(event.target.getAttribute('dataIndex'),1);
                // this. dataSource= dataSource
            },
            //手动分班
            manaulSortClass(){
                this.$router.push(`/schedule/detail/sort_class/manual?planId=${this.planId}`)
            },
            //自动分班
            autoSortClass(){
                this.$router.push(`/schedule/detail/sort_class/auto?planId=${this.planId}`)
            },
            clearTable(){
                this. dataSource=[]
            }
        }
    };
</script>

<style lang="less" scoped>
    .result{
        width: 100%;
        height: 300px;
        background-color: white;
        height: 100px;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        vertical-align: top;
        border-radius: 5px;
    }
    .table-bg{
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
    }
    .situation{
        border:1px solid black;
        margin:5px 10px;
        padding:5px 4px;
        border-radius: 4px;
        width: 100%;
        height: 35px;
        font-size: 1.0em;
        margin-right: 1em;
    }
    /deep/ Table {
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
    }
</style>
