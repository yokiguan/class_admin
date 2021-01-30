<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>选课规则</a-breadcrumb-item>
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
        form:[],
        editText:-1,
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
        //获取课程信息
        let {data}=await this.$api.basic.subject.fetchSubjectList()
        console.log(data.result);
        for(let i in data.result){
          //第一层(级部）
          let mainCourseTree={};
          mainCourseTree.title=data.result[i].subName;
          mainCourseTree.key=data.result[i].id;
          if(data.result[i].subjectChildEntitys.length){
            //第二层(年级）
            mainCourseTree.children=[];
            for(let j=0;j<data.result[i].subjectChildEntitys.length;j++){
              let gradeItem=data.result[i].subjectChildEntitys[j];
              let childData={}
              childData.key=gradeItem.subChildId;
              childData.title=gradeItem.name;
              mainCourseTree.children.push(childData);
            }
          }
          this.treeData.push(mainCourseTree);
          console.log(data.result[i]);
        }
        this.editText=this.dataSource.findIndex(item=>item.id==editId);
        console.log(this.editText);
      },
      onCheck(e) {
        console.log('onCheck', e);
      },
      //保存编辑信息
      async handleOk(){
        console.log(this.checkedKeys);
        let subChildIds = []
        this.checkedKeys.forEach((item,index) =>{
          let parentNode = this.treeData.filter(child => child.key === item)
          console.log(parentNode);
          if(parentNode.length > 0 && Object.prototype.hasOwnProperty.call(parentNode[0],'children')){
            parentNode[0].children.forEach(chr=>{
              console.log(chr.key);
              subChildIds.push(chr.key)
            });
          }else{
            console.log(item);
            subChildIds.push(item)
          }
        })
        this.checkedKeys= subChildIds
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
