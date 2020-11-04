<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">选课分班</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">自动分班</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="12">
                    <span style="font-size:1.5em">高一2019-2020第一学期排课计划 -自动分班</span>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-button style="width: 150px;height: 40px;background-color: #1abc9c;color: white" @click="maxNum">统一设置最大人数</a-button>
                        <a-button style="margin-left:50px;width: 150px;height: 40px;background-color: #1abc9c;color: white" @click="timeNum">统一设置课时数</a-button>
                        <button style="margin-left:50px;width: 100px;height: 40px;background-color: blue;color: white;border-radius: 5px;border: none" @click="back">返回</button>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <create-modal
                width="760px"
                :close="false"
                :visible="numvisible"
                :loading="loading"
                @modalClosed="closed"
                @modalSubmit="handleSubmit">
            <div slot="content">
                <a-form :form="form" :label-col="{ span:5 }" :wrapper-col="{ span: 19}" @submit="handleSubmit">
                    <a-form-item label="最大人数：" style="margin-top: 50px">
                        <a-input placeholder="请输入" style="width: 500px;height: 35px"/>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 8, offset:1 }" :label-col="{ span:4}" >
                        <a-checkbox @change="onChange" style="margin-top: 30px;margin-left: 100px;font-size: 15px">
                            生成班级个数
                        </a-checkbox>
                    </a-form-item>
                </a-form>
            </div>
        </create-modal>
        <create-modal
                width="760px"
                :close="false"
                :visible="timevisible"
                :loading="loading"
                @modalClosed="closed"
                @modalSubmit="handlesubmit">
            <div slot="content">
                <a-form :form="form" :label-col="{ span:5 }" :wrapper-col="{ span: 19}" @submit="handleSubmit">
                    <a-form-item label="课时数：" style="margin-top: 50px">
                        <!-- <a-date-picker v-decorator="['date-picker', config]" /> -->
                        <a-input placeholder="请输入" style="width: 500px;height: 35px"/>
                    </a-form-item>
                </a-form>
            </div>
        </create-modal>
        <div class="table-bg">
            <a-form :form="form" :label-col="{ span:6 }" :wrapper-col="{ span: 13 }" style="margin-left: 300px">
                <a-form-item label="可用教室数：">
                    <a-input  placeholder="16" style="width: 300px;"></a-input>
                </a-form-item>
            </a-form>
            <a-table :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :bordered="true">
                <input slot="classNum"
                        slot-scope="classNum"
                        :value="classNum"
                        @change="changeMax(record.key, classNum)">
                <input slot="max"
                        slot-scope="max"
                        :value="max"
                        @change="changeClassNum(record.key, max)">
                <input slot="classTime"
                        slot-scope="classTime"
                        :value="classTime"
                        @change="changeAve(record.key, classTime)">
                <a-button slot="action"
                        slot-scope="text"
                        @click="add"
                        style="background-color:blue;color:white">{{text}}</a-button>
            </a-table>
            <div style="margin: 20px 0px 20px 40%">
                <a-button type="primary" style="margin-right:40px;margin-top: 50px;width: 100px;height: 40px">开始分班</a-button>
                <a-button type="primary" style="width: 100px;height: 40px">返回</a-button>
            </div>
        </div>
<!--        添加-->
        <a-modal :visible='addVisit' width="800px" :closable="false" on-ok="handleOk">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleAdd">添加
                </a-button>
                <a-button key="back" @click="handleCancel">取消
                </a-button>
            </template>
            <div class="title" style="width:770px;height: 50px;border-radius: 5px; margin-left: -10px;
                        margin-top: -10px; background-color: #6Db5a7">
                <h3 style="color: white;padding-top: 10px;padding-left: 20px">老师所教班级个数</h3>
            </div>
            <div class="content_table" style="margin-top: 10px;margin-left: -10px">
                <div class="left" style="width: 300px;height:500px">
                    <a-row class="left_title">
                        <a-col :span="12"><span style="font-size: 1.2em;font-weight: bold">老师列表：</span></a-col>
                    </a-row>
                    <a-row style="font-size: 1.2em;margin-top: 10px;margin-bottom: 10px">
                        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                            <a-form-item label="选择老师">
                                <a-input placeholder="请输入" v-decorator="['选择老师', { rules: [{ required: true, message: '请选择老师' }] }]"/>
                            </a-form-item>
                        </a-form>
                        <span style="float: right;margin-top: -50px">全部展开</span>
                    </a-row>
                    <a-divider style="background-color: black;margin-top: -50px"></a-divider>
                    <a-tree
                            :tree-data="treeData"
                            :default-expanded-keys="['0-0-0', '0-0-1']"
                            :default-selected-keys="['0-0-0', '0-0-1']"
                            :default-checked-keys="['0-0-0', '0-0-1']"
                            :replace-fields="replaceFields"
                            @select="onSelect"
                            @check="onCheck"
                            checkable
                            style="font-size: 1.3em;margin-top: -20px"/>
                </div>
                <a-divider type="vertical" style="background-color: black; height: 500px;margin-left: 310px;margin-top: -500px"/>
                <div class="right" style="position:relative;float: right;margin-top: -480px">
                    <a-row style="margin-left: 30px">
                        <a-col :span="10"><span style="font-size: 1.2em;font-weight: bold">已选教师：</span></a-col>
                        <a-col> <span style="font-size: 1.2em;">全部清除</span></a-col>
                    </a-row>
                    <a-table
                        :columns="teacherColumns"
                        :data-source="teacherData"
                        :pagination="false"
                        :bordered="true"
                        :cell-style="changeCellStyle"
                        style="float:right;width: 400px;margin-right: 30px;margin-top: 30px">

                    <a-input slot="classNums" placeholder="0"></a-input>
                     <button slot="delete"
                             style="background-color: red;color: white;border: none;width: 80px;height: 30px;border-radius: 5px">删除</button>
                </a-table></div>

            </div>
        </a-modal>
    </div>
</template>
<script>
    import CreateModal from "../../../../components/modal/CreateModal";
    const columns = [
        { title: '分类',
            dataIndex: 'category',
            key: 'category',
            className:'class_color',
            scopedSlots: { customRender: '分类' },
        },
        {
            title: '学生总人数',
            dataIndex: 'all',
            key: 'all',
            className:'class_color'
        },
        {
            title: '未分班人数',
            dataIndex: 'unsorted',
            key: 'unsorted',
            className:'class_color'
        },
        {
            title: '分班个数',
            key: 'classNum',
            dataIndex: 'classNum',
            scopedSlots: { customRender: 'classNum' },
            className:'class_color'
        },
        {
            title: '平均人数',
            key: 'ave',
            dataIndex: 'ave',
            className:'class_color'
        },
        {
            title: '每班最大人数',
            key: 'max',
            dataIndex: 'max',
            scopedSlots: { customRender: 'max' },
            className:'class_color'
        },
        {
            title: '每周课时数',
            key: 'classTime',
            dataIndex: 'classTime',
            scopedSlots: { customRender: 'classTime' },
            className:'class_color'
        },
        {
            title: '教师所教班级个数',
            key: 'teacherclassNum',
            dataIndex: 'teacherclassNum',
            className:'class_color'
        },
        {
            title: '操作',
            key: 'opt',
            dataIndex: 'opt',
            scopedSlots: { customRender: 'action' },
            className:'class_color'
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
    const treeData = [
        {
            name: '小学语文',
            key: '0-0',
            child: [
                { name: '赵卫民', key: '0-0-0'},
                { name: '李援朝', key: '0-0-1' },
            ],
        },
        {
            name: '初中英语',
            key: '0-1',
            child: [
                { name: '赵卫民', key: '0-1-0'},
                { name: '李援朝', key: '0-1-1' },
            ],
        },
    ];
    const teacherColumns=[
        {
            title:'教师名称',
            key:'teacherName',
            dataIndex:'teacherName',
            align:'center',
            width:'30%',
        },{
        title: '所教班级个数',
            key:'classNum',
            dataIndex:'classNum',
            align: 'center',
            width: '45%',
            scopedSlots: { customRender: "classNums" },
        },{
            title:'操作',
            key:'opt',
            dataIndex:'opt',
            align:'center',
            width:'25%',
            scopedSlots: { customRender: "delete" },
        }
    ]
    const teacherData=[
        {
            teacherName:'李援朝',
        },
        {
            teacherName:'赵卫民',
        },{

        },{

        }
    ]
    export default {
        components: {CreateModal},
        data() {
            return {
                tableData,
                columns,
                treeData,
                teacherColumns,
                teacherData,
                numvisible: false,
                timevisible: false,
                addVisit:false,
                visit:false,
                replaceFields: {
                    children: 'child',
                    title: 'name',
                },
            };
        },
        methods: {
            maxNum: function () {
                this.numvisible = true
            },
            timeNum: function () {
                this.timevisible = true
            },
            closed: function () {
                this.numvisible = false
                this.timevisible = false
                this.loading = false
            },
            handleSubmit: function () {
                const that = this
                console.log(that.$refs.createForm)
                that.loading = true
                setTimeout(() => {
                    that.dataSource.push(
                        {
                        }
                    ),
                        this.numvisible = false
                    this.timevisible = false
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
            add: function () {
                this.addVisit=true
            },
            onChange(e) {
                console.log(`checked = ${e.target.checked}`);
            },
            back(){
                this.$router.push('/schedule/detail/sort_class/admin')
            },
            handleAdd() {
                this.loading = true;
                setTimeout(() => {
                    this.addVisit=false
                },2000)
            },
            handleCancel() {
                this.addVisit=false;
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
    /deep/ Table {
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
    }
</style>
