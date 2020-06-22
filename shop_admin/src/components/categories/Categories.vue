
<template>
  <div>
    <el-button
      type='success'
      plain
      @click='showAddCatDialog'
    >添加分类</el-button>
    <el-table
      :data="catData"
      style="width: 100%"
    >
      <!--
      file-icon="icon icon-file"  文件
      folder-icon="icon icon-folder" 文件
   -->
      <el-table-tree-column
        tree-key='cat_id'
        parent-key='cat_pid'
        level-key='cat_level'
        :indent-size='20'
        prop="cat_name"
        label="分类名称"
        width="220"
      ></el-table-tree-column>

      <el-table-column
        label="是否有效"
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="层级"
      >
        <template slot-scope="scope">
          <span v-if='scope.row.cat_level == 0'>一级</span>
          <span v-else-if='scope.row.cat_level == 1'>二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 第一个对话框 : 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogAddCatFormVisible"
    >
      <el-form
        :model="addCatForm"
        label-width='80px'
      >
        <el-form-item label="分类名称">
          <el-input
            v-model="addCatForm.cat_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <!-- 级联选择器 -->
          <el-cascader
            v-model='addCatForm.cat_pid_arr'
            :options="options"
            clearable
            :props='defaultProps'
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogAddCatFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCat"
        >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
// var ElTreeGrid = require('element-tree-grid');
import ElTreeGrid from 'element-tree-grid'
Vue.component(ElTreeGrid.name, ElTreeGrid);

export default {
  data () {
    return {
      catData: [{
        cat_deleted: '是',
        cat_name: '王小虎',
        cat_level: '一级'
      }],
      // 是否显示对话框 :
      dialogAddCatFormVisible: false,
      // 添加分类表单对象
      addCatForm: {
        cat_pid_arr: [], // 父级id
        cat_name: '' // 分类名称
      },
      // 级联选择器的数据
      /**
       * children : 结构
       * label : 显示
       * value :收集数据
       */
      options: [{
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }],
      // 级联选择器 的配置对象
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  created () {
    this.loadCatData()
    this.loadCatData2()
  },
  methods: {
    // 获取全部
    async loadCatData () {
      let res = await this.axios.get('categories', {
        params: {
          query: '',
          pagenum: 1,
          pagesize: 4
        }
      })
      this.catData = res.data.data.result

    },
    // 获取一层和二层分类数据
    async loadCatData2 () {
      let res = await this.axios.get('categories', {
        params: {
          type: 2
        }
      })
      console.log(res);
      this.options = res.data.data

    },
    // 弹出对话框
    showAddCatDialog () {
      this.dialogAddCatFormVisible = true
    },
    // 添加分类
    async addCat () {
      //1. 获取已知信息
      const { cat_name, cat_pid_arr } = this.addCatForm

      //2.发送请求
      let res = await this.axios.post('categories', {
        cat_pid: cat_pid_arr[cat_pid_arr.length - 1],  // 父id 数组 的最后一个元素(id)
        cat_name,
        cat_level: cat_pid_arr.length   // 数组 的长度
      })
      console.log(res);
      if (res.data.meta.status === 201) {
        //1. 关闭对话框
        this.dialogAddCatFormVisible = false
        //2. 提示
        this.$message({
          message: '添加分类成功',
          type: 'success',
          duration: 800
        })
        //3. 刷新
        this.loadCatData()
      }

    }
  },
}
</script>

<style>
</style>
