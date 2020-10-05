<template>
    <div>
        <!-- result -->
        <div class="result">
            <a-row>
                <a-col :span="12">
                    <span style="font-size:1.5em">高一2019-2020第一学期排课计划</span>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="6"><a-button  style="color:white;background-color:blue;">返回</a-button></a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <!-- <div class="info link-font-color">已有900人选课 （共1000人）<font style="color:red">100人未选</font></div> -->
        <!-- /result -->

        <div class="table-bg">
            <a-table :columns="columns" :data-source="tableData" :pagination="false">
                <div slot="action" slot-scope="situation">
                    <li
                            v-for="(s, index) in situation"
                            :key="index"
                            class="situation"
                    >
                        <a-row>
                            <a-col :span="16">
                                <span>{{s}}</span>
                            </a-col>
                            <a-col :span="4">
                                <span style="color:blue" @click="changeSituation(record.key, index)">修改</span>
                            </a-col>
                            <a-col :span="4">
                                <span style="color:red" @click="delSituation(record.key, index)">删除</span>
                            </a-col>
                        </a-row>
                    </li>
                </div>
            </a-table>
        </div>
    </div>
</template>
<script>
    // import echarts from 'echarts'

    const columns = [
        { title: '课程名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '总人数',
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
            dataIndex: 'classNum'
        },
        {
            title: '分班情况',
            dataIndex: 'situation',
            key: 'situation',
            scopedSlots: { customRender: 'action' }
        },
    ];

    let tableData = [
        {
            key: 0,
            name: '高一语文',
            all: 30,
            unsorted: 10,
            classNum: 4,
            situation: [
                "高一语文1班  张凯元   30人",
                "高一语文1班  张凯元   30人",
                "高一语文1班  张凯元   30人",
                "高一语文1班  张凯元   30人",
            ]
        },
        {
            key: 1,
            name: '高一数学',
            all: 30,
            unsorted: 10,
            classNum: 4,
            situation: [
                "高一语文1班  张凯元   30人",
                "高一语文1班  张凯元   30人"
            ]
        },
        {
            key: 2,
            name: '高一英语',
            all: 30,
            unsorted: 10,
            classNum: 4,
            situation: [
                "高一语文1班  张凯元   30人"
            ]
        },
    ];
    export default {
        data() {
            return {
                tableData,
                columns,
            };
        },
        methods: {
            changeSituation: function(key, index){
                console.log(key, index)
            },
            delSituation: function(key, index){
                console.log(key, index)
                this.tableData[key].situation.pop(index)
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
    .situation{
        border:1px solid black;
        margin:5px 10px;
        padding:2px 4px;
        border-radius: 4px;
        width: 50%;
        font-size: 0.7em;
        margin-right: 1em;
    }
</style>
