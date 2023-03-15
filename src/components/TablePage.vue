<template>
    <div id="page">
        <a-layout>
            <!-- 树搜索 -->
            <a-layout-sider v-if='treeDisplay'>
                <a-input-search v-if="hasTreeSearch" style="margin-bottom: 8px" placeholder="请输入名称"
                    @search="onSearch" />
                <a-tree expand-action="doubleclick" :tree-data="treeData" :expandedKeys="expandedKeys" defaultExpandAll
                    @select="select" @expand="onExpand" show-icon>
                    <template slot="title" slot-scope="{title}">
                        <span>{{ title }}</span>
                    </template>
                </a-tree>
            </a-layout-sider>
            <a-layout-content :class="{ 'tableContent': !treeDisplay }">
                <div classs="layout">
                    <div class="header">
                        <a-row>
                            <slot name="topOptionButton"></slot>
                        </a-row>
                        <a-row style="display: flex;justify-content: flex-end;align-items: center;margin-top: 5px;">
                            <slot name="filter"></slot>
                        </a-row>
                    </div>
                    <div style="position: relative;">
                        <div class="setHeaderIcon">
                            <rember-table-header :allColumns="allColumns" :tableName="tableName" :hasReportAction="hasReportAction" :hasAction="hasAction"
                                        @columnChange="columnChange"></rember-table-header>
                        </div>
                        <!-- 表格列表 -->
                        <a-table id="tableDom" :columns="columns" :scroll="{ x: nowTableWidth,y: tableHeight}" :data-source="tableData"
                            :row-key="(record) => record.id ? record.id : record.taskId"
                            :row-selection="{ selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange, }"
                            :pagination="{ defaultPageSize: requestParams.pageSize, current: requestParams.pageNo, total: tableTotal, showTotal: (total) => `共 ${Math.ceil(total / requestParams.pageSize)} 页，共 ${total} 条数据`, }"
                            @change="pageCurrentChange">
                            <div slot="actionTitle">
                                <div style="display: flex;">
                                    <span>基本操作</span>
                                </div>
                            </div>
                            <span class="indexColor resolveResult" slot="xuHao" slot-scope="record, id, index">
                                {{ (index + 1) + (requestParams.pageNo - 1) * requestParams.pageSize }}
                            </span>
                            <a slot="name" slot-scope="text">{{ text }}</a>
                            <div slot="action" slot-scope="text, record">
                                <a-space>
                                    <slot name="tableOpreation" :record="record"></slot>
                                </a-space>
                            </div>
                        </a-table>
                    </div>
                </div>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>
import RemberTableHeader from '@/components/RemberTableHeader.vue'

export default {
    props: {
        // 表头
        allColumns: {
            type: Array,
            default: ()=>[],
        },
        // 树数据
        treeData: {
            type: Array,
            default: ()=>[],
        },
        // 表数据总数
        tableTotal: {
            type: Number,
            default: 0,
        },
        // 表数据
        tableData: {
            type: Array,
            default: ()=>[],
        },
        // 树结构是否展示
        treeDisplay: {
            type: Boolean,
            default: true
        },
        // 表选择项
        selectedRowKeys: {
            type: Array,
            default: ()=>[],
        },
        // 是否有其他操作项
        hasReportAction: {
            type: Boolean,
            default: false
        },
        // 是否有树搜索框
        hasTreeSearch: {
            type: Boolean,
            default: true
        },
        // 表名(用来存储，唯一)
        tableName: {
            type: String,
            default: ''
        },
        // 表格宽度
        tableWidth : {
            type: Number,
            default: 3200
        },
        // 表格高度
        tableHeight: {
            type: String,
            default: 'calc(100vh - 420px)'
        },
        // 是否有基本操作项
        hasAction: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            selectedStatusKeys: [],
            requestParams: {
                pageNo: 1,
                pageSize: 10
            },
            columns: this.allColumns,
            expandedKeys: [],
            searchValue: '',
            tableSelectedRowKeys: this.selectedRowKeys,
            nowTableWidth: 0,
            allTableWidth: 0
        };
    },
    watch: {
        selectedRowKeys: {
            handler(newVal) {
                this.tableSelectedRowKeys = newVal
            },
            deep: true,
            immediate: true
        },
        tableTotal: {
            handler() {
                this.requestParams.pageNo = 1
            },
            deep: true,
            immediate: true
        },
        allTableWidth(){
            this.getTableWidth()
        }
    },
    mounted() {
        this.expandedKeys.push('0')
        this.getTableData();
        this.getTreeData();
        // 延迟，等dom加载完毕，获取当前表格宽度
        setTimeout(() => {
            var tableDom = document.getElementById('tableDom')
            this.allTableWidth = tableDom.clientWidth - 20
        }, 100)
        // 响应式，分辨率改变时重新获取当前表格宽度
        window.addEventListener('resize',() => {
            var tableDom1 = document.getElementById('tableDom')
            if(tableDom1){
                this.allTableWidth = tableDom1.clientWidth - 20
                this.getTableWidth()
            }
        })
    },
    components: {
        RemberTableHeader
    },
    methods: {
        // 调用父组件函数获取表格数据
        getTableData(val) {
            if (val == 1) {
                this.requestParams.pageNo = 1;
            }
            this.$emit('getTableData', this.requestParams)
        },
        // 表格页码切换
        pageCurrentChange({ current }) {
            this.requestParams.pageNo = current;
            this.getTableData();
        },
        // 表格选中项改变
        onSelectChange(selectedRowKeys) {
            this.tableSelectedRowKeys = selectedRowKeys;
            this.$emit('getSelectedRowKeys', this.tableSelectedRowKeys)
            this.selectedStatusKeys = [];
            this.tableData.forEach(dt => {
                if (dt.status == 0) {
                    const filt = this.tableSelectedRowKeys.filter(ft => dt.id == ft)
                    if (filt && filt.length != 0) {
                        this.selectedStatusKeys.push(dt.id);
                    }
                }
            })
        },
        // 点击选择树结构
        select(selectId) { 
            this.$emit('select', selectId)
            if (selectId.length === 0) {
                return;
            }
            this.selectedKeys = selectId;
            this.tableSelectedRowKeys = [];
            if (selectId[0] == 'root') {
                this.selectedKeys = []
                return;
            }
            this.requestParams.pageNo = 1
            this.getTableData()
            this.total = 0
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
        },
        // 调用父组件函数获取树数据
        getTreeData(params) {
            this.searchValue = params;
            this.$emit('getTreeData', this.searchValue)
        },
        // 树搜索
        onSearch(value) {
            this.getTreeData(value)
        },
        // 展示列改变
        columnChange(columns) {
            this.columns = columns
            this.getTableWidth()
        },
        // 获取当前表格宽度
        getTableWidth() {
            var allColumnsWidth = 0
            // 获取当前所有列宽度之和，如果当前列没有设宽度则默认200 
            this.columns.forEach(item => {
                if(item.width){
                    allColumnsWidth += item.width
                }else{
                    allColumnsWidth += 200
                }
            })
            // 如果总列宽大于表格dom宽度，则取总列宽;如果总列宽小于表格dom宽度，则取表格dom宽度
            if (allColumnsWidth > this.allTableWidth) {
                this.nowTableWidth = allColumnsWidth
            } else {
                this.nowTableWidth = this.allTableWidth
            }
        },
    },
};
</script>

<style lang="scss" scoped>
#page {
    padding: 20px;
}

.header {
    padding-bottom: 10px;
}

.tableContent {
    margin: 0;
}

.layout {
    background: #fff !important;

}

.ant-layout-sider {
    background: #fff;
    padding-right: 5px;
    border-right: 1px solid #eee;
}

.ant-layout-content {
    background: transparent;
    padding: 10px;
}

.ant-table-tbody {
    background: #fff !important;
    padding: 10px;
}

.outBoxStyle {
    background: blue !important;
}

.text {
    width: 100%;
    line-height: 15px;
    outLine: none;
}

/deep/.ant-table-fixed-header .ant-table-scroll .ant-table-header {
    background-color: #f5f7fd;
}

/deep/.ant-select-selection--multiple .ant-select-selection__rendered {
    height: 40px;
}

/deep/.ant-modal-body {
    max-height: 370px;
    overflow-y: auto;
}

/deep/.ant-table table {
    background-color: #f5f7fd;
}

/deep/.ant-transfer-customize-list .ant-transfer-list {
    width: 45%;
}

/deep/.ant-tree.ant-tree-block-node li span.ant-tree-checkbox+.ant-tree-node-content-wrapper {
    overflow: hidden;
    text-overflow: ellipsis;
}

/deep/.ant-table-fixed-header .ant-table-body-inner {
    background-color: #ffffff;
}

/deep/.ant-select-auto-complete.ant-select .ant-select-selection__rendered {
    line-height: 30px;
}

/deep/ .ant-table-thead>tr>th,
/deep/ .ant-table-tbody>tr>td {
    text-align: center;
}

/deep/.ant-table {
    height: calc(100vh - 300px);
}

/deep/.layout-dashboard .ant-tree {
    height: calc(100vh - 200px);
    overflow: scroll !important;
}

.setHeaderIcon{
    position: absolute;
    z-index: 999;
    right: 10px;
    top: 17px;
}
</style>