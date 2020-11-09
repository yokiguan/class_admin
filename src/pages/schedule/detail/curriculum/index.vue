<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">课表查看</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">整体查看</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.7em">高二2019-2020第一学期排课计划</span></a-col>
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
        </div>
        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3">
                    <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="teacherLook">按老师查看</button>
                </a-col>
                <a-col :span="3">
                    <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="placeLook">按场地查看</button>
                </a-col>
                <a-col :span="3">
                    <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="subjectLook">按科目查看</button>
                </a-col>
                <a-col :span="3">
                    <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="studentLook">按学生查看</button>
                </a-col>
            </a-row>
            <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :bordered="true"
                    style="margin-top: 20px;width:1200px;height: 700px">
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
            title: '一',
            dataIndex: 'one',
            key:'one',
            width:'19%'
        },
        {
            title: '二',
            dataIndex: 'two',
            key:'two',
            width:'19%'
        },
        {
            title: '三',
            dataIndex: 'three',
            key:'three',
            width:'19%'
        },
        {
            title: '四',
            dataIndex: 'four',
            key: 'four',
            width:'19%'
        },
        {
            title: '五',
            dataIndex: 'five',
            key: 'five',
            width:'19%'
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
                tableData,
                visible: false,
                loading: false
            };
        },
        methods: {
            teacherLook(){
                this.$router.push('/schedule/detail/curriculum/teacher')
            },
            placeLook(){
                this.$router.push('/schedule/detail/curriculum/place')
            },
            subjectLook(){
                this.$router.push('/schedule/detail/curriculum/subject')
            },
            studentLook(){
                this.$router.push('/schedule/detail/curriculum/student')
            },
            back(){
                this.$router.go(-1)
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
        background-color: white;
        height: 90px;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
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
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
    }
</style>
