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
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="承办单位" prop="organizer">
        <el-input
          v-model="queryParams.organizer"
          placeholder="请输入承办单位"
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
          v-hasPermi="['affairs:proposal:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['affairs:proposal:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['affairs:proposal:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['affairs:proposal:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="proposalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="标题图标" align="center" prop="titleIcon">
        <template slot-scope="scope">
          <img :src="contextPath+scope.row.titleIcon" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="承办单位" align="center" prop="organizer" />
      <el-table-column label="提案质量" align="center" prop="proposalQuality" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="工作单位" align="center" prop="company" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['affairs:proposal:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['affairs:proposal:remove']"
          >删除</el-button>
          <router-link
            :to="'response?id='+ scope.row.id"
            class="el-icon-document"
            style="margin-left: 10px;color: #1890FF;"
          >
            <span>提案答复</span>
          </router-link>
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

    <!-- 添加或修改团体提案对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="标题图标" prop="titleIcon">
          <!-- <el-input v-model="form.titleIcon" placeholder="请输入标题图标" /> -->
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="承办单位" prop="organizer">
          <el-input v-model="form.organizer" placeholder="请输入承办单位" />
        </el-form-item>
        <el-form-item label="提案质量" prop="proposalQuality">
          <el-input v-model="form.proposalQuality" placeholder="请输入提案质量" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="工作单位" prop="company">
          <el-input v-model="form.company" placeholder="请输入工作单位" />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <Editor v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="margin-top:7.5rem;">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
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
  listProposal,
  getProposal,
  delProposal,
  addProposal,
  updateProposal,
  exportProposal,
} from "@/api/affairs/proposal";
import Editor from "@/components/Editor";
import { uploadFile } from "@/api/tool/fileUpload";
export default {
  name: "Proposal",
  components: {
    Editor,
  },
  data() {
    return {
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
      // 团体提案表格数据
      proposalList: [],
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
        name: undefined,
        organizer: undefined,
        proposalQuality: undefined,
        phone: undefined,
        company: undefined,
        content: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        titleIcon: [
          { required: true, message: "标题图标不能为空", trigger: "blur" },
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        organizer: [
          { required: true, message: "承办单位不能为空", trigger: "blur" },
        ],
        proposalQuality: [
          { required: true, message: "提案质量不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
        ],
        company: [
          { required: true, message: "工作单位不能为空", trigger: "blur" },
        ],
        content: [{ required: true, message: "正文不能为空", trigger: "blur" }],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" },
        ],
        delFlag: [
          {
            required: true,
            message: "删除标志（1存在0删除）不能为空",
            trigger: "blur",
          },
        ],
        // remark: [
        //   { required: true, message: "备注不能为空", trigger: "blur" }
        // ]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    imgUpload(data) {
      let formData = new FormData();
      formData.append("file", data.file);
      this.imgList = [];
      uploadFile(formData).then((response) => {
        console.log(response)
        this.form.titleIcon = response.fileName;
        let objImg = new Object();
        objImg.name = "";
        objImg.url = response.url
        // objImg.url = this.contextPath + this.form.titleIcon;
        console.log(objImg.url)
        if (this.imgList.length == 0) {
          this.imgList.push(objImg);
        }
      });
    },
    //删除图片时的操作
    imgRemove() {
      this.form.titleIcon = undefined;
    },
    handlePreview(file) {
      console.log(file);
    },
    /** 查询团体提案列表 */
    getList() {
      this.loading = true;
      listProposal(this.queryParams).then((response) => {
        this.proposalList = response.rows;
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
        name: undefined,
        organizer: undefined,
        proposalQuality: undefined,
        phone: undefined,
        company: undefined,
        content: undefined,
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
      this.imgList = [];
      this.reset();
      this.open = true;
      this.title = "添加团体提案";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.imgList = [];
      this.reset();
      const id = row.id || this.ids;
      getProposal(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改团体提案";
        let objImg = new Object();
        objImg.name = "";
        objImg.url = this.contextPath + this.form.titleIcon;
        // this.imgList.push(objImg);
        if (this.form.titleIcon == null) {
          this.imgList = [];
          return false;
        }
        if (this.imgList.length == 0) {
          this.imgList.push(objImg);
        }
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateProposal(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addProposal(this.form).then((response) => {
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
        '是否确认删除团体提案编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delProposal(ids);
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
      this.$confirm("是否确认导出所有团体提案数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportProposal(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
