<template>
    <div>
        <!-- result -->
        <div class="result">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">高一2019-2020第一学期排课计划</span></a-col>
                <a-col>
                    <button style="background-color: blue;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 100px"
                    >返回</button>
                </a-col>
            </a-row>
        </div>
        <!-- /result -->

        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3">
                    <a-button>课时设置</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button >课节设置</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button>教师设置</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button>课程设置</a-button>
                </a-col>
                <a-col :span="3">
                    <a-button>开始排课</a-button>
                </a-col>
            </a-row>
            <a-table :columns="columns"
                     :data-source="tableData"
                     :pagination="false"
                     :bordered="true"
                     class="table">
                <a-icon type="edit" slot="teacher" style="color: #00ccff;font-size: 20px;font-weight: bold"/>
                <a-icon type="close" slot="blank" style="font-weight: bolder;font-size: 30px;color: #0099ff"/>
                <span slot="action" slot-scope="text" style="color:blue">{{text}}</span>
                <div style="
                    margin-top: 20px;
                    margin-left: 55px;
                    float: left;
                    font-size: 1.0rem;
                    color: blue;">
                    <a-icon type="plus" />
                    <span>
                   添加一项
               </span>
                </div>
            </a-table>
            <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        margin-top:100px;
                        margin-bottom: 20px;
                        width: 200px">
                    下一步</button>
        </div>
    </div>
</template>
<script>
    // by setting it's colSpan to be 0
    const renderContent = (value, row, index) => {
        const obj = {
            children: value,
            colSpan: {}
        };
        if (index === 4) {
            console.log(obj.attrs.colSpan)
        }
        return obj;
    };
    const columns = [
        {
            title: '班级',
            dataIndex: 'class',
            key: 'class',
            scopedSlots: { customRender: 'class' },
            align:'center',
            customRender: (value, row, index) => {
                const obj = {
                    children: value,
                    colSpan: 8,
                };

                if (index === 2) {
                    console.log('obj.attrs.rowSpan');
                    // obj.attrs.rowSpan = 2;
                }
                // // These two are merged into above cell
                // if (index === 3) {
                //     obj.attrs.rowSpan = 0;
                // }
                // if (index === 4) {
                //     obj.attrs.colSpan = 0;
                // }
                return obj;
            },
        },
        {
            title: '学科名称',
            dataIndex: 'subject',
            key: 'subject',
            scopedSlots: { customRender: 'subject' },
            align:'center',
            customRender: renderContent,

        },{
            title: ' 任课教师',
            dataIndex: 'teacher',
            key: 'teacher',
            align:'center',
            scopedSlots: { customRender: 'teacher' },
            customRender: renderContent,
        },
        {
            title: ' ',
            dataIndex: 'blank',
            key: 'blank',
            align:'center',
            scopedSlots: { customRender: 'blank' },
            customRender: renderContent,
        },
        {
            title: '操作',
            dataIndex: 'opt',
            key: 'opt',
            scopedSlots: { customRender: 'action' },
            align:'center',
            customRender: renderContent,
        },
    ];
    let tableData = [
        {
            class:'2020级高一1班',
            subject:'语文',
            opt: '删除'
        },
        {
            class:'',
            subject:'数学',
            opt: ''
        },
        {
            class:'  ',
            subject:'体育',
            opt: ''
        },
        {
            class:'',
            subject:'',
            opt: ''
        },
        {
            class:'2020级高一2班',
            subject:'升国旗',
            opt: '删除'
        },
        {
            class:'',
            subject:'班会',
            opt:''
        },
    ];
    export default {
        data() {
            return {
                tableData,
                columns,
                visible: false,
                loading: false,
                customRender: (text, row, index) => {
                    if (index < 4) {
                        return <a href="javascript:;">{text}</a>;
                    }
                    return {
                        children: <a href="javascript:;">{text}</a>,
                        attrs: {
                            colSpan: 5,
                        },
                    };
                },
            };
        },
        methods: {
            add_course: function () {
                this.visible = true;
            },
            change: function () {
                this.visible = true;
            },
            closed: function () {
                this.visible = false
                this.loading = false
            },
            handleSubmit1: function () {
                const that = this
                console.log(that.$refs.createForm)
                that.loading = true
                setTimeout(() => {
                    that.visible = false
                    that.loading = false
                }, 2000)
            },
            onChange(e){
                console.log('radio checked',e.target.value)
            },
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
        padding: 20px 25px;
        border-radius: 5px;
        text-align: center;
        height: 600px;
    }
    .buttons{
        margin:5px 5px 20px 5px;
        padding:2px 4px;
    }
    .buttons button{
        background-color:#e4e4e4;
        color:black;
    }
    .table{
        margin-left: 48px;
        width: 56%;
    }
</style>
