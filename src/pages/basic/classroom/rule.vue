
<template>
  <a-card>
    <a-form-model
      layout="horizontal"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      style="overflow: hidden;margin:0 auto;"
      :label-col="{span:4}"
      :wrapper-col="{span:10}"
    >
      <a-form-model-item label="教学楼" prop="building">
        <a-select placeholder="请选择" v-model="form.building">
          <a-select-option v-for='b in building' :value="b.value" :key='b.name'>{{b.name}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="楼层" prop="floor">
        <a-select placeholder="请选择" v-model="form.floor">
          <a-select-option  v-for='f in findPosition(keyNameFloor).floor' :key='form.building+f.number'>{{f.number}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="教室" prop="room">
        <a-select placeholder="请选择" v-model="form.room">
          <a-select-option v-for='r in findPosition(keyNameRoom).room' :key='form.building+form.floor+r'>{{r}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="场地规则" prop="room">
        <a-select placeholder="请选择" v-model="form.rule" mode="tags">
          <a-select-option v-for='tr in rulesOptions' :key='tr.value' :value='tr.name'>{{tr.name}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-table style='width:80%;margin:0 auto' :pagination='false' :columns='rulesColumns' :dataSource='ruleData' rowKey='name'>
         <span slot="operation"> <a @click="goDetail">查看</a> | <a style="color:red;">删除</a></span>
      </a-table>
      <a-row style="float: right;margin-bottom:10px">
        <a-button type="primary" style="margin-left: 8px">选择教室</a-button>
        <a-button type="primary" style="margin-left: 8px">清空</a-button>
      </a-row>
    </a-form-model>
  </a-card>
</template>

<script>
const rulesOptions=[
    {
        name:'高一课表模板',
        value:'1-1'
    },
    {
        name:'高二课表模板',
        value:'2-1'
    },{
        name:'物理实验室使用规则',
        value:'0-1'
    },{
        name:'化学实验室使用规则',
        value:'0-2'
    },{
        name:'生物实验室使用规则',
        value:'0-3'
    },{
        name:'篮球场使用规则',
        vale:'0-4'
    }
]
const rulesColumns=[
    {
        title:'规则名称',
        dataIndex:'name'
    },{
        title:'包含场地数',
        dataIndex:'placeNum'
    },{
        title:'操作',
        dataIndex:'operation',
        scopedSlots: { customRender: "operation" },
    }
]
const ruleData=[
    {
        name:'物理实验室使用规则',
        placeNum:2
    },{
        name:'化学实验室使用规则',
        placeNum:2
    },{
        name:'生物实验室使用规则',
        placeNum:2
    },{
        name:'篮球场使用规则',
        placeNum:1
    }
]
const building=[
    {
        name:'逸夫楼',
        value:'yifu',
        floor:[{
            number:1,
            room:['101','102']
        },{
            number:2,
            room:['201','202']
        }]     
    },
     {
        name:'主楼',
        value:'main',
        floor:[{
            number:1,
            room:['101','102']
        },{
            number:2,
            room:['201','202']
        },{
            number:3,
            room:['301','302']
        }]     
    },
    
]
export default {
  name: "QueryList",
  components: {},
  data() {
    return {
        rulesOptions,
        ruleData,
        rulesColumns,
        building,
        keyNameFloor:'floor',
        keyNameRoom:'room',
      form: {
        building: 'yifu',
        floor:2,
        room:'201',
        rule:['物理实验室使用规则','化学实验室使用规则']
      },
      rules: {
        building: [
          {
            required: true,
            message: "请选择教学楼",
            trigger: "blur",
          },
        ],
        floor: [
          {
            required: true,
            message: "请选择楼层",
            trigger: "blur",
          },
        ],
        room: [
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
      goDetail(){},
      findPosition(key){
          let list=this.building
          for(let i=0;i<list.length;i++){ 
              if(list[i].value==this.form.building)
              if(key=='floor')return list[i]
              else
                  for(let o=0;o< list[i].floor.length;o++){
                      console.log(list[i].floor[o])
                      if(list[i].floor[o].number==this.form.floor) return list[i].floor[o]
                  }
                 
          }
      }
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
