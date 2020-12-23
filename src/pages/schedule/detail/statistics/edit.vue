<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">修改选课结果</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="12">
                        <span style="font-size:1.5em">{{this.planData}}</span>
                        <span class="link-font-color" style="margin-left:2em">选课时间：{{form.startChooseTime}} ——{{form.endChooseTime}}</span>
                        <span class="link-font-color" style="margin-left:2em">选课中</span>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: #1abc9c;color: white" @click="changeTime">修改选课时间</a-button></a-col>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: red;color: white" @click="Clear">清空</a-button></a-col>
                        <a-col :span="6" ><a-button style="width: 150px;height: 50px;background-color: blue;color: white" @click="back" >返回</a-button></a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <!--       修改选课时间弹窗-->
        <a-modal
                title="修改选课时间"
                :visible="changeChooseTimeModal"
                :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk()">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <div class="chooseData">
                <a-form-model layout="horizontal" ref="ruleForm" :model="form" :rules="rules"
                              :label-col="{span:6}" :wrapper-col="{span:15}">
                    <a-form-model-item label="选课开始时间：" prop="startChooseTime" ref="startChooseTime">
                        <a-date-picker v-model="form.startChooseTime"
                                       :disabled-date="disabledStartDate"
                                       show-time
                                       format="YYYY-MM-DD"
                                       placeholder="设置开始选课时间"
                                       @openChange="handleStartOpenChange"
                                       valueFormat="YYYY-MM-DD"/>
                    </a-form-model-item>
                    <a-form-model-item label="选课结束时间：" prop="endChooseTime" ref="endChooseTime">
                        <a-date-picker v-model="form.endChooseTime"
                                       :disabled-date="disabledEndDate"
                                       show-time
                                       format="YYYY-MM-DD"
                                       placeholder="设置选课结束时间"
                                       :open="endOpen"
                                       @openChange="handleEndOpenChange"
                                       valueFormat="YYYY-MM-DD"/>
                    </a-form-model-item>
                </a-form-model>

            </div>
        </a-modal>
        <div class="info link-font-color">
            已有{{this.chooseCourseData.isChoosen}}人选课 （共{{this.chooseCourseData.total}}人）<font style="color:red">{{this.chooseCourseData.notChoosen}}人未选</font></div>
        <div class="table-bg">
            <!-- statistics -->
            <!-- table -->
            <a-table
                    :rowKey="'subChildId'"
                    :columns="columns"
                    :data-source="dataSource"
                    :bordered = "true"
                    :pagination = "false">
                <span slot="operation" @click="addStudent">添加</span>
                <div slot="studentInfoDtoList" slot-scope="text,record,index">
                    <template v-for="(tag) in text"  >

                        <a-tooltip v-if="tag.length > 20" :title="tag">
                            <a-tag  closable @close="() => handleClose(tag.id)">
                                {{tag}}
                            </a-tag>
                        </a-tooltip>
                        <a-tag v-else closable @close="() => handleClose(tag.id)">
                            {{ tag.stuName}}
                        </a-tag>
                    </template>

                    <a-input
                            v-if="inputVisible && activeIndex === index"
                            ref="input"
                            type="text"
                            size="small"
                            :style="{ width: '78px' }"
                            :value="inputValue"
                            @change="handleInputChange"
                            @blur="handleInputConfirm"
                            @keyup.enter="handleInputConfirm"
                    />
                    <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput(index)">
                        <a-icon type="plus" /> New Tag
                    </a-tag>
                </div>
            </a-table>
            <!-- table -->
            <!-- statistics -->
        </div>
        <a-modal
                :visible='addVisit'
                width="600px"
                :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <a-form-model :form="form" :label-col="{span:5}" :wrapper-col="{span:12}"
                    style="">
                <a-form-model-item label="未选课人员：">
                    <a-radio-group v-decorator="['未选课人员：']">
                        <a-radio value="a">
                           杨安宁
                        </a-radio>
                        <a-radio value="b">
                            车东明
                        </a-radio>
                        <a-radio value="c">
                            张凯元
                        </a-radio>
                    </a-radio-group>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>
<script>
    import CreateModal from "../../../../components/modal/CreateModal";
    import moment from "moment";
    const columns = [
        {
            title: '课程',
            dataIndex: 'subName',
            align:'center',
        },
        {
            title: '已选人数',
            dataIndex: 'stuNumber',
            align:'center',
        },
        {
            title: '课程组合',
            dataIndex: 'studentInfoDtoList',
            align:'center',
            scopedSlots: {customRender: 'studentInfoDtoList'}
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align:'center',
            scopedSlots:{customRender:'operation'},
        },
    ]
    export default {
        data() {
            return {
                size : "small",
                dataSource:[],
                columns,
                visible:false,
                addVisit:false,
                changeChooseTimeModal:false,
                chooseCourseData:"",
                planData:" ",
                loading:false,
                endOpen:false,
                form:{
                    startChooseTime:null,
                    endChooseTime:null,
                },
                rules:{
                    startChooseTime:[
                        {
                            required:true,
                            message:"请选择开始选课时间",
                            trigger:"change",
                        }
                    ],
                    endChooseTime:[
                        {
                            required:true,
                            message:"请选择选课结束时间",
                            trigger:"change",
                        }
                    ]
                },
                inputVisible: false,
                inputValue: '',
                planId:"",
                activeIndex:""
            };
        },
    async created(){
        let queryString=(window.location.hash||" ").split('?')[1]
        let planId=(queryString || " ").split('=')[1]
        this.planId=planId;
        if(planId){
            //获取单个选课计划的信息
            let {data:{result,success}}=await this.$api.schedule.plan.schedulegetInfo({planId})
            this.planData=result.name
            console.log(this.planData);
        }
         //选课结果详情查看
        let {data}=await this.$api.schedule.statics.getResult({planId});
        this.dataSource=data.result;
        console.log(this.dataSource);
        //统计选课人数以及课程被选情况
        let {data:chooseCourse}=await this.$api.schedule.statics.getStudentSelectNum({planId});
        this.chooseCourseData=chooseCourse.result;
        console.log(this.chooseCourseData)
    },
        methods: {
            changeTime(){
                this.changeChooseTimeModal=true;
            },
            disabledStartDate(startValue){
                const endValue=this.form.startChooseTime
                if(!startValue||!endValue){
                    return false;
                }
                return startValue.valueOf()>endValue.valueOf();
            },
            disabledEndDate(endValue){
                const startValue=this.form.startChooseTime;
                if(!endValue||!startValue){
                    return false;
                }
                return startValue.valueOf()>=endValue.valueOf();
            },
            handleStartOpenChange(open){
                if(!open){
                    this.endOpen=true;
                }
            },
            handleEndOpenChange(open){
                this.endOpen=open;
            },
            closed: function () {
                this.changeChooseTimeModal = false
                this.loading = false
            },
            async addStudent(id,subId){
                id=this.planId
                subId=this.dataSource.subChildId;
                this.addVisit=true;
                let {data}=await this.$api.schedule.statics.alterResultButtonFind({id,subId});
                console.log(data);
            },
            async handleOk(id) {
                id=this.planId;
                this.changeChooseTimeModal=false;
                //保存选课时间
                //修改选课时间alterTime
                let timeLimit=this.form.startChooseTime+"——"+this.form.endChooseTime
                let addData={id,timeLimit}
                let {data:changeChooseTime}=await this.$api.schedule.statics.alterTime(addData);
                console.log(changeChooseTime)
                // this.dataSource=data.result;
            },
            handleCancel() {
                this.addVisit = false;
                this.changeChooseTimeModal=false;
            },
            back(){
                this.$router.go(-1)
            },
            Clear(){
                this. classData=[]
            },
            //删除学生
            async handleClose(id) {
                let {data}=await this.$api.schedule.statics.delResult({ids:[id]})
                const tags = this.tags.filter(tag => tag !== removedTag);
                console.log(tags);
                this.tags = tags;
            },

            showInput(value) {
                this.inputVisible = true;
                this.activeIndex  = value
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },
            handleInputChange(e) {
                this.inputValue = e.target.value;
            },
            async handleInputConfirm(id,subId,stuId) {
                id=this.planId
                subId=this.dataSource.subChildId;
                stuId=this.tags;
                let {data}=await this.$api.schedule.statics.alterResultButtonResult({id,subId,stuId});
                console.log(data);
                const inputValue = this.inputValue;
                let tags = this.tags;
                if (inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue];
                }
                console.log(tags);
                Object.assign(this, {
                    tags,
                    inputVisible: false,
                    inputValue: '',
                });

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
    }
</style>
