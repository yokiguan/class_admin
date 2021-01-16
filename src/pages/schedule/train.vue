<template>
    <a-card>
        <a-form-model layout="horizontal" :form="form" :rule="rules">
            <a-row>
                <a-col :md="7" :sm="24">
                    <a-form-model-item label="级部" :labelCol="{ span: 3 }" :wrapperCol="{ span: 15, offset: 1 }">
                        <a-select placeholder="请选择"  v-model="form.adminId" @change="handleAdminChange">
                            <a-select-option v-for="(admin,index) in this.adminData" :key="index">
                                {{admin.adminName}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-col>
                <a-col :md="7" :sm="24">
                    <a-form-model-item label="年级" :labelCol="{ span: 3}" :wrapperCol="{ span: 15, offset: 1 }">
                        <a-select placeholder="请选择" v-model="form.gradeId" @change="handleGradeChange">
                            <a-select-option v-for="(grade,index) in this.gradeData" :key="index">
                                {{grade.gradeName}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-col>
                <a-col :md="7" :sm="24">
                    <a-form-model-item label="按姓名查找" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15, offset: 1 }">
                        <a-auto-complete class="global-search"
                                placeholder="请输入教师姓名"
                                option-label-prop="teacherName"
                                @select="onSelect"
                                @search="handleSearch">
                            <template slot="dataSource">


                            </template>
                            <a-input>
                                <a-button slot="suffix" class="search-btn" type="primary" style="margin-right: -12px">
                                    <a-icon type="search"></a-icon>
                                </a-button>
                            </a-input>
                        </a-auto-complete>
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>
        <div>
            <a-table
                    :rowKey="'teacherId'"
                    :columns="columns"
                    :dataSource="dataSource">
                <div slot="operation">
                    <span>规则设置</span>
                </div>
            </a-table>
        </div>
    </a-card>
</template>
<script>
    import Templet from "../basic/templet/index";
    const columns = [
        {
            title: '教师工号',
            dataIndex: 'teacherId',
        },
        {
            title: '教师名称',
            dataIndex: 'teacherName'
        },
        {
            title: '所授课程',
            dataIndex: 'subjectTeacherDtos',
            customRender: (text,index,i)=>{
                let course=""
                for(var j=0;j<text.length;j++){
                    if(course==""){
                        course=text[j].subName;
                    }else{
                        course=course+"+"+text[j].subName;
                    }
                }
                return course;
            }
        },
        {
            title: '是否为班主任',
            dataIndex: 'teacherRoleDtos',
            customRender: (text,index,i)=>{
                let teacherRole=""
                if(text.length==0){
                    teacherRole='非班主任'
                }else if(text.length==1){
                    teacherRole=text[0].headteacherGradeName+text[0].headteacherClassName;
                }else{
                    for(var j=0;j<text.length;j++){
                        if(teacherRole==""){
                            teacherRole=text[j].headteacherGradeName+text[j].headteacherClassName;
                        }
                        teacherRole=teacherRole+"+"+text[j].headteacherGradeName+text[j].headteacherClassName;
                    }
                }
                return teacherRole;
            }
        },
        {
            title: '手机号码',
            dataIndex: 'tel',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
        }
    ]
    export default {
        name: 'teacher',
        components: {Templet},
        data () {
            return {
                columns: columns,
                dataSource: [],
                adminData:[],
                gradeData:[],
                teacherNameData:[],
                form:{
                    adminName:'',
                },
                rules:{
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
        async created(){
            //获取年级信息接口
            let {data:{result,success}}=await this.$api.basic.grade.fetchList();
            console.log(result);
            //获取级部
            this.adminData=result;
            console.log(this.adminData);
            //获取所有教师信息
            let {data:allTeacherData}=await this.$api.basic.teacher.fetchAllTeacherList();
            console.log(allTeacherData);
            this.dataSource=allTeacherData.rows;
            console.log(this.dataSource)
        },
        methods: {
            handleAdminChange(){
                console.log(this.form.adminId)
                for (let i=0;i<this.adminData.length;i++){
                    if(i==this.form.adminId){
                        //获取年级
                        this.gradeData=this.adminData[i].adminGrades,
                            console.log(this.gradeData)
                    }
                }
            },
            handleGradeChange(){
                for (let i=0;i<this.gradeData.length;i++){
                    if(i==this.form.gradeId){
                        //获取班级信息
                        this.classData=this.gradeData[i].trees
                        console.log(this.classData)
                    }
                }
            },
            // onSearch(value) {
            //     for(let i=0;i<this.dataSource.length;i++){
            //         // this.teacherNameData.push()=this.dataSource[i].teacherNameData;
            //     }
            //     console.log( this.teacherNameData);
            //     console.log(value);
            // },
            onSelect(value){
                console.log('onSelect',value);
            },
            handleSearch(value){
                this.dataSource=value?this.searchResult(value):[];
            },
            getRandomInt(max, min = 0) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            searchResult(query) {
                return new Array(this.getRandomInt(5))
                    .join('.')
                    .split('.')
                    .map((item, idx) => ({
                        query,
                        category: `${query}${idx}`,
                        count: this.getRandomInt(200, 100),
                    }));
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
