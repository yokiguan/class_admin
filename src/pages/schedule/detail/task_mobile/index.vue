<template>
    <div>
        <!-- result -->
        <div class="result">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">高二2019-2020第一学期排课计划</span></a-col>
                <a-col>
                    <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px"
                    >返回</button>
                </a-col>
            </a-row>
        </div>
        <div class="table-bg">
            <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :bordered="true"
            style="margin-top: 20px;width:1200px;height: 700px">
                <div slot="option" style="color: blue" >
                    <a-row>
                            <a-col :span="2">
                                 <span>
                                    <router-link to="/schedule/detail/task_mobile/all">
                                   查看
                                    </router-link>
                                 </span>
                            </a-col>
                            <a-col :span="4">
                                <span >删除</span>
                            </a-col>
                            <a-col :span="4">
                                <span>继续排课</span>
                            </a-col>
                            <a-col :span=" 4">
                                <span>手动调整</span>
                            </a-col>
                            <a-col :span="4">
                                <span>学生调班</span>
                            </a-col>
                            <a-col>
                                <span>
                                    <router-link to="">
                                        发布结果
                                    </router-link></span>
                            </a-col>
                        </a-row>
                </div>
            </a-table>

        </div>
    </div>
</template>
<script>
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
            width:'5%'
        },
        {
            title: '任务名称',
            dataIndex: 'task',
            key:'task',
            align:'center',
            width:'15%'
        },
        {
            title: '创建时间',
            dataIndex: 'time',
            key:'time',
            align:'center',
            width:'15%'
        },
        {
            title: '状态',
            dataIndex: 'situation',
            key:'situation',
            align:'center',
            width:'15%'
        },
        {
            title: '操作',
            dataIndex: 'opt',
            key: 'opt',
            align:'center',
            scopedSlots: { customRender: 'option' },
            width:'50%'
        },
    ];
    const tableData=[
        {
            key: '1',
            task:'1234',
            time:'2020/04/12 14：00:00',
            situation:'已结束'
        },
        {
            key: '2',
        },
        {
            key: '3',
        },{
            key: '4',
        },
        {
            key: '5',
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
        height: 300px;
        background-color: white;
        height: 150px;
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
        text-align: center;
        height: 1000px;
        width: 100%;
    }
</style>
