<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="发送标题" prop="sendTitle">
        <el-input
          v-model="queryParams.sendTitle"
          placeholder="请输入发送标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择发送时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="发送状态" prop="sendStatus">
        <el-select
          v-model="queryParams.sendStatus"
          placeholder="请选择发送状态"
          clearable
          size="small"
        >
          <el-option label="已发送" value="1" />
          <el-option label="待发送" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['sendreceive:senddocument:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sendreceive:senddocument:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sendreceive:senddocument:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['sendreceive:senddocument:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table
      v-loading="loading"
      :data="senddocumentList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="发送标题" align="center" prop="sendTitle">
        <template slot-scope="scope">
          <a style="color: #0081FB" @click="seehandleUpdate(scope.row)">{{
            scope.row.sendTitle
          }}</a>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column
        label="发送时间"
        align="center"
        prop="sendTime"
        width="180"
      />
      <el-table-column label="发送状态" align="center" prop="scope">
        <template slot-scope="scope">
          <span v-if="scope.row.sendStatus == 0">待发送</span>
          <span v-if="scope.row.sendStatus == 1">已发送</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <div v-if="aaaaa"> -->

          <el-button
            v-if="scope.row.sendStatus == 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="sendforProject(scope.row.id)"
            >发送</el-button
          >
          <el-button
            v-if="scope.row.sendStatus == 0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sendreceive:senddocument:edit']"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.sendStatus == 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sendreceive:senddocument:remove']"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.sendStatus == 0"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="showMessage(scope.row.id)"
            v-hasPermi="['sendreceive:senddocument:remove']"
            >查看回复</el-button
          >
          <el-button
            v-if="scope.row.sendStatus == 0"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="showDocument(scope.row.id)"
            v-hasPermi="['sendreceive:senddocument:remove']"
            >查看公文</el-button
          >
          <!-- </div> -->
          <i
            v-if="scope.row.documentId != undefined"
            class="el-icon-tickets"
            style="color: #0081FB; font-size: 5px; margin-left: 10px"
          >
            <a
              :href="contextPath + '/download/document/' + scope.row.documentId"
              >下载公文</a
            >
          </i>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="" :visible.sync="dialogVisible">
      <pdf 
        ref="pdf"
        src="http://192.168.1.195:8082/download/document/26"
      >
      </pdf>
    </el-dialog>
    <el-drawer
      :visible.sync="drawer"
      :before-close="handleClose"
      size="70%"
      style="overflow: auto"
    >
      <div class="msg" style="margin-left: 10px; width: 100%; margin-top: 60px">
        <h4 style="margin-left: 40%; margin-top: -5%; width: 70px">接收单位</h4>
        <el-table
          :data="tableData"
          style="width: 100%; overflow-y: auto"
          height="200"
        >
          <el-table-column label="接收单位" width="180">
            <template slot-scope="scope">
              <a style="color: #0081FB" @click="showMessage1(scope.row)">{{
                scope.row.deptName
              }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="接收人"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="readStatus_dictText"
            label="读取状态"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="readTime"
            label="读取时间"
            width="180"
          ></el-table-column>

          <el-table-column prop="unreadNumber" label="未读消息数">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.unreadNumber == 0">{{
                scope.row.unreadNumber
              }}</el-tag>
              <el-tag
                v-if="scope.row.unreadNumber > 0 && scope.row.unreadNumber < 10"
                >{{ scope.row.unreadNumber }}</el-tag
              >
              <el-tag
                v-if="
                  scope.row.unreadNumber > 10 && scope.row.unreadNumber < 100
                "
                >{{ scope.row.unreadNumber }}</el-tag
              >
              <el-tag
                type="warning"
                v-if="
                  scope.row.unreadNumber > 100 && scope.row.unreadNumber < 200
                "
                >{{ scope.row.unreadNumber }}</el-tag
              >
              <el-tag type="danger" v-if="scope.row.unreadNumber > 200">{{
                scope.row.unreadNumber
              }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="msg" style="margin-top: 10px; width: 100%">
        <!-- <h4 style="margin-left: 40%;margin-top: -5%;">聊天记录</h4> -->
        <div class="wechart" id="wechart"></div>
        <div style="margin-top: 20px">
          <el-form ref="form4" :model="form4" :rules="rules" label-width="80px">
            <el-form-item label="内容" prop="replyContent">
              <el-input
                type="textarea"
                v-model="form4.replyContent"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item label="相关附件" prop="attachment">
              <!-- <el-input v-model="form.attachment" type="textarea" placeholder="请输入内容" /> -->
              <el-upload
                class="upload-demo"
                action="#"
                :on-preview="handlePreview5"
                :on-remove="imgRemove5"
                :http-request="imgUpload5"
                :file-list="imgList5"
                :limit="1"
                list-type="file"
              >
                <el-button size="small" type="primary">
                  上传
                  <i class="el-icon-picture el-icon--right"></i>
                </el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <div style="margin-left: 30%">
            <el-button style="width: 200px" type="primary" @click="sendSave()"
              >发送</el-button
            >
          </div>
        </div>
      </div>
    </el-drawer>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改发送公文对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发送标题" prop="sendTitle">
          <el-input v-model="form.sendTitle" placeholder="请输入发送标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <Editor v-model="form.content" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item
          label="相关附件"
          prop="attachment"
          style="margin-top: 7.5rem"
        >
          <!-- <el-input v-model="form.attachment" type="textarea" placeholder="请输入内容" /> -->
          <el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview1"
            :on-remove="imgRemove1"
            :http-request="imgUpload1"
            :file-list="imgList1"
            list-type="file"
          >
            <el-button size="small" type="primary">
              上传
              <i class="el-icon-picture el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="发送日期" prop="sendTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.sendTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发送日期">
          </el-date-picker>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看发送公文对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="openDocument"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="" v-html="form.sendTitle" prop="sendTitle">
          <!-- <el-input v-model="form.sendTitle" placeholder="请输入发送标题" /> -->
        </el-form-item>
        <el-form-item label="" v-html="form.content" prop="content">
          <!-- <Editor v-model="form.content" placeholder="请输入内容" /> -->
        </el-form-item>
        <el-form-item
          label="相关附件"
          prop="attachment"
          style="margin-top: 7.5rem"
        >
          <!-- <el-input v-model="form.attachment" type="textarea" placeholder="请输入内容" /> -->
          <el-upload
            class="upload-demo"
            action="#"
            disabled
            :on-preview="handlePreview1"
            :on-remove="imgRemove1"
            :http-request="imgUpload1"
            :file-list="imgList1"
            list-type="file"
          >
            <!-- <el-button size="small" type="primary">
              上传
              <i class="el-icon-picture el-icon--right"></i>
            </el-button> -->
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="发送日期" prop="sendTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.sendTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发送日期">
          </el-date-picker>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增公文"
      :visible.sync="centerDialogVisible"
      width="400px"
    >
      <el-button icon="el-icon-tickets" type="primary" @click="sendProject1()"
        >携带公文发送</el-button
      >
      <el-button icon="el-icon-s-comment" @click="sendProject2()"
        >不携带公文发送</el-button
      >
    </el-dialog>

    <el-dialog
      title="选择发送单位"
      :visible.sync="sendPublicProject"
      width="400px"
    >
      <el-form ref="form3" :model="form3" :rules="rules">
        <el-form-item prop="sendTitle">
          <el-tree
            node-key="deptId"
            ref="tree"
            :check-strictly="false"
            :default-expand-all="true"
            :data="offices"
            show-checkbox
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendProject3">发送</el-button>
        <el-button @click="sendPublicProject = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改公文对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="openProject"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form1" :model="form1" :rules="rules" label-width="80px">
        <el-form-item label="公文标题" prop="documentTitle">
          <el-input
            v-model="form1.documentTitle"
            placeholder="请输入公文标题"
          />
        </el-form-item>
        <el-form-item label="主送机关" prop="lordSendUnit">
          <el-input v-model="form1.lordSendUnit" placeholder="请输入主送机关" />
        </el-form-item>
        <el-form-item label="正文" prop="documentBody">
          <el-input
            v-model="form1.documentBody"
            type="textarea"
            rows="20"
            placeholder="请输入内容"
          />
        </el-form-item>

        <el-form-item label="印发单位" prop="issuedAuthority">
          <el-input
            v-model="form1.issuedAuthority"
            placeholder="请输入印发单位"
          />
        </el-form-item>
        <el-form-item label="发送日期" prop="sendDate">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form1.sendDate"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发送日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用印章" prop="stampId">
          <el-select v-model="form1.stampId" placeholder="请选择印章">
            <el-option
              v-for="item in controlList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="印章密码" prop="stampIdPassword">
          <el-input
            type="password"
            v-model="form1.stampIdPassword"
            placeholder="请输入印章密码"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveProject">下一步</el-button>
        <el-button @click="cancel1">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import pdf from 'vue-pdf'
import {
  listSenddocument,
  getSenddocument,
  delSenddocument,
  addSenddocument,
  updateSenddocument,
  exportSenddocument,
  sendDocument,
  sendlist,
  receiveDocumentId,
  reply,
  readProjectReq,
} from "@/api/sendreceive/senddocument";
import {
  listDocument,
  getDocument,
  delDocument,
  addDocument,
  updateDocument,
  exportDocument,
} from "@/api/sendreceive/document";

import { listControl, verify,getpdf } from "@/api/sendreceive/control";
import Editor from "@/components/Editor";
import { uploadFile } from "@/api/tool/fileUpload";
import { listDept } from "@/api/system/dept";
import { listDept2 } from "@/api/system/dept";
export default {
  name: "Senddocument",
  components: {
    Editor,pdf
  },
  data() {
    return {
      url:'',
      aaaaa: true,
      a1: false,
      dialogVisible: false,
      imgList5: [],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      sendDocumentId: undefined,
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined,
      },
      offices: [],
      defaultProps: {
        children: "children",
        label: "deptName",
      },
      sendPublicProject: false,
      imagesArray: [],
      imgList1: [],
      controlList: [],
      openProject: false,
      centerDialogVisible: false,
      drawer: false,
      direction: "rtl",
      openDocument: false,
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
      // 发送公文表格数据
      senddocumentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        documentId: undefined,
        sendTitle: undefined,
        attachment: undefined,
        content: undefined,
        sendStatus: undefined,
        sendTime: undefined,
        rootId: undefined,
        superstratums: undefined,
        rowStore: undefined,
      },
      // 表单参数
      form: {},
      form1: {},
      form3: {},
      form4: {},
      // 表单校验
      rules: {
        sendTitle: [
          { required: true, message: "发送标题不能为空", trigger: "blur" },
        ],
        sendStatus: [
          {
            required: true,
            message: "发送状态(1已发送0待发送)不能为空",
            trigger: "blur",
          },
        ],
        rootId: [{ required: true, message: "根id不能为空", trigger: "blur" }],
        superstratums: [
          { required: true, message: "上层数组不能为空", trigger: "blur" },
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" },
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" },
        ],
        updateTime: [
          { required: true, message: "修改时间不能为空", trigger: "blur" },
        ],
        documentTitle: [
          { required: true, message: "公文标题不能为空", trigger: "blur" },
        ],
        lordSendUnit: [
          { required: true, message: "公文标题不能为空", trigger: "blur" },
        ],
        documentBody: [
          { required: true, message: "正文不能为空", trigger: "blur" },
        ],
        issuedAuthority: [
          { required: true, message: "印发单位不能为空", trigger: "blur" },
        ],
        sendDate: [
          { required: true, message: "发送日期不能为空", trigger: "blur" },
        ],
        stampId: [{ required: true, message: "印章不能为空", trigger: "blur" }],
        stampIdPassword: [
          { required: true, message: "印章密码为空", trigger: "blur" },
        ],
        content: [{ required: true, message: "正文不能为空", trigger: "blur" }],
        // sendTime: [
        //   { required: true, message: "发送时间不能为空", trigger: "blur" }
        // ],
        replyContent: [
          { required: true, message: "内容不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getControl();
    this.getlistDept();
    this.getList();
    this.abc()
  },

  methods: {
    abc(){
      getpdf().then(res=>{
        console.log(res,'***pdf***')
      }).catch(res=>{
        console.log(res,'***pdf***')
      })
    },
     getNumPages() {
      let loadingTask = pdf.createLoadingTask(this.url)
      loadingTask.promise.then(pdf => {
        this.numPages = pdf.numPages
      }).catch(err => {
        console.error('pdf 加载失败', err);
      })
    },
    //查看公文
    showDocument(id) {
      console.log(id);
      this.dialogVisible = true;
    },
    readProject(data) {
      var documentId = data.documentId;
      readProjectReq(documentId).then((response) => {
        console.log(response);
      });
    },
    showMessage1(row) {
      console.log(this.form4);
      this.rowStore = row;
      this.form4.receiveDocumentId = row.id;
      var receivedById = row.receivedById;
      receiveDocumentId(row.id).then((response) => {
        var chars = response.data;
        console.log(response, "response");
        var dom = document.getElementsByClassName("wechart")[0];
        dom.innerHTML = "";
        var htmltext = "";
        for (var i = 0; i < chars.length; i++) {
          var data = chars[i];
          console.log(data);
          htmltext +=
            '<ul class="list-group-item">' +
            "<li >" +
            data.deptName +
            '<p style="width:20px;display: inline-block;"></p>' +
            data.replyTime +
            "</li>" +
            '<li class="list-group-item-li">' +
            data.replyContent +
            "</li>";
          if (data.attachment != null && data.attachment != undefined) {
            htmltext +=
              '<li class="list-group-item-li"> <i class="el-icon-folder">' +
              '<a  target="_blank" href="' +
              this.contextPath +
              data.attachment +
              '">附件</a></i></li>';
          }

          htmltext += "</ul>";
        }
        dom.innerHTML = htmltext;
      });
    },
    parseDom(arg, clssName) {
      var objE = document.createElement("div");
      objE.setAttribute("class", clssName);
      objE.innerHTML = arg;
      return objE.childNodes;
    },
    getlistDept() {
      console.log(this.queryParams);
      listDept2(this.queryParams).then((response) => {
        console.log(response, "getlistDept");

        this.offices = this.handleTree(response.data, "deptId");
        this.loading = false;
      });
    },
    sendProject3() {
      var checkOption = this.$refs.tree.getCheckedKeys();
      console.log(checkOption);
      if (checkOption.length == 0) {
        this.$message.error("请选择发送单位！");
        return;
      }
      console.log(checkOption);
      var obj = new Object();
      obj.sendDocumentId = this.sendDocumentId;
      obj.deptIds = checkOption;
      sendDocument(obj).then((response) => {
        if (response.code == 200) {
          this.sendPublicProject = false;
          this.$message.success("发送公文成功！");
          this.getList();
        } else {
          this.$message.error("发送公文失败！");
        }
      });
    },
    sendforProject(sendDocumentId) {
      this.sendDocumentId = sendDocumentId;
      console.log(sendDocumentId);
      this.sendPublicProject = true;
      if (this.$refs.tree != undefined) {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    imgUpload5(data) {
      let formData = new FormData();
      formData.append("file", data.file);
      uploadFile(formData).then((response) => {
        console.log(response);
        // this.form4.tupianname = response.newfileName
        this.form4.attachment = response.fileName;
      });
    },

    //删除图片时的操作
    imgRemove5() {},
    handlePreview5(file) {
      console.log(file);
    },
    imgUpload1(data) {
      let formData = new FormData();
      formData.append("file", data.file);
      uploadFile(formData).then((response) => {
        //console.log(response)
        var obj = new Object();
        obj.fileName = response.newfileName;
        obj.url = response.fileName;
        this.imagesArray.push(obj);
      });
    },

    //删除图片时的操作
    imgRemove1(file, fileList) {
      for (var i = 0; i < this.imagesArray.length; i++) {
        if (this.imagesArray[i].fileName == file.name) {
          this.imagesArray.splice(i, 1);
        }
      }
    },
    handlePreview1(file) {
      console.log(file);
    },
    getControl() {
      listControl().then((response) => {
        console.log(response, "getControl");
        var controlLists = response.rows;
        for (var i = 0; i < controlLists.length; i++) {
          var control = controlLists[i];
          var obj = new Object();
          obj.label = control.stampName;
          obj.value = control.id;
          this.controlList.push(obj);
        }
        // console.log(response)
      });
    },
    sendSave() {
      if (this.form4.receiveDocumentId == undefined) {
        this.$message.warning("请选择接收单位后再发送消息");
        return;
      }
      this.$refs["form4"].validate((valid) => {
        var data = this.form4;
        console.log(data);

        if (valid) {
          reply(data).then((response) => {
            console.log(response);
            if ((response.code = 200)) {
              this.showMessage1(this.rowStore);
              setTimeout(function () {
                var div = document.getElementById("wechart");
                div.scrollTop = div.scrollHeight + 100;
              }, 500);
              this.form4.replyContent = "";
              this.imgList5 = [];
            } else {
              this.$message.error("发送失败");
            }
          });
        }
      });
    },
    saveProject() {
      this.$refs["form1"].validate((valid) => {
        var query = new Object();
        query.id = this.form1.stampId;
        query.stampPassword = this.form1.stampIdPassword;
        if (valid) {
          verify(query).then((response) => {
            if (response.data.status) {
              addDocument(this.form1).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("保存成功");
                  this.form.documentId = response.data.id;
                  this.openProject = false;
                  this.open = true;
                }
              });
            } else {
              this.$message.error("您输入的印章密码错误");
            }
          });
        }
      });
    },
    sendProject1() {
      this.resetForm("form1");
      this.title = "新增公文";
      this.centerDialogVisible = false;
      this.openProject = true;
    },
    sendProject2() {
      this.reset();
      this.title = "新增发送";
      this.centerDialogVisible = false;
      this.open = true;
    },
    // 取消按钮
    cancel1() {
      this.openProject = false;
    },
    showMessage(id) {
      this.drawer = true;
      var dom = document.getElementsByClassName("wechart")[0];
      if (dom != undefined) {
        dom.innerHTML = "";
      }
      this.form4.receiveDocumentId = undefined;
      sendlist(id).then((response) => {
        console.log(response);
        this.tableData = response.data;
      });
    },
    handleClose(done) {
      //  console.log(done)
      // this.drawer = false;
      done();
    },

    /** 查询发送公文列表 */
    getList() {
      this.loading = true;
      listSenddocument(this.queryParams).then((response) => {
        this.senddocumentList = response.rows;
        //   if(Cookies.get('username1') =='admin'){
        //     this.aaaaa=true
        //   }else{
        //  this.aaaaa=false

        //   }
        // for (var x in this.senddocumentList) {
        //   console.log(this.senddocumentList[x].sendStatus);
        //   if (import Cookies from "js-cookie"; == 0) {
        //     this.aaaaa = true;
        //   } else {
        //     this.aaaaa = false;
        //   }
        // }
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openDocument = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        documentId: undefined,
        sendTitle: undefined,
        attachment: undefined,
        content: undefined,
        sendStatus: "0",
        sendTime: undefined,
        rootId: undefined,
        superstratums: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
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
      //this.open = true;
      this.title = "添加发送公文";
      this.imgList1 = [];
      this.imagesArray = [];
      this.centerDialogVisible = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.imgList1 = [];
      this.imagesArray = [];
      this.reset();
      const id = row.id || this.ids;
      console.log(id, 1);
      getSenddocument(id).then((response) => {
        console.log(response);
        this.form = response.data.srSendDocument;
        this.open = true;
        this.title = "修改发送公文";
        var imgarr = JSON.parse(this.form.attachment);

        for (var i = 0; i < imgarr.length; i++) {
          let objImg = new Object();
          objImg.name = imgarr[i].fileName;
          objImg.url = this.contextPath + imgarr[i].url;
          this.imgList1.push(objImg);

          var obj = new Object();
          obj.fileName = imgarr[i].fileName;
          obj.url = imgarr[i].url;
          this.imagesArray.push(obj);
        }
      });
      console.log(this.form);
    },
    seehandleUpdate(row) {
      this.openDocument = true;
      this.imgList1 = [];
      this.imagesArray = [];
      this.reset();
      const id = row.id || this.ids;
      console.log(id, 1);
      getSenddocument(id).then((response) => {
        console.log(response);
        this.form = response.data.srSendDocument;
        // this.open = true;
        // this.title = "发送内容";
        var imgarr = JSON.parse(this.form.attachment);
        console.log(imgarr);
        for (var i = 0; i < imgarr.length; i++) {
          let objImg = new Object();
          objImg.name = imgarr[i].fileName;
          objImg.url = this.contextPath + imgarr[i].url;
          this.imgList1.push(objImg);

          var obj = new Object();
          obj.fileName = imgarr[i].fileName;
          obj.url = imgarr[i].url;
          this.imagesArray.push(obj);
        }
        console.log(this.imagesArray);
      });
      console.log(this.form);
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.imagesArray.length != 0) {
        this.form.attachment = JSON.stringify(this.imagesArray);
      }
      console.log(this.imagesArray);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSenddocument(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSenddocument(this.form).then((response) => {
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
        '是否确认删除发送公文编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSenddocument(ids);
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
      this.$confirm("是否确认导出所有发送公文数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSenddocument(queryParams);
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
.chart {
  width: 51%;
}
.wechart {
  background-color: #fffae8;
  width: 100%;
  height: 240px;
  overflow-y: scroll;
}
.wechart1 {
  margin: 20px 10px 10px 5px;
  width: 100%;
}
.wechart2 {
  margin: 0px 10px 10px 20px;
}

.wechart3 {
  width: 100%;
  background-color: #aaffff;
}

.hechart {
  width: 51%;
  text-align: right;
}

.file {
  margin: 0px 10px 10px 20px;
  color: #0081fb;
}

.list-group-item li {
  margin: 3px 10px 5px 10px;
}

.list-group-item-li {
  margin-left: 200px;
}
.el-drawer__body {
  overflow: auto;
}
</style>
