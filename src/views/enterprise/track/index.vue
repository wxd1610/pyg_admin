<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" >
      <el-form-item label="服务类型" prop="serviceType">
        <el-select v-model="queryParams.serviceType" placeholder="请选择服务类型" clearable size="small">
         <el-option
           v-for="item in serviceTypes"
           :key="item.value"
           :label="item.label"
           :value="item.value">
         </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.publishTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择发布时间">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="提交时间" prop="submitTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.submitTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择提交时间">
        </el-date-picker>
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
          v-hasPermi="['enterprise:track:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['enterprise:track:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['enterprise:track:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['enterprise:track:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="trackList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="服务类型" align="center" prop="serviceType">
        <template slot-scope="scope">
          <span v-for="type in serviceTypes" v-if="scope.row.serviceType == type.value">
            {{type.label}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title" />
      <!-- <el-table-column label="标题图片" align="center" prop="titlePicture" /> -->
      <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="提交时间" align="center" prop="submitTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.submitTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['enterprise:track:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['enterprise:track:remove']"
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

    <!-- 添加或修改快捷通道对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="服务类型" prop="serviceType">
          <el-select v-model="form.serviceType" placeholder="请选择服务类型">
            <el-option
              v-for="item in serviceTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="内容图片" prop="imagePaths">
          <!-- <el-input v-model="form.imagePaths" placeholder="请输入图片路径(array)" /> -->
          <el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview1"
            :on-remove="imgRemove1"
            :http-request = "imgUpload1"
            :file-list="imgList1"
            list-type="picture">
            <el-button size="small" type="primary">上传<i class="el-icon-picture el-icon--right"></i></el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.publishTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提交时间" prop="submitTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.submitTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择提交时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <Editor v-model="form.content" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序" prop="sort"  style="margin-top:7.5rem;">
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
import { listTrack, getTrack, delTrack, addTrack, updateTrack, exportTrack } from "@/api/enterprise/track";
import {uploadFile} from "@/api/tool/fileUpload"
import Editor from '@/components/Editor';
export default {
  name: "Track",
  components: {
    Editor
  },
  data() {
    return {
      serviceTypes:[],
      //保存图片数据
      imagesArray:[],
      //为了显示
      imgList1:[],
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
      // 快捷通道表格数据
      trackList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serviceType: undefined,
        title: undefined,
        titlePicture: undefined,
        imagePaths: undefined,
        publishTime: undefined,
        submitTime: undefined,
        content: undefined,
        sort: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        serviceType: [
          { required: true, message: "服务类型（1人才服务 2金融服务 3法律服务 4财税服务 5项目推介）不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        titlePicture: [
          { required: true, message: "标题图片不能为空", trigger: "blur" }
        ],
        // imagePaths: [
        //   { required: true, message: "内容图片不能为空", trigger: "blur" }
        // ],
        publishTime: [
          { required: true, message: "发布时间不能为空", trigger: "blur" }
        ],
        // submitTime: [
        //   { required: true, message: "提交时间不能为空", trigger: "blur" }
        // ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDictList('service_type').then(response => {
      var datas = response.data;
      for(var i=0;i<datas.length;i++){
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
         this.serviceTypes.push(obj)
      }
    });
  },
  methods: {
    imgUpload1(data){
      let formData = new FormData();
      formData.append("file", data.file);
      uploadFile(formData).then(response => {
            //console.log(response)
            var obj = new Object();
             obj.fileName = response.newfileName;
             obj.url = response.fileName;
          this.imagesArray.push(obj);

      });
    },

    //删除图片时的操作
    imgRemove1(file, fileList){
       for(var i=0;i<this.imagesArray.length;i++){
         if(this.imagesArray[i].fileName==file.name){
                this.imagesArray.splice(i,1)
         }
       }
    },
    handlePreview1(file) {
       console.log(file);
    },
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
    /** 查询快捷通道列表 */
    getList() {
      this.loading = true;
      listTrack(this.queryParams).then(response => {
        this.trackList = response.rows;
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
        serviceType: undefined,
        title: undefined,
        titlePicture: undefined,
        imagePaths: undefined,
        publishTime: undefined,
        submitTime: undefined,
        content: undefined,
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
      this.imgList1 = [];
       this.imgList = [];
       this.imagesArray = [];
      this.reset();
      this.open = true;
      this.title = "添加快捷通道";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.imgList1 = [];
       this.imgList = [];
       this.imagesArray = [];
      this.reset();
      const id = row.id || this.ids
      getTrack(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改快捷通道";
        let objImg = new Object();
        objImg.name =  '';
        objImg.url = this.contextPath+this.form.titlePicture;
        if(this.imgList.length==0){
          this.imgList.push(objImg)
        }

        var imgarr =JSON.parse( this.form.imagePaths);

        for(var i=0;i<imgarr.length;i++){
            let objImg = new Object();
            objImg.name = imgarr[i].fileName;
            objImg.url = this.contextPath+imgarr[i].url;
            this.imgList1.push(objImg);

            var obj = new Object();
            obj.fileName = imgarr[i].fileName;
            obj.url = imgarr[i].url;
            this.imagesArray.push(obj);

        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      if(this.imagesArray.length!=0){
         this.form.imagePaths = JSON.stringify(this.imagesArray);
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateTrack(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addTrack(this.form).then(response => {
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
      this.$confirm('是否确认删除快捷通道编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTrack(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有快捷通道数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportTrack(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
