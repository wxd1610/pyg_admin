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
      <el-form-item label="电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入邮箱"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="答题时间" prop="answerTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.answerTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择答题时间"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['interaction:person:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['interaction:person:edit']"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['interaction:person:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['interaction:person:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="personList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="IP地址" align="center" prop="ipAddress" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="电话" align="center" prop="phone" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="答题时间" align="center" prop="answerTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.answerTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="showDetil(scope.row)"
            v-hasPermi="['interaction:person:edit']"
          >查看详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['interaction:person:remove']"
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

    <!-- 添加或修改答题人对话框 -->
    <el-dialog :title="title" width="900px" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input v-model="form.ipAddress" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="问卷ID" prop="questionnaireId">
          <el-input v-model="form.questionnaireId" placeholder="请输入问卷ID" />
        </el-form-item>
        <el-form-item label="答题时间" prop="answerTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.answerTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择答题时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="总成绩" prop="totalScore">
          <el-input v-model="form.totalScore" placeholder="请输入总成绩" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改答题人对话框 -->
    <el-dialog :title="'答题详情'" :visible.sync="open1" width="900px" append-to-body>
      <div id="detile">
        <!-- <div style="line-height: 30px;">
            <div style="display: inline; font-weight: 600;">“五四爱国运动”的导火索是：</div>
            <div style="margin-left: 50px;" >答案：巴黎和会中国外交失败</div>
          </div>
          <div style="line-height: 30px;">
            <div style="display: inline; font-weight: 600;">第二次时间大战导火索是“萨拉热窝事件”：</div>
            <div style="margin-left: 50px;" >答案：错误</div>
          </div>
          <div style="line-height: 30px;">
            <div style="display: inline; font-weight: 600;">下列属于章回小说的是：</div>
            <div style="margin-left: 50px; font-weight: 600;">
                <div style="display: inline;">A 《三国演义》</div>
                <div style="display: inline;">B 《西游记》</div>
                <div style="display: inline;">C 《红楼梦》</div>
                <div style="display: inline;">D 《水浒传》</div>
                 <div style="display: inline;">E 《聊斋志异》</div>
                  <div style="display: inline;">F 《儒林外史》</div>
            </div>
            <div style="margin-left: 50px;">答案：ABCD</div>
          </div>
          <div style="line-height: 30px;">
            <div style="display: inline; font-weight: 600;">根据以下提示判断出医学著作：提示一：出自明朝李时珍之手；
            提示二：内容丰富、考订详细。图文并茂；
            提示三：被译成多国文字，是中国也是世界历史上的宝贵遗产;</div>
            <div style="margin-left: 50px; font-weight: 600;">
            <div style="display: inline;">A 《皇帝内径》</div>
            <div style="display: inline;">B 《农政全书》</div>
            <div style="display: inline;">C 《天工开物》</div>
            <div style="display: inline;">D 《本草纲目》</div>
             </div>
            <div style="margin-left: 50px;">答案：D</div>
          </div>
        -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open1=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPerson,
  getPerson,
  delPerson,
  addPerson,
  updatePerson,
  exportPerson,
  getDetile,
} from "@/api/interaction/person";

export default {
  name: "Person",
  data() {
    return {
      open1: false,
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
      // 答题人表格数据
      personList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ipAddress: undefined,
        name: undefined,
        phone: undefined,
        email: undefined,
        questionnaireId: undefined,
        answerTime: undefined,
        totalScore: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        ipAddress: [
          { required: true, message: "IP地址不能为空", trigger: "blur" },
        ],
        questionnaireId: [
          { required: true, message: "问卷ID不能为空", trigger: "blur" },
        ],
        answerTime: [
          { required: true, message: "答题时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    showDetil(row) {
      console.log(row);
      getDetile(row.id).then((response) => {
        console.log(response);
        var htmlStr = "";
        var dom = document.getElementById("detile");
        console.log(dom)
        for (var i = 0; i < response.data.length; i++) {
          var text = response.data[i];
          if (text.type == 1 || text.type == 2) {
            //单选,多选
            htmlStr +=
              ' <div style="line-height: 30px;">' +
              '<div style="display: inline; font-weight: 600;">' +
              text.question +
              "：</div>" +
              '<div style="margin-left: 50px; font-weight: 600;">';
            for (var j = 0; j < text.options; j++) {
              htmlStr +=
                '<div style="display: inline;">' +
                text.options[i].optionCode +
                "&nbsp;&nbsp;" +
                text.options[i].optionContent +
                "</div>";
            }
            htmlStr +=
              "</div>" +
              '<div style="margin-left: 50px;">答案：'+text.answer+'</div>' +
              "</div>";
          } else if (text.type == 3) {
            let a = ''
            if(text.answer ==0){
              a = '错'
            }
            if(text.answer ==1){
              a = '对'
            }
            htmlStr +=
              '<div style="line-height: 30px;">' +
              '<div style="display: inline; font-weight: 600;">' +
              text.question +
              "：</div>" +
              '<div style="margin-left: 50px;" >答案：' +
              a +
              "</div>" +
              "</div>";
          } else {
            //填空
            htmlStr +=
              '<div style="line-height: 30px;">' +
              '<div style="display: inline; font-weight: 600;">' +
              text.question +
              "：</div>" +
              '<div style="margin-left: 50px;" >答案：' +
              text.answer +
              "</div>" +
              "</div>";
          }
        }
        dom.innerHTML = htmlStr;
      }).catch(err=>{
        console.log(err)
      });

      this.open1 = true;
    },
    /** 查询答题人列表 */
    getList() {
      this.loading = true;
      listPerson(this.queryParams).then((response) => {
        this.personList = response.rows;
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
        ipAddress: undefined,
        name: undefined,
        phone: undefined,
        email: undefined,
        questionnaireId: undefined,
        answerTime: undefined,
        totalScore: undefined,
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
      this.title = "添加答题人";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPerson(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改答题人";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePerson(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addPerson(this.form).then((response) => {
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
      this.$confirm('是否确认删除答题人编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delPerson(ids);
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
      this.$confirm("是否确认导出所有答题人数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportPerson(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
