<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">统计结果</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="12">
                        <span style="font-size:1.5em">高一2019-2020第一学期选课结果</span>
                        <br>
                        <span class="link-font-color" style="margin-left:2em">选课时间：2020/03/01 ——2020/03/15</span>
                        <span class="link-font-color" style="margin-left:2em">选课中</span>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: #1abc9c;color: white" @click="changeTime">修改选课时间</a-button></a-col>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: #1abc9c;color: white">
                            <router-link to="/schedule/detail/statistics/edit">修改选课结果</router-link></a-button></a-col>
                        <a-col :span="6"><a-button style="width: 150px;height: 50px;background-color: red;color: white" @click="clearTable">清空</a-button></a-col>
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
            </a-table>
            <!-- table -->
            <!-- charts -->
            <div style="margin-top:50px">
                <a-row type="flex" justify="space-between" align="bottom">
                    <a-col :span="12">
                        <div id="barChart" style="width: 100%;height: 400px;"></div>
                    </a-col>
                    <a-col :span="12">
                        <div id="pieChart" style="width: 100%;height: 400px;" ></div>
                    </a-col>
                </a-row>
            </div>
            <!-- charts -->
            <!-- statistics -->
        </div>
    </div>
</template>
<script>
    import CreateModal from "../../../../components/modal/CreateModal";
    import moment from "moment";
    const columns = [
        {
            title: '',
            dataIndex: 'key'
        },
        {
            title: '课程组合',
            dataIndex: 'name',
        },
        {
            title: '选课人数',
            dataIndex: 'count'
        }
    ];
    const classData = [
        {
            key: 1,
            name: '语文+数学+英语+物理学修+化学选修',
            count: 600
        },
        {
            key: 2,
            name: '语文+数学+日语+物理学修+化学选修',
            count: 200
        },
        {
            key: 3,
            name: '语文+数学+英语+物理选修+化学学修',
            count: 100
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
            back(){
                this.$router.go(-1)
            },
            clearTable(){
              this.classData=[]
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
