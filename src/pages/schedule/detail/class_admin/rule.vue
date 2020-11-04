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
                <a-col :span="17"><span style="font-size:1.5em">高一2019-2020第一学期排课计划</span></a-col>
                <a-col><button style="background-color: blue; color: white;height: 40px; border: none;border-radius: 5px;
                        float: right;width: 100px">返回</button>
                </a-col>
            </a-row>
        </div>
        <div class="table-bg">
            <a-row class="buttons">
                <a-button style="width: 100px;height: 40px;float: left;" @click="timesSetting">课时设置</a-button>
                <a-button style="width: 100px;height: 40px ;float: left;margin-left: 50px" @click="oncesSetting" >课节设置</a-button>
                <a-button style="width: 100px;height: 40px;float: left;margin-left: 50px" @click="placeSetting">教师设置</a-button>
                <a-button style="width: 100px;height: 40px;float: left;margin-left: 50px" @click="courseSetting">课程设置</a-button>
                <a-button style="width: 100px;height: 40px;float: left;margin-left: 50px" @click="startArray">开始排课</a-button>
            </a-row>
            <div class="table">
                <template>
                    <a-descriptions bordered>
                        <a-descriptions-item label="学科时间规则" >
                            <a-table  :columns="column1"
                                      :data-source="studyTimeData"
                                      :pagination="false"
                                      rowKey="column1Id"
                                      :bordered="true">
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
                                    <a-icon  type="edit" @click="timeRegularSetting"  style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="action">
                                    <span  style="color:blue;float:left">删除</span>
                                    <span  style="color:blue;float:right">保存</span>
                                </div>
                            </a-table>
<!--                            @click="addSubjectTimeRegular"-->
                            <div style="margin-top: 10px;margin-bottom: -5px;float: left;font-size: 1.0rem;color: blue;"  class="editable-add-btn" @click="handleAdd">
                                <a-icon type="plus" />
                                <span>添加规则 </span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                    <a-descriptions bordered>
                        <a-descriptions-item label="教师时间规则">
                            <a-table  :columns="column2"
                                      :data-source="teacherTimeData"
                                      :pagination="false"
                                      rowKey="column2Id"
                                      :bordered="true">
                                <div slot="teachers" slot-scope="teacher">
                                    <span>{{teacher}}</span>
                                    <a-icon type="edit" @click="addTeacher"  style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="timeSetting1" slot-scope="time1">
                                    <span style="float: left">{{time1}}</span>
                                    <a-icon type="edit" @click="timeRegularSetting" style="float: right;font-weight:bold;font-size:1.5em;color:#0099ff"/>
                                </div>
                                <div slot="action">
                                    <span  style="color:blue;float:left">删除</span>
                                    <span  style="color:blue;float:right">保存</span>
                                </div>
                            </a-table>
                            <div style=" margin-top: 10px;margin-bottom: -5px; float: left; font-size: 1.0rem;color: blue;"
                                 @click="addTeacherTimeRegular">
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
                                      rowKey="column3Id"
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
                                    <span  style="color:blue;float:left">删除</span>
                                    <span  style="color:blue;float:right">保存</span>
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
                    color: blue;" @click="addBanRegular">
                                <a-icon type="plus" />
                                <span> 添加规则 </span>
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
                    color: blue;" @click="addWeekRegular">
                                <a-icon type="plus" />
                                <span>添加规则</span>
                            </div>
                        </a-descriptions-item>
                    </a-descriptions>
                </template>
                <button style="background-color: #00ccff;margin-top:100px; color: white;height: 40px;border: none;
                border-radius: 5px; width: 200px" >下一步</button>
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
                 width="900px"
                 title="任课老师"
                 :closable="false"
                 on-ok="handleOk">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存
                </a-button>
                <a-button key="back" @click="handleCancel">取消
                </a-button>
            </template>
            <div class="model2_content">
                <template>
                    <a-form @submit="handleSubmit">
                        <a-row style="margin-top: 20px;margin-left: 50px">
                            <a-col :span="4"><a-form-item style="width: 200px;"><a-select
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
                            </a-select></a-form-item></a-col>
                            <a-col :span="4"><a-form-item style="width: 200px;margin-left: 80px">
                                <a-select
                                        v-decorator="[{ rules: [{ required: true, message: 'Please select your subject!' }] },]"
                                        placeholder="所有科目"
                                        @change="handleSelectChange3">
                                </a-select>
                            </a-form-item></a-col>
                            <a-col :span="4"> <a-form-item style="width: 200px;margin-left:170px">
                                <a-input placeholder="姓名" v-decorator="['note', { rules: [{ required: true, message: '姓名' }] }]"/>
                            </a-form-item></a-col>
                            <a-col><a-form-item>
                                <a-button style="background-color: #8c8c8c;color:white;width:80px;margin-left:250px"  html-type="search">查询</a-button>
                            </a-form-item></a-col>
                        </a-row>
                        <a-row>
                            <a-table :columns="editColumn"
                                     :data-source="editData"
                                     :pagination="false"
                                     :bordered="true" style="width: 600px;margin-left: 100px;margin-bottom: 100px">
                                <a-radio slot="editCheck"></a-radio>
                            </a-table>
                        </a-row>
                    </a-form>
                </template>
            </div>
        </a-modal>
<!--        添加学科时间规则-->
        <a-modal :visible='subjectTimeVisit'
                 width="600px"
                 :closable="false"
                 on-ok="handleOk">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存
                </a-button>
                <a-button key="back" @click="handleCancel">取消
                </a-button>
            </template>
        </a-modal>
        <!--        添加教师时间规则-->
        <a-modal :visible='teacherTimeVisit'
                 width="600px"
                 :closable="false"
                 on-ok="handleOk">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存
                </a-button>
                <a-button key="back" @click="handleCancel">取消
                </a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
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
        },
    ]
    const editColumn=[
        {
            title:' ',
            key:'editblank',
            dataIndex:'editblank',
            align:'center',
            scopedSlots:{customRender:'editCheck'},
            width:'8%'
        },{
            title:'序号 ',
            key:'serialNum',
            dataIndex:'serialNum',
            align:'center',
            width:'15%'
        },{
            title:'姓名 ',
            key:'name',
            dataIndex:'name',
            align:'center',
            width:'20%'
        },{
            title:'所教年级 ',
            key:'senior',
            dataIndex:'senior',
            align:'center',
            width:'25%'
        },{
            title:'所教学科 ',
            key:'subject',
            dataIndex:'subject',
            align:'center',
            width:'32%'
        },
    ]
    const editData=[
        {
            serialNum:'1',
            name:'张凯元',
            senior:'高一',
            subject:'语文',
        },{
            serialNum:'2',
            name:'张凯方',
            senior:'高一',
            subject:'数学',
        },{
            serialNum:'3',
            name:'张凯扁',
            senior:'高一',
            subject:'体育',
        },{
            serialNum:'4',
            name:'刘老师',
            senior:'高一',
            subject:'物理',
        },]
    export default {
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
                editColumn,
                editData,
                timeRegularVisit: false,
                loading:false,
                teacherVisit:false,
                subjectTimeVisit:false,
            };
        },
        methods:{
            timesSetting(){
                this.$router.push('/schedule/detail/sort_course/index')
            },
            oncesSetting(){
                this.$router.push('/schedule/detail/sort_course/time')
            },
            placeSetting(){
                this.$router.push('/schedule/detail/sort_course/place')
            },
            courseSetting(){
                this.$router.push('/schedule/detail/sort_course/course/index')
            },
            startArray(){
                this.$router.push('/schedule/detail/start_class')
            },
            Next(){
                this.$router.push('/schedule/detail/class_admin/rule')
            },
            timeRegularSetting() {
                this.timeRegularVisit = true;
            },
            addTeacher(){
                this.teacherVisit=true;
            },
            addSubjectTimeRegular(){
                this.subjectTimeVisit=true
            },
            addTeacherTimeRegular(){},
            addClassTimeRegular(){},
            addWeekRegular(){},
            addBanRegular(){},
            handleSelectChange(){

            },
            handleOk() {
                this.loading = true;
                setTimeout(() => {
                    this.timeRegularVisit = false;
                    this.teacherVisit = false;
                    this.subjectTimeVisit=false;
                    this.loading = false;
                }, 2000);
            },
            handleCancel() {
                this.timeRegularVisit = false;
                this.teacherVisit= false;
                this.subjectTimeVisit=false;
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
