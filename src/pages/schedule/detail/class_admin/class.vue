<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">行政班排课</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">班级设置</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">高一2019-2020第一学期排课计划</span></a-col>
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
        <!-- /result -->
        <div class="table-bg">
            <a-row class="buttons">
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="timesSetting">课时设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="oncesSetting" >课节设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="placeSetting">教师设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="courseSetting">课程设置</a-button></a-col>
                <a-col :span="3"><a-button style="width: 100px;height: 40px" @click="startArray">开始排课</a-button></a-col>
            </a-row>
            <a-table :columns="columns"
                     :data-source="data"
                     :bordered="true"
                     :pagination="false"
                     style="width: 55%">
                <a-icon type="edit" slot="class_day" style="color: #00ccff;font-size: 25px;font-weight: bold" @click="edit"/>
                <a-icon type="close" slot="blank" style="font-weight: bolder;font-size: 30px;color: #0099ff"/>
                <span slot="add" style="color:blue">+添加一项</span>
                <span slot="action" slot-scope="text" @click="editInfo(record.key)" style="background-color:blue">{{text}}</span>
            </a-table>
            <button style="background-color: #00ccff;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        margin-top:100px;
                        margin-bottom: 20px;
                        width: 200px" @click="Next">下一步</button>
        </div>
    </div>
</template>
<script>
    // by setting it's colSpan to be 0
    // const renderContent = (value, row, index) => {
    //     const obj = {
    //         children: value,
    //         attrs: {},
    //     };
    //     if (index ===3||index===6) {
    //         obj.attrs.colSpan = 0;
    //     }
    //     return obj;
    // };
    const columns = [
        {
            title: '班级',
            dataIndex: 'class',
            align:'center',
            customRender: (value, row, index) => {
                const obj = {
                    children: value,
                    attrs: {},
                };
                if (index === 0) {
                    obj.attrs.rowSpan = 4;
                }
                // These two are merged into above cell
                if (index === 1) {
                    obj.attrs.rowSpan = 0;
                }
                if (index === 2) {
                    obj.attrs.colSpan = 0;
                }
                if (index === 3) {
                    obj.attrs.colSpan = 0;
                }
                if(index===4){
                    obj.attrs.rowSpan = 3;
                }
                if (index === 5) {
                    obj.attrs.rowSpan = 0;
                }
                if (index === 6) {
                    obj.attrs.rowSpan = 0;
                }
                return obj;
            },
        },
        {
            title: '学科名称',
            dataIndex: 'name',
            align:'center',
            customRender: (text, row, index) => {
                if (index === 3 || index === 6) {
                    return {
                        children: text,
                        attrs: {
                            colSpan: 3,
                        },
                    };
                } else {
                    return text;
                }
            },
        },
        {
            title: '任课教师',
            dataIndex: 'teacher',
            align:'center',
            scopedSlots:{
                customRender:(value,row,index)=>{
                    const obj={
                        children:value='class_day',
                    };
                    if(index===3){
                        obj.attrs.colSpan = 0;
                    }
                    return obj;
                }

            },
        },
        {
            title: '  ',
            dataIndex: 'blank',
            align:'center',
            scopedSlots: { customRender: 'blank' },
        },
        {
            title: '操作',
            dataIndex: 'opt',
            align:'center',
            scopedSlots: { customRender: 'action' },
            customRender: (value, row, index) => {
                const obj = {
                    children: value,
                    attrs: {},
                };
                if (index === 0) {
                    obj.attrs.rowSpan = 4;
                }
                // These two are merged into above cell
                if (index === 1) {
                    obj.attrs.rowSpan = 0;
                }
                if (index === 2) {
                    obj.attrs.colSpan = 0;
                }
                if (index === 3) {
                    obj.attrs.colSpan = 0;
                }
                if(index===4){
                    obj.attrs.rowSpan = 3;
                }
                if (index === 5) {
                    obj.attrs.rowSpan = 0;
                }
                if (index === 6) {
                    obj.attrs.rowSpan = 0;
                }
                return obj;
            }
        },
    ];
    const data = [
        {
            key:0,
            class:'2020级高一1班',
            name: '语文',
            opt:'删除'
        },
        {
            key:1,
            name:'数学',
        },
        {
            key:2,
            name:'体育',
        },
        {
            key:3,
            name:'+添加一项'
        },
        {
            key:4,
            class:'2020级高一2班',
            name:'升国旗',
            opt:'删除'
        },
        {
            key:5,
            name:'班会',
        }, {
        key:6,
            name:'+添加一项'
        },
    ];
    export default {
        data() {

            return {
                data,
                columns,
                // tableData,
                // columns,
                visible: false,
                loading: false,
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
            Next(){
                this.$router.push('/schedule/detail/class_admin/rule')
            },
            back(){
                this.$router.go(-1)
            },
            edit(){},
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
    .table{
        margin-left: 48px;
        width: 56%;
    }
    /deep/ Table {
        .ant-table-thead > tr > th {
            background-color: #f4f4f4;
        }
    }
</style>
