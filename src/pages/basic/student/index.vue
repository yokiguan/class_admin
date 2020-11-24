<template>
  <a-card>
<!--    <div class="left">-->
<!--      <a-tree-->
<!--              v-model="form.classData"-->
<!--              ref="tree"-->
<!--              :tree-data="treeData"-->
<!--              :replace-fields="replaceFields"-->
<!--              @select="onSelect"-->
<!--              @check="onCheck"-->
<!--              checkable-->
<!--              style="font-size: 1.3em;"/>-->
<!--    </div>-->
    <div class="right">
      <a-form layout="horizontal">
        <a-row>
          <a-col :md="8" :sm="24">
            <a-form-item
                    label="年级"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }" prop="gradeData">
              <a-select placeholder="请选择" v-model="form.gradeData">
                <a-select-option value="高一">高一</a-select-option>
                <a-select-option value="高二">高二</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item
                    label="年级"
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 18, offset: 1 }" prop="classData">
              <a-select placeholder="请选择" v-model="form.classData">
                <a-select-option value="高一1班">高一1班</a-select-option>
                <a-select-option value="高二1班">高二1班</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div>
        <div class="operator">
          <a-button @click="addNew" type="primary">新建</a-button>
          <a-dropdown>
            <a-menu @click="handleMenuClick" slot="overlay">
              <a-menu-item key="delete">删除</a-menu-item>
              <a-menu-item key="audit">批量导入</a-menu-item>
            </a-menu>
            <a-button>
              更多操作 <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>
        <student-table
                ref="editStudent"
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
              :closable="false">
        <template slot="footer">
          <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
            保存
          </a-button>
          <a-button key="back" @click="handleCancel">
            取消
          </a-button>
        </template>
        <a-form-model :model="form" ref="ruleForm" :rules="rules"
                      :label-col="{span:5}" :wrapper-col="{span:12}" style="margin-left: 70px">
          <a-form-model-item label="学生姓名" ref="student_name" prop="student_name">
            <a-input style="width: 300px" placeholder="车东明" v-model="form.student_name"/>
          </a-form-model-item>
          <a-form-model-item label="学号" ref="student_num" prop="student_num">
            <a-input style="width: 300px" placeholder="007" v-model="form.student_num"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </a-card>
</template>
<script>
  import StudentTable from "../../../components/table/StudentTable";
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
      title: '学号',
      dataIndex: 'studentID',
    },
    {
      title: '所属年级',
      dataIndex: 'grade',
    },
    {
      title: '班级',
      dataIndex: 'class',
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
    studentID:'021921',
    grade:'高一',
    class:'高一（1）',
  },{
    key:2,
    no:2,
    name:'小管',
    grade:'高一',
    class:'高一（2）',
  },{
    key:3,
    no:3,
    name:'Evan Hansen',
    studentID:'2324424',
    grade:'高二',
    class:'高一（1）',
  }]
  // const treeData = [
  //   {
  //     name: '高中部',
  //     key: '高中部',
  //     child: [
  //       { name: '高一',
  //         key: '高一',
  //         child:[
  //           { name: '高一1班', key: '高一1班' },
  //           {name:'高一2班',key:'高一2班'},
  //           {name:'高一3班',key:'高一3班'},
  //           {name:'高一4班',key:'高一4班'},
  //         ],
  //       },
  //       { name: '高二', key: '高二' },
  //       { name: '高三', key: '高三' },
  //     ],
  //   },{
  //     name: '初中部',
  //     key: '初中部',
  //     child: [
  //       { name: '初一', key: '初一'},
  //       { name: '初二', key: '初二' },
  //       { name: '初三', key: '初三' },
  //     ],
  //   },
  // ];
  export default {
    name: 'student',
    components: {StudentTable},
    data () {
      return {
        columns: columns,
        dataSource: dataSource,
        // treeData,
        selectedRowKeys: [],
        selectedRows: [],
        addClassVisit:false,
        loading:false,
        disabled: false,
        // replaceFields: {
        //   children: 'child',
        //   title: 'name',
        // },
        form:{
          student_name:'',
          student_num:'',
          classData:[],
        },
        rules:{
          student_name:[{
            required:true,
            message:"请输入学生姓名！",
            trigger:"blur"
          }],
          student_num:[{
            required:true,
            message:"请输入学号！",
            trigger:"blur"
          }],
          classData:[
            {
              required:true,
              message:"请选择班级！",
              trigger:"change"
            }
          ],
          gradeData:[
            {
              required:true,
              message:"请选择年级！",
              trigger:"change"
            }
          ]
        }
      }
    },
    methods: {
      onchange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      remove () {
        this.dataSource = this.dataSource.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
        this.selectedRows = this.selectedRows.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
      },
      addNew () {
        this.addClassVisit=true
      },
      handleMenuClick (e) {
        if (e.key === 'delete') {
          this.remove()
        }
      },
      handleOk() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.loading = true
            setTimeout(() => {
              this.dataSource.push({
                key: this.dataSource.length + 1,
                no: this.dataSource.length + 1,
                name:this.form.student_name,
                studentID:this.form.student_num,
                class: this.form.classData,
                grade:this.form.gradeData,
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
      handleCancel(){
        this.addClassVisit=false
      },
      edit(text,record){
        this.addClassVisit=true
        console.log(text,record);
      },
      // onCheck(checkedKeys) {
      //   console.log('onCheck', checkedKeys);
      //   this.checkedKeys = checkedKeys;
      // },
      // onSelect(selectedKeys, info) {
      //   console.log('onSelect', info);
      //   this.selectedKeys = selectedKeys;
      // },
    }
  }
</script>

<style lang="less" scoped>
  /*.left{*/
  /*  width: 300px;*/
  /*  height: 900px;*/
  /*  background-color: white;*/
  /*  margin: 0px 0px 20px 0px;*/
  /*  padding: 20px 25px;*/
  /*  border-radius: 10px;*/
  /*}*/
  /*.right{*/
  /*  border-radius: 5px;*/
  /*  margin-top: -920px;*/
  /*  margin-left: 320px;*/
  /*  background-color: white;*/
  /*  padding: 20px 25px;*/
  /*  height:700px;*/
  /*}*/
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
