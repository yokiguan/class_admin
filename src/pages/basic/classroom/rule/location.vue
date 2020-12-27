<template>
    <a-card class="location_content">
        <a-row style="height: 40px;width: 1300px;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;margin-left: -35px;margin-top: -30px">
            <a-col>
                <span style="float: left;padding: 10px;">场地规则</span>
            </a-col>
        </a-row>
        <a-row>
            <a-form-model :modal="form" :label-col="{ span: 2 }" :wrapper-col="{ span:12}" >
                <a-form-model-item label="选择课表模板">
                    <a-select @change="handleSelectChange" :default-value="modalInfo[0]" v-model="form.modal">
                        <a-select-option v-for="(modalName,index) in modalInfo" :key="index" :value="modalName.id">
                            {{modalName.templateName}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
            </a-form-model>
        </a-row>
        <a-row>
            <a-table :rowKey="'serialNum'" :columns="columnsPlace"
                 :bordered="true" :pagination="false"
                 :data-source="placeData"
                 style="width: 45%;margin-left: 50px;margin-top: 20px">
                <a-checkbox slot="checkBox" @change="change"></a-checkbox>
                <span slot="action">查看</span>
            </a-table>
        </a-row>
    </a-card>
</template>
<script>
    const columnsPlace=[
        {
            title:'',
            dataIndex:'blank',
            scopedSlots:{customRender:'checkBox'},
            align:'center',
            width:'8%'
        },
        {
            title:'序号',
            dataIndex:'serialNum',
            align:'center',
            width:'13%'
        },
        {
            title:'规则名称',
            dataIndex:'regularName',
            align:'center',
            width:'40%'
        },
        {
            title:'包含老师数量',
            dataIndex:'num',
            align:'center',
            width:'24%'
        },
        {
            title:'操作',
            dataIndex:'opts',
            align:'center',
            width:'15%',
            scopedSlots: { customRender: 'action' },
        },
    ]
    const placeData=[
        {
            serialNum:1,
            regularName:'英语老师时间规则',
            num:'2',
        },
        {
            serialNum:2,
            regularName:'数学老师时间规则',
            num:'1',
        },
        {
            serialNum:3,
            regularName:'体育老师时间规则',
            num:'3',
        }
    ]
    export default {
        data(){
            return{
                columnsPlace,
                placeData,
                modelName:[],
                modalInfo:[],
                modalName:"",
                modalIds:[],
                form:{
                    modal:" ",
                }
            }
        },
        async created(){
            //获取课表模板信息
            let {data}=await this.$api.basic.template.fetchList()
            this.modalInfo=data.rows;
            console.log(this.modalInfo);
            for(var i=0;i<this.modalInfo.length;i++){
                this.modalIds.push(this.modalInfo[i].id);
            }
            console.log(this.modalIds);
            //获取场地信息
            let {data:placeData}=await this.$api.basic.classroom.fetchRuleList({currId:this.modalIds})
            console.log(placeData)

        },
        methods:{
            change(){},
            handleSelectChange(){},
        },
        watch:{
            "form.modal" () {
                this.$emit("form-modal-change", this.form.modal)
            }
        }
    }
</script>
<style lang="less" scoped>
    .location_content{
        background-color: white;
        margin-top: 10px;
        padding: 20px 25px;
        border-radius: 10px;
        text-align: center;
        width: 100%;
        height: 440px;
    }
</style>
