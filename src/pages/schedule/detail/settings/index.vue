
<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">选课设置</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <a-card>
            <a-form-model layout="horizontal" ref="ruleForm" :model="form" :rules="rules" style="overflow: hidden;margin-bottom: 30px"
                          :label-col="{span:4}"
                          :wrapper-col="{span:10}">
                <a-form-model-item label="选课规则" prop="ruleId" ref="rule">
                    <a-select placeholder="请选择" v-model="form.ruleId" :default-value="ruleData[0].ruleId">
                        <a-select-option v-for="(item,index) in ruleData" :value="item.ruleId" :key="index">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="选课类型" prop="selectType">
                    <a-select placeholder="请选择" v-model="form.selectType">
                        <a-select-option value="1">按照老师选择</a-select-option>
                        <a-select-option value="0">不按照老师选择</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-item label="选课开始时间：" prop="time" ref="time">
                    <a-date-picker v-model="startValue"
                                   :disabled-date="disabledStartDate"
                                   show-time
                                   format="YYYY-MM-DD HH:mm:ss"
                                   placeholder="Start"
                                   @openChange="handleStartOpenChange"
                                   valueFormat="YYYY-MM-DD HH:mm:ss"/>
                </a-form-item>
                <a-form-model-item label="选课结束时间">
                    <a-date-picker
                            v-model="endValue"
                            :disabled-date="disabledEndDate"
                            show-time
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="End"
                            :open="endOpen"
                            @openChange="handleEndOpenChange"
                            valueFormat="YYYY-MM-DD HH:mm:ss"/>
                </a-form-model-item>
            </a-form-model>
            <a-table :key="'no'" :columns="columns" :dataSource="dataSource" :pagination='false'>
                <div slot="subjects" slot-scope="data">
                    <a-table
                            :key="'key'"
                            :dataSource="data"
                            :columns="columnsSubjects"
                            :showHeader="false"
                            :pagination="false"
                            bordered
                    >
                        <div slot="isMust" slot-scope="isMust">
                            <a-select  style="width: 100px" >
                                <a-select-option :value="true"> 必选 </a-select-option>
                                <a-select-option :value="false"> 可选 </a-select-option>
                            </a-select>
                        </div>
                        <div slot="teacher" slot-scope="teacher">
                            <a-form-model ref="dynamicValidateForm" :model="dynamicValidateForm">
                                <a-form-model-item
                                        v-for="(domain, index) in dynamicValidateForm.domains"
                                        :key="domain.key"
                                        :prop="'domains.' + index + '.value'"
                                        :rules="{ required: true,message: '请输入人数',trigger: 'blur',}">
                                    <a v-if="dynamicValidateForm.domains.length >1"
                                       style="float: left;color: black"
                                       v-model="dynamicValidateForm.name"></a>
                                    <a-input
                                            v-if="dynamicValidateForm.domains.length >1"
                                            v-model="domain.value"
                                            placeholder="请输入人数"
                                            style="width: 60%; margin-right: 8px"/>
                                    <a
                                            v-if="dynamicValidateForm.domains.length >1"
                                            class="dynamic-delete-button"
                                            type="minus-circle-o"
                                            :disabled="dynamicValidateForm.domains.length === 1"
                                            @click="removeDomain(domain)"
                                            style="color: blue;float: right">删除</a>
                                </a-form-model-item>
                                <a-form-model-item>
                                    <a-button class="add-btn" @click="addTeacher"><a-icon type="plus" />新增老师</a-button>
                                </a-form-model-item>
                            </a-form-model>
                        </div>
                    </a-table>
                </div>
                <a-form-item slot="regular" has-feedback>
                    <a-select
                            v-decorator="['rule',{ rules: [{ required: true, message: '请选择规则!' }] },]"
                            placeholder="覆盖2科"
                            @change="handleSelectChange" style="width: 150px">
                        <!--          <a-select-option value="male">male</a-select-option>-->
                        <!--          <a-select-option value="female">female</a-select-option>-->
                    </a-select>
                </a-form-item>
                <a slot='operate' @click="deleteTypical">删除</a>
            </a-table>
            <div style="margin-top: 30px">
                <h3>选课说明</h3>
                <a-textarea placeholder="请输入" :rows="8" style="width: 1200px" />
            </div>
            <a-row style=" margin-left:500px;margin-top:50px;margin-bottom:10px">
                <button @click="saveAll">baocun</button>
                <!-- <a-col :span="5"><a-button  style="width: 100px;height: 40px;background-color: #1abc9c;color: white" @click="saveAll">保存323232</a-button></a-col> -->
                <a-col :span="5"><a-button style="width: 100px;height: 40px;background-color: red;color: white" @click="Clear">清空</a-button></a-col>
                <a-col> <a-button style="width: 100px;height: 40px;background-color:blue;color: white" @click="back">返回</a-button></a-col>
            </a-row>
            <a-modal
                    :visible='addVisit'
                    width="800px"
                    :closable="false">
                <template slot="footer">
                    <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                    <a-button key="back" @click="handleCancel">取消</a-button>
                </template>
                <a-form :form="form" :label-col="{ span:6 }" :wrapper-col="{ span: 13 }" style="margin-bottom: 300px;margin-top: 50px">
                    <a-form-item label="标题：">
                        <a-tree-select
                                v-model="value"
                                style="width: 100%"
                                :tree-data="treeData"
                                tree-checkable
                                :show-checked-strategy="SHOW_PARENT"
                                placeholder="请选择"/>
                    </a-form-item>
                </a-form>
            </a-modal>
        </a-card>
    </div>
</template>

<script>
    import { TreeSelect } from 'ant-design-vue';
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const columns = [
        {
            title: "类型",
            dataIndex: "type",
            align:'center',
        },
        {
            title: "课程",
            dataIndex: "subjects",
            scopedSlots: { customRender: "subjects" },
            align:'center',
        },
        {
            title: "规则",
            dataIndex: "rule",
            scopedSlots: { customRender: "regular" },
            align:'center',
        },
        {
            title: "操作",
            dataIndex: "operate",
            scopedSlots: { customRender: "operate" },
            align:'center',
        },
    ];
    const columnsSubjects = [
        {
            title: "科目",
            dataIndex: "name",
            align:'center',
        },
        {
            title: "是否可选",
            dataIndex: "isMust",
            scopedSlots: { customRender: "isMust" },
            align:'center',
        },
        {
            title: "老师",
            dataIndex: "teacher",
            scopedSlots: { customRender: "teacher" },
            align:'center',
        },
    ];
    const dataSource = [
        {
            key: '1',
            type: "必修课",
            subjects:[
                {
                    name: "高一数学",
                    isMust: true,
                },
                {
                    name: "高一语文",
                    isMust: true,
                },
            ],
            rule: "覆盖2科",
        },
        {
            key: '2',
            type: "选修课",
            subjects: [
                {
                    name: "高一物理选修",
                    isMust: true,
                },
                {
                    name: "高一生物选修",
                    isMust: true,
                },
            ],
            rule: "覆盖2科",
        },
    ];
    const treeData=[
        {
            title: '高一',
            value: '0-0',
            key: '0-0',
            children: [
                {
                    title: '语文',
                    value: '0-0-0',
                    key: '0-0-0',
                    children: [
                        {
                            title: '张凯元',
                            value: '0-0-0-0',
                            key: '0-0-0-0',
                        },
                        {
                            title: '张凯方',
                            value: '0-0-0-1',
                            key: '0-0-0-1',
                        },
                    ],
                },
            ]},
        {
            title: '高二',
            value: '0-1',
            key: '0-1',
            children: [
                {
                    title: '语文',
                    value: '0-1-0',
                    key: '0-1-0',
                    children: [{
                        title: '张凯元',
                        value: '0-1-0-0',
                        key: '0-1-0-0',
                    }],}
            ]},
    ];
    export default {
        name: "QueryList",
        components: {},
        data() {
            return {
                columns,
                columnsSubjects,
                dataSource: dataSource,
                loading:false,
                addVisit: false,
                value: ['张凯元'],
                treeData,
                SHOW_PARENT,
                startValue: null,
                endValue: null,
                endOpen: false,
                dynamicValidateForm: {
                    domains: [],
                },
                dynamicValidateForm: {
                    domains: [{
                        value: ''
                    }],
                },
                form: {
                },
                rules: {
                    ruleId: [
                        {
                            required: true,
                            message: "请选择所需选课规则",
                            trigger: "blur",
                        },
                    ],
                    selectType: [
                        {
                            required: true,
                            message: "请选择选课类型",
                            trigger: "blur",
                        },
                    ],
                    beginTime: [
                        {
                            required: true,
                            message: "请选择选课开始时间",
                            trigger: "change",
                        },
                    ],
                    endTime: [
                        {
                            required: true,
                            message: "请选择选课结束时间",
                            trigger: "change",
                        },
                    ],
                },
                ruleData:[{name:"",ruleId:""}], //选课规则
                planId:""
            };
        },
        beforeCreate() {
            this.form = this.$form.createForm(this, { name: 'time_related_controls' });
        },
        async created(){
            this.planId = window.location.href.split('?')[1].split('=')[1]
            // 查询所有的选课规则
            let {data} = await this.$api.basic.rule.fetchList()
            this.ruleData = data.rows
            // 选课设置查看
            // let {data:settingData} = await this.$api.schedule.setting.settingGet({planId:this.planId})
            // let this.form
        },
        watch: {
            startValue(val) {
                console.log('startValue', val);
            },
            endValue(val) {
                console.log('endValue', val);
            },
        },
        methods: {
            disabledStartDate(startValue) {
                const endValue = this.endValue;
                if (!startValue || !endValue) {
                    return false;
                }
                return startValue.valueOf() > endValue.valueOf();
            },
            disabledEndDate(endValue) {
                const startValue = this.startValue;
                if (!endValue || !startValue) {
                    return false;
                }
                return startValue.valueOf() >= endValue.valueOf();
            },
            handleStartOpenChange(open) {
                if (!open) {
                    this.endOpen = true;
                }
            },
            handleEndOpenChange(open) {
                this.endOpen = open;
            },
            handleSelectChange(value) {
                console.log(value);
                this.form.setFieldsValue({
                    // note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
                });
            },
            addTeacher(){
                this.addVisit=true;

            },
            deleteTypical(key){
                const dataSource = [...this.dataSource];
                this.dataSource= dataSource.filter(item => item.key !== key);
            },
            handleOk() {
                this.loading = true;
                setTimeout(() => {
                    this.dynamicValidateForm.domains.push({
                        value: '',
                        key: Date.now()
                    });
                    this.dynamicValidateForm.name=this.value;
                    this.addVisit=false;
                    this.loading = false;
                }, 2000);
            },
            handleCancel() {
                this.addVisit=false;
            },
            async saveAll(){
                let {data} = this.$api.schedule.setting.settingAdd({
                    planId:this.planId,
                    ...this.form,
                    time_limit: this.startValue + ' - '+this.endValue,
                    tips:'',

                })
                console.log("saveall",data)
            },
            Clear(){
                this.form.setFieldsValue();
            },
            back(){
                this.$router.go(-1)
            },
            removeDomain(item) {
                let index = this.dynamicValidateForm.domains.indexOf(item);
                if (index !== -1) {
                    this.dynamicValidateForm.domains.splice(index, 1);
                }
            },
            addDomain() {
                this.dynamicValidateForm.domains.push({
                    value: '',
                    key: Date.now(),
                });
            },
        },
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
    .search {
        margin-bottom: 54px;
    }
    .fold {
        width: calc(100% - 216px);
        display: inline-block;
    }
    .operator {
        margin-bottom: 18px;
    }
    .teacher {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin: 5px;
    }
    .add-btn {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100px;
        margin: 10px auto 0 auto;
        padding: 5px;
        border: 1px solid;
        border-radius: 6px;
    }
    @media screen and (max-width: 900px) {
        .fold {
            width: 100%;
        }
    }
</style>
