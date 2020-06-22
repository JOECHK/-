<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1. 导入 echarts
import echarts from 'echarts'

export default {
  data () {
    return {
      // 需要合并的数据
      option: {
        title: {
          text: '数据实例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
    }
  },
  created () {},
  // 此时，页面上的元素，已经被渲染完毕了！
  async mounted () {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    let res = await this.axios.get('reports/type/1')
    console.log(res)

    //   // if (res.meta.status === 200) {
    //   //   this.$message.success('获取折线图数据失败！')
    //     // 4. 准备数据和配置项

    //     // 5. 展示数据
    myChart.setOption(this.option)
  //   }
  },
  methods: {}
}
</script>

<style  scoped>
</style>
