<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>基础设置</a-breadcrumb-item>
        <a-breadcrumb-item>教室</a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="#">教室管理</router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
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
  </div>
</template>
<script>
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
@media screen and (max-width: 900px) {

}
</style>
