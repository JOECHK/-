<template>
  <el-container>
  <el-header>
    <el-row>
      <el-col :span="8" class="col_l">
        <img src="../../assets/images/2.jpg" alt="">
      </el-col>
      <el-col :span="8">
          <h1>优乐购后台管理系统</h1>
        </el-col>
        <el-col :span="8" class="col_r">
          <img src="../../assets/images/1.jpg" alt="">
          <!-- .prevent 阻止a标签的默认行为 -->
          <a @click.prevent="exit" href="#">退出</a>
        </el-col>
    </el-row>
  </el-header>
  <el-container>
  <el-aside width="200px">
    <!-- 侧栏 -->
    <!-- el-menu : 菜单组件 el-menu 有个属性 router 默认是'false', 开启 vue-router 路由模式 => true
    ------index 的值 作为 path 进行路由跳转
    el-submenu 菜单子组件 (可展开)
    el-menu-item 菜单元素 (最小单位)
    el-menu-item-group 分组
     -->
    <el-menu
      :router="true"
      :default-active="$route.path"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF">
      <!-- 用户管理 -->
      <el-submenu
      :index="item.id+''"
       v-for="item in menus"
      :key="item.id">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{ item.authName }}</span>
          <!-- 菜单元素 -->
        </template>
          <el-menu-item
           v-for="item1 in item.children"
           :key='item1.id'
           :index="'/'+ item1.path">
           <template slot="title">
             <!-- 图标 -->
             <i class="el-icon-menu"></i>
             <!-- 文本 -->
           <span>{{item1.authName}}</span>
           </template>

           </el-menu-item>
      </el-submenu>

    </el-menu>
  </el-aside>
    <el-main>
      <!-- 子组件的出口 -->
      <router-view></router-view>
    </el-main>
  </el-container>

</el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      }
    }
  },
  created () {
    this.loadMenusData()
  },
  methods: {
    exit () {
      // 确认框
      this.$confirm('此操作退出账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // 点确定时走=>then
      })
        .then(() => {
          console.log('点击了 then')
          // 1.清除token
          localStorage.removeItem('token')
          // 2.提示消息
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 3.跳转到login
          this.$router.push('/login')
        })
        // 点取消时=> catch
        .catch(() => {
          console.log('点击了 catch')
          this.$message({
            type: 'info',
            message: '已取消删除',
            // 持续时长
            duration: 800
          })
        })
    },
    // 加载菜单
    async loadMenusData () {
      let res = await this.axios.get('menus')
      console.log(res)
      this.menus = res.data.data
    }
  }
}

</script>
<style scoped>
/* 外部容器 */
.el-container {
  height: 100%;
  min-width: 900px;
}

/* 头部 */
.el-header {
  background:  #373d41;
  padding: 0;
}
.col_l img {
  width: 200px;
  height: 60px;
}

h1 {
  color: #fff;
  text-align: center;
  line-height: 60px;
  font-size: 26px;
}
.col_r {
  text-align: right;
  line-height: 60px;
  padding-right: 30px;
}
.col_r img {
  width: 60px;
  height: 60px;
  vertical-align:top
}

.col_r a {
  color: rgb(165, 190, 165);
  text-decoration: none;
}

/* 侧栏 */
.el-aside {
  background: #545c64;
}
.el-aside .el-menu {
border-right: none;
}

/* 主体 */
.el-main {
  background: #eaeef1;
}
</style>
