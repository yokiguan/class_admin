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
                     :bordered="true"
                     class="table">
                <a-input slot="sort_name"></a-input>
                <a-button slot="add_course" style="background-color: #00ccff;
                    width: 100px;
                    color: white;
                    height:40px;"
                    @click="add_course">添加课程</a-button>
                <span slot="action" slot-scope="text" style="color:blue">{{text}}</span>
            </a-table>
           <div style="
                    margin-top: 20px;
                    margin-left: 55px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;">
               <a-icon type="plus" />
               <span>
                   添加一项
               </span>
           </div>
            <router-link to="/schedule/detail/sort_course/course">
                <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        margin-top:100px;
                        margin-bottom: 20px;
                        width: 100px">
                    下一步</button>
            </router-link>
            <create-modal class="add"
                          width="700px"
                          :close="false"
                          :visible="visible"
                          :loading="loading"
                          @modalClosed="closed"
                          @modalSubmit="handleSubmit1">
                <div slot="content">
                    <div style="height: 52px;
                            border-radius: 5px;
                             margin-top: -23px;
                             margin-left: -24px;
                            width: 700px;background-color: #e4e4e4">
                            <h3 style="margin: 0px 0px 50px 0px;
                                  padding: 15px 20px;
                                  font-size: 1.0rem;
                                  vertical-align: top;">选择课程</h3>
                    </div>
                    <div class="model1_content"
                         style="margin-top: 70px;">
                        <a-form :form="form" :label-col="{ span:4 }" :wrapper-col="{ span: 18}" @submit="handleSubmit1">
                            <a-form-item label="选择课程">
                                <a-checkbox-group @change="onChange">
                                    <a-row>
                                        <a-col :span="6">
                                            <a-checkbox value="A">语文</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="B">数学</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="C">英语</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="D">日语</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="E">物理选修</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="F">物理学修</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="G">生物选修</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="H">生物学修</a-checkbox>
                                        </a-col>
                                    </a-row>
                                </a-checkbox-group>
                            </a-form-item>
                        </a-form>
                    </div>
                </div>
            </create-modal>
        </div>
    </div>
</template>
<script>
    import CreateModal from "../../../../../../components/modal/CreateModal";
    const columns = [
        {
            title: ' ',
            dataIndex: 'blank',
            key: 'blank',
            align:'center'
        },
        {
            title: '分组名称',
            dataIndex: 'sort',
            key: 'sort',
            scopedSlots: { customRender: 'sort_name' },
            align:'center'
        },
        {
            title: '课程',
            dataIndex: 'subject',
            key: 'subject',
            scopedSlots: { customRender: 'add_course' },
            align:'center'
        },
        {
            title: '操作',
            dataIndex: 'opt',
            key: 'opt',
            scopedSlots: { customRender: 'action' },
            align:'center'
        },
    ];
    let tableData = [
        {
            blank:'1',
            opt: '删除'
        },
        {
            blank:'2',
            opt: '删除'
        },
        {
            blank:'3',
            opt: '删除'
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
            };
        },
        methods: {
            add_course: function () {
                this.visible = true;
            },
            change: function () {
                this.visible = true;
            },
            closed: function () {
                this.visible = false
                this.loading = false
            },
            handleSubmit1: function () {
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
        padding: 20px 25px;
        border-radius: 5px;
        text-align: center;
        height: 600px;
    }
    .buttons{
        margin:5px 5px 20px 5px;
        padding:2px 4px;
    }
    .buttons button{
        background-color:#e4e4e4;
        color:black;
    }
    .table{
        margin-left: 48px;
        width: 56%;
    }
</style>
