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
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: #1abc9c;color: white">
                            <router-link to="/schedule/detail/statistics/edit">修改选课结果</router-link></a-button></a-col>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: red;color: white">清空</a-button></a-col>
                        <a-col :span="6" ><a-button style="width: 150px;height: 50px;background-color: blue;color: white" @click="back" >返回</a-button></a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <!--       修改选课时间弹窗-->
        <create-modal
                width="760px"
                :visible="visible"
                :loading="loading"
                :close="false"
                @modalClosed="closed"
                @modalSubmit="handleSubmit">
            <div slot="content">
                <a-form :form="form" :label-col="{ span:5 }" :wrapper-col="{ span: 10}" @submit="handleSubmit">
                    <a-form-item label="选课时间：" prop="type">
                        <a-range-picker
                                :disabled-date="disabledDate"
                                :disabled-time="disabledRangeTime"
                                :show-time="{hideDisabledOptions: true,
                                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],}"
                                format="YYYY-MM-DD HH:mm:ss"
                                :placeholder="['开始时间', '结束时间']"
                                style="width: 560px"/>
                    </a-form-item>
                </a-form>
            </div>
        </create-modal>
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
                    :pagination = "false"
            >
                <span slot="add" @click="addStudent">添加</span>
            </a-table>
            <!-- table -->
            <!-- statistics -->
        </div>
        <a-modal
                :visible='addVisit'
                width="600px"
                :closable="false"
                on-ok="handleOk">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
                    保存
                </a-button>
                <a-button key="back" @click="handleCancel">
                    取消
                </a-button>
            </template>
            <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="addClassHandleSubmint"
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
            group:`周翔 X  张敏钰 X  张凌玮 X  许家锘 X  徐弘达 X  徐鼎钦 X  肖若渝 X  吴静希 X  翁柳琪 X  王永畅 X
    王鑫 X  汪宗远 X  唐翊轩 X  石达媛 X  刘善茹 X  刘铭 X  刘骞 X  廖俪淇 X  李敬轩 X  黄梓晴 X  黄奕钧 X  黄乐贤 X
    // 黄凯莹 X  黄河清 X  杜蔚婷 X  池绮欣 X  池菲杨 X  蔡莹璎 X  蔡昊霖 X  钟锶琪 X  郑英东 X  郑阳 X  詹妍琦 X  詹钧豪 X
    杨榕 X  冼君浩 X  危滨莎 X  王子琳X  万靖雯 X  陶鑫 X  邱伟杰 X  彭瀛浩 X  潘浩焯 X  莫昊阳 X  罗铭泽 X  刘企峰 X  刘曼丹 X
    林梓墉 X  林青云 X  梁嘉琪 X  李泉德 X  李朗鸣 X  李凯熙 X`,
        },
        {
            key: 1,
            name: '政治选修',
            count: 200,
            group:`周翔 X  张敏钰 X  张凌玮 X  许家锘 X  徐弘达 X  徐鼎钦 X  肖若渝 X  吴静希 X  翁柳琪 X  王永畅 X
    王鑫 X  汪宗远 X  唐翊轩 X  石达媛 X  刘善茹 X  刘铭 X  刘骞 X  廖俪淇 X  李敬轩 X  黄梓晴 X  黄奕钧 X  黄乐贤 X
    黄凯莹 X  黄河清 X  杜蔚婷 X  池绮欣 X  池菲杨 X  蔡莹璎 X  蔡昊霖 X  钟锶琪 X  郑英东 X  郑阳 X  詹妍琦 X  詹钧豪 X
    杨榕 X  冼君浩 X  危滨莎 X  王子琳 X  万靖雯 X  陶鑫 X  邱伟杰 X  彭瀛浩 X  潘浩焯 X  莫昊阳 X  罗铭泽 X  刘企峰 X  刘曼丹 X
    林梓墉 X  林青云 X  梁嘉琪 X  李泉德 X  李朗鸣 X  李凯熙 X`,
        },
        {
            key: 2,
            name: '物理学修',
            count: 100,
            group:`周翔 X  张敏钰 X  张凌玮 X  许家锘 X  徐弘达 X  徐鼎钦 X  肖若渝 X  吴静希 X  翁柳琪 X  王永畅 X
    王鑫 X  汪宗远 X  唐翊轩 X  石达媛 X  刘善茹 X  刘铭 X  刘骞 X  廖俪淇 X  李敬轩 X  黄梓晴 X  黄奕钧 X  黄乐贤 X
    黄凯莹 X  黄河清 X  杜蔚婷 X  池绮欣 X  池菲杨 X  蔡莹璎 X  蔡昊霖 X  钟锶琪 X  郑英东 X  郑阳 X  詹妍琦 X  詹钧豪 X
    杨榕 X  冼君浩 X  危滨莎 X  王子琳 X  万靖雯 X  陶鑫 X  邱伟杰 X  彭瀛浩 X  潘浩焯 X  莫昊阳 X  罗铭泽 X  刘企峰 X  刘曼丹 X
    林梓墉 X  林青云 X  梁嘉琪 X  李泉德 X  李朗鸣 X  李凯熙 X`,
        },
    ];
    export default {
        components: {CreateModal},
        data() {
            return {
                size : "small",
                classData,
                columns,
                visible:false,
                addVisit:false,
                loading:false,
            };
        },
        beforeCreate() {
            this.form = this.$form.createForm(this, { name: 'time_related_controls' });
        },
        methods: {
            moment,
            range(start, end) {
                const result = [];
                for (let i = start; i < end; i++) {
                    result.push(i);
                }
                return result;
            },
            disabledDate(current) {
                // Can not select days before today and today
                return current && current < moment().endOf('day');
            },
            disabledRangeTime(_, type) {
                if (type === 'start') {
                    return {
                        disabledHours: () => this.range(0, 60).splice(4, 20),
                        disabledMinutes: () => this.range(30, 60),
                        disabledSeconds: () => [55, 56],
                    };
                }
                return {
                    disabledHours: () => this.range(0, 60).splice(20, 4),
                    disabledMinutes: () => this.range(0, 31),
                    disabledSeconds: () => [55, 56],
                };
            },
            changeTime: function () {
                this.visible = true;
            },
            closed: function () {
                this.visible = false
                this.loading = false
            },
            handleSubmit: function (e) {
                e.preventDefault();
                this.form.validateFields((err, fieldsValue) => {
                    if (err) {
                        return;
                    }
                    const rangeValue = fieldsValue['range-picker'];
                    const rangeTimeValue = fieldsValue['range-time-picker'];
                    const values = {
                        ...fieldsValue,
                        'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
                        'range-time-picker': [
                            rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
                            rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
                        ],
                    };
                    console.log('Received values of form: ', values);
                });
                console.log(this.$refs.createForm),
                    this.loading = true
                setTimeout(() => {
                    this.dataSource.push(
                        {
                            avatar:
                                "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
                            content: "选课开始时间：点击选择/选课结束时间：点击选择",
                        }
                    ),
                        this.visible = false
                    this.loading = false
                }, 2000)
            },
            addStudent(){
                this.addVisit=true;
            },
            addClassHandleSubmint(){},
            handleOk() {
                this.loading = true;
                setTimeout(() => {
                    this.addVisit = false;
                    this.loading = false;
                }, 2000);
            },
            handleCancel() {
                this.addVisit = false;
            },
            back(){
                this.$router.push('/schedule/detail/statistics/index')
            }
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
