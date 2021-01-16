<template>
  <a-card>
    <a-form-model layout="horizontal" :form="form" >
      <a-row>
        <a-col :md="7" :sm="24">
          <a-form-model-item label="级部" :labelCol="{ span: 3 }" :wrapperCol="{ span: 15, offset: 1 }">
            <a-select placeholder="请选择"  v-model="form.adminId" @change="handleAdminChange">
              <a-select-option v-for="(admin,index) in this.adminData" :key="index">
                {{admin.adminName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="7" :sm="24">
          <a-form-model-item label="年级" :labelCol="{ span: 3}" :wrapperCol="{ span: 15, offset: 1 }">
            <a-select placeholder="请选择" v-model="form.gradeId" @change="handleGradeChange">
              <a-select-option v-for="(grade,index) in this.gradeData" :key="index">
                {{grade.gradeName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="7" :sm="24">
          <a-form-model-item label="按姓名查找" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15, offset: 1 }">
           <a-input-search placeholder="请输入老师姓名"  v-model="form.teacherName" @search="onSearch"/>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <div>
      <a-table
              :rowKey="'teacherId'"
              :columns="columns"
              :dataSource="dataSource">
        <div slot="operation">
          <span>规则设置</span>
        </div>
      </a-table>
    </div>
  </a-card>
</template>
<script>
  const columns = [
    {
      title: '教师工号',
      dataIndex: 'teacherId',
    },
    {
      title: '教师名称',
      dataIndex: 'teacherName'
    },
    {
      title: '所授课程',
      dataIndex: 'subjectTeacherDtos',
      customRender: (text,index,i)=>{
        let course=""
        for(var j=0;j<text.length;j++){
          if(course==""){
            course=text[j].subName;
          }else{
            course=course+"+"+text[j].subName;
          }
        }
        return course;
    }
    },
    {
      title: '是否为班主任',
      dataIndex: 'teacherRoleDtos',
      customRender: (text,index,i)=>{
        let teacherRole=""
          if(text.length==0){
            teacherRole='非班主任'
          }else if(text.length==1){
            teacherRole=text[0].headteacherGradeName+text[0].headteacherClassName;
          }else{
            for(var j=0;j<text.length;j++){
              if(teacherRole==""){
                teacherRole=text[j].headteacherGradeName+text[j].headteacherClassName;
              }
              teacherRole=teacherRole+"+"+text[j].headteacherGradeName+text[j].headteacherClassName;
          }
        }
        return teacherRole;
      }
    },
    {
      title: '手机号码',
      dataIndex: 'tel',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    }
  ]
  export default {
    name: 'teacher',
    data () {
      return {
        columns: columns,
        dataSource: [],
        adminData:[],
        gradeData:[],
        teacherNameData:[],
        form:{
        },
      }
    },
    async created(){
      //获取年级信息接口
      let {data:{result,success}}=await this.$api.basic.grade.fetchList();
      console.log(result);
      //获取级部
      this.adminData=result;
      console.log(this.adminData);
      //获取所有教师信息
      let {data:allTeacherData}=await this.$api.basic.teacher.fetchAllTeacherList();
      console.log(allTeacherData);
      this.dataSource=allTeacherData.rows;
      console.log(this.dataSource)
    },
    methods: {
      async handleAdminChange(){
        console.log(this.form.adminId)
        for (let i=0;i<this.adminData.length;i++){
          if(i==this.form.adminId){
            // //获取年级
            this.gradeData=this.adminData[i].adminGrades,
            console.log(this.gradeData)
            // // //根据年级选择教师
            let {data}=await this.$api.basic.teacher.fetchTeacherList({adminId: this.adminData[i].adminId});
            console.log(data.rows);
            let newObj = []
            for(let i in data.rows){
              if(data.rows[i]) {
                newObj.push((data.rows[i]))
              }
            }
            console.log(newObj)
            this.dataSource=newObj;
          }
        }
      },
       async handleGradeChange(){
        // console.log(this.form.gradeId)
        for (let i=0;i<this.gradeData.length;i++){
          if(i==this.form.gradeId){
            console.log(this.adminData[this.form.adminId].adminId)
            //根据年级信息调用接口
            let {data}=await this.$api.basic.teacher.fetchTeacherList({adminId:this.adminData[this.form.adminId].adminId,gradeId:this.gradeData[i].gradeId});
            console.log(data);
            // this.dataSource=data.rows;
          }
        }
       },
      async onSearch(value) {
        console.log(value);
        console.log(this.form.teacherName);
        // //只根据姓名查找教师信息
        // let {data:allTeacherData}=await this.$api.basic.teacher.fetchAllTeacherList({teacherName:this.form.teacherName});
        // console.log(allTeacherData);
        // this.dataSource=allTeacherData.rows;
        // console.log(this.dataSource)
        let {data}=await this.$api.basic.teacher.fetchTeacherList({adminId: this.adminData[this.form.adminId].adminId,gradeId: this.gradeData[this.form.gradeId].gradeId,teacherName: this.form.teacherName})
        console.log(data)
        this.dataSource=data.rows;

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
