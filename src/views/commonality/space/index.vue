<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="显示位置" prop="displayLocation">
        <el-select v-model="queryParams.displayLocation" placeholder="请选择显示位置">
            <el-option
              v-for="item in pictureSpaceOccupying"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否可用" prop="enable">
        <el-input
          v-model="queryParams.enable"
          placeholder="请输入是否可用"
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
          v-hasPermi="['commonality:space:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['commonality:space:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['commonality:space:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['commonality:space:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="spaceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="显示位置" align="center" prop="displayLocation">
      <template slot-scope="scope">
             <span v-for="item in pictureSpaceOccupying" v-if="item.value == scope.row.displayLocation">
                 {{item.label}}
             </span>
       </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="picturePath">
      <template slot-scope="scope">
                <img :src="contextPath+scope.row.picturePath" style="width: 50px; height: 50px;"/>
      </template>
       </el-table-column>
      <el-table-column label="URL" align="center" prop="url" />
      <el-table-column label="访问目标" align="center" prop="target">
        <template slot-scope="scope">
              <span v-for="item in websiteMapTarget" v-if="item.value == scope.row.target">
                  {{item.label}}
              </span>
        </template>
       </el-table-column>
      <el-table-column label="是否可用" align="center" prop="enable">
        <template slot-scope="scope">
               <span v-for="item in isAbless" v-if="item.value == scope.row.enable">
                   {{item.label}}
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
            v-hasPermi="['commonality:space:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['commonality:space:remove']"
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

    <!-- 添加或修改图片占位对话框 -->
    <el-dialog :title="title" :visible.sync="open"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="显示位置" prop="displayLocation">
          <el-select v-model="form.displayLocation" placeholder="请选择显示位置"
          style="width: 100%;">
              <el-option
                v-for="item in pictureSpaceOccupying"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="picturePath">
        <!--  <el-input v-model="form.picturePath" placeholder="请输入图片路径" /> -->
          <el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview"
            :on-remove="imgRemove"
            :http-request = "imgUpload"
            :file-list="imgList"
             :limit="1"
            list-type="picture">
            <el-button size="small" type="primary">上传<i class="el-icon-picture el-icon--right">         </i></el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" placeholder="请输入URL" />
        </el-form-item>
        <el-form-item label="访问目标" prop="target">
          <el-select v-model="form.target" placeholder="请选择访问目标"
          style="width: 100%;">
              <el-option
                v-for="item in websiteMapTarget"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可用">
          <el-radio-group v-model="form.enable">
            <el-radio
              v-for="(item,index) in isAbless"
              :label="item.value" :key="index">
              {{item.label}}
            </el-radio>
          </el-radio-group>
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
import { listSpace, getSpace, delSpace, addSpace, updateSpace, exportSpace } from "@/api/commonality/space";
import {uploadFile} from "@/api/tool/fileUpload"
export default {
  name: "Space",
  data() {
    return {
      imgList:[],
      isAbless:[],
      pictureSpaceOccupying:[],
      websiteMapTarget:[],
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
      // 图片占位表格数据
      spaceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        displayLocation: undefined,
        picturePath: undefined,
        firstLevel: undefined,
        url: undefined,
        target: undefined,
        enable: undefined,
        sort: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        displayLocation: [
          { required: true, message: "显示位置不能为空", trigger: "blur" }
        ],
        picturePath: [
          { required: true, message: "图片路径不能为空", trigger: "blur" }
        ],
        enable: [
          { required: true, message: "是否可用不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getDictList('is_enable').then(response => {
      var datas = response.data;
      for(var i=0;i<datas.length;i++){
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
         this.isAbless.push(obj)
      }
    });
    this.getList();
    this.getDictList('picture_space_occupying').then(response => {
      var datas = response.data;
      for(var i=0;i<datas.length;i++){
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
         this.pictureSpaceOccupying.push(obj)
      }
    });
    this.getDictList('website_map_target').then(response => {
      var datas = response.data;
      for(var i=0;i<datas.length;i++){
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
         this.websiteMapTarget.push(obj)
      }
    });
  },
  methods: {
    //上传图片
    imgUpload(data){
      let formData = new FormData();
      formData.append("file", data.file);
      uploadFile(formData).then(response => {
          console.log(response)
          this.form.picturePath = response.fileName;

      });
    },
    //删除图片时的操作
    imgRemove(){
         this.form.picturePath = undefined ;
    },
    handlePreview(file) {
       console.log(file);
    },
    /** 查询图片占位列表 */
    getList() {
      this.loading = true;
      listSpace(this.queryParams).then(response => {
        this.spaceList = response.rows;
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
        displayLocation: undefined,
        picturePath: undefined,
        firstLevel: undefined,
        url: undefined,
        target: undefined,
        enable: undefined,
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
       this.imgList=[],
      this.reset();
      this.open = true;
      this.title = "添加图片占位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
       this.imgList=[],
      this.reset();
      const id = row.id || this.ids
      getSpace(id).then(response => {
        this.form = response.data;
        this.form.enable = this.form.enable.toString()
          this.form.displayLocation = this.form.displayLocation.toString()
        this.open = true;
        this.title = "修改图片占位";

        let objImg = new Object();
        objImg.name =  '';
        objImg.url = this.contextPath+this.form.picturePath;
        this.imgList.push(objImg)
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSpace(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSpace(this.form).then(response => {
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
      this.$confirm('是否确认删除图片占位编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSpace(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有图片占位数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSpace(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
