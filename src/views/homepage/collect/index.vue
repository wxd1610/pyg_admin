<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <!-- <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布单位" prop="publishCompany">
        <el-input
          v-model="queryParams.publishCompany"
          placeholder="请输入发布单位"
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
      </el-form-item> -->
      <el-form-item label="采集标题" prop="collectTitle">
        <el-input
          v-model="queryParams.collectTitle"
          placeholder="请输入采集标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="是否可用" prop="enable" >
        <el-select v-model="queryParams.enable" placeholder="请选择是否可用"  style="width:100%">
          <el-option
            v-for="item in enables"
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
          v-hasPermi="['homepage:collect:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['homepage:collect:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['homepage:collect:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['homepage:collect:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="collectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <!-- <el-table-column label="正文" align="center" prop="body" /> -->
      <el-table-column label="发布单位" align="center" prop="publishCompany" />
      <el-table-column label="发布日期" align="center" prop="publishDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采集标题" align="center" prop="collectTitle" />
      <el-table-column label="是否可用" align="center" prop="enable">
        <template slot-scope="scope">
          <span v-if="scope.row.enable == 1">可用</span>
          <span v-if="scope.row.enable == 0">不可用</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" show-overflow-tooltip align="center" prop="remark" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['homepage:collect:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['homepage:collect:remove']"
          >删除</el-button>

          <router-link
            :to="'form?collectId=' + scope.row.id"
            class="el-icon-setting"
            style="margin-left: 10px;color: #1890FF;"
          >
            <span>采集表单</span>
          </router-link>

          <router-link
            :to="'feedback?collectId='+ scope.row.id"
            class="el-icon-document"
            style="margin-left: 10px;color: #1890FF;"
          >
            <span>采集反馈</span>
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

    <!-- 添加或修改信息采集对话框 -->
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
        <el-form-item label="正文" prop="body">
          <Editor v-model="form.body" />
        </el-form-item>
        <el-form-item label="发布单位" prop="publishCompany" style="margin-top:7.5rem;">
          <el-input v-model="form.publishCompany" placeholder="请输入发布单位" />
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker
            clearable
            size="small"
            style="width: 100%"
            v-model="form.publishDate"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发布日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="采集标题" prop="collectTitle">
          <el-input v-model="form.collectTitle" placeholder="请输入采集标题" />
        </el-form-item>
        <el-form-item label="是否可用" prop="enable">
          <el-select v-model="form.enable" placeholder="请选择是否可用" style="width：100%">
            <el-option
              v-for="item in enables"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
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
  listCollect,
  getCollect,
  delCollect,
  addCollect,
  updateCollect,
  exportCollect,
} from "@/api/homepage/collect";
import Editor from "@/components/Editor";
export default {
  name: "Collect",
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
      // 信息采集表格数据
      collectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        body: undefined,
        publishCompany: undefined,
        publishDate: undefined,
        collectTitle: undefined,
        enable: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        body: [{ required: true, message: "正文不能为空", trigger: "blur" }],
        publishDate: [
          { required: true, message: "发布日期不能为空", trigger: "blur" },
        ],
        collectTitle: [
          { required: true, message: "采集标题不能为空", trigger: "blur" },
        ],
        enable: [
          {
            required: true,
            message: "是否可用（1可用0不可以）不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    setFrom() {
      //window.href= 'homepage/form'
    },
    /** 查询信息采集列表 */
    getList() {
      this.loading = true;
      listCollect(this.queryParams).then((response) => {
        console.log(response)
        this.collectList = response.rows;
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
        body: undefined,
        publishCompany: undefined,
        publishDate: undefined,
        collectTitle: undefined,
        enable: undefined,
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
      this.title = "添加信息采集";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCollect(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改信息采集";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateCollect(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addCollect(this.form).then((response) => {
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
        '是否确认删除信息采集编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delCollect(ids);
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
      this.$confirm("是否确认导出所有信息采集数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportCollect(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
