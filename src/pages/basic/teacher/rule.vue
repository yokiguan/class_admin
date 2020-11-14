
<template>
  <a-card>
    <a-form-model
            layout="horizontal"
            ref="ruleForm"
            :model="form"
            :rules="rules"
            style="overflow: hidden; margin: 0 auto"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 10 }"
    >
      <a-form-model-item label="职责" prop="school">
        <a-select placeholder="请选择" v-model="form.school">
          <a-select-option v-for="b in school" :key="b.name" :value='b.value'>{{
            b.name
            }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="年级" prop="grade">
        <a-select placeholder="请选择" v-model="form.grade">
          <a-select-option
                  v-for="f in findPosition(keyNameGrade).grade"
                  :key="form.school + f.number"
                  :value='f.number'
          >{{ f.name }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="科目" prop="subject">
        <a-select placeholder="请选择" v-model="form.subject">
          <a-select-option
                  v-for="r in findPosition(keyNameSubject).subject"
                  :key="form.school + form.grade + r"
                  :value='r.value'
          >{{ r.name }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="老师" prop="teacher">
        <a-select placeholder="请选择" v-model="form.teacher" mode="tags">
          <a-select-option
                  v-for="t in findPosition(keyNameTeacher).teacher"
                  :key="form.school + form.grade + form.subject + t"
          >{{ t }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="场地规则" prop="subject">
        <a-select placeholder="请选择" v-model="form.rule" mode="tags">
          <a-select-option
                  v-for="tr in rulesOptions"
                  :key="tr.value"
                  :value="tr.name"
          >{{ tr.name }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-table
              style="width: 80%; margin: 0 auto"
              :pagination="false"
              :columns="rulesColumns"
              :dataSource="ruleData"
              rowKey="name"
      >
        <span slot="operation">
          <a @click="goDetail">查看</a> | <a style="color: red">删除</a></span
        >
      </a-table>
      <a-row style="float: right; margin-bottom: 10px">
        <a-button type="primary" style="margin-left: 8px">选择教室</a-button>
        <a-button type="primary" style="margin-left: 8px">清空</a-button>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
  const rulesOptions = [
    {
      name: "高一课表模板",
      value: "1-1",
    },
    {
      name: "高二课表模板",
      value: "2-1",
    },
    {
      name: "物理老师规则",
      value: "0-1",
    },
    {
      name: "化学老师规则",
      value: "0-2",
    },
    {
      name: "生物老师规则",
      value: "0-3",
    },
    {
      name: "体育老师规则",
      vale: "0-4",
    },
  ];
  const rulesColumns = [
    {
      title: "规则名称",
      dataIndex: "name",
    },
    {
      title: "包含老师数",
      dataIndex: "teacherNum",
    },
    {
      title: "操作",
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" },
    },
  ];
  const ruleData = [
    {
      name: "物理老师时间规则",
      teacherNum: 2,
    },
    {
      name: "化学老师时间规则",
      teacherNum: 2,
    },
    {
      name: "生物老师时间规则",
      teacherNum: 2,
    },
    {
      name: "体育老师时间规则",
      teacherNum: 1,
    },
  ];
  const school = [
    {
      name: "教学组",
      value: "jiaoxue",
      grade: [
        {
          number: 1,
          name: "高一",
          subject: [
            {
              name: "语文",
              value: "yuwen",
              teacher: ["赵", "钱", "孙", "李"],
            },
            {
              name: "数学",
              value: "shuxue",
              teacher: ["赵", "钱", "孙", "李"],
            },
            {
              name: "体育",
              value: "pe",
              teacher: ["赵", "钱", "孙", "李"],
            },
          ],
        },
        {
          number: 2,
          name: "高二",
          subject: [
            {
              name: "语文",
              value: "yuwen",
              teacher: ["赵", "钱", "孙", "李"],
            },
            {
              name: "数学",
              value: "shuxue",
              teacher: ["赵", "钱", "孙", "李"],
            },
            {
              name: "体育",
              value: "pe",
              teacher: ["赵", "钱", "孙", "李"],
            },
          ],
        },
      ],
    },
    {
      name: "教务组",
      value: "jiaowu",
      grade: [
        {
          number: 1,
          name: "高一",
          subject: [],
        },
        {
          number: 2,
          name: "高二",
          subject: [{
            name: "财务",
            value: "jz",
            teacher: ["赵", "钱", "孙", "李"],
          },],
        },
      ],
    },
  ];
  export default {
    name: "QueryList",
    components: {},
    data() {
      return {
        rulesOptions,
        ruleData,
        rulesColumns,
        school,
        keyNameGrade: "grade",
        keyNameSubject: "subject",
        keyNameTeacher: "teacher",
        form: {
          school: "jiaoxue",
          grade: 2,
          subject: "yuwen",
          teacher: ["赵", "钱"],
          rule: ["物理老师规则", "化学老师规则"],
        },
        rules: {
          school: [
            {
              required: true,
              message: "请选择教学楼",
              trigger: "blur",
            },
          ],
          grade: [
            {
              required: true,
              message: "请选择楼层",
              trigger: "blur",
            },
          ],
          subject: [
            {
              required: true,
              message: "请选择教室",
              trigger: "change",
            },
          ],
        },
      };
    },
    methods: {
      goDetail() {},
      findPosition(key) {
        let list = this.school;
        for (let i = 0; i < list.length; i++) {
          if (list[i].value == this.form.school){
            if (key == "grade") return list[i];
            else
              for (let o = 0; o < list[i].grade.length; o++) {
                if (key == "subject") {
                  if (list[i].grade[o].number == this.form.grade)
                    return list[i].grade[o];
                } else {
                  for (let p = 0; p < list[i].grade[o].subject.length; p++) {
                    if (list[i].grade[o].subject[p].value == this.form.subject)
                      return list[i].grade[o].subject[p];
                  }
                }
              }
          }
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
