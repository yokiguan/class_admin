<template>
    <div>
        <!-- result -->
        <div class="result">
            <a-row>
                <a-col :span="12">
                    <a-space>
                        <span style="font-size:1.5em">高一2019-2020第一学期选课结果</span>
                        <br>
                        <span class="link-font-color" style="margin-left:2em">选课时间：2020/03/01 ——2020/03/15</span>
                        <span class="link-font-color" style="margin-left:2em">选课中</span>
                    </a-space>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-col :span="6"><a-button type="primary" @click="changeTime">修改选课时间</a-button></a-col>
                        <a-col :span="6"><a-button type="primary">
                            <router-link to="/schedule/detail/statistics/edit">修改选课结果</router-link></a-button></a-col>
                        <a-col :span="6"><a-button type="danger">清空</a-button></a-col>
                        <a-col :span="6" ><a-button style="background-color: blue;color:white;margin-left: -4em">返回</a-button></a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <!--        创建弹窗-->
        <create-modal
                width="760px"
                :visible="visible"
                :loading="loading"
                :close="false"
                @modalClosed="closed"
                @modalSubmit="handleSubmit">
            <div slot="content">
                <a-form :form="form" :label-col="{ span:5 }" :wrapper-col="{ span: 19}" @submit="handleSubmit">
                    <a-form-item label="选课开始时间：" style="margin-top: 50px">
                            <a-input  placeholder="点击选择"  style="width: 500px;
                            height: 35px;"></a-input>
                    </a-form-item>
                    <a-form-item label="选课结束时间：" style="margin-bottom: 100px">
                        <!-- <a-date-picker v-decorator="['date-picker', config]" /> -->
                        <a-input placeholder="点击选择" style="width: 500px;
                            height: 35px;"/>
                    </a-form-item>
                </a-form>
            </div>
        </create-modal>
        <div class="info link-font-color">已有900人选课 （共1000人）<font style="color:red">100人未选</font></div>
        <!-- /result -->

        <div class="table-bg">
            <!-- statistics -->
            <!-- table -->
            <a-table
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
    // import echarts from 'echarts'
    import CreateModal from "../../../../components/modal/CreateModal";
    const columns = [
        {
            title: '',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: '课程组合',
            dataIndex: 'name',
            key: 'key',
        },
        {
            title: '选课人数',
            key: 'key',
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
                visible:false
            };
        },
        mounted(){
            this.drawLine();
        },
        methods: {
            changeTime: function () {
                this.visible = true;
            },
            closed: function () {
                this.visible = false
                this.loading = false
            },
            handleSubmit: function () {
                const that = this
                console.log(that.$refs.createForm)
                that.loading = true
                setTimeout(() => {
                    that.dataSource.push(
                        {
                            avatar:
                                "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
                            content: "选课开始时间：点击选择/选课结束时间：点击选择",
                        }
                    ),
                        that.visible = false
                    that.loading = false
                }, 2000)
            },
            drawLine() {
                let barChart = this.$echarts.init(document.getElementById('barChart'))
                let pieChart = this.$echarts.init(document.getElementById('pieChart'))
                // 绘制图表
                barChart.setOption({
                    title: {text: '单个课程统计'},
                    tooltip: {},
                    xAxis: {
                        data: ["语文", "数学", "英语", "物选", "物学", "化选", "化学", "生选", "生学", "政选", "政学"]
                    },
                    yAxis: {},
                    series: [{
                        name: '数量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10],
                        color: 'rgb(59 161 255)'
                    }]
                });
                // 绘制图表
                pieChart.setOption({
                    tooltip: {//提示框，可以在全局也可以在
                        trigger: 'item',  //提示框的样式
                        formatter: "{a} <br/>{b}: {c} ({d}%)",
                        color: '#000', //提示框的背景色
                        textStyle: { //提示的字体样式
                            color: "black",
                        }
                    },
                    legend: {  //图例
                        orient: 'vertical',  //图例的布局，竖直    horizontal为水平
                        x: 'right',//图例显示在右边
                        data: ['语文', '数学', '英语', '物理', '化学'],
                        textStyle: {    //图例文字的样式
                            color: '#333',  //文字颜色
                            fontSize: 12    //文字大小
                        }
                    },
                    series: [
                        {
                            type: 'pie', //环形图的type和饼图相同
                            radius: ['20%', '50%'],//饼图的半径，第一个为内半径，第二个为外半径
                            avoidLabelOverlap: false,
                            color: ['#D1FBEF', '#F9D858', '#4CD0DD', '#DF86F0', '#F5A7C1'],
                            label: {
                                normal: {  //正常的样式
                                    show: true,
                                    position: 'left'
                                },
                                emphasis: { //选中时候的样式
                                    show: true,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            },  //提示文字
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: 335, name: '语文'},
                                {value: 310, name: '数学'},
                                {value: 234, name: '英语'},
                                {value: 135, name: '物理'},
                                {value: 1548, name: '化学'}
                            ]
                        }
                    ]
                });
            }
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
    }
</style>
