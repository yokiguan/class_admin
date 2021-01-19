<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
        <a-button @click="backMainCourse" type="success" style="margin-left: 20px">返回</a-button>
      </div>
      <a-table
              :rowKey="'subChildId'"
              :columns="columns"
              :dataSource="dataSource"
              :selectedRows="selectedRows"
              @change="onchange"
      >
        <span slot="operation" slot-scope="text, record">
          <a @click="edit(record.subChildId)">编辑</a>|
          <a  @click="deleteItem(record.subChildId)">删除</a>
    </span>
      </a-table>
    </div>
    <a-modal
            :title="changeTitle"
            :visible='addClassVisit'
            width="600px"
            :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form-model :model="form"
              :rules="rules" :label-col="{span:5}" :wrapper-col="{span:12}"
              style="margin-left: 70px">
        <a-form-model-item label="子科目名称：" prop="name" ref="name">
          <a-input placeholder="请输入" v-model="form.name"
                   style="width: 275px"></a-input>
        </a-form-model-item>
        <a-form-model-item label="所属年级：" prop="gradeIds" ref="gradeIds">
          <a-tree-select v-model="form.gradeIds"
                         placeholder="请选择年级"
                         style="width: 275px"
                        :tree-data="treeData"
                         :checkedKeys="checkedKeys"
                         tree-checkable
                         :show-checked-strategy="SHOW_PARENT">
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="所属类别：" prop="type" ref="type">
          <a-select v-model="form.type"
                    placeholder="请选择" style="width: 275px">
            <a-select-option value="1">行政班课</a-select-option>
            <a-select-option value="0">走班课</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>
<script>
  import { TreeSelect } from 'ant-design-vue';
  const SHOW_PARENT = TreeSelect.SHOW_PARENT;
  const columns = [
    {
      title: '子课程编号',
      dataIndex: 'subChildId'
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '年级',
      dataIndex: 'childSubjectGrade',
      customRender:(text,index,i)=>{
        let grade="";
        for(var j=0;j<text.length;j++){
          if(grade==""){
            grade=text[j].gradeName
          }else{
            grade=grade+"+"+text[j].gradeName;
          }
        }
      return  grade
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      customRender:(text)=>text==1?'行政班课':'走班课'
    },{
      title:"操作",
      key:"operation",
      scopedSlots:{customRender:"operation"}
    }
  ]
export default {
  name: 'subsubject',
  data () {
    return {
      columns: columns,
      treeData:[],
      SHOW_PARENT,
      checkedKeys:[],
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      addClassVisit:false,
      loading:false,
      changeTitle:'新增子课程',
      editText:-1,
      form:{
        name:"",
        gradeIds:[],
        type:''
      },
      rules:{
        name:[
          {
            required:true,
            message:"请输入课程名称！",
            trigger:"blur"
          }
        ],
        gradeIds:[
          {
            required:true,
            message:"请输入年级！",
            trigger:"blur"
          }
        ],
       type:[
          {
            required:true,
            message:"请输入课程类型！",
            trigger:"change"
          }
        ],
      }
    }
  },
    async created() {
    //获取子课程全部信息
        let queryString=(window.location.hash || " ").split('?')[1]
        let id=(queryString || " ").split('=')[1]
        if(id){
        let { data:{result,success} } = await this.$api.basic.subject.fetchChildList({id});
        console.log(result.subjectChildEntitys)
        this.dataSource=result.subjectChildEntitys;
      }
    },
  methods: {
      onchange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      //获取年级信息
      async grade(){
        let {data:{result,success}}=await this.$api.basic.grade.fetchList();
        console.log(result);
        for(let i in result){
          //第一层（级部）
          let adminData={};
          adminData.title=result[i].adminName;
          adminData.key=adminData.value=result[i].adminId;
          if(result[i].adminGrades.length){
            //第二层（年级）
            adminData.children=[];
            for(let j=0;j<result[i].adminGrades.length;j++){
              let item=result[i].adminGrades[j];
              let gradeData={};
              gradeData.key=gradeData.value=item.gradeId;
              gradeData.title=item.gradeName;
              adminData.children.push(gradeData);
            }
          }
          this.treeData.push(adminData);
        }
      },
      addNew () {
        this.addClassVisit=true;
        this.changeTitle='新增子课程';
        this.grade();
      },
      edit(editId){
        let selectData = this.dataSource.filter(item => item.id === editId)
        selectData[0].subChildIds.forEach((item)=>{
          this.checkedKeys.push(item.subChildId)
        })
        this.changeTitle='编辑子课程';
        this.addClassVisit=true;
        this.editText=this.dataSource.findIndex(item=>item.subChildId==editId);
        this.form.name=this.dataSource[this.editText].name;
        this.form.gradeIds=this.dataSource[this.editText].childSubjectGrade.gradeName
        // console.log(this.dataSource[this.editText].childSubjectGrade.gradeName)
        this.form.type=this.dataSource[this.editText].type==1?'行政班课':'走班课'
        this.grade();
      },
      async handleOk() {
        if(this.changeTitle=='新增子课程'){
          let formData={
            name: this.form.name,
            gradeIds: this.form.gradeIds,
            type: Number(this.form.type),
            subFatherId: this.$router.history.current.query.id
          };
          let addData={...formData};
          let {data} = await this.$api.basic.subject.saveChildrenSubject(addData);
          console.log(data);
          this.addClassVisit = false;
          let queryString=(window.location.hash || " ").split('?')[1]
          let id=(queryString || " ").split('=')[1]
          if(id){
            let { data:{result,success} } = await this.$api.basic.subject.fetchChildList({id});
            this.dataSource=result.subjectChildEntitys;
          }
        }else{
          let formData={
            subChildId:this.dataSource[this.editText].subChildId,
            name: this.form.name,
            gradeIds: this.form.gradeIds,
            type: this.form.type?1:0,
            subFatherId: this.$router.history.current.query.id
          };
          let addData={...formData};
          let {data} = await this.$api.basic.subject.saveChildrenSubject(addData);
          this.addClassVisit = false;
          let { data:{result,success} } = await this.$api.basic.subject.fetchChildList();
          this.dataSource=result.subjectChildEntitys;
          // this.$refs.ruleForm.resetFields();
        }
      },
      handleCancel() {
        this.addClassVisit = false
      },
    //删除子课程
      async deleteItem(id) {
        let {data}=await this.$api.basic.subject.deleteSubject({ids:[id]});
        console.log(data)
        if(data&&data.success){
          let { data:{result,success} } = await this.$api.basic.subject.fetchChildList();
          // console.log(result.subjectChildEntitys)
          this.dataSource=result.subjectChildEntitys;
          message.info('删除成功');
        }else{
          message.info('删除失败');
        }
    },
    //返回主课程
      backMainCourse(){
        this.$router.go(-1)
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
