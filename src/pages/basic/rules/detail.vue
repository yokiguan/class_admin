<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>选课规则</a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="#">规则设计</router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="detailRule" style="background-color: white">
      <a-table :rowKey="'id'"
               :columns="columns"
               :dataSource="dataSource">
        <div slot="operation" slot-scope="text, record,index">
          <span @click="edit(index)">编辑</span>
        </div>
      </a-table>
    </div>
    <a-modal :visible='editVisit'
             width="400px"
            :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <template>
        <!--        v-model="checkedKeys"-->
        <a-tree  v-model="chooseCourse"
                 checkable
                :checkedKeys="checkedKeys"
                :tree-data="treeData"/>
      </template>
    </a-modal>
  </div>
</template>
<script>
  import {message} from "ant-design-vue"
  const columns=[
    {
      title:'序号',
      dataIndex:'id',
      align:'center',
      customRender: function(t, r, index) {
        return parseInt(index) + 1
      }
    },
    {
      title:'课程类型',
      dataIndex:'name',
      align:'center',
    },{
      title: '课程',
      dataIndex: 'subChildIds',
      align:'center',
      customRender: (text,index,i)=>{
        let course="";
        for (var j=0;j<text.length;j++){
          if(course==""){
            course=text[j].subChildName;
          }else{
            course=course+"+"+text[j].subChildName;
          }
        }
        return course
      }
    },{
      title:'操作',
      dataIndex:'option',
      align:'center',
      scopedSlots:{customRender:'operation'}
    }
  ]
  export default {
    data() {
      return {
        dataSource:[],
        columns,
        loading:false,
        editVisit:false,
        checkedKeys: [],
        treeData:[],
        editText:-1,
        chooseCourse:[],
      };
    },
    //查看规则详细信息
    async created(){
      this.courseInfo();
      let {data}=await this.$api.basic.rule.fetchRuleList();
      // console.log(data);
      if(data&&data.success){
        this.dataSource=data.result;
      }
     else{
       message.info("课程信息获取失败");
      }
    },
    methods:{
      //编辑按钮的实现
      async edit(editId){
        this.treeData = []
        this.checkedKeys = []
        this.editVisit=true;
        this.chooseCourse=[];
        let selectData = this.dataSource[editId].subChildIds;
        console.log("selectData",selectData);
        for(let i=0;i<selectData.length;i++){
          this.chooseCourse.push(selectData[i].subChildId);
        }
        this.editText=editId;
        this.courseInfo();
      },
    //获取课程信息
    async courseInfo() {
      //获取课程信息
      let {data}=await this.$api.basic.subject.fetchSubjectList({subType:0})
      console.log(data.result);
      for(let i in data.result) {
        //第一层(级部）
        let mainCourseTree = {};
        mainCourseTree.title = data.result[i].subName;
        mainCourseTree.key = data.result[i].id;
        if (data.result[i].subjectChildEntitys.length) {
          //第二层(年级）
          mainCourseTree.children = [];
          for (let j = 0; j < data.result[i].subjectChildEntitys.length; j++) {
            let gradeItem = data.result[i].subjectChildEntitys[j];
            let childData = {}
            childData.key = gradeItem.subChildId;
            childData.title = gradeItem.name;
            mainCourseTree.children.push(childData);
          }
        }
        this.treeData.push(mainCourseTree);
      }
      console.log(this.treeData);
    },
      //保存编辑信息
      async handleOk(){
        console.log(this.chooseCourse);
        let course=[];
        //获取父课程名
        for(let i=0;i<this.treeData.length;i++){
            for(let k in this.chooseCourse){
              // console.log(this.treeData[i].key);
              // console.log(this.chooseCourse[k]);
                  if(this.treeData[i].key==this.chooseCourse[k]){
                    course.push(this.chooseCourse[k]);
                    // console.log(this.chooseCourse[k]);
                  }
            }
        }
        console.log(course);
        //剔除父课程id
        let resultCourse=[];
        for(let i in this.chooseCourse){
          for(let j in course){
            if(this.chooseCourse[i]==course[j]){
              for(let temp=j;temp<this.chooseCourse.length;temp++){
                this.chooseCourse[temp]=this.chooseCourse[temp+1];
              }
              j--;
              this.chooseCourse.length--;
            }
          }
        }
        console.log(this.chooseCourse);
        for(let i in this.chooseCourse){
          if(this.chooseCourse[i]!=undefined){
            resultCourse.push(this.chooseCourse[i]);
          }
        }
        console.log(resultCourse);
        this.editVisit=false;
        // let {data}=await this.$api.basic.rule.saveRuleItem({
        //   id:this.dataSource[this.editText].id,subChildId:resultCourse.join(',')});
        // console.log(this.data);
        // if(data.success){
        //   let {data}=await this.$api.basic.rule.fetchRuleList();
        //   this.dataSource=data.result;
        // }
      },
      //关闭编辑弹框
      handleCancel(){
        this.editVisit=false;
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

</style>
