<template>
  <a-card>
      <a-form-model layout="horizontal">
        <a-row>
          <a-col :md="7" :sm="24">
            <a-form-model-item label="级部" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select placeholder="请选择"  v-model="form.adminId" @change="handleAdminChange">
                <a-select-option v-for="(admin,index) in this.adminData" :key="index">
                  {{admin.departName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="7" :sm="24">
            <a-form-model-item label="年级" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select placeholder="请选择" v-model="form.gradeId" @change="handleGradeChange">
                <a-select-option v-for="(grade,index) in this.gradeData" :key="index">
                  {{grade.gradeName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="7" :sm="24">
            <a-form-model-item label="班级" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select placeholder="请选择" v-model="form.classId" @change="handleClassChange">
                <a-select-option v-for="(className,index) in this.classData" :key="index">
                  {{className.className}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div>
        <a-table
                :rowKey="'wxUid'"
                :columns="columns"
                :dataSource="dataSource">
          <div slot="operation">
            <a>查看</a>|
            <a>修改</a>
          </div>
        </a-table>
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
        <a-form-model :model="form" ref="ruleForm" :rules="rules"
                      :label-col="{span:5}" :wrapper-col="{span:12}" style="margin-left: 70px">
          <a-form-model-item label="学生姓名" ref="student_name" prop="student_name">
            <a-input style="width: 300px" placeholder="车东明" v-model="form.student_name"/>
          </a-form-model-item>
          <a-form-model-item label="学号" ref="student_num" prop="student_num">
            <a-input style="width: 300px" placeholder="007" v-model="form.student_num"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
  </a-card>
</template>
<script>
  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'no'
    // },
    {
      title: '学生',
      dataIndex: 'userName'
    },
    {
      title: '学号',
      dataIndex: 'wxUid',
    },
    {
      title: '年级名称',
      dataIndex: 'gradeName',
    },
    {
      title: '班级名称',
      dataIndex: 'className',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    }
  ]
  export default {
    name: 'student',
    data () {
      return {
        columns: columns,
        dataSource: [],
        adminData:[],
        gradeData:[],
        classData:[],
        result:null,
        addClassVisit:false,
        loading:false,
        disabled: false,
        form:{
          adminName:'',
          student_num:'',
          classData:[],
        },
        rules:{
          student_name:[{
            required:true,
            message:"请输入学生姓名！",
            trigger:"blur"
          }],
          student_num:[{
            required:true,
            message:"请输入学号！",
            trigger:"blur"
          }],
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
      }
    },
    //获取年级信息接口
    async created(){
      let {data:{result,success}}=await this.$api.basic.student.fetchGradeList();
      console.log(result);
      //获取级部
      this.adminData=result;
      console.log(this.adminData);

    },
    methods: {
      handleAdminChange(){
        for (let i=0;i<this.adminData.length;i++){
          if(i==this.form.adminId){
            //获取年级
              this.gradeData=this.adminData[i].trees,
            console.log(this.gradeData)
          }
        }
      },
      handleGradeChange(){
        for (let i=0;i<this.gradeData.length;i++){
          if(i==this.form.gradeId){
            //获取班级信息
            this.classData=this.gradeData[i].trees
            console.log(this.classData)
          }
        }
      },
      async handleClassChange(){
        for(let i=0;i<this.classData.length;i++){
          if(i==this.form.classData){
            //获取表格信息
            let {data}=await this.$api.basic.student.fetchList({id:this.classData[i].classId});
            console.log(data);
            this.dataSource=data.rows;
            console.log(this.dataSource)
          }
        }
      },
      addNew () {
        this.addClassVisit=true
      },
      handleMenuClick (e) {
        if (e.key === 'delete') {
          this.remove()
        }
      },
      handleOk() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.loading = true
            setTimeout(() => {
              this.dataSource.push({
                key: this.dataSource.length + 1,
                no: this.dataSource.length + 1,
                name:this.form.student_name,
                studentID:this.form.student_num,
                class: this.form.classData,
                grade:this.form.gradeData,
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
      edit(text,record){
        this.addClassVisit=true
        console.log(text,record);
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
