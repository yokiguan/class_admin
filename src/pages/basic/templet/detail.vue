<template>
  <a-card>
    <a-form-model
            layout="horizontal"
            ref="ruleForm"
            :model="form"
            :rules="rules"
            style="overflow:hidden">
      <a-row>
        <a-col :md="24" :sm="24">
          <a-form-model-item
            label="模板名称"
            prop="templetName"
            :labelCol="{ span: 2 }"
            :wrapperCol="{ span: 5 }"
          >
            <a-input v-model="form.templet_name" placeholder="请输入" />
          </a-form-model-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-col span="4">
            <a-form-model-item
              label="工作日"
              prop="workday"
              :labelCol="{ span: 10 }"
              :wrapperCol="{ span: 14 }"
            >
              <a-select placeholder="请选择" v-model="form.workday">
                <a-select-option value="5">5</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="4">
            <a-form-model-item label="假期"
              prop="restday"
              :labelCol="{ span: 10 }"
              :wrapperCol="{ span: 14 }"
            >
              <a-select placeholder="请选择" v-model="form.rest">
                <a-select-option value="2">2</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-col>
        <a-col span="4" v-for="item in activity" :key="item.name">
          <a-form-model-item
            :label="item.name"
            :prop="item.value"
            :labelCol="{ span: 10 }"
            :wrapperCol="{ span: 14 }"
          >
            <a-select placeholder="请选择" v-model="form[item.value]">
              <a-select-option v-for="option in item.options" :key="option">{{
                option
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row style="float: right;">
        <a-button type="primary" style="margin-left: 8px" @click="setInfo"
          >设置</a-button>
        <a-button @click="clearInfo" style="margin-left: 8px">清空</a-button>
        <a-button
          type="primary"
          style="margin-left: 8px"
          @click="showPublicModal"
          >公共时段设置</a-button>
        <a-button type="primary" style="margin-left: 8px" @click="showTimeModal">节次时间设置</a-button
        >
      </a-row>
    </a-form-model>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :rowKey="`activity`"
      :pagination='false'
    />
    <a-row>
      <a-button @click="saveInfo" type="primary" style="margin-left: 8px"
        >保存</a-button
      >
      <a-button @click="goBackAdmin" style="margin-left: 8px">返回</a-button>
    </a-row>
    <a-modal
      :visible="timeModal"
      title="节次时间设置"
      @ok="handleOkTime"
      @cancel="handleCancelTime">
      <a-table
        :columns="timeColumns"
        :dataSource="timeData"
        rowKey="value"
        :pagination="false"
      >
        <span slot="time" slot-scope="time,record">
          <a-time-picker v-model="time[0]" format="hh:mm" /> -
          <a-time-picker
            v-model="time[1]"
            @change="changeTime(record)"
            format="hh:mm"
          />
        </span>
      </a-table>
    </a-modal>
<!--    公共时间段设置-->
    <a-modal
      :visible="publicModal"
      title="公共时段设置"
      @ok="handleOkPublic"
      @cancel="handleCancelPublic"
    >
    </a-modal>
  </a-card>
</template>

<script>
import moment from "moment";
const columns = [
  {
    title: "",
    dataIndex: "activity"
  },
  {
    title: "星期一",
    dataIndex: "monday"
  },
  {
    title: "星期二",
    dataIndex: "tuesday"
  },
  {
    title: "星期三",
    dataIndex: "wednesday"
  },
  {
    title: "星期四",
    dataIndex: "thursday"
  },
  {
    title: "星期五",
    dataIndex: "friday"
  },
  {
    title: "星期六",
    dataIndex: "saturday"
  },
  {
    title: "星期日",
    dataIndex: "sunday"
  }
];

const activity = [
  {
    name: "早读",
    options: [0, 1, 2],
    value: "morningread"
  },
  {
    name: "上午",
    options: [0, 1, 2, 3, 4],
    value: "morning"
  },
  {
    name: "中午",
    options: [0, 1, 2],
    value: "noon"
  },
  {
    name: "下午",
    options: [0, 1, 2, 3, 4],
    value: "afternoon"
  },
  {
    name: "晚自习",
    options: [0, 1, 2, 3, 4],
    value: "evening"
  }
];

const timeColumns = [
  {
    title: "时间段名",
    dataIndex: "activity"
  },
  {
    title: "时间设置",
    dataIndex: "time",
    scopedSlots: { customRender: "time" }
  }
];

export default {
  name: "QueryList",
  data() {
    return {
      columns,
      timeColumns,
      timeData: [],
      timeQuery:{},
      dataSource: [],
      activity,
      publicModal: false,
      timeModal: false,
      form: {
        templet_name: undefined,
        workday: undefined,
        rest: undefined,
        morningread: undefined,
        morning: undefined,
        noon: undefined,
        afternoon: undefined,
        evening: undefined
      },
      rules: {
        templet_name: [
          {
            required: true,
            message: "请输入课表模板名称",
            trigger: "blur"
          }
        ],
        workday: [
          {
            required: true,
            message: "请选择工作日天数",
            trigger: "change"
          }
        ],
        rest: [
          {
            required: true,
            message: "请选择休息天数",
            trigger: "change"
          }
        ],
        morningread: [
          {
            required: true,
            message: "请选择早读节数",
            trigger: "change"
          }
        ],
        morning: [
          {
            required: true,
            message: "请选择上午节数",
            trigger: "change"
          }
        ],
        noon: [
          {
            required: true,
            message: "请选择中午节数",
            trigger: "change"
          }
        ],
        afternoon: [
          {
            required: true,
            message: "请选择下午节数",
            trigger: "change"
          }
        ],
        evening: [
          {
            required: true,
            message: "请选择晚自习节数",
            trigger: "change"
          }
        ]
      }
    };
  },
  async created() {
    let queryString=window.location.hash.split('?')[1]
    let id=queryString.split('=')[1]
    if(id){
      let { data } = await this.$api.basic.template.fetchTemplate({id});
      console.log(data);
    }
  },
  methods: {
    changeTime(record) {
      console.log(this.timeData,record);
    },
    setInfo() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let activities = [];
          let timeDatas = [];
          let list = [...this.activity];
          list.forEach(item => {
            for (let i = 1; i <= this.form[item.value]; i++) {
              activities.push({
                activity: item.name + i,
                value: item.value + i
              });
              timeDatas.push({
                activity: item.name + i,
                value: item.value + i,
                time: [moment(undefined), moment(undefined)]
              });
            }
          });
          this.dataSource = activities;
          this.timeData = timeDatas;
        } else return false;
      });
    },
    async saveInfo(){
      let query={...this.form,timeSetting:this.timeQuery}
      let {data}=await this.$api.basic.template.saveTemplate(query)
      console.log(data);
    },
    clearInfo() {
      this.$refs.ruleForm.resetFields();
    },
    goBackAdmin() {
      this.$router.push("/basic/template/admin");
    },
    showPublicModal() {
      this.publicModal = true;
    },
    handleOkPublic() {
      this.publicModal = false;
    },
    handleCancelPublic() {
      this.publicModal = false;
    },
    showTimeModal() {
      this.timeModal = true;
    },
    handleOkTime() {
      this.timeModal = false;
      this.timeData.forEach(item=>{
        let time=[]
        item.time.forEach(t=>time.push(t.format('hh:mm')))
        this.timeQuery[item.value]=time.join('-')
      })
      console.log(this.timeQuery);
    },
    handleCancelTime() {
      this.timeModal = false;
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
