<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>基础设置</a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="#">年级</router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-card>
    <div>
      <a-table
        :rowKey="'gradeId'"
        :columns="columns"
        :subName="'查看课程'"
        :dataSource="dataSource">
        <span slot="operation" slot-scope="text, record">
          <a @click="gotoNew(record.gradeId)">查看课程</a>
        </span>
      </a-table>
    </div>
  </a-card>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    dataIndex: "gradeId",
    customRender: function(t, r, index) {
      return parseInt(index) + 1
    }
  },
  {
    title: "年级",
    dataIndex: "gradeName"
  },
  {
    title: "级部",
    dataIndex: "adminName"
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  name: "grade",
  data() {
    return {
      subject:[],
      columns: columns,
      dataSource: [],
    };
  },
  async created() {
    let {data:{result,success}} = await this.$api.basic.grade.fetchGradeList();
    console.log(result);
    if (success) {
      this.dataSource = result;
    }
  },
  methods: {
    gotoNew(id) {
      this.$router.push("/basic/grade/subject?id=" + id);
    },
    async deleteItem(id) {
      let { data } = this.$api.basic.grade.deleteGrade({ gradeIds:[id] });
      console.log(data);
      if(data&&data.success){
        let {data:gradeData}=await this.$api.basic.grade.fetchGradeList();
        console.log("gradeData",gradeData)
        this.dataSource=gradeData.rows
      }
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
@media screen and (max-width: 900px) {

}
</style>
