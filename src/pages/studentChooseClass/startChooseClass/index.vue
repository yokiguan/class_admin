<template>
    <div style="width: 100%">
        <div class="title">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">我的课表</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="left">
            <a-row class="left_title">
                <a-col :span="3"><a-icon type="reload" style="font-size: 1.5em;
                    font-weight: bold"/></a-col>
                <a-col :span="12"><span style="font-size: 1.2em">刷新菜单</span></a-col>
                <a-col><span style="font-size: 1.2em">全部展开</span></a-col>
            </a-row>
            <a-collapse default-active-key="1" :bordered="false" style="margin-top: 20px">
                <template #expandIcon="props">
                    <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
                </template>
                <a-collapse-panel key="1" header="必选基础课">
                    <p>高一语文</p>
                    <p>高一数学</p>
                </a-collapse-panel>
                <a-collapse-panel key="2" header="必选外语课" >
                    <p></p>
                </a-collapse-panel>
            </a-collapse>
        </div>
        <a-card class="right">
            <div class="content">
                <a-row style="height: 40px;background-color:#6Db5a7;
                        color: white;
                        margin-left: 50px;
                        border-radius: 5px;
                        border:1px solid black;">
                    <a-col><span style="float: left;padding: 10px;">张凯元待选课表</span></a-col>
                    <a-col><span style="font-size: 20px;float: left;margin-left:150px;padding-top: 5px" >高二2019-2020第一学期</span></a-col>
                </a-row>
                <a-row class="buttons" style="margin-top: 10px">
                    <a-col :span="4"><button style="background-color: #ffcc00;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="warning">规则说明</button></a-col>
                    <a-col ><button style="background-color: #1abc9c;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float:right;
                        width: 110px"  @click="showSave">保存</button></a-col>
                </a-row>
                <a-row style="float: left;margin-left: 100px;margin-top: 50px"><h3>选中其中2科，语文必选</h3></a-row>
                <a-row style="margin-top:80px;">
                    <a-col :span="4"><h3>必修课：</h3></a-col>
                    <a-col style="margin-left: 120px">
                        <a-table style="width: 50%;" :rowKey="'id'" :columns="column"
                                     :selectRows="rowMustSelection"
                                     :data-source="mustDataSource"
                                     :pagination="false"
                                     :showHeader="false"
                                     @change="mustChange"
                                     bordered>
                        <template slot="chooseTeacher" style="color: blue;" slot-scope="text,record">
                            <span style="float:left">{{text}}</span>
                            <div style="color: blue;margin-left: 100px" @click="addTeacher">
                                <a-icon type="plus" />
                                <span>选择老师</span>
                            </div>
                        </template>
                    </a-table>
                    </a-col>
                </a-row>
                <a-row style="float: left;margin-left: 100px;margin-top: 50px"><h3>选中其中2科，语文必选</h3></a-row>
                <a-row>
                    <a-col :span="4"><h3>选修课：</h3></a-col>
                    <a-col style="margin-left: 120px">
                        <a-table style="width: 50%"
                                 :rowKey="'id'"
                                 :columns="column"
                                 :data-source="chooseDataSource"
                                 :pagination="false"
                                 :showHeader="false"
                                 bordered>
                            <template slot="chooseTeacher" style="color: blue;" slot-scope="text,record">
                                <span style="float:left">{{text}}</span>
                                <div style="color: blue;margin-left: 100px" @click="addTeacher">
                                    <a-icon type="plus" />
                                    <span>选择老师</span>
                                </div>
                            </template>
                        </a-table>
                    </a-col>
                </a-row>
            </div>
        </a-card>
    </div>
</template>
<script>
    const column=[
        {
            title:'',
            dataIndex:'id',
            align:'center'
        }, {
            title:'课程名',
            dataIndex:'subject',
            align:'center'
        }, {
            title:'老师',
            dataIndex:'teacher',
            align:'center',
            scopedSlots: { customRender: 'chooseTeacher' },
        },
    ];
    const mustDataSource=[
        {
            subject:'语文',
            teacher:'张凯元*'
        },
        {
            subject:'数学',
        },
        {
            subject:'英语',
        }
    ]
    const chooseDataSource=[
        {
            subject:'物理选修',
            teacher:'张凯元*'
        },
        {
            subject:'化学选修',
        },
        {
            subject:'生物选修',
        }
    ]
    export default {
        data() {
            return {
                column,
                mustDataSource,
                chooseDataSource,
                planId:"",
                selectedRowKeys:[],
                selectedRows:[],
            };
        },
        //查看单个选课计划
        async created() {
            let queryString = (window.location.hash || " ").split('?')[1]
            let planId = (queryString || " ").split('=')[1]
            this.planId = planId;
            this.chooseCourseInfo();
        },
        methods: {
            //开始选课查看
            async chooseCourseInfo(){
                // console.log(this.planId);
                // let {data}=await this.$api.studentChooseCourse.studentChooseCourse.getCourseSelect({planId:this.planId})
                // console.log(data);
            },
            //选择必修课
            rowMustSelection(){

            },
            //选择必修课
            mustChange(selectedRowKeys,selectedRows){
              this.selectedRowKeys=selectedRowKeys;
              this.selectedRows=selectedRows;
            },
            //规则说明查看
            warning(){
                this.$warning({
                    title: 'This is a warning message',
                    content: 'some messages...some messages...',
                });
            },
            //添加老师
            addTeacher(){

            },
            showSave() {
            },
        },
    };
</script>

<style lang="less" scoped>
    .title{
        width: 100%;
        background-color: white;
        height:50px;
        margin: 20px 0px 10px 0px;
        padding-left: 25px;
        padding-top: 15px;
        vertical-align: top;
        border-radius: 5px;
    }
    .left{
        width: 300px;
        height: 900px;
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 10px;
    }
    .right{
        border-radius: 5px;
        margin-top: -920px;
        margin-left: 320px;
        height:900px;
    }
    .content{
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        margin-top:35px;
        width: 100%;
        background-color: #fff;
    }
</style>

