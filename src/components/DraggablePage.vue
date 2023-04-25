<template>
    <div class="page">
        <div class="content">
            <div class="left-content">
                <div class="content-top">
                    <div class="content-top-title">拖拽表格</div>
                </div>
                <div class="draggable" style="padding: 20px">
                    <el-table :data="realData" row-key="id" class="table" height="calc(100vh - 227)">
                            <el-table-column label="操作" align="center" width="60">
                                <template slot-scope="scope">
                                    <i class="el-icon-s-operation can-click move"></i>
                                </template>
                            </el-table-column>
                            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                            <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span :class="{ dragItem: scope.row.isDrag }">{{ scope.row.title }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="count" label="搜索量" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.count }}次</template>
                            </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="right-content">
                <div class="content-top">
                    <div class="content-top-title">展示列表</div>
                    <div class="content-top-button">
                        <el-button type="primary" plain @click="openAddWordDialog">
                            <i class="el-icon-plus"></i>
                            新增
                        </el-button>
                        <el-button type="primary" plain @click="updateRealToShow">同步表格内容</el-button>
                        <el-button type="primary" plain @click="openShowCountDialog">设置展示数量</el-button>
                    </div>
                </div>
                <ul class="show-content" id="bottomShowData">
                    <draggable v-model="showTopData" handle=".move1" :move="showDataMove" @end="showDataEnd" @add="showTopDataAdd" :group="showDataGroup">
                        <li v-for="(item,index) in showTopData" :key="item.id" class="show-content-li">
                            <div style="margin-right: 5px;">{{ index+1 }}</div>
                            <div class="content-li-item" style="width: 60%;">{{ item.title }}</div>
                            <div class="content-li-item" style="width: 20%;">{{ item.count }}次</div>
                            <div class="content-li-button">
                                <a v-if="item.isTop" class="can-click" @click="cancleTop(item,index,'top')">取消置顶</a>
                                <a v-else style="width: 56px;text-align: center;" class="can-click" @click="toTop(index,item,'top')">置顶</a>
                                <a>
                                    <i class="el-icon-s-operation can-click move1"></i>
                                </a>
                                <a>
                                    <i class="el-icon-delete can-click" @click="deleteRecord(item,index,'top')"></i>
                                </a>
                            </div>
                        </li>
                    </draggable>
                    <li>
                        <div style="text-align: center;display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;">
                            <div style="width: 33%;height: 1px;border-bottom: 1px dashed rgb(0 0 0 / 46%);"></div>
                            <span style="font-size: 12px;color: rgb(0 0 0 / 46%);width: 33%;text-align: center;">超出设置展示数量 ，以下内容无效</span>
                            <div style="width: 33%;height: 1px;border-bottom: 1px dashed rgb(0 0 0 / 46%);"></div>
                        </div>
                    </li>
                    <draggable v-model="showBottomData" handle=".move2" :group="showDataBottomGroup" :move="showDataMove" @end="showDataEnd" @add="showBottomDataAdd">
                    <li v-for="(item,index) in showBottomData" :key="item.id" class="item show-content-li show-content-li-hidden">
                        <div style="margin-right: 5px;">{{ showNumber+index+1 }}</div>
                        <div class="content-li-item" style="width: 60%;">{{ item.title }}</div>
                        <div class="content-li-item" style="width: 20%;">{{ item.count }}次</div>
                        <div class="content-li-button">
                            <a v-if="item.isTop" class="can-click" @click="cancleTop(item,index,'bottom')">取消置顶</a>
                            <a v-else style="width: 56px;text-align: center;" class="can-click" @click="toTop(index,item,'bottom')">置顶</a>
                            <a>
                                <i class="el-icon-s-operation can-click move2"></i>
                            </a>
                            <a>
                                <i class="el-icon-delete can-click" @click="deleteRecord(item,index,'bottom')"></i>
                            </a>
                        </div>
                    </li>
                    </draggable>
                </ul>
            </div>
        </div>

        <!-- 设置展示数量弹窗 -->
        <el-dialog :visible="showCountVisiable" title="设置展示数量" width="20%" @close="closeShowCountDialog">
            <el-input-number v-model="choseShowNumber" controls-position="right" :min="1" style="width: 80%"></el-input-number>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="btnDefault" @click="closeShowCountDialog">取消</el-button>
                    <el-button type="primary" @click="saveShowCount">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 新增内容弹窗 -->
        <el-dialog :visible="addWordVisiable" title="新增内容" width="20%" @close="closeAddWordDialog">
            <el-input v-model="addWord" style="width: 90%" placeholder="请输入内容标题"></el-input>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="btnDefault" @click="closeAddWordDialog">取消</el-button>
                    <el-button type="primary" @click="submitAddWord">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import Sortable from 'sortablejs';

    export default {
        components: {
            draggable
        },
        data(){
            return {
                realData: [
                    {
                        id: '1',
                        title: '内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1',
                        count: 10,
                        isTop: false,
                        isDrag: true
                    },
                    {
                        id: '2',
                        title: '内容222222222222222222222222222222221',
                        count: 20,
                        isTop: false,
                        isDrag: true
                    },
                    {
                        id: '3',
                        title: '内容33333333333333333333333333333333333',
                        count: 12,
                        isTop: false,
                        isDrag: false
                    },
                    {
                        id: '4',
                        title: '内容44444444444444444444444444444',
                        count: 33,
                        isTop: false,
                        isDrag: false
                    },
                    {
                        id: '5',
                        title: '内容5555555555555555555555',
                        count: 22,
                        isTop: false,
                        isDrag: false
                    },
                    {
                        id: '6',
                        title: '内容666666666666666666666666666666666666',
                        count: 11,
                        isTop: false,
                        isDrag: false
                    },
                    {
                        id: '7',
                        title: '内容77777777777777777777777777777',
                        count: 15,
                        isTop: false,
                        isDrag: false
                    },
                    {
                        id: '8',
                        title: '内容888888888888888888888888888888888',
                        count: 45,
                        isTop: false,
                        isDrag: false
                    },
                    {
                        id: '9',
                        title: '内容99999999999999999999999999999999999',
                        count: 42,
                        isTop: false,
                        isDrag: false
                    },
                    {
                        id: '10',
                        title: '内容000000000000000000000000',
                        count: 55,
                        isTop: false,
                        isDrag: false
                    },
                ],
                showData:[
                    {
                        id: '1',
                        title: '内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1',
                        count: 10,
                        sort: 1,
                        isTop: false,
                        isDrag: true
                    },
                    {
                        id: '2',
                        title: '内容222222222222222222222222222222221',
                        count: 20,
                        sort: 2,
                        isTop: false,
                        isDrag: true
                    },
                ],
                // 展示数量
                showNumber: 1,
                // 选择的展示数量
                choseShowNumber: null,
                showCountVisiable: false,
                showDataGroup:{
                    name: 'showDataDrag',
                    // 拖出状态
                    pull: true,
                    // 拖入状态
                    put: true,
                    // 容器有滚动条时是否允许拖动到被隐藏的区域
                    scroll: true
                },
                showDataBottomGroup:{
                    name: 'showDataBottomGroup',
                    pull: true,
                    put: true,
                    scroll: true
                },
                showTopData:[],
                showBottomData:[],
                leftChoseItem: {},
                addWordVisiable: false,
                addWord: '',
            }
        },
        mounted(){
            this.rowDrop()
            this.getShowTwoData()
        },
        methods:{
            // 表格拖拽
            rowDrop() {
                // 此时找到的元素是要拖拽元素的父容器
                const tbody = document.querySelector('.draggable .el-table__body-wrapper tbody');
                const _this = this
                this.sortable = Sortable.create(tbody, {
                    //  指定父元素下可被拖拽的子元素
                    draggable: ".draggable .el-table__row",
                    filter: '.dragItemDom',
                    handle: '.move',
                    // 禁止在当前表格排序
                    sort: false,
                    disabled: false,
                    group:{
                        name: 'realListDrag',
                        pull: 'clone',
                        put: false,
                        scroll: true,
                    },
                    onChoose(e){
                        _this.leftChoseItem = _this.realData[e.oldIndex]
                    },
                    onMove(){
                        // 如果已经被拖拽过则不能重复拖拽
                        if(_this.leftChoseItem.isDrag){
                            return false
                        }
                    }
                });
            },
            // 获取右侧两个展示数组
            getShowTwoData(){
                if(this.showData.length > 0){
                    this.showTopData = this.showData.slice(0,this.showNumber)
                    this.showBottomData = this.showData.slice(this.showNumber,this.showData.length)
                }else{
                    this.showTopData = []
                    this.showBottomData = []
                }
            },
            // 打开设置展示数量弹窗
            openShowCountDialog(){
                this.showCountVisiable = true
                this.choseShowNumber = this.showNumber
            },
            // 关闭设置展示数量弹窗
            closeShowCountDialog(){
                this.showCountVisiable = false
                this.choseShowNumber = this.showNumber
            },
            // 更新真实数据
            updateRealToShow(){
                this.showData = []
                this.realData.forEach((item,index) => {
                    item.isTop = false
                    if(index < this.showNumber){
                        item.isDrag = true
                        this.showData.push(item)
                    }else{
                        item.isDrag = false
                    }
                })
                this.updateSort()
                this.getShowTwoData()
            },
            // 取消置顶
            cancleTop(item,index,str){
                if(str == 'bottom'){
                    index = index + this.showNumber
                }
                this.showData[index].isTop = false
                this.showData.splice(index,1)

                var newIndex = null
                var arr = this.showData.slice(0)
                // 查找新位置
                for(var i = 0;i <= this.showData.length;i++){
                    if(i < this.showData.length){
                        // 从置顶元素之后查找
                        if(item.count <= this.showData[i].count && !this.showData[i].isTop){
                            newIndex = i
                            arr.splice(newIndex,0,item)
                            break
                        }
                    }else{
                        // 当前元素最大或其余元素都置顶
                        arr.push(item)
                    }
                }
                this.showData = arr
                this.updateSort()
                this.getShowTwoData()
            },
            // 置顶
            toTop(index,item,str){
                if(str == 'bottom'){
                    index = index + this.showNumber
                }
                this.showData[index].isTop = true
                this.showData.splice(index,1)
                this.showData.splice(0,0,item)
                this.updateSort()
                this.getShowTwoData()
            },
            // 更新sort
            updateSort(){
                this.showData.forEach((item,index) => {
                    item.sort = index+1
                })
            },
            // 删除
            deleteRecord(item,index,string){
                if(string == 'bottom'){
                    index = index + this.showNumber
                }
                if(item.isTop){
                    this.topCount--
                }
                this.showData.splice(index,1)
                this.updateSort()
                this.getShowTwoData()

                // 匹配左侧操作
                var leftIndex = null
                for(var i = 0;i < this.realData.length;i++){
                    if(this.realData[i].id == item.id){
                        leftIndex = i
                        break
                    }
                }
                if(leftIndex != null){
                    var obj = this.realData[leftIndex]
                    obj.isDrag = false
                    this.refreshLeftRealState(i,obj,false)
                }
            },
            // 右侧列表上下拖动结束触发
            showDataEnd(){
                // 更新展示数组
                this.showData = this.showTopData.concat(this.showBottomData)
                this.updateSort()
                this.getShowTwoData()
            },
            // 右侧页面显示数据部分接收到拖动的新数组触发
            showTopDataAdd(e){
                // 获取拖拽过来的元素
                var rightElement = document.getElementById('bottomShowData').childNodes[0]
                var addElement = rightElement.getElementsByClassName('el-table__row')[0]
                // 只有从左边拖拽过来的才需要在展示数组增加
                if(addElement){
                    rightElement.removeChild(addElement)
                    // 向展示数组添加拖拽过来的新元素
                    var addShowDataObj = {
                        id: this.realData[e.oldIndex].id,
                        // 热门内容
                        title: this.realData[e.oldIndex].title,
                        // 浏览量
                        count: this.realData[e.oldIndex].count,
                        isDrag: true,
                        isTop: false
                    }
                    
                    var newIndex = e.newIndex
                    this.showData.forEach((item,index) => {
                        if(index >= newIndex && item.isTop){
                            newIndex++
                        }
                    })
                    this.showData.splice(newIndex, 0, addShowDataObj)
                    this.updateSort()
                    this.getShowTwoData()

                    this.refreshLeftRealState(e.oldIndex,addShowDataObj,true)
                }
            },
            // 右侧页面不显示数据部分接收到拖动的新数组触发
            showBottomDataAdd(e){
                // 删除拖拽过来的元素
                var rightElement = document.getElementById('bottomShowData').childNodes[2]
                var addElement = rightElement.getElementsByClassName('el-table__row')[0]
                // 只有从左边拖拽过来的才需要在展示数组增加
                if(addElement){
                    rightElement.removeChild(addElement)
                    // 向展示数组添加拖拽过来的新元素
                    var addShowDataObj = {
                        id: this.realData[e.oldIndex].id,
                        // 热门内容
                        title: this.realData[e.oldIndex].title,
                        // 浏览量
                        count: this.realData[e.oldIndex].count,
                        isDrag: true,
                        isTop: false
                    }

                    var newIndex = e.newIndex
                    this.showData.forEach((item,index) => {
                        if(index >= newIndex && item.isTop){
                            newIndex++
                        }
                    })
                    this.showData.splice(newIndex+this.showNumber, 0, addShowDataObj)
                    this.updateSort()
                    this.getShowTwoData()

                    this.refreshLeftRealState(e.oldIndex,addShowDataObj,true)
                }
            },
            // 数据移动
            showDataMove(e){
                var oldIndex = e.draggedContext.element.sort-1
                if(e.relatedContext.element){
                    var newIndex = e.relatedContext.element.sort-1
                    var flag = this.adjustPlace(oldIndex,newIndex)
                    return flag
                }
                return false
            },
            // 判断新位置是否可以放置
            adjustPlace(oldIndex,newIndex){
                if(this.showData[oldIndex].isTop){
                    // 拖动的元素是置顶的并且放置位置是不置顶的，则不能放置
                    if(!this.showData[newIndex].isTop){
                        return false
                    }
                }else{
                    // 拖动的元素是不置顶的并且放置位置是置顶的，则不能放置
                    if(this.showData[newIndex].isTop){
                        return false
                    }
                }
                return true
            },
            // 修改左侧拖动元素的状态
            refreshLeftRealState(index,obj,isDelete){
                this.realData.splice(index, 1)
                this.realData.splice(index, 0, obj);
                var arr = this.realData.slice(0)
                this.realData = []
                this.$nextTick(function () {
                    this.realData = arr
                    if(isDelete){
                        var tbody = document.querySelector('.draggable .el-table__body-wrapper tbody')
                        var firstDom = tbody.getElementsByTagName("tr")[0]
                        tbody.removeChild(firstDom)
                    }

                });
            },
            // 打开新增热词弹窗
            openAddWordDialog(){
                this.addWordVisiable = true
            },
            // 关闭新增热词弹窗
            closeAddWordDialog(){
                this.addWordVisiable = false
                this.addWord = ''
            },
            // 提交新增热词
            submitAddWord(){
                var newRecord = {
                    title: this.addWord,
                    count: 0,
                    sort: this.showData.length+1,
                    isDrag: true,
                    isTop: false
                }
                var sameArr = this.showData.filter(item => item.title == newRecord.title)
                if(sameArr.length > 0){
                    this.$message.error("标题已存在")
                }else{
                    this.showData.push(newRecord)
                    this.getShowTwoData()
                    this.$message.success("新增成功")
                    this.closeAddWordDialog()
                }
            },
            // 左侧数据状态与右侧同步
            updateRealDataState(){
                this.realData.forEach(realItem => {
                    this.showData.forEach(showItem => {
                        if(realItem.id == showItem.id){
                            realItem.isDrag = true
                        }
                    })
                })
            },
            // 保存设置的展示数量
            saveShowCount(){
                this.$message.success("设置成功")
                this.showNumber = this.choseShowNumber
                this.showCountVisiable = false
                this.choseShowNumber = null
                this.getShowTwoData() 
            },
        }
    }
</script>

<style lang="scss" scoped>
.page{
    margin: 0;
    padding: 20px;
    height: 100%;
}
ul{
    list-style: none;
}
a{
    text-decoration: none;
    color: #409eff;
}
.content{
    display: flex;
    justify-content: space-between;
}

.left-content,.right-content{
    width: 49.5%;
    /* border: 1px solid #000000; */
    border-radius: 10px;
    // height: 500px;
    box-shadow: 0px 0px 5px #00000042;
    padding: 20px;
}

.content-top{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.content-top-title{
    font-size: 20px;
    font-weight: bold;
}
.content-top-button{
    display: flex;
    width: 60%;
    justify-content: end;
    align-items: center;
}
.left-content{
    background-color: rgba(244, 244, 244, 1);
}

.right-content{
    background-color: rgba(221, 237, 255, 1);
}

.page-bottom{
    text-align: center;
    padding: 20px;
}

.dragItem{
    color:#ff911d;
}

.table{
    height: calc(100vh - 227px);
    overflow-y: auto;
}

.show-content{
    margin-top: 15px;
    height: calc(100vh - 227px);
    overflow-y: auto;
    .show-content-li{
        padding: 15px;
        background-color: #ffffff;
        border-radius: 10px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        .content-li-item{
            margin-right: 20px;
            display: inline-block;
            overflow-x: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .content-li-button{
            width: 15%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
    .show-content-li-hidden{
        background-color: #e1e1e1;
    }
}
.can-click{
    cursor: pointer;
}
</style>