<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">行政班排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">学科设置</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                <a-col>
                    <button style="background-color: blue;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 100px" @click="back">返回</button>
                </a-col>
            </a-row>
        </div>
        <a-card class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="subjectSetting" >学科设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="classSetting">班级设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="ruleSetting">规则设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <a-table :rowKey="'id'"
                    :columns="columns"
                     :data-source="dataSource"
                     :pagination="false"
                     :bordered="true">
                <a-input slot="every_time"></a-input>
                <a-icon type="edit" slot="class_day"
                        style="color: #00ccff;font-size: 25px;font-weight: bold" @click="editDays"/>
                <a-input slot="maxClass" placeholder="0"></a-input>
                <a-input slot="everySettingTimes" placeholder="0"></a-input>
                <a-input slot="morningClassTimes" placeholder="0"></a-input>
                <a-input slot="afterClassTimes" placeholder="0"></a-input>
                <template slot="priority" slot-scope="text, record">
                    <editable-cell :text="text" @change="onCellChange(record.key, 'priority', $event)" />
                </template>
                <a  slot="action" style="color: blue" slot-scope="text,record" @click="onDelete(record.id)">删除</a>
<!--                <span slot="action" slot-scope="text" style="color:blue" @click="onDelete">{{text}}</span>-->
            </a-table>
            <a-button icon="plus" style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        font-size: 20px;
                        font-weight: bold;
                        border-radius: 5px;
                        margin-top: 30px;
                        width: 150px" @click="add">添加</a-button>
        </a-card>
            <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        margin-top: 150px;
                        margin-bottom: 20px;
                        width: 150px" @click="Next">下一步</button>
<!--            添加课程弹窗-->
            <a-modal
                    title="添加课程"
                    :visible='addCourseModal'
                    :closable="false">
                <template slot="footer">
                    <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                    <a-button key="back" @click="handleCancel">取消</a-button>
                </template>
                <template>
                    <a-input-search v-model="form.course" placeholder="Search" @change="onChange"/>
                    <a-tree
                            :expanded-keys="expandedKeys"
                            :auto-expand-parent="autoExpandParent"
                            :tree-data="gData"
                            @expand="onExpand">
                        <template slot="title" slot-scope="{title}">
                            <span v-if="title.indexOf(searchValue)>-1">
                                {{title.substr(0,title.indexOf(searchValue))}}
                                <span style="color: #f50">{{searchValue}}</span>
                                {{title.substr(title.indexOf(searchValue)+searchValue.length)}}
                            </span>
                            <span v-else>{{title}}</span>
                        </template>
                    </a-tree>
                </template>
            </a-modal>
            <!--        编辑弹窗-->
        <a-modal  title="设置上课天数"
                  :visible='settingLessonDays'
                  :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <a-form-model  style="margin-top: 30px;"  :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}">
                <a-form-model-item label="类型">
                    <a-select placeholder="小于/大于/等于" @change="handleSelectChange">
                        <a-select-option value="1">小于</a-select-option>
                        <a-select-option value="2">大于</a-select-option>
                        <a-select-option value="3">等于</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="天数">
                    <a-input placeholder="请输入"  v-decorator="['天数', { rules: [{ required: true, message: '请输入天数！' }] }]"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>
<script>
    const columns = [
        {
           title:'',
          dataIndex:'id',
          align:'center'
        },
        {
            title: '学科名称',
            dataIndex: 'subName',
            align:'center',
        },
        {
            title: '优先级',
            dataIndex: 'priority',
            align:'center',
            width:'8%',
            scopedSlots: { customRender: 'every_time' },
        },
        {
            title: '每周节数',
            dataIndex: 'lessonWeekly',
            scopedSlots: { customRender: 'every_time' },
            align:'center',
            width:'10%'
        },
        {
            title: '上课天数',
            dataIndex: 'dayNum',
            scopedSlots: { customRender: 'class_day' },
            align:'center',
            width:'8%'
        },
        {
            title: '最大开课数',
            dataIndex: 'lessonMax',
            scopedSlots: { customRender: 'maxClass' },
            align:'center',
            width:'15%'
        },
        {
            title: '每天课时数设置',
            scopedSlots: { customRender: 'everySettingTimes' },
            align:'center',
            width:'15%'
        },
        {
            title: '上午课时数',
            dataIndex: 'lessonMorning',
            align:'center',
            scopedSlots: { customRender: 'morningClassTimes' },
            width:'15%'
        },
        {
            title: '下午课时数',
            dataIndex: 'lessonafternoon',
            align:'center',
            scopedSlots: { customRender: 'afterClassTimes' },
            width:'15%'
        },
        {
            title: '操作',
            dataIndex: 'opt',
            key: 'opt',
            scopedSlots: { customRender: 'action' },
            align:'center',
            width:'5%'
        },
    ];
    const x = 3;
    const y = 2;
    const z = 1;
    const gData = [];

    const generateData = (_level, _preKey, _tns) => {
        const preKey = _preKey || '0';
        const tns = _tns || gData;

        const children = [];
        for (let i = 0; i < x; i++) {
            const key = `${preKey}-${i}`;
            tns.push({ title: key, key, scopedSlots: { title: 'title' } });
            if (i < y) {
                children.push(key);
            }
        }
        if (_level < 0) {
            return tns;
        }
        const level = _level - 1;
        children.forEach((key, index) => {
            tns[index].children = [];
            return generateData(level, key, tns[index].children);
        });
    };
    generateData(z);

    const dataList = [];
    const generateList = data => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const key = node.key;
            dataList.push({ key, title: key });
            if (node.children) {
                generateList(node.children);
            }
        }
    };
    generateList(gData);

    const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };
    const EditableCell = {
        template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input :value="value" @change="handleChange" @pressEnter="check" /><a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"/>
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ value || ' ' }}
          <a-icon type="edit" class="editable-cell-icon" @click="edit" />
        </div>
      </div>`,
        props: {
            text: String,
        },
        data() {
            return {
                value: this.text,
                editable: false,
            };
        },
        methods: {
            handleChange(e) {
                const value = e.target.value;
                this.value = value;
            },
            check() {
                this.editable = false;
                this.$emit('change', this.value);
            },
            edit() {
                this.editable = true;
            },
        },
    };
    export default {
        components: {
            EditableCell,
        },
        data() {
            return {
                inputData: null,
                dataSource:[],
                columns,
                planData:"",
                count:5,
                formLayout:'horizontal',
                form:this.$form.createForm(this,{name:'coordinated'}),
                editText:-1,
                editId:null,
                id:null,
                addCourseModal:false,
                loading:false,
                expandedKeys: [],
                searchValue: '',
                autoExpandParent: true,
                gData,
                settingLessonDays:false,
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
            this.subjectInfo();
        },
        methods: {
            //学科设置查看
            async subjectInfo(){
                let {data}=await this.$api.schedule.adminClass. getCourseSetting({planId:this.planId,scheduleType:1});
                console.log(data)
                // this.dataSource=data.rows
                // console.log(this.dataSource)
            },
            //删除行数据
            async onDelete(id){
                this.editText=this.dataSource.findIndex(item=>item.id==id);
                this.editId=this.dataSource[ this.editText].id
                console.log(this.editId)
                let {data}=await this.$api.schedule.adminClass.deleteCourseSetting({ids:[this.editId]})
                console.log(data);
                // const dataSource = [...this. dataSource];
                // dataSource.splice(event.target.getAttribute('dataIndex'),1);
                // this. dataSource= dataSource
            },
            //添加课程方法
            add(){
                this.addCourseModal=true;
            },
            handleOk(){
              this.addCourseModal=false;
              this.settingLessonDays =false;
            },
            handleCancel(){
                this.addCourseModal=false;
                this.settingLessonDays =false;
            },
            //添加课程中的树
            onExpand(expandedKeys) {
                this.expandedKeys = expandedKeys;
                this.autoExpandParent = false;
            },
            onChange(e) {
                const value = e.target.value;
                const expandedKeys = dataList
                    .map(item => {
                        if (item.title.indexOf(value) > -1) {
                            return getParentKey(item.key, gData);
                        }
                        return null;
                    })
                    .filter((item, i, self) => item && self.indexOf(item) === i);
                Object.assign(this, {
                    expandedKeys,
                    searchValue: value,
                    autoExpandParent: true,
                });
            },
            editDays: function () {
                this.settingLessonDays = true;
            },

            handleSelectChange(value){
                console.log(value);
                this.form.setFieldsValue({
                    note: `3, ${value === '大于' ? '1' : '2'}!`,
                });
            },
            changeSituation(key, index){
                console.log(key, index)
            },
            delSituation(key, index){
                console.log(key, index)
                this.dataSource[key].situation.pop(index)
            },
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
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
                this.$router.push(`/schedule/detail/class_admin/class?planId=${this.planId}`);
            },
            //规则设置
            ruleSetting(){
                this.$router.push(`/schedule/detail/class_admin/rule?planId=${this.planId}`)
            },
            startArray(){
                this.$router.push(`/schedule/detail/start_class?planId=${this.planId}`)
            },
            //下一步
            Next(){
                this.$router.push(`/schedule/detail/class_admin/class?planId=${this.planId}`)
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
        height: 700px;
    }
    .buttons{
        margin:5px 5px 20px 5px;
        padding:2px 4px;
    }
    .buttons button{
        background-color:#e4e4e4;
        color:black;
    }
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
    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
        color: #108ee9;
    }
    .editable-add-btn {
        margin-bottom: 8px;
    }
</style>
