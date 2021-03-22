<template>
 <div>
   <div class="result">
     <a-breadcrumb>
       <a-breadcrumb-item>首页</a-breadcrumb-item>
       <a-breadcrumb-item>基础设置</a-breadcrumb-item>
       <a-breadcrumb-item><router-link to="#">教学楼</router-link></a-breadcrumb-item>
     </a-breadcrumb>
   </div>
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
          <a href=" " style="margin-left: 50px" >删除</a>
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
       <a-form-model ref="ruleForm" :model="form" :rules="rules">
         <a-form-model-item label="教学楼名称" prop="name" ref="name">
           <a-input v-model.trim="form.name" placeholder="请输入你想要新增的教学楼名称"></a-input>
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
 </div>
</template>
<script>
  import {message} from 'ant-design-vue'
  const columns = [
    {
      title: '教学楼编号',
      dataIndex: 'buildingId',
      align:'center',
      customRender: function(t, r, index) {
        return parseInt(index) + 1
      }
    },
    {
      title: '教学楼名称',
      dataIndex: 'name',
      align:'center',
    },
    {
      title: '楼层',
      dataIndex: 'floor',
      align:'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align:'center',
      customRender:(text)=>text==1?'可用':'不可用'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align:'center',
      scopedSlots: { customRender: 'operation' },
    }
  ]
  export default {
    name: 'classroom',
    created() {
      this.gainBaseInfo();
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
      //获取基本信息
      async gainBaseInfo(){
        let {data} = await this.$api.basic.building.fetchList();
        this.dataSource = data.rows;
        console.log(data);
      },
      async handleOk() {
        console.log(this.form.name);
        console.log(this.changeTitle);
        if(this.changeTitle=="新增教学楼"){
          let noHave = true;
          for(let i=0;i<this.dataSource.length;i++){
            console.log(this.form.name === this.dataSource[i].name,this.form.name,this.dataSource[i].name)
            if(String(this.form.name) === String(this.dataSource[i].name)){
              this.$message.info("教学楼已存在，请输入新的教学楼！");
              noHave = false;
              break;
            }
          }
          console.log(noHave)
          if (noHave) {
            this.show = false;
            let formData = {
              name: this.form.name,
              floor: parseInt(this.form.floor),
              status: this.form.status ? 1 : 0
            };
            let addData={...formData};
            console.log(addData);
            let {data} = await this.$api.basic.building.saveBuilding(addData);
            console.log(data);
            this.gainBaseInfo();
          } else {
            this.$message.warning("保存失败！")
          }
          this.$refs.ruleForm.resetFields();
        } else{
          let  formData={
            buildingId:this.dataSource[this.editText].buildingId,
            name:this.form.name,
            floor:this.form.floor,
            status: this.form.status ? 1 : 0
          }
          let addData={...formData}
          let {data:saveData}=await this.$api.basic.building.saveBuilding(addData);
          this.gainBaseInfo();
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
        this.form.status=this.dataSource[this.editText].status ? true:false;
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
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
