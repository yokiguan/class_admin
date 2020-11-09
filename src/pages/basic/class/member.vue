<template>
    <div>
        <!-- result -->
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">行政班人员</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <!-- /result -->
        <a-card class="table-bg">
            <a-row><h2 style="font-weight: bold">高一1班人员</h2></a-row>
            <a-row class="buttons">
                <a-col :span="3">
                    <a-button @click="addClass" type="primary"
                              style="background-color: #1abc9c">新增</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button @click="Delete" style="background-color: #ff0000">删除</a-button>
                </a-col>
            </a-row>
            <a-row>
                <a-table :rowKey="'key'"
                         :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                         :selectedRows="selectedRows"
                        :columns="columns"
                         :data-source="data"
                         :bordered="true"
                         :pagination="false"
                         style="width: 30%;margin-left: 20px;">
                </a-table>
            </a-row>
        </a-card>
        <a-modal
                :visible='addClassVisit'
                width="600px"
                :closable="false"
                on-ok="handleOk">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
                    保存
                </a-button>
                <a-button key="back" @click="handleCancel">
                    取消
                </a-button>
            </template>
            <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="addClassHandleSubmint"
                    style="margin-left: 70px">
                <a-form-item label="级部" has-feedback>
                    <a-select v-decorator="['级部',{ rules: [{ required: true, message: 'Please select your country!' }] },]"
                              placeholder="高中">
                        <a-select-option value="junior">
                            小学
                        </a-select-option>
                        <a-select-option value="middle">
                            初中
                        </a-select-option>
                        <a-select-option value="senior">
                            高中
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="人员" has-feedback>
                    <a-tree-select
                            v-model="value"
                            :tree-data="treeData"
                            tree-checkable
                            :show-checked-strategy="SHOW_PARENT"
                            search-placeholder="Please select"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
    import { TreeSelect } from 'ant-design-vue';
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const treeData = [
        {
            title: '高一年级',
            value: '0-0',
            key: '0-0',
            children: [
                {
                    title: '张凯元',
                    value: '0-0-0',
                    key: '0-0-0',
                },
                {
                    title: '张凯方',
                    value: '0-0-1',
                    key: '0-0-1',
                },
            ],
        },
        {
            title: '高二年级',
            value: '0-1',
            key: '0-1',
            children: [
                {
                    title: '刘金瑞',
                    value: '0-1-0',
                    key: '0-1-0',
                },
                {
                    title: '小李',
                    value: '0-1-1',
                    key: '0-1-1',
                },
            ],
        },
    ];
    const columns=[
        {
            title:'序号',
            dataIndex:'serialNum',
            key:'serialNum',
            align:'center',
            width:'23%'
        },
        {
            title:'姓名',
            dataIndex:'name',
            key:'name',
            align:'center',
            width:'38%'
        },
        {
            title:'角色',
            dataIndex:'role',
            key:'role',
            align:'center',
            width:'38%'
        },
    ]
    const data=[
        {
            key:'1',
            serialNum:'1',
            name:'车东明',
            role:'班主任'
        },
        {
            key:'2',
            serialNum:'2',
            name:'车西明',
            role:'学生'
        },
        {
            key:'3',
            serialNum:'3',
            name:'车南明',
            role:'学生'
        },
        {
            key:'4',
        }
    ]
    export default {
        data() {
            return {
                columns,
                data,
                loading:false,
                addClassVisit: false,
                value: ['车东明'],
                treeData,
                SHOW_PARENT,
                selectedRowKeys: [], // Check here to configure the default column
                selectedRows:[],
            };
        },
        methods:{
            addClass() {
                this.addClassVisit = true;
            },
            onSelectChange( selectedRowKeys,selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows=selectedRows
            },
            Delete(){
                this.data = this.data.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
                this.selectedRows = this.selectedRows.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
            },
            handleOk() {
                this.loading = true;
                setTimeout(() => {
                    this.addClassVisit = false;
                    this.loading = false;
                }, 2000);
            },
            handleCancel() {
                this.addClassVisit = false;
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
    .table-bg{
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
        text-align: center;
        width: 100%;
        height: 500px;

    }
    .buttons{
        margin:0px 5px 20px 5px;
        padding:2px 4px;
        margin-left: 30px;
    }
    .buttons button{
        width: 110px;
        height: 45px;
        color:white;
    }
    /deep/ Table {
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
    }
</style>
