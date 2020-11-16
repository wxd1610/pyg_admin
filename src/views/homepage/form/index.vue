<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="表单名称" prop="formName">
        <el-input
          v-model="queryParams.formName"
          placeholder="请输入表单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="表单类型" prop="formType">
        <el-select v-model="queryParams.formType" placeholder="请选择表单类型" clearable size="small" style="width: 100%;">
          <el-option
            v-for="item in fromTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
          v-hasPermi="['homepage:form:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['homepage:form:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['homepage:form:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['homepage:form:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="formList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表单名称" align="center" prop="formName" />
      <el-table-column label="表单类型" align="center" prop="formType">
         <template slot-scope="scope">
           <span v-for="item in fromTypeList" v-if="item.value == scope.row.formType">
             {{item.label}}
           </span>
         </template>
      </el-table-column>
      <el-table-column label="选项" align="center" prop="dictionaryType" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['homepage:form:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['homepage:form:remove']"
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

    <!-- 添加或修改采集单对话框 -->
    <el-dialog :title="title" :visible.sync="open"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
    <!--    <el-form-item label="采集ID" prop="collectId">
          <el-input v-model="form.collectId" placeholder="请输入采集ID" />
        </el-form-item> -->
        <el-form-item label="表单名称" prop="formName">
          <el-input v-model="form.formName" placeholder="请输入表单名称" />
        </el-form-item>
        <el-form-item label="表单类型">
          <el-select v-model="form.formType" placeholder="请选择表单类型" @change="formChange">
            <el-option
              v-for="item in fromTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选项" v-if="typeFlag" prop="dictionaryType">
            <el-button type="primary" icon="el-icon-edit" @click="addOption"></el-button>
            <el-button type="primary" icon="el-icon-delete" @click="removeOption"></el-button>
          <div id="dictionaryTypeDiv" ref="dictionaryTypeDiv" >

          </div>
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
import { listForm, getForm, delForm, addForm, updateForm, exportForm } from "@/api/homepage/form";

export default {
  name: "Form",
  data() {
    return {
      optionList:[],
      typeFlag:false,
      fromTypeList:[],
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
      // 采集单表格数据
      formList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        collectId: undefined,
        formName: undefined,
        formType: undefined,
        dictionaryType: undefined,
        sort: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        formName: [
          { required: true, message: "表单名称不能为空", trigger: "blur" }
        ],
        formType: [
          { required: true, message: "请选择表单类型", trigger: "blur" }
        ],
        dictionaryType:[
          { required: true, message: "选项不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],

      }
    };
  },
  beforeCreate() {

  },
  created() {
    this.form.collectId = this.getQueryValue('collectId');
    this.queryParams.collectId =  this.getQueryValue('collectId');
    this.getList();
    this.getDictList('Form_type').then(response => {
      var datas = response.data;
      for(var i=0;i<datas.length;i++){
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
         this.fromTypeList.push(obj)
      }
    });

  },
  methods: {
    addOption(){
        var dom = document.getElementById("dictionaryTypeDiv")
        var inputDom = document.createElement("input");
        inputDom.setAttribute("class","option")
        dom.appendChild(inputDom);
    },
    removeOption(){
      var dom = document.getElementById("dictionaryTypeDiv").children;
      if(dom.length==0){
           this.$message.error('没有可删除的选项！');
          return;
      }
      var domLast = dom[dom.length-1];
      domLast.remove();
    },
    formChange(){
        var type = this.form.formType;
        console.log(type)
        if(type==1 || type==4 ){
            this.typeFlag = false;
        }else{
             this.typeFlag = true;
        }
    },
    /** 查询采集单列表 */
    getList() {
      this.loading = true;
      listForm(this.queryParams).then(response => {
        this.formList = response.rows;
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
        collectId: undefined,
        formName: undefined,
        formType: undefined,
        dictionaryType: undefined,
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
      this.title = "添加采集单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
       this.typeFlag = true;
      this.reset();
      const id = row.id || this.ids
      getForm(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改采集单";
        if( this.form.formType ==1 || this.form.formType  ==4 ){
            this.typeFlag = false;
        }else{
           this.typeFlag = true;
          var dictionaryTypeObjStr =  this.form.dictionaryType;
          var dictionaryTypeObjs = JSON.parse(dictionaryTypeObjStr)
            setTimeout(function(){
              var dom = document.getElementById("dictionaryTypeDiv");
              var childs = dom.childNodes;
              for(var i = childs .length - 1; i >= 0; i--) {
                dom.removeChild(childs[i]);
              }
             for(var i=0;i<dictionaryTypeObjs.length;i++){
                 var dictionaryTypeObj = dictionaryTypeObjs[i];
                 var inputDom = document.createElement("input");
                 inputDom.setAttribute("value",dictionaryTypeObj.name)
                 inputDom.setAttribute("class","option")
                 dom.appendChild(inputDom);
             }
            },500)

        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
        if(this.form.formType == 2|| this.form.formType  ==3 || this.form.formType  ==5 ){
          this.optionList = [];
           var options = document.getElementsByClassName("option");
          if(options.length==0||options[0].value==""){
            this.$message.error('请添加选项！');
            return;
           }
           for(var i=0;i<options.length;i++){
              var option = options[i];
                 if(option.value==""){
                   continue;
                 }
                 var optionObject = new Object();
                 optionObject.name = option.value;
                this.optionList.push(optionObject);
           }
           if(this.optionList.length!=0){
             this.form.dictionaryType = JSON.stringify(this.optionList);
           }
        }
       this.form.collectId = this.getQueryValue('collectId');
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateForm(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addForm(this.form).then(response => {
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
      this.$confirm('是否确认删除采集单编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delForm(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采集单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportForm(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style>
  .option{
      display: block;
      margin-top: 8px;
  }


</style>
