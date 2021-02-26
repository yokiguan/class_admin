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
        <div slot="operation" slot-scope="text,record">
          <span @click="edit(record.teacherId)">编辑</span>|
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
          <a-input style="width: 300px" disabled="disabled" v-model="form.teacherName1"/>
        </a-form-model-item>
        <a-form-model-item label="联系电话">
          <a-input style="width: 300px" disabled="disabled" v-model="form.tel"/>
        </a-form-model-item>
        <a-form-model-item label="是否是班主任" style="margin-left: 30px">
          <a-input v-model="form.type" disabled="disabled" style="width: 270px"></a-input>
<!--          <a-radio-group v-model="form.type" disabled="disabled" style="margin-left: 40px">-->
<!--            <a-radio value="0">是</a-radio>-->
<!--            <a-radio value="1">否</a-radio>-->
<!--          </a-radio-group>-->
        </a-form-model-item>
        <a-form-item label="所授课程">
          <a-tree-select v-model="form.addSub"
                         placeholder="请选择所授课程"
                         style="width: 275px"
                         :checkedKeys="checkedKeys"
                         :tree-data="treeData"
                         tree-checkable
                         :show-checked-strategy="SHOW_PARENT">
          </a-tree-select>
        </a-form-item>
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
        treeData:[],
        SHOW_PARENT,
        checkedKeys:[],
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
        console.log( this.pagination.pageSize);
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
        console.log(allTeacherData);
        this.dataSource=allTeacherData.rows;
        console.log(this.dataSource)
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
            // let newObj = []
          //   for(let i in data.rows){
          //     if(data.rows[i]) {
          //       newObj.push((data.rows[i]))
          //     }
          //   }
          //   console.log(newObj)
          //   this.dataSource=newObj;
            const pagination={...this.pagination};
            pagination.total=data.total;
            this.pagination=pagination;
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
        this.getCourseInfo();
        this.form.addSub=[];
        this.checkedKeys=[];
        console.log('selectData',this.treeData,this.dataSource);
        let selectData = this.dataSource.filter(item => item.teacherId=== editId)
        console.log(selectData);
        selectData[0].subjectTeacherDtos.forEach((item)=>{
          this.form.addSub.push(item.subName);
        })
        // selectData[0].
        this.editVisit=true;
        this.editText=this.dataSource.findIndex(item=>item.teacherId==editId);
          console.log(this.editText);
          this.form.teacherName1=this.dataSource[this.editText].teacherName;
          this.form.tel=this.dataSource[this.editText].tel;
          console.log(this.dataSource[this.editText].teacherRoleDtos);
          if(this.dataSource[this.editText].teacherRoleDtos.length==0){
            this.form.type='否';
          }
          else{
            this.form.type='是'
          }
      },
      //获取所属课程信息
      async getCourseInfo(editId){
        //获取级部、年级、课程树
        let {data:{result,success}}=await this.$api.basic.rule.fetcheAdminGradeCourseList()
        console.log(result);
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
              childData.key=gradeItem.gradeId;
              childData.title=childData.value=gradeItem.gradeName;
              // console.log(gradeItem.subjectEntities);
              if(gradeItem.subjectEntities.length){
                //第三层(主课程)
                childData.children=[];
                for(let k in gradeItem.subjectEntities){
                  let mainCourse={};
                  mainCourse.key=result[i].adminId+gradeItem.gradeId+gradeItem.subjectEntities[k].subChildId;
                  mainCourse.title=mainCourse.value=gradeItem.subjectEntities[k].name;
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
        this.editVisit=false;
        let addData={
          teacherId:this.dataSource[this.editText].teacherId,
          gradeSubjectDtoList:[{
            // gradeId:
            // subIds:[this.form.addSub],
          }]
        }
        let {data:saveData}=await this.$api.basic.teacher.saveTeacherInfo();
        console.log(data);
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
