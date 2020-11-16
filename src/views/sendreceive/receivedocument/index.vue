<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" >
      <el-form-item label="发送标题" prop="sendTitle">
        <el-input
          v-model="queryParams.sendTitle"
          placeholder="请输入发送标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--     <el-form-item label="接收人id" prop="receivedById">
        <el-input
          v-model="queryParams.receivedById"
          placeholder="请输入接收人id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->

      <el-form-item label="发送时间" prop="sendTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.sendTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择读取时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="读取状态" prop="readStatus" style="width：200px">
        <el-select v-model="queryParams.readStatus" placeholder="请选择读取状态" clearable size="small">
          <el-option label="未读" value="0" />
          <el-option label="已读" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-select v-model="queryParams.tag" placeholder="请选择标签" style="width：200px">
          <el-option
            v-for="item in project_flag"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--  <el-form-item label="标签(1置顶公文2紧急公文3重要公文4一般公文)" prop="tag">
        <el-input
          v-model="queryParams.tag"
          placeholder="请输入标签(1置顶公文2紧急公文3重要公文4一般公文)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--   <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['sendreceive:receivedocument:add']"
        >新增</el-button>
      </el-col>-->
      <!--  <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sendreceive:receivedocument:edit']"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sendreceive:receivedocument:remove']"
        >删除</el-button>
      </el-col>
      <!--  <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['sendreceive:receivedocument:export']"
        >导出</el-button> 
      </el-col>-->
    </el-row>

    <el-table
      v-loading="loading"
      :data="receivedocumentList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="发送标题" align="center" prop="sendTitle">
        <template slot-scope="scope">
          <a style="color: #0081FB;" @click="handleUpdate(scope.row)">{{scope.row.sendTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column label="发送人" align="center" prop="createBy" />
      <el-table-column label="发送时间" align="center" prop="sendTime" />
      <el-table-column label="读取时间" align="center" prop="readTime">
        <template slot-scope="scope">
          <span>{{ scope.row.readTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="读取状态" align="center" prop="readStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.readStatus==1">已读</span>
          <span v-if="scope.row.readStatus==0">未读</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标签"
        align="center"
        class-name="small-padding fixed-width"
        prop="tag_dictText"
      ></el-table-column>
      <!--     <el-table-column label="标签(1置顶公文2紧急公文3重要公文4一般公文)" align="center" prop="tag" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="380">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-link"
            @click="sendProject(scope.row)"
            v-hasPermi="['sendreceive:receivedocument:edit']"
          >转发</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-link"
            @click="setFlag(scope.row)"
            v-hasPermi="['sendreceive:receivedocument:edit']"
          >标记为</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
           
            v-hasPermi="['sendreceive:receivedocument:edit']"
          >详情</el-button>-->
          <!--  <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sendreceive:receivedocument:remove']"
          >查看回复</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-chat-dot-round"
            @click="responseDocument(scope.row)"
          >查看回复</el-button>
          <i
            v-if="scope.row.documentId!=undefined"
            class="el-icon-tickets"
            style="color: #0081FB;font-size: 5px;margin-left: 10px;"
          >
            <a :href="contextPath+'/download/document/'+scope.row.documentId">阅读公文</a>
          </i>
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

    <!-- 添加或修改接收公文对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发送公文id" prop="sendDocumentId">
          <el-input v-model="form.sendDocumentId" placeholder="请输入发送公文id" />
        </el-form-item>
        <el-form-item label="接收人id" prop="receivedById">
          <el-input v-model="form.receivedById" placeholder="请输入接收人id" />
        </el-form-item>
        <el-form-item label="读取状态">
          <el-radio-group v-model="form.readStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="读取时间" prop="readTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form.readTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择读取时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="标签(1置顶公文2紧急公文3重要公文4一般公文)" prop="tag">
          <el-input v-model="form.tag" placeholder="请输入标签(1置顶公文2紧急公文3重要公文4一般公文)" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改发送公文对话框 -->
    <el-dialog :title="title" :visible.sync="openshow" width="500px" append-to-body>
      <el-form ref="form" :model="form1" :rules="rules" label-width="80px">
        <el-form-item label="" v-html="form1.sendTitle" prop="sendTitle">
          <!-- <el-input  placeholder="" readonly /> -->
        </el-form-item>
        <el-form-item label="" v-html="form1.content" prop="content">
          <!-- <el-input type="textarea" v-model="form1.content" placeholder="" readonly /> -->
          <!-- <Editor v-model="form1.content" placeholder="请输入内容" contenteditable="false" /> -->
        
        </el-form-item>
        <el-form-item label="相关附件" prop="attachment" style="margin-top:7.5rem;">
          <!-- <el-input v-model="form.attachment" type="textarea" placeholder="请输入内容" /> -->
          <div id="fileList"></div>
        </el-form-item>
        <!-- <el-form-item label="发送时间" prop="sendTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            readonly
            v-model="form1.sendTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发送时间"
          ></el-date-picker>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">返 回</el-button> -->
        <el-button @click="cancelDetile">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改发送公文对话框 -->
    <el-dialog :title="title" :visible.sync="flagShow" width="500px" append-to-body>
      <el-form ref="form2" :model="form2" :rules="rules" label-width="80px">
        <el-form-item label="标签" prop="projcetFlag">
          <!--  <el-input v-model="form.sort" placeholder="请输入排序" /> -->
          <el-select v-model="form2.projcetFlag" placeholder="请选择标签">
            <el-option
              v-for="item in project_flag"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveProject">确 定</el-button>
        <el-button @click="flagShow=false">取 消</el-button>
      </div>
    </el-dialog>

    <el-drawer :visible.sync="drawer" :before-close="handleClose" size="70%" style="overflow:auto">
      <div class="msg" style="margin-top: 20px;width: 100%;margin-top: 60px;">
        <h4 style="margin-left: 40%;margin-top: -5%;">聊天记录</h4>
        <div class="wechart" id="wechart"></div>
        <div style="margin-top: 20px;">
          <el-form ref="form4" :model="form4" :rules="rules" label-width="80px">
            <el-form-item label="内容" prop="replyContent">
              <el-input type="textarea" v-model="form4.replyContent" placeholder="请输入内容" />
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
          <div style="margin-left: 30%;">
            <el-button style="width: 200px;" type="primary" @click="sendSave()">发送</el-button>
          </div>
        </div>
      </div>
    </el-drawer>

    <el-dialog :title="'转发'" :visible.sync="openshow5" width="500px" append-to-body>
      <el-form ref="form" :model="form5" :rules="rules" label-width="80px">
        <el-form-item label="发送标题" prop="sendTitle">
          <el-input v-model="form5.sendTitle" placeholder="请输入发送标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <Editor v-model="form5.content" placeholder="请输入内容" contenteditable="false" />
        </el-form-item>
        <el-form-item label="相关附件" prop="attachment" style="margin-top:7.5rem;">
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
        <el-form-item label="接收单位" prop="sendTitle">
          <el-tree
            node-key="deptId"
            ref="tree"
            :check-strictly="false"
            :default-expand-all="true"
            :data="offices"
            show-checkbox
            :props="defaultProps"
          ></el-tree>
          <!-- <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="defaultProps"
          ></el-tree>
        </el-form-item> -->
        <!-- <el-form-item label="发送时间" prop="sendTime">
          <el-date-picker
            clearable
            size="small"
            style="width: 200px"
            v-model="form5.sendTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择发送时间"
          ></el-date-picker>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendProjectforOther">确 定</el-button>
        <el-button @click="openshow5 = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listReceivedocument,
  getReceivedocument,
  delReceivedocument,
  addReceivedocument,
  updateReceivedocument,
  exportReceivedocument,
  reply,
  replyMsg,
  setFlag,
  retransmission,
} from "@/api/sendreceive/receivedocument";
import Editor from "@/components/Editor";
import { uploadFile } from "@/api/tool/fileUpload";
import { listDept } from "@/api/system/dept";
import { listDept2 } from "@/api/system/dept";
export default {
  name: "Receivedocument",
  components: {
    Editor,
  },
  data() {
    return {
      // 树形
      data:[],
      //  defaultProps: {
      //   children: "children",
      //   label: "label",
      // },


      offices: [],
      defaultProps: {
        children: "children",
        label: "deptName",
      },
      
      imagesArray: [],
      imgList1: [],
      openshow5: false,
      projectId: undefined,
      project_flag: [],
      rowStore: undefined,
      receiveDocumentId: undefined,
      imgList5: [],
      drawer: false,
      flagShow: false,
      openshow: false,
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
      // 接收公文表格数据
      receivedocumentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      fileList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sendDocumentId: undefined,
        receivedById: undefined,
        readStatus: undefined,
        readTime: undefined,
        tag: undefined,
        sendTitle: undefined,
      },
      // 表单参数
      form: {},
      form1: {},
      form4: {},
      form2: {},
      form5: {},
      // 表单校验
      rules: {
        sendDocumentId: [
          { required: true, message: "发送公文id不能为空", trigger: "blur" },
        ],
        receivedById: [
          { required: true, message: "接收人id不能为空", trigger: "blur" },
        ],
        readStatus: [
          {
            required: true,
            message: "读取状态（1已读、0未读）不能为空",
            trigger: "blur",
          },
        ],
        tag: [
          {
            required: true,
            message: "标签(1置顶公文2紧急公文3重要公文4一般公文)不能为空",
            trigger: "blur",
          },
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
        projcetFlag: [
          { required: true, message: "请选择标签", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getProjectFlags();
    this.getlistDept();
  },

  methods: {
    getlistDept() {
      console.log(this.queryParams, "转发");
      listDept2(this.queryParams).then((response) => {
        console.log(response);
        this.offices = this.handleTree(response.data, "deptId");
        this.loading = false;
      });
    },
    sendProjectforOther() {
      var receivedByIds = this.$refs.tree.getCheckedKeys();
      console.log(receivedByIds)
      var sendTitle = this.form5.sendTitle;
      var attachment = JSON.stringify(this.imagesArray);
      var content = this.form5.content;
      var sendDocumentId = this.form5.sendDocumentId;
      var data = {
        sendTitle: sendTitle,
        attachment: attachment,
        content: content,
        sendDocumentId: sendDocumentId,
        deptIds: receivedByIds,
      };
      retransmission(data).then((response) => {
        if (response.code == 200) {
          this.$message.success("转发成功");
          this.getList();
          this.openshow5 = false;
        } else {
          this.$message.error("转发失败");
        }
      });
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
    sendProject(row) {
      console.log(row)
      this.imagesArray = [];
      this.imgList1 = [];
      this.openshow5 = true;
      this.form5 = row;
      var imgarr = JSON.parse(this.form5.attachment);
      if (imgarr != undefined) {
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
      }
    },
    saveProject() {
      this.$refs["form2"].validate((valid) => {
        this.form2.tag = this.form2.projcetFlag;
        this.form2.id = this.projectId;
        var data = this.form2;
        if (valid) {
          //setFlag
          setFlag(data).then((response) => {
            console.log(response);
            if (response.code == 200) {
              this.$message.success("保存成功");
              this.getList();
              this.flagShow = false;
            } else {
              this.$message.error("保存失败");
            }
          });
        }
      });
    },
    getProjectFlags() {
      this.getDictList("tag").then((response) => {
        var datas = response.data;
        for (var i = 0; i < datas.length; i++) {
          var obj = new Object();
          obj.label = datas[i].dictLabel;
          obj.value = datas[i].dictValue;
          this.project_flag.push(obj);
        }
      });
    },
    setFlag(data) {
      this.projectId = undefined;
      this.projectId = data.id;
      this.flagShow = true;
      this.title = "标记为";
    },
    handleClose(done) {
      //  console.log(done)
      // this.drawer = false;
      done();
    },
    sendSave() {
      this.form4.receiveDocumentId = this.receiveDocumentId;
      this.$refs["form4"].validate((valid) => {
        var data = this.form4;
        if (valid) {
          replyMsg(data).then((response) => {
            if ((response.code = 200)) {
              this.responseDocument(this.rowStore);
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
    imgUpload5(data) {
      let formData = new FormData();
      formData.append("file", data.file);
      uploadFile(formData).then((response) => {
        console.log(response, "附件");
        this.form4.attachment = response.fileName;
      });
    },

    //删除图片时的操作
    imgRemove5() {},
    handlePreview5(file) {
      console.log(file);
    },
    cancelDetile() {
      this.openshow = false;
    },
    // 查看回复
    responseDocument(row) {
      var dom = document.getElementsByClassName("wechart")[0];
      if (dom != undefined) {
        dom.innerHTML = "";
      }

      this.rowStore = row;
      this.receiveDocumentId = undefined;
      this.drawer = true;
      this.receiveDocumentId = row.id;
      var receiveDocumentId = row.id;
      reply(receiveDocumentId).then((response) => {
        console.log(response);
        var chars = response.data;
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
              '<a target="_blank" href="' +
              this.contextPath +
              data.attachment +
              '">附件</a></i></li>';
          }

          htmltext += "</ul>";
        }
        dom.innerHTML = htmltext;
      });
    },
    /** 查询接收公文列表 */
    getList() {
      this.loading = true;
      listReceivedocument(this.queryParams).then((response) => {
        this.receivedocumentList = response.rows;
        console.log(this.receivedocumentList);
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
        sendDocumentId: undefined,
        receivedById: undefined,
        readStatus: "0",
        readTime: undefined,
        tag: undefined,
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
      this.open = true;
      this.title = "添加接收公文";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.openshow = true;
      this.reset();
      const id = row.id || this.ids;
      getReceivedocument(id).then((response) => {
        console.log(response.data);
        this.form1 = response.data.srSendDocument;
        var fileList = JSON.parse(this.form1.attachment);
        var htmlStr = "";
        var html = document.getElementById("fileList");
        console.log(html);
        for (var i = 0; i < fileList.length; i++) {
          var file = fileList[i];
          htmlStr +=
            '<a style="color:blue" href=' +
            this.contextPath +
            file.url +
            ">" +
            file.fileName +
            "</a><br/>";
        }
        html.innerHTML = htmlStr;
        console.log();
        document
          .getElementsByClassName("ql-editor")[0]
          .setAttribute("contenteditable", "false");

        // this.title = "详情";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateReceivedocument(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addReceivedocument(this.form).then((response) => {
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
        '是否确认删除接收公文编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delReceivedocument(ids);
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
      this.$confirm("是否确认导出所有接收公文数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportReceivedocument(queryParams);
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
  height: 440px;
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
</style>
