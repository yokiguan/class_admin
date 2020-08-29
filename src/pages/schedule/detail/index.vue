<template>
  <div class="operation-list">
    <a-row :gutter="[16,16]">
      <a-col v-for="item in operationList" :key="item.text" :span="6" @click="goDetail">
        <div class="operation">
          <div class="operation-icon">
        <a-icon :type="item.icon" style="font-size:40px;line-height:80px;color:white"/>
          </div><router-link :to="'/schedule/detail'+item.path">
          <h1 style="margin-top:10px">{{item.text}}</h1>
        </router-link>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const operationList = [
  {
    icon: "edit",
    text: "修改",
    path: "",
  },
  {
    icon: "setting",
    text: "选课设置",
    path: "/setting",
  },
  {
    icon: "cloud-upload",
    text: "发布选课",
    path: "",
  },
  {
    icon: "pie-chart",
    text: "选课统计",
    path: "/statistics",
  },
  {
    icon: "snippets",
    text: "选课分班",
    path: "/sort_class",
  },
  {
    icon: "schedule",
    text: "选课排课",
    path: "/sort_course",
  },
  {
    icon: "schedule",
    text: "行政班排课",
    path: "/class_admin",
  },
  {
    icon: "calendar",
    text: "走班排课任务",
    path: "/task_mobile",
  },
  {
    icon: "cloud-upload",
    text: "发布课表",
  },
  {
    icon: "calendar",
    text: "行政班排课任务",
    path: "/task_admin",
  },
];
export default {
  name: "OperationList",
  data() {
    return {
      operationList,
    };
  },
  methods: {
    goDetail() {},
  },
};
</script>
<style lang='less' scoped>
.operation{
  background-color: white;
  text-align: center;
  height: 80%;
  width:80%;
  padding: 30px;
  .operation-icon{
    margin:0 auto;
    height: 80px;
    width:80px;
    text-align: center;
    background-color: #13c2c2;
    border-radius: 50%;
  }
}
</style>
