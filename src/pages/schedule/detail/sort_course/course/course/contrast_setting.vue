<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">选课排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">课程设置</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">互斥设置</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                <a-col><button style="background-color: blue;
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
                     :bordered="true"
                     class="table">
                <a-input  slot="sortName" slot-scope="text,record,index"  v-model="text" @blur="changeSort(record.id,text)"/>
                <div slot="add_course" slot-scope="text,record">
                    <template v-for="(tag) in text">
                       <a-tag :key="tag.id" closable @close="handleClose(record.id,tag.id,tag.subName)">
                           {{ tag.subName}}
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
            <div style="margin-top: 20px;margin-left: 55px;float: left;font-size: 1.0rem;color: blue;" @click="AddContent">
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
                   <a-form-model :model="form" :rules="rules" :label-col="{span:3}" :wrapper-col="{span:12}">
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
            align:'center',
            scopedSlots: { customRender: 'sortName' },
        },
        {
            title: '课程',
            dataIndex: 'course',
            scopedSlots: { customRender: 'add_course' },
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
                labelId:-1,
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
            this.lookContrast();
        },
        methods: {
            //互斥规则查看
            async lookContrast(){
                //获取互斥规则信息
                let {data}=await this.$api.schedule.arrangeClass.banGetting({planId:this.planId,ruleType:"0"})
                console.log(data);
                this.dataSource=data.rows
                for(let i in this.dataSource){
                    this.dataSource[i].course=[];
                }
                // console.log(this.dataSource);
            },
            //添加课程
            async add_course(id) {
                this.chooseCourseModal = true;
                this.chooseCourseId=this.dataSource.findIndex(item=>item.id==id);
                console.log(this.chooseCourseId);
                //获取课程接口
                let { data } = await this.$api.basic.subject.fetchMainList();
               // console.log(data);
               this.course=data.rows;
               console.log( this.course);
            },
            //修改分组名称
            changeSort(index,value){
              // console.log(index);
              this.inputValue=value;
              console.log(this.inputValue);
              this.dataSource.groupName=value;
              console.log(this.dataSource.groupName);
            },
            //关闭添加课程
            handleCancel () {
                this.chooseCourseModal = false
                this.loading = false
            },
            //选择课程
            onChange(index,value){
                //数据保存
              console.log(this.dataSource);
              const { count, dataSource} = this;
              console.log(dataSource);
              let pushData={
                    id:index,
                    subName:value,
                }
              dataSource[this.chooseCourseId].course.push(pushData);
              console.log(pushData);
              this.dataSource=[...dataSource];
              console.log(this.dataSource[this.chooseCourseId].course);
              console.log(this.dataSource);
            },
            //删除课程
            handleClose(id,removeTagId,removeTag){
                console.log(removeTagId);
                let deleId=-1;
                deleId=this.dataSource.findIndex(item=>item.id==id);
                this.labelId=this.dataSource[deleId].course.findIndex(item=>item.id==removeTagId);
                console.log(deleId);
                console.log(this.labelId);
                console.log(removeTag);
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
            //保存并跳转至下一步
            async Next(){
                let courseId=[];
                // let pushData=[];
                // for(let i in this.dataSource){
                //     pushData[i]={
                //         groupName:this.dataSource[i].groupName,
                //     }
                //     console.log(this.dataSource[i].groupName);
                //     for(let j in this.dataSource[i].course){
                //         courseId.push(this.dataSource[i].course[j].id);
                //     }
                // }

                console.log(courseId);
                console.log(this.dataSource.groupName);
                // let newData={
                //     planId:this.planId,
                //     ruleType:"0",
                //     setInfo:{
                //
                //       subId :courseId,
                //     },
                // }
                // console.log(newData);
                // let addData={...this.dataSource,...newData}
                //
                // let {data}=await this.$api.schedule.arrangeClass.banAdding(addData);
                // console.log(data);
                this.$router.push(`/schedule/detail/sort_course/course/course/same_class?planId=${this.planId}`);
            },
            //开始排课
            startArray(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            //添加一项规则
            AddContent(){
                const { count, dataSource} = this;
                console.log(dataSource);
                const newData = {
                    id:this.dataSource.length+1,
                    course:[],
                };
                this.dataSource= [...dataSource, newData];
                this.count = count + 1;
            },
            //删除一行数据
            async onDelete(deleId){
                console.log(deleId);
                let {data}=await this.$api.schedule.arrangeClass.banDeleting({ids:deleId})
                console.log(data);
                this.lookContrast();
            },
            //返回
            back(){
                this.$router.go(-1)
            },
        }
    };
</script>

<style lang="less" scoped>
    .editable-cell {
        position: relative;
    }
    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
        padding-right: 24px;
    }

    .editable-cell-text-wrapper {
        padding: 5px 24px 5px 5px;
    }
    .editable-cell-icon,
    .editable-cell-icon-check {
        position: absolute;
        right: 0;
        width: 20px;
        cursor: pointer;
    }
    .editable-cell-icon {
        line-height: 18px;
        display: none;
    }
    .editable-cell-icon-check {
        line-height: 28px;
    }
    .editable-cell:hover .editable-cell-icon {
        display: inline-block;
    }
    .editable-cell-icon:hover, .editable-cell-icon-check:hover {
        color: #108ee9;
    }
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
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        vertical-align: top;
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
        width: 68%;
    }
</style>
