<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">选课分班</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">手动分班</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="18">
                    <span style="font-size:1.5em">高一2019-2020第一学期排课计划 -手动分班</span>
                    <!-- <br>
                    <span style="margin-left:2em">未分班人数<font style="color:red">100</font>人</span> -->
                </a-col>
                <a-col><button style="width: 100px;height: 40px;background-color: blue;color: white;border-radius: 5px;border: none" @click="back">返回</button>
                </a-col>
            </a-row>
        </div>
        <div class="table-bg">
            <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :bordered="true">
                <div
                        slot="situation"
                        slot-scope="data"
                >
                    <div v-for="(item, index) in data" :key="index" class="situation">
                        <div class="situation-header">
                            {{item.class}}{{item.teacher}}（共有学生{{item.all}}人）
                            <span style="color:red;float:right">删除</span>
                            <span style="color:blue;float:right;margin-right:1em;" @click="change">修改</span>
                        </div>
                        <div class="situation-body">
                            <a-button v-for="(stu, sindex) in item.students" :key="sindex"
                                >
                                {{stu}}

                            </a-button>
                        </div>
                    </div>
                    <a-button icon="plus"
                              style="background-color: #169bd5;color:white;" @click="add">
                        添加班级
                    </a-button>
                </div>
            </a-table>
            <create-modal
                    width="760px"
                    :visible="visible"
                    :loading="loading"
                    :close="false"
                    @modalClosed="closed"
                    @modalSubmit="handleSubmit">
                <div slot="content">
                    <a-form :form="form" :label-col="{ span:5 }" :wrapper-col="{ span: 19}" @submit="handleSubmit">
                        <a-form-item label="班级名称：" style="margin-top: 50px">
                            <!-- <a-date-picker v-decorator="['date-picker', config]" /> -->
                            <a-input placeholder="请输入" style="width: 500px;height: 35px"/>
                        </a-form-item>
                        <a-form-item label="任课教师：">
                            <a-select
                                    v-decorator="['任课教师',{ rules: [{ required: true, message: 'Please select your teacher!' }] },]"
                                    placeholder="张凯元"
                                    @change="handleSelectChange"
                                    style="width: 500px;height: 35px">
                                <a-select-option value="kaiyuanZhang">
                                    张凯元
                                </a-select-option>
                                <a-select-option value="yuanchaoLi">
                                    李援朝
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-form>
                </div>
            </create-modal>
            <div style="margin: 20px 0px 20px 40%">
                <a-button type="primary" style="margin-right:40px">保存</a-button>
                <a-button type="primary">返回</a-button>
            </div>
        </div>
    </div>
</template>
<script>
    // import echarts from 'echarts'

    import CreateModal from "../../../../components/modal/CreateModal";

    const columns = [
        { title: '学科',
            dataIndex: 'subject',
            key: 'subject'
        },
        {
            title: '未分班学生',
            dataIndex: 'unsorted',
            key: 'unsorted',
        },
        {
            title: '分班情况',
            dataIndex: 'situation',
            key: 'situation',
            scopedSlots: { customRender: 'situation' }
        },
    ];

    let tableData = [
        {
            key: 0,
            subject: '高一语文',
            unsorted: 10,
            situation:[
                {
                    class:"语文一班",
                    teacher:"张开源老师",
                    all:100,
                    students:[
                        "张三","里斯","王麻子"," ... ","+"
                    ]},
                {
                    class:"语文二班",
                    teacher:"张源老师",
                    all:100,
                    students:[
                        "张三","里斯","王麻子"," ... ","+"
                    ]}
            ]
        },
        {
            key: 1,
            subject: '高一语文',
            unsorted: 10,
        },
        {
            key: 2,
            subject: '高一语文',
            unsorted: 10,
        },
        {
            key: 3,
            subject: '高一语文',
            unsorted: 10,
        },
    ];
    export default {
        components: {CreateModal},
        data() {
            return {
                tableData,
                columns,
                visible: false,
            };
        },
        methods: {
            add: function () {
                this.visible = true;
            },
            change: function () {
                this.visible = true;
            },
            closed: function () {
                this.visible = false
                this.loading = false
            },
            handleSubmit: function () {
                const that = this
                console.log(that.$refs.createForm)
                that.loading = true
                setTimeout(() => {
                    that.dataSource.push(
                        {
                            avatar:
                                "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
                            content: "班级名称：请输入/任课教师：张凯元",
                        }
                    ),
                        that.visible = false
                    that.loading = false
                }, 2000)
            },
            changeMax: function (key, val) {
                this.tableData[key].max = val
            },
            changeClassNum: function (key, val) {
                this.tableData[key].classNum = val
            },
            changeAve: function (key, val) {
                this.tableData[key].ave = val
            },
            editInfo: function (key) {
                console.log(key)
            },
            back(){
              this.$router.push('/schedule/detail/sort_class/admin')
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
    .table-bg input{
        border:1px solid black;
        border-radius: 5px;
        width:6em;
    }
    .situation{
        height:120px;
        border:0.5px solid #ededed;
        margin-bottom: 2em;
    }
    .situation button{
        background-color: #169bd5;
        color:white;
        margin-right: 1em;
    }
    .situation-header{
        height:30px;
        width:100%;
        background-color: #f2f2f2;
        padding:0.5em;
    }
    .situation-body{
        padding:0.5em;
        height:80px;
        width:100%;
    }
</style>
