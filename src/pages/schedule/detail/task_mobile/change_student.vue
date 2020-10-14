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
                    <a-row >
                        <a-col :span="17" style="margin-top: 15px"> <input placeholder="学生姓名" style="height: 30px;
                        background-radius: 5px;
                        border: 1px solid #d9d9d9;"></a-col>
                        <a-col style="margin-top: 15px"> <button style="background-color: #19b294;color: white;
                        border: none;
                        width: 50px;
                        height: 30px;
                        border-radius: 5px">查询</button></a-col>
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
                            <a-col ><span style="font-size:1.5em">高二2019-2020第一学期排课计划</span></a-col>
                            <a-col>
                                <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px">返回</button>
                            </a-col>
                            <a-col><span style="font-size: 1.2em ">XXX-101</span></a-col>
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
                        width: 110px">整体查看</button>
                            </a-col>
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
                                style="margin-top: 20px;width:50%;">
                            <a-button slot="change"
                                      @click="change_class"
                                      style="background-color: #19b294;
                                      width: 80px;
                                      height: 40px;
                                      color:white">调班</a-button>
                        </a-table>
                    </div>
                </div>
<!--                调班窗口-->
                <create-modal
                        :visible="visible"
                        :loading="loading"
                        @modalClosed="closed"
                        @modalSubmit="handleSubmit">
                    <div slot="content">
                        <div class="title" style="width:520px;height: 50px;
                        margin-top:-24px;
                        margin-left:-24px;
                        border-radius: 3px;
                        background-color: #6Db5a7">
                            <h4 style="color: white">学生调班</h4>
                        </div>
                        <div class="content_table">
                            <a-table
                                    :columns="columns_class"
                                    :data-source="classData"
                                    :pagination="false"
                                    :bordered="true"
                                    :cell-style="changeCellStyle"
                                    style="">
                                <a-checkbox slot="radio" @change="onChange">
                                </a-checkbox>
                            </a-table>
                        </div>
                    </div>
                </create-modal>
            </div>
        </div>
    </EasyScrollbar>

</template>
<script>
    import CreateModal from "../../../../components/modal/CreateModal";
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
        },
        {
            title: '课程',
            dataIndex: 'subject',
            key:'subject',
            align: "center",
        },
        {
            title: '所分班级',
            dataIndex: 'class',
            key:'class',
            align: "center",
        },
        {
            title: '操作',
            dataIndex: 'opt',
            key:'opt',
            scopedSlots: { customRender: 'change' },
            align:'center'
        },
    ];
    const tableData=[
        {
            key: '1',
            subject:'物理选考',
            class:'物理选考1班_吴昊(108)'
        },
        {
            key: '2',
            subject:'政治选考',
            class:'政治选考2班_李援朝(202)'
        },
        {
            key: '3',
            class:'政治选考1班_李援朝(106)'
        },{
            key:'4',
            class:'政治选考3班_李援朝(108)'
        },{
            key:'5'
        }
    ];
    const columns_class = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
            scopedSlots: { customRender: 'radio' },
        },
        {
            title: '课程班',
            dataIndex: 'subject',
            key:'subject',
            align: "center",
        },
        {
            title: '人数',
            dataIndex: 'number',
            key:'number',
            align: "center",
        },
        {
            title: '说明',
            dataIndex: 'text',
            key:'text',
            align:'center'
        },
    ];
    const classData=[
        {
            subject:'物理选考3班_吴昊(308)',
            number:'27',
            text:'当前所在班级'
        },
        {
            subject:'物理选考1班_吴昊(108)',
            number:'30',
            text:'与生物学考1班有时间冲突'
        },
        {
            subject:'物理选考2班_吴昊(308)',
            number:'36',
            text:'与生物学考2班有时间冲突'
        },{
            subject:'物理选考4班_吴昊(308)',
            number:'38',
            text:'与生物学考3班有时间冲突'
        },{
            subject:'物理选考5班_赵海涛(308)',
            number:'21',
            text:'可调'
        },
    ];
    const treeData = [
        {
            name: '高二学生',
            key: '0-0',
            child: [
                { name: '赵卫民-101', key: '0-0-0'},
                { name: '李援朝-102', key: '0-0-1' },
            ],
        },
        {
            name: '高三学生',
            key: '0-1',
            child: [
                { name: '赵卫民-101', key: '0-0-0'},
                { name: '李援朝-102', key: '0-0-1' },
            ],
        },
    ];
    export default {
        components: {CreateModal},
        data() {
            return {
                treeData,
                columns,
                tableData,
                columns_class,
                classData,
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
            change_class: function () {
                this.visible = true;
            },
            change: function () {
                this.visible = true;
            },
            closed: function () {
                this.visible = false
                this.loading = false
            },
            handleSubmit: function () {
                const that = this
                console.log(that.$refs.createForm)
                that.loading = true
                setTimeout(() => {
                    that.visible = false
                    that.loading = false
                }, 2000)
            },
            changeCellStyle (row, column, rowIndex, columnIndex) {
                if(columnIndex === "1 "){
                    return 'background-color: blue'  // 修改的样式
                }else{
                    return ''
                }
            }
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
        height: 110px;
        padding: 20px 25px;
        border-radius: 10px;
        margin-bottom: 50px;
    }
    .table-bg{
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        height: 790px;
        margin-top: -35px;
        width: 100%;
        background-color: #fff;
    }
</style>

