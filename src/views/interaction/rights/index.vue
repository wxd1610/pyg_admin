<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="回复状态" prop="readStatus">
        <el-select v-model="queryParams.readStatus" placeholder="请选择是否回复">
          <el-option
            v-for="item in readStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.publishTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择发布时间"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="回复人" prop="replyPersion">
        <el-input
          v-model="queryParams.replyPersion"
          placeholder="请输入回复人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="回复时间" prop="replyTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.replyTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择回复时间"
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
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['interaction:rights:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['interaction:rights:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="rightsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="手机号码" align="center" prop="mobile" />
      <el-table-column label="填写类型" align="center" prop="type_dictText" />
      <el-table-column label="公开意愿" align="center" prop="publicWish">
        <template slot-scope="scope">
          <span v-if="scope.row.publicWish==0">不公开</span>
          <span v-if="scope.row.publicWish==1">公开</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复人" align="center" prop="replyPersion_dictText" />
      <el-table-column label="回复时间" align="center" prop="replyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.replyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否公开" align="center" prop="publicFlag">
        <template slot-scope="scope">
          <span v-if="scope.row.publicFlag==0">不公开</span>
          <span v-if="scope.row.publicFlag==1">公开</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="回复状态" align="center" prop="readStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.readStatus==0" style="color: #FF0000">未回复</span>
          <span v-if="scope.row.readStatus==1" style="color: #00ff00">已回复</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['interaction:rights:edit']"
          >回复</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['interaction:rights:remove']"
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

    <!-- 添加或修改法律维权对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <template slot-scope="scope">
            <span readonly="true">{{form.name}}</span>
          </template>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <!-- <el-input v-model="form.mobile" readonly="true" /> -->
          <template slot-scope="scope">
            <span readonly="true">{{form.mobile}}</span>
          </template>
        </el-form-item>
        <el-form-item label="填写类型">
          <el-select v-model="form.type" placeholder="请选择填写类型">
            <el-option label="咨询投诉" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="维权内容" prop="content">
          <!-- <el-input v-model="form.content" type="textarea" readonly="true" /> -->
          <template slot-scope="scope">
            <span readonly="true">{{form.content}}</span>
          </template>
        </el-form-item>
        <el-form-item label="附件" prop="attachmentPath">
          <a
            :href="contextPath+form.attachmentPath"
            download
            target="_blank"
            style="color: #1890FF;"
          >{{form.attachmentName}}</a>
        </el-form-item>
        <el-form-item label="公开意愿" prop="publicWish">
          <template slot-scope="scope">
            <span v-if="form.publicWish==0">不公开</span>
            <span v-if="form.publicWish==1">公开</span>
          </template>
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            readonly="true"
            v-model="form.publishTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发布时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="回复人" prop="replyPersion_dictText" v-if="huifuren">
          <el-input v-model="form.replyPersion_dictText" readonly="true" />
        </el-form-item>
        <el-form-item label="回复时间" prop="replyTime" v-if="huifutime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.replyTime"
            type="date"
            readonly="true"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择回复时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="回复内容" prop="replyContent">
          <el-input v-model="form.replyContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="公开标记" prop="publicFlag">
          <el-select v-model="form.publicFlag" placeholder="请选择是否公开">
            <el-option
              v-for="item in publicFlags"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
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
  listRights,
  getRights,
  delRights,
  addRights,
  updateRights,
  exportRights,
} from "@/api/interaction/rights";

export default {
  name: "Rights",
  data() {
    return {
      readStatus: [
        {
          value: "0",
          label: "未回复",
        },
        {
          value: "1",
          label: "已回复",
        },
      ],
      publicFlags: [
        {
          value: 0,
          label: "不公开",
        },
        {
          value: 1,
          label: "公开",
        },
      ],
      huifuren: true,
      huifutime: true,
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
      // 法律维权表格数据
      rightsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        mobile: undefined,
        type: undefined,
        content: undefined,
        attachmentPath: undefined,
        attachmentName: undefined,
        publicWish: undefined,
        publishTime: undefined,
        replyPersion: undefined,
        replyTime: undefined,
        replyContent: undefined,
        publicFlag: undefined,
        sort: undefined,
        readStatus: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        mobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
        ],
        type: [
          {
            required: true,
            message: "填写类型（1咨询投诉）不能为空",
            trigger: "blur",
          },
        ],
        content: [
          { required: true, message: "维权内容不能为空", trigger: "blur" },
        ],
        publicWish: [
          {
            required: true,
            message: "公开意愿（0不公开 1公开）不能为空",
            trigger: "blur",
          },
        ],
        publishTime: [
          { required: true, message: "发布时间不能为空", trigger: "blur" },
        ],
        publicFlag: [
          {
            required: true,
            message: "公开标记（0不公开 1公开）不能为空",
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
    /** 查询法律维权列表 */
    getList() {
      this.loading = true;
      listRights(this.queryParams).then((response) => {
        console.log(response)
        this.rightsList = response.rows;
        for(var x in  this.rightsList ){
          if(this.rightsList[x].sort==null){
            this.rightsList[x].sort = 0
          }
        }
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
        name: undefined,
        mobile: undefined,
        type: undefined,
        content: undefined,
        attachmentPath: undefined,
        attachmentName: undefined,
        publicWish: undefined,
        publishTime: undefined,
        replyPersion: undefined,
        replyTime: undefined,
        replyContent: undefined,
        publicFlag: undefined,
        sort: undefined,
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
      this.title = "添加法律维权";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      if (row.readStatus == '0') {
        this.huifuren = false;
        this.huifutime = false;
      }
      if (row.readStatus == '1') {
        this.huifuren = true;
        this.huifutime = true;
      }
      this.open = true
      this.reset();
      const id = row.id || this.ids;
      getRights(id).then((response) => {
        console.log(response);
        this.form = response.data;
        //  for(var x in  this.form ){
          if(this.form.sort==null){
            this.form.sort = 0
          }
        // }
        this.open = true;
        this.title = "修改法律维权";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateRights(this.form).then((response) => {
              console.log(this.form);
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addRights(this.form).then((response) => {
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
        '是否确认删除法律维权编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delRights(ids);
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
      this.$confirm("是否确认导出所有法律维权数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportRights(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
