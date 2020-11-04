<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20"
        ><el-col :span="7"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input></el-col
        ><el-col :span="4"
          ><el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        ></el-row
      ><el-table :data="userlist" border stripe
        ><el-table-column type="index" label="#"></el-table-column
        ><el-table-column label="姓名" prop="username"></el-table-column
        ><el-table-column label="邮箱" prop="email"></el-table-column
        ><el-table-column label="电话" prop="mobile"></el-table-column
        ><el-table-column label="权限类型" prop="role_name"></el-table-column
        ><el-table-column label="状态"
          ><template v-slot:default="aaa">
            <el-switch
              v-model="aaa.row.mg_state"
              @change="userStateChange(aaa.row)"
            >
            </el-switch></template></el-table-column
        ><el-table-column label="操作"
          ><template v-slot:default="bbb">
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
              ><el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(bbb.row.id)"
              ></el-button></el-tooltip
            ><el-tooltip
              effect="dark"
              content="分配"
              placement="top"
              :enterable="false"
              ><el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button
            ></el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(bbb.row.id)"
              ></el-button> </el-tooltip></template></el-table-column></el-table
      ><el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination
    ></el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input> </el-form-item
        ><el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input> </el-form-item
        ><el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input> </el-form-item
        ><el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="addFormrules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="editForm.username"
            disabled
          ></el-input> </el-form-item
        ><el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input> </el-form-item
        ><el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
    //验证邮箱的规则
    /*  var checkEmail = (rule,value,callback) => {
        const regEmail = /^([a-zA-Z0-9_-]+@)
    };
    //验证手机的规则
    var checkMobile = (rule,value,callback) => {}; */
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {},
      addFormrules: {
        username: [
          { required: true, message: "请输入用户名字", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确邮箱格式", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          //{ type: "number", message: "手机必须为数字值" },
        ],
      },
    };
  },
  methods: {
    //获取用户信息
    getUserList() {
      this.$axios({
        method: "get",
        url: "/users",
        params: this.queryInfo,
      })
        .then((res) => {
          console.log(res.data);
          this.userlist = res.data.data.users;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //最大页数显示改变
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.queryInfo.pagenum = 1;
      this.getUserList();
    },
    //当前用户页面页数改变
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    //用户状态改变
    userStateChange(newValue) {
      //console.log(newValue);
      this.$axios({
        method: "put",
        url: `users/${newValue.id}/state/${newValue.mg_state}`,
      })
        .then((res) => {
          //console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
          newValue.mg_state = !newValue.mg_state;
        });
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮，添加用户
    addUser() {
      this.$refs.addFormRef.validate((value) => {
        if (!value) return;
        this.$axios({
          method: "post",
          url: "/users",
          data: this.addForm,
        })
          .then((res) => {
            console.log(res.data);
            this.addDialogVisible = false;
          })
          .then(() => {
            this.getUserList();
          })
          .catch((err) => {
            console.log(err);
            this.addDialogVisible = false;
          });
      });
    },
    showEditDialog(id) {
      //console.log(id);
      this.$axios({
        method: "get",
        url: "/users/" + id,
      })
        .then((res) => {
          //console.log(res.data.data);
          this.editForm = res.data.data;
          //console.log(this.editForm);
        })
        .then(() => {
          this.editDialogVisible = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息
    editUser() {
      this.$refs.editFormRef.validate((value) => {
        if (!value) return;
        this.$axios({
          method: "put",
          url: "users/" + this.editForm.id,
          data: { email: this.editForm.email, mobile: this.editForm.mobile },
        })
          .then((res) => {
            console.log(res.data);
            this.$message.success("修改成功");
            this.getUserList();
          })
          .then(() => {
            this.editDialogVisible = false;
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("修改失败");
          });
      });
    },
    //根据ID删除对应用户信息
    removeUserById(id) {
      //console.log(id);
      this.$confirm("此操作将永久删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "delete",
            url: "/users/" + id,
          }).then((res) => {
            console.log(res.data);
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getUserList();
            } else {
              this.$message({
                type: "info",
                message: "删除失败!",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除!",
          });
        });
    },
  },
};
</script>

<style>
</style>