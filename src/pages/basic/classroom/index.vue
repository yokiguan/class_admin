<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="showModal" type="primary">新建</a-button>
      </div>
      <a-table
              :rowKey="'roomId'"
              :columns="columns"
              :dataSource="dataSource"
              :selectedRows="selectedRows"
              @change="onchange"
      >
        <template slot="operation" slot-scope="text, record">
           <span @click="edit(record.roomId)">编辑</span>|
           <span @click="deleteItem(record)">删除</span>|
          <span @click="gotoNew(record.roomId)">规则设置</span>
        </template>
      </a-table>
    </div>
    <a-modal
            :title="changeTitle"
            :visible="show"
            :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form-model :model="form" :rules="rules" ref="ruleForm">
        <a-form-model-item label="教室名称" ref="name" prop="name">
          <a-input v-model="form.name" placeholder="请输入你想要新增的场地名称"></a-input>
        </a-form-model-item>
        <a-form-item label="所属教学楼" ref="buildingId" prop="buildingId">
          <a-select v-model="form.buildingId" :default-value="buildings[0].buildingId" placeholder="请选择场地所在教学楼" @change="changeBuilding">
            <a-select-option v-for="(building,index) in this.buildings" :key="index" :value="building.buildingId">
              {{ building.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-model-item label="楼层" ref="floor" prop="floor">
          <a-select placeholder="请选择场地所在楼层" v-model="form.floor">
            <a-select-option v-for="(f,index) in this.floors" :key="index" :value="f">
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
        <a-form-item label="状态" ref="status" prop="status">
          <a-switch v-model="form.status"/>
        </a-form-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
  import {message} from "ant-design-vue";
  import Templet from "../templet/index";
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
      dataIndex: "type",
      customRender:(text)=>text==0?'专业教学场地':text==1? '公共教学场地':'行政班教室'
    },
    {
      title: "容纳人数",
      dataIndex: "capacity"
    },
    {
      title: "所属教学楼",
      dataIndex: "buildingId",
      // customRender: (text, record) => record.buildingEntity.name
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
    components: {Templet},
    data() {
      return {
        show: false,
        loading:false,
        placeName: "",
        columns: columns,
        buildings: [{buildingId:"",name:""}],
        floors: [],
        dataSource: [],
        selectedRowKeys: [],
        selectedRows: [],
        editText:-1,
        changeTitle:'新增教室',
        formItemLayout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 }
        },
        form:{
          name:"",
          floor:'',
          type: '',
          buildingId:"",
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
          buildingId:[
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
      let { data}  = await this.$api.basic.classroom.fetchList();
      this.dataSource=data.rows;
      let {data:buildings}=await this.$api.basic.building.fetchList();
      console.log(buildings);
      this.buildings =buildings.rows
      // buildings.rows.map(item=>{
      //   this.buildings.push(item.name)
      // })
    },
    methods: {
       showModal() {
         this.changeTitle='新增教室'
         this.show = true;
      },
      async handleOk() {
        if(this.changeTitle=="新增教室"){
          let formData = {
            ...this.form,
            name:this.form.name,
            buildingId:this.form.buildingId,
            floor:this.form.floor,
            capacity: Number(this.form.capacity),
            type:this.form.type=='专业教学场地'?0:this.form.type=='公共教学场地'?1 :2,
            status: this.form.status ? 1 : 0,
            subId: 1
          };
          console.log(formData)
          let addData = { ...formData};
          let res = await this.$api.basic.classroom.saveClassRoom(addData);
          console.log(res);
          let { data } = await this.$api.basic.classroom.fetchList();
          this.dataSource=data.rows;
          this.show = false;
        }else{
          let formData = {
            roomId:this.dataSource[this.editText].roomId,
            name:this.form.name,
            buildingId:this.form.buildingId,
            floor:this.form.floor,
            capacity: Number(this.form.capacity),
            type:this.form.type=='专业教学场地'?0:this.form.type=='公共教学场地'?1 :2,
            status: this.form.status ? 1 : 0,
            subId: 1
          };
          let addData = { ...formData};
          let {data:saveData} = await this.$api.basic.classroom.saveClassRoom(addData);
          let { data:classroomData } = await this.$api.basic.classroom.fetchList();

          this.dataSource=classroomData.rows;
          this.show = false;
        }
      },
      handleCancel() {
        this.show = false;
      },
      onchange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      },
      async changeBuilding() {
        let {data}=await this.$api.basic.building.fetchBuilding({buildingId:this.form.buildingId});
        this.floors = []
        this.form.floor = ''
        this.floors.push(data.result.floor)
      },
      gotoNew(id) {
        this.$router.push("/basic/classroom/rule?id=" + id);
      },
      edit(id){
        this.changeTitle='编辑教室';
        this.show = true;
        this.editText=this.dataSource.findIndex(item=>item.roomId==id);
        this.form.name=this.dataSource[this.editText].name;
        this.form.buildingId=this.dataSource[this.editText].buildingId;
        this.form.floor=this.dataSource[this.editText].floor;
        this.form.capacity=this.dataSource[this.editText].capacity;
        this.form.type=this.dataSource[this.editText].type==0?'专业教学场地':1?'公共教学场地':'行政班教室';
        this.form.status=this.dataSource[this.editText].status;
      },
      async deleteItem(row) {
        console.log(row.roomId)
        let {data} = await this.$api.basic.classroom.deleteBuilding({ids: [row.roomId]});
        console.log(data);
        if(data&&data.success){
          let {data} = await this.$api.basic.classroom.fetchList();
          this.dataSource = data.rows;
          message.info('删除成功')
        } else{
          message.info('删除失败')
        }
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
