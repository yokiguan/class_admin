
<template>
  <a-card>
    <a-form-model
      layout="horizontal"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      style="overflow: hidden"
      :label-col="{span:4}"
      :wrapper-col="{span:10}"
    >
      <a-form-model-item label="选课规则" prop="rule">
        <a-input v-model="form.rule" placeholder="请输入" />
      </a-form-model-item>
      <a-form-model-item label="选课类型" prop="type">
        <a-select placeholder="请选择" v-model="form.workday">
          <a-select-option value="5">5</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="选课开始时间" prop="beginTime">
        <a-select placeholder="请选择" v-model="form.rest">
          <a-select-option value="2">2</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="选课结束时间" prop="endTime">
        <a-select placeholder="请选择" v-model="form.rest">
          <a-select-option value="2">2</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-row style="float: right;margin-bottom:10px">
        <a-button type="primary" style="margin-left: 8px">保存</a-button>
        <a-button type="primary" style="margin-left: 8px">清空</a-button>
        <a-button type="primary" style="margin-left: 8px">返回</a-button>
      </a-row>
    </a-form-model>
    <a-table :columns="columns" :dataSource="dataSource" :pagination='false'>
      <div slot="subjects" slot-scope="data">
        <a-table
          :columns="columnsSubjects"
          :dataSource="data"
          :pagination="false"
          bordered
        >
          <div slot="isMust" slot-scope="isMust">
            <a-select :default-value="isMust">
              <a-select-option :value="true"> 必选 </a-select-option>
              <a-select-option :value="false"> 可选 </a-select-option>
            </a-select>
          </div>
          <table slot="teacher" slot-scope="teacher">
            <tr v-for="t in teacher" :key="t" class="teacher">
              <td>{{ t.name }}</td>
              <td><a-input v-model="t.capacity"></a-input></td>
              <td><a-button type="primary">删除</a-button></td>
            </tr>
            <tr class="teacher">
              <a class="add-btn"><a-icon type="plus" />新增老师</a>
            </tr>
          </table>
        </a-table>
      </div>
      <a slot='operate'>删除</a>
    </a-table>
  </a-card>
</template>

<script>
const columns = [
  {
    title: "类型",
    dataIndex: "type",
  },
  {
    title: "课程",
    dataIndex: "subjects",
    scopedSlots: { customRender: "subjects" },
  },
  {
    title: "规则",
    dataIndex: "rule",
  },
  {
    title: "操作",
    dataIndex: "operate",
    scopedSlots: { customRender: "operate" },
    
  },
];

const columnsSubjects = [
  {
    title: "科目",
    dataIndex: "name",
  },
  {
    title: "是否可选",
    dataIndex: "isMust",
    scopedSlots: { customRender: "isMust" },
  },
  {
    title: "老师",
    dataIndex: "teacher",
    scopedSlots: { customRender: "teacher" },
  },
];

const dataSource = [
  {
    key: 1,
    type: "必修课",
    subjects: [
      {
        name: "高一数学",
        isMust: true,
        teacher: [
          {
            name: "张x",
            capacity: 30,
          },
          {
            name: "王x",
            capacity: 30,
          },
        ],
      },
      {
        name: "高一语文",
        isMust: true,
        teacher: [
          {
            name: "张x",
            capacity: 30,
          },
          {
            name: "王x",
            capacity: 30,
          },
        ],
      },
    ],
    rule: "覆盖2科",
  },
  {
    key: 3,
    type: "选修课",
    subjects: [
      {
        name: "高一物理选修",
        isMust: true,
        teacher: [
          {
            name: "张x",
            capacity: 30,
          },
          {
            name: "王x",
            capacity: 30,
          },
        ],
      },
      {
        name: "高一生物选修",
        isMust: true,
        teacher: null,
      },
    ],
    rule: "覆盖2科",
  },
];

export default {
  name: "QueryList",
  components: {},
  data() {
    return {
      columns,
      columnsSubjects,
      dataSource: dataSource,
      form: {
        type: 1,
        rule: 6 + 3,
        beginTime: undefined,
        endTime: undefined,
      },
      rules: {
        rule: [
          {
            required: true,
            message: "请选择所需选课规则",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择选课类型",
            trigger: "blur",
          },
        ],
        beginTime: [
          {
            required: true,
            message: "请选择选课开始时间",
            trigger: "change",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择选课结束时间",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {},
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
.teacher {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 5px;
}
.add-btn {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100px;
  margin: 10px auto 0 auto;
  padding: 5px;
  border: 1px solid;
  border-radius: 6px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
