<template>
    <a-card>
        <div class="operator">
            <a-button @click="addNew" type="primary">新建</a-button>
        </div>
        <a-table
                :rowKey="'no'"
                :columns="columns"
                :dataSource="dataSource"
        >
            <span slot="operation" slot-scope="text,value"><a @click='remove(value)'>删除</a></span>
        </a-table>
        <a-modal title="新增课程"
                 :visible='showSubject'
                 @ok="handleOk"
                 @cancel="handleCancel">
            <a-input placeholder='请输入你想要新增的课程名' label='课程名' v-model="addSub"></a-input>
        </a-modal>
    </a-card>
</template>

<script>
    const columns = [
        {
            title: "课程编号",
            dataIndex: "no",
        },
        {
            title: "课程名称",
            dataIndex: "name",
        },
        {
            title: "操作",
            dataIndex: "text,value",
            scopedSlots: { customRender: "operation" },
        },
    ];

    const dataSource = [
        {
            no: 1,
            name: "语文",
        },
        {
            no: 2,
            name: "化学选修",
        },
        {
            no: 3,
            name: "物理选修",
        },
    ];

    export default {
        name: "grade·subjects",
        data() {
            return {
                columns,
                dataSource,
                showSubject:false,
                addSub:''
            };
        },
        methods: {
            remove(value){
                this.dataSource.filter(item=>item.no==value.no)
            },
            addNew() {
                this.showSubject=true
            },
            handleCancel(){
                this.showSubject=false
                this.addSub=''
            },
            handleOk(){
                this.dataSource.push({
                    no:this.dataSource.length-1,
                    name:this.addSub
                })
                this.showSubject=false
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
    @media screen and (max-width: 900px) {
        .fold {
            width: 100%;
        }
    }
</style>
