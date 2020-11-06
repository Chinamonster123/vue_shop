<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card
      ><el-row
        ><el-col
          ><el-button type="primary" @click="addDialogVisible"
            >添加角色</el-button
          ></el-col
        ></el-row
      >
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand"
          ><template slot-scope="scope">
            <el-row
              :class="{ bdbottom: true, bdtop: index1 === 0, vcenter: true }"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5"
                ><el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i
              ></el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="{ bdtop: index2 !== 0, vcenter: true }"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6"
                    ><el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="18">
                    <el-col
                      ><el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        type="warning"
                        closable
                        @close="removeRightById(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template></el-table-column
        >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px"
          ><template v-slot:default="aaa">
            <div>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(aaa.row.id)"
                >编辑</el-button
              ><el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="removeRoleById(aaa.row.id)"
                >删除</el-button
              ><el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRightDialog(aaa.row)"
                >分配权限</el-button
              >
            </div>
          </template></el-table-column
        >
      </el-table>
      <el-pagination layout="total" :total="rolesList.length"> </el-pagination>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="角色"
      :visible.sync="DialogVisible"
      width="50%"
      @close="DialogClosed"
    >
      <el-form
        :model="addRolesForm"
        :rules="addRolesFormrules"
        ref="addRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input> </el-form-item
        ><el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="40%"
      @close="editRoleDialogClosed"
    >
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="defaultProps"
        ref="treeRef"
        node-key="id"
        show-checkbox
        default-expand-all
        :default-checked-keys="defkey"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList();
  },
  data() {
    return {
      //所有角色列表数据
      rolesList: [],
      rightsList: [],
      //树型控件的属性绑定对象
      defaultProps: {
        children: "children",
        label: "authName",
      },
      defkey: [],
      DialogVisible: false,
      setRightDialogVisible: false,
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      addRolesFormrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      editRoleForm: {},
      editRoleDialogVisible: false,
      editRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      //   当前即将分配权限的Id
      roleId: 0,
    };
  },
  methods: {
    getRolesList() {
      this.$axios({
        method: "get",
        url: "roles",
      })
        .then((res) => {
          console.log(res.data);
          this.rolesList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addDialogVisible() {
      this.DialogVisible = true;
    },
    addRole() {
      this.$refs.addRolesFormRef.validate((value) => {
        if (!value) return;
        this.$axios({
          method: "post",
          url: "/roles",
          data: this.addRolesForm,
        })
          .then((res) => {
            console.log(res.data);
            this.DialogVisible = false;
            this.getRolesList();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    DialogClosed() {
      this.$refs.addRolesFormRef.resetFields();
    },
    showEditDialog(id) {
      this.$axios({
        method: "get",
        url: "/roles/" + id,
      })
        .then((res) => {
          //console.log(res.data);
          this.editRoleForm = res.data.data;
          this.editRoleDialogVisible = true;
        })
        .catch((err) => {
          //console.log(err);
        });
    },
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields();
    },
    editRoles() {
      this.$refs.editRoleFormRef.validate((value) => {
        if (!value) return;
        this.$axios({
          method: "put",
          url: "/roles/" + this.editRoleForm.roleId,
          data: {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
          },
        })
          .then((res) => {
            console.log(res.data);
            this.editRoleDialogVisible = false;
            this.getRolesList();
          })
          .catch((err) => {
            console.log(err);
            this.editRoleDialogVisible = false;
          });
      });
    },
    removeRoleById(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "delete",
            url: "/roles/" + id,
          }).then((res) => {
            console.log(res.data);
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getRolesList();
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
    removeRightById(roleid, rightid) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "delete",
            url: "/roles/" + roleid.id + "/rights/" + rightid,
          }).then((res) => {
            console.log(res.data);
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              //this.getRolesList();
              roleid.children = res.data.data;
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
    //分配权限
    showSetRightDialog(role) {
      //获取所有权限数据
      this.roleId = role.id;
      this.$axios({
        method: "get",
        url: "rights/tree",
      })
        .then((res) => {
          console.log(res.data);
          this.rightsList = res.data.data;
          this.getLeafKeys(role, this.defkey);
          //console.log(this.defkey);
          this.setRightDialogVisible = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //递归形式获得角色三级权限id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    //监听分配权限对话框关闭事件
    setRightDialogClose() {
      this.defkey = [];
    },
    allowRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      //console.log(keys);
      const idStr = keys.join(",");
      this.$axios({
        method: "post",
        url: "/roles/" + this.roleId + "/rights",
        data: { rids: idStr },
      })
        .then((res) => {
          console.log(res.data);
          this.getRolesList();
          this.setRightDialogVisible = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
