<template> 
      <el-main>
        <div style="text-align: left; margin-bottom: 15px;">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="标准分类模板:">
              <el-select v-model="formInline.template" placeholder="统一标准分类">
                <el-option v-for="(item,index) in optionsTemplate" :key="item.value" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="onClear">重置</el-button>
            </el-form-item>
          </el-form>
          <h3>{{templates.tempName}}</h3>
          <el-row>
            <el-col :span="18">
              <div class="grid-content bg-purple">
                <el-button type="primary" @click="dialogAddClass.dialogVisibleAdd = true">添加分类项</el-button>
                <el-dialog title="添加分类" :visible.sync="dialogAddClass.dialogVisibleAdd" width="30%" @close="refreshDialog">
                  <el-form ref="form" :model="dialogAddClass.form" label-width="100px">

                    <div>
                      <el-form-item label="一级分类项">
                        <el-select v-model="dialogAddClass.form.first_level" placeholder="请选择" @change="selectChangeFirstLevels">
                          <el-option v-for="(item,index) in dialogAddClass.firstTempLevels" :key="index" :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="二级分类项">
                        <el-select v-model="dialogAddClass.form.second_level" placeholder="请选择">
                          <el-option v-for="(item,index) in dialogAddClass.secondLevels" :key="item.value" :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="refreshDialog">取 消</el-button>
                    <el-button type="primary" @click="addClass">确 定</el-button>
                  </span>
                </el-dialog>
              </div>
            </el-col>



            <el-col :span="6">
              <div class="grid-content bg-purple-light">
                <el-button type="primary" @click="dialogVisibleNew = true">修改模板名称</el-button>
                <el-dialog title="修改模板名称" :visible.sync="dialogVisibleNew " width="30%">
                  <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="模板名称">
                      <el-input v-model="form.name"></el-input>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleNew = false">取 消</el-button>
                    <el-button type="primary" @click="editStanTemplate">确 定</el-button>
                  </span>
                </el-dialog>
              </div>
            </el-col>
          </el-row>
        </div>


        <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" row-key="uuid" border
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="uuid" label="uuid" v-if="false">
          </el-table-column>
          <el-table-column prop="id" label="ID">
          </el-table-column>
          <el-table-column prop="name" label="标准分类名称">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="onDelete(scope.row)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>


        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
          </el-pagination>
        </div>
        <div style="text-align: right; margin-top: 20px;">
          <el-button type="danger" @click="deleteTemp">删除此模板</el-button>
        </div>


      </el-main>
</template>

<style>
 
</style>

<script>
  export default {
    name: 'ClassTemplate',
    inject: ['reload'],
    methods: {
      load(tree, treeNode, resolve) {
        setTimeout(() => {
          resolve([{
            id: 31,
            name: '人员监控',
            ope: '编辑',
          }, {
            id: 32,
            name: '人员监控',
            ope: '编辑',
          }])
        }, 1000)
      },
      handleClick(row) {
        console.log(row);
      },
      onSubmit() {
        this.$router.push({
          name: 'ClassTemplate',
          query: {
            tempId: this.formInline.template
          }
        })
        this.reload();
      },
      onClear() {
        this.formInline.template = ''
        this.$router.push({
          name: 'StandardClass'
        })
      },
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
      refreshDialog(refname) {
        this.dialogAddClass.form.level = ''
        this.dialogAddClass.form.first_level = ''
        this.dialogAddClass.form.second_level = ''
        this.dialogAddClass.dialogVisibleAdd = false
      },
      getDialogData() { //选择器数据

        this.$axios.get('http://localhost:8181/TemplateLevel/firstLevels', {
          params: {
            tempId: this.templates.tempId
          }
        }).then((response) => {
          //添加二级分类 取模板不存在的一级分类数据
          this.dialogAddClass.firstTempLevels = response.data;
          console.log(response);
        })
      },
      selectChangeFirstLevels() { //一二级分类二级联动
        this.$axios.get('http://localhost:8181/TemplateLevel/secondLevels', {
          params: {
            tempId: this.templates.tempId,
            first_level_id: this.dialogAddClass.form.first_level
          }

        }).then((response) => {
          this.dialogAddClass.secondLevels = response.data;
          console.log(response);
        })
      },
      addClass() {
        this.$axios({
          method: 'post',
          url: 'http://localhost:8181/TemplateLevel/insert',
          data: {
            "template_id": this.templates.tempId,
            "second_level_id": this.dialogAddClass.form.second_level
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          if (response.status != 200) {
            this.$message.error("添加失败")
          } else {
            this.$message.success("添加成功");
          }
          console.log(response);
        })

        this.getTableData()
        this.refreshDialog()
        this.reload()
      },

      getTableData() {
        this.$axios.get('http://localhost:8181/TemplateLevel/list', {
          params: {
            tempId: this.templates.tempId
          }
        }).then((response) => {
          this.tableData = response.data;
          console.log(response);
        })
        this.$axios.get('http://localhost:8181/Template/findAll').then((response) => {
          this.optionsTemplate = response.data;
          console.log(response);
        })
        this.$axios.get('http://localhost:8181/Template/select', {
          params: {
            id: this.templates.tempId
          }
        }).then((response) => {
          this.templates.tempName = response.data;
          console.log(response);
        })
      },
      onDelete(obj) {
        this.$confirm('是否删除分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (obj.first_level_id == 0) {
            this.$axios.get('http://localhost:8181/TemplateLevel/deleteFirstLevel', {
              params: {
                tempId: this.templates.tempId,
                id: obj.id
              }
            }).then((response) => {
              console.log(response);
              if (response.status != 200) {
                this.$message.error("删除失败!");
              } else {
                this.$message({
                  type: 'success',
                  message: '删除成功' + obj.id
                });
              }
            });
          } else {
            this.$axios.get('http://localhost:8181/TemplateLevel/deleteSecondLevel', {
              params: {
                tempId: this.templates.tempId,
                id: obj.id
              }
            }).then((response) => {
              console.log(response);
              if (response.status != 200) {
                this.$message.error("删除失败!");
              } else {
                this.$message({
                  type: 'success',
                  message: '删除成功' + obj.id
                });
              }
            });

          }
        this.getTableData() //重新加载表格
        });

      },

      editStanTemplate() {
        this.$axios({
          method: 'post',
          url: 'http://localhost:8181/Template/edit',
          data: {
            id: this.templates.tempId,
            name: this.form.name
          },
          headers: {
            'Content-Type': 'application/json' //如果写成contentType会报错
          }
        }).then((response) => {
          console.log(response);
          if (response.status != 200) {
            this.$message.error("修改失败!");
          } else {
            this.$message({
              type: 'success',
              message: '修改成功' + this.form.name
            });
            this.templates.tempName = this.form.name
          }
        });
        this.dialogVisibleNew = false
        this.getTableData()
      },
      deleteTemp() {
        this.$confirm('是否删除该模板', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //后台接口
          this.$axios.get('http://localhost:8181/Template/delete', {
            params: {
              id: this.templates.tempId
            }
          }).then((response) => {
            console.log(response);
            if (response.status != 200) {
              this.$message.error("删除失败!");
            } else {
              this.$message({
                type: 'success',
                message: '删除模板成功'
              });
              this.$router.push({
                name: 'StandardClass'
              })
            }
          });
        });

      }
    },
    data() {
      return {
        tableData: [],
        dialogAddClass: {
          dialogVisibleAdd: false,
          firstClassVisible: true,
          secondClassVisible: false,
          options: [{
            value: 1,
            label: '一级分类'
          }, {
            value: 2,
            label: '二级分类'
          }],
          form: {
            level: '',
            first_level: '',
            second_level: ''
          },
          firstLevels: [],
          firstTempLevels: [],
          secondLevels: []
        },

        templates: {
          tempId: '',
          tempName: '',
        },
        dialogVisibleNew: false,
        form: {
          name: ''
        },

        optionsTemplate: [],
        options: [{
          value: 1,
          label: '一级分类'
        }, {
          value: 2,
          label: '二级分类'
        }],
        formInline: {
          template: ''
        },
        pageSize: 10, //每页条数,  默认3条
        totalRecords: 0, //总条数
        currentPage: 1,
      }
    },
    created() {
      this.templates.tempId = this.$route.query.tempId
      //this.templates.tempName = this.$route.query.tempName
      this.getTableData()
      this.getDialogData()
    }
  };
</script>
