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
                        <span class="link-font-color" style="margin-left:2em">选课时间：{{this.result.timeLimit}}</span>
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
                <span slot="operation" slot-scope="text,record" @click="addStudent(record.subChildId)">添加</span>
                <div slot="studentInfoDtoList" slot-scope="text,record,index">
                    <template v-for="(tag) in text"  >
                        <a-tag  closable @close="handleClose(tag)">
                        {{ tag.stuName}}
                    </a-tag>
                    </template>
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
            <a-form-model :model="form" :rules="rules" :label-col="{span:5}" :wrapper-col="{span:12}" style="">
                <a-form-model-item label="未选课人员：" prop="unStudent" ref="unStudent">
                    <a-checkbox-group v-model="form.unStudent">
                        <a-checkbox v-for="(unChoosePerson,index) in this.unChooseNums"  @change="onChange" :value="unChoosePerson.stuId">
                           {{unChoosePerson.stuName}}
                        </a-checkbox>
                    </a-checkbox-group>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>
<script>
    import CreateModal from "../../../../components/modal/CreateModal";
    import moment from "moment";
    const columns = [{
        title: '',
        dataIndex: 'subChildId',
        align:'center',
        customRender: function(t, r, index) {
            return parseInt(index) + 1
        }
    },
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
                planId:"",
                changeChooseTimeModal:false,
                chooseCourseData:"",
                planData:" ",
                loading:false,
                endOpen:false,
                form:{
                    startChooseTime:null,
                    endChooseTime:null,
                    unStudent:null,
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
                tags:[],
                inputVisible: false,
                inputValue: '',
                planId:"",
                activeIndex:"",
                subChildId: null,
                editText:-1,
                unChooseNums:[],
                result:[],
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
        console.log(data.result)
        // this.dataSource=data.result.splice(1,data.result.length - 1);
        this.dataSource=data.result;
        console.log(this.dataSource);
        for(var i=0;i<this.dataSource.length;i++){
            this.tags.push(this.dataSource[i].studentInfoDtoList)
        }
        console.log(this.tags);
        //统计选课人数以及课程被选情况
        let {data:chooseCourse}=await this.$api.schedule.statics.getStudentSelectNum({planId:this.planId});
        this.chooseCourseData=chooseCourse.result;
        console.log(this.chooseCourseData);
        this.lookInfo();
    },
        methods: {
            //指定排课计划信息查看
            async lookInfo(){
                this.planId = window.location.href.split('?')[1].split('=')[1];
                let {data:{result,success}}=await this.$api.schedule.plan.schedulegetInfo({planId:this.planId});
                console.log(result);
                this.result=result;
                console.log(this.result);
            },
            onChange(checkedValues) {
                console.log('checked = ', checkedValues);
            },
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
            //获取未选课学生的信息
            async addStudent(id){
                this.addVisit=true;
                this.editText=this.dataSource.findIndex(item=>item.subChildId==id);
                for(let i=0;i<this.dataSource.length;i++){
                    this.subId=this.dataSource[this.editText].subChildId;
                }
                console.log(this.subId)
                let {data}=await this.$api.schedule.statics.alterResultButtonFind({planId:this.planId,subId:this.subId});
                this.unChooseNums=data.result;
                console.log( this.unChooseNums);
            },
            async handleOk(id) {
                id=this.planId;
                //保存选课时间
                //修改选课时间alterTime
                let timeLimit=this.form.startChooseTime+"——"+this.form.endChooseTime
                let addData={id,timeLimit}
                let {data:changeChooseTime}=await this.$api.schedule.statics.alterTime(addData);
                console.log(changeChooseTime)
                ////将未选课的学生添加进已选课程中
                let {data:saveData}=await this.$api.schedule.statics.alterResultButtonResult({planId:this.planId,subId:this.subId,stuIdList:this.form.unStudent})
                console.log(saveData);
                this.changeChooseTimeModal=false;
                this.addVisit = false;
                //刷新界面
                // //选课结果详情查看
                let {data}=await this.$api.schedule.statics.getResult({planId});
                console.log(data.result)
                // this.dataSource=data.result.splice(1,data.result.length - 1);
                this.dataSource=data.result;
                console.log(this.dataSource);
                this.dataSource=data.result.splice(1,data.result.length - 1);
                console.log(this.dataSource);
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
            //删除已选课的学生
            async handleClose(removedTag) {
               let mineIds = []
                mineIds.push(removedTag.id)
                console.log(mineIds)
                let {data} = await this.$api.schedule.statics.delResult({ids:mineIds})
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
