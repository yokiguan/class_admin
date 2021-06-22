<template>
   <div>
       <div>
           <div class="title">
               <a-breadcrumb>
                   <a-breadcrumb-item>首页</a-breadcrumb-item>
                   <a-breadcrumb-item><a href="">我的课表</a></a-breadcrumb-item>
               </a-breadcrumb>
           </div>
<!--           <div class="left">-->
<!--               <a-row class="left_title">-->
<!--                   <a-col :span="3"><a-icon type="reload" style="font-size: 1.5em;-->
<!--                    font-weight: bold"/></a-col>-->
<!--                   <a-col :span="12"><span style="font-size: 1.2em">刷新菜单</span></a-col>-->
<!--                   <a-col><span style="font-size: 1.2em">全部展开</span></a-col>-->
<!--               </a-row>-->
<!--               <a-collapse default-active-key="1" :bordered="false" style="margin-top: 20px">-->
<!--                   <template #expandIcon="props">-->
<!--                       <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />-->
<!--                   </template>-->
<!--                   <a-collapse-panel key="1" header="必选基础课">-->
<!--                       <p>高一语文</p>-->
<!--                       <p>高一数学</p>-->
<!--                   </a-collapse-panel>-->
<!--                   <a-collapse-panel key="2" header="必选外语课" >-->
<!--                       <p></p>-->
<!--                   </a-collapse-panel>-->
<!--               </a-collapse>-->
<!--           </div>-->
           <a-card class="right">
               <a-row style="height: 40px;background-color:#6Db5a7;
                        color: white;
                        margin-left: 50px;
                        border-radius: 5px;
                        border:1px solid black;">
                   <a-col><span style="float: left;padding: 10px;">{{this.stuName}}</span></a-col>
                   <a-col><span style="font-size: 20px;float: left;margin-left:150px;padding-top: 5px" >{{this.termName}}</span></a-col>
               </a-row>
               <a-row class="buttons" style="margin-top: 10px">
                   <a-col :span="4"><button style="background-color: #ffcc00;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px" @click="warning">规则说明</button></a-col>
                   <a-col ><button style="background-color: #1abc9c;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float:right;
                        width: 110px"  @click="saveChoose">保存</button></a-col>
               </a-row>
               <template v-for="(data,index) in allData">
                   <a-row style="float: left;margin-left: 100px;margin-top: 50px"><h3>选中其中{{data.coverRule}}科，{{data.mustSubject}}必选</h3></a-row>
                   <a-row style="margin-top:80px;">
                       <a-col :span="4"><h3>{{data.name}}:</h3></a-col>
                       <template style="margin-left: 200px;margin-top: 30px" >
                           <a-checkbox-group v-model="Course"  @change="chooseCourse">
                               <a-checkbox v-for="(sub,index2) in data.subChildIds" :value="sub.subChildId">
                                   {{sub.subChildName}}
                               </a-checkbox>
                           </a-checkbox-group>
                       </template>
                   </a-row>
               </template>
           </a-card>
       </div>
   </div>
</template>
<script>
    import { message } from 'ant-design-vue';
    export default {
        data() {
            return {
                planId: "",
                information: "",
                termName: "",
                stuName: "",
                loading: false,
                Options: [],
                form: {},
                allData: [],
                teachId: "",
                teachDatas: [],
                chooseId:[],
                isChoosen:[],
                Course:[],
            };
        },
        //查看单个选课计划
        created() {
            this.chooseCourseInfo();
        },
        methods: {
            //开始选课查看
            async chooseCourseInfo() {
                let {data} = await this.$api.studentChooseCourse.startChoose.getCourseSelect();
                console.log(data);
               if(data.success==false){
                   message.info(data.message);
               }else{
                   if (data.result.stuName === null) {
                       this.stuName = "无学生姓名"
                   } else {
                       this.stuName =data.result.stuName;
                   }
                   this.termName = data.result.termName;
                   this.allData = data.result.courseSelectDtos;
                   this.planId=data.result.courseSelectDtos[0].planId;
                   console.log(this.allData);
                   let list=[...this.allData];
                   console.log(list);
                   list.forEach(item=>{
                       let listSub=[...item.subChildIds];
                       item.mustSubject="";
                       listSub.forEach(itemSub=>{
                           if(itemSub.ischoosen==1){
                                this.Course.push(itemSub.subChildId);
                           }
                           this.isChoosen.push(itemSub.ischoosen);
                           // console.log(this.isChoosen);
                           if(itemSub.isable===1){
                               if(item.mustSubject===""){
                                   item.mustSubject=itemSub.subChildName;
                               }else{
                                   item.mustSubject=item.mustSubject+","+itemSub.subChildName;
                               }
                           }else{
                               item.mustSubject="无"
                           }
                       })
                   })
                   console.log(this.allData);
                   this.getInfo(this.planId);
                   console.log(this.Course);
               }
            },
            //规则查看
            async getInfo(planId) {
                let {data} = await this.$api.studentChooseCourse.startChoose.getTips({planId: planId});
                // console.log(data);
                if (data && data.success) {
                    this.information = data.result;
                } else {
                    this.information = data.message;
                }
            },
            // //课程选择
            chooseCourse(checkValue){
                console.log(checkValue);
                console.log(this.Course);
            //   console.log(id);
            //   console.log(index);
            //   this.chooseId.push(index);
            //   console.log(this.chooseId);
            },
            //规则说明查看
            warning() {
                this.$info({
                    title: '规则说明',
                    content: this.information,
                });
            },
            //保存
            saveChoose() {
                this.save();
            },
            async save() {
                let pushData = [];
                this.Course.forEach(item=>{
                    console.log(item);
                    let addData={
                        subChildId:item,
                    }
                    pushData.push(addData);
                })
                console.log(pushData)
                let adddata={
                    planId:this.planId,
                    subChildIds:pushData,
                }
                console.log(adddata);
                let {data}=await this.$api.studentChooseCourse.startChoose.alterCourseSelect(adddata);
                console.log(data);
                 if(data&&data.success){
                    message.info('保存成功');
                    this.chooseCourseInfo();
                 }else{
                     message.info(data.message);
                 }
            },
        },
    };
</script>

<style lang="less" scoped>
    .title{
        width: 100%;
        background-color: white;
        height:50px;
        margin: 20px 0px 10px 0px;
        padding-left: 25px;
        padding-top: 15px;
        vertical-align: top;
        border-radius: 5px;
    }
    .right{
        border-radius: 5px;
        height:900px;
    }
</style>

