<template>
    <div>
        <div class="result">
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
                <a-breadcrumb-item><a href="">行政班排课任务</a></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="content">
            <a-row>
                <a-col :span="17"><span style="font-size:1.5em">{{this.planData}}</span></a-col>
                <a-col>
                    <button style="background-color: #19b294;
                        color: white;
                        height: 40px;
                        border: none;
                        border-radius: 5px;
                        float: right;
                        width: 150px" @click="back">返回</button>
                </a-col>
            </a-row>
        </div>
        <a-card class="table-bg">
            <a-table :rowKey="'id'"
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="pagination"
                     @change="handleTableChange"
                    :bordered="true" style="margin-top: 20px;width:1200px;height: 700px">
                <div slot="option" style="color: blue"  slot-scope="text,record">
                    <a-row>
                       <span style="float:left "  @click="onClickLook(record.id)">查看</span>
                       <span style="margin-left:0px "  @click="delet(record.id)">删除</span>
                       <span style="margin-left: 50px " @click="publishChoose(record.id)">发布结果</span>
                    </a-row>
                </div>
            </a-table>
        </a-card>
    </div>
</template>
<script>
    const columns = [
        {
            align: "center",
            title: " ",
            dataIndex: 'id',
            width:'5%',
            customRender: function(t, r, index) {
                return parseInt(index) + 1
            }
        },
        {
            title: '任务名称',
            dataIndex: 'taskName',
            align:'center',
            width:'15%'
        },
        {
            title: '创建时间',
            dataIndex: 'scheduleCreated',
            align:'center',
            width:'15%'
        },
        {
            title: '状态',
            dataIndex: 'scheduleStatus',
            align:'center',
            width:'15%'
        },
        {
            title: '操作',
            dataIndex: 'opt',
            align:'center',
            scopedSlots: { customRender: 'option' },
            width:'50%'
        },
    ];
    export default {
        data() {
            return {
                columns,
                tableData:[],
                visible: false,
                loading: false,
                planId:"",
                planData:"",
                classType:"",
                pagination:{
                    total:0,                    //默认的总数据条数，在后台获取列表成功之后对其进行赋值
                    pageSize:20,    //默认每页显示的条数
                    showSizeChanger:true,
                    onShowSizeChange:(current,pageSize)=>{
                        this.pageSize=pageSize;
                    },
                    showTotal:total=>`共有${total}条数据`,            //分页中显示的数据总数
                },
                queryParam:{
                    page:1,//第几页
                    size:20,   //每页中显示的数据条数
                },
            };
        },
        async created() {
            let queryString = (window.location.hash || " ").split('?')[1]
            let planId = (queryString || " ").split('=')[1]
            this.planId = planId;
            if (planId) {
                //获取单个选课计划的信息
                let {data: {result, success}} = await this.$api.schedule.plan.schedulegetInfo({planId})
                this.planData = result.name;
                console.log(result);
                this.classType=result.type;
            }
            this.lookInfo();
        },
        methods:{
            //走班排课查看
            async lookInfo(){
                 let {data}=await this.$api.schedule.classTask.getScheduleTask({planId:this.planId});
                 console.log(data);
                 this.tableData=data.rows;
                 console.log(this.tableData);
                const pagination={...this.pagination};
                pagination.total=data.total;
                this.pagination=pagination;
            },
            //监听表格
            async handleTableChange(pagination) {
                this.pagination.current = pagination.current;
                this.pagination.pageSize = pagination.pageSize;
                this.queryParam.page = pagination.current;
                this.queryParam.size = pagination.pageSize;
                console.log(this.pagination.current);
                console.log(this.pagination.pageSize);
                this.lookInfo();
            },
            //查看
            onClickLook(id){
                this.$router.push(`/schedule/detail/task_admin/class?planId=${this.planId}&scheduleTaskId=${id}`);
            },
            //删除
            async delet(id){
                // console.log();
                let {data}=await this.$api.schedule.classTask.deletScheduleTask({ids:[id]});
                console.log(data);
                this.lookInfo();
                console.log(this.tableData);
            },
            //继续排课
            async conArrClass(id){
              let {data}=await this.$api.schedule.classTask.continue({planId:this.planId,id:id});
              console.log(data);
              if(data&&data.success){
                  message.info("继续调课成功！");
              }else{
                  message.info("排课已结束，无行政班排课！");
              }
            },
            //发布选课
            async publishChoose(id){
                let {data}=await this.$api.schedule.classTask.publishResult({planId:this.planId,scheduleTaskId:id});
                console.log(data);
                if(data&&data.success){
                    alert("发布选课成功");
                }
            },
            //返回
            back(){
                this.$router.go(-1)
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
        height: 150px;
        margin: 0px 0px 20px 0px;
        padding: 20px 25px;
        vertical-align: top;
        border-radius: 5px;
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
        text-align: center;
        width: 100%;
    }
</style>
