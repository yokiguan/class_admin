<template>
  <a-card>
      <div class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
      </div>
      <a-table
        :rowKey="'no'"
        :columns="columns"
        :dataSource="dataSource"
        closable="false">
          <span slot="operation" slot-scope="text, record">
            <a style="margin-left: 50px" @click="deleteItem(record.buildingId)">删除</a>
          </span>
      </a-table>
      <a-modal title="新增课程" :visible='showSubject'>
          <template slot="footer">
              <a-button key="Save" type="primary" :loading="loading" @click="handleOk()">保存</a-button>
              <a-button key="back" @click="handleCancel">取消
              </a-button>
          </template>
         <a-form-model :model="form" :rules="rules">
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
  name: "grade·subjects",
  data() {
    return {
      columns,
      dataSource,
      gradeId:'',
      showSubject:false,
      dataSource:[],
    };
  },
   async created() {
    let queryString=(window.location.hash || " ").split('?')[1]
    let id=(queryString || " ").split('=')[1]
    if(id){
      let { data } = await this.$api.basic.grade.fetchGrade({gradeId:id});
      this.dataSource=data.result?.subjectEntities
      this.gradeId=id
    }
  },
    beforeCreate() {
        this.form = this.$form.createForm(this, {name: "grade"});
    },
  methods: {
    addNew() {
        this.showSubject=true
    },
    handleCancel(){
        this.showSubject=false
    },
    async handleOk(){
        let formDat={
            ...this.form,
            name:this.form.addSub,
        }
      let {res}=await this.$api.basic.building.saveGradeSubject(this.form.addSub);
          this.showSubject=false;
          this.dataSource.unshift()
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
