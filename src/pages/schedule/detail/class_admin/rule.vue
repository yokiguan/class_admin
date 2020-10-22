<template>
    <div>
        <!-- title-->
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
                        width: 100px">返回</button>
                </a-col>
            </a-row>
        </div>
        <!-- /content_title -->
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
            <div class="table">
                <template>
                    <a-descriptions bordered>
                        <a-descriptions-item label="学习时间规则" >
                           <a-table  :columns="column1"
                                     :data-source="studyTimeData"
                                     :pagination="false"
                                     :bordered="true"
                                     :cell-class-name="addClass">
                               <a-form-item slot="subjects" >
                                   <a-select v-decorator="['subject',{ rules: [{ required: true, message: 'Please select your subject!' }] },]"
                                             placeholder="语文"
                                           @change="handleSelectChange"
                                             style="width:100px">
                                       <a-select-option value="chinese">
                                           语文
                                       </a-select-option>
                                       <a-select-option value="metting">
                                           班会
                                       </a-select-option>
                                       <a-select-option value="country">
                                           升国旗
                                       </a-select-option>
                                   </a-select>
                               </a-form-item>
                                <div slot="timeSetting1" slot-scope="time1">
                                    <span style="float: left">{{time1}}</span>
                                    <a-icon @click="add_time" type="edit"  style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                               <div slot="action">
                                   <span  style="color:blue;float:left">删除</span>
                                   <span  style="color:blue;float:right">保存</span>
                               </div>
                           </a-table>
                            <div style="
                    margin-top: 10px;
                    margin-bottom: -5px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;">
                                <a-icon type="plus" />
                                <span>
                                   添加规则
                                </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions bordered>
                        <a-descriptions-item label="教师时间规则">
                            <a-table  :columns="column2"
                                      :data-source="teacherTimeData"
                                      :pagination="false"
                                      :bordered="true"
                                      :cell-class-name="addClass">
                                <div slot="teachers" slot-scope="teacher">
                                    <span>{{teacher}}</span>
                                    <a-icon type="edit" @click="add_teacher" style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="timeSetting1" slot-scope="time1">
                                    <span style="float: left">{{time1}}</span>
                                    <a-icon type="edit" @click="add_time" style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="action">
                                    <span  style="color:blue;float:left">删除</span>
                                    <span  style="color:blue;float:right">保存</span>
                                </div>
                            </a-table>
                            <div style="
                    margin-top: 10px;
                    margin-bottom: -5px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;">
                                <a-icon type="plus" />
                                <span>
                                   添加规则
                                </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions bordered>
                        <a-descriptions-item label="班级时间规则">
                            <a-table  :columns="column3"
                                      :data-source="classTimeData"
                                      :pagination="false"
                                      :bordered="true"
                                      :cell-class-name="addClass">
                                <a-form-item slot="class" >
                                    <a-select v-decorator="['subject',{ rules: [{ required: true, message: 'Please select your class!' }] },]"
                                              placeholder="高一1班"
                                              @change="handleSelectChange"
                                              style="width:100px">
                                        <a-select-option value="1_class">
                                            高一1班
                                        </a-select-option>
                                        <a-select-option value="2_class">
                                            高一2班
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                                <div slot="timeSetting1" slot-scope="time1">
                                    <span style="float: left">{{time1}}</span>
                                    <a-icon type="edit" @click="add_time" style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <a-form-item slot="subjects" >
                                    <a-select v-decorator="['subject',{ rules: [{ required: true, message: 'Please select your subject' }] },]"
                                              placeholder="语文"
                                              @change="handleSelectChange"
                                              style="width:250px">
                                        <a-select-option value="chinese">
                                            语文
                                        </a-select-option>
                                        <a-select-option value="math">
                                            数学
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                                <div slot="action">
                                    <span  style="color:blue;float:left">删除</span>
                                    <span  style="color:blue;float:right">保存</span>
                                </div>

                            </a-table>
                            <div style="
                    margin-top: 10px;
                    margin-bottom: -5px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;">
                                <a-icon type="plus" />
                                <span>
                                   添加规则
                                </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions bordered>
                        <a-descriptions-item label="禁止相邻">
                            <a-table  :columns="column4"
                                      :data-source="banData"
                                      :pagination="false"
                                      :bordered="true"
                                      :cell-class-name="addClass">
                                <a-form-item slot="classTimes" >
                                    <a-input placeholder="1" style="width: 100px"/>
                                </a-form-item>
                                <a-form-item slot="subjects" >
                                    <a-select v-decorator="['subject',{ rules: [{ required: true, message: 'Please select your subject' }] },]"
                                              placeholder="语文"
                                              @change="handleSelectChange"
                                              style="width:250px">
                                        <a-select-option value="chinese">
                                            语文
                                        </a-select-option>
                                        <a-select-option value="math">
                                            数学
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                                <div slot="action">
                                    <span  style="color:blue;float:left">删除</span>
                                    <span  style="color:blue;float:right">保存</span>
                                </div>
                            </a-table>
                            <div style="
                    margin-top: 10px;
                    margin-bottom: -5px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;">
                                <a-icon type="plus" />
                                <span>
                                   添加规则
                                </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions bordered>
                        <a-descriptions-item label="单双周课程">
                            <a-table  :columns="column5"
                                      :data-source="weekData"
                                      :pagination="false"
                                      :bordered="true"
                                      :cell-class-name="addClass">
                                <a-form-item slot="weekTimes" >
                                    <a-input placeholder="2" style="width: 100px"/>
                                </a-form-item>
                                <a-form-item slot="subjects" >
                                    <a-select v-decorator="['subject',{ rules: [{ required: true, message: 'Please select your subject' }] },]"
                                              placeholder="音乐"
                                              @change="handleSelectChange"
                                              style="width:250px">
                                        <a-select-option value="music">
                                            音乐
                                        </a-select-option>
                                        <a-select-option value="art">
                                            美术
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                                <div slot="action">
                                    <span  style="color:blue;float:left">删除</span>
                                    <span  style="color:blue;float:right">保存</span>
                                </div>
                            </a-table>
                            <div style="
                    margin-top: 10px;
                    margin-bottom: -5px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;">
                                <a-icon type="plus" />
                                <span>
                                   添加规则
                                </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                </template>
                <button style="background-color: #00ccff;
                        margin-top:100px;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 200px">
                    下一步</button>
                <create-modal
                                             :visible="visible"
                                             :loading="loading"
                                             @modalClosed="closed"
                                             @modalSubmit="handleSubmit1">
                <div slot="content">
                    <div class="model1_head">
                        <div style="height: 52px;
                            border-radius: 5px;
                             margin-top: -23px;
                             margin-left: -24px;
                            width: 520px;background-color: #e4e4e4">
                            <span style="margin: 0px 0px 50px 0px;
                                  padding: 20px 25px;
                                  font-size: 1.0rem;
                                  vertical-align: top;">选择时间段</span>
                        </div>
                        <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}" @submit="handleSubmit1">
                            <a-form-item label="类型">
                                <a-select
                                        v-decorator="[
                                            'type',
                                            { rules: [{ required: true, message: '不使用/优先使用/必须使用' }] }, ]"
                                        placeholder="不使用/优先使用/必须使用"
                                        @change="handleSelectChange">
                                    <a-select-option value="1">
                                        不使用
                                    </a-select-option>
                                    <a-select-option value="2">
                                        优先使用
                                    </a-select-option>
                                    <a-select-option value="3">
                                        必须使用
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                        <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}" @submit="handleSubmit2">
                            <a-form-item label="选择天">
                                <a-select
                                        v-decorator="[
                                            'type',
                                            { rules: [{ required: true, message: '星期一' }] }, ]"
                                        placeholder="星期一"
                                        @change="handleSelectChange">
                                    <a-select-option value="one">
                                        星期一
                                    </a-select-option>
                                    <a-select-option value="two">
                                        星期二
                                    </a-select-option>
                                    <a-select-option value="three">
                                        星期三
                                    </a-select-option>
                                    <a-select-option value="four">
                                        星期四
                                    </a-select-option>
                                    <a-select-option value="five">
                                        星期五
                                    </a-select-option>
                                    <a-select-option value="six">
                                        星期六
                                    </a-select-option>
                                    <a-select-option value="seven">
                                        星期日
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                    </div>
                    <div class="model1_content">
                        <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}" @submit="handleSubmit1">
                            <a-form-item label="选择节">
                                <a-checkbox-group @change="onChange">
                                    <a-row>
                                        <a-col :span="6">
                                            <a-checkbox value="A">上午1</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="B">上午2</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="C">上午3</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="D">上午4</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="E">下午1</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="F">下午2</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="G">下午3</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="H">下午4</a-checkbox>
                                        </a-col>
                                    </a-row>
                                </a-checkbox-group>
                            </a-form-item>
                        </a-form>
                    </div>
                </div>
            </create-modal>
                <create-modal :visible="visibling"
                              :loading="load"
                              @modalClosed="close"
                              @modalSubmit="handleSubmit2">
                    <div slot="content">
                        <div class="model1_head">
                            <div style="height: 52px;
                            border-radius: 5px;
                             margin-top: -23px;
                             margin-left: -24px;
                            width: 520px;background-color: #e4e4e4">
                            <h3 style="margin: 0px 0px 50px 0px;
                                  padding: 15px 20px;
                                  font-size: 1.0rem;
                                  vertical-align: top;">任课老师</h3>
                            </div>
                        </div>
                        <div class="model2_content">
                            <template>
                                <a-form @submit="handleSubmit">
                                    <a-row>
                                        <a-col style="width: 120px" :span="3
">
                                            <a-form-item>
                                                <a-select
                                                        v-decorator="[ { rules: [{ required: true, message: 'Please select your class' }] },]"
                                                        placeholder="高一"
                                                        @change="handleSelectChange2">
                                                    <a-select-option value="one">
                                                        高一
                                                    </a-select-option>
                                                    <a-select-option value="two">
                                                        高二
                                                    </a-select-option>
                                                    <a-select-option value="three">
                                                        高三
                                                    </a-select-option>
                                                </a-select>
                                            </a-form-item>
                                        </a-col>
                                        <a-col style="width: 120px" :span="3">
                                            <a-form-item>
                                                <a-select
                                                        v-decorator="[{ rules: [{ required: true, message: 'Please select your subject!' }] },]"
                                                        placeholder="所有科目"
                                                        @change="handleSelectChange3">
                                                </a-select>
                                            </a-form-item>
                                        </a-col>
                                        <a-col style="width: 120px" :span="3">
                                            <a-form-item>
                                                <a-input placeholder="姓名" v-decorator="['note', { rules: [{ required: true, message: '姓名' }] }]"/>
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="3">
                                            <a-form-item>
                                                <a-button style="background-color: #8c8c8c;color:white;width:80px"  html-type="search">
                                                    查询
                                                </a-button>
                                            </a-form-item>
                                        </a-col>
                                    </a-row>
                                </a-form>
                            </template>
                        </div>

                    </div>
                </create-modal>
            </div>
        </div>

    </div>
</template>
<script>
   import CreateModal from "../../../../components/modal/CreateModal";
    const column1=[
       {
           title:'学科名称',
           key:'subject',
           dataIndex:'subject',
           scopedSlots: { customRender: 'subjects' },
           width: '12%',
           align:'center',
       },
       {
           title:'时间设置',
           key:'time1',
           dataIndex:'time1',
           scopedSlots: { customRender: 'timeSetting1' },
           align: 'center',
           width:'76%'
       },
       {
           title:'操作',
           key:'opt1',
           dataIndex:'opt1',
           scopedSlots: { customRender: 'action' },
           width: '12%',
           align:'center',
       },
   ]
   const studyTimeData=[
       {
           time1:'必须星期一下午第4节',
       },
       {
           time1:'必须星期一下午第3节 必须星期一下午第4节',
       },
       {
           time1:'不能星期一下午第1节 不能星期一上午第二节 不能星期一上午第3节',
       },
   ]
   const column2=[
       {
           title:'教师',
           key:'teacher',
           dataIndex:'teacher',
           scopedSlots: { customRender: 'teachers' },
           width: '12%',
           align:'center',
       },
       {
           title:'时间设置',
           key:'time1',
           dataIndex:'time1',
           scopedSlots: { customRender: 'timeSetting1' },
           width: '76%',
           align:'center',
       },
       {
           title:'操作',
           key:'opt1',
           dataIndex:'opt1',
           scopedSlots: { customRender: 'action' },
           width: '12%',
           align:'center',
       },
   ]
   const teacherTimeData=[
       {
           teacher:'张凯元',
           time1:'必须星期一下午第4节',
       },
   ]
   const column3=[
       {
           title:'班级',
           key:'class',
           dataIndex:'class',
           scopedSlots: { customRender: 'class' },
           width: '12%',
           align:'center',
       },
       {
           title:'学科名称',
           key:'subject',
           dataIndex:'subject',
           scopedSlots: { customRender: 'subjects' },
           width: '38%',
           align:'center',
       },
       {
           title:'时间设置',
           key:'time1',
           dataIndex:'time1',
           scopedSlots: { customRender: 'timeSetting1' },
           width: '38%',
           align:'center',
       },
       {
           title:'操作',
           key:'opt1',
           dataIndex:'opt1',
           scopedSlots: { customRender: 'action' },
           width: '12%',
           align:'center',
       },
   ]
   const classTimeData=[
       {
           time1:'必须星期一下午第4节',
       },
       {
           time1:'必须星期一下午第3节 必须星期一下午第4节',
       },
   ]
   const column4=[
       {
           title:'连堂次数',
           key:'classTimes',
           dataIndex:'classTimes',
           scopedSlots: { customRender: 'classTimes' },
           width: '12%',
           align:'center',
       },
       {
           title:'科目一',
           key:'subject',
           dataIndex:'subject',
           scopedSlots: { customRender: 'subjects' },
           width: '38%',
           align:'center',
       },
       {
           title:'科目二',
           key:'subject',
           dataIndex:'subject',
           scopedSlots: { customRender: 'subjects' },
           width: '38%',
           align:'center',
       },
       {
           title:'操作',
           key:'opt1',
           dataIndex:'opt1',
           scopedSlots: { customRender: 'action' },
           width: '12%',
           align:'center',
       },
   ]
   const banData=[
       {
       },
   ]
   const column5=[
       {
           title:'每周上课次数',
           key:'weekTimes',
           dataIndex:'weekTimes',
           scopedSlots: { customRender: 'weekTimes' },
           width: '12%',
           align:'center',
       },
       {
           title:'单周课程',
           key:'subject',
           dataIndex:'subject',
           scopedSlots: { customRender: 'subjects' },
           width: '38%',
           align:'center',
       },
       {
           title:'双周课程',
           key:'subject',
           dataIndex:'subject',
           scopedSlots: { customRender: 'subjects' },
           width: '38%',
           align:'center',
       },
       {
           title:'操作',
           key:'opt1',
           dataIndex:'opt1',
           scopedSlots: { customRender: 'action' },
           width: '12%',
           align:'center',
       },
   ]
   const weekData=[
       {
       },
   ]
    export default {
        components: {CreateModal},
        data() {
            return {
                column1,
                studyTimeData,
                column2,
                teacherTimeData,
                column3,
                classTimeData,
                column4,
                banData,
                column5,
                weekData,
                visible: false,
                visibling: false,
                // form: this.$form.createForm(this, { name: 'coordinated' }),
            };
        },
        methods:{
            handleSelectChange(value) {
                console.log(value);
                // this.form.setFieldsValue({
                //     note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
                // });
            },
            // addClass(row,column,rowIndex,columnIndex){
            //     if(columnIndex===0){
            //         return 'subjectClass'
            //     }
            // },
            add_time() {
                this.visible = true;
            },
            add_teacher() {
                this.visibling= true;
            },
            change: function () {
                this.visible = true;
                this.visibling=true;
            },
            closed: function () {
                this.visible = false
                this.loading = false
            },
            close: function () {
                this.visibing = false
                this.load= false
            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                    }
                });
            },
            handleSelectChange2(value) {
                console.log(value);
                // this.form.setFieldsValue({
                //     note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
                // });
            },
            handleSelectChange3(value) {
                console.log(value);
                // this.form.setFieldsValue({
                //     note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
                // });
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
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
        text-align: center;
        height:1600px;
        width: 100%;
    }
    .buttons{
        margin:5px 5px 20px 5px;
        padding:2px 4px;
    }
    .buttons button{
        background-color:#e4e4e4;
        color:black;
    }
    .time1{
        width: 100%;
        height: 30px;
        padding-top:5px;
        background-color: #d9d9d9;
    }
    .table{
        width: 95%;
    }
</style>
