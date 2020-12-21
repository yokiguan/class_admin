<template>
  <a-card>
    <a-form layout="horizontal">
      <a-row>
        <a-col :md="8" :sm="24">
          <a-form-model-item
                  label="年级"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }" prop="gradeData">
            <a-select placeholder="请选择" v-model="form.gradeData">
              <a-select-option value="高一">高一</a-select-option>
              <a-select-option value="高二">高二</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item
                  label="年级"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 18, offset: 1 }" prop="classData">
            <a-select placeholder="请选择" v-model="form.classData">
              <a-select-option value="高一1班">高一1班</a-select-option>
              <a-select-option value="高二1班">高二1班</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div>
      <admin-table
              :rowKey="'no'"
              :columns="columns"
              :dataSource="dataSource"
              :selectedRows="selectedRows"
              @change="onchange"
      />
    </div>
    <a-modal
            :visible='addClassVisit'
            width="600px"
            :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
          保存
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </template>
      <a-form-model ref="ruleForm" :model="form" :rules="rules"
              :label-col="{span:5}" :wrapper-col="{span:12}" style="margin-left: 70px">
        <a-form-model-item label="人数" prop="name" ref="name">
          <a-input placeholder="1班" v-model="form.name"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import AdminTable from "../../../components/table/AdminTable";
const columns = [
  {
    title: "班级序号",
    dataIndex: "classId"
  },
  {
    title: "班级",
    dataIndex: "className"
  },
  {
    title: "所属年级",
    dataIndex: "gradeId"
  },
  {
    title: "人数",
    dataIndex: "number"
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];

export default {
  name: "class",
  components: {AdminTable},
  data() {
    return {
      columns: columns,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      addClassVisit:false,
      loading:false,
      form:{
        name:'',
        classData:undefined,
        gradeData:undefined,
      },
      rules:{
        name:[
          {
            required:true,
            message:"请输入人数！",
            trigger:"blur"
          }
        ],
        classData:[
          {
            required:true,
            message:"请选择班级！",
            trigger:"change"
          }
        ],
        gradeData:[
          {
            required:true,
            message:"请选择年级！",
            trigger:"change"
          }
        ]
      }
    };
  },
  // async addList(){
  //   let{data}=this.$api.basic.adminClass.saveClass({ id });
  //   this.dataSource=this.dataSource+data
  // },
  async created() {
    let { data } = await this.$api.basic.adminClass.fetchList();
    this.dataSource = data.rows;
  },
  methods: {
    onchange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    remove() {
      this.dataSource = this.dataSource.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
      this.selectedRows = this.selectedRows.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
    },
    addNew() {
      this.addClassVisit=true
    },
    async deleteItem(id) {
      let { data } = this.$api.basic.adminClass.deleteClass({ id });
      if (data.success) {
        this.dataSource = this.dataSource.filter(item => item.classId == id);
      }
    },
    gotoNew(id) {
      this.$router.push("/basic/class/member?id=" + id);
    },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          setTimeout(() => {
            this.dataSource.push({
              classId: this.dataSource.length + 1,
              number:this.form.name,
              className:this.form.classData,
              gradeId:this.form.gradeData,
            })
            this.loading = false
            this.addClassVisit = false
            this.$refs.ruleForm.resetFields();
          }, 300)
        } else {
          console.log('error submit!!');
          return false
        }
      });
    },
    handleCancel(){
      this.addClassVisit=false
    },
  }
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
