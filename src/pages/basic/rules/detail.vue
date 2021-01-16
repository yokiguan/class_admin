<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">选课规则</a></a-breadcrumb-item>
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
        this.editVisit=true;
        let {data}=await this.$api.basic.subject.fetchSubjectList();
        console.log(data.result);
        for(let i in data.result){
          //第一层(主课程）
          let mainCourse={}
          mainCourse.title=data.result[i].subName;
          // mainCourse.key=data.result[i].id;
          if(data.result[i].subjectChildEntitys.length){
            //第二层（子课程）
            mainCourse.children=[]
            for(let j=0;j<data.result[i].subjectChildEntitys.length;j++){
              let item=data.result[i].subjectChildEntitys[j]
              let childData={}
              childData.key=item.subChildId;
              childData.title=item.name;
              mainCourse.children.push(childData);
            }          }
          this.treeData.push(mainCourse);
          console.log(this.treeData);
        }
        // console.log(this.treeData);
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
