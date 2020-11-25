<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
            <a-menu-item key="edit(text,record)">编辑</a-menu-item>
          </a-menu>
          <a-button>
            更多操作
          </a-button>
        </a-dropdown>
      </div>
      <regular-table
              :rowKey="'key'"
              :columns="columns"
              :dataSource="dataSource"
              :selectedRows="selectedRows"
              @change="onchange"
      />
    </div>
    <a-modal
            :visible='addClassVisit'
            width="600px"
            :closable="false"
            on-ok="handleOk">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存
        </a-button>
        <a-button key="back" @click="handleCancel">取消
        </a-button>
      </template>
      <a-form-model ref="ruleForm" :model="form"
                    :rules="rules"
                    :label-col="{span:10}" :wrapper-col="{span:12}" style="width: 300px;margin-left: 30px">
        <a-form-model-item label="老师姓名" ref="teacher_name" prop="teacher_name">
          <a-input style="width: 300px" placeholder="请输入" v-model="form.teacher_name"/>
        </a-form-model-item>
        <a-form-model-item label="联系电话" ref="connection_number" prop="connection_number">
          <a-input style="width: 300px" placeholder="请输入" v-model="form.connection_number"/>
        </a-form-model-item>
        <a-form-model-item label="其他授课年级" prop="class_grade">
          <a-select v-model="form.class_grade" placeholder="请选择" style="width: 300px">
                            <a-select-option value="高一">高一</a-select-option>
                            <a-select-option value="高二">高二</a-select-option>
                            <a-select-option value="高三">高三</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="是否是班主任" prop="isManagement">
          <a-radio-group v-model="form.isManagement">
            <a-radio value="是">是</a-radio>
            <a-radio value="否">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="选择班级" prop="class">
            <a-tree-select
                    show-search
                    style="width: 300px"
                    :value="classValue"
                    :drown-style="{maxHeight:'400px',overflow:'auto'}"
                    placeholder="请选择"
                    v-model="form.class"
                    allow-clear
                    multiple
                    @change="classChange"
                    @search="classSearch"
                    @select="classSelect"
                    :tree-data="treeData"
            ></a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="所授课程" prop="course">
          <a-tree-select
           show-search
           style="width: 300px"
           :value="courseValue"
           :drown-style="{maxHeight:'400px',overflow:'auto'}"
           placeholder="请选择"
           v-model="form.course"
           allow-clear
           multiple
           @change="courseChange"
           @search="courseSearch"
           @select="courseSelect"
           :tree-data="CourseData"
          ></a-tree-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
  import RegularTable from "../../../components/table/RegularTable";
  import { TreeSelect } from 'ant-design-vue';
  const SHOW_PARENT = TreeSelect.SHOW_PARENT;
  const treeData = [
    {
      title: '高中部',
      key: '0-0',
      value: '高中部',
      children: [
        { title: '高一',
          key: '0-0-0',
          value: '高一',
          children:[
            { title: '高一1班', key: '0-0-0-0',value: '高一1班' },
            {title:'高一2班',key:'0-0-0-1',value: '高一2班'},
            {title:'高一3班',key:'0-0-0-2',value: '高一3班'},
            {title:'高一4班',key:'0-0-0-3',value: '高一4班'},
          ],
        },
        { title: '高二', key: '0-0-1',value: '高二' },
        { title: '高三', key: '0-0-2',value: '高三' },
      ],
    },{
      title: '初中部',
      key: '0-1',
      value: '初中部',
      children: [
        { title: '初一', key: '0-1-0',value: '初一'},
        { title: '初二', key: '0-1-1',value: '初二' },
        { title: '初三', key: '0-1-2',value: '初三'},
      ],
    },
  ];
  const CourseData=[
    {
      title:'物理',
      key:'0-0',
      value:'物理',
      children:[
        {title:'物理选修', key:'0-0-0',value:'物理选修'},
        {title:'物理学修', key:'0-0-1',value:'物理学修'}
      ]
    },
    {title:'语文',key: '0-1',value:'语文'},
    {title:'数学',key: '0-2',value:'数学'},
    {title:'化学',key: '0-3',value:'化学'},
    {title:'生物',key: '0-4',value:'生物'},
    {title:'外语',key: '0-5',value:'外语'},
  ]
  const columns = [
    {
      title: '序号',
      dataIndex: 'no'
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '所授课程',
      dataIndex: 'subjects',
    },
    {
      title: '是否为班主任',
      dataIndex: 'isAdmin',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    }
  ]
  const dataSource = [
    {
    key:1,
    no:1,
    name:'车西明',
    subjects:'高一数学',
    isAdmin:'高一（1）',
    phone:'1234567890'
  },{
    key:2,
    no:2,
    name:'小管',
    subjects:'高二物理选修；高二物理学修',
    isAdmin:'无',
    phone:'15868123431'
  },{
    key:3,
    no:3,
    name:'Evan Hansen',
    subjects:'高二物理选修；高二物理学修',
    isAdmin:'无',
    phone:'15868123431'
  }]
  export default {
    name: 'student',
    components: {RegularTable},
    data () {
      return {
        columns: columns,
        dataSource: dataSource,
        treeData,
        selectedRowKeys: [],
        selectedRows: [],
        loading:false,
        addClassVisit:false,
        CourseData,
        SHOW_PARENT,
        myBarOption:{
          barColor:'block'
        },
        disabled: false,
        courseValue:undefined,
        classValue:undefined,
        replaceFields: {
          children: 'child',
          title: 'name',
        },
        searchValue: '',
        form:{
          teacher_name:undefined,
          connection_number:undefined,
          class_grade:undefined,
          isManagement:' ',
          class:undefined,
          course:undefined,
        },
        rules:{
          teacher_name:[
              {
                required:true,
                message:"请输入老师姓名！",
                trigger:"blur"
              }
            ],
          connection_number:[
                  {
                    required:true,
                    message:"请输入联系电话！",
                    trigger:"blur"
          }
          ],
          class_grade:[
            {
              required:true,
              message:"请选择授课年级！",
              trigger:"change"
            }
          ],
          isManagement:[
            {
              required:true,
              message:"请选择是不是班主任！",
              trigger:"change"
            }
          ],
          class:[
            {
              required:true,
              message:"请选择班级！",
              trigger:"change"
            }
          ],
          course:[
            {
              required:true,
              message:"请输入所授课程！",
              trigger:"blur"
            }
          ],
        }
      }
    },
    methods: {
      onchange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      remove() {
        this.dataSource = this.dataSource.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
        this.selectedRows = this.selectedRows.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)

      },
      addNew() {
        this.addClassVisit = true
      },
      handleOk() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.loading = true
            setTimeout(() => {
              this.dataSource.push({
                key: this.dataSource.length + 1,
                no: this.dataSource.length + 1,
                name: this.form.teacher_name,
                phone: this.form.connection_number,
                isAdmin: this.form.isManagement,
                subjects: this.form.class_grade + this.form.course,
              })
              this.loading = false
              this.addClassVisit = false
              this.$refs.ruleForm.resetFields();
            }, 300)
          } else {
            console.log('error submit!!');
            return false
          }
        });
      },
      handleCancel() {
        this.addClassVisit = false
      },
      handleMenuClick(e) {
        if (e.key === 'delete') {
          this.remove()
        }else if(e.key=='edit(text,record)'){
          this.addClassVisit=true
          this.form.te

        }
      },
      courseChange(value) {
        console.log(value);
        this.courseValue = value;
      },
      classChange(value) {
        console.log(value);
        this.courseValue = value;
      },
      courseSearch() {
      },
      classSearch() {
      },
      courseSelect() {
      },
      classSelect() {
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
