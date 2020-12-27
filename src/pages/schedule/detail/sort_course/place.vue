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
                <a-col :span="17"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
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
                     :data-source="dataSource"
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
            <a-button icon="plus" style="color:white;
                    background-color:#3399cc;
                    margin:30px 0px; border-radius: 5px;
                    width: 150px;height: 40px" @click="addClass">添加教室</a-button>
            <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        margin-top: 70px;
                       margin-left: 100px;
                        width: 150px" @click="Next">下一步</button>
            <!--        添加教室弹窗-->
            <a-modal
                    title="添加教室"
                    :visible="visible"
                    :closable="false">
                <template slot="footer">
                    <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                    <a-button key="back" @click="handleCancel">取消</a-button>
                </template>
                <a-tree :treeData="buildingsData" checkable></a-tree>
            </a-modal>
        </div>
    </div>
</template>
<script>
    const columns = [
        {
            title: '序号',
            dataIndex: 'classroomId',
        },
        {
            title: '教室名称',
            dataIndex: 'classroomName',

        },
        {
            title: '所属教学楼',
            dataIndex: 'buildingName',
        },
        {
            title: '教室类型',
            dataIndex: 'typeId',
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
    export default {
        data() {
            return {
                dataSource:[],
                count:2,
                columns,
                formItemLayout:false,
                visible: false,
                loading: false,
                planData:"",
                planId:"",
                classroomId:"",
                typeId:"",
                buildingsData:[],
                ClassroomIds:[],
                classroomId:"1",
            };
        },
        async created() {
            let queryString = (window.location.hash || " ").split('?')[1]
            let planId = (queryString || " ").split('=')[1]
            this.planId = planId;
            if (planId) {
                //获取单个选课计划的信息
                let {data: {result, success}} = await this.$api.schedule.plan.schedulegetInfo({planId})
                this.planData = result.name
            }
            // 查看教室设置
            let ClassroomIds=[1,2];
            let {data}=await this.$api.schedule.arrangeClass.getClass(ClassroomIds)
        },
        methods: {
            async addClass() {
                this.visible = true;
                //全部教室信息查询
                let { data:classroomData}  = await this.$api.basic.classroom.fetchList();
                console.log(classroomData.rows);
                let {data} = await this.$api.basic.classroom.fetchRoomList();
                // this.buildingsData = data.result
                console.log(data.result)
                for(let i in data.result) {
                    // 第一层
                    let numberTree = {}
                    numberTree.title = data.result[i].building_name
                    numberTree.key = data.result[i].building_Id
                    if (data.result[i].floor_list.length) {
                        //    第二层
                        numberTree.children = []
                        for (let j = 0; j < data.result[i].floor_list.length; j++) {
                            let item = data.result[i].floor_list[j]
                            let childData = {}
                            childData.key = item.floor
                            childData.title = '第' + item.floor + '层'
                            if(item.classroom_list.length) {
                                childData.children = []
                                for (let k in item.classroom_list) {
                                    let dataThree = {}
                                    dataThree.key = item.classroom_list[k].room_id
                                    dataThree.title = item.classroom_list[k].classroom_name
                                }
                                childData.children.push(dataThree)
                            }
                            numberTree.children.push(childData)
                        }
                    }
                    this.buildingsData.push(numberTree)
                    console.log(data.result[i])
                }
            },
            handleOk(){
                this.visible=false;
            },
            handleCancel(){
              this.visible=false;
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
                this.$router.push(`/schedule/detail/sort_course/index?planId=${this.planId}`)
            },
            oncesSetting(){
                this.$router.push(`/schedule/detail/sort_course/time?planId=${this.planId}`)
            },
            placeSetting(){
                this.$router.push(`/schedule/detail/sort_course/place?planId=${this.planId}`)
            },
            courseSetting(){
                this.$router.push(`/schedule/detail/sort_course/course/index?planId=${this.planId}`)
            },
            startArray(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            onDelete(){
                const dataSource = [...this. tableData];
                dataSource.splice(event.target.getAttribute('dataIndex'),1);
                this. tableData = dataSource
            },
            back(){
              this.$router.go(-1)
            },
            async Next(planId,classroomId,typeId){
                this.$router.push(`/schedule/detail/sort_course/course/index?planId=${this.planId}`)
                let {data}=await this.$api.schedule.arrangeClass.saveCoursetime({planId:this.planId,classroomId:this.classroomId,typeId:this.typeId})
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
