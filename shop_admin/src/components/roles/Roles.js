/* eslint-disable */
export default {
  data() {
    return {
      // 角色列表数据
      rolesData:[{
        roleName : "主管",
        roleDesc : "技术负责人"
      }],
      // 默认显示对话框
      dialogAssignRightsVisible : false,
      // 对话框 树的数据
      treeData: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        // children 负责显示结构
        children: 'children',
        // label : 负责显示标题
        label: 'authName'
      },
      // 角色id
      roleId : ''
    }
  },
  created() {
    this.LoadRolesData()
    this.LoadAllRightsData()
  },
  methods: {
    async LoadRolesData(){
      let res = await this.axios.get('roles')
      // console.log(res);
      this.rolesData = res.data.data
    },
    // 处理索引
    indexMethod(index){
      return index
    },
    //  获取所有权限数据
    async LoadAllRightsData(){
      let res = await this.axios.get('rights/tree')
      this.treeData = res.data.data
    },
    // 请求全部权限
    async showAssignRightsDialog(row){
      // 1. 显示对话框
       this.dialogAssignRightsVisible = true
       // 2. 获取当前角色权限信息 需要两个参数 role.id(角色的id) rids (权限的id)
       // 保存当前角色的ID
       this.roleId = row.id
       // row 里面的第三层children 的id 为权限的id --> 遍历
       let key = []
       row.children.forEach(item1 => {
         item1.children.forEach(item2 => {
           item2.children.forEach(item3 => {
            //  console.log(item3.id);
            key.push(item3.id)
           })
         })
       })
       // 3. 设置 key tree控件有一个方法 setCheckedNodes 设置目前勾选的节点，使用此方法必须设置 node-key 属性
       /* 3.1 拿到tree 注册ref */
      //  console.log(this.$refs.tree) 直接这样写拿到的是undefind
      // 原因： 因为异步DOM更新 打印早了
      // 等 DOM 更新完毕再获取
      // nextTick
      this.$nextTick(() =>{
        // console.log(this.$refs.tree)
        this.$refs.tree.setCheckedKeys(key)
       })

    },
    // 分配权限
    async assignRights(){
     /* 1. 拿到半选和选中的key
     2. getHalfCheckedNodes	若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组
     3.getCheckedKeys	若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组*/
     // 拿到半选的key
     let keys1 = this.$refs.tree.getHalfCheckedKeys()
     // 拿到选中的key
     let keys2 = this.$refs.tree.getCheckedKeys()
    //  console.log(keys2);
    /* 把 keys1 keys2 和并成一个新的数组 用于传参 */
    let keys = keys1.concat(keys2)
    // console.log(keys);
      /* 两个参数 1. 角色id this.roleId 2. 权限id列表 以“，” 分割的字符串 */
      // 切割成字符串
      let rids = keys.join(",")
      console.log(rids);

      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        //     // 要的是,分割的字符串
             rids,
           })
     if (res.data.meta.status === 200) {
      // 1. 关闭对话框
      this.dialogAssignRightsVisible = false
      // 2. 提示消息
      this.$message({
        message: '分配权限成功',
        type: 'success',
        duration: 800
      })
      // 3. 刷新
      this.LoadRolesData()
    }
    },
     // 根据Id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将移除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }

      const { data: res } = await this.axios.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status == 200) {
        this.$message({
          message : "移除成功",
          type : 'success',
          duration : 800,
        })
      }

      // this.getRolesList()
      role.children = res.data
    },
  },
};
