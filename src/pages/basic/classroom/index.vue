<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="showModal" type="primary">新建</a-button>
      </div>
      <a-table
              rowKey="roomId"
              :columns="columns"
              :dataSource="dataSource"
              :selectedRows="selectedRows"
              @change="onchange">
        <span slot="operation" slot-scope="text, record">
          <a @click="addNew(record.id)">编辑</a>
          <a @click="deleteItem(record.roomId)">删除</a>
          <a @click="gotoNew(record.roomId)">规则设置</a>
        </span>
      </a-table>
    </div>
    <a-modal
            title="新增教室"
            :visible="show"
            @ok="handleOk"
            @cancel="handleCancel"
    >
      <a-form :form="form" v-bind="formItemLayout">
        <a-form-item label="教学楼">
          <a-select
                  v-decorator="['buildingId',
              { rules: [{ required: true, message: '请选择场地所在教学楼' }] }]"
                  placeholder="请选择场地所在教学楼"
                  @change="changeBuilding">
            <a-select-option
                    v-for="b in this.buildings"
                    :key="b.buildingId"
                    :value="b.buildingId">
              {{ b.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="楼层">
          <a-select
                  v-decorator="['floor',
              { rules: [{ required: true, message: '请选择场地所在楼层' }] }]"
                  placeholder="请选择场地所在楼层"
          >
            <a-select-option v-for="f of this.floor" :key="f" :value="f">
              {{ f }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="场地名称">
          <a-input
                  v-decorator="[
              'name',
              { rules: [{ required: true, message: '请输入场地名称' }] }]"
                  placeholder="请输入你想要新增的场地名称"></a-input>
        </a-form-item>
        <a-form-item label="容纳人数">
          <a-input
                  v-decorator="['capacity',
              { rules: [{ required: true, message: '请输入场地容量' }] }]"
                  placeholder="请输入你想要新增的场地容量"
          ></a-input>
        </a-form-item>
        <a-form-item label="场地类型">
          <a-radio-group
                  v-decorator="[
              'type',
              { rules: [{ required: true, message: '请选择场地类型' }] }
            ]"
                  :options="placeOptions"/>
        </a-form-item>
        <a-form-item label="是否启用">
          <a-switch v-decorator="['status', { rules: [{ required: true }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
  const columns=[
    {
      title:'序号',
      dataIndex:'serialNum',
      key:'serialNum',
      align:'center',
      width:'7%'
    },
    {
      title:'教室名称',
      dataIndex:'className',
      key:'className',
      align:'center',
      width:'12%'
    },
    {
      title:'楼层',
      dataIndex:'floor',
      key:'floor',
      align:'center',
      width:'12%'
    },
    {
      title:'类型',
      dataIndex:'kinds',
      key:'kinds',
      align:'center',
      width:'14%'
    },
    {
      title:'所属教学楼',
      dataIndex:'teachBuilding',
      key:'teachBuilding',
      align:'center',
      width:'14%'
    },
    {
      title:'容纳人数',
      dataIndex:'nums',
      key:'nums',
      align:'center',
      width:'12%'
    },
    {
      title:'状态',
      dataIndex:'situation',
      key:'situation',
      align:'center',
      width:'12%'
    },
    {
      title: "操作",
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" },
      align:'center',
      width:'18%'
    }
  ]
  const dataSource=[
    {
      key:'1',
      serialNum:'1',
      className:'主楼101',
      floor:'1',
      kinds:'公共教学楼',
      teachBuilding:'主楼101',
      nums:'200',
      situation:'可用',
      timeRegular:'操作'
    },
    {
      key:'2',
      serialNum:'2',
      className:'化学实验室',
      floor:'2',
      kinds:'专用场所',
      teachBuilding:'实验楼201',
      nums:'20',
      situation:'不可用',
    },
    {
      key:'3',
      serialNum:'3',
      className:'高一1班教室',
      floor:'3',
      kinds:'行政班教室',
      teachBuilding:'逸夫楼201',
      nums:'无',
      situation:'不可用',
    },
    {
      key:'4',
    }
  ]
  export default {
    name: "classroom",
    data() {
      return {
        show: false,
        placeName: "",
        columns: columns,
        buildings: [],
        floor: 1,
        placeOptions: [
          { label: "专用教学场地", value: 0 },
          { label: "公共教学场地", valeu: 1 },
          { label: "行政班教室", value: 2 }
        ],
        dataSource,
        selectedRowKeys: [],
        selectedRows: [],
        formItemLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 }
        }
      };
    },
    async created() {
      let { data } = await this.$api.basic.classroom.fetchList();
      this.dataSource = data.rows;
      let res = await this.$api.basic.building.fetchList();
      this.buildings = res.data.rows;
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: "classroom" });
    },
    methods: {
      showModal() {
        this.show = true;
      },
      async handleOk() {
        let formData = this.form.getFieldsValue();
        formData = {
          ...formData,
          capacity: parseInt(formData.capacity),
          status: formData.status ? 1 : 0
        };
        let htId = this.buildings.filter(
                b => b.buildingId == formData.buildingId
        )[0].htId;
        let addData = { ...formData, htId };
        let res = await this.$api.basic.classroom.saveClassRoom(addData);
        console.log(res);
        this.show = false;
        this.dataSource.unshift(addData);
      },
      handleCancel() {
        this.show = false;
      },
      onchange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      },
      changeBuilding(value) {
        this.floor = this.buildings.filter(b => b.buildingId == value)[0].floor;
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
      gotoNew(id) {
        this.$router.push("/basic/classroom/rule?id=" + id);
      },
      deleteItem(id) {
        let { data } = this.$api.basic.classroom.deleteBuilding({ id });
        if (data.success)
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
