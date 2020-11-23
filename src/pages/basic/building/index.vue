<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="showModal" type="primary">新建</a-button>
      </div>
      <a-table rowKey="buildingId" :columns="columns"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
        @change="onchange">
      <span slot="operation" slot-scope="text, record">
     <a @click="gotoNew(record.id)">编辑</a>
     <a @click="deleteItem(record.buildingId)">删除</a>
    </span>
      </a-table>
    </div>
     <a-modal
      title="新增教学楼"
      :visible="show"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" v-bind="formItemLayout">
        <a-form-item label="教学楼名称">
          <a-input
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请输入教学楼名称' }] }
            ]"
            placeholder="请输入你想要新增的教学楼名称"
>>>>>>> upstream/master
          ></a-input>
        </a-form-item>
        <a-form-item label="教学楼层数">
          <a-input
            v-decorator="[
              'floor',
              { rules: [{ required: true, message: '请输入层数' }] }
            ]"
            placeholder="请输入你想要新增的层数"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="是否启用">
          <a-switch v-decorator="['status', { rules: [{ required: true }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import {message} from 'ant-design-vue'
const columns = [
  {
    title: '教学楼编号',
    dataIndex: 'buildingId'
  },
  {
    title: '教学楼名称',
    dataIndex: 'name'
  },
  {
    title: '楼层',
    dataIndex: 'floor',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender:(text)=>text==1?'可用':'已占用'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
]

export default {
    name: 'classroom',
    async created() {
        let {data} = await this.$api.basic.building.fetchList();
        this.dataSource = data.rows;
        console.log(data);
    },
    data() {
        return {
            show: false,
            columns: columns,
            dataSource: [],
            selectedRowKeys: [],
            selectedRows: [],
            formItemLayout: {
                labelCol: {span: 6},
                wrapperCol: {span: 14}
            }
        }
    },
    beforeCreate() {
        this.form = this.$form.createForm(this, {name: "building"});
    },
    methods:{
        showModal() {
            this.show = true;
        },
        async handleOk() {
            let formData = this.form.getFieldsValue();
            formData = {
                ...formData,
                floor: parseInt(formData.floor),
                status: formData.status ? 1 : 0
            };
            let res = await this.$api.basic.building.saveBuilding(formData);
            console.log(res);
            this.show = false;
            this.dataSource.unshift(formData);
        },
        handleCancel() {
            this.show = false;
        },
        onchange(selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
        },
        data() {
            return {
                show: false,
                columns: columns,
                dataSource: [],
                selectedRowKeys: [],
                selectedRows: [],
                formItemLayout: {
                    labelCol: {span: 6},
                    wrapperCol: {span: 14}
                }
            }
        },
        beforeCreate() {
            this.form = this.$form.createForm(this, {name: "building"});
        },
        async deleteItem(id) {
            let {data} = this.$api.basic.building.deleteBuilding({id})
            if (data.success) {
                this.dataSource = this.dataSource.filter(item => item.id == id)
                message.info('删除成功')
            }
        },
        handleMenuClick(e) {
            if (e.key === 'delete') {
                this.remove()
            }
        },
    }
}
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
