<template>
  <div class="standard-table">
    <a-table
      :bordered="bordered"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :rowKey="rowKey"
      :pagination="pagination"
    >
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'SimpleTable',
  props: ['bordered', 'loading', 'columns', 'dataSource', 'rowKey', 'pagination',],
  data () {
    return {
      needTotalList: [],
    }
  },
  methods: {
    initTotalList (columns) {
      const totalList = []
      console.log(columns);
      columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({...column, total: 0})
        }
      })
      return totalList
    }
  },
  created () {
    this.needTotalList = this.initTotalList(this.columns)
  },
}
</script>

<style scoped>
  .alert{
    margin-bottom: 16px;
  }
</style>
