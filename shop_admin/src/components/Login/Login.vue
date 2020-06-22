<template>
  <!-- :model="ruleForm"  ruleForm 和表单里绑定的数据
    :rules="rules" 校验规则
    ref="ruleForm" 可以通过 refs 获取
  -->
  <!-- layout布局  参见element官网  通过 row 和 col 组件，并通过 col 组件的 span 属性我们就可以自由地组合布局。 -->
  <!-- type布局模式，可选 flex，现代浏览器下有效
  justify:flex 布局下的水平排列方式
  align:flex 布局下的垂直排列方式 -->
  <!--align="middle" 需要给html,body,app,el-row设置高为100%  -->
  <el-row type="flex" justify="center" align="middle">
    <el-col :span="8"
      ><el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input prefix-icon="el-icon-user" v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input
            prefix-icon="el-icon-lock"
            v-model="ruleForm.password"
            type='password'>
          </el-input>
        </el-form-item>
        <el-form-item>
          <!-- 使用type、plain、round和circle属性来定义 Button 的样式。 -->
          <el-button type="success" @click="submitForm('ruleForm')"
            >登陆</el-button
          >
          <el-button type="warning" @click="resetForm('ruleForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
/* eslint-disable */

import axios from "axios";

export default {
  data() {
    return {
      ruleForm: {
        // 初始值
        username: "admin",
        password: "123456"
      },
      rules: {
        // 判断用户名是否输入
        // required: true  必填项
        // trigger: "blur" 失去焦点时触发
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 5, max: 12, message: "长度在 5 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 开始登陆 formName 为传过来的参数ruleForm
    submitForm(formName) {
      // validate 对表单进行校验
      this.$refs[formName].validate(valid => {
        //valid 当校验通过时返回true
        if (!valid) {
          return alert("格式不正确");
        }
        // 发送登陆请求
        axios
          .post("http://localhost:8888/api/private/v1/login", this.ruleForm)
          .then(res => {
            console.log(res);
            if (res.data.meta.status === 200) {
              // 如果登陆成功，后台会返回一个token 令牌
              // console.log(res);

              localStorage.setItem('token',res.data.data.token)
              this.$message({
                message:"恭喜，登陆成功",
                type : 'success',
                //时长
                duration : 800,
              })
              //登陆成功，跳转到home页
              this.$router.push('/home')

            } else {
              let msg = res.data.meta.msg
              this.$message({
                message:msg,
                type:'error',
                duration : 800,
              })
            }
          });
      });
    },
    // 重置操作 resetFields	对整个表单进行重置，将所有字段值重置为"初始值" 并移除校验结果
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped>

.el-row {
  height: 100%;
  background-color: #2d434c;
}
.el-col {
  background: #fff;
  padding: 20px 30px;
  border-radius: 15px;
}
</style>
