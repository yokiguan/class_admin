<template>
    <a-card>
        <div class="member">
            <a-button @click="addNew" type="primary">新建</a-button>
            <a-button >批量操作</a-button>
            <a-dropdown>
                <a-menu @click="handleMenuClick" slot="overlay">
                    <a-menu-item key="delete">删除</a-menu-item>
                    <a-menu-item key="audit">审批</a-menu-item>
                </a-menu>
                <a-button>
                    更多操作 <a-icon type="down" />
                </a-button>
            </a-dropdown>
        </div>
        <standard-table
                :rowKey="'no'"
                :columns="columns"
                :dataSource="dataSource"
                :selectedRows="selectedRows"
                @change="onchange"
        />
    </a-card>
</template>

<script>
    import StandardTable from '../../../components/table/StandardTable'
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
        no:1,
        name:'车东明',
        character:'班主任'
    },{
        no:2,
        name:'车西明',
        character:'学生'
    },{
        no:3,
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
                selectedRows: []
            }
        },
        async created() {
            let queryString=window.location.hash.split('?')[1]
            let id=queryString.split('=')[1]
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
                this.dataSource.unshift({
                    key:2,
                    no:2,
                    name:'高三2',
                    grade:'高三',
                    number:41
                })
            },
            handleMenuClick (e) {
                if (e.key === 'delete') {
                    this.remove()
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .member{
        margin-bottom: 18px;
    }
</style>
