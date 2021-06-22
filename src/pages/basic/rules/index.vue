<template>
  <a-card>
    <div>
      <a-table
              :rowKey="'ruleId'"
              :columns="columns"
              :dataSource="dataSource">
        <span slot="operation" slot-scope="text,record">
          <a @click="edit(record.ruleId)">编辑</a> |
          <a @click="gotoNew(record.ruleId)">查看</a> |
          <a @click="remove(record.ruleId)">删除</a>
          </span>
      </a-table>
      <a-modal
              :title="changeTitle"
              :visible="visible"
              :closable="false">
        <template slot="footer">
          <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
          <a-button key="back" @click="handleCancel">取消</a-button>
        </template>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" v-bind="formItemLayout">
          <a-form-model-item :label="changeTitle">
            <a-input  placeholder="请输入规则" v-model="form.name"></a-input>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </a-card>
</template>
<script>
  const columns = [
    {
      title: "序号",
      dataIndex: "ruleId",
      customRender: function(t, r, index) {
        return parseInt(index) + 1
      }
    },
    {
      title: "名称",
      dataIndex: "name"
    },
    {
      title: "选课规则",
      key: "operation",
      scopedSlots: { customRender: "operation" }
    }
  ];
  export default {
    name: "rule",
    data() {
      return {
        columns,
        dataSource: [],
        visible: false,
        loading:false,
        name: "",
        id:null,
        editText:-1,
        changeTextId:null,
        changeTitle:'新增教学楼',
        formItemLayout: {
          labelCol: {span: 6},
          wrapperCol: {span: 14}
        },
        form:{
          name:" ",
        },
        rules:{
          name:[
            {
              requires:true,
              message:"请输入规则名称！",
              trigger:"blur"
            }
          ]
        }
      };
    },
    async created() {
      let { data } = await this.$api.basic.rule.fetchList();
      this.dataSource = data.rows;
    },
    methods: {
      async remove(id) {
        let {data} = this.$api.basic.rule.deleteRule({ids: id});
        if (data&&data.success) {
          message.info('删除成功')
          let {data: ruleData} = await this.$api.basic.rule.fetchList();
          console.log("ruleData", ruleData)
          this.dataSource = ruleData.rows
        }
      },
      async gotoNew(id) {
        this.$router.push("/basic/rule/detail?id=" + id);
      },
      edit(id) {
        this.changeTitle="编辑教学楼"
        this.visible = true;
        this.editText=this.dataSource.findIndex(item => item.ruleId==id)
        this.form.name=this.dataSource[this.editText].name;
        console.log(this.editText);
      },
      handleCancel() {
        this.visible = false;
      },
      add() {
        this.changeTitle="新增教学楼"
        this.visible = true;
      },
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
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
