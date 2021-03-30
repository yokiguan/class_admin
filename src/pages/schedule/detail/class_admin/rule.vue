<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><router-link to="/schedule/template">排课计划</router-link></a-breadcrumb-item>
                <a-breadcrumb-item><span @click="arrangeClass">排课详情</span></a-breadcrumb-item>
                <a-breadcrumb-item>行政班排课</a-breadcrumb-item>
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
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting" :disabled="choose">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="subjectSetting" >学科设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="classSetting">班级设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px;background-color:#b9b9b9" @click="ruleSetting ">规则设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray" disabled>开始排课</a-button></a-col>
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
                <a-form-model :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}">
                    <a-form-model-item label="类型">
                        <a-select v-model="form.subType" placeholder="不使用/优先使用/必须使用">
                            <a-select-option value="1">不使用</a-select-option>
                            <a-select-option value="2">优先使用</a-select-option>
                            <a-select-option value="3">必须使用</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择天">
                        <a-select placeholder="星期一" v-model="form.subDay">
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
                        <a-checkbox-group v-model="form.subTimeValue" :options="subOption"></a-checkbox-group>
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
                <a-form-model :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}">
                    <a-form-model-item label="类型">
                        <a-select v-model="form.teacherType" placeholder="不使用/优先使用/必须使用">
                            <a-select-option value="1">不使用</a-select-option>
                            <a-select-option value="2">优先使用</a-select-option>
                            <a-select-option value="3">必须使用</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择天">
                        <a-select placeholder="星期一" v-model="form.teacherDay">
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
                        <a-checkbox-group v-model="form.teacherTimeValue" :options="subOption"></a-checkbox-group>
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
                <a-form-model :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}">
                    <a-form-model-item label="类型">
                        <a-select v-model="form.classType" placeholder="不使用/优先使用/必须使用">
                            <a-select-option value="1">不使用</a-select-option>
                            <a-select-option value="2">优先使用</a-select-option>
                            <a-select-option value="3">必须使用</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="选择天">
                        <a-select placeholder="星期一" v-model="form.classDay">
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
                        <a-checkbox-group v-model="form.classTimeValue" :options="subOption"></a-checkbox-group>
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
    const activity = [
        {
            name: "早读",
            options: [0, 1, 2],
            value: "morningread"
        },
        {
            name: "上午",
            options: [0, 1, 2, 3, 4],
            value: "morning"
        },
        {
            name: "中午",
            options: [0, 1, 2],
            value: "noon"
        },
        {
            name: "下午",
            options: [0, 1, 2, 3, 4],
            value: "afternoon"
        },
        {
            name: "晚自习",
            options: [0, 1, 2, 3, 4],
            value: "evening"
        }
    ];
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
                subEditTimeValue:[],
                subTimeRegularVisit:false,
                subjectId:"",
                activity,
                editSubIndex:-1,
                //教师时间规则
                column2,
                teacherTimeData:[],
                teacherTimeRegularVisit:false,
                editTeacherIndex:-1,
                teacherVisit:false,
                teachName:"",
                teachId:"",
                selectedRowKeys: [], // Check here to configure the default column
                selectedRows:[],
                allTeacherData:[],
                chooseSubjectTime:[],
                //班级时间规则
                column3,
                classTimeData:[],
                classTimeRegularVisit:false,
                editclassIndex:-1,
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
                form:{
                    subType:"",
                    subDay:"",
                    subTimeValue:[],
                    teacherTimeValue:[],
                    teacherType:"",
                    teacherDay:"",
                    classType:"",
                    classDay:"",
                    classTimeValue:[],
                },
                subjectData:[],
                choose:false,

                morningread:null,
                morning:null,
                aftrernoon:null,
                noon:null,
                evening:null,
            };
        },
        async created() {
            this.chooseCourseInfo();
            this.subjectInfo();
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
                // console.log( this.scheduleTaskId);
                if (planId) {
                    //获取单个选课计划的信息
                    let {data: {result, success}} = await this.$api.schedule.plan.schedulegetInfo({planId})
                    this.planData=result.name;
                    this.gradeName=result.gradeName;
                    this.gradeId=result.gradeId;
                    this.currId=result.currId;
                    // console.log(this.currId);
                    this.classType=result.type;
                    // console.log(this.classType);
                    this.morning=result.morning;
                    this.morningread=result.morningread;
                    this.noon=result.noon;
                    this.evening=result.evening;
                    this.aftrernoon=result.aftrernoon;
                    if(this.classType==2){
                        this.choose=true;
                    }
                    this.modalInfo();
                    this.searchClassInfo();
                }
            },
            //获取节次时间
            async modalInfo() {
                // console.log(this.currId);
                //获取时间节
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
                // console.log(this.subOption);
                for(let i=0;i<this.subOption.length;i++){
                    this.subOption[i].key=i;
                }
                this.$set(this.subOption);
                // console.log(this.subOption);
                // console.log(list);
                this.subjectTimeRule();
                this.teacherTimeRule();
                this.classTimeRule();
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
                        //==================================
                        //节次转换
                        //     //字符串转换为数组
                        let timeLesson = timeItem.timeLesson.split(',');
                        // console.log(timeLesson);
                        let keyDatas=[];
                        for(let i=0;i<this.subOption.length;i++){
                            for(let j=0;j<timeLesson.length;j++){
                                if(Number(timeLesson[j])===this.subOption[i].key){
                                    keyDatas.push(this.subOption[i].label);
                                }
                            }
                        }
                        // console.log(keyDatas);
                        //=================================================
                        let timeType = "";
                        let type = timeItem.timeType
                        switch (type) {
                                case "1":timeType = "不使用";break;
                                case "2":timeType = "优先使用";break;
                                case "3":timeType = "必须使用";break;
                            }
                        item.time1=timeType+timeDay+keyDatas.toString();
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
                // console.log(data);
                for(let i in data.result){
                    let pushData={
                        subId:data.result[i].subId,
                        subName:data.result[i].subName,
                    }
                    this.subjectData.push(pushData);
                }
                // console.log(this.subjectData);
            },
            //学科设置规则删除
            subjectTimeDelete(id){
                this.delete(id);
                this.subjectTimeRule();
            },
            //获取删除接口
            async delete(ids){
                let {data}=await this.$api.schedule.adminClass.deleteRule({ids:[ids]});
                // console.log(data);
                if(data&&data.success){
                    message.info("删除成功！");
                }else{
                    message.info("删除失败！");
                }
            },
            //学科时间规则的课时设置
            subTimeRegularSettingEdit(index){
                // console.log(index);
                this.editSubIndex=index;
                this.subTimeRegularVisit = true;
                // console.log(this.studyTimeData[this.editSubIndex].timeRuleSetting);
                this.form.subType=this.studyTimeData[this.editSubIndex].timeRuleSetting[0].timeType;
                this.form.subDay=this.studyTimeData[this.editSubIndex].timeRuleSetting[0].timeDay;
                let timeRule=this.studyTimeData[this.editSubIndex].timeRuleSetting[0].timeLesson.split(",");
                let timeLesson=[];
                // console.log(this.subOption);
                for(let i=0;i<this.subOption.length;i++){
                    for(let j=0;j<timeRule.length;j++){
                        if(Number(timeRule[j])===this.subOption[i].key){
                            timeLesson.push(this.subOption[i].value);
                        }
                    }
                }
                // console.log(timeLesson);
                this.form.subTimeValue=timeLesson;
            },
            //保存学科时间设置时间规则弹框
            handleOkSubTime(){
                // console.log(this.form.subDay);
                // console.log(this.form.subType);
                // console.log(this.form.subTimeValue);
                if(this.form.subTimeValue==[] || this.form.subType=="" ||this.form.subDay==""){
                    message.error("输入内容存在空值，请检查！");
                }else {
                    this.subTimeRegularVisit = false;
                    let keyDatas=[];
                    for(let i=0;i<this.subOption.length;i++){
                        for(let j=0;j<this.form.subTimeValue.length;j++){
                            if(this.form.subTimeValue[j]===this.subOption[i].value){
                                keyDatas.push(this.subOption[i].key);
                            }
                        }
                    }
                    // console.log(keyDatas);
                    // console.log(this.studyTimeData[this.editSubIndex].timeRuleSetting);
                    if(this.studyTimeData[this.editSubIndex].timeRuleSetting==null){
                        let pushData={
                            timeDay:this.form.subDay,
                            timeType:this.form.subType,
                            timeLesson:keyDatas.toString()
                        }
                        // console.log(pushData);
                        this.studyTimeData[this.editSubIndex].timeRuleSetting=[];
                        this.studyTimeData[this.editSubIndex].timeRuleSetting.push(pushData);
                    }else{
                        this.studyTimeData[this.editSubIndex].timeRuleSetting[0].timeDay=this.form.subDay;
                        this.studyTimeData[this.editSubIndex].timeRuleSetting[0].timeType=this.form.subType;
                        this.studyTimeData[this.editSubIndex].timeRuleSetting[0].timeLesson=keyDatas.toString();
                    }
                    // console.log(this.studyTimeData[this.editSubIndex].timeRuleSetting);
                    this.form.subDay="";
                    this.form.subTimeValue=[];
                    this.form.subType="";
                }
            },
            //关闭学科时间设置时间规则弹框
            handleCancelSubTime(){
                this.subTimeRegularVisit = false;
                this.form.subDay="";
                this.form.subTimeValue=[];
                this.form.subType="";
            },
            //添加学科时间规则(添加一项）
            async addSubjectTimeRegular(){
                let addData={
                    planId:this.planId,
                    ruleType:1,
                }
                let {data}=await this.$api.schedule.adminClass.addRuleSetting(addData);
                // console.log(data);
                if(data&&data.success){
                    message.success("新建学科时间规则成功！");
                    this.subjectTimeRule();
                }else{
                    message.error("新建学科时间规则失败！");
                }
            },
            //修改学科
            async changSubId(info,index){
              this.studyTimeData[index].subId=info;
              // console.log(info);
              // console.log(this.studyTimeData[index].subId);
            },
            //保存学科时间规则设置
            async subjectTimeSave(index){
                // console.log(index);
                // console.log(this.studyTimeData[index]);
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
                let {data}=await this.$api.schedule.adminClass.addRuleSetting(addData);
                // console.log(data);
                if(data&&data.success){
                    this.subjectTimeRule()
                    message.success("保存成功！");
                }else{
                    message.error("保存失败！");
                }
            },
            //=======================================================
            //教师时间规则
            //=========================================================
            //教师时间规则查看
            async teacherTimeRule(){
                // this.teacherTimeData=[];
                //获取教室时间规则
                let {data:{result,success}}=await this.$api.schedule.adminClass.searchTeacherTimeRule({
                    planId:this.planId})
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
                        //==================================
                        //节次转换
                        let timeLesson = timeItem.timeLesson.split(',');
                        // console.log(timeLesson);
                        let keyDatas=[];
                        // console.log(this.subOption);
                        for(let i=0;i<this.subOption.length;i++){
                            for(let j=0;j<timeLesson.length;j++){
                                if(Number(timeLesson[j])===this.subOption[i].key){
                                    keyDatas.push(this.subOption[i].label);
                                }
                            }
                        }
                        // console.log(keyDatas);
                        //=================================================
                        let timeType = "";
                        let type = timeItem.timeType
                        // console.log(type);
                        switch (type) {
                            case "1":timeType = "不使用";break;
                            case "2":timeType = "优先使用";break;
                            case "3":timeType = "必须使用";break;
                        }
                        item.time1=timeType+timeDay+keyDatas.toString();
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
                console.log(this.teacherTimeData[index].timeRuleSetting);
                this.form.teacherType=this.teacherTimeData[index].timeRuleSetting[0].timeType;
                this.form.teacherDay=this.teacherTimeData[index].timeRuleSetting[0].timeDay;
                let timeRule=this.teacherTimeData[index].timeRuleSetting[0].timeLesson.split(",");
                let timeLesson=[];
                // console.log(this.subOption);
                for(let i=0;i<this.subOption.length;i++){
                    for(let j=0;j<timeRule.length;j++){
                        if(Number(timeRule[j])===this.subOption[i].key){
                            timeLesson.push(this.subOption[i].value);
                        }
                    }
                }
                // console.log(timeLesson);
                this.form.teacherTimeValue=timeLesson;
            },
            //保存教师时间规则弹框
            handleOkTeaTime(){
                if(this.form.teacherTimeValue==[] || this.form.teacherType=="" ||this.form.teacherDay==""){
                    message.error("输入内容存在空值，请检查！");
                }else{
                    this.teacherTimeRegularVisit=false;
                    let keyDatas=[];
                    for(let i=0;i<this.subOption.length;i++){
                        for(let j=0;j<this.form.teacherTimeValue.length;j++){
                            if(this.form.teacherTimeValue[j]===this.subOption[i].value){
                                keyDatas.push(this.subOption[i].key);
                            }
                        }
                    }
                    if(this.teacherTimeData[this.editTeacherIndex].timeRuleSetting==null){
                        let pushData={
                            timeDay:this.form.teacherDay,
                            timeType:this.form.teacherType,
                            timeLesson:keyDatas.toString()
                        }
                        this.teacherTimeData[this.editTeacherIndex].timeRuleSetting=[];
                        this.teacherTimeData[this.editTeacherIndex].timeRuleSetting.push(pushData);
                    }else{
                        this.teacherTimeData[this.editTeacherIndex].timeRuleSetting[0].timeDay=this.form.teacherDay;
                        this.teacherTimeData[this.editTeacherIndex].timeRuleSetting[0].timeType=this.form.teacherType;
                        this.teacherTimeData[this.editTeacherIndex].timeRuleSetting[0].timeLesson=keyDatas.toString();
                    }
                    console.log(this.teacherTimeData[this.editTeacherIndex].timeRuleSetting);
                    this.form.teacherDay="";
                    this.form.teacherType="";
                    this.form.teacherTimeValue=[];
                }
            },
            //关闭教师时间规则弹框
            handleCancelTeaTime(){
                this.teacherTimeRegularVisit=false;
                this.form.teacherDay="";
                this.form.teacherType="";
                this.form.teacherTimeValue=[];
            },
            //添加教师时间规则(添加一项)
            async addTeacherTimeRegular(){
                let addData={
                    planId:this.planId,
                    ruleType:"2",
                }
                let {data}=await this.$api.schedule.adminClass.addRuleSetting(addData);
                console.log(data);
                if(data&&data.success){
                    message.success("新建教师时间规则成功！");
                    this.teacherTimeRule();
                }else{
                    message.error("新建教师时间规则失败！");
                }
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
                // console.log(result);
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
            //保存教师时间规则
            async teacherTimeSave(index){
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
                let {data}=await this.$api.schedule.adminClass.addRuleSetting(addData);
                console.log(data);
                if(data&&data.success){
                    message.success("保存成功！");
                    this.teacherTimeRule();
                }else{
                    message.error("保存失败！")
                }
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
            async handleOk(){
                this.teacherVisit=false;
                this.teacherTimeData[this.teachId].teacherName=this.selectedRows[0].teacherName;
                this.teacherTimeData[this.teachId].teacherId=this.selectedRows[0].teacherId;
                console.log(this.teacherTimeData[this.teachId]);
                let addData= {
                    id: this.teacherTimeData[this.teachId].id,
                    planId: this.planId,
                    ruleType: "2",
                    teacherId: this.teacherTimeData[this.teachId].teacherId,
                }
                let {data}=await this.$api.schedule.adminClass.addRuleSetting(addData);
                console.log(data);
                if(data&&data.success){
                    message.info("保存成功！");
                    this.teacherTimeRule();
                }else{
                    message.info("保存失败");
                }
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
                    item.class=item.gradeName+item.className;
                    console.log(item.class);
                    // console.log(item);
                    if(item.timeRuleSetting) {
                        let timeItem = item.timeRuleSetting[0];
                        let timeDay = "";
                        //星期转换
                        for (let i = 1; i < 8; i++) {
                            if (timeItem.timeDay == i) {
                                timeDay = "星期" + i;
                            }
                            // console.log(timeDay);
                        }
                        //==================================
                        //     //字符串转换为数组
                        let timeLesson = timeItem.timeLesson.split(',');
                        // console.log(timeLesson);
                        let keyDatas = [];
                        for (let i = 0; i < this.subOption.length; i++) {
                            for (let j = 0; j < timeLesson.length; j++) {
                                if (Number(timeLesson[j]) === this.subOption[i].key) {
                                    keyDatas.push(this.subOption[i].label);
                                }
                            }
                        }
                        // console.log(keyDatas);
                        //=================================================
                        let timeType = "";
                        let type = timeItem.timeType
                        switch (type) {
                            case "1":
                                timeType = "不使用";
                                break;
                            case "2":
                                timeType = "优先使用";
                                break;
                            case "3":
                                timeType = "必须使用";
                                break;
                        }
                        item.time1 = timeType + timeDay + keyDatas.toString();
                    }
                })
                console.log(this.classTimeData);
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
                console.log(this.classTimeData[index].timeRuleSetting);
                this.form.classType=this.classTimeData[index].timeRuleSetting[0].timeType;
                this.form.classDay=this.classTimeData[index].timeRuleSetting[0].timeDay;
                let timeRule=this.classTimeData[index].timeRuleSetting[0].timeLesson.split(",");
                let timeLesson=[];
                // console.log(this.subOption);
                for(let i=0;i<this.subOption.length;i++){
                    for(let j=0;j<timeRule.length;j++){
                        if(Number(timeRule[j])===this.subOption[i].key){
                            timeLesson.push(this.subOption[i].value);
                        }
                    }
                }
                // console.log(timeLesson);
                this.form.classTimeValue=timeLesson;
            },
            //保存编辑时间规则弹框
            handleOkClaTime(){
                if(this.form.classTimeValue==[] || this.form.classType=="" ||this.form.classDay==""){
                    message.error("输入内容存在空值，请检查！");
                }else{
                    this.classTimeRegularVisit=false;
                    let keyDatas=[];
                    for(let i=0;i<this.subOption.length;i++){
                        for(let j=0;j<this.form.classTimeValue.length;j++){
                            if(this.form.classTimeValue[j]===this.subOption[i].value){
                                keyDatas.push(this.subOption[i].key);
                            }
                        }
                    }
                    console.log(this.classTimeData[this.editclassIndex].timeRuleSetting)
                    if(this.classTimeData[this.editclassIndex].timeRuleSetting==null){
                        let pushData={
                            timeDay:this.form.classDay,
                            timeType:this.form.classType,
                            timeLesson:keyDatas.toString()
                        }
                        console.log(pushData);
                        this.classTimeData[this.editclassIndex].timeRuleSetting=[];
                        this.classTimeData[this.editclassIndex].timeRuleSetting.push(pushData);
                    }else{
                        this.classTimeData[this.editclassIndex].timeRuleSetting[0].timeDay=this.form.classDay;
                        this.classTimeData[this.editclassIndex].timeRuleSetting[0].timeType=this.form.classType;
                        this.classTimeData[this.editclassIndex].timeRuleSetting[0].timeLesson=keyDatas.toString();
                    }
                    console.log(this.classTimeData[this.editclassIndex].timeRuleSetting);
                    this.form.classDay="";
                    this.form.classType="";
                    this.form.classTimeValue=[];
                }
            },
            //取消编辑时间规则弹框
            handleCancelClaTime(){
                this.classTimeRegularVisit=false;
                this.form.classDay="";
                this.form.classType="";
                this.form.classTimeValue=[];
            },
            //修改学科
            changeClassSub(info,index){
                this.classTimeData[index].classSubjectId=info;
                console.log(info);
            },
            //添加班级时间规则(添加一项）
            async addClassTimeRegular(){
                let addData={
                    planId:this.planId,
                    ruleType:"3",
                }
                let {data}=await this.$api.schedule.adminClass.addRuleSetting(addData);
                console.log(data);
                if(data&&data.success){
                    message.success("新建班级时间规则成功！");
                    this.classTimeRule();
                }else{
                    message.error("新建班级时间规则失败！");
                }
            },
            //修改班级
             changeClass(info,index){
                // console.log(info);
                // console.log(index);
                this.classTimeData[index].classId=info;
            },
            //班级信息查看
            async searchClassInfo(){
                console.log(this.gradeId);
                let {data:{result,success}}=await this.$api.schedule.adminClass.getClassSetting({
                    planId:this.planId,
                    gradeId:this.gradeId});
                console.log(result);
               for(let i in result){
                   let addData={
                       gradeClass:result[i].gradeName+result[i].className,
                       classId:result[i].classId
                   }
                   this.classData.push(addData);
               }
                console.log(this.classData);
            },
            //班级时间规则保存
            async classTimeSave(index){
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
                let {data}=await this.$api.schedule.adminClass.addRuleSetting(addData);
                console.log(data);
                if(data&&data.success){
                    message.success("保存成功！");
                    this.classTimeRule();
                }else{
                    message.error("保存失败！")
                }
            },
            //========================================================
            //禁止相邻规则查看
            //===========================================================
            //禁止相邻规则查看
            async banNearRule(){
              let {data:{result,success}}=await this.$api.schedule.adminClass.searchBanRule({planId:this.planId});
              // console.log(result);
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
            async addBanRegular(){
                let addData={
                    planId:this.planId,
                }
                let {data}=await this.$api.schedule.adminClass.addBanRule(addData);
                console.log(data);
                if(data&&data.success){
                    message.success("新建禁止相邻科目成功!");
                    this.banNearRule();
                }else{
                    message.error("新建禁止相邻科目失败!");
                }
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
            async banTimeSave(index){
                let addData={
                    id:this.banData[index].id,
                    planId:this.planId,
                    continuityNum:this.banData[index].continuityNum,
                    subChildIdOne:this.banData[index].subChildIdOne,
                    subChildIdTwo:this.banData[index].subChildIdTwo,
                }
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
                let {data:{result,success}}=await this.$api.schedule.adminClass.searchLessonRule({
                    planId:this.planId});
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
            async addWeekRegular(){
                let addData={
                    planId:this.planId,
                }
                let {data}=await this.$api.schedule.adminClass.addLessonRule(addData);
                console.log(data);
                if(data&&data.success){
                    message.success("新建单双周课程规则成功!");
                    this.singDoubleRule();
                }else{
                    message.error("新建单双周课程规则失败!");
                }
            },
            //删除单双周课程
            async weekTimeDelete(id){
                let {data}=await this.$api.schedule.adminClass.deleteLessonRule({ids:[id]});
                console.log(data);
                if(data&&data.success){
                    message.success("删除成功");
                    this.singDoubleRule();
                }else{
                    message.error("删除失败");
                }
            },
            //保存单双周课程
            async weekTimeSave(index){
                let addData={
                    id:this.weekData[index].id,
                    planId:this.planId,
                    perWeekLessonNum:this.weekData[index].perWeekLessonNum,
                    singleWeekSubId: this.weekData[index].singleWeekSubId,
                    doubleWeekSubId: this.weekData[index].doubleWeekSubId,
                }
                let {data}=await this.$api.schedule.adminClass.addLessonRule(addData);
                console.log(data);
                if(data&&data.success){
                    message.success("保存成功");
                    this.singDoubleRule();
                }else{
                    message.error("保存失败");
                }
            },
            //课时设置
            timesSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/index?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/index?planId=${this.planId}`);
                }
            },
            //课节设置
            oncesSetting(){
                if(this.classType==2){
                    this.$router.push(`/schedule/detail/class_admin/time?planId=${this.planId}&scheduleTaskId=${this.scheduleTaskId}`)
                }else{
                    this.$router.push(`/schedule/detail/class_admin/time?planId=${this.planId}`);
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
            //开始排课
            startArray(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            //下一步
            Next(){
                if(this.classType==2){
                    this.aloClass();
                }else{
                    this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`);
                }
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
                  message.info(data.message);
              }
            },
            //返回
            back(){
                this.$router.go(-1)
            },
            //排课详情查看
            arrangeClass(){
                this.$router.push(`/schedule/detail/index?planId=${this.planId}`);
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
