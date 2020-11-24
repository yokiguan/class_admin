<template>
    <div class="admin-table">
        <div class="alert">
            <a-alert type="info" :show-icon="true">
                <div slot="message">
                    已选择&nbsp;<a style="font-weight: 600">{{selectedRows.length}}</a>&nbsp;项&nbsp;&nbsp;
                    <div  v-for="(item, index) in needTotalList" :key="index">
                        <div v-if="item.needTotal">
                            {{item.title}}总计&nbsp;
                            <a :key="index" style="font-weight: 600">
                                {{item.customRender ? item.customRender(item.total) : item.total}}
                            </a>&nbsp;&nbsp;
                        </div>
                    </div>
                    <a style="margin-left: 24px" @click="clearSelect">清空</a>
                </div>
            </a-alert>
        </div>
        <a-table
                :bordered="bordered"
                :loading="loading"
                :columns="columns"
                :dataSource="dataSource"
                :rowKey="rowKey"
                :pagination="pagination"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: updateSelect}">
            <template slot="operation" slot-scope="text,record">

                <a @click="edit(text,record)" style="float: left">编辑</a>
                <a @click="deleteItem(text,record)" style="margin-left: 50px">删除</a>
                <a @click="regular(text,record)" style="margin-left: 50px">人员管理</a>
            </template>
        </a-table>
    </div>
</template>

<script>
    export default {
        name: 'RegularTable',
        props: ['bordered', 'loading', 'columns', 'dataSource', 'rowKey', 'pagination', 'selectedRows', 'subName', 'subPath'],
        data() {
            return {
                needTotalList: [],
                selectedRowKeys: []
            }
        },
        methods: {
            updateSelect(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys
                console.log(selectedRowKeys);
                let list = this.needTotalList
                this.needTotalList = list.map(item => {
                    return {
                        ...item,
                        total: selectedRows.reduce((sum, val) => {
                            return sum + val[item.dataIndex]
                        }, 0)
                    }
                })
                console.log(selectedRowKeys, selectedRows, this.needTotalList);

                this.$emit('change', selectedRowKeys, selectedRows)
            },
            clearSelect() {
                this.selectedRowKeys = []
                this.needTotalList = []
                this.$emit('change', [], [])
            },
            initTotalList(columns) {
                const totalList = []
                columns.forEach(column => {
                    if (column.needTotal) {
                        totalList.push({...column, total: 0})
                    }
                })
                return totalList
            },
            edit(text,record){
                console.log(text,record);
            },
            regular(id) {
                this.$router.push("/basic/class/member?id=" + id);
            },
            deleteItem(text,record){
                console.log(text,record);
            },
        },
        created() {
            this.needTotalList = this.initTotalList(this.columns)
        },

        watch: {
            'selectedRows': function (selectedRows) {
                this.needTotalList = this.needTotalList.map(item => {
                    return {
                        ...item,
                        total: selectedRows.reduce((sum, val) => {
                            return sum + val[item.dataIndex]
                        }, 0)
                    }
                })
            }
        },
    }

</script>

<style scoped>
    .alert{
        margin-bottom: 16px;
    }
</style>
