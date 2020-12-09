<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">修改选课结果</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="12">
                        <span style="font-size:1.5em">高一2019-2020第一学期选课结果</span>
                        <span class="link-font-color" style="margin-left:2em">选课时间：2020/03/01 ——2020/03/15</span>
                        <span class="link-font-color" style="margin-left:2em">选课中</span>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: #1abc9c;color: white" @click="changeTime">修改选课时间</a-button></a-col>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: red;color: white" @click="Clear">清空</a-button></a-col>
                        <a-col :span="6" ><a-button style="width: 150px;height: 50px;background-color: blue;color: white" @click="back" >返回</a-button></a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <!--       修改选课时间弹窗-->
        <a-modal
                :visible="visible"
                :loading="loading"
                :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <a-form :form="form" :label-col="{ span:9 }" :wrapper-col="{ span: 5}">
                <a-form-item label="选课开始时间：" prop="time" ref="time">
                    <a-date-picker v-model="startValue"
                        show-time
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="Start"
                        openChange="handleStartOpenChange"/>
                </a-form-item>
                <a-form-model-item label="选课结束时间" >
                    <a-date-picker v-model="endValue"
                        show-time
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="End"
                        :open="endOpen"
                        @openChange="handleEndOpenChange"/>
                </a-form-model-item>
            </a-form>
        </a-modal>
        <div class="info link-font-color">
            已有900人选课 （共1000人）<font style="color:red">100人未选</font></div>
        <div class="table-bg">
            <!-- statistics -->
            <!-- table -->
            <a-table
                    :key="'key'"
                    :columns="columns"
                    :data-source="classData"
                    :bordered = "true"
                    :pagination = "false">
                <span slot="add" @click="addStudent">添加</span>
                <div slot="group">
                    <template v-for="(tag, index) in tags">
                        <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                            <a-tag :key="tag" :closable="index !== 0" @close="() => handleClose(tag)">
                                {{ `${tag.slice(0, 20)}...` }}
                            </a-tag>
                        </a-tooltip>
                        <a-tag v-else :key="tag" :closable="index !== 0" @close="() => handleClose(tag)">
                            {{ tag }}
                        </a-tag>
                    </template>
                    <a-input
                            v-if="inputVisible"
                            ref="input"
                            type="text"
                            size="small"
                            :style="{ width: '78px' }"
                            :value="inputValue"
                            @change="handleInputChange"
                            @blur="handleInputConfirm"
                            @keyup.enter="handleInputConfirm"
                    />
                    <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
                        <a-icon type="plus" /> New Tag
                    </a-tag>
                </div>
            </a-table>
            <!-- table -->
            <!-- statistics -->
        </div>
        <a-modal
                :visible='addVisit'
                width="600px"
                :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}"
                    style="">
                <a-form-item label="未选课人员：">
                    <a-radio-group v-decorator="['未选课人员：']">
                        <a-radio value="a">
                           杨安宁
                        </a-radio>
                        <a-radio value="b">
                            车东明
                        </a-radio>
                        <a-radio value="c">
                            张凯元
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
    import CreateModal from "../../../../components/modal/CreateModal";
    import moment from "moment";
    const columns = [
        {
            title: '课程',
            dataIndex: 'name',
            align:'center',
            width:'8%',
        },
        {
            title: '已选人数',
            dataIndex: 'count',
            align:'center',
            width:'5%',
        },
        {
            title: '课程组合',
            dataIndex: 'group',
            align:'center',
            width:'80%',
            scopedSlots: { customRender: "group" },
        },
        {
            title: '操作',
            dataIndex: 'add',
            align:'center',
            scopedSlots:{customRender:'add'},
            width:'7%',
        },
    ]
    const classData = [
        {
            key: 0,
            name: '政治学修',
            count: 600,
        },
        {
            key: 1,
            name: '政治选修',
            count: 200,
        },
        {
            key: 2,
            name: '物理学修',
            count: 100,
        },
    ];
    export default {
        data() {
            return {
                size : "small",
                classData,
                columns,
                visible:false,
                addVisit:false,
                loading:false,
                startValue: null,
                endValue: null,
                endOpen: false,
                tags: ['周翔', '张敏钰', '张凌伟','许佳诺','徐宏达','徐鼎钦','肖若愚','吴静希','翁柳琪'],
                inputVisible: false,
                inputValue: ''
            };
        },
        beforeCreate() {
            this.form = this.$form.createForm(this, { name: 'time_related_controls' });
        },
        methods: {
            changeTime(){
                this.visible=true;
            },
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
            closed: function () {
                this.visible = false
                this.loading = false
            },
            addStudent(){
                this.addVisit=true;
            },
            handleOk() {
                this.loading = true;
                setTimeout(() => {
                    this.addVisit = false;
                    this.visible=false;
                    this.loading = false;
                }, 2000);
            },
            handleCancel() {
                this.addVisit = false;
                this.visible=false;
            },
            back(){
                this.$router.go(-1)
            },
            Clear(){
                this. classData=[]
            },
            handleClose(removedTag) {
                const tags = this.tags.filter(tag => tag !== removedTag);
                console.log(tags);
                this.tags = tags;
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(function() {
                    this.$refs.input.focus();
                });
            },
            handleInputChange(e) {
                this.inputValue = e.target.value;
            },
            handleInputConfirm() {
                const inputValue = this.inputValue;
                let tags = this.tags;
                if (inputValue && tags.indexOf(inputValue) === -1) {
                    tags = [...tags, inputValue];
                }
                console.log(tags);
                Object.assign(this, {
                    tags,
                    inputVisible: false,
                    inputValue: '',
                });
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
    }
</style>
