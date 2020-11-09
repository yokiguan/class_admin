<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">排课详情</a></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="operation-list">
      <a-row :gutter="[16,16]">
        <a-col v-for="item in operationList" :key="item.text" :span="6" @click="goDetail">
          <router-link :to="'/schedule'+item.path">
            <div class="operation">
              <div class="operation-icon">
                <a-icon :type="item.icon" style="font-size:40px;line-height:80px;color:white"/>
              </div>
              <h1 style="margin-top:10px">{{item.text}}</h1>
            </div>
          </router-link>
        </a-col>
      </a-row>
    </div>

  </div>
</template>

<script>
const operationList = [
  {
    icon: "edit",
    text: "修改",
    path: "/board/index",
  },
  {
    icon: "setting",
    text: "选课设置",
    path: "/detail/setting",
  },
  {
    icon: "cloud-upload",
    text: "发布选课",
    path: "",
  },
  {
    icon: "pie-chart",
    text: "选课统计",
    path: "/detail/statistics",
  },
  {
    icon: "snippets",
    text: "选课分班",
    path: "/detail/sort_class/admin",
  },
  {
    icon: "schedule",
    text: "选课排课",
    path: "/detail/sort_course/index",
  },
  {
    icon: "schedule",
    text: "行政班排课",
    path: "/detail/class_admin/index",
  },
  {
    icon: "calendar",
    text: "走班排课任务",
    path: "/detail/task_mobile/index",
  },
  {
    icon: "cloud-upload",
    text: "课表",
    path: "/detail/curriculum/index",
  },
  {
    icon: "calendar",
    text: "行政班排课任务",
    path: "/detail/task_admin/index",
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
