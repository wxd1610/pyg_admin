<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" >
      <el-form-item label="标志名称" prop="logoName">
        <el-input
          v-model="queryParams.logoName"
          placeholder="请输入标志名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主要职能" prop="mainFunctions">
        <el-input
          v-model="queryParams.mainFunctions"
          placeholder="请输入主要职能"
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
          v-hasPermi="['association:introduction:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['association:introduction:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['association:introduction:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['association:introduction:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="introductionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标志图标" align="center" prop="logo" >
             <template slot-scope="scope">
                <img :src="contextPath+scope.row.logo" style="width: 50px; height: 50px;"/>
              </template>
      </el-table-column>
      <el-table-column label="标志名称" align="center" prop="logoName" />
      <el-table-column label="标志意义" :show-overflow-tooltip="true" align="center" prop="logoMeaning" />
      <el-table-column label="主要职能" :show-overflow-tooltip="true" align="center" prop="mainFunctions" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['association:introduction:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['association:introduction:remove']"
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

    <!-- 添加或修改本会介绍对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
     <!--   <el-form-item label="标志图标" prop="logo">
          <el-input v-model="form.logo" placeholder="请输入标志图标" />
        </el-form-item> -->
        <el-form-item label="标志图标" prop="logo">
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
        <el-form-item label="标志名称" prop="logoName">
          <el-input v-model="form.logoName" placeholder="请输入标志名称" />
        </el-form-item>
        <el-form-item label="标志意义" prop="logoMeaning">
          <el-input v-model="form.logoMeaning"   type="textarea" placeholder="请输入标志意义" />
        </el-form-item>
        <el-form-item label="章程" prop="rules">
          <Editor v-model="form.rules"    placeholder="请输入中国工商业联合会章程" />
        </el-form-item>
        <el-form-item label="主要职能" prop="mainFunctions" style="margin-top:7.5rem;">
          <el-input v-model="form.mainFunctions"   type="textarea" placeholder="请输入主要职能" />
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
import { listIntroduction, getIntroduction, delIntroduction, addIntroduction, updateIntroduction, exportIntroduction } from "@/api/association/introduction";
import {uploadFile} from "@/api/tool/fileUpload";
import Editor from '@/components/Editor';
export default {
  name: "Introduction",
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
      // 本会介绍表格数据
      introductionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        logo: undefined,
        logoName: undefined,
        logoMeaning: undefined,
        rules: undefined,
        mainFunctions: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        logo: [
          { required: true, message: "标志图标不能为空", trigger: "blur" }
        ],
        logoName: [
          { required: true, message: "标志名称不能为空", trigger: "blur" }
        ],
        logoMeaning: [
          { required: true, message: "标志意义不能为空", trigger: "blur" }
        ],
        rules: [
          { required: true, message: "中国工商业联合会章程不能为空", trigger: "blur" }
        ],
        mainFunctions: [
          { required: true, message: "主要职能不能为空", trigger: "blur" }
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
          this.form.logo = response.fileName;

      });
    },
    //删除图片时的操作
    imgRemove(){
         this.form.logo = undefined ;
    },
    handlePreview(file) {
       console.log(file);
    },
    /** 查询本会介绍列表 */
    getList() {
      this.loading = true;
      listIntroduction(this.queryParams).then(response => {
        this.introductionList = response.rows;
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
        logo: undefined,
        logoName: undefined,
        logoMeaning: undefined,
        rules: undefined,
        mainFunctions: undefined,
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
      this.title = "添加本会介绍";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.imgList = [];
      this.reset();
      const id = row.id || this.ids
      getIntroduction(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改本会介绍";
        let objImg = new Object();
        objImg.name =  '';
        objImg.url = this.contextPath+this.form.logo;
        this.imgList.push(objImg)
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateIntroduction(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addIntroduction(this.form).then(response => {
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
      this.$confirm('是否确认删除本会介绍编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delIntroduction(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有本会介绍数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportIntroduction(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
