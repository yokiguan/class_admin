<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="showModal" type="primary">新建</a-button>
      </div>
      <a-table
              :key="'roomId'"
              :columns="columns"
              :dataSource="dataSource"
              :selectedRows="selectedRows"
              @change="onchange"
      >
        <span slot="operation" slot-scope="record">
          <a @click="addNew(record.id)">编辑</a>
          |
          <a @click="deleteItem(record.id)">删除</a>
          |<a @click="gotoNew(record.roomId)">规则设置</a>
        </span>
      </a-table>
    </div>
    <a-modal
            title="新增教室"
            :visible="show"
            :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存
        </a-button>
        <a-button key="back" @click="handleCancel">取消
        </a-button>
      </template>
      <a-form-model :model="form" :rules="rules" ref="ruleForm">
        <a-form-model-item label="教室名称" ref="name" prop="name">
          <a-input v-model="form.name"
                  v-decorator="['name',{ rules: [{ required: true, message: '请输入场地名称' }] }]"
                  placeholder="请输入你想要新增的场地名称"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="楼层" ref="floor" prop="floor">
          <a-select v-model="form.floor" placeholder="请选择场地所在楼层">
            <a-select-option v-for="f of this.floor" :key="f" :value="f">
              {{ f }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="类型" ref="type" prop="type">
          <a-radio-group v-model="form.type">
            <a-radio value="专用教学场地">专用教学场地</a-radio>
            <a-radio value="公共教学场地">公共教学场地</a-radio>
            <a-radio value="行政班教室">行政班教室</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="容纳人数" ref="capacity" prop="capacity">
          <a-input v-model="form.capacity" placeholder="请输入你想要新增的场地容量"></a-input>
        </a-form-model-item>
        <a-form-item label="所属教学楼" ref="buildingId" prop="buildingEntity">
          <a-select v-model="form.buildingEntity" placeholder="请选择场地所在教学楼" @change="changeBuilding">
            <a-select-option
                    v-for="b in this.buildings"
                    :key="b.buildingId"
                    :value="b.buildingId">
              {{ b.buildingId}}
            </a-select-option>
<!--            <a-select-option value="主楼">主楼</a-select-option>-->
<!--            <a-select-option value="逸夫楼">逸夫楼</a-select-option>-->
          </a-select>
        </a-form-item>
        <a-form-item label="状态" ref="status" prop="status">
          <a-switch v-model="form.status" v-decorator="['status', { rules: [{ required: true }],initiaValue:true,valuePropName:'checked'}]" >
            <a-icon slot="checkedChildren" type="check"></a-icon>
            <a-icon slot="unCheckedChildren" type="close"></a-icon>
          </a-switch>
        </a-form-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
  import {message} from "ant-design-vue";

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
        show: false,
        loading:false,
        placeName: "",
        columns: columns,
        buildings: [],
        floor: 1,
        dataSource: [],
        selectedRowKeys: [],
        selectedRows: [],
        formItemLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 }
        },
        form:{
          name:"",
          floor:'',
          type: '',
          buildingEntity:"",
          capacity:'',
          status:''
        },
        rules:{
          name:[
            {
              required:true,
              message:"请输入教室名称！",
              trigger:"blur"
            }
          ],
          floor:[
            {
              required:true,
              message:"请输入楼层！",
              trigger:"blur"
            }
          ],
          type: [
            { required: true, message: '请选择教室类型', trigger: 'change' }
          ],
          buildingEntity:[
            {
              required:true,
              message:"请输入教室名称！",
              trigger:"blur"
            }
          ],
          capacity:[
            {
              required:true,
              message:"请输入教室容纳人数！",
              trigger:"blur"
            }
          ],

        }
      };
    },
    async created() {
      let { data } = await this.$api.basic.classroom.fetchList();
      this.dataSource = data.rows;
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: "classroom" });
    },
    methods: {
       async showModal() {
        let buildData = await this.$api.basic.building.fetchList();
        this.buildings = buildData.data.rows;
        console.log("this.builds",this.buildings)
        this.show = true;

      },
      async handleOk(e) {
        let formData = {
          ...this.form,
          capacity: parseInt(this.form.capacity),
          type:this.form.type,
          status: this.form.status ? 1 : 0,
          buildingEntity:{name:this.form.buildingEntity}
        };
        console.log(formData)
        let addData = { ...formData,timeSetting:this.timeQuery,roomId:1};
        let res = await this.$api.basic.classroom.saveClassRoom(addData);
        console.log(res);
        this.show = false;
        this.dataSource.unshift(addData);
        let { data } = await this.$api.basic.classroom.fetchList();
        // this.dataSource=data.rows;
      },
      // async handleOk(){
      //   let query={...this.form}
      //   let {data}=await this.$api.basic.classroom.saveClassRoom(query)
      //   console.log(data);
      //   this.show = false;
      //   this.dataSource.push(addData);
      // },
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
      addNew(id) {
        this.show=true
        console.log(id);
      },
      gotoNew(id) {
        this.$router.push("/basic/classroom/rule?id=" + id);
      },
      deleteItem(id) {
        let {data} = this.$api.basic.classroom.deleteBuilding({ids: id});
        if(data.success){
          this.dataSource=this.dataSource.filter(item => item.roomId == id)
          console.log(data)
          message.info('删除成功')
        }
        return success
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
  .operator {
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
