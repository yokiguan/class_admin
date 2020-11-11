<template>
    <div>
        <div class="result">
            <a-row>
                <a-col :span="12">
                    <span style="font-size:1.5em">高一2019-2020第一学期分班结果</span>
                    <br>
                    <span style="margin-left:2em">未分班人数<font style="color:red">100</font>人</span>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: #1abc9c;color: white" @click="autoSortClass">
                            <router-link to="/schedule/detail/sort_class/auto">自动分班</router-link></a-button></a-col>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: #1abc9c;color: white" @click="manaulSortClass">
                            <router-link to="/schedule/detail/sort_class/manual">手动分班</router-link></a-button></a-col>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: red;color: white" @click="clearTable">清空</a-button></a-col>
                        <a-col :span="6" ><a-button style="width: 150px;height: 50px;background-color: blue;color: white" @click="back" >返回</a-button></a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <div class="table-bg">
            <a-table :columns="columns"
                     :data-source="tableData"
                     :bordered="true"
                     :pagination="false">
                <div slot="action" slot-scope="situation">
                    <li
                            v-for="(s, index) in situation"
                            :key="index"
                            class="situation">
                        <a-row>
                            <a-col :span="16"><span>{{s}}</span></a-col>
                            <a-col :span="4"><a style="color:blue" @click="changeSituation" type="dashed">修改</a></a-col>
                            <a-col :span="4"><a style="color:red" @click="onDelete" type="dashed">删除</a></a-col>
                        </a-row>
                    </li>
                </div>
            </a-table>
        </div>
        <!--   修改-->
        <create-modal
                :visible="editvisible"
                :close="false"
                width="700px"
                :loading="loading"
                @modalClosed="closed"
                @modalSubmit="save">
            <div slot="content">
                <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:15}" @submit="addClassHandleSubmint"
                        style="margin-left: 30px">
                    <a-form-item label="班级名称：" >
                        <!-- <a-date-picker v-decorator="['date-picker', config]" /> -->
                        <a-input placeholder="请输入"/>
                    </a-form-item>
                    <a-form-item label="任课教师：">
                        <a-select default-value="请选择" style="width: 100%">
                        </a-select>
                    </a-form-item>
                </a-form>
            </div>
        </create-modal>
    </div>
</template>
<script>
    import CreateModal from "@/components/modal/CreateModal";
    const columns = [
        { title: '课程名称',
            dataIndex: 'name',
            key: 'name',
            align:'center',
            width:'10%',
        },
        {
            title: '总人数',
            dataIndex: 'all',
            key: 'all',
            align:'center',
            width:'10%',
        },
        {
            title: '未分班人数',
            dataIndex: 'unsorted',
            key: 'unsorted',
            align:'center',
            width:'10%',
        },
        {
            title: '分班个数',
            key: 'classNum',
            dataIndex: 'classNum',
            align:'center',
            width:'10%',
        },
        {
            title: '分班情况',
            dataIndex: 'situation',
            key: 'situation',
            scopedSlots: { customRender: 'action' },
            align:'center',
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
        components: {CreateModal},
        data() {
            return {
                tableData,
                columns,
                editvisible: false,
                loading:false
            };
        },
        methods: {
            changeSituation: function () {
                this.editvisible = true;
            },
            closed: function () {
                this.editvisible = false
                this.loading= false
            },
            save: function () {
                console.log(this.$refs.createForm)
                this.loading = true
                setTimeout(() => {
                    this.editvisible = false
                    this.loading = false
                }, 2000)
                const { count, tableData} = this;
                const newData = {
                    key: count,
                    name: '高一英语',
                    all: 30,
                    unsorted: 10,
                    classNum: 4,
                    situation: [
                        "高一语文1班  张凯元   30人"]
                };
                this.tableData= [...tableData, newData];
                this.count = count + 1;
            },
            back(){
              this.$router.go(-1)
            },
            onDelete(){
                const dataSource = [...this. tableData];
                dataSource.situation.splice(event.target.getAttribute('dataIndex'),1);
                this. tableData = dataSource
            },
            form(){},
            addClassHandleSubmint(){},
            manaulSortClass(){},
            autoSortClass(){},
            clearTable(){
                this. tableData=[]
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
    .table-bg{
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
    }
    .situation{
        border:1px solid black;
        margin:5px 10px;
        padding:5px 4px;
        border-radius: 4px;
        width: 70%;
        height: 35px;
        font-size: 1.0em;
        margin-right: 1em;
    }
    /deep/ Table {
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
    }
</style>
