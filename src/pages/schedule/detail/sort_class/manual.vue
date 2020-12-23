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
                <a-col :span="18"><span style="font-size:1.5em">{{this.planData}} -手动分班</span></a-col>
                <a-col><button style="width: 100px;height: 40px;background-color: blue;color: white;border-radius: 5px;border: none" @click="back">返回</button></a-col>
            </a-row>
        </div>
        <div class="table-bg">
            <a-table
                    :key="'key'"
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :bordered="true">
                <div slot="situation" slot-scope="data">
                    <div v-for="(item, index) in data" :key="index" class="situation">
                        <div class="situation-header">
                            {{item.class}}{{item.teacher}}（共有学生{{item.all}}人）
                            <span style="color:red;float:right">删除</span>
                            <span style="color:blue;float:right;margin-right:1em;" @click="change">修改</span>
                        </div>
                            <template v-for="(tag, index) in tags">
                                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                                    <a-tag :key="tag" :closable="index !== 0" @close="() => handleClose(tag)">
                                        {{ `${tag.slice(0, 20)}...` }}
                                    </a-tag>
                                </a-tooltip>
                                <a-tag v-else :key="tag" :closable="index !== 0" @close="() => handleClose(tag)">
                                    {{ tag }}
                                </a-tag>
                            </template>
                            <a-input
                                    v-if="inputVisible"
                                    ref="input"
                                    type="text"
                                    size="small"
                                    :style="{ width: '78px' }"
                                    :value="inputValue"
                                    @change="handleInputChange"
                                    @blur="handleInputConfirm"
                                    @keyup.enter="handleInputConfirm"/>
                            <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                                <a-icon type="plus" />
                            </a-tag>
                        <div class="situation-body">
                            <a-button v-for="(stu, sindex) in item.students" :key="sindex">{{stu}}</a-button>
                        </div>
                    </div>
                    <a-button icon="plus" style="background-color: #169bd5;color:white;" @click="add">添加班级</a-button>
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
                <a-button type="primary" >返回</a-button>
            </div>
        </div>
    </div>
</template>
<script>
    import CreateModal from "../../../../components/modal/CreateModal";
    const columns = [
        { title: '学科',
            dataIndex: 'subject',
        },
        {
            title: '未分班学生',
            dataIndex: 'unsorted',
        },
        {
            title: '分班情况',
            dataIndex: 'situation',
            scopedSlots: { customRender: 'situation' }
        },
    ];
    let tableData = [
        {
            key: 0,
            subject: '高一语文',
            unsorted: 10,
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
                loading:false,
                visible: false,
                planData:"",
                tags: ['Unremovable', 'Tag 2', 'Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3'],
                inputVisible: false,
                inputValue: '',
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
                console.log(this.$refs.createForm)
                this.loading = true
                setTimeout(() => {
                    this.dataSource.push(
                        {
                            content: "班级名称：请输入/任课教师：张凯元",
                        }
                    ),
                        this.visible = false
                    this.loading = false
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
              this.$router.go(-1)
            },
            form(){},
            handleSelectChange(){},
            handleClose(removedTag) {
                const tags = this.tags.filter(tag => tag !== removedTag);
                console.log(tags);
                this.tags = tags;
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },
            handleInputChange(e) {
                this.inputValue = e.target.value;
            },

            handleInputConfirm() {
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
