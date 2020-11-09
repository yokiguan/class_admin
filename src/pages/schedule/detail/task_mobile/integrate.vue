<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">走班排课任务</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">手动调课</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">高二2019-2020第一学期排课计划</span></a-col>
                <a-col>
                    <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px" @click="back">返回</button>
                </a-col>
            </a-row>
            <a-row style="margin-top: 10px">
                <a-col>
                    <button style="background-color: #19b294;
                        color: white;
                        height: 35px;
                        border: none;
                        border-radius: 3px;
                        width: 150px">查看调课记录</button>
                </a-col>
            </a-row>
        </div>
        <div class="table-bg">
            <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :bordered="true"
                    style="margin-top: 20px;">
                <button slot="change">调换</button>
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
            customCell:(record,index) => {
            return {
              on :{//给单元格增加事件
                click:()=>{
                 console.log(record)
                 console.log(index)
                }
              }
            }
          },
        },
        {
            title: '一',
            dataIndex: 'one',
            customCell:(record,index) => {
            return {
              on :{//给单元格增加事件
                click:()=>{
                 console.log(record)
                 console.log(index)
                }
              }
            }
          },
        },
        {
            title: '二',
            dataIndex: 'two',
            customCell:(record,index) => {
            return {
              on :{//给单元格增加事件
                click:()=>{
                 console.log(record)
                 console.log(index)
                }
              }
            }
          },
        },
        {
            title: '三',
            dataIndex: 'three',
            customCell:(record,index) => {
            return {
              on :{//给单元格增加事件
                click:()=>{
                 console.log(record)
                 console.log(index)
                }
              }
            }
          },
        },
        {
            title: '四',
            dataIndex: 'four',
            customCell:(record,index) => {
            return {
              on :{//给单元格增加事件
                click:()=>{
                 console.log(record)
                 console.log(index)
                }
              }
            }
          },
        },
        {
            title: '五',
            dataIndex: 'five',
            customCell:(record,index,dataIndex) => {
            return {
              on :{//给单元格增加事件
                click:()=>{
                 console.log(record)
                 console.log(index)
                 console.log(dataIndex)
                }
              }
            }
          },
        },
    ];
    const tableData=[
        {
            key: '1',
        },
        {
            key: '2',
            one:'生物学考1班_李援朝(106)',
            two:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
            five:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
        },
        {
            key: '3',
            two:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
            three:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
        },{
            key: '4',
            one:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)',
            four:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
            five:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
        },
        {
            key: '5',
            two:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)',
        },
    ];
    export default {
        data() {
            return {
                columns,
                tableData
            };
        },
        methods: {
            back(){
                this.$router.go(-1)
            },
    },
}
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
        height: 150px;
        background-color: white;
        height: 130px;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        vertical-align: top;
        border-radius: 5px;
    }
    .table-bg{
        background-color: white;
        margin: -10px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
        text-align: center;
        height: 1000px;
        width: 100%;
    }
</style>
