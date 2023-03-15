<template>
    <div style="position: absolute;right: -5px;width: 30px;background-color: #f5f7fd;">
        <a-popover placement="bottomRight" :arrow="true">
            <a><a-icon type="setting"></a-icon></a>
            <template slot="title">
                表头显示字段
            </template>
            <template slot="content">
                <div style="max-height: 200px;overflow-y: auto;">
                    <div>
                        <a-checkbox value="all" :checked="checkedAll" @change="allChange">全选</a-checkbox>
                    </div>
                    <a-checkbox-group v-model="tableHeader" style="display:flex;flex-direction: column;align-items: flex-start;"
                        @change="tableHeaderChange">
                        <a-checkbox v-for="item in tableHeaderOptions" :key="item" :value="item">{{
                            item
                        }}</a-checkbox>
                    </a-checkbox-group>
                </div>
            </template>
        </a-popover>
    </div>
</template>
<script>

export default {
    props: {
        // 表头
        allColumns: {
            type: Array,
            default: ()=>[],
        },
        // 表名（唯一）
        tableName: {
            type: String,
            default: ''
        },
        // 是否有报告操作列
        hasReportAction: {
            type: Boolean,
            default: false
        },
        // 是否有基本操作列
        hasAction: {
            type: Boolean,
            default: true
        },
        // 是否有序号列
        hasXuhao: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            // 全选框的状态
            checkedAll: true,
            // 所有可选择的表头
            tableHeaderOptions: [],
            // 选择的表头
            tableHeader: [],
            // 操作列内容
            actionContent: [],
            // 报告操作列内容
            reportActionContent: [],
            // 序号列内容
            xuhaoContent: [],
        };
    },
    watch:{
        allColumns: {
            handler(newVal) {
                if(newVal.length != 0){
                    Object.assign(this.allColumns,newVal)
                    this.init()
                }
            },
            deep: true,
            immediate: true
        },
    },
    mounted() {
        if(this.allColumns.length != 0){
            this.init()
        }
    },
    methods: {
        init() {
            this.tableHeaderOptions = []
            // 获取除了序号列和操作列的其他列
            this.allColumns.forEach(item => {
                if (item.title && item.title != '序号' && item.title != '报告操作' && item.title != '授权操作') {
                    this.tableHeaderOptions.push(item.title)
                }
                if (item.key == 'xuHao') {
                    this.xuhaoContent = item
                }
                if (item.key == 'reportAction' || item.key == 'authorization') {
                    this.reportActionContent = item
                }
                if (item.key == 'action') {
                    this.actionContent = item
                }
            })
            this.tableHeader = this.tableHeaderOptions
            // 从localStorage中获取当前表格之前存储的表头
            if (localStorage.getItem(this.tableName) != null) {
                this.tableHeader = localStorage.getItem(this.tableName).split(',')
                this.tableHeaderChange()
            }
            this.tableHeaderChange()
        },
        // 点击全选框
        allChange(value) {
            this.checkedAll = value.target.checked
            if (this.checkedAll == false) {
                this.tableHeader = []
            } else {
                this.tableHeader = this.tableHeaderOptions
            }
            this.tableHeaderChange()
        },
        // 表头选择改变
        tableHeaderChange() {
            // 向 localStorage 中存储当前选择的表头
            localStorage.setItem(this.tableName,this.tableHeader)
            var length = 2
            if(this.hasReportAction){
                length = 3
            }else if(!this.hasAction){
                length = 1
            }
            if(!this.hasXuhao){
                length -= 1
            }
            // 判断是否全选，设置选择框的选中状态
            if (this.tableHeader.length < this.allColumns.length - length) {
                this.checkedAll = false
            } else {
                this.checkedAll = true
            }
            var header = this.allColumns.filter(item => this.tableHeader.indexOf(item.title) > -1)
            // 向表头中添加序号列和操作列
            if(this.hasXuhao){
                header.unshift(this.xuhaoContent)
            }
            if(this.hasReportAction){
                header.push(this.reportActionContent)
            }
            if(this.hasAction){
                header.push(this.actionContent)
            }
            this.$emit('columnChange',header)
        },
    },
};
</script>
<style>
.ant-checkbox-group :first-child {
    margin-left: 8px;
}
</style>