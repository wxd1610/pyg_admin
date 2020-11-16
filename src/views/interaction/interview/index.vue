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
      <el-form-item label="访谈时间" prop="interviewTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.interviewTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择访谈时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="嘉宾" prop="guest">
        <el-input
          v-model="queryParams.guest"
          placeholder="请输入嘉宾"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布日期" prop="publishDate">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.publishDate"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择发布日期"
        ></el-date-picker>
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
          v-hasPermi="['interaction:interview:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['interaction:interview:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['interaction:interview:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['interaction:interview:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="interviewList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="标题图标" align="center" prop="titleIcon">
        <template slot-scope="scope">
          <img :src="contextPath+scope.row.titleIcon" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="访谈时间" align="center" prop="interviewTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.interviewTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="嘉宾" align="center" prop="guest" />
      <el-table-column label="发布日期" align="center" prop="publishDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['interaction:interview:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['interaction:interview:remove']"
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

    <!-- 添加或修改在线访谈对话框 -->

     <el-dialog
      :title="title"
      :visible.sync="open"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="标题图标" prop="titleIcon">
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
        <el-form-item label="图片标题" prop="pictureTitle">
          <el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview1"
            :on-remove="imgRemove1"
            :http-request="imgUpload1"
            :file-list="imgList1"
            list-type="picture"
          >
            <el-button size="small" type="primary">
              上传
              <i class="el-icon-picture el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频" prop="videoPath">
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
          <video
            v-if="form.videoPath!=undefined"
            controls="controls"
            :src="contextPath+form.videoPath"
            style="width: 300px;height: 200px;margin-top: 3px;"
          ></video>
        </el-form-item>
        <el-form-item label="访谈时间" prop="interviewTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 300px"
            v-model="form.interviewTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择访谈时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="嘉宾" prop="guest">
          <el-input v-model="form.guest" placeholder="请输入嘉宾" />
        </el-form-item>
        <el-form-item label="正文" prop="body">
          <Editor v-model="form.body" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate" style="margin-top:6.5rem;">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.publishDate"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发布日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <!-- <div class="loadingFile" v-if="loadingFile">
         <span class="fileFont"></span>
        <div class="el-loading-spinner">
          <i class="el-icon-loading"></i>
          <p class="el-loading-text">正在上传文件，请稍后...</p>
        </div>
      </div>-->
    </el-dialog>
  </div>
</template>

<script>
import {
  listInterview,
  getInterview,
  delInterview,
  addInterview,
  updateInterview,
  exportInterview,
} from "@/api/interaction/interview";
import Editor from "@/components/Editor";
import { uploadFile } from "@/api/tool/fileUpload";
export default {
  name: "Interview",
  components: {
    Editor,
  },
  data() {
    return {
      fileList: [],
      imgList: [],
      imgList1: [],
      // 遮罩层
      loading: true,
      loadingFile: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 在线访谈表格数据
      interviewList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        titleIcon: undefined,
        pictureTitle: undefined,
        videoName: undefined,
        videoPath: undefined,
        interviewTime: undefined,
        guest: undefined,
        body: undefined,
        publishDate: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        interviewTime: [
          { required: true, message: "访谈时间不能为空", trigger: "blur" },
        ],
        guest: [{ required: true, message: "嘉宾不能为空", trigger: "blur" }],
        body: [{ required: true, message: "正文不能为空", trigger: "blur" }],
        publishDate: [
          { required: true, message: "发布日期不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //删除文件时的操作
    fileRemove() {
      this.form.videoName = undefined;
      this.form.videoPath = undefined;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 上传预处理
    beforeUpload(file) {},
    // 上传附件
    fileUpload(data) {
      // this.imgList = [];
      // this.imgList1 = [];
      this.fileList = [];
      let formData = new FormData();
      formData.append("file", data.file);
      this.loadingFile = true;
      uploadFile(formData).then((response) => {
        console.log(response);
        this.loadingFile = false;
        this.form.videoName = response.newfileName;
        this.form.videoPath = response.fileName;
        let objfile = new Object();
        objfile.name = this.form.videoName;
        objfile.url = this.contextPath + this.form.videoPath;
        if (this.fileList.length == 0) {
          this.fileList.push(objfile);
        }
      });
    },
    //上传图片
    imgUpload(data) {
      this.imgList = [];
      // this.imgList1 = [];
      // this.fileList = [];
      let formData = new FormData();
      formData.append("file", data.file);
      uploadFile(formData).then((response) => {
        console.log(response);
        this.form.titleIcon = response.fileName;
        let objImg = new Object();
        objImg.name = "";
        objImg.url = this.contextPath + this.form.titleIcon;
        if (this.imgList.length == 0) {
          this.imgList.push(objImg);
        }

        // let objImg1 = new Object();
        // objImg1.name = "";
        // objImg1.url = this.contextPath + this.form.pictureTitle;
        // if (this.imgList1.length == 0) {
        //   this.imgList1.push(objImg1);
        // }

        // let objfile = new Object();
        // objfile.name = this.form.videoName;
        // objfile.url = this.contextPath + this.form.videoPath;
        // if (this.fileList.length == 0) {
        //   this.fileList.push(objfile);
        // }
      });
    },
    //删除图片时的操作
    imgRemove() {
      this.form.titleIcon = undefined;
    },

    handlePreview(file) {},

    //上传图片
    imgUpload1(data) {
      // this.imgList = [];
      this.imgList1 = [];
      // this.fileList = [];
      let formData = new FormData();
      formData.append("file", data.file);
      uploadFile(formData).then((response) => {
        console.log(response);
        this.form.pictureTitle = response.fileName;
        //  let objImg = new Object();
        // objImg.name = "";
        // objImg.url = this.contextPath + this.form.titleIcon;
        // if (this.imgList.length == 0) {
        //   this.imgList.push(objImg);
        // }

        let objImg1 = new Object();
        objImg1.name = "";
        objImg1.url = this.contextPath + this.form.pictureTitle;
        if (this.imgList1.length == 0) {
          this.imgList1.push(objImg1);
        }

        // let objf、ile = new Object();
        // objfile.name = this.form.videoName;
        // objfile.url = this.contextPath + this.form.videoPath;
        // if (this.fileList.length == 0) {
        //   this.、、、、fileList.push(objfile);
        // }
      });
    },
    //删除图片时的操作
    imgRemove1() {
      this.form.pictureTitle = undefined;
    },

    handlePreview1(file) {},
    /** 查询在线访谈列表 */
    getList() {
      this.loading = true;
      listInterview(this.queryParams).then((response) => {
        this.interviewList = response.rows;
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
        title: undefined,
        titleIcon: undefined,
        pictureTitle: undefined,
        videoName: undefined,
        videoPath: undefined,
        interviewTime: undefined,
        guest: undefined,
        body: undefined,
        publishDate: undefined,
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
      this.fileList = [];
      this.imgList = [];
      this.imgList1 = [];
      this.reset();
      this.open = true;
      this.title = "添加在线访谈";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.imgList = [];
      this.imgList1 = [];
      this.fileList = [];
      this.reset();
      const id = row.id || this.ids;
      getInterview(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改在线访谈";
        let objImg = new Object();
        objImg.name = "";
        objImg.url = this.contextPath + this.form.titleIcon;
        if (this.imgList.length == 0) {
          this.imgList.push(objImg);
        }

        let objImg1 = new Object();
        objImg1.name = "";
        objImg1.url = this.contextPath + this.form.pictureTitle;
        if (this.imgList1.length == 0) {
          this.imgList1.push(objImg1);
        }

        let objfile = new Object();
        objfile.name = this.form.videoName;
        objfile.url = this.contextPath + this.form.videoPath;
        if (this.fileList.length == 0) {
          this.fileList.push(objfile);
        }
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateInterview(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addInterview(this.form).then((response) => {
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
        '是否确认删除在线访谈编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delInterview(ids);
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
      this.$confirm("是否确认导出所有在线访谈数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportInterview(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
<style>
.loadingFile {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  padding-top: 80%;
}

.fileFont {
  color: #ffffff;
}
</style>
