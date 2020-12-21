<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">走班排课任务</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">整体查看</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content ">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">高二2019-2020第一学期排课计划</span></a-col>
                <a-col><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px" @click="back">返回</button></a-col>
            </a-row>
            <a-row style="margin-top: 20px">
                <a-col :span="5"><span style="font-size: 1.2em ">高二2019-2020第一学期排课计划A</span></a-col>
                    <button @click="showModal" style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px">查看学生冲突</button>
                    <button type="primary" style="background-color: #19b294;margin-left: 30px;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px" @click="manualChangeClass">手动调课</button>
                    <button style="background-color: #19b294;margin-left: 30px;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 150px" type="primary" @click="changClass">学生调班</button>
            </a-row>
            <a-row><a-col><span style="font-size: 1.2em ">结果：无冲突</span></a-col></a-row>
        </div>
        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px"  @click="teacherLook">按老师查看</button></a-col>
                <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px"  @click="placeLook">按场地查看</button></a-col>
                <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px"  @click="subjectLook">按科目查看</button></a-col>
            </a-row>
            <a-table
                    :columns="columns"
                    :data-source="dataSource"
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
        },
        {
            title: '一',
            dataIndex: 'one',
            key:'one',
        },
        {
            title: '二',
            dataIndex: 'two',
            key:'two',
        },
        {
            title: '三',
            dataIndex: 'three',
            key:'three',
        },
        {
            title: '四',
            dataIndex: 'four',
            key: 'four',
        },
        {
            title: '五',
            dataIndex: 'five',
            key: 'five',
        },
    ];
    // const tableData=[
    //     {
    //         key: '1',
    //     },
    //     {
    //         key: '2',
    //         one:'生物学考1班_李援朝(106)',
    //         two:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
    //         five:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
    //     },
    //     {
    //         key: '3',
    //         two:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
    //         three:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
    //     },{
    //         key: '4',
    //         one:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)',
    //         four:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
    //         five:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)物理学考1班_钱三(206)英语学考3班_拓海(406)',
    //     },
    //     {
    //         key: '5',
    //         two:'生物学考1班_李援朝(606)政治学考2班_赵爱国(206)',
    //     },
    // ];
    export default {
        data() {
            return {
                columns,
                // tableData,
                dataSource:[],
                // visible: false,
            };
        },
        async created() {
            let {data} = await this.$api.schedule.classTask.getData({planId:"940085b583944e19a0a098ca24804afc",type:"total"});
            // this.dataSource = data.rows;
        },
        methods: {
            manualChangeClass(){
                this.$router.push('/schedule/detail/task_mobile/integrate')
            },
            changClass(){
                this.$router.push('/schedule/detail/task_mobile/change_student')
            },
            teacherLook(){
                this.$router.push('/schedule/detail/task_mobile/teacher')
            },
            placeLook(){
                this.$router.push('/schedule/detail/task_mobile/room')
            },
            subjectLook(){
                this.$router.push('/schedule/detail/task_mobile/course')
            },
            studentLook(){
                this.$router.push('/schedule/detail/curriculum/student')
            },
            back(){
                this.$router.go(-1)
            },
            click(){},
            showModal(){},
            onChange(){},
            maxTime(){},
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
    /deep/ Table {
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
    }
</style>
