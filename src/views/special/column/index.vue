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
      <el-form-item label="信息来源" prop="infoSource">
        <el-input
          v-model="queryParams.infoSource"
          placeholder="请输入信息来源"
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
          v-hasPermi="['special:column:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['special:column:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['special:column:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['special:column:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="columnList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题图片路径" width="200" align="center" prop="titlePicture">
        <template slot-scope="scope">
          <img :src="contextPath+scope.row.titlePicture" style="width: 50px; height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" width="200" prop="title" />
      <el-table-column label="发布日期" align="center" prop="publishDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信息来源" align="center" width="180" prop="infoSource" />
      <!--   <el-table-column label="文字新闻" align="center" prop="textnewsIds" />
      <el-table-column label="图片新闻" align="center" prop="picturenewsIds" />
      <el-table-column label="本网专栏" align="center" prop="columnIds" />
      <el-table-column label="图片报道" align="center" prop="reportIds" />
      <el-table-column label="图片现场" align="center" prop="sceneIds" />-->
      <el-table-column label="排序" align="center" width="180" prop="sort" />
      <el-table-column label="操作" align="center" width="600" class-name="small-padding fixed-width">
        <!-- 最终关联新闻的信息将在文章article表中remark中保存-->
        <template slot-scope="scope">
          <router-link
            :to="{path:'../article', query:{remark:'textNews'+scope.row.id,text:'文字新闻'}}"
            class="el-icon-setting"
            style="margin-left: 10px;color: #1890FF;"
          >
            <span class="label-new">文字新闻</span>
          </router-link>

          <router-link
            :to="{path:'../article', query:{remark:'imgNews'+scope.row.id,text:'图片新闻'}}"
            class="el-icon-setting"
            style="margin-left: 10px;color: #1890FF;"
          >
            <span class="label-new">图片新闻</span>
          </router-link>

          <router-link
            :to="{path:'../article', query:{remark:'thisColumn'+scope.row.id,text:'本网专栏'}}"
            class="el-icon-setting"
            style="margin-left: 10px;color: #1890FF;"
          >
            <span class="label-new">本网专栏</span>
          </router-link>

          <router-link
            :to="{path:'../article', query:{remark:'imgReports'+scope.row.id,text:'图片报道'}}"
            class="el-icon-setting"
            style="margin-left: 10px;color: #1890FF;"
          >
            <span class="label-new">图片报道</span>
          </router-link>

          <router-link
            :to="{path:'../article', query:{remark:'imgScene'+scope.row.id,text:'图片现场'}}"
            class="el-icon-setting"
            style="margin-left: 10px;color: #1890FF;"
          >
            <span class="label-new">图片现场</span>
          </router-link>&nbsp; &nbsp;
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['special:column:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['special:column:remove']"
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

    <!-- 添加或修改专题专栏对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题图片" prop="titlePicture">
          <el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview"
            :on-remove="imgRemove"
            :http-request="imgUpload"
            :file-list="imgList"
            list-type="picture"
          >
            <!-- :limit="2" -->
            <el-button size="small" type="primary">
              上传
              <i class="el-icon-picture el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <Editor v-model="form.content" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate" style="margin-top:7.5rem;">
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
        <el-form-item label="信息来源" prop="infoSource">
          <el-input v-model="form.infoSource" placeholder="请输入信息来源" />
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
  listColumn,
  getColumn,
  delColumn,
  addColumn,
  updateColumn,
  exportColumn,
} from "@/api/special/column";
import { uploadFile } from "@/api/tool/fileUpload";
import Editor from "@/components/Editor";
export default {
  name: "Column",
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
      // 专题专栏表格数据
      columnList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        titlePicture: undefined,
        title: undefined,
        summary: undefined,
        content: undefined,
        publishDate: undefined,
        infoSource: undefined,
        textnewsIds: undefined,
        picturenewsIds: undefined,
        columnIds: undefined,
        reportIds: undefined,
        sceneIds: undefined,
        sort: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        content: [{ required: true, message: "内容不能为空", trigger: "blur" }],
        publishDate: [
          { required: true, message: "发布日期不能为空", trigger: "blur" },
        ],
        infoSource: [
          { required: true, message: "信息来源不能为空", trigger: "blur" },
        ],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //上传图片
    imgUpload(data) {
      // console.log(1);
      // console.log(data);
      this.imgList = [];
      let formData = new FormData();
      formData.append("file", data.file);
      uploadFile(formData).then((response) => {
        // console.log(response);
        this.form.titlePicture = response.fileName;
        // console.log(this.form);
        let objImg = new Object();
        objImg.name = "";
        objImg.url = this.contextPath + this.form.titlePicture;
        if (this.imgList.length == 0) {
          this.imgList.push(objImg);
        }
      });
    },
    //删除图片时的操作
    imgRemove() {
      // console.log(111111);
      this.form.titlePicture = undefined;
    },
    aaa() {
      this.imgRemove();
    },
    handlePreview(file) {
      // console.log(file)
    },
    /** 查询专题专栏列表 */
    getList() {
      this.loading = true;
      listColumn(this.queryParams).then((response) => {
        // console.log(response);
        this.columnList = response.rows;
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
        titlePicture: undefined,
        title: undefined,
        summary: undefined,
        content: undefined,
        publishDate: undefined,
        infoSource: undefined,
        textnewsIds: undefined,
        picturenewsIds: undefined,
        columnIds: undefined,
        reportIds: undefined,
        sceneIds: undefined,
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
      this.imgList = [];
      this.reset();
      this.open = true;
      this.title = "添加专题专栏";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.imgList = [];
      console.log(this.imgList);
      this.reset();
      const id = row.id || this.ids;
      getColumn(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改专题专栏";
        let objImg = new Object();
        objImg.name = "";
        objImg.url = this.contextPath + this.form.titlePicture;
        console.log(this.form.titlePicture);
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
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateColumn(this.form).then((response) => {
              // console.log(response);
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            // console.log(this.form);
            addColumn(this.form)
              .then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              })
              .catch((res) => {
                console.log(res);
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除专题专栏编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delColumn(ids);
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
      this.$confirm("是否确认导出所有专题专栏数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportColumn(queryParams);
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
.label-new {
  font-size: 6px;
}
</style>
