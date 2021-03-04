<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">选课排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">课程设置</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">禁止科目相邻</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                <a-col> <button style="background-color: blue;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 100px" @click="back">返回</button></a-col>
            </a-row>
        </div>
        <a-card class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="placeSetting">教室设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="courseSetting">课程设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <a-table :rowKey="'id'"
                    :columns="columns"
                     :data-source="dataSource"
                     :pagination="false"
                     :bordered="true">
                <a-input  slot="sortName" slot-scope="text,record"  v-model="text" @blur="changeSort(record.id,text)"/>
                <template slot="kind" slot-scope="text,record1">
                    <a-select :default-value="text" style="width: 100px" @change="handleSelectChange($event,record1.id)">
                        <a-select-option value="2">禁止相邻 </a-select-option>
                        <a-select-option value="3"> 优先相邻 </a-select-option>
                        <a-select-option value="4"> 必须相邻 </a-select-option>
                    </a-select>
                </template>
                <div slot="subId" slot-scope="text,record">
                    <template v-for="(tag) in text.split(',')">
                        <a-tag :key="tag.id" closable @close="handleClose(record.id,tag.subName)">
                            {{computedSubName(tag)}}
                        </a-tag>
                    </template>
                    <a-button  style="background-color: #00ccff;  white-space: pre-line; width: 100px;color: white;height:40px;" @click="add_course(record.id)">
                        添加课程
                    </a-button>
                </div>
                <template slot="action" slot-scope="text, record">
                    <a-popconfirm
                            v-if="dataSource.length"
                            title="确认删除?"
                            @confirm="() => onDelete(record.id)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
            <div style="
                    margin-top: 20px;
                    margin-left: 55px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;" @click="AddContent">
                <a-icon type="plus" />
                <span>添加一项</span>
            </div>
            <!--            选择课程-->
            <a-modal  title="选择课程"
                      :visible="chooseCourseModal"
                      :closable="false">
                <template slot="footer">
                    <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                    <a-button key="back" @click="handleCancel">取消</a-button>
                </template>
                <a-form-model :model="form" :rules="rules">
                    <a-form-model-item>
                        <a-checkbox-group v-model="form.course">
                            <a-checkbox v-for="(course,index) in this.course" :value="course.subName" @change="onChange(course.id,course.subName)">
                                {{course.subName}}
                            </a-checkbox>
                        </a-checkbox-group>
                    </a-form-model-item>
                </a-form-model>
            </a-modal>
        </a-card>
        <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        margin-top:100px;
                        margin-bottom: 20px;
                        width: 100px" @click="Next">下一步</button>
    </div>
</template>
<script>
    const columns = [
        {
            title: ' ',
            dataIndex: 'id',
            align:'center',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title: '分组名称',
            dataIndex: 'groupName',
            scopedSlots: { customRender: 'sortName' },
            align:'center'
        },
        {
            title:'类型',
            dataIndex:'type',
            scopedSlots: { customRender: 'kind' },
            align:'center'
        },
        {
            title: '课程',
            dataIndex: 'subId',
            scopedSlots: { customRender: 'subId' },
            align:'center'
        },
        {
            title: '操作',
            dataIndex: 'opt',
            scopedSlots: { customRender: 'action' },
            align:'center'
        },
    ];
    // eslint-disable-next-line no-unused-vars
    import { Tree } from 'antd';
    export default {
        data() {
            return {
                dataSource:[],
                columns,
                chooseCourseModal: false,
                loading: false,
                planData:"",
                planId:"",
                course:"",
                chooseCourseId:-1,
                form:{},
                rules:{},
                inputValue:"",
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
            //获取课程接口
            let { data } = await this.$api.basic.subject.fetchMainList();
            // console.log(data);
            this.course=data.rows;
            // console.log( 'this.course',this.course);
            this.lookContrast();
        },
        methods: {
            computedSubName(subId){
                let filterCourse = this.course.filter(item => item.id === subId)
                console.log(filterCourse);
                if(filterCourse.length > 0){
                    return filterCourse[0].subName
                }
            },
            //获取禁止相邻规则信息
            async lookContrast(){
                let {data}=await this.$api.schedule.arrangeClass.banGetting({planId:this.planId,ruleType:"2"})
                console.log(data);
                this.dataSource=data.rows
                // console.log(this.dataSource);
            },
            //修改类型
            handleSelectChange($event,index){
                console.log(index);
                console.log($event);
                this.dataSource.map(item=>{
                    if(item.id === index){
                        return item.type = $event
                    }
                })
                console.log(this.dataSource);
            },
            //添加课程
            async add_course(id) {
                this.chooseCourseModal = true;
                this.chooseCourseId=this.dataSource.findIndex(item=>item.id==id);
            },
            //修改分组名称
            changeSort(index,value){
                // console.log(index);
                this.dataSource.map(item=>{
                    if(item.id === index){
                        return item.groupName = value
                    }
                })
                console.log(this.dataSource);
            },
            //关闭添加课程
            handleCancel () {
                this.chooseCourseModal = false
                this.loading = false
            },
            //选择课程
            onChange(index,value){
                //数据保存
                const { count, dataSource} = this;
                if(dataSource[this.chooseCourseId].subId==""){
                    dataSource[this.chooseCourseId].subId=index;
                }else{
                    dataSource[this.chooseCourseId].subId += ',' + index;
                }
                this.dataSource=[...dataSource];
                console.log('weew',this.dataSource);
            },
            //删除课程
            handleClose(id,removeTag){
                console.log(removeTagId);
                let deleId=-1;
                deleId=this.dataSource.findIndex(item=>item.id==id);
                // console.log(deleId);
                // console.log(removeTag);
                let course=[];
                for(let i=0;i<this.dataSource[deleId].course.length;i++){
                    if(this.dataSource[deleId].course[i].subName!==removeTag){
                        course=[...course,this.dataSource[deleId].course[i]]
                    }
                }
                console.log(course);
                this.dataSource[deleId].course=course;
                console.log(this.dataSource[deleId].course);
                console.log(this.dataSource);
            },
            //保存添加课程
            handleOk() {
                this.loading=true;
                setTimeout(() => {
                    this.chooseCourseModal = false;
                    this.loading = false;
                }, 20)
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
            //跳转至下一步并保存
            async Next(){
                let pushData=[];
                for(let i in this.dataSource){
                    pushData[i]={};
                    pushData[i].groupName=this.dataSource[i].groupName;
                    pushData[i].subId=this.dataSource[i].subId;
                    pushData[i].type=this.dataSource[i].type;
                }
                console.log('pushData',pushData);
                let newData={
                    planId:this.planId,
                    ruleType:"2",
                    setInfo: pushData
                }
                console.log('newData',newData);
                let {data}=await this.$api.schedule.arrangeClass.banAdding(newData);
                console.log(data);
                this.$router.push(`/schedule/detail/sort_course/course/index?planId=${this.planId}`)
            },
            //添加一项规则
            AddContent(){
                const { count, dataSource} = this;
                const newData = {
                    id:this.dataSource.length+1,
                    type:"",
                    subId:"",
                };
                this.dataSource.push(newData);
                this.count = count + 1;
            },
            //删除一行数据
            async onDelete(deleId){
                console.log(deleId);
                let {data}=await this.$api.schedule.arrangeClass.banDeleting({ids:deleId})
                console.log(data);
                if(data&&data.success){
                    //获取互斥规则信息
                    this.lookContrast();
                    message.info('删除成功');
                }else{
                    message.info('删除失败');
                }
            },
            //返回
            back(){
                this.$router.go(-1)
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
        width: 65%;
    }
</style>
