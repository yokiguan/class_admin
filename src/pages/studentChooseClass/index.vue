<template>
    <EasyScrollbar :barOption="myBarOption">
        <div  id="wrapper" style="width: 1800px">
            <!-- result -->
            <div class="result">
                <a-breadcrumb>
                    <a-breadcrumb-item>首页</a-breadcrumb-item>
                    <a-breadcrumb-item><a href="">我的课表</a></a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <div class="table-bg">
                <a-row><h2 style="font-weight: bold;margin-left:20px;
            float: left;margin-top: 20px">2019-2020第二学期第四周课程表：</h2></a-row>
                <a-row style="background-color: #6Db5a7;
                        color: white;
                        height: 40px;
                        padding: 8px;
                        border: 1px solid black;
                        border-radius: 5px;
                        margin-top: 20px;
                        margin-left: 40px;
                        width: 100%"><span style="float: left">课表</span></a-row>
                <a-row class="buttons" style="margin-top: 10px">
                    <a-col :span="3">
                        <button style="background-color: red;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 120px">发送至手机</button>
                    </a-col>
                    <a-col :span="1">
                        <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px">打印</button>
                    </a-col>
                </a-row>
                <a-table
                        :columns="columns"
                        :data-source="tableData"
                        :pagination="false"
                        :bordered="true"
                        style="margin-top: 20px;width:1200px;
                        margin-left:40px;height: 700px">
                </a-table>

            </div>
        </div>
    </EasyScrollbar>
</template>
<script>
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
            width:'12.5%'
        },
        {
            title: '星期一',
            dataIndex: 'one',
            key:'one',
            width:'12.5%',
            align: "center",
        },
        {
            title: '星期二',
            dataIndex: 'two',
            key:'two',
            width:'12.5%',
            align: "center",
        },
        {
            title: '星期三',
            dataIndex: 'three',
            key:'three',
            width:'12.5%',
            align: "center",
        },
        {
            title: '星期四',
            dataIndex: 'four',
            key: 'four',
            width:'12.5%',
            align: "center",
        },
        {
            title: '星期五',
            dataIndex: 'five',
            key: 'five',
            width:'12.5%',
            align: "center",
        },
        {
            title: '星期六',
            dataIndex: 'six',
            key: 'six',
            width:'12.5%',
            align: "center",
        },
        {
            title: '星期日',
            dataIndex: 'seven',
            key: 'seven',
            width:'12.5%',
            align: "center",
        },
    ];
    const tableData=[
        {
            key: '早读1',
            one:'早读'
        },
        {
            key: '上午1',
            one:'高一语文张凯元老师逸夫楼101',
        },
        {
            key: '上午2',
            one:'高一语文张凯元老师逸夫楼101',
        },{
            key: '上午3',
            three:'高一英语tony老师主楼101'
        },
        {
            key: '上午4',
            three:'高一英语tony老师主楼101'
        },{
            key:'下午1'
        },{
            key:'下午2'
        },{
            key:'下午3',
            seven:'休息'
        },{
            key:'下午4',
            one:'体育大壮老师1号篮球馆',
            seven:'休息'
        },{
            key:'晚自习1',
            one:'晚自习'
        },
    ];
    export default {
        data() {
            return {
                columns,
                tableData,
                visible: false,
                loading: false
            };
        },
        methods: {
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
        height: 1000px;
        width: 100%;
    }
    /deep/ Table {
        .ant-table-tbody > tr:nth-child(8) > td:nth-child(8),
        .ant-table-tbody > tr:nth-child(9) > td:nth-child(8){
            background-color: red;
            color: #976656;
        }
    }
</style>
