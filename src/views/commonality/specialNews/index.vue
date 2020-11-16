<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布日期" prop="releaseDate">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.releaseDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择发布日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-input
          v-model="queryParams.type"
          placeholder="请输入类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="articleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="发布日期" align="center" prop="releaseDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.releaseDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信息来源" align="center" prop="infoSource" />
      <el-table-column label="类型" align="center" prop="type" />
      <el-table-column label="审核状态" align="center" prop="checkStatus">
        <!-- 0待审核 1通过 2驳回  3驳回再提交-->
        <template slot-scope="scope">
          <span v-if="scope.row.checkStatus == 0">待审核</span>
          <span v-if="scope.row.checkStatus == 1">通过</span>
          <span v-if="scope.row.checkStatus == 2">驳回</span>
          <span v-if="scope.row.checkStatus == 3">驳回再提交</span>
        </template>
      </el-table-column>
      <el-table-column label="驳回原因" align="center" prop="rejectionReason" />
      <el-table-column label="查看次数" align="center" prop="showTimes" />
      <el-table-column label="是否可用" align="center" prop="enable">
        <template slot-scope="scope">
          <span v-if="scope.row.enable == 1">可用</span>
          <span v-if="scope.row.enable == 0">不可用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改文章对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="发布日期" prop="releaseDate">
          <el-date-picker
            clearable
            size="small"
            v-model="form.releaseDate"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发布日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="信息来源" prop="infoSource">
          <el-input v-model="form.infoSource" placeholder="请输入信息来源" />
        </el-form-item>
        <!-- <el-form-item label="类型">
          <el-input v-model="type1" placeholder="请输入文章类型" />
        </el-form-item>-->
        <el-form-item label="摘要" prop="summary" v-if="zhaiyao">
          <el-input type="textarea" v-model="form.summary" placeholder="请输入摘要" />
          <input v-model="type1" type="hidden" />
        </el-form-item>
        <el-form-item label="正文" prop="body" style="margin-bottom:5.5rem;">
          <Editor v-model="form.body" />
        </el-form-item>
        <el-form-item label="附件" prop="attachmentName" v-if="fujian">
          <el-upload
            class="upload-demo"
            action="#"
            :before-upload="beforeUpload"
            :file-list="fileList"
            :http-request="fileUpload"
            :on-remove="fileRemove"
          >
            <el-button size="small" type="primary">
              上传
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片" prop="imagePath" v-if="tupian">
          <el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview"
            :on-remove="imgRemove"
            :http-request="imgUpload"
            :file-list="imgList"
            list-type="picture"
          >
            <el-button size="small" type="primary">
              上传
              <i class="el-icon-picture el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="是否可用" prop="enable">
          <el-select v-model="form.enable" placeholder="请选择是否可用">
            <el-option
              v-for="item in enables"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="审核状态" prop="checkStatus">
           <el-input v-model="form.sort" placeholder="请输入排序" />
          <el-select v-model="form.checkStatus" placeholder="请选择审核状态">
            <el-option
              v-for="item in checkStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Editor from "@/components/Editor";
import {
  listArticle,
  getArticle,
  delArticle,
  addArticle,
  updateArticle,
  exportArticle,
  uploadFile,
  getFile,
  getCheckStatusList,
} from "@/api/commonality/article";
export default {
  name: "Article",
  components: {
    Editor,
  },
  data() {
    return {
      enables: [
        {
          value: "0",
          label: "不可用",
        },
        {
          value: "1",
          label: "可用",
        },
      ],
      zhaiyao: false,
      tupian: false,
      fujian: false,
      type1: "",
      checkStatusList: [],
      imgList: [],
      fileList: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 文章表格数据
      articleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        releaseDate: undefined,
        infoSource: undefined,
        type: undefined,
        body: undefined,
        attachmentName: undefined,
        attachmentPath: undefined,
        imagePath: undefined,
        displayLocation: undefined,
        sort: undefined,
        checkStatus: undefined,
        rejectionReason: undefined,
        showTimes: undefined,
        enable: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        releaseDate: [
          { required: true, message: "发布日期不能为空", trigger: "blur" },
        ],
        body: [{ required: true, message: "正文不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        enable: [
          { required: true, message: "请选择是否可用", trigger: "blur" },
        ],
        checkStatus: [
          { required: true, message: "请选择审核状态", trigger: "blur" },
        ],
      },
      // 专题专栏
      zhuanti: "",
    };
  },
  // watch: {
  //   $route: "fetchdata",
  // },
  created() {
    this.getList();
    if (
  this.$route.query.text == "文字新闻" ||
  this.$route.query.text == "本网专栏"
) {
  this.zhaiyao = false;
  this.tupian = false;
  this.fujian = false;
}
if (
  this.$route.query.text == "图片新闻" ||
  this.$route.query.text == "图片报道" ||
  this.$route.query.text == "图片现场"
) {
  this.zhaiyao = false;
  this.tupian = true;
  this.fujian = false;
}
    // console.log(this.$route.params);
    console.log(this.$route.query.text);
    getCheckStatusList().then((response) => {
      var datas = response.data;
      for (var i = 0; i < datas.length; i++) {
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
        this.checkStatusList.push(obj);
      }
      // console.log(3);
    });
  },
  mounted() {
    // console.log(2);
    this.form.remark = this.getQueryValue("remark");
    this.queryParams.remark = this.getQueryValue("remark");
    this.form.type = this.getQueryValue("remark");
    // console.log(this.getQueryValue("remark"));
  },
  methods: {
    // fetchdata() {
    //   this.checkStatusList = [];
    //   this.form.remark = this.getQueryValue("remark");
    //   this.queryParams.remark = this.getQueryValue("remark");
    //   this.getList();
    //   console.log(this.queryParams.remark);
    //   console.log(this.$route.query.text);
    //   getCheckStatusList().then((response) => {
    //     var datas = response.data;
    //     for (var i = 0; i < datas.length; i++) {
    //       var obj = new Object();
    //       obj.label = datas[i].dictLabel;
    //       obj.value = datas[i].dictValue;
    //       this.checkStatusList.push(obj);
    //     }
    //     // console.log(3);
    //   });
    //   if (
    //     this.$route.query.text == "文字新闻" ||
    //     this.$route.query.text == "本网专栏"
    //   ) {
    //     this.zhaiyao = false;
    //     this.tupian = false;
    //     this.fujian = false;
    //   }
    //   if (
    //     this.$route.query.text == "图片新闻" ||
    //     this.$route.query.text == "图片报道" ||
    //     this.$route.query.text == "图片现场"
    //   ) {
    //     this.zhaiyao = false;
    //     this.tupian = true;
    //     this.fujian = false;
    //   }
    // },
    handleChange(file, fileList) {},
    handleSuccess(response, file, fileList) {},
    /** 查询文章列表 */
    getList() {
      //  console.log(this.getQueryValue());
      // console.log(this.queryParams.displayLocation);
      // console.log(this.queryParams);
      this.loading = true;
      listArticle(this.queryParams).then((response) => {
        // console.log(response)
        this.articleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });

      // console.log(this.articleList);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        title: undefined,
        releaseDate: undefined,
        infoSource: undefined,
        type: undefined,
        body: undefined,
        attachmentName: undefined,
        attachmentPath: undefined,
        imagePath: undefined,
        displayLocation: 100,
        sort: undefined,
        checkStatus: undefined,
        rejectionReason: undefined,
        showTimes: undefined,
        enable: "",
        summary: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.form.type = this.type1;
      if(this.form.type ==''){
        this.form.type = this.$route.query.text
      }
      // console.log(this.form.type);
      var list = new Array();
      // list.index = this.queryParams.remark;
      // console.log(this.queryParams.remark);
      (this.imgList = []), (this.fileList = []), this.reset();
      this.open = true;
      this.title = "添加文章";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // console.log(this.form.remark);
      // console.log(this.queryParams.remark);
      // console.log(row);
      this.reset();
      this.imgList = [];
      this.fileList = [];
      const id = row.id || this.ids;
      this.form.type = this.type1;
      if(this.form.type ==''){
        this.form.type = this.$route.query.text
      }
      console.log(this.form.type);
      getArticle(id).then((response) => {
        this.form = response.data;
        let obj = new Object();

        obj.name = this.form.attachmentName;
        obj.url = this.form.attachmentPath;
        if (this.fileList.length == 0) {
          this.fileList.push(obj);
        }

        let objImg = new Object();
        objImg.name = "";
        objImg.url = this.contextPath + this.form.imagePath;
        if (this.imgList.length == 0) {
          this.imgList.push(objImg);
        }
        this.open = true;
        this.title = "修改文章";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      // console.log(this.form);
      this.form.remark = this.getQueryValue("remark");
      this.form.displayLocation = 100;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            this.form.type = this.$route.query.text;
            updateArticle(this.form).then((response) => {

              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            this.form.type = this.$route.query.text
            addArticle(this.form).then((response) => {

              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除文章编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delArticle(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有文章数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportArticle(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    // 覆盖默认的上传行为
    requestUpload() {},
    // 上传预处理
    beforeUpload(file) {},
    // 上传附件
    fileUpload(data) {
      this.fileList = [];
      let formData = new FormData();
      formData.append("file", data.file);
      uploadFile(formData).then((response) => {
        this.form.attachmentName = response.fileName;
        this.form.attachmentPath = response.fileUrl;
        let obj = new Object();

        obj.name = this.form.attachmentName;
        obj.url = this.form.attachmentPath;
        if (this.fileList.length == 0) {
          this.fileList.push(obj);
        }
      });
    },
    //上传图片
    imgUpload(data) {
      let formData = new FormData();
      this.imgList = [];
      formData.append("file", data.file);
      uploadFile(formData).then((response) => {
        console.log(response);
        this.form.imagePath = response.fileUrl;
        let objImg = new Object();
        objImg.name = "";
        objImg.url = this.contextPath + this.form.imagePath;
        if (this.imgList.length == 0) {
          this.imgList.push(objImg);
        }
      });
    },
    //删除图片时的操作
    imgRemove() {
      this.form.imagePath = undefined;
    },
    //删除文件时的操作
    fileRemove() {
      this.form.attachmentName = undefined;
      this.form.attachmentPath = undefined;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {},
  },
};
</script>
<style>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

.el-select > .el-input {
  width: 480px;
}
</style>
