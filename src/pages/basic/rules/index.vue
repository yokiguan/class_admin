<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="showModal" type="primary">新建</a-button>
      </div>
      <a-table rowKey="ruleId" :columns="columns" :dataSource="dataSource">
        <span slot="operation" slot-scope="text, record"
        ><a @click="showModal(record)">编辑</a> |
          <a @click="gotoNew(record.ruleId)">查看</a> |
          <a @click="remove(record.ruleId)">删除</a
          ><a-modal
                  title="修改规则名字"
                  :visible="visible"
                  @ok="editSubmit"
                  @cancel="cancelSubmit"
          >
            <a-input
                    label="规则初始名"
                    disabled
                    placeholder="请输入规则初始名"
                    v-model="name"
            ></a-input>
            <a-input
                    label="规则修改名"
                    placeholder="请输入规则修改名"
                    v-model="changeName"
            ></a-input> </a-modal
          ></span>
      </a-table>
    </div>
  </a-card>
</template>

<script>
  const columns = [
    {
      title: "序号",
      dataIndex: "ruleId"
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
        name: "",
        id:null,
        changeName: ""
      };
    },
    async created() {
      let { data } = await this.$api.basic.rule.fetchList();
      this.dataSource = data.rows;
    },
    methods: {
      remove(id) {
        let { data } = this.$api.basic.rule.deleteRule({ ids: id });
        if (data.success)
          this.dataSource = this.dataSource.filter(item => item.ruleId == id);
      },
      gotoNew(id) {
        this.$router.push("/basic/rule/detail?id=" + id);
      },
      showModal(value) {
        this.visible = true;
        console.log(value);
        if (value.ruleId) {
          this.name = value.name;
          this.id=value.ruleId
        }else this.id=null
      },
      async editSubmit() {
        if (this.id) {
          let { success } = await this.$api.basic.rule.saveRule({
            ruleId: this.id,
            name: this.changeName
          });
          if(success)
            this.dataSource=this.dataSource.forEach(item => {
              if (item.id == this.id) item.name = this.changeName;
            });
        } else {
          let res=await this.$api.basic.rule.saveRule({ name: this.changeName });
          if(res.success)
            this.dataSource.unshift({ name: this.changeName })
        }

        this.visible = false;

      },
      cancelSubmit() {
        this.changeName = "";
        this.visible = false;
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
