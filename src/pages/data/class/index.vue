<template>
    <div>
        <!-- result -->
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">数据字典</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">教室类型</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <!-- /result -->
        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3">
                    <a-button style="background-color: #1abc9c">新增</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button style="background-color: #ff0000">删除</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button style="background-color: #1abc9c">编辑</a-button>
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

        </div>
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
            name:'行政班教室',
            situation:'可用',
        },
        {
            name:'物理专用',
            situation:'关闭',
        },
        {
            name:'英语专用',
        },
        {
            name:'化学专用',
        }
    ]
    export default {
        data() {
            return {
                columns,
                data,
                method:{
                    // onChange(){
                    //     console.log('checked=${e.target.checked');
                    // }
                }
            };
        },
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
