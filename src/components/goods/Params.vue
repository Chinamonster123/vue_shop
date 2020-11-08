<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        show-icon
        :closable="false"
        title="注意: 只允许为第三级分类设置相关参数！"
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col
          ><span>选择商品分类: </span
          ><el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              children: 'children',
              value: 'cat_id',
              label: 'cat_name',
              checkStrictly: true,
            }"
            @change="parentCatChange"
            :clearable="true"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          ><el-table :data="manyTabData" border stripe>
            <el-table-column type="expand"
              ><template v-slot:default="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                ><el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template></el-table-column
            >
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作"
              ><template v-slot:default="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template></el-table-column
            ></el-table
          ></el-tab-pane
        >
        <el-tab-pane label="静态属性" name="only"
          ><el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          ><el-table :data="onlyTabData" border stripe>
            <el-table-column type="expand"
              ><template v-slot:default="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                ><el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template></el-table-column
            >
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作"
              ><template v-slot:default="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template></el-table-column
            ></el-table
          ></el-tab-pane
        >
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + dialogText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      ><el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        ><el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'添加' + dialogText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
      ><el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        ><el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      cateList: [],
      selectedKeys: [],
      activeName: "many",
      manyTabData: [],
      onlyTabData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      //添加参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
      editForm: {},
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    isDisabled() {
      return this.selectedKeys.length === 3 ? false : true;
    },
    //当前选中的三级分类的id
    cateId() {
      return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null;
    },
    dialogText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  methods: {
    getCateList() {
      this.$axios({
        method: "get",
        url: "categories",
      })
        .then((res) => {
          console.log(res.data);
          this.cateList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    parentCatChange() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTabData = [];
        this.onlyTabData = [];
      }
      this.getParamsData();
    },
    handleTabClick() {
      this.getParamsData();
    },
    getParamsData() {
      this.$axios({
        method: "get",
        url: "/categories/" + this.cateId + "/attributes",
        params: { sel: this.activeName },
      })
        .then((res) => {
          console.log(res.data);
          res.data.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            item.inputVisible = false;
            item.inputValue = "";
          });
          if (this.activeName === "many") {
            this.manyTabData = res.data.data;
          } else {
            this.onlyTabData = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate((value) => {
        if (!value) return;
        this.$axios({
          method: "post",
          url: "/categories/" + this.cateId + "/attributes/",
          data: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          },
        })
          .then((res) => {
            console.log(res.data);
            this.getParamsData();
            this.addDialogVisible = false;
          })
          .catch((err) => {
            console.log(err);
            this.addDialogVisible = false;
          });
      });
    },
    showEditDialog(id) {
      this.$axios({
        method: "get",
        url: "/categories/" + this.cateId + "/attributes/" + id,
        params: { attr_sel: this.activeName },
      })
        .then((res) => {
          console.log(res.data);
          this.editForm = res.data.data;
          this.editDialogVisible = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editParams() {
      this.$refs.editFormRef.validate((value) => {
        if (!value) return;
        this.$axios({
          method: "put",
          url:
            "/categories/" +
            this.cateId +
            "/attributes/" +
            this.editForm.attr_id,
          data: {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          },
        })
          .then((res) => {
            console.log(res.data);
            this.getParamsData();
            this.editDialogVisible = false;
          })
          .catch((err) => {
            console.log(err);
            this.editDialogVisible = false;
          });
      });
    },
    removeParams(id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "delete",
            url: "/categories/" + this.cateId + "/attributes/" + id,
          }).then((res) => {
            console.log(res.data);
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              //this.getRolesList();
              this.getParamsData();
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
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      //发起请求，保存这次操作
      this.$axios({
        method: "put",
        url: "/categories/" + this.cateId + "/attributes/" + row.attr_id,
        data: {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" "),
        },
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获得焦点对象
      // $nextTick方法:当页面上元素被重新渲染后执行指定的回调函数
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除对应的参数可选项
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.$axios({
        method: "put",
        url: "/categories/" + this.cateId + "/attributes/" + row.attr_id,
        data: {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" "),
        },
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>