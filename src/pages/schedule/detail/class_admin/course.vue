<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">行政班排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">学科设置</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">高一2019-2020第一学期排课计划</span></a-col>
                <a-col>
                    <button style="background-color: blue;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 100px">返回</button>
                </a-col>
            </a-row>
        </div>
        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="placeSetting">教师设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="courseSetting">课程设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <a-table :columns="columns"
                     :data-source="tableData"
                     :pagination="false"
                     :bordered="true">
                <a-input slot="every_time"></a-input>
                <a-icon type="edit" slot="class_day" style="color: #00ccff;
                font-size: 25px;
                font-weight: bold" @click="edit"/>
                <a-input slot="maxClass" placeholder="0"></a-input>
                <a-input slot="everySettingTimes" placeholder="0"></a-input>
                <a-input slot="morningClassTimes" placeholder="0"></a-input>
                <a-input slot="afterClassTimes" placeholder="0"></a-input>
                <span slot="action" slot-scope="text" style="color:blue">{{text}}</span>
            </a-table>
            <a-button
                    icon="plus"
                    style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        font-size: 20px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-top: 30px;
                        width: 150px"
                    @click="add">添加</a-button>
                <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        margin-top: 150px;
                        margin-bottom: 20px;
                        width: 150px" @click="Next">
                    下一步</button>
            <!--        编辑弹窗-->
            <create-modal class="edit"
                          :close="false"
                          width="700px"
                          :visible="visible"
                          :loading="loading"
                          @modalClosed="closed"
                          @modalSubmit="handleSubmit1">
                <div slot="content">
                    <div style="height: 65px;
                         border-radius: 5px;
                         margin-top: -23px;
                         margin-left: -24px;
                         width:700px;background-color: #e4e4e4">
                        <h3 style="margin-left: 10px;
                              padding: 20px 25px;
                              vertical-align: top;
                              font-size: 1.2rem">设置上课天数</h3>
                    </div>
                    <a-form style="margin-top: 30px;"  :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}" @submit="handleSubmit1">
                        <a-form-item label="类型">
                            <a-select
                                v-decorator="[
                                    'type',
                                    { rules: [{ required: true, message: '小于/大于/等于' }] }, ]"
                                placeholder="小于/大于/等于"
                                @change="handleSelectChange">
                            <a-select-option value="1">
                                小于
                            </a-select-option>
                            <a-select-option value="2">
                                 大于
                            </a-select-option>
                            <a-select-option value="3">
                                 等于
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="天数">
                        <a-input placeholder="请输入"/>
                    </a-form-item>
                </a-form>
            </div>
            </create-modal>
<!--            添加弹窗-->
            <create-modal class="add"
                          width="700px"
                          :close="false"
                          :visible="visib"
                          :loading="load"
                          @modalClosed="close"
                          @modalSubmit="handleSubmit2">
                <div slot="content">
                    <div style="height: 65px;
                         border-radius: 5px;
                         margin-top: -23px;
                         margin-left: -24px;
                         width:700px;background-color: #e4e4e4">
                        <h3 style="margin: 0px 0px 50px 0px;
                              padding: 20px 25px;
                              vertical-align: top;
                              font-size: 1.2rem">添加课程</h3>
                    </div>
                    <a-form style="margin-top: 30px" :form="form"  @submit="handleSubmit1">
                        <a-form-item label="添加课程：" :label-col="{ span: 5}" :wrapper-col="{ span: 18}">
                            <a-input-search placeholder="请输入"/>
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 33}">
                            <div style="margin-left: 90px">
                                <a-tree
                                        :show-line="showLine"
                                        @select="onSelect">
                                    <a-tree-node key="0-0">
                                        <span slot="title" >物理</span>
                                        <a-tree-node key="0-0-0" title="物理选修">
                                            <a-tree-node key="0-0-0-0">
                                            </a-tree-node>
                                        </a-tree-node>
                                        <a-tree-node key="0-0-1" title="物理学修">
                                            <a-tree-node key="0-0-1-1">
                                            </a-tree-node>
                                        </a-tree-node>
                                    </a-tree-node>
                                    <a-tree-node key="0-1">
                                        <span slot="title" >语文</span>
                                        <a-tree-node key="0-1-1">
                                        </a-tree-node>
                                    </a-tree-node>
                                    <a-tree-node key="0-2">
                                        <span slot="title" >数学</span>
                                        <a-tree-node key="0-2-1">
                                        </a-tree-node>
                                    </a-tree-node>
                                    <a-tree-node key="0-3">
                                        <span slot="title" >化学</span>
                                        <a-tree-node key="0-3-1">
                                        </a-tree-node>
                                    </a-tree-node>
                                    <a-tree-node key="0-4">
                                        <span slot="title" >生物</span>
                                        <a-tree-node key="0-4-1">
                                        </a-tree-node>
                                    </a-tree-node>
                                    <a-tree-node key="0-5">
                                        <span slot="title" >外语</span>
                                        <a-tree-node key="0-5-1">
                                        </a-tree-node>
                                    </a-tree-node>
                                </a-tree>
                            </div>
                        </a-form-item>
                    </a-form>
                </div>
            </create-modal>
        </div>
    </div>
</template>
<script>
    import CreateModal from "../../../../components/modal/CreateModal";
    const columns = [
        {
            title: '学科名称',
            dataIndex: 'subject',
            key: 'subject',
            align:'center',
            width:'8%'
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            align:'center',
            width:'8%'
        },
        {
            title: '每周节数',
            dataIndex: 'every_times',
            key: 'every_times',
            scopedSlots: { customRender: 'every_time' },
            align:'center',
            width:'10%'
        },
        {
            title: '上课天数',
            dataIndex: 'class_days',
            key: 'class_days',
            scopedSlots: { customRender: 'class_day' },
            align:'center',
            width:'8%'
        },
        {
            title: '最大开课数',
            dataIndex: 'max_class',
            key: 'max_class',
            scopedSlots: { customRender: 'maxClass' },
            align:'center',
            width:'15%'
        },
        {
            title: '每天课时数设置',
            key: 'every_setting_times',
            dataIndex: 'every_setting_times',
            scopedSlots: { customRender: 'everySettingTimes' },
            align:'center',
            width:'15%'
        },
        {
            title: '上午课时数',
            key: 'morning_times',
            dataIndex: 'morning_times',
            align:'center',
            scopedSlots: { customRender: 'morningClassTimes' },
            width:'15%'
        },
        {
            title: '下午课时数',
            key: 'after_times',
            dataIndex: 'after_times',
            align:'center',
            scopedSlots: { customRender: 'afterClassTimes' },
            width:'15%'
        },
        {
            title: '操作',
            dataIndex: 'opt',
            key: 'opt',
            scopedSlots: { customRender: 'action' },
            align:'center',
            width:'5%'
        },
    ];
    let tableData = [
        {
            subject:'语文',
            opt: '删除'
        },
        {
            subject:'数学',
            opt: '删除'
        },
        {
            subject:'体育',
            opt: '删除'
        },
        {
            subject:'升国旗',
            opt: '删除'
        },
        {
            subject:'班会',
            opt: '删除'
        }
    ];
    export default {
        components: {CreateModal},
        data() {
            return {
                tableData,
                columns,
                visible: false,
                visib:false,
                load:false,
                loading: false,
                showLine: true,
            };
        },
        methods: {
            edit: function () {
                this.visible = true;
            },
            add: function () {
                this.visib = true;
            },
            change: function () {
                this.visible = true;
                this.visib = true;
            },
            closed: function () {
                this.visible = false
                this.loading = false
            },
            close: function () {
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
            handleSubmit2: function () {
                const that = this
                console.log(that.$refs.createForm)
                that.load = true
                setTimeout(() => {
                    that.visib = false
                    that.load = false
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
            },
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
            },
            timesSetting(){
                this.$router.push('/schedule/detail/sort_course/index')
            },
            oncesSetting(){
                this.$router.push('/schedule/detail/sort_course/time')
            },
            placeSetting(){
                this.$router.push('/schedule/detail/sort_course/place')
            },
            courseSetting(){
                this.$router.push('/schedule/detail/sort_course/course/index')
            },
            startArray(){
                this.$router.push('/schedule/detail/start_class')
            },
            Next(){
                this.$router.push('/schedule/detail/class_admin/class')
            }
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
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
        text-align: center;
        height: 700px;
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
