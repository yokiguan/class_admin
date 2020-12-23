<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">选课分班</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">自动分班</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="12">
                    <span style="font-size:1.5em">{{this.planData}}-自动分班</span>
                </a-col>
                <a-col :span="12">
                    <a-row>
                        <a-button style="width: 150px;height: 40px;background-color: #1abc9c;color: white" @click="maxNum">统一设置最大人数</a-button>
                        <a-button style="margin-left:50px;width: 150px;height: 40px;background-color: #1abc9c;color: white" @click="timeNum">统一设置课时数</a-button>
                        <button style="margin-left:50px;width: 100px;height: 40px;background-color: blue;color: white;border-radius: 5px;border: none" @click="back">返回</button>
                    </a-row>
                </a-col>
            </a-row>
        </div>
<!--       设置最大人数弹窗-->
        <a-modal title="统一设置最大人数"
                :visible="maxPerNumModal"
                :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk()">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <a-form-model :model="form" :rules="rules" :label-col="{ span:5 }" :wrapper-col="{ span: 19}">
                <a-form-model-item label="最大人数：" style="margin-top: 50px" props="maxPerNum" ref="maxPerNum">
                    <a-input placeholder="请输入" v-model="form.maxPerNum"/>
                </a-form-model-item>
                <a-form-model-item >
                    <a-checkbox @change="onChange" style="margin-top: 30px;margin-left: 100px;font-size: 15px" v-model="form.classNum">
                        生成班级个数
                    </a-checkbox>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
<!--        统一设置最大课时数-->
        <a-modal title="统一设置最课时数"
                 :visible="maxTimeNumModal"
                 :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk()">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <a-form-model :model="form" ref="rules" :label-col="{ span:5 }" :wrapper-col="{ span: 19}">
                <a-form-model-item label="课时数：" style="margin-top: 50px" props="times" ref="times">
                    <a-input placeholder="请输入课时数" v-model="form.times"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <div class="table-bg">
            <a-form :form="form" :label-col="{ span:6 }" :wrapper-col="{ span: 13 }" style="margin-left: 300px">
                <a-form-item label="可用教室数：">
                    <a-input  placeholder="16" style="width: 300px;"></a-input>
                </a-form-item>
            </a-form>
            <a-table :key="'key'"
                    :columns="columns"
                    :data-source="dataSource"
                    :pagination="false"
                    :bordered="true">
<!--                <input slot="classNum" slot-scope="classNum"  @change="changeMax(record.key, classNum)">-->
<!--                <input slot="max" slot-scope="max"  @change="changeClassNum(record.key, max)">-->
<!--                <input slot="classTime" slot-scope="classTime"  @change="changeAve(record.key, classTime)">-->
                <a-button slot="action" slot-scope="text" @click="add" style="background-color:blue;color:white">添加</a-button>
            </a-table>
            <div style="margin: 20px 0px 20px 40%">
                <a-button type="primary" style="margin-right:40px;margin-top: 50px;width: 100px;height: 40px">开始分班</a-button>
                <a-button type="primary" style="width: 100px;height: 40px">返回</a-button>
            </div>
        </div>
<!--        添加-->
        <a-modal :visible='addVisit' width="800px" :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleAdd">添加</a-button>
                <a-button key="back" @click="handleCancel">取消
                </a-button>
            </template>
            <div class="title" style="width:770px;height: 50px;border-radius: 5px; margin-left: -10px;
                        margin-top: -10px; background-color: #6Db5a7">
                <h3 style="color: white;padding-top: 10px;padding-left: 20px">老师所教班级个数</h3>
            </div>
            <div class="content_table" style="margin-top: 10px;margin-left: -10px">
                <div class="left" style="width: 300px;height:500px">
                    <a-row class="left_title">
                        <a-col :span="12"><span style="font-size: 1.2em;font-weight: bold">老师列表：</span></a-col>
                    </a-row>
                    <a-row style="font-size: 1.2em;margin-top: 10px;margin-bottom: 10px">
                        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" >
                            <a-form-item label="选择老师">
                                <a-input placeholder="请输入" v-decorator="['选择老师', { rules: [{ required: true, message: '请选择老师' }] }]"/>
                            </a-form-item>
                        </a-form>
                        <span style="float: right;margin-top: -30px">全部展开</span>
                    </a-row>
                    <a-divider style="background-color: black;margin-top: -50px"></a-divider>
                    <a-tree
                            :tree-data="treeData"
                            :default-expanded-keys="['0-0-0', '0-0-1']"
                            :default-selected-keys="['0-0-0', '0-0-1']"
                            :default-checked-keys="['0-0-0', '0-0-1']"
                            :replace-fields="replaceFields"
                            @select="onSelect"
                            @check="onCheck"
                            checkable
                            style="font-size: 1.3em;margin-top: -20px"/>
                </div>
                <a-divider type="vertical" style="background-color: black; height: 500px;margin-left: 310px;margin-top: -500px"/>
                <div class="right" style="position:relative;float: right;margin-top: -480px">
                    <a-row style="margin-left: 30px">
                        <a-col :span="10"><span style="font-size: 1.2em;font-weight: bold">已选教师：</span></a-col>
                        <a-col> <span style="font-size: 1.2em;" @click="allClear">全部清除</span></a-col>
                    </a-row>
                    <a-table
                        :columns="teacherColumns"
                        :data-source="teacherData"
                        :pagination="false"
                        :bordered="true"
                        :cell-style="changeCellStyle"
                        style="float:right;width: 400px;margin-right: 30px;margin-top: 30px">

                    <a-input slot="classNums" placeholder="0"></a-input>
                     <button slot="delete"
                             @click="teacherDelete"
                             style="background-color: red;color: white;border: none;width: 80px;height: 30px;border-radius: 5px">删除</button>
                </a-table></div>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import CreateModal from "../../../../components/modal/CreateModal";
    const columns = [
        {   title: '课程',
            dataIndex: 'subId',
            className:'',
        },
        {
            title: '学生总人数',
            dataIndex: 'total',
        },
        // {
        //     title: '未分班人数',
        //     dataIndex: 'unsorted',
        //     className:'class_color'
        // },
        {
            title: '班级个数',
            dataIndex: 'classNum',
            // scopedSlots: { customRender: 'classNum' },
        },
        {
            title: '平均人数',
            dataIndex: 'average',
        },
        {
            title: '每班最大人数',
            dataIndex: 'maxNum',
            // scopedSlots: { customRender: 'max' },
        },
        {
            title: '每周课时数',
            dataIndex: 'lessonNum',
            // scopedSlots: { customRender: 'classTime' },
        },
        {
            title: '教师所教班级个数',
            dataIndex: 'Num',
        },
        {
            title: '操作',
            dataIndex: 'opt',
            scopedSlots: { customRender: 'action' },
        },
    ];

    const treeData = [
        {
            name: '小学语文',
            key: '0-0',
            child: [
                { name: '赵卫民', key: '0-0-0'},
                { name: '李援朝', key: '0-0-1' },
            ],
        },
        {
            name: '初中英语',
            key: '0-1',
            child: [
                { name: '赵卫民', key: '0-1-0'},
                { name: '李援朝', key: '0-1-1' },
            ],
        },
    ];
    const teacherColumns=[
        {
            title:'教师名称',
            dataIndex:'teacherName',
            align:'center',
            width:'30%',
        },{
        title: '所教班级个数',
            dataIndex:'classNum',
            align: 'center',
            width: '45%',
            scopedSlots: { customRender: "classNums" },
        },{
            title:'操作',
            dataIndex:'opt',
            align:'center',
            width:'25%',
            scopedSlots: { customRender: "delete" },
        }
    ]
    const teacherData=[
        {
            teacherCount:'0',
            teacherName:'李援朝',
        },
        {
            teacherCount:'1',
            teacherName:'赵卫民',
        },{
            teacherCount:'2',
        },{
            teacherCount:'3',
        }
    ]
    export default {
        components: {CreateModal},
        data() {
            return {
                dataSource:[],
                columns,
                treeData,
                teacherColumns,
                teacherData,
                teacherCount:4,
                maxTimeNumModal:false,
                maxPerNumModal:false,
                addVisit:false,
                visit:false,
                loading:false,
                planData:" ",
                replaceFields: {
                    children: 'child',
                    title: 'name',
                },
                form:{
                    maxPerNum:0,
                    classNum:0,
                    times:0,
                },
                rules:{

                }
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
            //自动分班查看
            let {data}=await this.$api.schedule.sortClass.classAutoGet({planId});
            console.log(data)
            this.dataSource=data.rows;
        },
        methods: {
            maxNum(){
              this.maxPerNumModal=true;
            },
            timeNum(){
              this.maxTimeNumModal=true;
            },
            handleOk(){
                this.maxPerNumModal=false;
                this.maxTimeNumModal=false;
            },
            handleCancel() {
                this.maxPerNumModal=false;
                this.maxTimeNumModal=false;
                this.addVisit=false;
            },
            changeMax(key, val) {
                this.tableData[key].max = val
            },
            changeClassNum(key, val) {
                this.tableData[key].classNum = val
            },
            changeAve(key, val) {
                this.tableData[key].ave = val
            },
            add: function () {
                this.addVisit=true
            },
            onChange(e) {
                console.log(`checked = ${e.target.checked}`);
            },
            back(){
                this.$router.go(-1)
            },
            teacherDelete(){
                const dataSource = [...this. teacherData];
                dataSource.splice(event.target.getAttribute('dataIndex'),1);
                this. teacherData= dataSource
            },
            allClear(){
                this. teacherData= []
            },
            handleAdd() {
                this.loading = true;
                setTimeout(() => {
                    this.addVisit=false
                    this.loading =false
                },20)
                const {  teacherCount, teacherData} = this;
                const newData = {
                    teacherCount:teacherCount,
                    teacherName:'赵卫民',
                };
                this.teacherData= [...teacherData, newData];
                this. teacherCount =  teacherCount + 1;
            },

            changeCellStyle(){},
            onCheck(){},
            onSelect(){},

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
    .table-bg input{
        border:1px solid black;
        border-radius: 5px;
        width:6em;
    }
    /deep/ Table {
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
    }
</style>
