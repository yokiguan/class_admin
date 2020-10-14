<template>
    <EasyScrollbar :barOption="myBarOption">
        <div id="wrapper" style="width: 600px">
            <div style="width: 1800px">
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
                            <a-col :span="3">
                                <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px">删除已发布课表</button>
                            </a-col>
                            <a-col>
                                <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px">返回</button>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col><span style="font-size: 1.2em ">高二2019-2020第一学期排课计划A</span></a-col>
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
                        width: 110px">按老师查看</button>
                            </a-col>
                            <a-col :span="3">
                                <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px">按场地查看</button>
                            </a-col>
                            <a-col :span="3">
                                <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px">按科目查看</button>
                            </a-col>
                        </a-row>
                        <a-table
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
            width:'7%',
        },
        {
            title: '一',
            dataIndex: 'one',
            key:'one',
            align: "center",
            width:'16.6%',
        },
        {
            title: '二',
            dataIndex: 'two',
            key:'two',
            align: "center",
            width:'16.6%',
        },
        {
            title: '三',
            dataIndex: 'three',
            key:'three',
            align: "center",
            width:'16.6%',
        },
        {
            title: '四',
            dataIndex: 'four',
            key: 'four',
            align: "center",
            width:'16.6%',
        },
        {
            title: '五',
            dataIndex: 'five',
            key: 'five',
            align: "center",
            width:'16.6%',
        },
    ];
    const tableData=[
        {
            num: '1',
        },
        {
            num: '2',
            one:'高二语文_车东明',
            two:'高二语文_车东明',
        },
        {
            num: '3',
            three:'高二数学_张凯元'
        },{
            num: '4',
        },{
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
        },
    };
</script>

<style lang="less" scoped>
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
        margin-bottom: 50px;
    }
    .table-bg{
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        height:600px;
        margin-top: -35px;
        width: 100%;
        background-color: #fff;
    }
</style>

