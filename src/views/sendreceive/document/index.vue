<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="头图片" prop="headPicture">
        <el-input
          v-model="queryParams.headPicture"
          placeholder="请输入头图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发文字号" prop="postShopName">
        <el-input
          v-model="queryParams.postShopName"
          placeholder="请输入发文字号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公文标题" prop="documentTitle">
        <el-input
          v-model="queryParams.documentTitle"
          placeholder="请输入公文标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主送机关" prop="lordSendUnit">
        <el-input
          v-model="queryParams.lordSendUnit"
          placeholder="请输入主送机关"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="印发机关" prop="issuedAuthority">
        <el-input
          v-model="queryParams.issuedAuthority"
          placeholder="请输入印发机关"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发送日期" prop="sendDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.sendDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择发送日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="印章id" prop="stampId">
        <el-input
          v-model="queryParams.stampId"
          placeholder="请输入印章id"
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
          v-hasPermi="['sendreceive:document:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sendreceive:document:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sendreceive:document:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['sendreceive:document:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="documentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="头图片" align="center" prop="headPicture" />
      <el-table-column label="发文字号" align="center" prop="postShopName" />
      <el-table-column label="公文标题" align="center" prop="documentTitle" />
      <el-table-column label="主送机关" align="center" prop="lordSendUnit" />
      <el-table-column label="正文" align="center" prop="documentBody" />
      <el-table-column label="印发机关" align="center" prop="issuedAuthority" />
      <el-table-column label="发送日期" align="center" prop="sendDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sendDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="印章id" align="center" prop="stampId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sendreceive:document:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sendreceive:document:remove']"
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

    <!-- 添加或修改公文对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="头图片" prop="headPicture">
          <el-input v-model="form.headPicture" placeholder="请输入头图片" />
        </el-form-item>
        <el-form-item label="发文字号" prop="postShopName">
          <el-input v-model="form.postShopName" placeholder="请输入发文字号" />
        </el-form-item>
        <el-form-item label="公文标题" prop="documentTitle">
          <el-input v-model="form.documentTitle" placeholder="请输入公文标题" />
        </el-form-item>
        <el-form-item label="主送机关" prop="lordSendUnit">
          <el-input v-model="form.lordSendUnit" placeholder="请输入主送机关" />
        </el-form-item>
        <el-form-item label="正文" prop="documentBody">
          <el-input v-model="form.documentBody" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="印发机关" prop="issuedAuthority">
          <el-input v-model="form.issuedAuthority" placeholder="请输入印发机关" />
        </el-form-item>
        <el-form-item label="发送日期" prop="sendDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.sendDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择发送日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="印章id" prop="stampId">
          <el-input v-model="form.stampId" placeholder="请输入印章id" />
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
import { listDocument, getDocument, delDocument, addDocument, updateDocument, exportDocument } from "@/api/sendreceive/document";

export default {
  name: "Document",
  data() {
    return {
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
      // 公文表格数据
      documentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        headPicture: undefined,
        postShopName: undefined,
        documentTitle: undefined,
        lordSendUnit: undefined,
        documentBody: undefined,
        issuedAuthority: undefined,
        sendDate: undefined,
        stampId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        documentTitle: [
          { required: true, message: "公文标题不能为空", trigger: "blur" }
        ],
        lordSendUnit: [
          { required: true, message: "主送机关不能为空", trigger: "blur" }
        ],
        documentBody: [
          { required: true, message: "正文不能为空", trigger: "blur" }
        ],
        issuedAuthority: [
          { required: true, message: "印发机关不能为空", trigger: "blur" }
        ],
        sendDate: [
          { required: true, message: "发送日期不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "修改时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询公文列表 */
    getList() {
      this.loading = true;
      listDocument(this.queryParams).then(response => {
        this.documentList = response.rows;
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
        headPicture: undefined,
        postShopName: undefined,
        documentTitle: undefined,
        lordSendUnit: undefined,
        documentBody: undefined,
        issuedAuthority: undefined,
        sendDate: undefined,
        stampId: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公文";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDocument(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公文";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDocument(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDocument(this.form).then(response => {
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
      this.$confirm('是否确认删除公文编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDocument(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有公文数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDocument(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>