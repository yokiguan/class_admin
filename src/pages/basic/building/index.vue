<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="showModal" type="primary">新建</a-button>
      </div>
      <a-table
         :rowKey="'buildingId'"
         :columns="columns"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
        @change="onchange">
      <span slot="operation" slot-scope="text,record">
        <a @click="edit(record.buildingId)">编辑</a>
        <a-popconfirm v-if="dataSource.length"
                      title="确认删除?"
                      cancelText="取消"
                      okText="确定"
                      @confirm="() => deleteItem(record.buildingId)">
          <a href="javascript:;" style="margin-left: 50px" >删除</a>
        </a-popconfirm>
    </span>
      </a-table>
    </div>
     <a-modal
      :title="changeTitle"
      :visible="show"
      :closable="false">
       <template slot="footer">
         <a-button key="Save" type="primary" :loading="loading" @click="handleOk()">保存</a-button>
         <a-button key="back" @click="handleCancel">取消</a-button>
       </template>
      <a-form-model ref="formName" :model="form" :rules="rules">
        <a-form-model-item label="教学楼名称" prop="name" ref="name">
          <a-input v-model="form.name" placeholder="请输入你想要新增的教学楼名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="教学楼层数" prop="floor" ref="floor">
          <a-input v-model.number="form.floor"
            placeholder="请输入你想要新增的层数">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="是否启用" >
            <a-switch v-model="form.status"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>
<script>
import {message} from 'ant-design-vue'
const columns = [
  {
    title: '教学楼编号',
    dataIndex: 'buildingId'
  },
  {
    title: '教学楼名称',
    dataIndex: 'name'
  },
  {
    title: '楼层',
    dataIndex: 'floor',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender:(text)=>text==1?'可用':'不可用'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
]
export default {
    name: 'classroom',
    async created() {
        let {data} = await this.$api.basic.building.fetchList();
        this.dataSource = data.rows;
        console.log(data);
    },
    data() {
        return {
            show: false,
            columns: columns,
            dataSource: [],
            loading:false,
            selectedRowKeys: [],
            selectedRows: [],
            editText:-1,
            newName:"",
            formItemLayout: {
                labelCol: {span: 6},
                wrapperCol: {span: 14}
            },
           changeTitle:'新增教学楼',
            form:{
               name:" ",
               floor:'',
               status:false,
            },
            rules:{
               name:[
                    {
                        required:true,
                        message:"请输入教学楼名称！",
                        trigger:"blur"
                    }
                ],
                floor:[
                    {
                        required:true,
                        message:"请输入楼层！",
                        trigger:"blur"
                    },
                  {
                    type:'number',
                    message: "请输入数字"
                  }
                ]

            }
        }
    },
    methods:{
        showModal() {
            this.changeTitle = '新增教学楼'
            this.show = true;
        },
        async handleOk() {
          console.log(this.form.name);
          if(this.changeTitle=="新增教学楼"){
            for(let i=0;i<this.dataSource.length;i++){
              if(this.form.name==this.dataSource[i].name){
                alert("教学楼已存在，请输入新的教学楼！");
              } else{
                this.newName=this.form.name;
                this.show = false;
              }
            }
            let formData = {
              name:this.newName,
              floor: parseInt(this.form.floor),
              status: this.form.status ? 1 : 0
            };
            let addData={...formData}
            let {data} = await this.$api.basic.building.saveBuilding(addData);
            console.log(data);
            let {data:buildData} = await this.$api.basic.building.fetchList()
            console.log("buildData",buildData)
            this.dataSource = buildData.rows
          } else{
            let  formData={
              buildingId:this.dataSource[this.editText].buildingId,
              name:this.form.name,
              floor:this.form.floor,
              status: this.form.status ? 1 : 0
            }
            let addData={...formData}
            let {data:saveData}=await this.$api.basic.building.saveBuilding(addData);
            let {data:buildingData}=await this.$api.basic.building.fetchList();
            console.log("buildingData",buildingData)
            this.dataSource=buildingData.rows;
            this.show=false;
          }
        },
        handleCancel() {
            this.show = false;
        },
        onchange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
        },
        edit(id){
          this.changeTitle='编辑教学楼'
          this.show=true
          this.editText=this.dataSource.findIndex(item=>item.buildingId==id)
          this.form.name=this.dataSource[this.editText].name;
          this.form.floor=this.dataSource[this.editText].floor;
          this.form.status=this.dataSource[this.editText].status;
          console.log(this.editText)
        },
        async deleteItem(id) {
          let {data} = await this.$api.basic.building.deleteBuilding({ids:[id]});
          console.log(data)
          if(data&&data.success){
            let {data:buildData} = await this.$api.basic.building.fetchList()
            console.log("buildData",buildData)
            this.dataSource = buildData.rows
            message.info('删除成功')
          } else{
            message.info('删除失败')
          }
        },
    }
}
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
