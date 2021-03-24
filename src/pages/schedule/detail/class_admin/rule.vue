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
            </a-row>
            <div class="table">
                <template>
<!--                  学科时间规则-->
                    <a-descriptions bordered>
                        <a-descriptions-item label="学科时间规则" >
                            <a-table  :rowKey="'id'"
                                      :columns="column1"
                                      :data-source="studyTimeData"
                                      :pagination="false"
                                      :bordered="true">
                                <a-form-item slot="subjects" slot-scope="text,record,index" >
                                    <a-select style="width:100px" :default-value="text" @change="changSubId($event,index)">
                                        <a-select-option v-for="(subject,index) in subjectData" :value="subject.subId">{{subject.subName}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <div slot="timeSetting1" slot-scope="time1,record1,index1">
                                    <span style="float: left">{{time1}}</span>
                                    <a-icon  type="edit" @click="subTimeRegularSettingEdit(index1)"  style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="action" slot-scope="text,record,index" >
                                    <a-popconfirm
                                            v-if="studyTimeData.length"
                                            title="确认删除?"
                                            @confirm="() => subjectTimeDelete(record.id)">
                                        <a href="javascript:;" style="color:blue;float:left">删除</a>
                                    </a-popconfirm>
                                    <span  style="color:blue;float:right" @click="subjectTimeSave(index)">保存</span>
                                </div>
                            </a-table>
                            <div style="margin-top: 10px;margin-bottom: -5px;float: left;font-size: 1.0rem;color: blue;"  class="editable-add-btn"  @click="addSubjectTimeRegular">
                                <a-icon type="plus" />
                                <span>添加规则 </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
<!--                    教师时间规则-->
                    <a-descriptions bordered>
                        <a-descriptions-item label="教师时间规则">
                            <a-table :rowkey="'id'"
                                      :columns="column2"
                                      :data-source="teacherTimeData"
                                      :pagination="false"
                                      :bordered="true">
                                <div slot="teachers" slot-scope="teacher,record1,index1">
                                    <span>{{teacher}}</span>
                                    <a-icon type="edit" @click="addTeacher(index1)"  style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="timeSetting2" slot-scope="time2,record2,index2">
                                    <span style="float: left">{{time2}}</span>
                                    <a-icon type="edit" @click="teacherTimeRegularSettingEdit(index2)" style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="action" slot-scope="text,record,index">
                                    <a-popconfirm
                                            v-if="teacherTimeData.length"
                                            title="确认删除?"
                                            @confirm="() => teacherTimeDelete(record.id)">
                                        <a href="javascript:;" style="color:blue;float:left">删除</a>
                                    </a-popconfirm>
                                    <span  style="color:blue;float:right" @click="teacherTimeSave(index)">保存</span>
                                </div>
                            </a-table>
                            <div style=" margin-top: 10px;margin-bottom: -5px; float: left; font-size: 1.0rem;color: blue;" @click="addTeacherTimeRegular">
                                <a-icon type="plus" />
                                <span> 添加规则</span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
<!--                    班级时间规则-->
                    <a-descriptions bordered>
                        <a-descriptions-item label="班级时间规则">
                            <a-table  :columns="column3"
                                      :data-source="classTimeData"
                                      :pagination="false"
                                      :rowKey="'id'"
                                      :bordered="true">
                                <a-form-item slot="class" slot-scope="text,record,index" >
                                    <a-select :default-value="text" @change="changeClass($event,index)" style="width:100px">
                                        <a-select-option v-for="(className,index) in classData" :value="className.classId" >{{className.gradeClass}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item slot="subjects" slot-scope="subText,subRecord,subIndex">
                                    <a-select :default-value="subText" @change="changeClassSub($event,subIndex)" style="width:250px">
                                        <a-select-option v-for="(subject,index) in subjectData" :value="subject.subId">{{subject.subName}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <div slot="timeSetting3" slot-scope="time3,record3,index3">
                                    <span style="float: left">{{time3}}</span>
                                    <a-icon type="edit" @click="classTimeRegularSettingEdit(index3)" style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="action" slot-scope="text,record,index">
                                    <a-popconfirm
                                            v-if="classTimeData.length"
                                            title="确认删除?"
                                            @confirm="() => classTimeDelete(record.id)">
                                        <a href="javascript:;" style="color:blue;float:left">删除</a>
                                    </a-popconfirm>
                                    <span  style="color:blue;float:right" @click="classTimeSave(index)">保存</span>
                                </div>
                            </a-table>
                            <div style="margin-top: 10px;margin-bottom: -5px;float: left;font-size: 1.0rem;color: blue;" @click="addClassTimeRegular">
                                <a-icon type="plus" />
                                <span> 添加规则 </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
<!--                    禁止相邻规则-->
                    <a-descriptions bordered>
                        <a-descriptions-item label="禁止相邻">
                            <a-table :rowKey="'id'"
                                     :columns="column4"
                                      :data-source="banData"
                                      :pagination="false"
                                      :bordered="true">
                                <a-form-item slot="continuityNum" slot-scope="continueText,record,index" >
                                    <a-input v-model="continueText" @blur="changeSubjectNum(index,continueText,)" style="width: 100px"/>
                                </a-form-item>
                                <a-form-item slot="subChildNameOne" slot-scope="subOneText,oneRecord,oneIndex">
                                    <a-select :default-value="subOneText" @change="changeOneSubject($event,oneIndex)" style="width:250px">
                                        <a-select-option v-for="(subject,index) in subjectData" :value="subject.subId">{{subject.subName}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item slot="subChildNameTwo" slot-scope="subTwoText,twoRecord,twoIndex" >
                                    <a-select :default-value="subTwoText" @change="changeTwoSubject($event,twoIndex)" style="width:250px">
                                        <a-select-option v-for="(subject,index) in subjectData" :value="subject.subId">{{subject.subName}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <div slot="action" slot-scope="text,record,index">
                                    <a-popconfirm
                                            v-if="banData.length"
                                            title="确认删除?"
                                            @confirm="() => banTimeDelete(record.id)">
                                        <a href="javascript:;" style="color:blue;float:left">删除</a>
                                    </a-popconfirm>
                                    <span  style="color:blue;float:right" @click="banTimeSave(index)">保存</span>
                                </div>
                            </a-table>
                            <div style="margin-top: 10px;margin-bottom: -5px;float: left;font-size: 1.0rem;color: blue;" @click="addBanRegular">
                                <a-icon type="plus" />
                                <span> 添加规则 </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
<!--                    单双周课程规则-->
                    <a-descriptions bordered>
                        <a-descriptions-item label="单双周课程">
                            <a-table :rowKey="'id'"
                                     :columns="column5"
                                      :data-source="weekData"
                                      :pagination="false"
                                      :bordered="true">
                                <a-form-item slot="perWeekLessonNum" slot-scope="weekLessText,record,index" >
                                    <a-input v-model="weekLessText" style="width: 100px" @blur="changeLessonTime(index,weekLessText)"/>
                                </a-form-item>
                                <a-form-item slot="singleWeekSubName" slot-scope="singText,singRecord,singIndex" >
                                    <a-select :default-value="singText" @change="changeSingSubject($event,singIndex)" style="width:250px">
                                        <a-select-option v-for="(subject,index) in subjectData" :value="subject.subId">{{subject.subName}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item slot="doubleWeekSubName" slot-scope="doubleText,doubleRecord,doubleIndex">
                                    <a-select :defaule-value="doubleText" @change="changeDoubleSubject($event,doubleIndex)" style="width:250px">
                                        <a-select-option v-for="(subject,index) in subjectData" :value="subject.subId">{{subject.subName}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <div slot="action" slot-scope="text,record,index">
                                    <a-popconfirm
                                            v-if="weekData.length"
                                            title="确认删除?"
                                            @confirm="() => weekTimeDelete(record.id)">
                                        <a href="javascript:;" style="color:blue;float:left">删除</a>
                                    </a-popconfirm>
                                    <span  style="color:blue;float:right" @click="weekTimeSave(index)">保存</span>
                                </div>
                            </a-table>
                            <div style="margin-top: 10px;margin-bottom: -5px;float: left;font-size: 1.0rem;color: blue;" @click="addWeekRegular">
                                <a-icon type="plus" />
                                <span>添加规则</span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                </template>
                <button style="background-color: #00ccff;margin-top:100px; color: white;height: 40px;border: none;
                border-radius: 5px; width: 200px" @click="Next" >保存</button>
            </div>
        </div>
<!--        添加学科时间规则-->
        <a-modal :visible='subTimeRegularVisit'
                :closable="false"
                 title="选择时间段">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOkSubTime">保存</a-button>
                <a-button key="back" @click="handleCancelSubTime">取消</a-button>
            </template>
            <div class="model1_head">
                <a-form-model :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}">
                    <a-form-model-item label="类型">
                        <a-select :default-value="subType" placeholder="不使用/优先使用/必须使用" @change="changeSubType">
                            <a-select-option value="1">不使用</a-select-option>
                            <a-select-option value="2">优先使用</a-select-option>
                            <a-select-option value="3">必须使用</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择天">
                        <a-select placeholder="星期一" :default-value="subDay" @change="changeSubDay">
                            <a-select-option value="1">星期一</a-select-option>
                            <a-select-option value="2">星期二</a-select-option>
                            <a-select-option value="3">星期三</a-select-option>
                            <a-select-option value="4">星期四</a-select-option>
                            <a-select-option value="5">星期五</a-select-option>
                            <a-select-option value="6">星期六</a-select-option>
                            <a-select-option value="7">星期日</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择节">
                        <a-checkbox-group @change="changeSubTime"
                                :default-value="subTimeValue"
                                :options="subOption"></a-checkbox-group>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
<!--     添加教师时间规则-->
        <a-modal :visible='teacherTimeRegularVisit'
                 :closable="false"
                 title="选择时间段">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOkTeaTime">保存</a-button>
                <a-button key="back" @click="handleCancelTeaTime">取消</a-button>
            </template>
            <div class="model1_head">
                <a-form-model :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}">
                    <a-form-model-item label="类型">
                        <a-select :default-value="teacherType" placeholder="不使用/优先使用/必须使用" @change="changeTeacherType">
                            <a-select-option value="1">不使用</a-select-option>
                            <a-select-option value="2">优先使用</a-select-option>
                            <a-select-option value="3">必须使用</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择天">
                        <a-select placeholder="星期一" :default-value="teacherDay" @change="changeteacherDay">
                            <a-select-option value="1">星期一</a-select-option>
                            <a-select-option value="2">星期二</a-select-option>
                            <a-select-option value="3">星期三</a-select-option>
                            <a-select-option value="4">星期四</a-select-option>
                            <a-select-option value="5">星期五</a-select-option>
                            <a-select-option value="6">星期六</a-select-option>
                            <a-select-option value="7">星期日</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择节">
                        <a-checkbox-group @change="changeteacherTime"
                                          :default-value="teacherTimeValue"
                                          :options="subOption"></a-checkbox-group>
                    </a-form-model-item>
                </a-form-model>
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
                                <a-select :value="this.gradeName" disabled></a-select>
                            </a-form-model-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-model-item label="科目：" :labelCol="{ span: 3 }" :wrapperCol="{ span: 15, offset: 1 }">
                                <a-select style="width:100px" v-model="form.subject" @change="chooseSubject($event,teachIndex)">
                                    <a-select-option v-for="(subject,index) in subjectData" :value="subject.subId">{{subject.subName}}</a-select-option>
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
                        <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                                :selectedRows="selectedRows"
                                :rowKey="'teacherId'"
                                :columns="editColumn"
                                 :data-source="editData"
                                 :pagination="false"
                                 :bordered="true" style="width: 600px;margin-left: 100px;margin-bottom: 100px">
                            <a-radio slot="editCheck"></a-radio>
                        </a-table>
                    </a-row>
                </a-form-model>
            </a-card>
        </a-modal>
<!--        添加班级时间规则-->
        <a-modal :visible='classTimeRegularVisit'
                 :closable="false"
                 title="选择时间段">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOkClaTime">保存</a-button>
                <a-button key="back" @click="handleCancelClaTime">取消</a-button>
            </template>
            <div class="model1_head">
                <a-form-model :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}">
                    <a-form-model-item label="类型">
                        <a-select :default-value="classType" placeholder="不使用/优先使用/必须使用" @change="changeClassType">
                            <a-select-option value="1">不使用</a-select-option>
                            <a-select-option value="2">优先使用</a-select-option>
                            <a-select-option value="3">必须使用</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择天">
                        <a-select placeholder="星期一" :default-value="classDay" @change="changeClassDay">
                            <a-select-option value="1">星期一</a-select-option>
                            <a-select-option value="2">星期二</a-select-option>
                            <a-select-option value="3">星期三</a-select-option>
                            <a-select-option value="4">星期四</a-select-option>
                            <a-select-option value="5">星期五</a-select-option>
                            <a-select-option value="6">星期六</a-select-option>
                            <a-select-option value="7">星期日</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择节">
                        <a-checkbox-group @change="changeClassTime"
                                          :default-value="classTimeValue"
                                          :options="subOption"></a-checkbox-group>
                    </a-form-model-item>
                </a-form-model>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import {message} from "ant-design-vue";
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
            scopedSlots: { customRender: 'timeSetting2' },
            width: '71%',
            align:'center',
        },
        {
            title:'操作',
            dataIndex:'opt2',
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
            dataIndex:'classSubjectName',
            scopedSlots: { customRender: 'subjects' },
            width: '35%',
            align:'center',
        },
        {
            title:'时间设置',
            dataIndex:'time1',
            scopedSlots: { customRender: 'timeSetting3' },
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
            title:'',
            dataIndex:'id',
            align:'center',
            width:'5%',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            },
        },
        {
            title:'连堂次数',
            dataIndex:'continuityNum',
            scopedSlots: { customRender: 'continuityNum' },
            width: '12%',
            align:'center',
        },
        {
            title:'科目一',
            dataIndex:'subChildNameOne',
            scopedSlots: { customRender: 'subChildNameOne' },
            width: '38%',
            align:'center',
        },
        {
            title:'科目二',
            dataIndex:'subChildNameTwo',
            scopedSlots: { customRender: 'subChildNameTwo' },
            width: '38%',
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
    const column5=[
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
            title:'每周上课次数',
            dataIndex:'perWeekLessonNum',
            scopedSlots: { customRender: 'perWeekLessonNum' },
            width: '12%',
            align:'center',
        },
        {
            title:'单周课程',
            dataIndex:'singleWeekSubName',
            scopedSlots: { customRender: 'singleWeekSubName' },
            width: '38%',
            align:'center',
        },
        {
            title:'双周课程',
            dataIndex:'doubleWeekSubName',
            scopedSlots: { customRender: 'doubleWeekSubName' },
            width: '38%',
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
    const editColumn=[
        {
            title:'序号 ',
            dataIndex:'teacherId',
            align:'center',
            width:'15%',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },{
            title:'姓名 ',
            dataIndex:'teacherName',
            align:'center',
            width:'20%'
        },{
            title:'所教年级 ',
            dataIndex:'gradeName',
            align:'center',
            width:'25%'
        },{
            title:'所教学科 ',
            dataIndex:'subName',
            align:'center',
            width:'32%'
        },
    ]
    export default {
        data() {
            return {
                //学科时间规则
                column1,
                studyTimeData:[],
                subOption:[],
                subTimeValue:[],
                subEditTimeValue:[],
                subTimeRegularVisit:false,
                subType:"",
                subEditType:"",
                subDay:"",
                subEditDay:"",
                subjectId:"",
                activity,
                editSubIndex:-1,
                //教师时间规则
                column2,
                teacherTimeData:[],
                teacherTimeRegularVisit:false,
                editTeacherIndex:-1,
                teacherTimeValue:[],
                teacherEditTimeValue:[],
                teacherType:"",
                teacherEditType:"",
                teacherDay:"",
                teacherEditDay:"",
                teacherVisit:false,
                teachName:"",
                teachId:"",
                selectedRowKeys: [], // Check here to configure the default column
                selectedRows:[],
                allTeacherData:[],

                //班级时间规则
                column3,
                classTimeData:[],
                classTimeRegularVisit:false,
                editclassIndex:-1,
                classTimeValue:[],
                classEditTimeValue:[],
                classType:"",
                classEditType:"",
                classDay:"",
                classEditDay:"",
                classData:[],
                //禁止相邻规则
                column4,
                banData:[],
                //单双周课程规则查看
                column5,
                weekData:[],
                editColumn,
                editData:[],
                loading:false,

                planData:"",
                planId:"",
                gradeName:"",
                gradeId:"",
                currId:"",
                classType:"",
                subject:[],
                teacherName:[],
                form:{},
                subjectData:[],
            };
        },
        async created() {
            this.chooseCourseInfo();
            this.subjectTimeRule();
            this.subjectInfo();
            this.teacherTimeRule();
            this.classTimeRule();
            this.searchClassInfo();
            this.banNearRule();
            this.singDoubleRule();
        },
        methods:{
            //获取单个选课计划信息
            async chooseCourseInfo(){
                //获取planId
                let queryString = (window.location.hash || " ").split(/[?&]/)[1];
                let planId = (queryString || " ").split('=')[1];
                // console.log(planId);
                this.planId = planId;
                //获取scheduleTaskId
                let queryTaskString = (window.location.hash || " ").split(/[?&]/)[2];
                let scheduleTaskId = (queryTaskString || " ").split('=')[1];
                this.scheduleTaskId= scheduleTaskId;
                console.log( this.scheduleTaskId);
                if (planId) {
                    //获取单个选课计划的信息
                    let {data: {result, success}} = await this.$api.schedule.plan.schedulegetInfo({planId})
                    this.planData=result.planData;
                    this.gradeName=result.gradeName;
                    this.gradeId=result.gradeId;
                    this.currId=result.currId;
                    this.classType=result.type;
                    console.log(this.classType);
                }
            },
            //学科时间规则
            //=========================================================
            //学科时间规则查看
            async subjectTimeRule(){
                //获取学科时间规则
                let {data:{result,success}}=await this.$api.schedule.adminClass.searchSubjectTimeRule({planId:this.planId})
                // console.log(result);
                this.studyTimeData=result;
                this.studyTimeData.forEach(item=>{
                    if(item.timeRuleSetting){
                        let timeItem = item.timeRuleSetting[0];
                        let timeDay = "";
                        //星期转换
                        for (let i = 1; i < 8; i++) {
                                if (timeItem.timeDay == i) {
                                    timeDay = "星期" + i;
                                }
                                // console.log(timeDay);
                            }
                        let time1 = [];
                        //==================================
                        //节次转换
                        //     //字符串转换为数组
                        let timeLesson = timeItem.timeLesson.split(',');
                        // console.log(timeLesson);
                        for (let i = 0; i < timeLesson.length; i++) {
                                // console.log(timeLesson[i]-1);
                                if (timeLesson[i] < 5) {
                                    time1 = [...time1, "上午第" + timeLesson[i] + "节"];
                                } else {
                                    let lesson = timeLesson[i] - 4
                                    time1 = [...time1, "下午第" + lesson + "节"];
                                }
                                // console.log(time1);
                            }
                        //=================================================
                        let timeType = "";
                        let type = timeItem.timeType
                        switch (type) {
                                case "1":timeType = "不使用";break;
                                case "2":timeType = "优先使用";break;
                                case "3":timeType = "必须使用";break;
                            }
                        item.time1=timeType+timeDay+time1;
                    }
                })
                // console.log(this.studyTimeData);
            },
            //科目信息查看
            //学科时间规则（获取学科信息）
            async subjectInfo() {
                this.subjectData=[];
                let {data} = await this.$api.schedule.adminClass.getCourseSetting({
                    planId: this.planId,
                    scheduleType: 1
                });
                console.log(data);
                for(let i in data.result){
                    let pushData={
                        subId:data.result[i].subId,
                        subName:data.result[i].subName,
                    }
                    this.subjectData.push(pushData);
                }
                console.log(this.subjectData);
            },
            //学科设置规则删除
            subjectTimeDelete(id){
                this.delete(id);
                this.subjectTimeRule();
            },
            //获取删除接口
            async delete(ids){
                let {data}=await this.$api.schedule.adminClass.deleteRule({ids:[ids]});
                console.log(data);
                if(data&&data.success){
                    message.info("删除成功！");
                }else{
                    message.info("删除失败！");
                }
            },
            //获取节次时间
            async modalInfo() {
                let {data} = await this.$api.basic.template.fetchTemplate({id: this.currId});
                // console.log(data);
                let activities=[];
                let list=[...this.activity];
                list.forEach(item=>{
                    for(let i=1;i<=data.result[item.value];i++){
                        activities.push({
                            label: item.name+i,
                            value:item.value+i,
                        });
                    }
                });
                this.subOption=activities;
                console.log(this.subOption);
                // console.log(list);
            },
            //学科时间规则的课时设置
            subTimeRegularSettingEdit(index){
                console.log(index);
                this.editSubIndex=index;
                this.subTimeRegularVisit = true;
                this.modalInfo();
               if(this.studyTimeData[index].timeRuleSetting){
                   this.subDay=this.subEditDay=this.studyTimeData[index].timeRuleSetting[0].timeDay;
                   let timeType=this.studyTimeData[index].timeRuleSetting[0].timeType;
                   switch (timeType) {
                       case "1":this.subType=this.subEditType="不使用";break;
                       case "2":this.subType=this.subEditType="优先使用";break;
                       case "3":this.subType=this.subEditType="必须使用";break;
                   }
                   //字符串转化为数组
                   let timeLesson=this.studyTimeData[index].timeRuleSetting[0].timeLesson.split(',');
                   console.log(timeLesson);
                   for(let i in timeLesson){
                       if(timeLesson[i]<5){
                           let text="morning"+timeLesson[i];
                           this.subTimeValue.push(text);
                           // console.log(this.subTimeValue);
                       }else{
                           let text="afternoon"+timeLesson[i]-4;
                           this.subTimeValue.push(text);
                       }
                   }
                   console.log(this.subTimeValue);
                   this.subEditTimeValue=this.subTimeValue;
               }else{
                   this.timeType="";
                   this.timeDay="";
                   this.timeLesson=[];
               }
            },
            //保存学科时间设置时间规则弹框
            handleOkSubTime(){
                this.subTimeRegularVisit = false;
                let list=[...this.subEditTimeValue];
                let chooseValue=[];
                list.forEach(item=>{
                    // console.log(item);
                    let num=-1;
                    switch (item) {
                        case "morning1":num=1;break;
                        case "morning2":num=2;break;
                        case "morning3":num=3;break;
                        case "morning4":num=4;break;
                        case "afternoon1":num=5;break;
                        case "afternoon2":num=6;break;
                        case "afternoon3":num=7;break;
                        case "afternoon4":num=8;break;
                    }
                    chooseValue.push(num);
                })
                console.log(chooseValue);
               if(this.studyTimeData[this.editSubIndex].timeRuleSetting){
                   this.studyTimeData[this.editSubIndex].timeRuleSetting[0].timeDay=this.subEditDay;
                   this.studyTimeData[this.editSubIndex].timeRuleSetting[0].timeType=this.subEditType;
                   // this.studyTimeData[this.editSubIndex].timeRuleSetting[0].timeLesson=this.subType;
                   // console.log(this.subEditTimeValue);
                   this.studyTimeData[this.editSubIndex].timeRuleSetting[0].timeLesson=chooseValue.toString();
                   console.log(this.studyTimeData[this.editSubIndex].timeRuleSetting[0]);
               }else{
                   let pushData={
                       timeDay:this.subEditDay,
                       timeType:this.subEditType,
                       timeLesson:chooseValue.toString()
                   }
                   console.log(pushData);
                   this.studyTimeData[this.editSubIndex].timeRuleSetting=[pushData];
               }
                // //星期转换
                // let timeDay="";
                // for(let i=1;i<8;i++){
                //     if(this.subEditDay==i){
                //         timeDay="星期"+i;
                //     }
                //     // console.log(timeDay);
                // }
                // let time1=[];
                // //==================================
                // //节次转换
                // for(let i=0;i<chooseValue.length;i++){
                //     // console.log(timeLesson[i]-1);
                //     if(chooseValue[i]<5){
                //         time1=[...time1,"上午第"+chooseValue[i]+"节"];
                //     }else{
                //         let lesson=chooseValue[i]-4
                //         time1=[...time1,"下午第"+lesson+"节"];
                //     }
                //     // console.log(time1);
                // }
                // //=================================================
                // let timeType="";
                // let type=this.subEditType
                // console.log(type);
                // switch (type) {
                //     case "0":timeType="不使用";break;
                //     case "1":timeType="优先使用";break;
                //     case "2":timeType="必须使用";break;
                // }
                // this.studyTimeData[this.editSubIndex].time1=timeType+timeDay+time1;
                // console.log(this.studyTimeData);
            },
            //关闭学科时间设置时间规则弹框
            handleCancelSubTime(){
                this.subTimeRegularVisit = false;
            },
            //添加学科时间规则(添加一项）
            addSubjectTimeRegular(){
                this. studyTimeData.unshift({
                    id:"",
                    subId:"",
                    subName:"",
                    time1:'',
                    timeSetting:[],
                })
                let addData={
                    planId:this.planId,
                    ruleType:"1",
                }
                this.saveSubTime(addData);
                this.subjectTimeRule();
                console.log(this.studyTimeData);
            },
            //修改学科
            async changSubId(info,index){
              this.studyTimeData[index].subId=info;
              console.log(info);
              console.log(this.studyTimeData[index].subId);
            },
            //改变类型
            changeSubType(info){
                this.subEditType=info;
                console.log(this.subEditType)
            },
            //选择星期几
            changeSubDay(info){
                this.subEditDay=info;
                console.log(this.subEditDay);
            },
            //选择节
            changeSubTime(info){
                console.log(info);
                this.subEditTimeValue=info;
                console.log(this.subEditTimeValue);
            },
            //保存学科时间规则设置
            subjectTimeSave(index){
                console.log(index);
                console.log(this.studyTimeData[index]);
                let addData={
                    id:this.studyTimeData[index].id,
                    planId:this.planId,
                    ruleType:1,
                    subId:this.studyTimeData[index].subId,
                    timeRuleSetting:[{
                        timeDay:this.studyTimeData[index].timeRuleSetting[0].timeDay,
                        timeLesson:this.studyTimeData[index].timeRuleSetting[0].timeLesson,
                        timeType:this.studyTimeData[index].timeRuleSetting[0].timeType,
                    }]
                }
                console.log(addData);
                this.saveSubTime(addData);
                this.subjectTimeRule()
            },
            //获取保存接口
            async saveSubTime(addData){
                let {data}=await this.$api.schedule.adminClass.addRuleSetting(addData);
                console.log(data);
                if(data&&data.success){
                    message.info("保存成功！");
                }
            },
            //=======================================================
            //教师时间规则
            //=========================================================
            //教师时间规则查看
            async teacherTimeRule(){
                this.teacherTimeData=[];
                //获取教室时间规则
                let {data:{result,success}}=await this.$api.schedule.adminClass.searchTeacherTimeRule({planId:this.planId})
                // console.log(result);
                this.teacherTimeData=result;
                this.teacherTimeData.forEach(item=>{
                    // console.log(item);
                    if(item.timeRuleSetting){
                        let timeItem = item.timeRuleSetting[0];
                        let timeDay = "";
                        //星期转换
                        for (let i = 1; i < 8; i++) {
                                if (timeItem.timeDay == i) {
                                    timeDay = "星期" + i;
                                }
                                // console.log(timeDay);
                            }
                        let time1 = [];
                        //==================================
                        //节次转换
                        //     //字符串转换为数组
                        let timeLesson = timeItem.timeLesson.split(',');
                        // console.log(timeLesson);
                        for (let i = 0; i < timeLesson.length; i++) {
                            // console.log(timeLesson[i]-1);
                            if (timeLesson[i] < 5) {
                                time1 = [...time1, "上午第" + timeLesson[i] + "节"];
                                } else {
                                let lesson = timeLesson[i] - 4
                                time1 = [...time1, "下午第" + lesson + "节"];
                            }
                            // console.log(time1);
                        }
                        //=================================================
                        let timeType = "";
                        let type = timeItem.timeType
                        // console.log(type);
                        switch (type) {
                            case "1":timeType = "不使用";break;
                            case "2":timeType = "优先使用";break;
                            case "3":timeType = "必须使用";break;
                        }
                        item.time1=timeType+timeDay+time1;
                    }
                })
                // console.log(this.teacherTimeData);
            },
            //教师时间规则删除
            teacherTimeDelete(id){
                this.delete(id);
                this.teacherTimeRule();
            },
            //编辑教师时间规则
            teacherTimeRegularSettingEdit(index){
                this.editTeacherIndex=index;
                this.teacherTimeRegularVisit=true;
                this.modalInfo();
                console.log(this.teacherTimeData[index]);
                if(this.teacherTimeData[index].timeRuleSetting){
                    this.teacherDay=this.teacherEditDay=this.teacherTimeData[index].timeRuleSetting[0].timeDay;
                    let timeType=this.teacherTimeData[index].timeRuleSetting[0].timeType;
                    switch (timeType) {
                        case "1":this.teacherType=this.teacherEditType= "不使用";break;
                        case "2":this.teacherType=this.teacherEditType = "优先使用";break;
                        case "3":this.teacherType=this.teacherEditType = "必须使用";break;
                    }
                    //字符串转化为数组
                    let timeLesson=this.teacherTimeData[index].timeRuleSetting[0].timeLesson.split(',');
                    console.log(timeLesson);
                    for(let i in timeLesson){
                        if(timeLesson[i]<5){
                            let text="morning"+timeLesson[i];
                            this.teacherTimeValue.push(text);
                            // console.log(this.subTimeValue);
                        }else{
                            let text="afternoon"+timeLesson[i]-4;
                            this.teacherTimeValue.push(text);
                        }
                    }
                    console.log(this.teacherTimeValue);
                    this.teacherEditTimeValue=this.teacherTimeValue;
                }else{
                    this.timeType="";
                    this.timeDay="";
                    this.timeLesson=[];
                }
            },
            //保存教师时间规则弹框
            handleOkTeaTime(){
                this.teacherTimeRegularVisit=false;
                let list=[...this.teacherEditTimeValue];
                let chooseValue=[];
                list.forEach(item=>{
                    // console.log(item);
                    let num=-1;
                    switch (item) {
                        case "morning1":num=1;break;
                        case "morning2":num=2;break;
                        case "morning3":num=3;break;
                        case "morning4":num=4;break;
                        case "afternoon1":num=5;break;
                        case "afternoon2":num=6;break;
                        case "afternoon3":num=7;break;
                        case "afternoon4":num=8;break;
                    }
                    chooseValue.push(num);
                })
                console.log(chooseValue);
                if(this.teacherTimeData[this.editTeacherIndex].timeRuleSetting){
                    this.teacherTimeData[this.editTeacherIndex].timeRuleSetting[0].timeDay=this.teacherEditDay;
                    this.teacherTimeData[this.editTeacherIndex].timeRuleSetting[0].timeType=this.teacherEditType;
                    this.teacherTimeData[this.editTeacherIndex].timeRuleSetting[0].timeLesson=chooseValue.toString();
                    console.log(this.teacherTimeData[this.editTeacherIndex].timeRuleSetting[0]);
                }else{
                    let pushData={
                        timeDay:this.teacherEditDay,
                        timeType:this.teacherEditType,
                        timeLesson:chooseValue.toString()
                    }
                    console.log(pushData);
                    this.teacherTimeData[this.editTeacherIndex].timeRuleSetting=[pushData];
                }
            },
            //关闭教师时间规则弹框
            handleCancelTeaTime(){
                this.teacherTimeRegularVisit=false;
            },
            //添加教师时间规则(添加一项)
            addTeacherTimeRegular(){
                this.teacherTimeData.unshift({
                    id:"",
                    teacherId:"",
                    teacherName:"",
                    time1:"",
                    timeSetting:[],
                })
                let addData={
                    planId:this.planId,
                    ruleType:"2",
                }
                this.saveSubTime(addData);
                this.teacherTimeRule();
            },
            //编辑老师
            addTeacher(index){
                this.teachId=index;
                // console.log(value);
                // console.log(index);
                this.teacherVisit=true;
                let pushData={
                    gradeId:this.gradeId,
                }
               this.getTeacherData(pushData);
            },
            //获取老师信息
            async getTeacherData(pushData){
                let {data:{result,success}}=await this.$api.schedule.adminClass.searchTeacher(pushData);
                console.log(result);
                this.allTeacherData=result[0].gradeDtos;
                // console.log(this.allTeacherData);
                let allData=[];
                this.allTeacherData.forEach(item=>{
                    let teachList=[...item.teachers];
                    teachList.forEach(teaItem=>{
                        let pushData={
                            teacherId:teaItem.teacherId,
                            teacherName:teaItem.teacherName,
                            gradeName:item.gradeName,
                            subChildId:item.subChildId,
                            subName:item.subName
                        }
                        allData.push(pushData);
                    })
                })
                this.editData=allData;
                console.log(this.editData);
            },
            //选择老师
            onSelectChange( selectedRowKeys,selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows=selectedRows
                console.log(this.selectedRowKeys);
                console.log(this.selectedRows);
            },
            //改变类型
            changeTeacherType(info){
                this.teacherEditType=info;
                console.log(this.teacherEditType)
            },
            //选择星期几
            changeteacherDay(info){
                this.teacherEditDay=info;
                console.log(this.teacherEditDay);
            },
            ////修改教师节
            changeteacherTime(info){
                console.log(info);
                this.teacherEditTimeValue=info;
                console.log(this.teacherEditTimeValue);
            },
            //保存教师时间规则
            teacherTimeSave(index){
                console.log(index);
                console.log(this.teacherTimeData[index].teacherId);
                console.log(this.teacherTimeData[index]);
                let addData={
                    id:this.teacherTimeData[index].id,
                    planId:this.planId,
                    ruleType:"2",
                    teacherId:this.teacherTimeData[index].teacherId,
                    timeRuleSetting:[{
                        timeDay:this.teacherTimeData[index].timeRuleSetting[0].timeDay,
                        timeLesson:this.teacherTimeData[index].timeRuleSetting[0].timeLesson,
                        timeType:this.teacherTimeData[index].timeRuleSetting[0].timeType,
                    }]
                }
                console.log(addData);
                this.saveSubTime(addData);
                this.teacherTimeRule();
            },
            //选择课程
            chooseSubject(){
                console.log(this.form.subject);
                // console.log(this.subjectData);
                // console.log(this.teacherName);
                let pushData={
                    gradeId:this.gradeId,
                    subChildId: this.form.subject,
                }
                this.getTeacherData(pushData);
            },
            //查询
            onSearch(){
                console.log(this.form.teacherName);
                let pushData={}
                if(this.form.subject==""){
                    pushData={
                        gradeId:this.gradeId,
                        teacherName:this.form.teacherName
                    }
                }else{
                    pushData={
                        gradeId:this.gradeId,
                        subChildId:this.form.subject,
                        teacherName:this.form.teacherName
                    }
                }
                this.getTeacherData(pushData);
            },
            //保存编辑老师
            handleOk(){
                this.teacherVisit=false;
                this.teacherTimeData[this.teachId].teacherName=this.selectedRows[0].teacherName;
                this.teacherTimeData[this.teachId].teacherId=this.selectedRows[0].teacherId;
                console.log(this.teacherTimeData[this.teachId].teacherName);
            },
            //关闭编辑老师弹框
            handleCancel(){
                this.teacherVisit=false;
            },
            //===========================================================
            //班级时间规则
            //=============================================================
            // 班级时间规则查看
            async classTimeRule(){
                //获取学科时间规则
                let {data:{result,success}}=await this.$api.schedule.adminClass.searchClassTimeRule({planId:this.planId})
                // console.log(result);
                this.classTimeData=result;
                this.classTimeData.forEach(item=>{
                    // console.log(item);
                    if(item.timeRuleSetting){
                        let timeItem = item.timeRuleSetting[0];
                        let timeDay = "";
                        //星期转换
                        for (let i = 1; i < 8; i++) {
                            if (timeItem.timeDay == i) {
                                timeDay = "星期" + i;
                            }
                            // console.log(timeDay);
                        }
                        let time1 = [];
                        //==================================
                        //节次转换
                        //     //字符串转换为数组
                        let timeLesson = timeItem.timeLesson.split(',');
                        // console.log(timeLesson);
                        for (let i = 0; i < timeLesson.length; i++) {
                            // console.log(timeLesson[i]-1);
                            if (timeLesson[i] < 5) {
                                time1 = [...time1, "上午第" + timeLesson[i] + "节"];
                            } else {
                                let lesson = timeLesson[i] - 4
                                time1 = [...time1, "下午第" + lesson + "节"];
                            }
                            // console.log(time1);
                        }
                        //=================================================
                        let timeType = "";
                        let type = timeItem.timeType
                        // console.log(type);
                        switch (type) {
                            case "1":timeType = "不使用";break;
                            case "2":timeType = "优先使用";break;
                            case "3":timeType = "必须使用";break;
                        }
                        item.time1=timeType+timeDay+time1;
                    }
                    item.class=item.gradeName+item.className
                })
                // console.log(this.classTimeData);
            },
            //班级时间规则删除
            classTimeDelete(id){
                this.delete(id);
                this.classTimeRule();
            },
            //班级时间规则编辑
            classTimeRegularSettingEdit(index){
                this.editclassIndex=index;
                this.classTimeRegularVisit=true;
                this.modalInfo();
                if(this.classTimeData[index].timeRuleSetting){
                    this.classDay=this.classEditDay=this.classTimeData[index].timeRuleSetting[0].timeDay;
                    let timeType=this.classTimeData[index].timeRuleSetting[0].timeType;
                    switch (timeType) {
                        case "1":this.classType=this.classEditType= "不使用";break;
                        case "2":this.classType=this.classEditType = "优先使用";break;
                        case "3":this.classType=this.classEditType = "必须使用";break;
                    }
                    //字符串转化为数组
                    let timeLesson=this.classTimeData[index].timeRuleSetting[0].timeLesson.split(',');
                    console.log(timeLesson);
                    for(let i in timeLesson){
                        if(timeLesson[i]<5){
                            let text="morning"+timeLesson[i];
                            this.classTimeValue.push(text);
                            // console.log(this.subTimeValue);
                        }else{
                            let text="afternoon"+timeLesson[i]-4;
                            this.classTimeValue.push(text);
                        }
                    }
                    console.log(this.classTimeValue);
                    this.classEditTimeValue=this.classTimeValue;
                }else{
                    this.timeType="";
                    this.timeDay="";
                    this.timeLesson=[];
                }
            },
            //保存编辑时间规则弹框
            handleOkClaTime(){
                this.classTimeRegularVisit=false;
                let list=[...this.classEditTimeValue];
                let chooseValue=[];
                list.forEach(item=>{
                    // console.log(item);
                    let num=-1;
                    switch (item) {
                        case "morning1":num=1;break;
                        case "morning2":num=2;break;
                        case "morning3":num=3;break;
                        case "morning4":num=4;break;
                        case "afternoon1":num=5;break;
                        case "afternoon2":num=6;break;
                        case "afternoon3":num=7;break;
                        case "afternoon4":num=8;break;
                    }
                    chooseValue.push(num);
                })
                console.log(chooseValue);
                if(this.classTimeData[this.editclassIndex].timeRuleSetting){
                    this.classTimeData[this.editclassIndex].timeRuleSetting[0].timeDay=this.classEditDay;
                    this.classTimeData[this.editclassIndex].timeRuleSetting[0].timeType=this.classEditType;
                    this.classTimeData[this.editclassIndex].timeRuleSetting[0].timeLesson=chooseValue.toString();
                    console.log(this.classTimeData[this.editclassIndex].timeRuleSetting[0]);
                }else{
                    let pushData={
                        timeDay:this.classEditDay,
                        timeType:this.classEditType,
                        timeLesson:chooseValue.toString()
                    }
                    console.log(pushData);
                    this.classTimeData[this.editclassIndex].timeRuleSetting=[pushData];
                }
            },
            //取消编辑时间规则弹框
            handleCancelClaTime(){
                this.classTimeRegularVisit=false;
            },
            //修改学科
            changeClassSub(info,index){
                this.classTimeData[index].classSubjectId=info;
                console.log(info);
            },
            //添加班级时间规则(添加一项）
            addClassTimeRegular(){
                this.classTimeData.unshift({
                    id:"",
                    class:"",
                    classId:"",
                    className:"",
                    classSubjectId:"",
                    classSubjectName:"",
                    gradeId:this.gradeId,
                    gradeName:this.gradeName,
                    time1:"",
                    timeRuleSetting:[],
                })
                let addData={
                    planId:this.planId,
                    ruleType:"3",
                }
                this.saveSubTime(addData);
                this.classTimeRule();
            },
            //修改班级
             changeClass(info,index){
                // console.log(info);
                // console.log(index);
                this.classTimeData[index].classId=info;
            },
            //班级信息查看
            async searchClassInfo(){
                let {data:{result,success}}=await this.$api.schedule.adminClass.getClassSetting({planId:this.planId,gradeId:this.gradeId});
                // console.log(result);
               for(let i in result){
                   let addData={
                       gradeClass:result[i].gradeName+result[i].className,
                       classId:result[i].classId
                   }
                   this.classData.push(addData);
               }
                console.log(this.classData);
            },
            //改变类型
            changeClassType(info){
                this.classEditType=info;
                console.log(this.classEditType)
            },
            //选择星期几
            changeClassDay(info){
                this.classEditDay=info;
                console.log(this.classEditDay);
            },
            //修改班级课程节
            changeClassTime(info){
                console.log(info);
                this.classEditTimeValue=info;
                console.log(this.classEditTimeValue);
            },
            //班级时间规则保存
            classTimeSave(index){
                let addData={
                    id:this.classTimeData[index].id,
                    planId:this.planId,
                    ruleType:3,
                    classId:this.classTimeData[index].classId,
                    classSubjectId:this.classTimeData[index].classSubjectId,
                    timeRuleSetting:[{
                        timeDay:this.classTimeData[index].timeRuleSetting[0].timeDay,
                        timeLesson:this.classTimeData[index].timeRuleSetting[0].timeLesson,
                        timeType:this.classTimeData[index].timeRuleSetting[0].timeType,
                    }]
                }
                console.log(addData);
                this.saveSubTime(addData);
                this.classTimeRule();
            },
            //========================================================
            //禁止相邻规则查看
            //===========================================================
            //禁止相邻规则查看
            async banNearRule(){
              let {data:{result,success}}=await this.$api.schedule.adminClass.searchBanRule({planId:this.planId});
              console.log(result);
              this.banData=result;
              // console.log(this.banData);
            },
            //改变相邻科目数
            changeSubjectNum(index,info){
                console.log(index);
                console.log(info);
                this.banData[index].continuityNum=info;
            },
            //选择科目一
            changeOneSubject(info,index){
                console.log(info);
                console.log(index);
                this.banData[index].subChildIdOne=info;
            },
            //选择科目二
            changeTwoSubject(info,index){
                console.log(info);
                console.log(index);
                this.banData[index].subChildIdTwo=info;
            },
            //添加禁止相邻科目(添加一项)
            addBanRegular(){
                this.banData.unshift({
                    continuityNum:"",
                    subChildIdOne:"",
                    subChildIdTwo:"",
                })
                let addData={
                    planId:this.planId,
                }
                this.saveBanData(addData);
            },
            //删除禁止相邻科目
            async banTimeDelete(id){
                console.log(id);
               let {data}=await this.$api.schedule.adminClass.deleteBanRule({ids:[id]});
               console.log(data);
               if(data&&data.success){
                   message.info("删除成功");
                   this.banNearRule();
               }else{
                   message.info("删除失败");
               }
            },
            //保存禁止相邻科目
            banTimeSave(index){
                let addData={
                    id:this.banData[index].id,
                    planId:this.planId,
                    continuityNum:this.banData[index].continuityNum,
                    subChildIdOne:this.banData[index].subChildIdOne,
                    subChildIdTwo:this.banData[index].subChildIdTwo,
                }
                this.saveBanData(addData);
            },
            //获取保存接口
            async saveBanData(addData){
              let {data}=await this.$api.schedule.adminClass.addBanRule(addData);
              console.log(data);
              if(data&&data.success){
                  message.info("保存成功");
                  this.banNearRule();
              }else{
                  message.info("保存失败");
              }
            },
            //===============================================
            //单双周课程规则
            //=======================================================
            //查看单双周课程规则
            async singDoubleRule(){
                let {data:{result,success}}=await this.$api.schedule.adminClass.searchLessonRule({planId:"934e3a63aadc47d398da0d395ad41420"});
                // console.log(result);
                this.weekData=result;
                console.log(this.weekData);
            },
            //修改每周上课次数
            changeLessonTime(index,info){
                this.weekData[index].perWeekLessonNum=info;
                console.log(index);
                console.log(info);
            },
            //修改单周科目
            changeSingSubject(info,index){
                this.weekData[index].singleWeekSubId=info;
                console.log(index);
                console.log(info);
            },
            //修改双周科目
            changeDoubleSubject(info,index){
                this.weekData[index].doubleWeekSubId=info;
                console.log(index);
                console.log(info);
            },
            //添加单双周课程(添加一项)
            addWeekRegular(){
                this.weekData.unshift({
                    perWeekLessonNum:null,
                    singleWeekSubId:"",
                    singleWeekSubName:"",
                    doubleWeekSubId:"",
                    doubleWeekSubName:"",
                })
                let addData={
                    planId:this.planId,
                }
                this.saveSingleDouble(addData);
            },
            //删除单双周课程
            async weekTimeDelete(id){
                let {data}=await this.$api.schedule.adminClass. deleteLessonRule({ids:[id]});
                console.log(data);
                if(data&&data.success){
                    message.info("删除成功");
                    this.singDoubleRule();
                }else{
                    message.info("删除失败");
                }
            },
            //保存单双周课程
            weekTimeSave(index){
                let addData={
                    id:this.weekData[index].id,
                    planId:this.planId,
                    perWeekLessonNum:this.weekData[index].perWeekLessonNum,
                    singleWeekSubId: this.weekData[index].singleWeekSubId,
                    doubleWeekSubId: this.weekData[index].doubleWeekSubId,
                }
                this.saveSingleDouble(addData);
                this.singDoubleRule();
            },
            //获取保存课程接口
            async saveSingleDouble(addData){
              let {data}=await this.$api.schedule.adminClass.addLessonRule(addData);
              console.log(data);
              if(data&&data.success){
                  message.info("保存成功");
                  this.singDoubleRule();
              }else{
                  message.info("保存失败");
              }
            },
            //课时设置
            timesSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/index?planId=${this.planId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/index?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`);
                }
            },
            //课节设置
            oncesSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/time?planId=${this.planId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/time?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`);
                }
            },
            //学科设置
            subjectSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/course?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/course?planId=${this.planId}`);
                }
            },
            //班级设置
            classSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/class?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/class?planId=${this.planId}`);
                }
            },
            //规则设置
            ruleSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/rule?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/rule?planId=${this.planId}`);
                }
            },
            //下一步
            Next(){
               this.aloClass();
            },
            async aloClass(){
                let addData={
                    id:this.scheduleTaskId,
                    planId:this.planId,
                    gradeId:this.gradeId,
                };
                console.log(addData);
              let {data}=await this.$api.schedule.adminClass.continueClass(addData);
              console.log(data);
              if(data&&data.success){
                  this.$router.push(`/schedule/detail/index?planId=${this.planId}`);
              }else{
                  message.info("行政班排课失败！");
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
    .table-bg{
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 5px;
        text-align: center;
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
    .table{
        width: 95%;
    }
</style>
