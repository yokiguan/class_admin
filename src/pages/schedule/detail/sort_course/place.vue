<template>
    <div>
        <!-- result -->
        <div class="result">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">高一2019-2020第一学期排课计划</span></a-col>
                <a-col>
                <button style="background-color: blue;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 100px"
                >返回</button>
                </a-col>
            </a-row>
        </div>
        <!-- /result -->

        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3">
                    <a-button>课时设置</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button >课节设置</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button>教师设置</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button>课程设置</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button>开始排课</a-button>
                </a-col>
            </a-row>
            <a-table :columns="columns"
                     :data-source="tableData"
                     :pagination="false"
                     :bordered="true">
                <a-select slot="buildingType" slot-scope="type" :default-value="type" style="width: 120px">
                    <a-select-option value="0">
                        非专用
                    </a-select-option>
                    <a-select-option value="1">
                        语文
                    </a-select-option>
                    <a-select-option value="2">
                        数学
                    </a-select-option>
                    <a-select-option value="3">
                        英语
                    </a-select-option>
                </a-select>
                <span slot="action" slot-scope="text" style="color:blue">{{text}}</span>
            </a-table>
            <a-button
                    icon="plus"
                    style="color:white;

                    background-color:#3399cc;
                    margin:30px 0px;"
                    @click="addClass"
            >
                添加教室
            </a-button>
            <router-link to="/schedule/detail/sort_course/course/index">
                <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        margin-top: 70px;
                        margin-bottom: 20px;
                        width: 100px">
                        下一步
                    </button>
            </router-link>

            <!--        添加教室弹窗-->
            <create-modal
                    :close="false"
                    :visible="visible"
                    :loading="loading"
                    @modalClosed="closed"
                    @modalSubmit="handleSubmit">
                <div slot="content">
                    <a-form v-bind="formItemLayout"
                            @submit="handleSubmit"
                            ref="createForm">
                        <a-tree :treeData="treeData" checkable></a-tree>
                    </a-form>
                </div>
            </create-modal>
        </div>
    </div>
</template>
<script>
    // import echarts from 'echarts'
    import CreateModal from "../../../../components/modal/CreateModal";
    // import Templet from "../../../basic/templet/index";
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: '教室名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '所属教学楼',
            dataIndex: 'building',
            key: 'building',
        },
        {
            title: '教室类型',
            dataIndex: 'type',
            key: 'type',
            scopedSlots: { customRender: 'buildingType' }
        },
        {
            title: '楼层',
            key: 'floor',
            dataIndex: 'floor'
        },
        {
            title: '容量',
            key: 'capacity',
            dataIndex: 'capacity'
        },
        {
            title: '操作',
            dataIndex: 'opt',
            key: 'opt',
            scopedSlots: { customRender: 'action' }
        },
    ];
    let tableData = [
        {
            key: 0,
            name: '101',
            building: '逸夫楼',
            type: "0",
            floor: 4,
            capacity: 55,
            opt: '编辑'
        },
        {
            key: 1,
            name: '102',
            building: '逸夫楼',
            type: "1",
            floor: 4,
            capacity: 55,
            opt: '编辑'
        },
        {
            key: 2,
            name: '103',
            building: '逸夫楼',
            type: "2",
            floor: 4,
            capacity: 55,
            opt: '编辑'
        },
    ];
    // eslint-disable-next-line no-unused-vars
    import { Tree } from 'antd';
    export default {
        components: {CreateModal},
        data() {
            return {
                tableData,
                columns,
                visible: false,
                loading: false,
                treeData:[
                    {
                        title: '逸夫楼',
                        key: '1',
                        children: [
                            {
                                title: '一层',
                                key: '11',
                                children:[
                                    {
                                        title:'101',
                                        key:'111'
                                    },{
                                        title: '102',
                                        key: '112'
                                    }
                                ]
                            }, {
                                title: '二层',
                                key: '12'
                            }
                        ]
                    }, {
                        title: '主楼',
                        key: '2',
                    }
                ]
            };
        },
        methods: {
            addClass: function () {
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
            onChange(e){
                console.log('radio checked',e.target.value)
            },
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
        height: 100px;
        background-color: white;
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
        text-align: center;
        height:500px;
    }
    .buttons{
        margin:5px 5px 20px 5px;
        padding:2px 4px;
    }
    .buttons button{
        background-color:#e4e4e4;
        color:black;
    }
</style>
