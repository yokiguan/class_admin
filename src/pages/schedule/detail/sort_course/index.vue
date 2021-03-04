<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">选课排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">课时设置</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                <a-col><button style="background-color: blue;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 100px" @click="back">返回</button></a-col>
            </a-row>
        </div>
        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="placeSetting">教室设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="courseSetting">课程设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <a-row class="form" style="margin-left: -150px;margin-top:60px">
                <a-form-model :modal="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 8}" >
                    <a-form-model-item label="选择课表模板" ref="modalId" prop="modalId">
                        <a-select @change="handleSelectChange" :default-value="modalInfo[0]" v-model="form.modalId">
                            <a-select-option v-for="(modalName,index) in modalInfo" :key="index" :value="modalName.id">
                                {{modalName.templateName}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
            </a-row>
            <a-table
                    :rowKey="`activity`"
                    :columns="columns"
                    :data-source="dataSource"
                    :pagination="false"
                    :bordered="true"
            style="margin-top: 10px;
                    margin-left: 50px">
            </a-table>
            <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        margin-top: 50px;
                        width: 150px" @click="Next">下一步</button>
        </div>
    </div>
</template>
<script>
    import moment from "moment";
    import {message} from "ant-design-vue";
    import plan from "../../../../services/api/schedule/plan";
    const columns = [
        {
            title: "",
            dataIndex: "activity",
            align:'center',
        },
        {
            title: "星期一",
            dataIndex: "monday",
            align:'center',
        },
        {
            title: "星期二",
            dataIndex: "tuesday",
            align:'center',
        },
        {
            title: "星期三",
            dataIndex: "wednesday",
            align:'center',
        },
        {
            title: "星期四",
            dataIndex: "thursday",
            align:'center',
        },
        {
            title: "星期五",
            dataIndex: "friday",
            align:'center',
        },
        {
            title: "星期六",
            dataIndex: "saturday",
            align:'center',
        },
        {
            title: "星期日",
            dataIndex: "sunday",
            align:'center',
        }
    ];
    const activity = [
        {
            name: "早读",
            options: [0, 1, 2],
            value: "morningread"
        },
        {
            name: "上午",
            options: [0, 1, 2, 3, 4],
            value: "morning"
        },
        {
            name: "中午",
            options: [0, 1, 2],
            value: "noon"
        },
        {
            name: "下午",
            options: [0, 1, 2, 3, 4],
            value: "afternoon"
        },
        {
            name: "晚自习",
            options: [0, 1, 2, 3, 4],
            value: "evening"
        }
    ];
    export default {
        data() {
            return {
                columns,
                dataSource:[],
                activity,
                timeData:[],
                planData:"",
                planId:"",
                currId:"",
                modalInfo:[],
                modalName:"",
                modalIds:[],
                form:{
                    modalId:" ",
                },
                modalId:"",
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
            //获取课表模板信息
            let {data}=await this.$api.basic.template.fetchList()
            this.modalInfo=data.rows;
            console.log(this.modalInfo);
            for(var i=0;i<this.modalInfo.length;i++){
                this.modalIds.push(this.modalInfo[i].id);
            }
            console.log(this.modalIds);
            this.lookInfo();
        },
        methods: {
            //课时设置查看
            async lookInfo(){
                let {data:{result,success}}=await this.$api.schedule.arrangeClass.timeLookInfo({planId:this.planId});
                console.log(result);
                this.modalId=result.currId;
                console.log(this.modalId);
                this.modalInformation();
            },
            //获取课表模板相关信息
            async modalInformation() {
                let {data:{result,success}}=await this.$api.basic.template.fetchTemplate({id:this.modalId});
                console.log(result);
                this.currId=this.modalId;
                // console.log(this.currId);
                let activities = [];
                let list = [...this.activity];
                list.forEach(item => {
                    for (let i = 1; i <= result[item.value]; i++) {
                        activities.push({
                            activity: item.name + i,
                            value: item.value + i
                        });
                    }
                });
                this.dataSource= activities;
                this.form.modalId=result.templateName;
                // console.log(this.tableData)
            },
            //模板选择
            async handleSelectChange(id) {
                let {data}=await this.$api.basic.template.fetchTemplate({id:this.form.modalId})
                // console.log(data.result);
                this.currId=this.form.modalId;
                console.log(this.currId);
                let activities = [];
                let list = [...this.activity];
                list.forEach(item => {
                    console.log(item.value);
                    for (let i = 1; i <= data.result[item.value]; i++) {
                        activities.push({
                            activity: item.name + i,
                            value: item.value + i
                        });
                    }
                });
                this.dataSource = activities;
            },
            //课时设置
            timesSetting(){
                this.$router.push(`/schedule/detail/sort_course/index?planId=${this.planId}`)
            },
            //课节设置
            oncesSetting(){
                this.$router.push(`/schedule/detail/sort_course/time?planId=${this.planId}`)
            },
            //教室设置
            placeSetting(){
                this.$router.push(`/schedule/detail/sort_course/place?planId=${this.planId}`)
            },
            //课程设置
            courseSetting(){
                this.$router.push(`/schedule/detail/sort_course/course/index?planId=${this.planId}`)
            },
            //开始排课
            startArray(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            //返回
            back(){
                this.$router.go(-1)
            },
            //保存并跳转至下一步
            async Next(planId,currId){
                console.log(this.form.modalId);
                if(this.form.modalId==" "){
                    message.info("请选择课表模板！");
                }else{
                    this.$router.push(`/schedule/detail/sort_course/time?planId=${this.planId}`);
                    //保存课表模板
                    let {data}=await this.$api.schedule.arrangeClass.saveCoursetime({planId:this.planId,currId:this.currId})
                }
            }
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
    .time1{
        width: 100%;
        height: 30px;
        padding-top:5px;
        background-color: #d9d9d9;
    }
</style>
