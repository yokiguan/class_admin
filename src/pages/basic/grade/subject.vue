<template>
  <a-card>
      <div class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
      </div>
      <a-table
        :rowKey="'subChildId'"
        :columns="columns"
        :dataSource="dataSource">
          <span slot="operation" slot-scope="text, record">
            <a style="margin-left: 50px" @click="deleteItem(record.buildingId)">删除</a>
          </span>
      </a-table>
      <a-modal title="新增课程"
               :visible='showSubject'
               :closable="false">
          <template slot="footer">
              <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
              <a-button key="back" @click="handleCancel">取消</a-button>
          </template>
         <a-form-model :model="form" :rules="rules":label-col="{span:5}" :wrapper-col="{span:12}">
             <a-form-model-item label='课程名' prop="addsub" ref="addsub">
                 <a-input placeholder='请输入你想要新增的课程名'  v-model="form.addSub"></a-input>
             </a-form-model-item>
         </a-form-model>
      </a-modal>
  </a-card>
</template>

<script>
const columns = [
  {
    title: "课程编号",
    dataIndex: "subChildId",
  },
  {
    title: "课程名称",
    dataIndex: "name",
  },
  {
    title: "操作",
    dataIndex: "text,value",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  data() {
    return {
      columns,
      loading:false,
      showSubject:false,
      dataSource:[],
      form:{
          addSub:"",
      },
      rules:{
          addSub:[
              {
                  required:true,
                  message:"请输入要加入的课程名称！",
                  trigger:"blur"
              }
          ]
        },
    };
  },
  // async created(){
  //     let querystring=(window.location.hash ||" ").split('?')[1]
  //     let id=(querystring || " ").split('=')[1];
  //     if(id){
  //         let {data:{result,success}}=await this.$api.basic.subject.fetchGrade({id});
  //         console.log(result.subjectChildEntitys)
  //     }
  // }  ,
  methods: {
    addNew() {
        this.showSubject=true;
    },
    handleCancel(){
        this.showSubject=false
    },
    async handleOk(){
        let formData={
            ...this.form,
            name:this.form.addSub,
        }
        let addData={...formData};
        let {res}=await this.$api.basic.grade.saveGradeSubject(addData);
        console.log(res);
        this.showSubject=false;
        this.dataSource.unshift(addData);
      },
    async deleteItem(id){
        let {data}=this.api.basic.grade.deleteGradeSubject({subChildIds:id})
        if(data.success){
            this.dataSource=this.dataSource.filter(item => item.subChildId==id);
            message.info('删除成功')
        }
        return success
    }
  },
};
</script>

<style lang="less" scoped>
    .search {
        margin-bottom: 54px;
    }
    .fold {
        width: calc(100% - 216px);
        display: inline-block;
    }
    .operator {
        margin-bottom: 18px;
    }
    @media screen and (max-width: 900px) {
        .fold {
            width: 100%;
        }
    }
</style>
