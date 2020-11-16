<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提交时间" prop="submitTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.submitTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择提交时间">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="类别" prop="category">
        <el-input
          v-model="queryParams.category"
          placeholder="请输入类别"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['enterprise:demand:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['enterprise:demand:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['enterprise:demand:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['enterprise:demand:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="demandList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="标题图片" align="center" prop="titlePicture" >
      <template slot-scope="scope">
         <img :src="contextPath+scope.row.titlePicture" style="width: 50px; height: 50px;"/>
       </template>
      </el-table-column> 
      <el-table-column label="提交时间" align="center" prop="submitTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.submitTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类别" align="center" prop="category" /> -->
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="公司地址" align="center" prop="address" />
      <el-table-column label="电子邮箱" align="center" prop="email" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['enterprise:demand:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['enterprise:demand:remove']"
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

    <!-- 添加或修改供求信息对话框 -->
    <el-dialog :title="title" :visible.sync="open"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="标题图片" prop="titlePicture">
         <!-- <el-input v-model="form.titlePicture" placeholder="请输入标题图片" /> -->
          <el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview"
            :on-remove="imgRemove"
            :http-request = "imgUpload"
            :file-list="imgList"
             :limit="1"
            list-type="picture">
            <el-button size="small" type="primary">上传<i class="el-icon-picture el-icon--right"></i></el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="提交时间" prop="submitTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.submitTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择提交时间">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="类别" prop="category">
          <el-input v-model="form.category" placeholder="请输入类别" />
        </el-form-item> -->
        <el-form-item label="正文" prop="content">
          <Editor v-model="form.content" type="textarea" placeholder="请输入内容" />
          <!-- <input v-model="form.category" type="hidden"> -->
          <!-- </input> -->
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" style="margin-top:7.5rem;">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮箱" />
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
import { listDemand, getDemand, delDemand, addDemand, updateDemand, exportDemand } from "@/api/enterprise/demand";
import Editor from '@/components/Editor';
import {uploadFile} from "@/api/tool/fileUpload"
export default {
  name: "Demand",
  components: {
    Editor
  },
  data() {
    return {
      imgList:[],
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
      // 供求信息表格数据
      demandList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        titlePicture: undefined,
        submitTime: undefined,
        category: undefined,
        content: undefined,
        phone: undefined,
        address: undefined,
        email: undefined,
        sort: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        titlePicture: [
          { required: true, message: "标题图片不能为空", trigger: "blur" }
        ],
        submitTime: [
          { required: true, message: "提交时间不能为空", trigger: "blur" }
        ],
        category: [
          { required: true, message: "类别（供给信息）不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "正文不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "公司地址不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "电子邮箱不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    imgUpload(data){
      let formData = new FormData();
      formData.append("file", data.file);
      uploadFile(formData).then(response => {
            console.log(response)
          this.form.titlePicture = response.fileName;

      });
    },
    //删除图片时的操作
    imgRemove(){
         this.form.titlePicture = undefined ;
    },
    handlePreview(file) {
       console.log(file);
    },
    /** 查询供求信息列表 */
    getList() {
      this.loading = true;
      listDemand(this.queryParams).then(response => {
        this.demandList = response.rows;
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
        titlePicture: undefined,
        submitTime: undefined,
        category: undefined,
        content: undefined,
        phone: undefined,
        address: undefined,
        email: undefined,
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
       this.imgList = [];
      this.reset();
      this.open = true;
      this.title = "添加供求信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.imgList = [];
      this.reset();
      const id = row.id || this.ids
      getDemand(id).then(response => {
        console.log(response)
        console.log(this.form.category)
        this.form = response.data;
        this.open = true;
        this.title = "修改供求信息";
        let objImg = new Object();
        objImg.name =  '';
        objImg.url = this.contextPath+this.form.titlePicture;
        this.imgList.push(objImg)
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            this.form.category="供求信息"
            updateDemand(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            this.form.category="供求信息"
            addDemand(this.form).then(response => {
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
      this.$confirm('是否确认删除供求信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDemand(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有供求信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDemand(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
