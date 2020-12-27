<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">选课排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">课程设置</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">同时上课</a></a-breadcrumb-item>
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
                        width: 100px" @click="back">返回</button> </a-col>
            </a-row>
        </div>
        <!-- /result -->
        <a-card class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="placeSetting">教师设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="courseSetting">课程设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <a-table :columns="columns"
                     :data-source="dataSource"
                     :pagination="false"
                     :bordered="true"
                     class="table">
                <div slot="kind" slot-scope="kind">
                    <a-select :default-value="kind">
                        <a-select-option :value="true"> 同时不同教室 </a-select-option>
                        <a-select-option :value="false"> 同时同教室 </a-select-option>
                    </a-select>
                </div>
                <a-button slot="add_course" style="background-color: #00ccff;
                    width: 100px;
                    color: white;
                    height:40px;"
                          @click="add_course">添加课程</a-button>
                <span slot="action" slot-scope="text" style="color:blue" @click="onDelete">删除</span>
            </a-table>
            <div style="
                    margin-top: 20px;
                    margin-left: 55px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;" @click="AddContent">
                <a-icon type="plus" />
                <span> 添加一项</span>
            </div>
<!--            选择课程-->
            <a-modal  title="选择课程"
                      :visible="chooseCourseModal"
                      :closable="false">
                <template slot="footer">
                    <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                    <a-button key="back" @click="handleCancel">取消</a-button>
                </template>
                <a-checkbox-group @change="onChange" v-for="(course,index) in this.course" :key="index">
                    <a-checkbox :value="course.id">{{course.subName}}</a-checkbox>
                </a-checkbox-group>
            </a-modal>
        </a-card>
        <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        margin-top:100px;
                        margin-bottom: 20px;
                        width: 100px" @click="Next">下一步</button>
    </div>
</template>
<script>
    const columns = [
        {
            title: ' ',
            dataIndex: 'id',
            align:'center'
        },
        {
            title: '分组名称',
            dataIndex: 'groupName',
            align:'center'
        },
        {
            title:'类型',
            dataIndex:'type',
            scopedSlots: { customRender: 'kind' },
            align:'center'
        },
        {
            title: '课程',
            dataIndex: 'subject',
            scopedSlots: { customRender: 'add_course' },
            align:'center'
        },
        {
            title: '操作',
            dataIndex: 'opt',
            scopedSlots: { customRender: 'action' },
            align:'center'
        },
    ];
    export default {
        data() {
            return {
                dataSource:[],
                columns,
                loading: false,
                planData:"",
                planId:"",
                chooseCourseModal:false,
                course:"",
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
            //获取同时上课规则信息
            let {data}=await this.$api.schedule.arrangeClass.banGetting({planId:"940085b583944e19a0a098ca24804afc",htId:"14010510RBRSUU7",ruleType:"1"})
            console.log(data);
            this.dataSource=data.rows;
        },
        methods: {
            async add_course(id) {
                this.chooseCourseModal = true;
                this.chooseCourseId=this.dataSource.findIndex(item=>item.id==id);
                //获取课程接口
                let { data } = await this.$api.basic.subject.fetchMainList();
                // console.log(data);
                this.course=data.rows;
                console.log( this.course);
            },
            change: function () {
                this.visible = true;
            },
            handleCancel () {
                this.loading = false;
                this.chooseCourseModal=false;
            },
            handleOk () {
                this.loading=true;
                setTimeout(() => {
                    this.chooseCourseModal = false;
                    this.loading = false;
                    for(let i=0;i<this.course.length;i++){
                        if(this.subjectId==this.course[i].id){
                            console.log(this.course[i].subName);
                            this.dataSource[this.chooseCourseId].groupName=this.course[i].subName;
                            console.log( this.dataSource[this.chooseCourseId].groupName);
                        }
                    }
                }, 20)
            },
            onChange(e){
                console.log('radio checked',e.target.value)
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
            Next(){
              this.$router.push(`/schedule/detail/sort_course/course/course/banned_subject?planId=${this.planId}`)
            },
            //添加一项规则
            AddContent(){
                const { count, dataSource} = this;
                // let {data}=await this.$api.schedule.arrangeClass.banAdding()
                const newData = {
                    id:this.dataSource.length+1,
                };
                this.dataSource= [...dataSource, newData];
                this.count = count + 1;
            },
            //删除一行数据
            async onDelete(id){
                let {data}=await this.$api.schedule.arrangeClass.banDeleting({ids:[id]});
                console.log(data);
                if(data&&data.success){
                    //获取互斥规则信息
                    let {data}=await this.$api.schedule.arrangeClass.banGetting({planId:"940085b583944e19a0a098ca24804afc",htId:"14010510RBRSUU7",ruleType:"0"})
                    console.log(data);
                    this.dataSource=data.rows;
                    message.info('删除成功');
                }else{
                    message.info('删除失败');
                }
            },
            back(){
                this.$router.go(-1)
            },
            click:function(){},
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
        height: 600px;
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
        width: 65%;
    }
</style>
