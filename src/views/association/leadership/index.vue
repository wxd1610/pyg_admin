<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工商联职位" prop="positionGsl">
        <el-input
          v-model="queryParams.positionGsl"
          placeholder="请输入工商联职位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总商会职位" prop="positionZsh">
        <el-input
          v-model="queryParams.positionZsh"
          placeholder="请输入总商会职位"
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
          v-hasPermi="['association:leadership:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['association:leadership:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['association:leadership:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['association:leadership:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="leadershipList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="照片" align="center" prop="photo">
      <template slot-scope="scope">
         <img :src="contextPath+scope.row.photo" style="width: 50px; height: 50px;"/>
       </template>
       </el-table-column>
      <el-table-column label="工商联领导标记" align="center" prop="isGsl">
       <template slot-scope="scope">
            <span v-if="scope.row.isGsl == 1">是</span>
            <span v-if="scope.row.isGsl == 0">否</span>
       </template>
       </el-table-column>
      <el-table-column label="工商联排序" align="center" prop="sortGsl" />
      <el-table-column label="工商联职位" align="center" prop="positionGsl" />
      <el-table-column label="总商会领导标记" align="center" prop="isZsh">
      <template slot-scope="scope">
           <span v-if="scope.row.isZsh == 1">是</span>
           <span v-if="scope.row.isZsh == 0">否</span>
      </template>
      </el-table-column>
      <el-table-column label="总商会排序" align="center" prop="sortZsh" />
      <el-table-column label="总商会职位" align="center" prop="positionZsh" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['association:leadership:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['association:leadership:remove']"
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

    <!-- 添加或修改领导之窗对话框 -->
    <el-dialog :title="title" :visible.sync="open"append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="照片" prop="photo">
         <!-- <el-input v-model="form.photo" placeholder="请输入照片" /> -->
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
        <el-form-item label="工商联领导标记" prop="isGsl">
          <el-select v-model="form.isGsl" placeholder="是否是工商联领导" style="width: 100%;">
              <el-option
                v-for="item in flags"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工商联排序" prop="sortGsl">
          <el-input v-model="form.sortGsl" placeholder="请输入工商联排序" />
        </el-form-item>
        <el-form-item label="工商联职位" prop="positionGsl">
          <el-input v-model="form.positionGsl" placeholder="请输入工商联职位" />
        </el-form-item>
        <el-form-item label="总商会领导标记" prop="isZsh">
          <el-select v-model="form.isZsh" placeholder="是否是总商会领导" style="width: 100%;">
              <el-option
                v-for="item in flags"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总商会排序" prop="sortZsh">
          <el-input v-model="form.sortZsh" placeholder="请输入总商会排序" />
        </el-form-item>
        <el-form-item label="总商会职位" prop="positionZsh">
          <el-input v-model="form.positionZsh" placeholder="请输入总商会职位" />
        </el-form-item>
        <el-form-item label="详情" prop="details">
          <Editor v-model="form.details" placeholder="请输入详情" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:5.5rem;">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLeadership, getLeadership, delLeadership, addLeadership, updateLeadership, exportLeadership } from "@/api/association/leadership";
import {uploadFile} from "@/api/tool/fileUpload"
import Editor from '@/components/Editor';
export default {
  name: "Leadership",
  components: {
    Editor
  },
  data() {
    return {
      flags:[{
          value: '0',
          label: '否'
        }, {
          value: '1',
          label: '是'
        }],
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
      // 领导之窗表格数据
      leadershipList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        photo: undefined,
        isGsl: undefined,
        sortGsl: undefined,
        positionGsl: undefined,
        isZsh: undefined,
        sortZsh: undefined,
        positionZsh: undefined,
        details: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        photo: [
          { required: true, message: "照片不能为空", trigger: "blur" }
        ],
        isGsl: [
          { required: true, message: "工商联领导标记不能为空", trigger: "blur" }
        ],
        sortGsl: [
          { required: true, message: "工商联排序不能为空", trigger: "blur" }
        ],
        positionGsl: [
          { required: true, message: "工商联职位不能为空", trigger: "blur" }
        ],
        isZsh: [
          { required: true, message: "总商会领导标记不能为空", trigger: "blur" }
        ],
        sortZsh: [
          { required: true, message: "总商会排序不能为空", trigger: "blur" }
        ],
        positionZsh: [
          { required: true, message: "总商会职位不能为空", trigger: "blur" }
        ],
        details: [
          { required: true, message: "详情不能为空", trigger: "blur" }
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
          this.form.photo = response.fileName;

      });
    },
    //删除图片时的操作
    imgRemove(){
         this.form.photo = undefined ;
    },
    handlePreview(file) {
       console.log(file);
    },
    /** 查询领导之窗列表 */
    getList() {
      this.loading = true;
      listLeadership(this.queryParams).then(response => {
        this.leadershipList = response.rows;
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
        photo: undefined,
        isGsl: undefined,
        sortGsl: undefined,
        positionGsl: undefined,
        isZsh: undefined,
        sortZsh: undefined,
        positionZsh: undefined,
        details: undefined,
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
      this.title = "添加领导之窗";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
       this.imgList = [];
      this.reset();
      const id = row.id || this.ids
      getLeadership(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改领导之窗";
        let objImg = new Object();
        objImg.name =  '';
        objImg.url = this.contextPath+this.form.photo;
        this.imgList.push(objImg)
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateLeadership(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addLeadership(this.form).then(response => {
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
      this.$confirm('是否确认删除领导之窗编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLeadership(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有领导之窗数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLeadership(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
