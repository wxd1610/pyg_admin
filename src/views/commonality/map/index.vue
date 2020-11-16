<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">
          <el-option
            v-for="item in websiteMapType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
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
          v-hasPermi="['commonality:map:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['commonality:map:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['commonality:map:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['commonality:map:export']"
        >导出</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="mapList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="URL" align="center" prop="url" />
      <el-table-column label="访问目标" align="center" prop="target" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          <span v-for="type in websiteMapType" v-if="type.value==scope.row.type">{{type.label}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['commonality:map:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['commonality:map:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改网站地图对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择类型" @change="showFrom">
            <el-option
              v-for="item in websiteMapType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="URL" prop="url" v-if="showform">
          <el-input v-model="form.url" placeholder="请输入URL" />
        </el-form-item>
        <el-form-item label="访问目标" prop="target" v-if="showform">
          <el-select v-model="form.target" placeholder="请选择访问目标" style="width: 100%;">
            <el-option
              v-for="item in websiteMapTarget"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentid">
          <!--  <el-input v-model="form.parentid" placeholder="请输入parentID" /> -->
          <treeselect
            v-model="form.parentid"
            :options="mapList"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="所属菜单" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
          <el-alert title="注释：1：网站首页，2：本会介绍，3：新闻中心，4：政务公开，5：业务工作，6：企业云服，7：互动交流，8：专题专栏" type="info"></el-alert>
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
  listMap,
  getMap,
  delMap,
  addMap,
  updateMap,
  exportMap,
} from "@/api/commonality/map";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
export default {
  name: "Map",
  components: { Treeselect, IconSelect },
  data() {
    return {
      showform: true,
      websiteMapType: [],
      websiteMapTarget: [],
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
      // 网站地图表格数据
      mapList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        url: undefined,
        target: undefined,
        parentid: undefined,
        sort: undefined,
        type: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        type: [
          {
            required: true,
            message: "类型（0目录，1链接）不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDictList("website_map_target").then((response) => {
      var datas = response.data;
      for (var i = 0; i < datas.length; i++) {
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
        this.websiteMapTarget.push(obj);
      }
    });
    this.getDictList("website_map_type").then((response) => {
      var datas = response.data;
      for (var i = 0; i < datas.length; i++) {
        var obj = new Object();
        obj.label = datas[i].dictLabel;
        obj.value = datas[i].dictValue;
        this.websiteMapType.push(obj);
      }
    });
  },
  methods: {
    /** 转换菜单数据结构 */
    normalizer(node) {
      // console.log(node)
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    showFrom() {
      if (this.form.type == 0) {
        this.showform = false;
      } else {
        this.showform = true;
      }
    },
    /** 查询网站地图列表 */
    getList() {
      this.loading = true;
      listMap(this.queryParams).then((response) => {
        // console.log(response);
        this.mapList = response.data;

        for (var x = 0; x < this.mapList.length; x++) {
          // console.log(this.mapList[x].parentid )
          if (this.mapList[x].parentid == 0) {
            this.mapList[x].parentid = null;
            this.form[x].parentid = null;
            console.log(this.mapList[x].parentid);
          } else {
            console.log(1);
          }
        }
        console.log(this.mapList);
        // this.total = response.total;
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
        url: undefined,
        target: undefined,
        parentid: undefined,
        sort: undefined,
        type: undefined,
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
      this.title = "添加网站地图";
      console.log(this.form);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.reset();
      const id = row.id || this.ids;
      getMap(id).then((response) => {
        this.form = response.data;
        console.log(this.form);
        if (this.form.parentid == 0) {
          this.form.parentid = null;
        } else {
          console.log(1);
        }
        this.open = true;
        this.title = "修改网站地图";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMap(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addMap(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除网站地图编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delMap(ids);
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
      this.$confirm("是否确认导出所有网站地图数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportMap(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
