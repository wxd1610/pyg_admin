<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="接受公文id" prop="receiveDocumentId">
        <el-input
          v-model="queryParams.receiveDocumentId"
          placeholder="请输入接受公文id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回复人" prop="replier">
        <el-input
          v-model="queryParams.replier"
          placeholder="请输入回复人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回复时间" prop="replyTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.replyTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择回复时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="查阅状态" prop="readStatus">
        <el-select v-model="queryParams.readStatus" placeholder="请选择查阅状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
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
          v-hasPermi="['sendreceive:reply:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sendreceive:reply:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sendreceive:reply:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['sendreceive:reply:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="replyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="接受公文id" align="center" prop="receiveDocumentId" />
      <el-table-column label="回复人" align="center" prop="replier" />
      <el-table-column label="回复内容" align="center" prop="replyContent" />
      <el-table-column label="附件" align="center" prop="attachment" />
      <el-table-column label="回复时间" align="center" prop="replyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.replyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="查阅状态" align="center" prop="readStatus" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sendreceive:reply:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sendreceive:reply:remove']"
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

    <!-- 添加或修改公文回复对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接受公文id" prop="receiveDocumentId">
          <el-input v-model="form.receiveDocumentId" placeholder="请输入接受公文id" />
        </el-form-item>
        <el-form-item label="回复人" prop="replier">
          <el-input v-model="form.replier" placeholder="请输入回复人" />
        </el-form-item>
        <el-form-item label="回复内容" prop="replyContent">
          <el-input v-model="form.replyContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="附件" prop="attachment">
          <el-input v-model="form.attachment" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="回复时间" prop="replyTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.replyTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择回复时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="查阅状态">
          <el-radio-group v-model="form.readStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
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
import { listReply, getReply, delReply, addReply, updateReply, exportReply } from "@/api/sendreceive/reply";

export default {
  name: "Reply",
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
      // 公文回复表格数据
      replyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        receiveDocumentId: undefined,
        replier: undefined,
        replyContent: undefined,
        attachment: undefined,
        replyTime: undefined,
        readStatus: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        receiveDocumentId: [
          { required: true, message: "接受公文id不能为空", trigger: "blur" }
        ],
        replier: [
          { required: true, message: "回复人不能为空", trigger: "blur" }
        ],
        replyContent: [
          { required: true, message: "回复内容不能为空", trigger: "blur" }
        ],
        replyTime: [
          { required: true, message: "回复时间不能为空", trigger: "blur" }
        ],
        readStatus: [
          { required: true, message: "查阅状态（1已阅、0未阅）不能为空", trigger: "blur" }
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
    /** 查询公文回复列表 */
    getList() {
      this.loading = true;
      listReply(this.queryParams).then(response => {
        this.replyList = response.rows;
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
        receiveDocumentId: undefined,
        replier: undefined,
        replyContent: undefined,
        attachment: undefined,
        replyTime: undefined,
        readStatus: "0",
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
      this.title = "添加公文回复";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReply(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公文回复";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateReply(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addReply(this.form).then(response => {
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
      this.$confirm('是否确认删除公文回复编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delReply(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有公文回复数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportReply(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>