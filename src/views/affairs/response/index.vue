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
      <!-- <el-form-item label="签发人" prop="issuer">
        <el-input
          v-model="queryParams.issuer"
          placeholder="请输入签发人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="contactPerson">
        <el-input
          v-model="queryParams.contactPerson"
          placeholder="请输入联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回复单位" prop="replyCompany">
        <el-input
          v-model="queryParams.replyCompany"
          placeholder="请输入回复单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回复时间" prop="replyTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.replyTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择回复时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">
          <el-option label="请选择字典生成" value />
        </el-select>
      </el-form-item>
      <el-form-item label="通过状态" prop="passStatus">
        <el-select v-model="queryParams.passStatus" placeholder="请选择通过状态" clearable size="small">
          <el-option
            v-for="item in passStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
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
          v-hasPermi="['affairs:response:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['affairs:response:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['affairs:response:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['affairs:response:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="responseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="签发人" align="center" prop="issuer" />
      <el-table-column label="联系人" align="center" prop="contactPerson" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="回复单位" align="center" prop="replyCompany" />
      <el-table-column label="回复时间" align="center" prop="replyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.replyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type">提案答复
      </el-table-column>
      <!-- <el-table-column label="回复内容" align="center" prop="replyContent" /> -->
      <el-table-column label="通过状态" align="center" prop="passStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.passStatus == 0">不通过</span>
          <span v-if="scope.row.passStatus == 1">通过</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['affairs:response:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['affairs:response:remove']"
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

    <!-- 添加或修改提案答复对话框 -->
    <el-dialog :title="title" :visible.sync="open"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="签发人" prop="issuer">
          <el-input v-model="form.issuer" placeholder="请输入签发人" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="回复单位" prop="replyCompany">
          <el-input v-model="form.replyCompany" placeholder="请输入回复单位" />
        </el-form-item>
        <el-form-item label="回复时间" prop="replyTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.replyTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择回复单位"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="类型" rop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              key="提案答复"
              label="提案答复"
              value="提案答复"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回复内容" prop="replyContent">
          <el-input v-model="form.replyContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="通过状态">
          <el-radio-group v-model="form.passStatus">
            <el-radio v-for="item in passStatus" :label="item.value">{{item.label}}</el-radio>
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
import {
  listResponse,
  getResponse,
  delResponse,
  addResponse,
  updateResponse,
  exportResponse,
} from "@/api/affairs/response";

export default {
  name: "Response",
  data() {
    return {
      passStatus: [],
      typeList: [],
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
      // 提案答复表格数据
      responseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        proposalId: undefined,
        title: undefined,
        issuer: undefined,
        contactPerson: undefined,
        phone: undefined,
        replyCompany: undefined,
        replyTime: undefined,
        type: undefined,
        replyContent: undefined,
        passStatus: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        proposalId: [
          { required: true, message: "团体提案ID不能为空", trigger: "blur" },
        ],
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        issuer: [
          { required: true, message: "签发人不能为空", trigger: "blur" },
        ],
        contactPerson: [
          { required: true, message: "联系人不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
        ],
        replyCompany: [
          { required: true, message: "回复单位不能为空", trigger: "blur" },
        ],
        replyTime: [
          { required: true, message: "回复时间不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
        replyContent: [
          { required: true, message: "回复内容不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    var proposalId = this.getQueryValue("id");
    this.form.proposalId = proposalId;
    this.queryParams.proposalId = proposalId;
    this.getDictList("service_type").then((response) => {
      var datas = response.data;
      for (var i = 0; i < datas.length; i++) {
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
        this.typeList.push(obj);
      }
      console.log(this.typeList);
    });
    this.getDictList("pass_status").then((response) => {
      var datas = response.data;
      for (var i = 0; i < datas.length; i++) {
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
        this.passStatus.push(obj);
      }
      console.log(this.passStatus);
    });

    this.getList();
  },
  methods: {
    /** 查询提案答复列表 */
    getList() {
      this.loading = true;
      listResponse(this.queryParams).then((response) => {
        console.log(response);
        this.responseList = response.rows;
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
        proposalId: undefined,
        title: undefined,
        issuer: undefined,
        contactPerson: undefined,
        phone: undefined,
        replyCompany: undefined,
        replyTime: undefined,
        type: undefined,
        replyContent: undefined,
        passStatus: "0",
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
      this.reset();
      this.open = true;
      this.title = "添加提案答复";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getResponse(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改提案答复";
        if (this.form.titlePicture == null) {
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
      var proposalId = this.getQueryValue("id");
      this.form.proposalId = proposalId;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateResponse(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addResponse(this.form).then((response) => {
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
        '是否确认删除提案答复编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delResponse(ids);
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
      this.$confirm("是否确认导出所有提案答复数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportResponse(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
