<template>
    <EasyScrollbar :barOption="myBarOption">
        <div id="wrapper" style="width: 600px">
            <div style="width: 1800px">
                <div class="result">
                    <a-breadcrumb>
                        <a-breadcrumb-item>首页</a-breadcrumb-item>
                        <a-breadcrumb-item><a href="">行政班排课任务</a></a-breadcrumb-item>
                        <a-breadcrumb-item><a href="">科目课表</a></a-breadcrumb-item>
                    </a-breadcrumb>
                </div>
                <div class="left">
                    <a-row class="left_title">
                        <a-col :span="3"><a-icon type="reload" style="font-size: 1.5em;
                    font-weight: bold"/></a-col>
                        <a-col :span="12"><span style="font-size: 1.2em">刷新菜单</span></a-col>
                        <a-col><span style="font-size: 1.2em">全部展开</span></a-col>
                    </a-row>
                    <a-divider style="background-color: black"></a-divider>
                    <div>
                        <a-tree
                                :tree-data="treeData"
                                :default-expanded-keys="['0-0-0', '0-0-1']"
                                :default-selected-keys="['0-0-0', '0-0-1']"
                                :default-checked-keys="['0-0-0', '0-0-1']"
                                :replace-fields="replaceFields"
                                @select="onSelect"
                                @check="onCheck"
                                checkable
                                style="font-size: 1.3em;"
                        />
                    </div>
                </div>
                <div class="right">
                    <div class="title">
                        <a-row>
                            <a-col :span="18"><span style="font-size:1.5em">高二2019-2020第一学期排课计划</span></a-col>
                            <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px">删除已发布课表</button></a-col>
                            <a-col><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px" @click="back">返回</button></a-col>
                        </a-row>
                        <a-row><a-col><span style="font-size: 1.2em ">高二2019-2020第一学期排课计划A</span></a-col></a-row>
                    </div>
                    <div class="table-bg">
                        <a-row class="buttons">
                            <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="teacherLook">按老师查看</button></a-col>
                            <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="placeLook">按场地查看</button></a-col>
                            <a-col :span="3"><button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="subjectLook">按科目查看</button></a-col>
                        </a-row>
                        <a-table
                                :key="'key'"
                                :columns="columns"
                                :data-source="tableData"
                                :pagination="false"
                                :bordered="true"
                                style="margin-top: 20px;width:75%;height:100% ">
                        </a-table>
                    </div>
                </div>
            </div>
        </div>
    </EasyScrollbar>

</template>
<script>
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'num',
            width:'5%',
        },
        {
            title: '一',
            dataIndex: 'one',
            key:'one',
            align: "center",
            width:'19%',
        },
        {
            title: '二',
            dataIndex: 'two',
            key:'two',
            align: "center",
            width:'19%',
        },
        {
            title: '三',
            dataIndex: 'three',
            key:'three',
            align: "center",
            width:'19%',
        },
        {
            title: '四',
            dataIndex: 'four',
            key: 'four',
            align: "center",
            width:'19%',
        },
        {
            title: '五',
            dataIndex: 'five',
            key: 'five',
            align: "center",
            width:'19%',
        },
    ];
    const tableData=[
        {
            key:'1',
            num: '1',
        },
        {
            key:'2',
            num: '2',
            one:'高二语文_车东明',
            two:'高二语文_车东明',
        },
        {
            key:'3',
            num: '3',
            three:'高二数学_张凯元'
        },{
            key:'4',
            num: '4',
        },{
            key:'5',
            num:'5'
        }
    ];
    const treeData = [
        {
            name: '高二',
            key: '0-0',
            child: [
                { name: '1班', key: '0-0-0'},
                { name: '2班', key: '0-0-1' },
            ],
        },
        {
            name: '高三',
            key: '0-1',
            child: [
                { name: '1班', key: '0-1-0'},
                { name: '2班', key: '0-1-1' },
            ],
        },
    ];
    export default {
        data() {
            return {
                treeData,
                columns,
                tableData,
                visible: false,
                loading: false,
                myBarOption:{
                    barColor:'block'
                },
                disabled: false,
                replaceFields: {
                    children: 'child',
                    title: 'name',
                },
            };
        },
        methods: {
            handleDisabledChange(disabled) {
                this.disabled = disabled;
            },
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
            },
            onCheck(checkedKeys, info) {
                console.log('onCheck', checkedKeys, info);
            },
            teacherLook(){
                this.$router.push('/schedule/detail/task_admin/teacher')
            },
            placeLook(){
                this.$router.push('/schedule/detail/curriculum/place')
            },
            subjectLook(){
                this.$router.push('/schedule/detail/task_admin/class')
            },
            back(){
                this.$router.go(-1)
            },
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
    .left{
        width: 300px;
        height: 900px;
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 10px;
    }
    .right{
        border-radius: 5px;
        margin-top: -935px;
        margin-left: 320px;
        height:900px;
    }
    .title{
        width: 100%;
        background-color: #fff;
        height: 130px;
        padding: 20px 25px;
        border-radius: 10px;
        margin-top: 35px;
        margin-bottom: 50px;
    }
    .table-bg{
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        height:670px;
        margin-top: -35px;
        width: 100%;
        background-color: #fff;
    }
    /deep/ Table {
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
        .ant-table-tbody>tr{
            height:100px;
        }
    }
</style>

