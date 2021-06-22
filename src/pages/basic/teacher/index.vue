<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>基础设置</a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="#">教师</router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-card>
    <a-form-model layout="horizontal" :form="form" >
      <a-row >
        <a-col :span="7" style="margin-left: 100px">
          <a-form-model-item label="年级" :labelCol="{ span: 3}" :wrapperCol="{ span: 15, offset: 1 }">
            <a-select placeholder="请选择" v-model="form.gradeId" @change="handleGradeChange">
              <a-select-option v-for="(grade,index) in this.gradeData" :key="index">
                {{grade.gradeName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="7" style="margin-left: 50px">
          <a-form-model-item label="按姓名查找" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15, offset: 1 }">
           <a-input-search placeholder="请输入老师姓名"  v-model="form.teacherName" @search="onSearch"/>
          </a-form-model-item>
        </a-col>
        <a-col :span="7">
          <a-button @click="clear" style="float: right;margin-right: 150px" type="primary">重置</a-button>
        </a-col>
      </a-row>
    </a-form-model>
    <a-table :rowKey="'teacherId'"
              :columns="columns"
              :pagination="pagination"
              :dataSource="dataSource"
              @change="handleTableChange">
        <div slot="operation" slot-scope="text,record,index">
          <a @click="edit(record.teacherId)">编辑</a>|
          <a @click="settingRule(record.teacherId)">规则设置</a>
        </div>
      </a-table>
    <a-modal :visible='editVisit'
            width="600px"
            :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form-model :model="form" ref="ruleForm" :label-col="{span:5}" :wrapper-col="{span:12}" style="margin-left: 70px">
        <a-form-model-item label="老师姓名" ref="teaName" prop="teaName">
          <a-input style="width: 300px" disabled="disabled" v-model="form.teaName"/>
        </a-form-model-item>
        <a-form-model-item label="联系电话" ref="tel" prop="tel">
          <a-input style="width: 300px" disabled="disabled" v-model="form.tel"/>
        </a-form-model-item>
        <a-form-model-item label="是否是班主任" style="margin-left: 30px" ref="type" prop="type">
          <a-input v-model="form.type" disabled="disabled" style="width: 270px"/>
        </a-form-model-item>
        <a-form-model-item label="所授课程" ref="course" prop="course">
          <a-tree-select v-model="form.course"
                         placeholder="请选择所授课程"
                         style="width: 275px"
                         @change="selectCourse"
                         tree-checkable
                         :tree-data="treeData"
                         :checkedKeys="checkedKeys"
                         :show-checked-strategy="SHOW_PARENT">
          </a-tree-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
  </div>
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
        chooseCourse:[],
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
          course:[],
        },
      }
    },
    async created(){
      //获取年级信息接口
      let {data:{result,success}}=await this.$api.basic.grade.fetchList();
      // console.log(result);
      //获取级部
      this.adminData=result;
      console.log(this.adminData);
      this.gradeData=this.adminData[0].adminGrades
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
        if(this.form.gradeId!=undefined){
          this.handleGradeChange();
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
      //年级监听
       async handleGradeChange(){
         this.gradeIds=this.form.gradeId;
         console.log(this.gradeIds);
        console.log(this.form.gradeId)
        for (let i=0;i<this.gradeData.length;i++){
          if(i==this.form.gradeId){
            //根据年级信息调用接口
            let {data}=await this.$api.basic.teacher.fetchTeacherList({
              rowCount: this.queryParam.size,
              current:this.queryParam.page,
              gradeId:this.gradeData[i].gradeId});
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
        if(this.form.gradeId==undefined){
          // //只根据姓名查找教师信息
          let {data:allTeacherData}=await this.$api.basic.teacher.fetchAllTeacherList({
            rowCount: this.queryParam.size,
            current:this.queryParam.page,
            teacherName:this.form.teacherName});
          console.log(allTeacherData);
          this.dataSource=allTeacherData.rows;
          console.log(this.dataSource)
          const pagination={...this.pagination};
          pagination.total=allTeacherData.total;
          this.pagination=pagination;
        }else {
          let {data}=await this.$api.basic.teacher.fetchTeacherList({
            rowCount: this.queryParam.size,current:this.queryParam.page,
            gradeId: this.gradeData[this.form.gradeId].gradeId,teacherName: this.form.teacherName})
          console.log(data)
          this.dataSource=data.rows;
          const pagination={...this.pagination};
          pagination.total=data.total;;
          this.pagination=pagination;
        }
      },
      //重置
      clear(){
          this.form.gradeId="";
          this.form.teacherName="";
          this.allTeacher();
      },
      //获取所属课程信息
      async getCourseInfo(editId){
        //获取级部、年级、课程树
        let {data:{result,success}}=await this.$api.basic.rule.fetcheAdminGradeCourseList()
        // console.log(result);
        for(let i in result){
          //第一层(级部）
          let adminTree={};
          adminTree.title=result[i].adminName;
          adminTree.key=adminTree.value=result[i].adminId;
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
                  mainCourse.key=mainCourse.value=gradeItem.subjectEntities[k].subChildId;
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
      //获取课程信息
      async edit(editId){
        console.log(editId);
        // console.log(this.dataSource[editId]);
        this.treeData=[];
        this.checkedKeys=[];
        this.getCourseInfo();
        this.editVisit=true;
        this.editText=this.dataSource.findIndex(item=>item.teacherId==editId);
        // console.log(this.editText);
        this.form.teaName=this.dataSource[this.editText].teacherName;
        this.form.tel=this.dataSource[this.editText].tel;
        this.dataSource[this.editText].teacherRoleDtos.length===0?this.form.type='否':this.form.type='是';
        let selectData=this.dataSource[this.editText].subjectTeacherDtos;
        console.log("selectData",selectData);
        for(let i=0;i<selectData.length;i++){
          this.form.course.push(selectData[i].subId);
        }
        console.log(this.form.course);
      },
      //选择课程信息
      selectCourse(allInfo){
        let courseInfo=[];
        for(let i=0;i<this.treeData.length;i++){
          let gradeChild=this.treeData[i].children;
          for(let j=0;j<allInfo.length;j++){
            console.log(allInfo[j]);
            //连带级部一块选
            if(allInfo[j]==this.treeData[i].key){
              for(let k=0;k<gradeChild.length;k++){
                if(gradeChild[k].children){
                  for(let w=0;w<gradeChild[k].children.length;w++){
                    courseInfo.push(gradeChild[k].children[w].key);
                  }
                }
              }
            }else{
              for(let k=0;k<gradeChild.length;k++){
                //选择年级和课程
                if(allInfo[j]===gradeChild[k].key){
                  let children=gradeChild[k].children;
                  if(children){
                    for(let v=0;v<children.length;v++){
                      // console.log(children[v].key);
                      // console.log("=========================================")
                      courseInfo.push(children[v].key);
                    }
                  }
                }else{
                  // console.log(allInfo[j]);
                  // console.log("=========================================")
                  courseInfo.push(allInfo[j]);
                }
              }
            }
          }
        }
        // console.log(courseInfo);
        //去除重复
        for(let i=0;i<courseInfo.length;i++){
          for(let j=i+1;j<courseInfo.length;j++){
            if(courseInfo[i]===courseInfo[j]){
              for(let temp=j;temp<courseInfo.length;temp++){
                courseInfo[temp]=courseInfo[temp+1];
              }
               j--;
               courseInfo.length=courseInfo.length-1;
            }
          }
        }
        // console.log(courseInfo);
        //判断年级
        for(let i=0;i<this.treeData.length;i++){
          if(this.treeData[i].children){
            let children=this.treeData[i].children;
            for(let j=0;j<children.length;j++){
              for(let k=0;k<courseInfo.length;k++){
                if(children[j].key==courseInfo[k]){
                  courseInfo[k]=courseInfo[k+1];
                  courseInfo.length--;
                }
              }
            }
          }
          this.chooseCourse=courseInfo;
          console.log(courseInfo);
          console.log(this.chooseCourse);
        }
      },
      //规则设置
      settingRule(id){
        this.$router.push("/basic/teacher/rule?id=" + id);
      },
      //编辑信息的保存
      async handleOk(){
        let pushData=[];
        console.log(this.form.course);
        console.log(this.editText);
        console.log(this.dataSource[this.editText]);
        let allData=this.dataSource[this.editText].subjectTeacherDtos;
        console.log(allData);
        for(let i=0;i<allData.length;i++){
          pushData.push(allData[i].gradeId)
        }
        console.log(pushData);
        //去除重复
        for(let i=0;i<pushData.length;i++){
          for(let j=i+1;j<pushData.length;j++){
            if(pushData[i]===pushData[j]){
              for(let temp=j;temp<pushData.length;temp++){
                pushData[temp]=pushData[temp+1];
              }
              j--;
              pushData.length=pushData.length-1;
            }
          }
        }
        console.log(pushData);
        let selectData=[];
        if(pushData.length==0){
          selectData=this.form.toString();
        }else{
          selectData=pushData;
        }
        console.log(selectData);
        this.editVisit=false;
        let addData={};
        for(let i in selectData){
          console.log(this.dataSource[this.editText].teacherId)
          console.log(selectData[i])
          console.log(this.chooseCourse);
           addData={
            teacherId:this.dataSource[this.editText].teacherId,
            gradeSubjectDtoList:[{
              gradeId:selectData[i].toString(),
              subIds:this.chooseCourse,
            }]
          }
        }
        console.log(addData);
        let {data}=await this.$api.basic.teacher.saveTeacherInfo(addData);
        console.log(data);
        if(data&&data.success){
          message.success("修改老师成功");
          this.form.course=[];
          if(this.form.gradeId!=undefined){
              if(this.form.teacherName!=undefined){
                this.onSearch();
              }else{
                this.handleGradeChange();
              }
          }else{
            this.allTeacher();
          }
        }else{
          message.success("授课班级为空！");
        }
      },
      //编辑信息的取消
      handleCancel(){
        this.editVisit=false;
        this.form.course=[];
      },
    }
  }
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
