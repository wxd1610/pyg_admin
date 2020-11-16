<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属企业" prop="enterprise">
        <el-input
          v-model="queryParams.enterprise"
          placeholder="请输入所属企业"
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
          v-hasPermi="['enterprise:enterpriser:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['enterprise:enterpriser:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['enterprise:enterpriser:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['enterprise:enterpriser:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="enterpriserList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="头像" align="center" prop="photo">
      <template slot-scope="scope">
         <img :src="contextPath+scope.row.photo" style="width: 50px; height: 50px;"/>
       </template>
       </el-table-column>
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="所属企业" align="center" prop="enterprise" />
      <el-table-column label="企业官网" align="center" prop="website" >
      <template slot-scope="scope">
         <a style="color: #0366D6;" :href="scope.row.website" target="_blank" >{{scope.row.website}}</a>
       </template>
      </el-table-column>
      <el-table-column label="浏览次数" align="center" prop="showTimes" />
      <el-table-column label="企业类型" align="center" prop="enterpriseType">
        <template slot-scope="scope">
          <span v-for="eType in enterpriserTypeList" v-if="eType.value == scope.row.enterpriseType ">
            {{eType.label}}
          </span>
         </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['enterprise:enterpriser:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['enterprise:enterpriser:remove']"
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

    <!-- 添加或修改领军人物对话框 -->
    <el-dialog :title="title" :visible.sync="open"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="头像" prop="photo">
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="所属企业" prop="enterprise">
          <el-input v-model="form.enterprise" placeholder="请输入所属企业" />
        </el-form-item>
        <el-form-item label="企业官网" prop="website">
          <el-input v-model="form.website" placeholder="请输入企业官网" />

        </el-form-item>
        <el-form-item label="浏览次数" prop="showTimes">
          <el-input v-model="form.showTimes" placeholder="请输入浏览次数" />
        </el-form-item>
        <el-form-item label="企业类型">
          <el-select v-model="form.enterpriseType" placeholder="请选择企业类型">
                <el-option
                  v-for="item in enterpriserTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信息来源" prop="infoSource">
          <el-input v-model="form.infoSource" placeholder="请输入信息来源" />
        </el-form-item>
        <el-form-item label="主营项目" prop="mainBusiness">
          <el-input v-model="form.mainBusiness"  type="textarea" placeholder="请输入主营项目" />
        </el-form-item>
        <el-form-item label="公司地址" prop="companyAddress">
          <el-input v-model="form.companyAddress" type="textarea" placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <Editor v-model="form.introduction"  placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序" prop="sort" style="margin-top:7.5rem;">
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
import { listEnterpriser, getEnterpriser, delEnterpriser, addEnterpriser, updateEnterpriser, exportEnterpriser } from "@/api/enterprise/enterpriser";
import Editor from '@/components/Editor';
import {uploadFile} from "@/api/tool/fileUpload"
export default {
  name: "Enterpriser",
  components: {
    Editor
  },
  data() {
    return {
       imgList:[],
       enterpriserTypeList:[],
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
      // 领军人物表格数据
      enterpriserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        photo: undefined,
        name: undefined,
        enterprise: undefined,
        website: undefined,
        showTimes: undefined,
        enterpriseType: undefined,
        infoSource: undefined,
        mainBusiness: undefined,
        companyAddress: undefined,
        introduction: undefined,
        sort: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        photo: [
          { required: true, message: "头像不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        enterprise: [
          { required: true, message: "所属企业不能为空", trigger: "blur" }
        ],
        website: [
          { required: true, message: "企业官网不能为空", trigger: "blur" }
        ],
        infoSource: [
          { required: true, message: "信息来源不能为空", trigger: "blur" }
        ],
        mainBusiness: [
          { required: true, message: "主营项目不能为空", trigger: "blur" }
        ],
        companyAddress: [
          { required: true, message: "公司地址不能为空", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "简介不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDictList('enterpriserType').then(response => {
      var datas = response.data;
      for(var i=0;i<datas.length;i++){
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
         this.enterpriserTypeList.push(obj)
      }
    });
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
    /** 查询领军人物列表 */
    getList() {
      this.loading = true;
      listEnterpriser(this.queryParams).then(response => {
        this.enterpriserList = response.rows;
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
        photo: undefined,
        name: undefined,
        enterprise: undefined,
        website: undefined,
        showTimes: undefined,
        enterpriseType: undefined,
        infoSource: undefined,
        mainBusiness: undefined,
        companyAddress: undefined,
        introduction: undefined,
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
      this.title = "添加领军人物";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
       this.imgList = [];
      this.reset();
      const id = row.id || this.ids
      getEnterpriser(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改领军人物";
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
            updateEnterpriser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addEnterpriser(this.form).then(response => {
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
      this.$confirm('是否确认删除领军人物编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEnterpriser(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有领军人物数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportEnterpriser(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
