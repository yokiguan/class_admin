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
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="placeSetting">教室设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="courseSetting">课程设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <a-table :rowKey="'classRoomId'"
                     :columns="columns"
                     :data-source="dataSource"
                     :pagination="false"
                     :bordered="true">
                <template slot="typeId" slot-scope="text,record">
                   <a-select :default-value="text" @change="handleSelectChange($event,index)" style="width: 150px">
                       <a-select-option value="0">专业教学场地</a-select-option>
                       <a-select-option value="1">公共教学场地</a-select-option>
                       <a-select-option value="2">行政班教室</a-select-option>
                   </a-select>
               </template>
                <template slot="action" slot-scope="text, record">
                    <a-popconfirm
                            v-if="dataSource.length"
                            title="确认删除?"
                            @confirm="() => onDelete(record.id)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>
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
            <a-modal title="添加教室"
                    :visible="visible"
                    :closable="false">
                <template slot="footer">
                    <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                    <a-button key="back" @click="handleCancel">取消</a-button>
                </template>
                <template>
                    <a-tree  v-model="checkedKeys"
                             checkable
                             :checkedKeys="checkedKeys"
                             :tree-data="treeData"
                             @check="onCheck"/>
                </template>
            </a-modal>
        </div>
    </div>
</template>
<script>
    const columns = [
        {
            title: '序号',
            dataIndex: 'classRoomId',
            align:'center',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title: '教室名称',
            dataIndex: 'classroomName',
            align:'center',
        },
        {
            title: '所属教学楼',
            dataIndex: 'buildingName',
            align:'center',
        },
        {
            title: '教室类型',
            dataIndex: 'typeId',
            scopedSlots: { customRender: 'typeId' },
            align:'center',

        },
        {
            title: '楼层',
            dataIndex: 'floor',
            align:'center',
        },
        {
            title: '容量',
            dataIndex: 'capacity',
            align:'center',
        },
        {
            title: '操作',
            dataIndex: 'opt',
            scopedSlots: { customRender: 'action' },
            align:'center',
        },
    ];
    export default {
        data() {
            return {
                dataSource:[],
                columns,
                visible: false,
                loading: false,
                planData:"",
                planId:"",
                classroomId:"",
                checkedKeys: [],
                treeData:[],
                deleteText:-1,
                classroom:[],
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
            this.classroomInfo();
            this.buildingInfo();
        },
        //监测课程分支数据的获取
        watch: {
            checkedKeys(val) {
                console.log('watchDataOfKeys', val);
            },
        },
        methods: {
            //查看教室设置
            async classroomInfo(){
                let {data:{result,success}}=await this.$api.schedule.arrangeClass.getClass({planId:this.planId})
                console.log(result);
                this.dataSource=result;
                console.log(this.dataSource);
            },
            //修改类型
            handleSelectChange($event,index){
                // console.log(this.tableData4);
                console.log(index);
                console.log($event);
                // this.tableData4[index].useMax=$event;
            },
            //添加教室
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
                                childData.children = [];
                                let dataThree = {};
                                for (let k in item.classroom_list) {
                                    dataThree.key = item.classroom_list[k].room_id
                                    dataThree.title = item.classroom_list[k].classroom_name
                                }
                                childData.children.push(dataThree)
                            }
                            numberTree.children.push(childData)
                        }
                    }
                    this.treeData.push(numberTree)
                    console.log(data.result[i])
                    console.log(this.treeData);
                }
            },
            //获取教室相关信息
            async buildingInfo() {
                let {data} = await this.$api.basic.classroom.fetchList();
                console.log(data);
                this.classroom = data.rows;
                console.log(this.classroom);
            },
            onCheck(e) {
                console.log('onCheck', e);
            },
            //保存新增教室
            handleOk(){
                this.visible=false;
                for(let i=0;i<this.classroom.length;i++){
                }
            },
            //取消新增教室
            handleCancel(){
              this.visible=false;
            },
            //课时设置
            timesSetting(){
                this.$router.push(`/schedule/detail/sort_course/index?planId=${this.planId}`)
            },
            //课节设置
            oncesSetting(){
                this.$router.push(`/schedule/detail/sort_course/time?planId=${this.planId}`)
            },
            //教室设置
            placeSetting(){
                this.$router.push(`/schedule/detail/sort_course/place?planId=${this.planId}`)
            },
            //课程设置
            courseSetting(){
                this.$router.push(`/schedule/detail/sort_course/course/index?planId=${this.planId}`)
            },
            //开始排课
            startArray(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            //删除教室
            onDelete(deleId){
                this.deleteText=this.dataSource.findIndex(item=>item.classRoomId===deleId);
                console.log(this.deleteText);
                this.dataSource.splice(this.deleteText,1);
                console.log(this.dataSource);
            },
            //返回
            back(){
              this.$router.go(-1)
            },
            //保存并跳转至下一步
            async Next(planId,classroomId,typeId){
                this.$router.push(`/schedule/detail/sort_course/course/index?planId=${this.planId}`)
                let {data}=await this.$api.schedule.arrangeClass.saveCoursetime({planId:this.planId,classroomId:this.classroomId,typeId:this.typeId})
            },
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
