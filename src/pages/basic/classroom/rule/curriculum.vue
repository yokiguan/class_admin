<template>
    <a-card class="curriculum_content">
        <a-row style="height: 40px;width: 1300px;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;margin-left: -35px;margin-top: -30px">
            <a-col>
                <span style="float: left;padding: 10px;">课表</span>
            </a-col>
        </a-row>
        <a-row class="buttons-sub">
            <a-button type="danger" style="color:white;width: 100px;height: 40px;float:left">禁选</a-button>
            <a-button style="background-color:grey;width: 100px;height: 40px;color:white;float:left;margin-left: 20px">普通</a-button>
            <h3 style="float:left;margin-left: 20px">未设置默认为普通</h3>
            <a-button style="background-color:#1abc9c;width: 100px;height: 40px;color:white" @click="saveData">保存</a-button>
            <a-button style="background-color:#1abc9c;width: 100px;height: 40px;color:white;margin-left: 20px">重置</a-button>
            <a-button type="danger" style="color:white;width: 100px;height: 40px;margin-left: 20px">删除</a-button>
        </a-row>
        <a-row>
            <a-table
                     :rowKey="'activity'"
                     :columns="columns"
                     :data-source="tableData"
                     :pagination="false"
                     :bordered="true"
                     style="margin-top: 30px">
            </a-table>
        </a-row>
        <a-modal
                :visible='saveVisit'
                :closable="false">
            <template slot="footer">
                <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
                <a-button key="back" @click="handleCancel">取消</a-button>
            </template>
            <a-form-model :model="form" :rules="rules" :label-col="{span:5}" :wrapper-col="{span:18}">
                <a-form-model-item label="规则名称" prop="ruleName" ref="ruleName">
                    <a-input placeholder="请输入" v-model="form.ruleName"></a-input>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </a-card>
</template>
<script>
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'activity',
            width:'12.5%',

        },
        {
            title: '星期一',
            dataIndex: 'one',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期二',
            dataIndex: 'two',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期三',
            dataIndex: 'three',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期四',
            dataIndex: 'four',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期五',
            dataIndex: 'five',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期六',
            dataIndex: 'six',
            width:'12.5%',
            align:'center'
        },
        {
            title: '星期日',
            dataIndex: 'seven',
            width:'12.5%',
            align:'center'
        },
    ];
    const activity = [
        {
            name: "早读",
            options: [0, 1, 2],
            value: "morningread"
        },
        {
            name: "上午",
            options: [0, 1, 2, 3, 4],
            value: "morning"
        },
        {
            name: "中午",
            options: [0, 1, 2],
            value: "noon"
        },
        {
            name: "下午",
            options: [0, 1, 2, 3, 4],
            value: "afternoon"
        },
        {
            name: "晚自习",
            options: [0, 1, 2, 3, 4],
            value: "evening"
        }
    ];
    export default {
        data(){
            return{
                columns,
                tableData:[],
                timeData:[],
                currId:"",
                saveVisit:false,
                loading:false,
                activity,
                form:{
                    ruleName:undefined,
                },
                rules:{
                    ruleName:[
                        {
                            required:true,
                            message:"请输入规则名称",
                            trigger:"blur"
                        }
                    ]
                }
            }
        },
        props:['templateId'],
        watch:{
            'templateId':{
                handler(val){
                    console.log("templateId val",val)
                    this.initData()
                },
                immediate:true
            }
        },
        async created() {

        },
        methods:{
            async initData(){
                console.log("this.tem",this.templateId)
                let {data}=await this.$api.basic.template.fetchTemplate({id:this.templateId})
                console.log(data.result);
                this.currId= this.templateId
                console.log(this.templateId);
                let activities = [];
                let timeDatas = [];
                let list = [...this.activity];
                list.forEach(item => {
                    for (let i = 1; i <= data.result[item.value]; i++) {
                        activities.push({
                            activity: item.name + i,
                            value: item.value + i
                        });
                        timeDatas.push({
                            activity: item.name + i,
                            value: item.value + i,
                            // time: [moment(undefined), moment(undefined)]
                        });
                    }
                });
                this.tableData = activities;
                this.timeData = timeDatas;
            },
            saveData(){
                this.saveVisit=true;
            },
            handleOk(){},
            handleCancel(){
                this.saveVisit=false;
            },
        }
    }
</script>
<style lang="less" scoped>
    .curriculum_content{
        background-color: white;
        margin-top: 10px;
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        min-height: 800px;
    }
    .buttons{
        margin:0px 5px 20px 5px;
        padding:2px 4px;
        margin-left: 30px;
    }
    .buttons button{
        width: 110px;
        height: 45px;
        color:white;
    }
    .buttons-sub{
        margin-top: 10px;
        padding:2px 4px;
    }
    /*/deep/ Table {*/
    /*    .ant-table-thead > tr > th {*/
    /*        background-color: #f4f4f4;*/
    /*    }*/
    /*    .ant-table-tbody > tr:nth-child(2) > td:nth-child(2){*/
    /*        background-color: #f00;*/
    /*        color: white;*/
    /*    }*/
    /*    .ant-table-tbody > tr:first-child > td:nth-child(5),*/
    /*    .ant-table-tbody > tr:first-child > td:nth-child(4),*/
    /*    .ant-table-tbody > tr:first-child > td:nth-child(3){*/
    /*        background-color: #bcbcbc;*/
    /*    }*/
    /*    .ant-table-tbody > tr:nth-child(2) > td:nth-child(3){*/
    /*        background-color: #1abc9c;*/
    /*    }*/
    /*}*/

</style>
