<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="印章名称" prop="stampName">
        <el-input
          v-model="queryParams.stampName"
          placeholder="请输入印章名称"
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
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['sendreceive:control:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sendreceive:control:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sendreceive:control:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['sendreceive:control:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="controlList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="印章名称" align="center" prop="stampName" />
      <el-table-column label="印章图片" align="center" prop="stampPicture">
        <template slot-scope="scope">
          <img :src="contextPath+scope.row.stampPicture" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sendreceive:control:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sendreceive:control:remove']"
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

    <!-- 添加或修改印章管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="印章名称" prop="stampName">
          <el-input v-model="form.stampName" placeholder="请输入印章名称" />
        </el-form-item>
        <el-form-item label="印章图片" prop="stampPicture">
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
        <el-form-item :label="labelName" prop="stampPassword">
          <!-- show-password -->
          <el-input   type="password" v-model="form.stampPassword" placeholder="请输入印章密码" />
        </el-form-item>
        <el-form-item label="印章新密码" prop="newStampPassword" v-if="form.id!=undefined">
          <!-- show-password -->
          <el-input   type="password" v-model="form.newStampPassword" placeholder="请输入印章新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="reNewStampPassword" v-if="form.id!=undefined">
          <!-- show-password -->
          <el-input   type="password" v-model="form.reNewStampPassword" placeholder="请输入确认新密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listControl,
  getControl,
  delControl,
  addControl,
  updateControl,
  exportControl,
  verify,
} from "@/api/sendreceive/control";
import { uploadFile } from "@/api/tool/fileUpload";
export default {
  name: "Control",
  data() {
    return {
      labelName: "印章密码",
      imgList: [],
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
      // 印章管理表格数据
      controlList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stampName: undefined,
        stampPassword: undefined,
        stampPicture: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stampName: [
          { required: true, message: "印章名称不能为空", trigger: "blur" },
        ],
        stampPassword: [
          { required: true, message: "印章密码不能为空", trigger: "blur" },
        ],
        stampPicture: [
          { required: true, message: "印章图片不能为空", trigger: "blur" },
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" },
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" },
        ],
        updateTime: [
          { required: true, message: "修改时间不能为空", trigger: "blur" },
        ],
        newStampPassword: [
          { required: true, message: "印章新密码不能为空", trigger: "blur" },
        ],
        reNewStampPassword: [
          { required: true, message: "确认新密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    imgUpload(data) {
      let formData = new FormData();
      this.imgList = [];
      formData.append("file", data.file);
      uploadFile(formData).then((response) => {
        this.form.stampPicture = response.fileName;
        let objImg = new Object();
        objImg.name = "";
        objImg.url = this.contextPath + this.form.stampPicture;
        if (this.imgList.length == 0) {
          this.imgList.push(objImg);
        }
      });
    },
    //删除图片时的操作
    imgRemove() {
      this.form.stampPicture = undefined;
    },
    handlePreview(file) {
      console.log(file);
    },
    /** 查询印章管理列表 */
    getList() {
      this.loading = true;
      listControl(this.queryParams).then((response) => {
        this.controlList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        stampName: undefined,
        stampPassword: undefined,
        stampPicture: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        newStampPassword: undefined,
        reNewStampPassword: undefined,
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
      this.labelName = "印章密码";
      this.imgList = [];
      this.reset();
      this.open = true;
      this.title = "添加印章管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.imgList = [];
      this.reset();
      const id = row.id || this.ids;
      getControl(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改印章管理";
        this.form.stampPassword = "";
        this.labelName = "印章旧密码";
        let objImg = new Object();
        objImg.name = "";
        objImg.url = this.contextPath + this.form.stampPicture;
        this.imgList.push(objImg);
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            var query = new Object();
            query.id = this.form.id;
            query.stampPassword = this.form.stampPassword;
            //var query = JSON.stringify(paramsObj);
            console.log(query);
            verify(query).then((response) => {
              console.log(response.data.status);
              if (response.data.status) {
                var newStampPassword = this.form.newStampPassword;
                var reNewStampPassword = this.form.reNewStampPassword;
                if (newStampPassword != reNewStampPassword) {
                  this.$message.error("您输入的新旧密码不一致");
                  return;
                } else {
                  this.form.stampPassword = this.form.newStampPassword;
                }
                updateControl(this.form).then((response) => {
                  if (response.code === 200) {
                    this.msgSuccess("修改成功");
                    this.open = false;
                    this.getList();
                  }
                });
              } else {
                this.$message.error("您输入的旧密码错误");
              }
            });
          } else {
            addControl(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除印章管理编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delControl(ids);
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
      this.$confirm("是否确认导出所有印章管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportControl(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
