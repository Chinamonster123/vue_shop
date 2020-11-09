<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane name="0" label="基本信息"
            ><el-form-item label="商品名称" prop="goods_name"
              ><el-input v-model="addForm.goods_name"></el-input></el-form-item
            ><el-form-item label="商品价格" prop="goods_price"
              ><el-input
                v-model="addForm.goods_price"
                type="number"
              ></el-input></el-form-item
            ><el-form-item label="商品重量" prop="goods_weight"
              ><el-input
                v-model="addForm.goods_weight"
                type="number"
              ></el-input></el-form-item
            ><el-form-item label="商品数量" prop="goods_number"
              ><el-input
                v-model="addForm.goods_number"
                type="number"
              ></el-input></el-form-item
            ><el-form-item label="商品分类" prop="goods_cat"
              ><el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="{
                  expandTrigger: 'hover',
                  children: 'children',
                  value: 'cat_id',
                  label: 'cat_name',
                  checkStrictly: true,
                }"
                @change="parentCatChange"
                :clearable="true"
              ></el-cascader></el-form-item
          ></el-tab-pane>
          <el-tab-pane name="1" label="商品参数"
            ><el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item"
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox> </el-checkbox-group></el-form-item
          ></el-tab-pane>
          <el-tab-pane name="2" label="商品属性"
            ><el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
              ><el-input v-model="item.attr_vals"></el-input></el-form-item
          ></el-tab-pane>
          <el-tab-pane name="3" label="商品图片"
            ><el-upload
              :on-success="handleSuccess"
              :headers="headerObj"
              action="http://www.ysqorz.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload></el-tab-pane
          >
          <el-tab-pane name="4" label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            ></el-tab-pane
          >
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="提示" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      catelist: [],
      manyTableData: [],
      onlyTableData: [],
      //图片上传组件的headers请求头
      headerObj: { Authorization: window.sessionStorage.getItem("token") },
      previewPath: "",
      previewVisible: false,
    };
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  methods: {
    getCateList() {
      this.$axios({
        method: "get",
        url: "/categories",
      })
        .then((res) => {
          console.log(res.data);
          this.catelist = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    parentCatChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabLeave(to, from) {
      if (this.addForm.goods_cat.length !== 3 && from === "0") {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    tabClicked() {
      //console.log(this.activeIndex);
      if (this.activeIndex === "1") {
        this.$axios({
          method: "get",
          url: "/categories/" + this.cateId + "/attributes",
          params: {
            sel: "many",
          },
        })
          .then((res) => {
            console.log(res.data);
            this.manyTableData = res.data.data;
            this.manyTableData.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.activeIndex === "2") {
        this.$axios({
          method: "get",
          url: "/categories/" + this.cateId + "/attributes",
          params: {
            sel: "only",
          },
        })
          .then((res) => {
            console.log(res.data);
            this.onlyTableData = res.data.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      //console.log(file.response.data.url);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    //处理移除图片的操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      for (let i = 0; i < this.addForm.pics.length; i++) {
        if (this.addForm.pics[i].pic === filePath) {
          this.addForm.pics.splice(i, 1);
          break;
        }
      }
      //console.log(this.addForm.pics);
    },
    //监听图片上传
    handleSuccess(response) {
      //console.log(response);
      //拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      //将图片信息对象存入数组
      this.addForm.pics.push(picInfo);
      //console.log(this.addForm);
    },
    add() {
      this.$refs.addFormRef.validate((value) => {
        if (!value) return this.$message.error("请填写必要的表单项");
        //处理动态参数和静态属性
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });
        // lodash cloneDeep(obj) 深拷贝
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        //console.log(form);
        //发起请求
        this.$axios({
          method: "post",
          url: "/goods",
          data: form,
        })
          .then((res) => {
            console.log(res.data);
            if (res.data.meta.status === 201) {
              this.$message.success("添加商品成功!");
              this.$router.push("/goods");
            } else {
              this.$message.error("添加商品失败!");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.btnAdd {
  margin-top: 10px;
}
</style>