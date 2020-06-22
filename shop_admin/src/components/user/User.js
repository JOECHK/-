
export default {
  data () {
    return {
      // 用户列表
      usersData: [
        {
          username: '马春春',
          email: 'chun@.com',
          mobile: '123123131'
        },
        {
          username: '马春春2号',
          email: 'chun@.com',
          mobile: '123123131'
        }
      ],
      // 当前页码
      pagenum: 1,
      total: 0,
      queryText: '',
      state: true,
      // 是否显示用户对话框
      dialogFormVisible: false,

      // 添加用户表单对象
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 是否显示编辑用户对话框
      dialogEditUserFormVisible: false,
      // 添加编辑用户对象
      EditUserFrom: {
        id: '',
        username: 'JOECHK',
        email: '',
        mobile: ''
      },
      // 添加用户校验规则
      rules: {
        // 用户名
        username: [
          // 判断是否有输入内容
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // 判断 格式是否正确
          {
            min: 3,
            max: 10,
            message: '输入内容应该在 3-10 之间',
            trigger: 'blur'
          }
        ],
        // 用户名
        password: [
          // 判断是否有输入内容
          { required: true, message: '请输入密码', trigger: 'blur' },
          // 判断 格式是否正确
          {
            min: 5,
            max: 10,
            message: '输入密码内容应该在 5-10 之间',
            trigger: 'blur'
          }
        ],
        // 邮箱
        email: [
          {
            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
            message: '格式不正确',
            trigger: 'blur'
          }
        ],
        // 手机
        mobile: [
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: '格式不正确',
            trigger: 'blur'
          }
        ]
      },
      valid: '',
      // 是否显示分配角色对话框
      dialogAssignRoleVisible: false,
      // 分配角色表单对象
      assignRoleForm: {
        username: '',
        id: 0,
        rid: ''
      },
      // 角色列表
      rolesData: []

    }
  },
  created () {
    this.loadRolesData()
    // 获取路由参数(页码)
    const page = this.$route.params.page
    // console.log(page)
    // 请求第几页的数据
    this.loadUserData(page)
  },
  methods: {
    // 因为 pagenum query 的值不是写死的，所以需要后续传参决定
    loadUserData (pagenum = 1, query = '') {
      this.axios
        .get('http://localhost:8888/api/private/v1/users', {
          params: {
            query,
            pagenum,
            pagesize: 2
          }
        })
        .then(res => {
          // console.log(res)  会显示无效的token 401 => 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
          // console.log(res)
          // console.log(res.data.data.users)
          // 把后台给我们的数据给上面的usersData
          this.usersData = res.data.data.users
          // 获取总个数
          this.total = res.data.data.total
          // 获取当前页码
          this.pagenum = res.data.data.pagenum
        })
    },
    // 点击页码
    currentChange (curPage) {
      // console.log('点击了页码' + e)
      // 点击第几页把页码传过去 e就是页码
      // this.queryText 如果this.queryText 有值那么就查询this.queryText的第几页 如果值为空就是查询全部数据的第几页
      this.loadUserData((this.pagenum = curPage), this.queryText)

      // 改变路径
      this.$router.push('/users/' + curPage)
    },
    // 查询
    startQuery () {
      // 拿到值
      console.log(this.queryText)
      // 把查询到的query传过去
      this.loadUserData(1, this.queryText)
    },
    // 添加用户
    addUser (addUserForm) {
      // 校验格式

      this.$refs[addUserForm].validate(async valid => {
        if (!valid) return
        let res = await this.axios.post('users', this.addUserForm)
        if (res.data.meta.status === 201) {
        // 1. 关闭对话框
          this.dialogFormVisible = false
          // 2.刷新页面
          this.loadUserData()
          // 3. 添加用户成功提示
          this.$message({
            message: '添加用户成功',
            type: 'success',
            duration: 800
          })
          // 4. 重置表单
          this.$refs.addUserForm.resetFields()
        } else {
          this.$message.error('格式不正确 或用户名已存在')
        }
      })
    },
    // 监听对话框关闭
    dialogClosed () {
      // console.log('对话框关闭了')
      this.$refs.addUserForm.resetFields()
    },
    // 删除用户
    async delUser (id) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        // 发送请求删除用户
        // axios.delete(url,config)
        let res = await this.axios.delete(`http://localhost:8888/api/private/v1/users/${id}`)

        console.log(res)
        if (res.data.meta.status === 200) {
          // 1. 刷新页面
          this.loadUserData()
          // 2. 提示
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 800
          })
        }
      } catch (error) {
        this.$message({
          message: '取消删除',
          type: 'info',
          duration: 800
        })
      }
    },
    // 修改状态
    async changeState (row) {
      console.log(row)
      // 把修改的数据发送给后台 拿到id 和 mg_state
      const { id, mg_state: mgState } = row
      let res = await this.axios.put(`http://localhost:8888/api/private/v1/users/${id}/state/${mgState}`)
      console.log(res)
      if (res.data.meta.state === 200) {
        // 1.提示信息
        this.$message({
          message: '修改状态成功',
          type: 'success',
          duration: 800
        })
        // 2. 刷新当前页面 this.pagenum 当前页面
        this.loadUserData(this.pagenum)
      }
    },
    // 显示编辑用户对话框
    ShowEditUser (row) {
      this.dialogEditUserFormVisible = true
      console.log(row)
      const {username, id, mobile, email} = row
      this.EditUserFrom.username = username
      this.EditUserFrom.mobile = mobile
      this.EditUserFrom.email = email
      this.EditUserFrom.id = id
    },
    // 编辑用户
    async  editUser () {
      const {id, mobile, email} = this.EditUserFrom
      // 发送请求
      let res = await this.axios.put(`users/${id}`,
        {
          email,
          mobile
        }
      )
      console.log(res)
      if (res.data.meta.status === 200) {
        // 关闭对话框
        this.dialogEditUserFormVisible = false
        // 提示
        this.$message({
          message: '更新成功',
          type: 'success',
          duration: 800
        })
        // 自动刷新
        this.loadUserData()
      }
    },
    // 获取所有的角色列表
    async loadRolesData () {
      let res = await this.axios.get('roles')
      // console.log(res)
      this.rolesData = res.data.data
    },
    // 显示分配角色对话框
    async showAssignRoleDialog (row) {
      this.dialogAssignRoleVisible = true

      // 1. 获取 对象里 需要三个参数 id username rid
      const { id, username } = row
      // rid 在row中没有,但是留了一个接口, 可以使用id 去请求获取
      // 根据 ID 查询用户信息
      let res = await this.axios.get(`users/${id}`)
      console.log(res)
      // 2. 把三个参数 赋值 给 assignRoleForm对象
      this.assignRoleForm.id = id
      this.assignRoleForm.username = username
      this.assignRoleForm.rid = res.data.data.rid === -1 ? '' : res.data.data.rid
    },
    // 分配角色
    async assignRole () {
      // 1. 获取需要的参数
      let { id, rid } = this.assignRoleForm

      // 2. 请求
      let res = await this.axios.put(`users/${id}/role`, {
        rid
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        // 1. 关闭对话框
        this.dialogAssignRoleVisible = false
        // 2. 提示
        this.$message({
          message: '分配角色成功',
          type: 'success',
          duration: 800
        })

        // 3.刷新
        this.loadUserData(this.pagenum)
      }
    }

  }
}
