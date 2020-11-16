<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="商会名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入商会名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small" style="width: 200px">
         <el-option
           v-for="item in chamberType"
           :key="item.value"
           :label="item.label"
           :value="item.value">
         </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商会电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入商会电话"
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
          v-hasPermi="['association:chamber:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['association:chamber:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['association:chamber:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['association:chamber:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="chamberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商会名称" align="center" prop="name" />
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
              <span v-for="item in chamberType">
                <span v-if="scope.row.type== item.value">{{item.label}}</span>
              </span>
        </template>
      </el-table-column>
      <el-table-column label="商会电话" align="center" prop="phone" />
      <el-table-column label="邮编" align="center" prop="zipCode" />
      <el-table-column label="网站" align="center" prop="website">
        <template slot-scope="scope">
              <a :href="scope.row.website" target="_blank" style="color: #0366D6;">{{scope.row.website}}</a>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['association:chamber:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['association:chamber:remove']"
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

    <!-- 添加或修改直属商会对话框 -->
    <el-dialog :title="title" :visible.sync="open"  append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商会名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商会名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择类型">
               <el-option
                 v-for="item in chamberType"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商会简介" prop="introduction">
           <Editor v-model="form.introduction" placeholder="请输入商会简介"/>
        </el-form-item>
        <el-form-item label="商会电话" prop="phone" style="margin-top:7.5rem;">
          <el-input v-model="form.phone" placeholder="请输入商会电话" />
        </el-form-item>
        <el-form-item label="邮编" prop="zipCode">
          <el-input v-model="form.zipCode" placeholder="请输入邮编" />
        </el-form-item>
        <el-form-item label="网站" prop="website">
          <el-input v-model="form.website" placeholder="请输入网站" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
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
  import Editor from '@/components/Editor';
import { listChamber, getChamber, delChamber, addChamber, updateChamber, exportChamber } from "@/api/association/chamber";

export default {
  name: "Chamber",
  components: {
    Editor
  },
  data() {
    return {
      chamberType:[],
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
      // 直属商会表格数据
      chamberList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        type: undefined,
        introduction: undefined,
        phone: undefined,
        zipCode: undefined,
        website: undefined,
        address: undefined,
        sort: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "商会名称不能为空", trigger: "blur" }
        ],
        // type: [
        //   { required: true, message: "类型（行业、异地、其他）不能为空", trigger: "blur" }
        // ],
        introduction: [
          { required: true, message: "商会简介不能为空", trigger: "blur" }
        ],
        // phone: [
        //   { required: true, message: "商会电话不能为空", trigger: "blur" }
        // ],
        // zipCode: [
        //   { required: true, message: "邮编不能为空", trigger: "blur" }
        // ],
        // website: [
        //   { required: true, message: "网站不能为空", trigger: "blur" }
        // ],
        // address: [
        //   { required: true, message: "地址不能为空", trigger: "blur" }
        // ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDictList('commerce_chamber_type').then(response => {
      var datas = response.data;
      for(var i=0;i<datas.length;i++){
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
         this.chamberType.push(obj)
      }
    });
  },
  methods: {
    /** 查询直属商会列表 */
    getList() {
      this.loading = true;
      listChamber(this.queryParams).then(response => {
        this.chamberList = response.rows;
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
        type: undefined,
        introduction: undefined,
        phone: undefined,
        zipCode: undefined,
        website: undefined,
        address: undefined,
        sort: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined,
        remark: undefined
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
      this.title = "添加直属商会";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getChamber(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改直属商会";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateChamber(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addChamber(this.form).then(response => {
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
      this.$confirm('是否确认删除直属商会编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delChamber(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有直属商会数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportChamber(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
