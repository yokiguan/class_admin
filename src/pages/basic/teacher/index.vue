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
              :pagination="pagination"
              :dataSource="dataSource"
              @change="handleTableChange">
        <div slot="operation">
          <span @click="edit">编辑</span>|
          <span @click="settingRule">规则设置</span>
        </div>
      </a-table>
    </div>
    <a-modal
            :visible='editVisit'
            width="600px"
            :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form-model :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" style="margin-left: 70px">
        <a-form-model-item label="老师姓名">
          <a-input style="width: 300px" disabled="false" v-model="form.teacherName"/>
        </a-form-model-item>
        <a-form-model-item label="联系电话">
          <a-input style="width: 300px" disabled="false" v-model="form.tel"/>
        </a-form-model-item>
        <a-form-model-item label="是否是班主任" style="margin-left: 30px">
          <a-radio-group v-model="form.type" disabled="disabled" style="margin-left: 40px">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="其他授课年级" style="margin-left: 30px">
          <a-select v-model="form.grade" style="width: 270px" disabled="disabled">
            <a-select-option value="china">China</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="选择班级">
          <a-select v-model="form.class" style="width: 300px" disabled="disabled">
            <a-select-option value="china">China</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-item label="所授课程">
          <a-input-search style="margin-bottom: 8px" placeholder="请输入" @search="onSearch" />
<!--          <a-tree-->
<!--                  :show-line="showLine"-->
<!--                  :expanded-keys="expandedKeys"-->
<!--                  :auto-expand-parent="autoExpandParent"-->
<!--                  :tree-data="gData"-->
<!--                  @expand="onExpand">-->
<!--            <template slot="title" slot-scope="{ title }">-->
<!--                  <span v-if="title.indexOf(searchValue) > -1">-->
<!--                    {{ title.substr(0, title.indexOf(searchValue)) }}-->
<!--                     <span style="color: #f50">{{ searchValue }}</span>-->
<!--                      {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}-->
<!--                    </span>-->
<!--              <span v-else>{{ title }}</span>-->
<!--            </template>-->
<!--          </a-tree>-->
        </a-form-item>
      </a-form-model>
    </a-modal>
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
        editVisit:false,
        loading:false,
        pagination:{
          total:0,                    //默认的总数据条数，在后台获取列表成功之后对其进行赋值
          pageSize:20,    //默认每页显示的条数
          showSizeChanger:true,
          onShowSizeChange:(current,pageSize)=>{
            this.pageSize=pageSize;
          },
          showTotal:total=>`共有${total}条数据`,            //分页中显示的数据总数
        },
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
      let {data:allTeacherData}=await this.$api.basic.teacher.fetchAllTeacherList({current:1,rowCount:20});
      console.log(allTeacherData);
      this.dataSource=allTeacherData.rows;
      console.log(this.dataSource)
      this.pagination.total=allTeacherData.total;
    },
    methods: {
      //表格监听
      async handleTableChange(pagination){
        this.pagination.current=pagination.current;
        this.pagination.pageSize=pagination.pageSize;
        console.log(this.pagination.current)
        console.log( this.pagination.pageSize);
        if(this.form.adminId!=undefined){
          if(this.form.gradeId!=undefined){
            this.handleGradeChange();
          }else{
            this.handleAdminChange();
          }
        }else{
          this.onSearch();
        }
      },
      //级部监听
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
            // let newObj = []
          //   for(let i in data.rows){
          //     if(data.rows[i]) {
          //       newObj.push((data.rows[i]))
          //     }
          //   }
          //   console.log(newObj)
          //   this.dataSource=newObj;
            this.pagination.total=data.total;
          }
        }
      },
      //年级监听
       async handleGradeChange(){
        // console.log(this.form.gradeId)
        for (let i=0;i<this.gradeData.length;i++){
          if(i==this.form.gradeId){
            console.log(this.adminData[this.form.adminId].adminId)
            //根据年级信息调用接口
            let {data}=await this.$api.basic.teacher.fetchTeacherList({rowCount: this.pagination.pageSize,current:this.pagination.current,adminId:this.adminData[this.form.adminId].adminId,gradeId:this.gradeData[i].gradeId});
            console.log(data);
            this.dataSource=data.rows;
            this.pagination.total=data.total;
          }
        }
       },
      async onSearch(value) {
        console.log(value);
        console.log(this.form.teacherName);
        if(this.form.adminId==undefined||this.form.gradeId==undefined){
          // //只根据姓名查找教师信息
          let {data:allTeacherData}=await this.$api.basic.teacher.fetchAllTeacherList({rowCount: this.pagination.pageSize,current:this.pagination.current,teacherName:this.form.teacherName});
          console.log(allTeacherData);
          this.dataSource=allTeacherData.rows;
          console.log(this.dataSource)
          this.pagination.total=allTeacherData.total;
        }else {
          let {data}=await this.$api.basic.teacher.fetchTeacherList({rowCount: this.pagination.pageSize,current:this.pagination.current,adminId: this.adminData[this.form.adminId].adminId,gradeId: this.gradeData[this.form.gradeId].gradeId,teacherName: this.form.teacherName})
          console.log(data)
          this.dataSource=data.rows;
          this.pagination.total=data.total;
        }
      },
      //编辑
      edit(){
        this.editVisit=true;
      },
      //规则设置
      settingRule(){},
      //编辑信息的保存
      handleOk(){
        this.editVisit=false;
      },
      //编辑信息的取消
      handleCancel(){
        this.editVisit=false;
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
