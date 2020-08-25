<template>
  <div class="simple-schedule">
    <a-table
      :bordered="bordered"
      :columns="columns"
      :dataSource="dataSource"
      :rowKey="rowKey"
      :pagination="false"
    ></a-table>
  </div>
</template>

<script>
export default {
  name: "SimpleSchedule",
  props: ["bordered", "columns", "dataSource", "rowKey"],
  data() {
    return {
      needTotalList: [],
    };
  },
  methods: {
    initTotalList(columns) {
      const totalList = [];
      columns.forEach((column) => {
        if (column.needTotal) {
          totalList.push({ ...column, total: 0 });
        }
      });
      return totalList;
    },
  },
  created() {
    this.needTotalList = this.initTotalList(this.columns);
  },
};
</script>

<style scoped>
.alert {
  margin-bottom: 16px;
}
.simple-schedule {
  padding: 20px 0;
}
</style>
