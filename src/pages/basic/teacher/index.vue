<template>
  <a-card>
    <a-form-model layout="horizontal" :form="form" >
      <a-row>
        <a-col :md="7" :sm="24">
          <a-form-model-item label="级部" :labelCol="{ span: 3 }" :wrapperCol="{ span: 15, offset: 1 }">
            <a-select placeholder="请选择"  v-model="form.adminId" @change="handleAdminChange">
              <a-select-option>--请选择--</a-select-option>
              <a-select-option v-for="(admin,index) in this.adminData" :key="index">
                {{admin.adminName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="7" :sm="24">
          <a-form-model-item label="年级" :labelCol="{ span: 3}" :wrapperCol="{ span: 15, offset: 1 }">
            <a-select placeholder="请选择" v-model="form.gradeId" @change="handleGradeChange">
              <a-select-option>--请选择--</a-select-option>
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
    <a-table :rowKey="'teacherId'"
              :columns="columns"
              :pagination="pagination"
              :dataSource="dataSource"
              @change="handleTableChange">
        <div slot="operation" slot-scope="text,record,index">
          <span @click="edit(index)">编辑</span>|
          <span @click="settingRule">规则设置</span>
        </div>
      </a-table>
    <a-modal :visible='editVisit'
            width="600px"
            :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form-model :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" style="margin-left: 70px">
        <a-form-model-item label="老师姓名">
          <a-input style="width: 300px" disabled="disabled" v-model="form.teaName"/>
        </a-form-model-item>
        <a-form-model-item label="联系电话">
          <a-input style="width: 300px" disabled="disabled" v-model="form.tel"/>
        </a-form-model-item>
        <a-form-model-item label="是否是班主任" style="margin-left: 30px">
          <a-input v-model="form.type" disabled="disabled" style="width: 270px"/>
        </a-form-model-item>
        <a-form-model-item label="所授课程">
<!--          :checkedKeys="checkedKeys"-->
          <a-tree-select v-model="form.course"
                         placeholder="请选择所授课程"
                         style="width: 275px"
                         @change="selectCourse"
                         tree-checkable
                         :tree-data="treeData"
                         :checkStrictly="true"
                         :defaultCheckedKeys="checkedKeys"
                         :show-checked-strategy="SHOW_PARENT">
          </a-tree-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>
<script>
  import { TreeSelect } from 'ant-design-vue';
  import { message } from 'ant-design-vue';
  const SHOW_PARENT = TreeSelect.SHOW_PARENT;
  const columns = [
    {
      title:'序号',
      dataIndex:'num',
      align:'center',
      customRender: function(t, r, index) {
        return parseInt(index) + 1
      }
    },,
    {
      title: '教师工号',
      dataIndex: 'teacherId',
      align:'center',
    },
    {
      title: '教师名称',
      dataIndex: 'teacherName',
      align:'center',
    },
    {
      title: '所授课程',
      dataIndex: 'subjectTeacherDtos',
      align:'center',
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
      align:'center',
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
      align:'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align:'center',
      scopedSlots: { customRender: 'operation' },
    }
  ]
  export default {
    data () {
      return {
        columns: columns,
        dataSource: [],
        adminData:[],
        gradeData:[],
        teacherNameData:[],
        editVisit:false,
        loading:false,
        value:"",
        treeData:[],
        checkedKeys:[],
        courseInfo:[],
        SHOW_PARENT,
        gradeIds:[],
        pagination:{
          total:0,                    //默认的总数据条数，在后台获取列表成功之后对其进行赋值
          pageSize:20,    //默认每页显示的条数
          showSizeChanger:true,
          onShowSizeChange:(current,pageSize)=>{
            this.pageSize=pageSize;
          },
          showTotal:total=>`共有${total}条数据`,            //分页中显示的数据总数
        },
        //查询参数
        queryParam:{
          page:1,//第几页
          size:20,   //每页中显示的数据条数
        },
        editText:-1,
        form:{
          teaName:"",
        },
      }
    },
    async created(){
      //获取年级信息接口
      let {data:{result,success}}=await this.$api.basic.grade.fetchList();
      // console.log(result);
      //获取级部
      this.adminData=result;
      // console.log(this.adminData);
      this.allTeacher();
    },
    methods: {
      //表格监听
      async handleTableChange(pagination){
        this.pagination.current=pagination.current;
        this.pagination.pageSize=pagination.pageSize;
        this.queryParam.page=pagination.current;
        this.queryParam.size=pagination.pageSize;
        console.log(this.pagination.current)
        console.log(this.pagination.pageSize);
        this.allTeacher();
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
      //获取所有教师信息
      async allTeacher(){
        //获取所有教师信息
        let {data:allTeacherData}=await this.$api.basic.teacher.fetchAllTeacherList({rowCount: this.queryParam.size,current:this.queryParam.page});
        // console.log(allTeacherData);
        this.dataSource=allTeacherData.rows;
        // console.log(this.dataSource)
        const pagination={...this.pagination};
        pagination.total=allTeacherData.total;
        this.pagination=pagination;
      },
      //级部监听
       async handleAdminChange(){
        for (let i=0;i<this.adminData.length;i++){
          if(i==this.form.adminId){
            // //获取年级
            this.gradeData=this.adminData[i].adminGrades,
            console.log(this.gradeData)
            // // //根据年级选择教师
            let {data}=await this.$api.basic.teacher.fetchTeacherList({rowCount: this.queryParam.size,current:this.queryParam.page,adminId: this.adminData[i].adminId});
            console.log(data.rows);
            const pagination={...this.pagination};
            pagination.total=data.total;
            this.pagination=pagination;
          }
        }
      },
      //年级监听
       async handleGradeChange(){
         this.gradeIds=this.form.gradeId;
         console.log(this.gradeIds);
        console.log(this.form.gradeId)
        for (let i=0;i<this.gradeData.length;i++){
          if(i==this.form.gradeId){
            console.log(this.adminData[this.form.adminId].adminId)
            //根据年级信息调用接口
            let {data}=await this.$api.basic.teacher.fetchTeacherList({rowCount: this.queryParam.size,current:this.queryParam.page,adminId:this.adminData[this.form.adminId].adminId,gradeId:this.gradeData[i].gradeId});
            console.log(data);
            this.dataSource=data.rows;
            const pagination={...this.pagination};
            pagination.total=data.total;
            this.pagination=pagination;
          }
        }
       },
       async onSearch(value) {
        console.log(value);
        console.log(this.form.teacherName);
        if(this.form.adminId==undefined||this.form.gradeId==undefined){
          // //只根据姓名查找教师信息
          let {data:allTeacherData}=await this.$api.basic.teacher.fetchAllTeacherList({rowCount: this.queryParam.size,current:this.queryParam.page,teacherName:this.form.teacherName});
          console.log(allTeacherData);
          this.dataSource=allTeacherData.rows;
          console.log(this.dataSource)
          const pagination={...this.pagination};
          pagination.total=allTeacherData.total;
          this.pagination=pagination;
        }else {
          let {data}=await this.$api.basic.teacher.fetchTeacherList({rowCount: this.queryParam.size,current:this.queryParam.page,adminId: this.adminData[this.form.adminId].adminId,gradeId: this.gradeData[this.form.gradeId].gradeId,teacherName: this.form.teacherName})
          console.log(data)
          this.dataSource=data.rows;
          const pagination={...this.pagination};
          pagination.total=data.total;;
          this.pagination=pagination;
        }
      },
      //获取课程信息
      async edit(editId){
        console.log(editId);
        console.log(this.dataSource[editId]);
        this.treeData=[];
        this.checkedKeys=[];
        this.getCourseInfo();
        this.editVisit=true;
        this.editText=editId,
        console.log(this.dataSource);
        this.form.teaName=this.dataSource[editId].teacherName;
        this.form.tel=this.dataSource[editId].tel;
        this.dataSource[editId].teacherRoleDtos.length===0?this.form.type='否':this.form.type='是';
        let pushData=[]
        console.log(this.gradeIds)
        let list=[...this.dataSource[editId].subjectTeacherDtos];
        list.forEach(item=>{
          console.log(item);
          pushData.push(item.subName);
          this.gradeIds=item.gradeId;
          console.log(this.gradeIds);
          // console.log(pushData);
        })
        this.value=pushData.toString();
        console.log(this.value);
      },
      //选择课程信息
      selectCourse(allInfo){
        console.log(this.checkedKeys);
        let courseInfo=[];
        console.log(this.treeData);
        for(let i=0;i<allInfo.length;i++) {
          console.log(allInfo[i]);
          for (let j = 0; j < this.treeData.length; j++) {
            if (this.treeData[j].children) {
              let teachData = this.treeData[j].children;
              // console.log('teacherData',teachData);
              for (let k = 0; k < teachData.length; k++) {
                if (teachData[k].children) {
                  let couData = teachData[k].children;
                  for (let w in couData) {
                    if (couData[w].key === allInfo[i]) {
                      courseInfo.push(couData[w].key)
                    }
                  }
                }
              }
            }
          }
        }
        console.log(courseInfo);
        let gradeId=[];
        console.log(courseInfo);
        courseInfo.forEach(item=>{
          gradeId.push((item || " ").split(',')[0])
          this.courseInfo.push((item || " ").split(',')[1])
        }),
                this.gradeIds=gradeId;
        console.log(gradeId);
        console.log(this.gradeIds);
        console.log(this.courseInfo);
      },
      //获取所属课程信息
      async getCourseInfo(editId){
        //获取级部、年级、课程树
        let {data:{result,success}}=await this.$api.basic.rule.fetcheAdminGradeCourseList()
        console.log(result);
        for(let i in result){
          //第一层(级部）
          let adminTree={};
          adminTree.title=adminTree.value=result[i].adminName;
          adminTree.key=result[i].adminId;
          // console.log(result[i].adminGrades)
          if(result[i].adminGrades.length){
            //第二层(年级）
            adminTree.children=[];
            for(let j=0;j<result[i].adminGrades.length;j++){
              let gradeItem=result[i].adminGrades[j];
              let childData={}
              childData.key=childData.value=gradeItem.gradeId;
              childData.title=gradeItem.gradeName;
              // console.log(gradeItem.subjectEntities);
              if(gradeItem.subjectEntities.length){
                //第三层(主课程)
                childData.children=[];
                for(let k in gradeItem.subjectEntities){
                  let mainCourse={};
                  mainCourse.key=mainCourse.value=gradeItem.gradeId+','+gradeItem.subjectEntities[k].subChildId;
                  mainCourse.title=gradeItem.subjectEntities[k].name;
                  childData.children.push(mainCourse)
                }
              }
              adminTree.children.push(childData);
            }
          }
          this.treeData.push(adminTree);
          // console.log(data.result[i]);
        }
      },
      //规则设置
      settingRule(id){
        this.$router.push("/basic/teacher/rule?id=" + id);
      },
      //编辑信息的保存
      async handleOk(){
        console.log(this.gradeIds);
        this.editVisit=false;
        let addData={};
        console.log(this.courseInfo);
        for(let i in this.gradeIds){
          // console.log(this.dataSource[this.editText].teacherId)
          // console.log(this.gradeIds[i])
          // console.log(this.courseInfo)
           addData={
            teacherId:this.dataSource[this.editText].teacherId,
            gradeSubjectDtoList:[{
              gradeId:this.gradeIds[i].toString(),
              subIds:this.courseInfo,
            }]
          }
        }
        console.log(addData);
        let {data}=await this.$api.basic.teacher.saveTeacherInfo(addData);
        console.log(data);
        if(data&&data.success){
          alert("编辑老师成功");
          this.handleGradeChange();
        }
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
