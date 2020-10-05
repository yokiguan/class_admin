<template>
    <div>
        <!-- result -->
        <div class="result">
            <a-row>
                <a-col :span="12">
                    <span style="font-size:1.5em">高一2019-2020第一学期排课计划 -自动分班</span>
                    <!-- <br>
                    <span style="margin-left:2em">未分班人数<font style="color:red">100</font>人</span> -->
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="6">
                            <a-button type="primary" @click="maxNum">统一设置最大人数</a-button></a-col>
                        <a-col :span="6">
                            <a-button type="primary" @click="timeNum">统一设置课时数</a-button></a-col>
                        <!-- <a-col :span="6"><a-button type="danger">清空</a-button></a-col> -->
                        <a-col :span="6"><a-button>返回</a-button></a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <create-modal
                :visible="visible"
                :loading="loading"
                @modalClosed="closed"
                @modalSubmit="handleSubmit">
            <div slot="content">
                <a-form v-bind="formItemLayout" @submit="handleSubmit" ref="createForm">
                    <a-form-item label="最大人数：">
                        <!-- <a-date-picker v-decorator="['date-picker', config]" /> -->
                        <a-input placeholder="请输入"/>
                    </a-form-item>
                </a-form>
            </div>
        </create-modal>
        <create-modal
                :visible="visit"
                :loading="load"
                @modalClosed="close"
                @modalSubmit="handle">
            <div slot="content">
                <a-form v-bind="formItemLayout" @submit="handle" ref="createForm">
                    <a-form-item label="课时数：">
                        <!-- <a-date-picker v-decorator="['date-picker', config]" /> -->
                        <a-input placeholder="请输入"/>
                    </a-form-item>
                </a-form>
            </div>
        </create-modal>
        <!-- <div class="info link-font-color">已有900人选课 （共1000人）<font style="color:red">100人未选</font></div> -->
        <!-- /result -->
        <div class="table-bg">
            <div style="margin: 5px 0px 10px 50%">
                可用教室数:
                <input type="text" value="16">
            </div>
            <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :bordered="true">
                <input
                        slot="classNum"
                        slot-scope="classNum"
                        :value="classNum"
                        @change="changeMax(record.key, classNum)"
                >
                <input
                        slot="max"
                        slot-scope="max"
                        :value="max"
                        @change="changeClassNum(record.key, max)"
                >
                <input
                        slot="classTime"
                        slot-scope="classTime"
                        :value="classTime"
                        @change="changeAve(record.key, classTime)"
                >
                <a-button
                        slot="action"
                        slot-scope="text"
                        @click="editInfo(record.key)"
                        style="background-color:blue;color:white"
                >
                    {{text}}
                </a-button>
                import record from '../../../../components/menu/menu';

            </a-table>
            <div style="margin: 20px 0px 20px 40%">
                <a-button type="primary" style="margin-right:40px">开始</a-button>
                <a-button type="primary">返回</a-button>
            </div>
        </div>
    </div>
</template>
<script>
    // import echarts from 'echarts'

    import CreateModal from "../../../../components/modal/CreateModal";
    const columns = [
        { title: '分类',
            dataIndex: 'category',
            key: 'category'
        },
        {
            title: '学生总人数',
            dataIndex: 'all',
            key: 'all',
        },
        {
            title: '未分班人数',
            dataIndex: 'unsorted',
            key: 'unsorted',
        },
        {
            title: '分班个数',
            key: 'classNum',
            dataIndex: 'classNum',
            scopedSlots: { customRender: 'classNum' }
        },
        {
            title: '平均人数',
            key: 'ave',
            dataIndex: 'ave'
        },
        {
            title: '每班最大人数',
            key: 'max',
            dataIndex: 'max',
            scopedSlots: { customRender: 'max' }
        },
        {
            title: '每周课时数',
            key: 'classTime',
            dataIndex: 'classTime',
            scopedSlots: { customRender: 'classTime' }
        },
        {
            title: '教师所教班级个数',
            key: 'teacherclassNum',
            dataIndex: 'teacherclassNum'
        },
        {
            title: '操作',
            key: 'opt',
            dataIndex: 'opt',
            scopedSlots: { customRender: 'action' }
        },
    ];
    let tableData = [
        {
            key: 0,
            category: '高一语文',
            all: 30,
            unsorted: 10,
            classNum: 4,
            ave:2,
            max:10,
            classTime:12,
            teacherclassNum:2,
            opt: "添加"
        },
        {
            key: 1,
            category: '高一语文',
            all: 30,
            unsorted: 10,
            classNum: 4,
            ave:2,
            max:10,
            classTime:12,
            teacherclassNum:2,
            opt: "添加"
        },
        {
            key: 2,
            category: '高一语文',
            all: 30,
            unsorted: 10,
            classNum: 4,
            ave:2,
            max:10,
            classTime:12,
            teacherclassNum:2,
            opt: "添加"
        },
        {
            key: 3,
            category: '高一语文',
            all: 30,
            unsorted: 10,
            classNum: 4,
            ave:2,
            max:10,
            classTime:12,
            teacherclassNum:2,
            opt: "添加"
        },
    ];
    export default {
        components: {CreateModal},
        data() {
            return {
                tableData,
                columns,
                visible: false,
                visit:false
            };
        },
        methods: {
            maxNum: function () {
                this.visible = true;
            },
            timeNum: function () {
                this.visit = true;
            },
            closed: function () {
                this.visible = false
                this.loading = false
            },
            close: function () {
                this.visit = false
                this.load = false
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
                            content: "班级名称：请输入",
                        }
                    ),
                        that.visible = false
                    that.loading = false
                }, 2000)
            },
            handle: function () {
                const that = this
                console.log(that.$refs.createForm)
                that.load = true
                setTimeout(() => {
                    that.dataSource.push(
                        {
                            avatar:
                                "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
                            content: "课时数：请输入",
                        }
                    ),
                        that.visit = false
                    that.load = false
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
</style>
