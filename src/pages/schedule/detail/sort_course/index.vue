<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">选课排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">课时设置</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                <a-col><button style="background-color: blue;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 100px" @click="back">返回</button></a-col>
            </a-row>
        </div>
        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="placeSetting">教师设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="courseSetting">课程设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <a-row class="form"
                style="margin-left: -150px;
                        margin-top:60px">
                <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 8}" >
                    <a-form-item label="选择课表模板">
                        <a-select
                                v-decorator="['table_modal',
          { rules: [{ required: true, message: 'Please select your table_modal!' }] },]"
                                placeholder="高一组课表模板"
                                @change="handleSelectChange">
                        </a-select>
                    </a-form-item>
                </a-form>
            </a-row>
            <a-table id="Table"
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="false"
                    :bordered="true"
            style="margin-top: 10px;
                    margin-left: 50px">
            </a-table>
            <router-link to="/schedule/detail/sort_course/time">
                <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        margin-top: 50px;
                        width: 150px">下一步</button>
            </router-link>
            <create-modal
                    :visible="visible"
                    :loading="loading"
                    @modalClosed="closed"
                    @modalSubmit="handleSubmit"
                    style="width: 500px">
                <div slot="content">
                    <a-form @submit="handleSubmit" ref="createForm">
                        <a-form-item>
                            <p style="height:100%;
                  background-color: #0099ff;
                  margin-top: 20px;
                  color: white;
                  line-height: 50px;
                  font-size: 20px;">
                                设置每个老师使用某个课时的最大数量</p>
                            <!-- <a-date-picker v-decorator="['date-picker', config]" /> -->
                        </a-form-item>
                        <a-form-item>
                            <a-table :columns="column4"
                                     :data-source="tableData4"
                                     :pagination="false"
                                     :bordered="true">
                                <span slot="add" icon="plus" style="color: blue">添加一项</span>
                                <a-select slot="buildingType"
                                          slot-scope="type"
                                          :default-value="type"
                                          style="width: 240px">
                                    <a-select-option value="0">
                                        1
                                    </a-select-option>
                                    <a-select-option value="0">
                                        2
                                    </a-select-option>
                                </a-select>
                                <span slot="action" slot-scope="text" style="color:blue">{{text}}</span>
                            </a-table>
                        </a-form-item>
                    </a-form>
                </div>
            </create-modal>
        </div>
    </div>
</template>
<script>
    import CreateModal from "../../../../components/modal/CreateModal";
    const renderContext=(value,row,index)=>{
        const obj={
            children: value,
            attrs:{},
        };
        if(index===3||index === 6){
            obj.attrs.colSpan=0;
        }
        return obj;
    };
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'key',
            className:'back-color',
            customRender: (text, row, index) => {
                if (index === 3 || index === 6) {
                    return {
                        children: text,
                        attrs: {
                            colSpan: 8,
                        },
                    };
                } else {
                    return text;
                }
            },
        },
        {
            title: '星期一',
            dataIndex: 'one',
            key:'one',
            align:'center',
            customRender:renderContext,
            className:'back-color',
        },
        {
            title: '星期二',
            dataIndex: 'two',
            key:'two',
            align:'center',
            customRender:renderContext,
            className:'back-color',
        },
        {
            title: '星期三',
            dataIndex: 'three',
            key:'three',
            align:'center',
            customRender:renderContext,
            className:'back-color',
        },
        {
            title: '星期四',
            dataIndex: 'four',
            key: 'four',
            align:'center',
            customRender:renderContext,
            className:'back-color',
        },
        {
            title: '星期五',
            dataIndex: 'five',
            key: 'five',
            align:'center',
            customRender:renderContext,
            className:'back-color',
        },
        {
            title: '星期六',
            dataIndex: 'six',
            key:'six',
            customRender:renderContext,
            align:'center',
            className:'back-color',
        },
        {
            title: '星期日',
            dataIndex: 'seven',
            key:'seven',
            customRender:renderContext,
            align:'center',
            className:'back-color',
        },
    ];
    const tableData=[
        {
            key: '早读1',
            one:'6:00~7:00'
        },
        {
            key: '上午1',
            one:'8:30~9:00'
        },
        {
            key: '上午2',
            one:'9:00~10:00'
        },{
            key: '课间操10：00-10:30',
        },
        {
            key: '上午3',
            one:'10:30~11:30'
        },
        {
            key: '上午4',
            one:'11:30~12:30'
        },{
            key: '午休12：30-1:30',
        },
        {
            key: '下午1',
        },
        {
            key: '下午2',
        },
        {
            key: '下午3',
        },
        {
            key: '下午4',
        },
        {
            key: '晚自习1',
        },
    ];
    const column4 = [
        {
            title: '课节',
            dataIndex: 'times',
            key: 'times',
        },
        {
            title: '最大使用数',
            dataIndex: 'number',
            key: 'number',
            scopedSlots: { customRender: 'buildingType' }
        },
        {
            title: '操作',
            dataIndex: 'opt',
            key: 'opt',
            scopedSlots: { customRender: 'action' }
        },
    ];
    const tableData4= [
        {
            times: '周一上午第一节',
            number: '1',
            opt: '删除',
        },
        {
            scopedSlots: { customRender: 'add' }
        },]
    export default {
        components: {CreateModal},
        data() {
            return {
                column4,
                tableData4,
                columns,
                tableData,
                planData:"",
                visible: false,
                loading: false
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
        },
        methods: {
            maxTime: function () {
                this.visible = true;
            },
            change: function () {
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
                            content: "最大课时数设置",
                        }
                    ),
                        that.visible = false
                    that.loading = false
                }, 2000)
            },
            changeSituation: function(key, index){
                console.log(key, index)
            },
            delSituation: function(key, index){
                console.log(key, index)
                this.tableData[key].situation.pop(index)
            },
            handleSelectChange(value) {
                console.log(value);
                this.form.setFieldsValue({

                });
            },
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
            back(){
                this.$router.go(-1)
            },
            form(){},
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
    /*/deep/ Table {*/
    /*    .ant-table-tbody > tr:first-child > td,*/
    /*    .ant-table-tbody > tr:last-child > td {*/
    /*        background: #f00;*/
    /*    }*/
    /*}*/
    /deep/ Table{
        .ant-table-thead >tr >th{
            background-color: #f4f4f4;
        }
        .ant-table-tbody > tr:nth-child(4) > td,
        .ant-table-tbody > tr:nth-child(7) > td {
            background-color: #f4f4f4;
        }
    }
</style>
