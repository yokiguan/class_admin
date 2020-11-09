<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">选课排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">教室设置</a></a-breadcrumb-item>
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
                        width: 100px" @click="back">返回</button>
                </a-col>
            </a-row>
        </div>
        <!-- /result -->

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
                <a slot="action" slot-scope="text" style="color:blue" @click="onDelete">{{text}}</a>
            </a-table>
            <a-button icon="plus"
                    style="color:white;
                    background-color:#3399cc;
                    margin:30px 0px; border-radius: 5px;
                    width: 150px;height: 40px"
                    @click="addClass">添加教室</a-button>
            <router-link to="/schedule/detail/sort_course/course/index">
                <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        margin-top: 70px;
                       margin-left: 100px;
                        width: 150px">
                        下一步
                    </button>
            </router-link>
            <!--        添加教室弹窗-->
            <create-modal
                    :close="false"
                    :visible="visible"
                    :loading="loading"
                    @modalClosed="closed"
                    @modalSubmit="AddhandleSubmit">
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
    import CreateModal from "../../../../components/modal/CreateModal";
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
        },
        {
            title: '教室名称',
            dataIndex: 'name',

        },
        {
            title: '所属教学楼',
            dataIndex: 'building',
        },
        {
            title: '教室类型',
            dataIndex: 'type',
            scopedSlots: { customRender: 'buildingType' }
        },
        {
            title: '楼层',
            dataIndex: 'floor'
        },
        {
            title: '容量',
            dataIndex: 'capacity'
        },
        {
            title: '操作',
            dataIndex: 'opt',
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
            opt: '删除'
        },
        {
            key: 1,
            name: '102',
            building: '逸夫楼',
            type: "1",
            floor: 4,
            capacity: 55,
            opt: '删除'
        },
        {
            key: 2,
            name: '103',
            building: '逸夫楼',
            type: "2",
            floor: 4,
            capacity: 55,
            opt: '删除'
        },
    ];
    export default {
        components: {CreateModal},
        data() {
            return {
                tableData,
                count:2,
                columns,
                formItemLayout:false,
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
            },
            AddhandleSubmit: function () {
                this.loading = true
                setTimeout(() => {
                    this.visible = false
                    this.loading = false
                }, 200)
                const { count, tableData} = this;
                const newData = {
                    key: count,
                    name: '101',
                    building: '逸夫楼',
                    type: "0",
                    floor: 4,
                    capacity: 55,
                    opt: '删除'
                };
                this.tableData= [...tableData, newData];
                this.count = count + 1;
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
            onDelete(key){
                const dataSource = [...this.tableData];
                this.tableData = dataSource.filter(item => item.key !== key);
            },
            back(){
              this.$router.go(-1)
            },
            handleSubmit(){},
            click(){},
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
