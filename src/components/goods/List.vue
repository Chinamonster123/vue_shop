<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card
      ><el-row :gutter="20"
        ><el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="goAddpage"
            >添加商品</el-button
          ></el-col
        ></el-row
      >
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#">
          <template v-slot:default="scope">
            {{
              (queryInfo.pagenum - 1) * queryInfo.pagesize + scope.$index + 1
            }}
          </template></el-table-column
        ><el-table-column prop="goods_name" label="商品名称"></el-table-column
        ><el-table-column
          width="95px"
          prop="goods_price"
          label="商品价格(元)"
        ></el-table-column
        ><el-table-column
          width="95px"
          prop="goods_weight"
          label="商品重量"
        ></el-table-column
        ><el-table-column width="140px" prop="add_time" label="创建时间"
          ><template v-slot:default="scope">
            {{ scope.row.add_time | dateFormat }}
          </template></el-table-column
        ><el-table-column width="130px" label="操作"
          ><template v-slot:default="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeById(scope.row)"
            ></el-button> </template></el-table-column></el-table
      ><el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination
    ></el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsList();
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodslist: [],
      total: 0,
    };
  },
  methods: {
    getGoodsList() {
      this.$axios({
        method: "get",
        url: "/goods",
        params: this.queryInfo,
      })
        .then((res) => {
          console.log(res.data);
          this.goodslist = res.data.data.goods;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getGoodsList();
    },
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getGoodsList();
    },
    removeById(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "delete",
            url: "/goods/" + row.goods_id,
          }).then((res) => {
            console.log(res.data);
            if (res.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              //this.getRolesList();
              this.getGoodsList();
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
    goAddpage() {
      this.$router.push("/goods/add");
    },
  },
};
</script>

<style lang="less" scoped>
</style>