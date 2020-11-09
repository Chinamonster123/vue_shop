<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card
      ><el-row
        ><el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input></el-col
      ></el-row>
      <el-table :data="goodsList" border stripe
        ><el-table-column type="index" label="#"
          ><template v-slot:default="scope">
            {{
              (queryInfo.pagenum - 1) * queryInfo.pagesize + scope.$index + 1
            }}
          </template></el-table-column
        ><el-table-column prop="order_number" label="订单编号"></el-table-column
        ><el-table-column prop="order_price" label="订单价格"></el-table-column
        ><el-table-column label="是否付款"
          ><template v-slot:default="scope">
            <el-tag v-if="scope.row.order_pay !== '0'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template></el-table-column
        ><el-table-column prop="is_send" label="是否发货"></el-table-column
        ><el-table-column label="下单时间"
          ><template v-slot:default="scope">
            {{ scope.row.create_time | dateFormat }}
          </template></el-table-column
        ><el-table-column label="操作"
          ><template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button
            ><el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox"
            ></el-button> </template></el-table-column></el-table
      ><el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination
    ></el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressFormRules"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata";
export default {
  created() {
    this.getOrderList();
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      goodsList: [],
      dialogVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: "请输入省市区/县",
            trigger: "blur",
          },
        ],
        address2: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur",
          },
        ],
      },
      cityData,
      progressDialogVisible: false,
      progressInfo: [],
    };
  },
  methods: {
    getOrderList() {
      this.$axios({
        method: "get",
        url: "/orders",
        params: this.queryInfo,
      })
        .then((res) => {
          console.log(res.data);
          this.goodsList = res.data.data.goods;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.queryInfo.pagenum = 1;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },
    showBox() {
      this.dialogVisible = true;
    },
    dialogClose() {
      this.$refs.addressFormRef.resetFields();
    },
    showProgressBox() {
      this.$axios({
        method: "get",
        url: "/kuaidi/804909574412544580",
      })
        .then((res) => {
          console.log(res.data);
          this.progressInfo = res.data.data;
          this.progressDialogVisible = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>