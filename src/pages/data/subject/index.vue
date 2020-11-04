<template>
    <div>
        <!-- result -->
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">数据字典</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">科目类别</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <!-- /result -->
        <a-card class="table-bg">
            <a-row class="buttons">
                <a-col :span="3">
                    <a-button @click="addClass" type="primary"
                              style="background-color: #1abc9c">新增</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button style="background-color: #ff0000">删除</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button @click="edit" type="primary"
                              style="background-color: #1abc9c">编辑</a-button>
                </a-col>
            </a-row>
            <a-row>
                <a-table :columns="columns"
                         :data-source="data"
                         :bordered="true"
                         :pagination="false"
                         style="width: 45%;margin-left: 50px;">
                    <a-checkbox slot="checkBox" @change="change"></a-checkbox>

                </a-table>
            </a-row>
        </a-card>
        <a-modal
                :visible="addClassVisit"
                @ok="handleOk"
                @cancel="handleCancel"
                width="500px"
                :closable="false"
                ok-text="保存"
                cancel-text="取消"
                v-model="addClassVisit">
            <div>
                <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="addClassHandleSubmint">
                    <a-form-item label="类名名称：">
                        <a-input placeholder="请输入"
                                 v-decorate="['note',{rules:[{required:true,message:'请输入类名名称'}]}]"
                                 style="width: 275px"></a-input>
                    </a-form-item>
                    <a-form-item label="备注：">
                        <a-input
                                placeholder="请输入"
                                v-decorate="['note',{rules:[{required:true,message:'请输入类名名称'}]}]"
                                style="width: 275px;height:200px"></a-input>
                    </a-form-item>
                    <a-form-item label="是否启用">
                        <a-switch v-decorator="['switch', { valuePropName: 'checked' }]" />
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
        <a-modal
                :visible="editVisit"
                @ok="handleOk"
                @cancel="handleCancel"
                width="500px"
                :closable="false"
                ok-text="保存"
                cancel-text="取消"
                v-model="editVisit">
            <div>
                <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="editHandleSubmint">
                    <a-form-item label="类名名称：">
                        <a-input placeholder="请输入"
                                 v-decorate="['note',{rules:[{required:true,message:'请输入类名名称'}]}]"
                                 style="width: 275px"></a-input>
                    </a-form-item>
                    <a-form-item label="备注：">
                        <a-input
                                placeholder="请输入"
                                v-decorate="['note',{rules:[{required:true,message:'请输入类名名称'}]}]"
                                style="width: 275px;height:200px"></a-input>
                    </a-form-item>
                    <a-form-item label="是否启用">
                        <a-switch v-decorator="['switch', { valuePropName: 'checked' }]" />
                    </a-form-item>
                </a-form>
            </div>

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
            width:'10%'
        },
        {
            title:'名称',
            dataIndex:'name',
            key:'name',
            align:'center',
            width:'30%'
        },
        {
            title:'备注',
            dataIndex:'remark',
            key:'remark',
            align:'center',
            width:'30%'
        },
        {
            title:'状态',
            dataIndex:'situation',
            key:'situation',
            align:'center'
        },
    ]
    const data=[
        {
            name:'公共基础课',
            situation:'可用',
        },
        {
            name:'选修课',
            situation:'关闭',
        },
        {
            name:'中学课程',
        },
        {

        }
    ]
    export default {
        data() {
            return {
                columns,
                data,
                addClassVisit: false,
                editVisit: false,
            };
        },
        methods:{
            addClass() {
                this.addClassVisit = true;
            },
            edit() {
                this.editVisit = true;
            },
            handleOk() {
                setTimeout(() => {
                    this.addClassVisit = false;
                    this.editVisit = false;
                }, 2000);
            },
            handleCancel() {
                console.log('Clicked cancel button');
                this.addClassVisit = false;
                this.editVisit = false;
            },
            editHandleSubmint(){

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
        margin:15px 5px 20px 5px;
        padding:2px 4px;
        margin-left: 70px;
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
