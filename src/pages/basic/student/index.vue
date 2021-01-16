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
        </a-table>
      </div>
  </a-card>
</template>
<script>
  const columns = [
    {
      title: '学号',
      dataIndex: 'wxUid',
    },
    {
      title: '学生',
      dataIndex: 'userName'
    },
    {
      title: '年级名称',
      dataIndex: 'gradeName',
    },
    {
      title: '班级名称',
      dataIndex: 'className',
    },
    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   scopedSlots: { customRender: 'operation' },
    // }
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
        disabled: false,
        form:{
        },
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
      //选择级部
      handleAdminChange(){
        for (let i=0;i<this.adminData.length;i++){
          if(i==this.form.adminId){
            //获取年级
              this.gradeData=this.adminData[i].trees,
            console.log(this.gradeData)
          }
        }
      },
      //选择年级
      handleGradeChange(){
        for (let i=0;i<this.gradeData.length;i++){
          if(i==this.form.gradeId){
            //获取班级信息
            this.classData=this.gradeData[i].trees
            console.log(this.classData)
          }
        }
      },
      //选择班
      async handleClassChange(){
        console.log(this.form.classId)
        for(let i=0;i<this.classData.length;i++){
          if(i==this.form.classId){
            //获取表格信息
            let {data}=await this.$api.basic.student.fetchList({id:this.classData[i].classId});
            console.log(data);
            this.dataSource=data.rows;
            console.log(this.dataSource)
          }
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
