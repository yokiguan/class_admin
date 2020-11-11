<template>
    <div>
        <!-- result -->
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">年级课程</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <!-- /result -->
        <a-card class="table-bg">
            <a-row><h2 style="font-weight: bold">高一年级课程</h2></a-row>
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
                <a-table :columns="columns"
                         :data-source="data"
                         :bordered="true"
                         :pagination="false"
                         style="width: 30%;margin-left: 20px;">
                    <a-checkbox slot="checkBox" @change="change"></a-checkbox>
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
            <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="addClassHandleSubmint">
                <a-form-item label="课程">
                    <a-input placeholder="请输入" v-decorator="['课程', { rules: [{ required: true, message: '请输入课程名称!' }] }]"/>
                </a-form-item>

            </a-form>
        </a-modal>
    </div>
</template>
<script>
    const columns=[
        {
            title:'',
            dataIndex:'blank',
            key:'blank',
            scopedSlots:{customRender:'checkBox'},
            align:'center',
            width:'20%'
        },
        {
            title:'序号',
            dataIndex:'serialNum',
            key:'serialNum',
            align:'center',
            width:'30%'
        },
        {
            title:'课程',
            dataIndex:'name',
            key:'name',
            align:'center',
            width:'50%'
        },
    ]
    const data=[
        {
            serialNum:'1',
            name:'日语',
        },
        {
            serialNum:'2',
            name:'物理选修',
        },
        {
            serialNum:'3',
            name:'物理学修'
        },
        {

        }
    ]
    export default {
        data() {
            return {
                columns,
                data,
                loading:false,
                addClassVisit: false,
            };
        },
        methods:{
            addClass() {
                this.addClassVisit = true;
            },
            Delete(){
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
