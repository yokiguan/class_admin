<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="gotoNew" type="primary">新建</a-button>
        <a-button>批量操作</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
            <a-menu-item key="audit">审批</a-menu-item>
          </a-menu>
          <a-button>
            更多操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <standard-table
        :rowKey="'name'"
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
        subPath='/basic/template/detail'
        @change="onchange"
      />
    </div>
  </a-card>
</template>

<script>
import StandardTable from "../../../components/table/StandardTable";
const columns = [
  {
    title: "模板编号",
    dataIndex: "no",
  },
  {
    title: "模板名称",
    dataIndex: "name",
  },
  {
    title: "一周工作日",
    dataIndex: "workDay",
    customRender: (text) => text + " 天",
  },
  {
    title: "休息天数",
    dataIndex: "restDay",
    customRender: (text) => text + " 天",
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];

const dataSource = [
  {
    key: 1,
    no: 1,
    name: "高一组课表模板",
    workDay: 5,
    restDay: 2,
  },
  {
    key: 2,
    no: 2,
    name: "高二组课表模板",
    workDay: 6,
    restDay: 1,
  },
  {
    key: 3,
    no: 3,
    name: "高三组课表模板",
    workDay: 6.5,
    restDay: 0.5,
  },
];

export default {
  name: "templet",
  components: { StandardTable },
  data() {
    return {
      columns: columns,
      dataSource: dataSource,
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  methods: {
    onchange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    remove() {
      this.dataSource = this.dataSource.filter(
        (item) => this.selectedRowKeys.indexOf(item.key) < 0
      );
      this.selectedRows = this.selectedRows.filter(
        (item) => this.selectedRowKeys.indexOf(item.key) < 0
      );
    },
    gotoNew() {
      this.$router.push('/basic/template/detail')
    },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
