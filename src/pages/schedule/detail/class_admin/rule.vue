<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">行政班排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">规则设置</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                <a-col><button style="background-color: blue; color: white;height: 40px; border: none;border-radius: 5px;
                        float: right;width: 100px" @click="back">返回</button>
                </a-col>
            </a-row>
        </div>
        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="subjectSetting" >学科设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="classSetting">班级设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="ruleSetting">规则设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <div class="table">
                <template>
                    <a-descriptions bordered>
                        <a-descriptions-item label="学科时间规则" >
                            <a-table  :rowKey="'ids'"
                                      :columns="column1"
                                      :data-source="studyTimeData"
                                      :pagination="false"
                                      :bordered="true">
                                <a-form-item slot="subjects" slot-scope="text" >
                                    <a-select placeholder="语文" style="width:100px" :default-value="text">
                                        <a-select-option value="chinese">语文</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <div slot="timeSetting1" slot-scope="time1,record1">
                                    <span style="float: left">{{time1}}</span>
                                    <a-icon  type="edit" @click="timeRegularSetting"  style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="action" slot-scope="text,record" >
                                    <a-popconfirm
                                            v-if="studyTimeData.length"
                                            title="确认删除?"
                                            @confirm="() => subjectTimeDelete(record.id)">
                                        <a href="javascript:;" style="color:blue;float:left">删除</a>
                                    </a-popconfirm>
                                    <span  style="color:blue;float:right" @click="subjectTimeSave">保存</span>
                                </div>
                            </a-table>
                            <div style="margin-top: 10px;margin-bottom: -5px;float: left;font-size: 1.0rem;color: blue;"  class="editable-add-btn"  @click="addSubjectTimeRegular">
                                <a-icon type="plus" />
                                <span>添加规则 </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions bordered>
                        <a-descriptions-item label="教师时间规则">
                            <a-table :rowkey="'id'"
                                      :columns="column2"
                                      :data-source="teacherTimeData"
                                      :pagination="false"
                                      :bordered="true">
                                <div slot="teachers" slot-scope="teacher,record1">
                                    <span>{{teacher}}</span>
                                    <a-icon type="edit" @click="addTeacher"  style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="timeSetting1" slot-scope="time2">
                                    <span style="float: left">{{time2}}</span>
                                    <a-icon type="edit" @click="timeRegularSetting" style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="action" slot-scope="text,record">
                                    <a-popconfirm
                                            v-if="teacherTimeData.length"
                                            title="确认删除?"
                                            @confirm="() => teacherTimeDelete(record.id)">
                                        <a href="javascript:;" style="color:blue;float:left">删除</a>
                                    </a-popconfirm>
                                    <span  style="color:blue;float:right" @click="teacherTimeSave">保存</span>
                                </div>
                            </a-table>
                            <div style=" margin-top: 10px;margin-bottom: -5px; float: left; font-size: 1.0rem;color: blue;" @click="addTeacherTimeRegular">
                                <a-icon type="plus" />
                                <span> 添加规则</span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions bordered>
                        <a-descriptions-item label="班级时间规则">
                            <a-table  :columns="column3"
                                      :data-source="classTimeData"
                                      :pagination="false"
                                      :rowKey="'classTimeKey'"
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
                                <div slot="timeSetting1" slot-scope="time1,record1,index1">
                                    <span style="float: left">{{time1}}</span>
                                    <a-icon type="edit" @click="timeRegularSetting" style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
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
                                    <span  style="color:blue;float:left" @click="classTimeDelete">删除</span>
                                    <span  style="color:blue;float:right" @click="classTimeSave">保存</span>
                                </div>
                            </a-table>
                            <div style="
                    margin-top: 10px;
                    margin-bottom: -5px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;" @click="addClassTimeRegular">
                                <a-icon type="plus" />
                                <span> 添加规则 </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions bordered>
                        <a-descriptions-item label="禁止相邻">
                            <a-table :rowKey="'banTimeKey'"
                                    :columns="column4"
                                      :data-source="banData"
                                      :pagination="false"
                                      :bordered="true">
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
                                    <span  style="color:blue;float:left" @click="banTimeDelete">删除</span>
                                    <span  style="color:blue;float:right" @click="banTimeSave">保存</span>
                                </div>
                            </a-table>
                            <div style="
                    margin-top: 10px;
                    margin-bottom: -5px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;" @click="addBanRegular">
                                <a-icon type="plus" />
                                <span> 添加规则 </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions bordered>
                        <a-descriptions-item label="单双周课程">
                            <a-table :rowKey="'weekTimeKey'"
                                    :columns="column5"
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
                                    <span  style="color:blue;float:left" @click="weekTimeDelete">删除</span>
                                    <span  style="color:blue;float:right" @click="weekTimeSave">保存</span>
                                </div>
                            </a-table>
                            <div style="
                    margin-top: 10px;
                    margin-bottom: -5px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;" @click="addWeekRegular">
                                <a-icon type="plus" />
                                <span>添加规则</span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                </template>
                <button style="background-color: #00ccff;margin-top:100px; color: white;height: 40px;border: none;
                border-radius: 5px; width: 200px" @click="Next" >下一步</button>
            </div>
        </div>
<!--        添加时间规则-->
        <a-modal :visible='timeRegularVisit'
                width="600px"
                :closable="false"
                 title="选择时间段"
                on-ok="handleOk">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
                    保存
                </a-button>
                <a-button key="back" @click="handleCancel">
                    取消
                </a-button>
            </template>
            <div class="model1_head">
                <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}" @submit="handleSubmit">
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
        </a-modal>
<!--        添加老师-->
        <a-modal :visible='teacherVisit'
                 title="任课老师"
                 width="1000px"
                 :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <a-card>
                <a-form-model :form="form" layout="horizontal">
                    <a-row>
                        <a-col :md="6" :sm="24">
                            <a-form-model-item label="年级" :labelCol="{ span: 3 }" :wrapperCol="{ span: 15, offset: 1 }">
                                <a-select :value="this.gradeName" disabled>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-model-item label="科目：" :labelCol="{ span: 3 }" :wrapperCol="{ span: 15, offset: 1 }">
                                <a-select placeholder="科目" v-model="form.subject" @change="chooseSubject">
                                    <a-select-option v-for="(subject,index) in this.subject" :key="index" :value="subject">
                                        {{subject}}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-model-item label="姓名：" :labelCol="{ span: 3 }" :wrapperCol="{ span: 15, offset: 1 }">
                                <a-input-search placeholder="姓名" v-model="form.teacherName" @search="onSearch"/>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-table :columns="editColumn"
                                 :data-source="editData"
                                 :pagination="false"
                                 :bordered="true" style="width: 600px;margin-left: 100px;margin-bottom: 100px">
                            <a-radio slot="editCheck"></a-radio>
                        </a-table>
                    </a-row>
                </a-form-model>
            </a-card>
        </a-modal>
    </div>
</template>
<script>
    const column1=[
        {
        title:'',
        dataIndex:'id',
        align:'center',
        width:'5%',
        customRender: function(t, r, index) {
            return parseInt(index) + 1
        },
    },
        {
            title:'学科名称',
            dataIndex:'subName',
            scopedSlots: { customRender: 'subjects' },
            width: '12%',
            align:'center',
        },
        {
            title:'时间设置',
            dataIndex:'time1',
            scopedSlots: { customRender: 'timeSetting1' },
            align: 'center',
            width:'71%'
        },
        {
            title:'操作',
            dataIndex:'opt1',
            scopedSlots: { customRender: 'action' },
            width: '12%',
            align:'center',
        },
    ]
    const activity=[
        {
            name:"上午",
            options:[0,1,2,3,4],
            value:"morning"
        }, {
            name:"下午",
            options:[0,1,2,3,4],
            value:"afternoon"
        }
    ]
    const column2=[
        {
            title:'',
            dataIndex:'id',
            align:'center',
            width:'5%',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            },
        },
        {
            title:'教师',
            dataIndex:'teacherName',
            scopedSlots: { customRender: 'teachers' },
            width: '12%',
            align:'center',
        },
        {
            title:'时间设置',
            dataIndex:'time1',
            scopedSlots: { customRender: 'timeSetting1' },
            width: '71%',
            align:'center',
        },
        {
            title:'操作',
            dataIndex:'opt1',
            scopedSlots: { customRender: 'action' },
            width: '12%',
            align:'center',
        },
    ]
    const column3=[
        {
            title:'',
            dataIndex:'id',
            align:'center',
            width:'5%',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            },
        },
        {
            title:'班级',
            dataIndex:'class',
            scopedSlots: { customRender: 'class' },
            width: '12%',
            align:'center',
        },
        {
            title:'学科名称',
            dataIndex:'subject',
            scopedSlots: { customRender: 'subjects' },
            width: '35%',
            align:'center',
        },
        {
            title:'时间设置',
            dataIndex:'time1',
            scopedSlots: { customRender: 'timeSetting1' },
            width: '36%',
            align:'center',
        },
        {
            title:'操作',
            dataIndex:'opt1',
            scopedSlots: { customRender: 'action' },
            width: '12%',
            align:'center',
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
            key:'subjectOne',
            dataIndex:'subjectOne',
            scopedSlots: { customRender: 'subjects' },
            width: '38%',
            align:'center',
        },
        {
            title:'科目二',
            key:'subjectTwo',
            dataIndex:'subjectTwo',
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
            banTimeKey:'1'
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
            key:'subjectOne',
            dataIndex:'subjectOne',
            scopedSlots: { customRender: 'subjects' },
            width: '38%',
            align:'center',
        },
        {
            title:'双周课程',
            key:'subjectDouble',
            dataIndex:'subjectDouble',
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
            weekTimeKey:'1',
        },
    ]
    const editColumn=[
        {
            title:' ',
            dataIndex:'editblank',
            align:'center',
            scopedSlots:{customRender:'editCheck'},
            width:'8%'
        },{
            title:'序号 ',
            dataIndex:'id',
            align:'center',
            width:'15%',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },{
            title:'姓名 ',
            dataIndex:'name',
            align:'center',
            width:'20%'
        },{
            title:'所教年级 ',
            dataIndex:'senior',
            align:'center',
            width:'25%'
        },{
            title:'所教学科 ',
            dataIndex:'subject',
            align:'center',
            width:'32%'
        },
    ]
    export default {
        data() {
            return {
                column1,
                studyTimeData:[],
                activity,
                subjectTimeCount:3,
                column2,
                teacherTimeData:[],
                column3,
                classTimeData:[],
                column4,
                banData,
                column5,
                weekData,
                editColumn,
                editData:[],
                timeRegularVisit: false,
                loading:false,
                teacherVisit:false,
                planData:"",
                planId:"",
                gradeName:"",
                subject:[],
                teacherName:[],
                treeData:[],
                form:{},
                subjectData:[],
            };
        },
        async created() {
            let queryString = (window.location.hash || " ").split('?')[1]
            let planId = (queryString || " ").split('=')[1]
            this.planId = planId;
            if (planId) {
                //获取单个选课计划的信息
                let {data: {result, success}} = await this.$api.schedule.plan.schedulegetInfo({planId})
                this.planData = result.name;
                console.log(result);
                this.gradeName=result.gradeName;
            }
            this.subjectTimeRule();
            this.teacherTimeRule();
            this.clsassTimeRule();
        },
        methods:{
            //学科时间规则查看
            async subjectTimeRule(){
                //获取学科时间规则
                let {data:subjectTimeRuleData}=await this.$api.schedule.adminClass.searchSubjectTimeRule({planId:"934e3a63aadc47d398da0d395ad41420"})
                let newData=[];
                newData=subjectTimeRuleData.result;
                // console.log(newData);
                let list=[...newData];
                list.forEach(item=>{
                    let timeDay="";
                    for(let i=1;i<8;i++){
                        if(item.timeDay==i){
                            timeDay="星期"+i;
                        }
                        // console.log(timeDay);
                    }
                    let time1=[];
                    //字符串转换为数组
                    let timeLesson=item.timeLesson.split(',');
                    // console.log(timeLesson);
                    for(let i=0;i<timeLesson.length;i++){
                        // console.log(timeLesson[i]-1);
                        if(timeLesson[i]<5){
                            time1=[...time1,"上午第"+timeLesson[i]+"节"];
                        }else{
                            let lesson=timeLesson[i]-4
                            time1=[...time1,"下午第"+lesson+"节"];
                        }
                        // console.log(time1);
                    }
                    let pushData={
                        id:item.id,
                        subName:item.subName,
                        time1:"必须"+timeDay+time1,
                    }
                    this.studyTimeData.push(pushData)
                })
                // console.log(this.studyTimeData);
            },
            //教师时间规则查看
            async teacherTimeRule(){
                //获取教室时间规则
                let {data:{result,success}}=await this.$api.schedule.adminClass.searchTeacherTimeRule({planId:"934e3a63aadc47d398da0d395ad41420"})
                console.log(result);
                let newData=[];
                newData=result;
                // console.log(newData);
                let list=[...newData];
                list.forEach(item=>{
                    let timeDay="";
                    for(let i=1;i<8;i++){
                        if(item.timeDay==i){
                            timeDay="星期"+i;
                        }
                        // console.log(timeDay);
                    }
                    let time1=[];
                    //字符串转换为数组
                    let timeLesson=item.timeLesson.split(',');
                    // console.log(timeLesson);
                    for(let i=0;i<timeLesson.length;i++){
                        // console.log(timeLesson[i]-1);
                        if(timeLesson[i]<5){
                            time1=[...time1,"上午第"+timeLesson[i]+"节"];
                        }else{
                            let lesson=timeLesson[i]-4
                            time1=[...time1,"下午第"+lesson+"节"];
                        }
                        // console.log(time1);
                    }
                    let pushData={
                        id:item.id,
                        teacherName:item.teacherName,
                        time1:"必须"+timeDay+time1,
                    }
                    this.teacherTimeData.push(pushData)
                })
                console.log(this.teacherTimeData);
            },
            //编辑教室弹框的数据获取
            async getData(){
                let {data:{result,success}}=await this.$api.basic.teacher.AdminGradeSubTec();
                console.log(result);
                //获取课程树
                for(let i=0;i<result.length;i++){
                    //第一层(级部）
                    let adminTree={};
                    adminTree.title=result[i].adminName;
                    adminTree.key=result[i].adminId;
                    if(result[i].adminGrades.length){
                        //第二层(年级）
                        adminTree.children=[];
                        for(let j=0;j<result[i].adminGrades.length;j++){
                            let gradeItem=result[i].adminGrades[j];
                            let childData={}
                            childData.key=gradeItem.gradeId;
                            childData.title=gradeItem.gradeName;
                            if(gradeItem.subSubjectDtos.length){
                                //第三层(主课程)
                                childData.children=[];
                                for(let k in gradeItem.subSubjectDtos){
                                    let mainCourseItem=gradeItem.subSubjectDtos[k];
                                    let mainCourse={};
                                    mainCourse.key=mainCourseItem.subId;
                                    mainCourse.title=mainCourseItem.subName;
                                    if(mainCourseItem.teacherDtos){
                                        //第四层（教师）
                                        mainCourse.children=[];
                                        for (let l in mainCourseItem.teacherDtos){
                                            let teacher={};
                                            teacher.key=result[i].adminId+gradeItem.gradeId+mainCourseItem.subId+mainCourseItem.teacherDtos[l].teacherId;
                                            teacher.title=mainCourseItem.teacherDtos[l].teacherName;
                                            mainCourse.children.push(teacher)
                                        }
                                    }
                                    childData.children.push(mainCourse)
                                }
                            }
                            adminTree.children.push(childData);
                        }
                    }
                    this.treeData.push(adminTree);
                    console.log(this.treeData);
                }
                this.subjectInfo();
            },
            //课程数据获取
            subjectInfo(){
                for(let i=0;i<this.treeData.length;i++){
                    //后期需要将下标0改为i
                    let adminData=this.treeData[0].children;
                    // console.log(adminData);
                    for(let j=0;j<adminData.length;j++){
                        // console.log(this.treeData[i].title+"序号"+"——————"+j,"年级"+adminData[j].title);
                        // console.log(this.gradeName);
                        if(this.gradeName===adminData[j].title){
                            this.subjectData=adminData[j].children;
                            console.log(this.subjectData);
                            let subjectDataTitle=[];
                            for(let z in this.subjectData){
                                subjectDataTitle=[...subjectDataTitle,this.subjectData[z].title];
                            }
                            // console.log(subjectDataTitle);
                            this.subject=subjectDataTitle;
                            // console.log(this.subject);
                        }
                    }
                }
                // console.log(this.subject);
            },
            //选择课程
            chooseSubject(){
                console.log(this.form.subject);
                console.log(this.subjectData);
                let teacherNameTitle=[];
                for(let i in this.subjectData){
                    if(this.form.subject==this.subjectData[i].title){
                        let teacherNameData=this.subjectData[i].children;
                        console.log(teacherNameData);
                        for(let j in teacherNameData){
                            teacherNameTitle=[...teacherNameTitle,teacherNameData[j].title];
                        }
                    }
                }
                this.teacherName=teacherNameTitle;
                // console.log(this.teacherName);
            },
            // 班级时间规则查看
            async clsassTimeRule(){
                //获取学科时间规则
                let {data:{result,success}}=await this.$api.schedule.adminClass.searchSubjectTimeRule({planId:"934e3a63aadc47d398da0d395ad41420"})
                console.log(result);
                let list=[...result];
                list.forEach(item=>{
                    let timeDay="";
                    for(let i=1;i<8;i++){
                        if(item.timeDay==i){
                            timeDay="星期"+i;
                        }
                        // console.log(timeDay);
                    }
                    let time1=[];
                    //字符串转换为数组
                    let timeLesson=item.timeLesson.split(',');
                    // console.log(timeLesson);
                    for(let i=0;i<timeLesson.length;i++){
                        // console.log(timeLesson[i]-1);
                        if(timeLesson[i]<5){
                            time1=[...time1,"上午第"+timeLesson[i]+"节"];
                        }else{
                            let lesson=timeLesson[i]-4
                            time1=[...time1,"下午第"+lesson+"节"];
                        }
                        // console.log(time1);
                    }
                    let pushData={
                        id:item.id,
                        subName:item.subName,
                        time1:"必须"+timeDay+time1,
                    }
                    this.classTimeData.push(pushData)
                })
                console.log(this.classTimeData);
            },

            //查询
            onSearch(){
            },
            //课时设置
            timesSetting(){
                this.$router.push(`/schedule/detail/class_admin/index?planId=${this.planId}`)
            },
            //课节设置
            oncesSetting(){
                this.$router.push(`/schedule/detail/class_admin/time?planId=${this.planId}`)
            },
            //学科设置
            subjectSetting(){
                this.$router.push(`/schedule/detail/class_admin/course?planId=${this.planId}`)
            },
            //班级设置
            classSetting(){
                this.$router.push(`/schedule/detail/class_admin/class?planId=${this.planId}`)
            },
            //规则设置
            ruleSetting(){
                this.$router.push(`/schedule/detail/class_admin/rule?planId=${this.planId}`)
            },
            //开始排课
            startArray(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            Next(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            //提交
            handleSelectChange3(){},
            handleSelectChange2(){},
            handleSelectChange(){},
            handleSubmit(){},
            handleSubmit1(){},
            handleSubmit2(){},
            onChange(){},
            addClass(){},
            timeRegularSetting() {
                this.timeRegularVisit = true;
            },
            //编辑老师
            addTeacher(){
                this.teacherVisit=true;
                this.getData();

            },
            //添加学科时间规则
            addSubjectTimeRegular(){
                this. studyTimeData.unshift({
                    subName:"",
                    time1:'',
                })
          },
            //添加教师时间规则
            addTeacherTimeRegular(){
                this. teacherTimeData.unshift({
                    id:this.teacherTimeData.length+1,
                    teacherName:"",
                    time1:"",
                })
            },
            addClassTimeRegular(){
                this.classTimeData.unshift({
                    classTimeKey:'2',
                    time1:'必须星期一下午第3节 必须星期一下午第4节',
                })
            },
            addWeekRegular(){
                this.weekData.unshift({
                    weekTimeKey:'1',
                })
            },
            addBanRegular(){
                this.banData.unshift({
                    banTimeKey:'1'
                })
            },
            handleSelectChange(){
            },
            handleOk() {
                this.loading = true;
                setTimeout(() => {
                    this.timeRegularVisit = false;
                    this.teacherVisit = false;
                    this.loading = false;
                }, 2000);
            },
            handleCancel() {
                this.timeRegularVisit = false;
                this.teacherVisit= false;
            },
            subjectTimeDelete(){
                const dataSource = [...this.studyTimeData];
                dataSource.splice(event.target.getAttribute('dataIndex'),1);
                this. studyTimeData= dataSource
            },
            subjectTimeSave(){},
            teacherTimeDelete(){
                const dataSource = [...this.teacherTimeData];
                dataSource.splice(event.target.getAttribute('dataIndex'),1);
                this. teacherTimeData= dataSource
            },
            teacherTimeSave(){},
            classTimeDelete(){
                const dataSource = [...this.classTimeData];
                dataSource.splice(event.target.getAttribute('dataIndex'),1);
                this. classTimeData= dataSource
            },
            classTimeSave(){},
            banTimeDelete(){
                const dataSource = [...this.banData];
                dataSource.splice(event.target.getAttribute('dataIndex'),1);
                this. banData= dataSource
            },
            banTimeSave(){},
            weekTimeDelete(){
                const dataSource = [...this. weekData];
                dataSource.splice(event.target.getAttribute('dataIndex'),1);
                this.  weekData= dataSource
            },
            weekTimeSave(){},
            back(){
                this.$router.go(-1)
            },
            form(){},
            classTimeKey(){},
            visible(){},
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
