<template>
    <a-card class="curriculum_content">
        <a-row style="height: 40px;width: 1300px;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;margin-left: -35px;margin-top: -30px">
            <a-col>
                <span style="float: left;padding: 10px;">课表</span>
            </a-col>
        </a-row>
        <a-row class="buttons-sub">
            <a-col :span="2">
                <a-button type="danger" style="color:white;
                              width: 100px;
                                height: 40px;">禁选</a-button>
            </a-col>
            <a-col :span="2">
                <a-button style="background-color:grey;
                      width: 100px;
                        height: 40px;color:white">普通</a-button>
            </a-col>
            <a-col :span="3">
                <a-button style="color:white;background-color: #1abc9c;width: 100px;
                              height: 40px;">优先</a-button>
            </a-col>
            <a-col :span="6" >
                <h3 style="float:left;">未设置默认为普通</h3>
            </a-col>
            <a-col :span="3">
                <a-button style="background-color:#1abc9c;
                              width: 100px;
                              height: 40px;color:white">保存</a-button>
            </a-col>
            <a-col :span="1">
                <a-button style="background-color:#1abc9c;
                              width: 100px;
                              height: 40px;color:white">重置</a-button>
            </a-col>
            <a-col >
                <a-button type="danger" style="color:white;
                              width: 100px;
                                height: 40px;">删除</a-button>
            </a-col>
        </a-row>
        <a-row>
            <a-table id="Table"
                     :rowKey="'key'"
                     :columns="columns"
                     :data-source="tableData"
                     :pagination="false"
                     :bordered="true"
                     style="margin-top: 30px">
            </a-table>
        </a-row>
    </a-card>
</template>
<script>
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
            width:'12.5%',

        },
        {
            title: '星期一',
            dataIndex: 'one',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期二',
            dataIndex: 'two',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期三',
            dataIndex: 'three',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期四',
            dataIndex: 'four',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期五',
            dataIndex: 'five',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期六',
            dataIndex: 'six',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期日',
            dataIndex: 'seven',
            width:'12.5%',
            align:'center'
        },
    ];
    const tableData=[
        {
            key: '早读1',
            one:'6：00-7：00'

        },
        {
            key: '上午1',
            one:'8：30-9：00'
        },
        {
            key: '上午2',
            one:'9：00-10：00'
        },
        {
            key: '上午3',
            one:'10：30-11：30'
        },
        {
            key: '上午4',
            one:'11：30-12：30'
        },
        {
            key: '下午1',
        },
        {
            key: '下午2',
        },
        {
            key: '下午3',
        },
        {
            key: '下午4',
        },
        {
            key: '晚自习1',
        },
    ];
    export default {
        data(){
            return{
                columns,
                tableData,
            }
        }
    }
</script>
<style lang="less" scoped>
    .curriculum_content{
        background-color: white;
        margin-top: 10px;
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        height: 800px;
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
    .buttons-sub{
        margin-top: 10px;
        padding:2px 4px;
    }
    /deep/ Table {
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
        .ant-table-tbody > tr:nth-child(2) > td:nth-child(2){
            background-color: #f00;
            color: white;
        }
        .ant-table-tbody > tr:first-child > td:nth-child(5),
        .ant-table-tbody > tr:first-child > td:nth-child(4),
        .ant-table-tbody > tr:first-child > td:nth-child(3){
            background-color: #bcbcbc;
        }
        .ant-table-tbody > tr:nth-child(2) > td:nth-child(3){
            background-color: #1abc9c;
        }
    }

</style>
