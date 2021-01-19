<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>< a href="">选课规则</ a></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="detailRule" style="background-color: white">
      <a-table :rowKey="'id'"
               :columns="columns"
               :dataSource="dataSource">
        <div slot="operation" slot-scope="text, record">
          <span @click="edit(record.id)">编辑</span>
        </div>
      </a-table>
    </div>
    <a-modal
            :visible='editVisit'
            width="400px"
            :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <template>
        <!--        v-model="checkedKeys"-->
        <a-tree
                v-model="checkedKeys"
                checkable
                :checkedKeys="checkedKeys"
                :tree-data="treeData"
                @check="onCheck"
        />
      </template>
    </a-modal>
  </div>
</template>
<script>
  const columns=[
    {
      title:'序号',
      dataIndex:'id',
    },
    {
      title:'课程类型',
      dataIndex:'name',
    },{
      title: '课程',
      dataIndex: 'subChildIds',
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
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        treeData:[],
        form:[],
        editText:-1,
        expandedKeys:[]
      };
    },
    //查看规则详细信息
    async created(){
      let {data}=await this.$api.basic.rule.fetchRuleList();
      console.log(data);
      this.dataSource=data.result;
      console.log(this.dataSource)
    },
    //监测课程分支数据的获取
    watch: {
      checkedKeys(val) {
        console.log('watchDataOfKeys', val);
      },
    },
    methods:{
      //编辑按钮的实现
      async edit(editId){
        this.treeData = []
        this.checkedKeys = []
        this.editVisit=true;
        let selectData = this.dataSource.filter(item => item.id === editId)
        selectData[0].subChildIds.forEach((item)=>{
          this.checkedKeys.push(item.subChildId)
        })
        let {data}=await this.$api.basic.rule.fetcheAdminGradeCourseList()
        console.log(data.result);
        for(let i in data.result){
          //第一层(级部）
          let adminTree={};
          adminTree.title=data.result[i].adminName;
          adminTree.key=data.result[i].adminId;
          if(data.result[i].adminGrades.length){
            //第二层(年级）
            adminTree.children=[];
            for(let j=0;j<data.result[i].adminGrades.length;j++){
              let gradeItem=data.result[i].adminGrades[j];
              let childData={}
              childData.key=gradeItem.gradeId;
              childData.title=gradeItem.gradeName;
              if(gradeItem.subjectEntities.length){
                //第三层(主课程)
                childData.children=[];
                for(let k in gradeItem.subjectEntities){
                  let mainCourse={};
                  mainCourse.key=gradeItem.subjectEntities[k].subChildId;
                  mainCourse.title=gradeItem.subjectEntities[k].name;
                  childData.children.push(mainCourse)
                }
              }
              adminTree.children.push(childData);
            }
          }
          this.treeData.push(adminTree);
          console.log(data.result[i]);
        }
        this.editText=this.dataSource.findIndex(item=>item.id==editId);
        console.log(this.editText);
        // this.checkedKeys=this.dataSource.subChildIds
      },
      onCheck(e) {
        console.log('onCheck', e);
        // this.checkedKeys = checkedKeys;
      },
      //保存编辑信息
      async handleOk(){
        this.editVisit=false;
        let {data}=await this.$api.basic.rule.saveRuleItem({ id:this.dataSource[this.editText].id,subChildId:this.checkedKeys.join(',')})
        if(data.success){
          let {data}=await this.$api.basic.rule.fetchRuleList();
          this.dataSource=data.result;
        }
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
