<template>
    <EasyScrollbar :barOption="myBarOption">
        <div id="wrapper" style="width: 600px">
            <div style="width: 1800px">
                <div class="title">
                    <a-breadcrumb>
                        <a-breadcrumb-item>首页</a-breadcrumb-item>
                        <a-breadcrumb-item><a href="">我的课表</a></a-breadcrumb-item>
                    </a-breadcrumb>
                </div>
                <div class="left">
                    <a-row class="left_title">
                        <a-col :span="3"><a-icon type="reload" style="font-size: 1.5em;
                    font-weight: bold"/></a-col>
                        <a-col :span="12"><span style="font-size: 1.2em">刷新菜单</span></a-col>
                        <a-col><span style="font-size: 1.2em">全部展开</span></a-col>
                    </a-row>
                    <a-collapse default-active-key="1" :bordered="false" style="margin-top: 20px">
                        <template #expandIcon="props">
                            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
                        </template>
                        <a-collapse-panel key="1" header="必选基础课" :style="customStyle">
                            <p :style="customStyleP">高一语文</p>
                            <p :style="customStyleP">高一数学</p>
                        </a-collapse-panel>
                        <a-collapse-panel key="2" header="必选外语课" :style="customStyle">
                            <p></p>
                        </a-collapse-panel>
                    </a-collapse>
                </div>
                <div class="right">
                    <div class="content">
                        <a-row style="height: 40px;width: 1300px;background-color:#6Db5a7;
                        color: white;
                        margin-left: 50px;
                        border-radius: 5px;
                        border:1px solid black;">
                            <a-col><span style="float: left;padding: 10px;">张凯元待选课表</span></a-col>
                            <a-col><span style="font-size: 20px;float: left;margin-left:150px;padding-top: 5px" >高二2019-2020第一学期</span></a-col>
                        </a-row>
                        <a-row class="buttons" style="margin-top: 10px">
                            <a-col :span="4"><button style="background-color: #ffcc00;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px">规则说明</button></a-col>
                            <a-col ><button style="background-color: #1abc9c;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        width: 110px"  @click="showSave">保存</button></a-col>
                        </a-row>
                        <a-row style="float: left;margin-left: 300px;margin-top: 50px"><h3>选中其中2科，语文必选</h3></a-row>
                        <a-row>

                        </a-row>

                    </div>
                </div>
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
            </div>
        </div>
    </EasyScrollbar>
</template>
<script>
    export default {
        data() {
            return {
                myBarOption:{
                    barColor:'block'
                },
                customStyle:
                    'border: 0;overflow: hidden;font-size:15px',
                customStyleP:
                    'padding-left:30px;',

            };
        },
        methods: {
            handleDisabledChange(disabled) {
                this.disabled = disabled;
            },
            onSelect(selectedKeys, info) {
                console.log('selected', selectedKeys, info);
            },
            onCheck(checkedKeys, info) {
                console.log('onCheck', checkedKeys, info);
            },
            showSave() {
                this.$confirm({
                    title: '确认保存？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        console.log('OK');
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            },
        },
    };
</script>

<style lang="less" scoped>
    .title{
        width: 100%;
        background-color: white;
        height:50px;
        margin: 20px 0px 10px 0px;
        padding-left: 25px;
        padding-top: 15px;
        vertical-align: top;
        border-radius: 5px;
    }
    .left{
        width: 300px;
        height: 900px;
        background-color: white;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        border-radius: 10px;
    }
    .right{
        border-radius: 5px;
        margin-top: -935px;
        margin-left: 320px;
        height:900px;
    }
    .content{
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        height:600px;
        margin-top:35px;
        width: 100%;
        background-color: #fff;
    }
</style>

