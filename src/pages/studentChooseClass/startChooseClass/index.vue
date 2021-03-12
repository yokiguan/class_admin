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
               <template>
                   <a-row style="float: left;margin-left: 100px;margin-top: 50px"><h3>选中其中{{this.mustData.coverRule}}科，{{ this.mustChooseCourse}}必选</h3></a-row>
                   <a-row style="margin-top:80px;">
                       <a-col :span="4"><h3>{{this.mustData.name}}:</h3></a-col>
                       <a-col style="margin-left: 120px">
                           <a-table style="width: 50%;" :rowKey="'this.mustDataSource.subChildId'" :columns="column"
                                    :row-selection="{ selectedRowKeys: selectedMustRowKeys, onChange: onSelectMustChange }"
                                    :selectedRows="rowMustSelection"
                                    :data-source="mustDataSource"
                                    :pagination="false"
                                    :showHeader="false" bordered>
                               <template slot="chooseTeacher" style="color: blue;" slot-scope="text,record">
                                   <span style="float:left">{{record.teacherName}}</span>
                                   <div style="color: blue;margin-left: 100px" @click="addTeacher(record.subChildId)">
                                       <a-icon type="plus" />
                                       <span>编辑老师</span>
                                   </div>
                               </template>
                           </a-table>
                       </a-col>
                   </a-row>
               </template>
<!--               <template v-if="chooseCourse">-->
<!--                   <a-row style="float: left;margin-left: 100px;margin-top: 50px"><h3>选中其中{{this.chooseData.coverRule}}科，{{this.ChooseCourse}}必选</h3></a-row>-->
<!--                   <a-row>-->
<!--                       <a-col :span="4"><h3>{{this.chooseData.name}}:</h3></a-col>-->
<!--                       <a-col style="margin-left: 120px">-->
<!--                           <a-table style="width: 50%" :rowKey="'this.chooseDataSource.subChildId'" :columns="column"-->
<!--                                    :row-selection="{ selectedRowKeys: selectedChooseRowKeys, onChange: onSelectChooseChange }"-->
<!--                                    :selectedRows="rowChooseSelection"-->
<!--                                    :data-source="chooseDataSource"-->
<!--                                    :pagination="false"-->
<!--                                    :showHeader="false"-->
<!--                                    bordered>-->
<!--                               &lt;!&ndash;                           <template slot="chooseTeacher" style="color: blue;" slot-scope="text,record">&ndash;&gt;-->
<!--                               &lt;!&ndash;                               <span style="float:left">{{record.teacherName}}</span>&ndash;&gt;-->
<!--                               &lt;!&ndash;                               <div style="color: blue;margin-left: 100px" @click="addTeacher(record.subChildId)">&ndash;&gt;-->
<!--                               &lt;!&ndash;                                   <a-icon type="plus" />&ndash;&gt;-->
<!--                               &lt;!&ndash;                                   <span>编辑老师</span>&ndash;&gt;-->
<!--                               &lt;!&ndash;                               </div>&ndash;&gt;-->
<!--                               &lt;!&ndash;                           </template>&ndash;&gt;-->
<!--                           </a-table>-->
<!--                       </a-col>-->
<!--                   </a-row>-->
<!--               </template>-->
           </a-card>
       </div>
<!--   选择老师弹框-->
<!--       <a-modal :visible='chooseTeacherVisit'-->
<!--                title="选择老师"-->
<!--                :closable="false">-->
<!--           <template slot="footer">-->
<!--               <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>-->
<!--               <a-button key="back" @click="handleCancel">取消</a-button>-->
<!--           </template>-->
<!--           <a-form-model style="margin-top: 30px" :form="form"  :label-col="{ span:4}" :wrapper-col="{ span:30}">-->
<!--               <a-form-model-item label="老师(单选)">-->
<!--                   <a-form-item >-->
<!--                       <a-radio-group v-model="form.checkValue" :options="Options" @change="changeTeacher">-->
<!--                       </a-radio-group>-->
<!--                   </a-form-item>-->
<!--               </a-form-model-item>-->
<!--           </a-form-model>-->
<!--       </a-modal>-->

   </div>
</template>
<script>
    import { message } from 'ant-design-vue';
    import Templet from "../../basic/templet/index";
    // const teacherColumn=[
    //     {
    //         title:'课程名',
    //         dataIndex:'subChildName',
    //         align:'center'
    //     }, {
    //         title:'老师',
    //         dataIndex:'teacher',
    //         align:'center',
    //         scopedSlots: { customRender: 'chooseTeacher' },
    //     },
    // ];
    const noColumn=[
        {
            title:'课程名',
            dataIndex:'subChildName',
            align:'center'
        }
    ];
    export default {
        data() {
            return {
                column: noColumn,
                // teacherColumn,
                mustDataSource: [],
                chooseDataSource: [],
                mustCourse:false,
                chooseCourse:false,
                planId: "",
                selectedMustRowKeys: [],
                rowMustSelection: [],
                selectedChooseRowKeys: [],
                rowChooseSelection: [],
                mustData: [],
                chooseData: [],
                mustChooseCourse: "",
                ChooseCourse: "",
                information: "",
                termName: "",
                stuName: "",
                chooseTeacherVisit: false,
                loading: false,
                Options: [],
                form: {},
                allData: [],
                teachId: "",
                teachDatas: [],
            };
        },
        //查看单个选课计划
        created() {
            this.chooseCourseInfo();
        },
        methods: {
            //开始选课查看
            async chooseCourseInfo() {
                let {data: {result, success}} = await this.$api.studentChooseCourse.startChoose.getCourseSelect();
                console.log(result);
                if (result.stuName === null) {
                    this.stuName = "无学生姓名"
                } else {
                    this.stuName = result.stuName;
                }
                // result.type == 1 ? this.column = teacherColumn : this.column = noColumn;
                this.termName = result.termName;
                this.allData = result.courseSelectDtos;
                this.allData.forEach(item=>{
                    this.mustData = item;
                    this.planId = item.planId;
                })
                // console.log(this.allData);

                // if(this.allData[0].length===3){
                //     this.mustCourse=true;
                // }else if(this.allData[0].length===6){
                //     this.ChooseCourse=true;
                // }
                // console.log('必修课数据',this.mustData);
                this.mustDataSource = this.mustData.subChildIds
                // console.log(this.mustDataSource);
                // //必选课
                for (let i = 0; i < this.mustDataSource.length; i++) {
                    if (this.mustDataSource[i].isable == 1) {
                        if (this.mustChooseCourse == "") {
                            this.mustChooseCourse = this.mustDataSource[i].subChildName
                        } else {
                            this.mustChooseCourse = this.mustChooseCourse + ',' + this.mustDataSource[i].subChildName
                        }
                    } else {
                        this.mustChooseCourse = "无";
                    }
                }
                // // console.log(this.mustChooseCourse);
                // this.chooseData = this.allData[1];
                // if(this.chooseData>0){
                //     this.ChooseCours=true;
                // }
                // // console.log('选修课数据',this.chooseData);
                // this.chooseDataSource = this.chooseData.subChildIds;
                // // console.log(this.chooseDataSource);
                // //必选课
                // for (let i = 0; i < this.chooseDataSource.length; i++) {
                //     this.chooseDataSource[i].isable == 1 ? this.ChooseCourse == "" ? this.ChooseCourse = this.chooseDataSource[i].subChildName : this.ChooseCourse = this.ChooseCourse + ',' + this.chooseDataSource[i].subChildName : this.ChooseCourse = "无"
                // }
                this.getInfo(this.planId);
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
            //选择必修课
            onSelectMustChange(selectedRowKeys, selectedRows) {
                this.selectedMustRowKeys = selectedRowKeys;
                this.rowMustSelection = selectedRows
                console.log(this.selectedMustRowKeys);
                console.log(this.rowMustSelection);
            },
            //选择选修课
            onSelectChooseChange(selectedRowKeys, selectedRows) {
                this.selectedChooseRowKeys = selectedRowKeys;
                this.rowChooseSelection = selectedRows
                console.log(this.selectedChooseRowKeys);
                console.log(this.rowChooseSelection);
            },
            //规则说明查看
            warning() {
                this.$info({
                    title: '规则说明',
                    content: this.information,
                });
            },
            // //添加老师
            // addTeacher(id) {
            //     this.chooseTeacherVisit = true;
            //     this.lookInfoTeacher(id);
            //     this.teachId = id;
            // },
            // async lookInfoTeacher(id) {
            //     let {data: {result, success}} = await this.$api.studentChooseCourse.startChoose.getCourseStatus({
            //         planId: this.planId,
            //         subId: id
            //     });
            //     console.log(result);
            //     this.teachDatas = result;
            //     for (let i = 0; i < result.length; i++) {
            //         let numberTree = {};
            //         numberTree.label = result[i].teacherName + "\n" + "剩余名额" + result[i].remainNum + "人";
            //         numberTree.value = result[i].teacherId;
            //         this.Options.push(numberTree);
            //     }
            //     console.log(this.Options);
            // },
            // //选择老师
            // changeTeacher() {
            //     // console.log(this.teachId);
            //     // console.log(this.form.checkValue);
            //     // console.log(this.teachDatas);
            //     for (let i = 0; i < this.allData.length; i++) {
            //         let subChild = this.allData[i].subChildIds;
            //         for (let j = 0; j < subChild.length; j++) {
            //             if (subChild[j].subChildId == this.teachId) {
            //                 for (let k = 0; k < this.teachDatas.length; k++) {
            //                     if (this.form.checkValue === this.teachDatas[k].teacherId) {
            //                         subChild[j].teacherName = this.teachDatas[k].teacherName;
            //                     }
            //                 }
            //                 subChild[j].teacherId = this.form.checkValue;
            //             }
            //         }
            //         console.log(subChild);
            //     }
            // },
            // //保存选择老师
            // handleOk() {
            //     this.chooseTeacherVisit = false;
            // },
            // //关闭选择老师
            // handleCancel() {
            //     this.chooseTeacherVisit = false;
            // },
            //保存
            saveChoose() {
                this.save();
            },
            async save() {
                let pushData = [];
                let mustList=[...this.rowMustSelection];
                mustList.forEach(item=>{
                    console.log(item);
                    let addData={
                        // teacherId:item.teacherId,
                        subChildId:item.subChildId,
                    }
                    pushData.push(addData);
                })
                console.log(pushData)
                // let chooseList=[...this.rowChooseSelection];
                // chooseList.forEach(item=>{
                //     console.log(item);
                //     let addData={
                //         // teacherId:item.teacherId,
                //         subChildId:item.subChildId,
                //     }
                //     pushData.push(addData);
                // })
                // console.log(pushData)
                let adddata={
                    planId:this.planId,
                    // thread:"20",
                    subChildIds:pushData,
                }
                console.log(adddata);
                let {data}=await this.$api.studentChooseCourse.startChoose.alterCourseSelect(adddata);
                console.log(data);
                if(data&&data.success){
                    alert('保存成功');
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
    /*.left{*/
    /*    width: 300px;*/
    /*    height: 900px;*/
    /*    background-color: white;*/
    /*    margin: 0px 0px 20px 0px;*/
    /*    padding: 20px 25px;*/
    /*    border-radius: 10px;*/
    /*}*/
    .right{
        border-radius: 5px;
        /*margin-top: -920px;*/
        /*margin-left: 320px;*/
        height:900px;
    }
</style>

