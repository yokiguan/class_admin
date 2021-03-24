<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item>排课计划</a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/schedule/detail">排课详情</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/schedule/detail/sort_class">选课分班</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="#">自动分班</router-link></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="12">
                    <span style="font-size:1.5em">{{this.planData}}-自动分班</span>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-button style="width: 150px;height: 40px;background-color: #1abc9c;color: white" @click="maxNum">统一设置最大人数</a-button>
                        <a-button style="margin-left:50px;width: 150px;height: 40px;background-color: #1abc9c;color: white" @click="timeNum">统一设置课时数</a-button>
                        <button style="margin-left:50px;width: 100px;height: 40px;background-color: blue;color: white;border-radius: 5px;border: none" @click="back">返回</button>
                    </a-row>
                </a-col>
            </a-row>
        </div>
<!--       设置最大人数弹窗-->
        <a-modal title="统一设置最大人数"
                :visible="maxPerNumModal"
                :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOkMax()">保存</a-button>
                <a-button key="back" @click="handleCancelMax">取消</a-button>
            </template>
            <a-form-model :model="form" :rules="rules" :label-col="{ span:5 }" :wrapper-col="{ span: 19}">
                <a-form-model-item label="最大人数：" style="margin-top: 50px" props="maxPerNum" ref="maxPerNum">
                    <a-input placeholder="请输入" v-model="form.maxPerNum"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
<!--        统一设置最大课时数-->
        <a-modal title="统一设置课时数"
                 :visible="maxTimeNumModal"
                 :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOkTime()">保存</a-button>
                <a-button key="back" @click="handleCancelTime">取消</a-button>
            </template>
            <a-form-model :model="form" ref="rules" :label-col="{ span:5 }" :wrapper-col="{ span: 19}">
                <a-form-model-item label="课时数：" style="margin-top: 50px" props="times" ref="times">
                    <a-input placeholder="请输入课时数" v-model="form.times"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <div class="table-bg">
            <a-table :rowKey="'subId'"
                    :columns="columns"
                    :data-source="dataSource"
                    :pagination="false"
                    :bordered="true">
<!--                <input slot="average"  @change="average(record.key, classNum)">-->
                <a-input slot="classNum" slot-scope="classNum,recordClass,classIndex" v-model="classNum" @blur="changeClass(classNum,classIndex)"/>
                <a-input slot="max" slot-scope="max,recordMax,maxIndex" v-model="max"  @blur="changeMax(max,maxIndex)"/>
                <a-input slot="classTime" slot-scope="classTime,recordClassTime,timeIndex" v-model="classTime" @blur="changeClassTime(classTime,timeIndex)"/>
                <a-button slot="action" slot-scope="text,record,index" @click="add(record.subId,record.id,index)" style="background-color:blue;color:white">添加</a-button>
            </a-table>
            <div style="margin: 20px 0px 20px 40%">
                <a-button type="primary" @click="saveAll" style="margin-right:40px;margin-top: 50px;width: 100px;height: 40px">保存</a-button>
                <a-button type="primary" style="width: 100px;height: 40px">返回</a-button>
            </div>
        </div>
<!--        添加-->
        <a-modal  width="800px"
                 :visible="addVisit"
                 :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleAdd">添加</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <div class="title" style="width:770px;height: 50px;border-radius: 5px; margin-left: -10px;
                        margin-top: -10px; background-color: #6Db5a7">
                <h3 style="color: white;padding-top: 10px;padding-left: 20px">老师所教班级个数</h3>
            </div>
            <div class="content_table" style="margin-top: 10px;margin-left: -10px">
                <div class="left" style="width: 300px;height:500px">
                    <a-row class="left_title">
                        <a-col :span="12"><span style="font-size: 1.2em;font-weight: bold">老师列表：</span></a-col>
                    </a-row>
                    <a-row style="font-size: 1.2em;margin-top: 10px;margin-bottom: 10px">
                        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" >
                            <a-form-item label="选择老师">
<!--                                <a-input placeholder="请输入"  v-model="form.teacherName" @blur="inputTeacher"/>-->
                            </a-form-item>
                        </a-form>
                        <span style="float: right;margin-top: -30px">全部展开</span>
                    </a-row>
                    <a-divider style="background-color: black;margin-top: -50px"></a-divider>
                    <a-tree :tree-data="treeData"
                            @check="onCheck"
                            checkable
                            style="font-size: 1.3em;margin-top: -20px"/>
                </div>
                <a-divider type="vertical" style="background-color: black; height: 500px;margin-left: 310px;margin-top: -500px"/>
                <div class="right" style="position:relative;float: right;margin-top: -480px">
                    <a-row style="margin-left: 30px">
                        <a-col :span="10"><span style="font-size: 1.2em;font-weight: bold">已选教师：</span></a-col>
                        <a-col> <span style="font-size: 1.2em;" @click="allClear">全部清除</span></a-col>
                    </a-row>
                    <a-table :rowKey="'id'"
                             :columns="teacherColumns" :data-source="teacherData"
                             :pagination="false"
                             :bordered="true"
                             style="float:right;width: 400px;margin-right: 30px;margin-top: 30px">
                        <a-input slot="classNums" slot-scope="text,record,index" placeholder="0" v-model="text" @blur="changeCapacity(text,index)"/>
                        <button slot="delete" slot-scope="text,record"
                                @click="teacherDelete(record.id)"
                                style="background-color: red;color: white;border: none;width: 80px;height: 30px;border-radius: 5px">删除</button>
                    </a-table></div>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import {message} from "ant-design-vue"
    const columns = [
        {
            title:'',
            dataIndex:'id',
            align:'center',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {   title: '课程',
            dataIndex: 'subjectChildEntity',
            align:'center',
            customRender:(text)=>{
                return  text.name
            }
        },
        {
            title: '学生总人数',
            dataIndex: 'total',
            align:'center',
        },
        {
            title: '班级个数',
            dataIndex: 'classNum',
            align:'center',
            scopedSlots: { customRender: 'classNum' },
        },
        {
            title: '平均人数',
            dataIndex: 'average',
            align:'center',
            // scopedSlots: { customRender: 'average' },
        },
        {
            title: '每班最大人数',
            dataIndex: 'maxNum',
            align:'center',
            scopedSlots: { customRender: 'max' },
        },
        {
            title: '每周课时数',
            dataIndex: 'lessonNum',
            align:'center',
            scopedSlots: { customRender: 'classTime' },
        },
        {
            title: '教师所教班级个数',
            align:'center',
            dataIndex: 'scheduleTeacherEntities',
            customRender:(text,i)=>{
                console.log(text)
                console.log(i)
                let content="";
                for(let i=0;i<text.length;i++){
                    if(content==""){
                        content=text[i].schWxUserEntity.userName+"("+text[i].classNum+")"
                    }else{
                        content=content+"，"+text[i].schWxUserEntity.userName+"("+text[i].classNum+")"
                    }
                }
                 return  content
            }
        },
        {
            title: '操作',
            dataIndex: 'opt',
            scopedSlots: { customRender: 'action' },
        },
    ];
    const teacherColumns=[
        {
          title:"",
          dataIndex:"id",
          align:"center",
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title:'教师名称',
            dataIndex:'schWxUserEntity',
            align:'center',
            customRender:(text)=>{
                return  text.userName
            }
        },{
            title: '所教班级个数',
            dataIndex:'classNum',
            align: 'center',
            scopedSlots: { customRender: "classNums" },
        },{
            title:'操作',
            dataIndex:'opt',
            align:'center',
            scopedSlots: { customRender: "delete" },
        }
    ]
    export default {
        data() {
            return {
                dataSource:[],
                columns,
                treeData:[],
                teacherColumns,
                teacherData:[],
                teacherCount:4,
                maxTimeNumModal:false,
                maxPerNumModal:false,
                addVisit:false,
                visit:false,
                loading:false,
                planData:" ",
                editText:-1,
                subId:"",
                courseId:"",
                checkName:"",
                checkId:"",
                teaNames:[],
                form:{
                    maxPerNum:0,
                    classNum:0,
                    times:0,
                },
                rules:{

                }
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
           this.lookAuto();
        },
        methods: {
            //自动分班查看
            async lookAuto(){
                //自动分班查看
                let {data}=await this.$api.schedule.sortClass.classAutoGet({planId:this.planId});
                // console.log(data);
                this.dataSource=data.rows;
                console.log(this.dataSource)
            },
            //班级个数
            changeClass(classNum,classIndex){
                console.log(classNum);
                console.log(classIndex);
               // console.log( this.dataSource[classIndex]);
                this.dataSource[classIndex].classNum=classNum;
                // console.log( this.dataSource[classIndex].classNum);
                //丢弃小数部分,保留整数部分parseInt(7/2)
                this.dataSource[classIndex].average=Math.floor(this.dataSource[classIndex].total/classNum);
                // console.log( this.dataSource[classIndex].average);
            },
            //每班最大人数
            changeMax(maxNum,maxIndex){
                console.log(maxNum);
                console.log(maxIndex);
                this.dataSource[maxIndex].maxNum=maxNum;
            },
            changeClassTime(timeNum,timeIndex){
                console.log(timeNum);
                console.log(timeIndex);
                this.dataSource[timeIndex].lessonNum=timeNum;
            },
            //统一设置最大人数
            maxNum(){
              this.maxPerNumModal=true;
            },
            //保存统一设置最大人数
            async handleOkMax(){
                let {data}=await this.$api.schedule.sortClass.settingMaxNum({
                    planId:this.planId,
                    maxNum:parseInt(this.form.maxPerNum)});
                console.log(data);
                if(data.success==true){
                    this.maxPerNumModal=false;
                    message.info('最大人数设置成功！');
                    this.lookAuto();
                    this.form.maxPerNu="";
                }

            },
            //关闭统一设置最大人数
            handleCancelMax(){
                this.maxPerNumModal=false;
            },
            //统一设置课时数
            timeNum(){
              this.maxTimeNumModal=true;
            },
            //保存统一设置课时数
            async handleOkTime(){
                let {data}=await this.$api.schedule.sortClass.settingTimeNum({
                    planId:this.planId,lessonNum:parseInt(this.form.times)});
                console.log(data);
                if(data.success==true){
                    message.info('统一课时数设置成功！');
                    this.lookAuto();
                    this.maxTimeNumModal=false;
                    this.form.times="";
                }
            },
            //关闭统一设置课时数
            handleCancelTime(){
                this.maxTimeNumModal=false;
            },
            //改变所教班级数量
            async changeCapacity(num,index){
                if(num===0){
                    message.info('所教班级个数为0,不能保存！')
                }else{
                    let pushData={
                        scheduleTeacherEntity:{
                            id:this.teacherData[index].id,
                            classNum:num,
                            teacherId:this.teacherData[index].teacherId,
                            subId:this.subId,
                        },
                        courseId:this.courseId,
                    }
                    let {data}= await this.$api.schedule.sortClass.classAlterTeacherlist(pushData);
                    console.log(data);
                    if(data&&data.success){
                        message.info("保存成功");
                        this.teacherList(this.subId);
                    }
                    console.log(this.treeData);
                    console.log(this.teacherData);
                    let allTeacherData=[];
                    for(let i=0;i<this.teacherData.length;i++){
                        allTeacherData.push(this.teacherData[i].teacherId);
                    }
                    console.log(allTeacherData);
                    for(let i=0;i<this.treeData.length;i++){
                        console.log(this.treeData)
                        if(this.treeData[i].children){
                            let children=this.treeData[i].children;
                            for(let j=0;j<children.length;j++){
                                for(let k=0;k<allTeacherData.length;k++){
                                    if(allTeacherData[k]==children[j].key){
                                        children[j].disableCheckbox=true;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            //添加教师
            add (subId,id,index) {
                // console.log(subId);
                this.addVisit=true;
                this.teacherInfo(subId);
                this.teacherList(subId);
                this.subId=subId;
                this.courseId=id;
                console.log(this.dataSource);
                let teaData=this.dataSource[index].scheduleTeacherEntities;
                    teaData.forEach(itemTea=>{
                        console.log(itemTea);
                        this.teaNames.push(itemTea.teacherId);
                    })
                console.log(this.teaNames);
            },
            //查看教师信息
            async teacherInfo(subId){
                this.treeData=[];
              let {data:{result,success}}=await this.$api.schedule.sortClass.classGetTeacherList({subChildId:subId});
              console.log(result);
              for(let i=0; i<result.length;i++){
                  let numberTree={};
                  numberTree.title=result[i].departName+result[i].subjectChildEntity.name;
                  numberTree.key=result[i].id+result[i].subjectChildEntity.subChildId;
                  numberTree.disableCheckbox=false;
                  numberTree.children=[];
                  if(result[i].schWxUserEntities.length){
                      for(let j=0;j<result[i].schWxUserEntities.length;j++){
                          let item=result[i].schWxUserEntities;
                          let childData={};
                          childData.title=item[j].userName;
                          childData.key=item[j].wxUid;
                          childData.disableCheckbox=false;
                          numberTree.children.push(childData);
                      }
                  }
                  this.treeData.push(numberTree);
                  console.log(this.treeData);
              }
              for(let i=0;i<this.treeData.length;i++){
                    // console.log(this.treeData)
                    if(this.treeData[i].children){
                        let children=this.treeData[i].children;
                        for(let j=0;j<children.length;j++){
                            for(let k=0;k<this.teaNames.length;k++){
                                // console.log(children[j].key);
                                // console.log(this.teaNames[k]);
                                // console.log("=====================================");
                                if(this.teaNames[k]==children[j].key){
                                    children[j].disableCheckbox=true;
                                }
                            }
                        }
                    }
                }
            },
            //查看教师列表
            async teacherList(subId){
              let {data}=await this.$api.schedule.sortClass.classGetTeacherlist({planId:this.planId,subId:subId})
              console.log(data);
              this.teacherData=data.rows;
              console.log(this.teacherData);
            },
            //返回
            back(){
                this.$router.go(-1)
            },
            //删除老师
            async teacherDelete(id){
                let {data}=await this.$api.schedule.sortClass.classDeleteTeacher({ids:[id]})
                console.log(data);
                if(data&&data.success){
                    message.info('删除成功');
                    this.teacherList(this.subId);
                }else{
                    message.info('删除失败');
                }
            },
            //清空教师
            async allClear(){
                console.log(this.subId);
                let {data}=await this.$api.schedule.sortClass.clearTeacher({planId:this.planId,subId:this.subId});
                console.log(data);
                this.teacherList(this.subId);
            },
            //添加弹框的保存
            handleAdd() {
                //获取添加老师列表信息
                const {  teacherCount, teacherData} = this;
                console.log(this.checkName);
                if(this.checkName===" "){
                    message.info("没有选择老师，请选择老师！")
                }else{
                    const newData = {
                        capacity:0,
                        teacherId:this.checkId,
                        schWxUserEntity:{
                            userName:this.checkName,
                        },
                    };
                    this.teacherData= [...teacherData, newData];
                }
            },
            //关闭添加弹框
            handleCancel() {
                this.addVisit=false;
                this.lookAuto();
            },
            //选择老师
            onCheck(check){
                console.log(this.treeData);
                console.log(check);
                let checkedValue=[];
                for(let i=0;i<this.treeData.length;i++){
                    let item=this.treeData[i].children;
                    for(let j=0;j<item.length;j++){
                        for(let k=0;k<check.length;k++){
                            if(item[j].key===check[k]){
                                this.checkName=item[j].title;
                                this.checkId=item[j].key;
                            }
                        }
                    }
                };
                console.log(this.checkName);
            },
            //保存所有数据
            async saveAll(){
                let pushData=[];
                for(let i in this.dataSource){
                    pushData[i]={
                        id:this.dataSource[i].id,
                        classNum:Number(this.dataSource[i].classNum) ,
                        average:this.dataSource[i].average,
                        maxNum:Number(this.dataSource[i].maxNum) ,
                        lessonNum:Number(this.dataSource[i].lessonNum) ,
                    }
                }
                console.log(pushData);
                let addData={
                    classroomNum:"10",
                    scheduleCourseEntities:pushData
                }
                let {data}=await this.$api.schedule.sortClass.classAutoAlter(addData);
                console.log(data);
                if(data&&data.success){
                    message.info("保存成功");
                    this.lookAuto();
                }else{
                    message.info("保存失败");
                }
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
    .table-bg{
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
    }
    .table-bg input{
        border:1px solid black;
        border-radius: 5px;
        width:6em;
    }
</style>
