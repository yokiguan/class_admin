<template>
  <a-card>
      <a-form-model layout="horizontal" :form="form">
        <a-row>
          <a-col :md="5" :sm="20">
            <a-form-model-item label="级部" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select placeholder="请选择"  v-model="form.adminId" @change="handleAdminChange">
                <a-select-option v-for="(admin,index) in this.adminData" :key="index">
                  {{admin.departName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="5" :sm="20">
            <a-form-model-item label="年级" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select placeholder="请选择" v-model="form.gradeId" @change="handleGradeChange">
                <a-select-option v-for="(grade,index) in this.gradeData" :key="index">
                  {{grade.gradeName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="5" :sm="20">
            <a-form-model-item label="班级" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select placeholder="请选择" v-model="form.classId" @change="handleClassChange">
                <a-select-option v-for="(className,index) in this.classData" :key="index">
                  {{className.className}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="9" :sm="20">
            <a-form-model-item label="按姓名查找" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15, offset: 1 }">
              <a-input-search placeholder="请输入老师姓名"  v-model="form.studentName" @search="onSearch"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div>
        <a-table
                :rowKey="'wxUid'"
                :columns="columns"
                :pagination="pagination"
                :dataSource="dataSource"
                @change="handleTableChange">
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
        pagination:{
          total:0,    //默认的总数据条数，在后台获取列表成功之后对其进行赋值
          pageSize:20,    //默认每页显示的数据总数
          showSizeChanger:true,
          onShowSizeChange:(current,pageSize)=>this.pageSize=pageSize,
          showTotal:total=>`共有${total}条数据`,
        },
        form:{
          studentName:"",
          adminId:"",
          gradeId:"",
          classId:"",
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
      //查询所有学生信息
      let {data:allStudent}=await this.$api.basic.student.fetchList({current:1,rowCount:20});
      console.log(allStudent)
      this.dataSource=allStudent.rows;
      console.log(this.dataSource)
      this.pagination.total=allStudent.total;
      console.log(this.pagination.total);
    },
    methods: {
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize);
      },
      //监听table
      handleTableChange(pagination){
        this.pagination.current=pagination.current;
        this.pagination.pageSize=pagination.pageSize;
        console.log(this.pagination.current);
        console.log(this.pagination.pageSize);
        // this.onSearch();
        if(this.form.adminId!=undefined) {
          if (this.form.gradeId != undefined) {
            if (this.form.classId != undefined) {
              this.handleClassChange();
            } else {
              this.handleGradeChange();
            }
          } else {
            this.handleAdminChange();
          }
        }else{
            this.onSearch();
        }
      },
      // //选择级部
      async handleAdminChange(){
        for (let i=0;i<this.adminData.length;i++){
          if(i==this.form.adminId){
            //获取年级
            this.gradeData=this.adminData[i].trees,
            console.log(this.gradeData)
            //查询某一级部的全学生
            let {data:adminAllStudent}=await this.$api.basic.student.fetchList({current:this.pagination.current,rowCount:this.pagination.pageSize,id: this.adminData[i].id});
            console.log(adminAllStudent);
            this.dataSource=adminAllStudent.rows;
            this.pagination.total=adminAllStudent.total;
            console.log(this.pagination.total);
          }
        }
      },
      //选择年级
      async handleGradeChange(){
        console.log(this.pagination.current)
        console.log(this.pagination.pageSize)
        for (let i=0;i<this.gradeData.length;i++){
          if(i==this.form.gradeId){
            //获取班级信息
            this.classData=this.gradeData[i].trees
            // console.log(this.classData)
            // console.log(this.gradeData[i].gradeId);
            //根据年级和级部查询学生信息
            let {data:gradeAllStudent}=await this.$api.basic.student.fetchList({current:this.pagination.current,rowCount:this.pagination.pageSize,id:this.adminData[this.form.adminId].id,gradeId:this.gradeData[i].gradeId});
            console.log(gradeAllStudent);
            this.dataSource=gradeAllStudent.rows;
            console.log(this.dataSource);
            this.pagination.total=gradeAllStudent.total;
            console.log(this.pagination.total);
          }
        }
      },
      //选择班
      async handleClassChange() {
        console.log(this.form.classId)
        console.log(this.pagination.current)
        console.log(this.pagination.pageSize)
        for (let i = 0; i < this.classData.length; i++) {
          if (i == this.form.classId) {
            //获取表格信息
            let {data}=await this.$api.basic.student.fetchList({current:this.pagination.current,rowCount:this.pagination.pageSize,id: this.adminData[this.form.adminId].adminId,gradeId: this.gradeData[this.form.gradeId].gradeId,classId:this.classData[i].classId})
            console.log(data);
            this.dataSource = data.rows;
            console.log(this.dataSource);
            this.pagination.total = data.total;
            console.log(this.pagination.total);
          }
        }
      },
      //根据姓名查找学生
      async onSearch(value) {
        if(this.form.adminId==undefined||this.form.gradeId==undefined||this.form.classId){
          // //只根据姓名查找学生信息
          let {data:allTeacherData}=await this.$api.basic.student.fetchList({current:this.pagination.current,rowCount:this.pagination.pageSize,userName:this.form.studentName});
          console.log(allTeacherData);
          this.dataSource=allTeacherData.rows;
          console.log(this.dataSource)
          this.pagination.total=allTeacherData.total;
        }else {
          let {data}=await this.$api.basic.student.fetchList({current:this.pagination.current,rowCount:this.pagination.pageSize,id: this.adminData[this.form.adminId].adminId,gradeId: this.gradeData[this.form.gradeId].gradeId,classId:this.classData[this.form.classId].classId,userName: this.form.studentName})
          console.log(data)
          this.dataSource=data.rows;
          console.log(this.dataSource)
          this.pagination.total=data.total;
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
