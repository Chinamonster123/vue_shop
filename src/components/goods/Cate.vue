<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card
      ><el-row
        ><el-col
          ><el-button type="primary" @click="showAddCateDialogVisible"
            >添加分类</el-button
          ></el-col
        ></el-row
      >
      <!-- 表格 -->
      <tree-table
        class="treetable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        ><template v-slot:isOk="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
            style="color: green"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i> </template
        ><template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level == 0" size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level == 1" type="success" size="mini"
            >二级</el-tag
          >
          <el-tag v-if="scope.row.cat_level == 2" type="warning" size="mini"
            >三级</el-tag
          > </template
        ><template v-slot:opt>
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template></tree-table
      >
      <!-- 分页区域 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              children: 'children',
              value: 'cat_id',
              label: 'cat_name',
              checkStrictly: true,
            }"
            @change="parentCatChange"
            :clearable="true"
          ></el-cascader
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
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
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      catelist: [],
      total: 0,
      //树形表格列数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类的列表
      parentCateList: [],
      selectedKeys: [],
    };
  },
  methods: {
    getCateList() {
      this.$axios({
        method: "get",
        url: "/categories",
        params: this.queryInfo,
      })
        .then((res) => {
          console.log(res.data);
          this.catelist = res.data.data.result;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getCateList();
    },
    showAddCateDialogVisible() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //获取父级分类的数据列表
    getParentCateList() {
      this.$axios({
        method: "get",
        url: "/categories",
        params: { type: 2 },
      })
        .then((res) => {
          console.log(res.data);
          this.parentCateList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    parentCatChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
      }
    },
    addCate() {
      this.$refs.raddCateFormRef.validate((value) => {
        if (!value) return;
        this.$axios({
          method: "post",
          url: "/categories",
          data: this.addCateForm,
        })
          .then((res) => {
            console.log(res.data);
            this.getCateList();
            this.addCateDialogVisible = false;
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.selectedKeys = [];
    },
  },
};
</script>

<style lang="less" scoped>
.treetable {
  margin-top: 15px;
}
</style>