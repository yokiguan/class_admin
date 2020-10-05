<template>
    <div>
        <div>
            <div class="header-item">
                <a-row>
                    <a-col :span="13"><span style="font-size:1.5em">高一2019-2020第一学期排课计划</span></a-col>
                    <a-col :span="2">
                        <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px">
                            互斥规则</button></a-col>
                    <a-col :span="2">
                        <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px">
                            同时上课</button></a-col>
                    <a-col :span="5">
                        <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px">禁止相邻</button></a-col>
                    <a-col>
                        <button style="background-color: blue;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px"
                        >返回</button></a-col>
                </a-row>
            </div>
            <div class="content">
                <div class="content-title">
                    <a-row>
                        <a-col :span="2">
                            <button style="background-color: #e4e4e4;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px">
                                课时设置</button></a-col>
                        <a-col :span="2">
                            <button style="background-color: #e4e4e4;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px">
                                课节设置</button></a-col>
                        <a-col :span="2">
                            <button style="background-color: #e4e4e4;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px">
                                教师设置</button></a-col>
                        <a-col :span="2">
                            <button style="background-color:#f2f2f2;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px"
                            >课程设置</button></a-col>
                        <a-col>
                            <button style="background-color:#e4e4e4;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 100px"
                            >开始排课</button></a-col>

                    </a-row>
                </div>
                <div class="table-content">
                    <a-table
                            :columns="columns"
                            :data-source="tableData"
                            :pagination="false"
                            :bordered="true">
                        <a-input slot="add_times"></a-input>
                        <a-input slot="add_datas"></a-input>
                        <a-button slot="adds_times" style="background-color: #00ccff;
                        color:white;" @click="add_time">
                            添加时间段
                        </a-button>
                        <a-button slot="adds_datas" style="background-color: #00ccff;color:white;" @click="add_class">
                            添加教室
                        </a-button>
                        <span slot="action" slot-scope="text" style="color:blue">{{text}}</span>
                    </a-table>
                </div>
                <div class="footer">
                    <button style="background-color: #00ccff;
                border: none;color: white;
                float: right;
                height: 40px;
                border-radius: 5px;
                width: 100px;
                margin-right: 50px;
                margin-top:50px">
                        下一步</button>
                </div>
            </div>
        </div>
        <div class="Pop-ups">
            <create-modal class="Pop-ups_time"
                          :visible="visible"
                          :loading="loading"
                          @modalClosed="closed"
                          @modalSubmit="handleSubmit1">
                <div slot="content">
                    <div class="model1_head">
                        <div style="height: 52px;
                            border-radius: 5px;
                             margin-top: -23px;
                             margin-left: -24px;
                            width: 520px;background-color: #e4e4e4">
                            <span style="margin: 0px 0px 50px 0px;
                                  padding: 20px 25px;
                                  font-size: 1.0rem;
                                  vertical-align: top;">选择时间段</span>
                        </div>
                        <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}" @submit="handleSubmit1">
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
                </div>
            </create-modal>
            <create-modal class="Pop-ups_class"
                          :visible="visibe"
                          :loading="load"
                          @modalClosed="close"
                          @modalSubmit="handleSubmit2">
                <div slot="content">
                    <div class="model2_head">
                        <div style="height: 52px;
                            border-radius: 5px;
                             margin-top: -23px;
                             margin-left: -24px;
                            width: 520px;background-color: #e4e4e4">
                            <span style="margin: 0px 0px 50px 0px;
                                  padding: 20px 25px;
                                  font-size: 1.0rem;
                                  vertical-align: top;">选择教室</span>
                        </div>
                        <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 18}" @submit="handleSubmit1">
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
                        <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 18}" @submit="handleSubmit2">
                            <a-form-item label="选择教学楼">
                                <a-select
                                        v-decorator="[
                                            'type',
                                            { rules: [{ required: true, message: '逸夫楼' }] }, ]"
                                        placeholder="逸夫楼"
                                        @change="handleSelectChange2">
                                </a-select>
                            </a-form-item>
                        </a-form>
                    </div>
                    <div class="model2_content">
                        <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 18}" @submit="handleSubmit1">
                            <a-form-item label="教室">
                                <a-checkbox-group @change="onChange_class">
                                    <a-row>
                                        <a-col :span="6">
                                            <a-checkbox value="A1">101</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="B1">102</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="C1">103</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="D1">104</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="E1">201</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="F1">202</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="G1">203</a-checkbox>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-checkbox value="H1">204</a-checkbox>
                                        </a-col>
                                    </a-row>
                                </a-checkbox-group>
                            </a-form-item>
                        </a-form>
                    </div>
                </div>
            </create-modal>
        </div>
    </div>
</template>
<script>
    import CreateModal from "../../../../../components/modal/CreateModal";
    const columns=[
        {
            title: '',
            dataIndex:'num',
            key:'num',
            backgroundColor:'#e4e4e4',
            align:'center'
        }, {
            title: '课程名称',
            dataIndex: 'name',
            key: 'name',
            align:'center'
        },{
            title:'老师',
            dataIndex:'teacher',
            key:'teacher',
            align:'center'
        },{
            title:'每周课时',
            dataIndex:'times',
            key:'times',
            align:'center',
            scopedSlots: { customRender: 'add_times' }
        },{
            title:'最小上课天数',
            dataIndex:'datas',
            key:'datas',
            align:'center',
            scopedSlots: { customRender: 'add_datas' }
        },{
            title:' ',
            dataIndex:'middle_blank',
            key:'middle_blank',
            align:'center'
        },{
            title:'时间设置',
            dataIndex:'setting_time',
            key:'setting_time',
            align:'center',
            scopedSlots: { customRender: 'adds_times' }
        },{
            title:'教室设置',
            dataIndex:'setting_class',
            key:'setting_class',
            align:'center',
            scopedSlots: { customRender: 'adds_datas'}
        },{
            title:'操作',
            dataIndex:'opt',
            key:'opt',
            align:'center',
            scopedSlots: { customRender: 'action' }
        }]
    let  tableData=[
        {
            num:'1',
            name:'语文1班',
            teacher:'张凯元',
            middle_blank:'  ',
            opt:'删除'
        },
        {
            num:'2',
            name:'语文2班',
            teacher:'张凯元',
            middle_blank:'  ',
            opt:'删除'
        },
        {
            num:'3',
            name:'语文3班',
            teacher:'张凯元',
            middle_blank:'  ',
            opt:'删除'
        },
        {
            num:'4',
            name:'生物学修1班',
            teacher:'张凯方',
            middle_blank:'  ',
            opt:'删除'
        },
        {
            num:'5',
            name:'生物学修2班',
            teacher:'张凯方',
            middle_blank:'  ',
            opt:'删除'
        }]

    export default {
        components: {CreateModal},
        data() {
            return {
                columns,
                tableData,
                visible: false,
                visibe:false,
            }
        },
        methods:{
            add_time:function () {
                this.visible=true;
            },
            add_class:function(){
                this.visibe=true;
            },
            change: function () {
                this.visible = true;
                this.visibe=true;
            },
            closed: function () {
                this.visible = false
                this.loading = false
            },
            close: function () {
                this.visibe = false
                this.load = false
            },
            onChange(checkedValues) {
                console.log('checked = ', checkedValues);
            },
            onChange_class(checkedValues){
                console.log('checked = ', checkedValues);
            }
        },
    }
</script>
<style lang="less" scoped>
    .header-item{
        height: 300px;
        background-color: white;
        height: 100px;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        vertical-align: top;
        border-radius: 5px;
    }
    .header-item span{
        font-size:1.5em
    }
    .content-title{
        width: 100%;
        height: 70px;
        background-color: white;
        border-radius: 5px;
        padding-top: 30px;
        padding-left: 100px;
    }
    .table-content{
        background-color: white;
        padding: 20px 25px;
        border-radius: 5px;
    }
</style>
