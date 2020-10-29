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
          <a-button> 更多操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </div>
      <a-table
        rowKey="roomId"
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
        @change="onchange"
      >
        <span slot="operation" slot-scope="text, record">
          <a @click='addNew(record.id)'>编辑</a>
          |
          <a @click="deleteItem(record.roomId)">删除</a>
          |<a @click='gotoNew(record.roomId)'>规则设置</a>
        </span>
      </a-table>
    </div>
  </a-card>
</template>

<script>
const columns = [
  {
    title: "教室编号",
    dataIndex: "roomId"
  },
  {
    title: "教室名称",
    dataIndex: "name"
  },
  {
    title: "楼层",
    dataIndex: "floor"
  },
  {
    title: "类型",
    dataIndex: "type"
  },
  {
    title: "容纳人数",
    dataIndex: "capacity"
  },
  {
    title: "所属教学楼",
    dataIndex: "buildingEntity",
    customRender: (text, record) => record.buildingEntity.name
  },
  {
    title: "状态",
    dataIndex: "status",
    customRender: text => (text == 1 ? "可用" : "已占用")
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" }
  }
];

export default {
  name: "classroom",
  data() {
    return {
      columns: columns,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  async created() {
    let { data } = await this.$api.basic.classroom.fetchList();
    this.dataSource = data.rows;
    console.log(data);
  },
  methods: {
    onchange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    remove() {
      this.dataSource = this.dataSource.filter(
        item => this.selectedRowKeys.indexOf(item.key) < 0
      );
      this.selectedRows = this.selectedRows.filter(
        item => this.selectedRowKeys.indexOf(item.key) < 0
      );
    },
    addNew(id) {
      this.dataSource.unshift({
        key: 3,
        no: 3,
        name: "高一（1）",
        floor: 2,
        type: "行政班级",
        building: "逸夫楼101",
        capacity: 200,
        status: 2
      });
      console.log(id);
    },
    gotoNew(id){
      this.$router.push('/basic/classroom/rule?id='+id)
    },
    deleteItem(id) {
      let{data}=this.$api.basic.classroom.deleteBuilding({id})
      if(data.success)
      this.dataSource = this.dataSource.filter(i => i.roomId == id);
    },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    }
  }
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
