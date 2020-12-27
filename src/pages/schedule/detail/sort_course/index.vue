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
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="placeSetting">教师设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="courseSetting">课程设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <a-row class="form"
                style="margin-left: -150px;
                        margin-top:60px">
                <a-form-model :modal="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 8}" >
                    <a-form-model-item label="选择课表模板">
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
    import plan from "../../../../services/api/schedule/plan";
    const columns = [
        {
            title: "",
            dataIndex: "activity"
        },
        {
            title: "星期一",
            dataIndex: "monday"
        },
        {
            title: "星期二",
            dataIndex: "tuesday"
        },
        {
            title: "星期三",
            dataIndex: "wednesday"
        },
        {
            title: "星期四",
            dataIndex: "thursday"
        },
        {
            title: "星期五",
            dataIndex: "friday"
        },
        {
            title: "星期六",
            dataIndex: "saturday"
        },
        {
            title: "星期日",
            dataIndex: "sunday"
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
                }
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
        },
        methods: {
            async handleSelectChange(id) {
                let {data}=await this.$api.basic.template.fetchTemplate({id:this.form.modalId})
                console.log(data.result);
                this.currId=this.form.modalId;
                console.log(this.currId);
                let activities = [];
                let timeDatas = [];
                let list = [...this.activity];
                list.forEach(item => {
                    for (let i = 1; i <= data.result[item.value]; i++) {
                        activities.push({
                            activity: item.name + i,
                            value: item.value + i
                        });
                        timeDatas.push({
                            activity: item.name + i,
                            value: item.value + i,
                            time: [moment(undefined), moment(undefined)]
                        });
                    }
                });
                this.dataSource = activities;
                this.timeData = timeDatas;
            },
            timesSetting(){
                this.$router.push(`/schedule/detail/sort_course/index?planId=${this.planId}`)
            },
            oncesSetting(){
                this.$router.push(`/schedule/detail/sort_course/time?planId=${this.planId}`)
            },
            placeSetting(){
                this.$router.push(`/schedule/detail/sort_course/place?planId=${this.planId}`)
            },
            courseSetting(){
                this.$router.push(`/schedule/detail/sort_course/course/index?planId=${this.planId}`)
            },
            startArray(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            back(){
                this.$router.go(-1)
            },
            async Next(planId,currId){
                console.log(this.planId);
                this.$router.push(`/schedule/detail/sort_course/time?planId=${this.planId}`);
                let {data}=await this.$api.schedule.arrangeClass.saveCoursetime({planId:this.planId,currId:this.currId})
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
    /*/deep/ Table {*/
    /*    .ant-table-tbody > tr:first-child > td,*/
    /*    .ant-table-tbody > tr:last-child > td {*/
    /*        background: #f00;*/
    /*    }*/
    /*}*/
    /deep/ Table{
        .ant-table-thead >tr >th{
            background-color: #f4f4f4;
        }
        .ant-table-tbody > tr:nth-child(4) > td,
        .ant-table-tbody > tr:nth-child(7) > td {
            background-color: #f4f4f4;
        }
    }
</style>
