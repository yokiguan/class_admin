<template>
    <a-card>
        <div class="member">
            <a-button @click="addNew" type="primary">新建</a-button>
            <a-dropdown>
                <a-menu @click="handleMenuClick" slot="overlay">
                    <a-menu-item key="delete">删除</a-menu-item>
                </a-menu>
                <a-button>
                    更多操作 <a-icon type="down" />
                </a-button>
            </a-dropdown>
        </div>
        <standard-table
                :rowKey="'key'"
                :columns="columns"
                :dataSource="dataSource"
                :selectedRows="selectedRows"
                @change="onchange"
        />
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
            <a-form-model ref="ruleForm" :rules="rules" :model="form"
                    :label-col="{span:5}" :wrapper-col="{span:12}" style="margin-left: 70px">
                <a-form-model-item label="角色" ref="role" prop="role">
                    <a-select v-model="form.role" placeholder="班主任/学生">
                        <a-select-option value="班主任">班主任</a-select-option>
                        <a-select-option value="学生">学生</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="人员" prop="person" ref="person">
                    <a-tree-select
                            v-model="form.person"
                            :tree-data="treeData"
                            tree-checkable
                            :show-checked-strategy="SHOW_PARENT"
                            search-placeholder="Please select"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </a-card>
</template>

<script>
    import StandardTable from '../../../components/table/StandardTable'
    import { TreeSelect } from 'ant-design-vue';
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const treeData = [
        {
            title: '高一年级',
            value: '高一年级',
            key: '0-0',
            children: [
                {title: '张凯元', value: '张凯元', key: '0-0-0',},
                {title: '张凯方', value: '张凯方', key: '0-0-1',},
            ],
        },
        {
            title: '高二年级',
            value: '高二年级',
            key: '0-1',
            children: [
                {title: '刘金瑞', value: '刘金瑞', key: '0-1-0',},
                {title: '小李', value: '小李', key: '0-1-1',},
            ],
        },
    ];
    const columns = [
        {
            title: '序号',
            dataIndex: 'no'
        },
        {
            title: '姓名',
            dataIndex: 'name'
        },
        {
            title: '角色',
            dataIndex: 'character',
        }
    ]
    const dataSource = [{
        key:'1',
        no:'1',
        name:'车东明',
        character:'班主任'
    },{
        key:'2',
        no:'2',
        name:'车西明',
        character:'学生'
    },{
        key:'3',
        no:'3',
        name:'车南明',
        character:'学生'
    }]

    export default {
        name: 'member',
        components: {StandardTable},
        data () {
            return {
                columns: columns,
                dataSource: dataSource,
                selectedRowKeys: [],
                selectedRows: [],
                addClassVisit:false,
                loading:false,
                treeData,
                SHOW_PARENT,
                form:{
                    role:'',
                    person:[],
                },
                rules:{
                    role:[
                        {
                            required:true,
                            message:"请选择年级！",
                            trigger:"change"
                        }
                    ],
                    person:[
                        {
                            required:true,
                            message:"请选择人员！",
                            trigger:"change"
                        }
                    ]
                }

            }
        },
        async created() {
            let queryString=(window.location.hash || "").split('?')[1]
            let id=(queryString || " ").split('=')[1]
            if(id){
                let { data } = await this.$api.basic.adminClass.fetchClassMember({id});
                this.dataSource=data
                this.gradeId=id
            }
        },
        methods: {
            onchange (selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                this.selectedRows = selectedRows
            },
            remove () {
                this.dataSource = this.dataSource.filter(item => this.selectedRowKeys.indexOf(item.no) < 0)
                this.selectedRows = this.selectedRows.filter(item => this.selectedRowKeys.indexOf(item.no) < 0)
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
                                no: this.dataSource.length + 1,
                                key: this.dataSource.length + 1,
                                character: this.form.role,
                                name:this.form.person,

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
        }
    }
</script>

<style lang="less" scoped>
    .member{
        margin-bottom: 18px;
    }
</style>
