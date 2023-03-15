<template>
    <div id = 'page'>
        <table-page 
            :allColumns="columns" 
            :treeData="treeData" 
            :tableTotal="tableTotal"
            :tableData="tableData" 
            :treeDisplay="true" 
            :selectedRowKeys="selectedRowKeys"
            tableName="testTable"
            :tableWidth="1700"
            tableHeight="calc(100vh - 350px)"
            :hasTreeSearch="true"
            :hasReportAction="false"
            :hasAction="true"
            @getTableData="getTableData"
            @getTreeData="getTreeData"
            @getSelectedRowKeys="getSelectedRowKeys"
            @select="select"
            >
            <!-- 顶部按钮 -->
            <template v-slot:topOptionButton>
                <a-button type="primary" style="margin-right: 10px">新增</a-button>
            </template>
            <!-- 顶部筛选 -->
            <template slot="filter">
                <a-input placeholder="请输入名称" style="width: 120px;margin-right: 10px;"></a-input>
                <a-input placeholder="请输入年龄" style="width: 120px;"></a-input>
            </template>
            <!-- 表格操作 -->
            <template v-slot:tableOpreation="itemProps">
                <a @click="editRecord(itemProps.record)">编辑</a>
                <a-popconfirm title="确定删除?" ok-text="是" cancel-text="否" @confirm="() => deleteRecord(itemProps.record.id)">
                    <a class="deleText">删除</a>
                </a-popconfirm>
            </template>
        </table-page>
    </div>
</template>

<script>
import TablePage from '@/components/TablePage.vue'

const columns = [
    {
        title: "序号",
        scopedSlots: { customRender: "xuHao" },
        key:"xuHao",
        width: 80,
        fixed: 'left',
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '学历',
        dataIndex: 'education',
        key: 'education',
    },
    {
        title: '职业',
        dataIndex: 'occupation',
        key: 'occupation',
    },
    {
        title: '职业1',
        dataIndex: 'occupation1',
        key: 'occupation1',
    },
    {
        title: '职业2',
        dataIndex: 'occupation2',
        key: 'occupation2',
    },
    {
        title: '职业3',
        dataIndex: 'occupation3',
        key: 'occupation3',
    },
    {
        slots: { title: 'actionTitle'},
        key: 'action',
        scopedSlots: { customRender: 'action' },
        width: 100,
        fixed: 'right',
    },
]

export default{
    data(){
        return {
            tableData: [],
            tableTotal: 0,
            treeData: [],
            columns,
            selectedRowKeys: [],
            pageParams: {
                pageNo: 1,
                pageSize: 10
            }
        }
    },
    components:{
        TablePage
    },
    methods:{
        // 获取表格数据
        getTableData(params){
            if(params){
                this.pageParams.pageNo = params.pageNo
            }
            this.tableData = [
                {
                    id: 1,
                    name: '一',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                },
                {
                    id: 2,
                    name: '二',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                },
                {
                    id: 3,
                    name: '三',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                },
                {
                    id: 4,
                    name: '一',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                },
                {
                    id: 5,
                    name: '二',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                },
                {
                    id: 6,
                    name: '三',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                },
                {
                    id: 7,
                    name: '一',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                },
                {
                    id: 8,
                    name: '二',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                },
                {
                    id: 9,
                    name: '三',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                },
                {
                    id: 10,
                    name: '一',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                },
                {
                    id: 11,
                    name: '二',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                },
                {
                    id: 12,
                    name: '三',
                    age: 12,
                    phone: '12238746545',
                    education: '本科',
                    occupation: '学生'
                }
            ]
            this.tableTotal = this.tableData.length
        },
        // 获取树数据
        getTreeData(params){
            if(params){
                console.log("树搜索：",params)
            }
            this.treeData = [
                {
                    title: 'parent 1',
                    key: '0-0',
                    children: [
                        {
                            title: 'parent 1-0',
                            key: '0-0-0',
                            disabled: true,
                            children: [
                                {
                                    title: 'leaf1',
                                    key: '0-0-0-0',
                                    disableCheckbox: true,
                                },
                                {
                                    title: 'leaf2',
                                    key: '0-0-0-1',
                                },
                            ],
                        },
                        {
                            title: 'parent 1-1',
                            key: '0-0-1',
                            children: [
                                {
                                    title: 'leaf3',
                                    key: '0-0-1-0',
                                    disableCheckbox: true,
                                },
                                {
                                    title: 'leaf4',
                                    key: '0-0-1-1',
                                },
                            ],
                        },
                    ],
                },
            ]
        },
        // 表格选中项
        getSelectedRowKeys(selectedRowKeys){
            console.log("表格选中： ",selectedRowKeys)
        },
        // 编辑操作
        editRecord(record){
            console.log("编辑的表数据：",record)
        },
        // 删除操作
        deleteRecord(id){
            console.log("删除id为：",id,"的数据")
        },
        // 选择的树节点
        select(key){
            console.log("选择的树节点key：",key[0])
        }
    }
}
</script>
<style>
body{
    background-color: rgb(207, 212, 212,0.42);
}
 #page{
    width: 100%;
    height: 100%;

 }

.ant-layout-sider{
    padding: 10px;
}
.deleText{
    color: red;
}
</style>