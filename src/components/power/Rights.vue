<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card
      ><el-row :gutter="20"
        ><el-col :span="7"></el-col><el-col :span="4"></el-col></el-row
      ><el-table
        :data="rightsList.slice((currpage - 1) * pagesize, currpage * pagesize)"
        border
        stripe
        ><el-table-column type="index" label="#"
          ><template v-slot:default="aaa">
            <!-- 为表格每个单元格添加序号 -->
            {{ (currpage - 1) * pagesize + aaa.$index + 1 }}
          </template></el-table-column
        ><el-table-column label="权限名称" prop="authName"></el-table-column
        ><el-table-column label="路径" prop="path"></el-table-column
        ><el-table-column label="权限等级" prop="level"
          ><template v-slot:default="getlevel">
            <el-tag v-if="getlevel.row.level == 0">一级</el-tag>
            <el-tag v-if="getlevel.row.level == 1" type="success">二级</el-tag>
            <el-tag v-if="getlevel.row.level == 2" type="warning">三级</el-tag>
          </template></el-table-column
        ></el-table
      ><el-pagination
        @current-change="handleCurrentChange"
        :current-page="currpage"
        :page-size="pagesize"
        layout="total,prev, pager, next"
        :total="rightsList.length"
      >
      </el-pagination
    ></el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsList();
  },
  data() {
    return {
      rightsList: [],
      pagesize: 8,
      currpage: 1,
    };
  },
  methods: {
    getRightsList() {
      this.$axios({
        method: "get",
        url: `rights/list`,
      })
        .then((res) => {
          console.log(res.data);
          this.rightsList = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /*  handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    }, */
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.currpage = val;
    },
  },
};
</script>

<style lang="less" scoped>
</style>