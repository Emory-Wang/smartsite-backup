<template>
      <el-main>
        <div style="text-align: left; margin-bottom: 15px;">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="标准分类模板:">
              <el-select v-model="formInline.template" placeholder="统一标准分类">
                <el-option v-for="(item,index) in optionsTemplate" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="onClear">重置</el-button>
            </el-form-item>

          </el-form>
          <h3>统一标准分类</h3>
          <el-row>


            <el-col :span="18">
              <div class="grid-content bg-purple">
                <el-button type="primary" @click="dialogAddClass.dialogVisibleAdd = true">添加分类项</el-button>
                <el-dialog title="添加分类" :visible.sync="dialogAddClass.dialogVisibleAdd" width="30%" @close="refreshDialog">
                  <el-form ref="form" :model="dialogAddClass.form" label-width="100px">
                    <el-form-item label="分类级别">
                      <el-select v-model="dialogAddClass.form.level" placeholder="请选择" @change="selectChange">
                        <el-option v-for="(item,index) in dialogAddClass.options" :key="index" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <div v-show="dialogAddClass.firstClassVisible">
                      <el-form-item label="分类名称">
                        <el-input v-model="dialogAddClass.form.first_level_name"></el-input>
                      </el-form-item>
                    </div>
                    <div v-show="dialogAddClass.secondClassVisible">
                      <el-form-item label="一级分类">
                        <el-select v-model="dialogAddClass.form.first_level" placeholder="请选择">
                          <el-option v-for="(item,index) in dialogAddClass.firstLevels" :key="index" :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="分类名称">
                        <el-input v-model="dialogAddClass.form.second_level_name"></el-input>
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
                <el-button type="primary" @click="dialogVisibleNew = true">新建标准分类模板</el-button>
                <el-dialog title="添加分类模板" :visible.sync="dialogVisibleNew " width="30%">
                  <el-form ref="form_name" :model="form_name" label-width="100px">
                    <el-form-item label="模板名称">
                      <el-input v-model="form_name.tempName"></el-input>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleNew = false">取 消</el-button>
                    <el-button type="primary" @click="newStanTemplate">确 定</el-button>
                  </span>
                </el-dialog>
              </div>
            </el-col>
          </el-row>
        </div>


        <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" row-key="uuid" border
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="uuid" label="uuid" v-if="false">
            <!--树形表格不重复-->
          </el-table-column>
          <el-table-column prop="id" label="ID">
          </el-table-column>
          <el-table-column prop="name" label="标准分类名称">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="onEdit(scope.row)" type="success" size="small">编辑</el-button>
              <el-button @click="onDelete(scope.row)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>


        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
          </el-pagination>
        </div>
      </el-main>
</template>

<style>
</style>

<script>
  export default {
    name: 'StandardClass',
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
      },
      onClear() {
        this.formInline.template = ''
        this.$router.push({
          name: 'StandardClass'
        })
      },
      selectChange() {
        if (this.dialogAddClass.form.level == 1) {
          this.dialogAddClass.firstClassVisible = true;
          this.dialogAddClass.secondClassVisible = false;
        } else {
          this.dialogAddClass.firstClassVisible = false;
          this.dialogAddClass.secondClassVisible = true;
        }
      },
      refreshDialog(refname) {
        this.dialogAddClass.form.level = ''
        this.dialogAddClass.form.first_level = ''
        this.dialogAddClass.form.first_level_name = ''
        this.dialogAddClass.form.second_level_name = ''
        this.dialogAddClass.dialogVisibleAdd = false
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
      getTableData() {
        this.$axios.get('http://localhost:8181/FirstLevel/list').then((response) => {
          this.tableData = response.data;
          console.log(response);
        })

        //获取所有模板数据
        this.$axios.get('http://localhost:8181/Template/findAll').then((response) => {
          this.optionsTemplate = response.data;
          console.log(response);
        })
        this.$axios.get('http://localhost:8181/FirstLevel/findAll').then((response) => {
          this.dialogAddClass.firstLevels = response.data;
          console.log(response);
        })
      },

      //添加分类数据
      addClass() {
        if (this.dialogAddClass.form.level == 1) {
          this.$axios({
            method: 'post',
            url: 'http://localhost:8181/FirstLevel/insert',
            data: {
              name: this.dialogAddClass.form.first_level_name
            },
            headers: {
              'Content-Type': 'application/json' //如果写成contentType会报错
            }
          }).then((response) => {
            if (response.status != 200) {
              this.$message.error("添加失败")
            } else {
              this.$message.success("添加成功");
            }
            console.log(response);
          })
        } else {
          this.$axios({
            method: 'post',
            url: 'http://localhost:8181/SecondLevel/insert',
            data: {
              "first_level_id": this.dialogAddClass.form.first_level,
              "name": this.dialogAddClass.form.second_level_name
            },
            headers: {
              'Content-Type': 'application/json' //如果写成contentType会报错
            }
          }).then((response) => {
            if (response.status != 200) {
              this.$message.error("添加失败")
            } else {
              this.$message.success("添加成功");
            }
            console.log(response);
          })
        }

        this.getTableData()
        this.refreshDialog()
        this.reload()

      },
      onEdit(obj) {
        this.$prompt('请输入分类名称', '修改分类', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({
          value
        }) => {
          if (obj.first_level_id === 0) {
            this.$axios({
              method: 'post',
              url: 'http://localhost:8181/FirstLevel/edit',
              data: {
                id: obj.id,
                name: value
              },
              headers: {
                'Content-Type': 'application/json' //如果写成contentType会报错
              }
            }).then((response) => {
              if (response.status != 200) {
                this.$message.error("修改失败!");
              } else {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                });
              }
            });
          } else {
            this.$axios({
              method: 'post',
              url: 'http://localhost:8181/SecondLevel/edit',
              data: {
                id: obj.id,
                first_level_id: obj.first_level_id,
                name: value
              },
              headers: {
                'Content-Type': 'application/json' //如果写成contentType会报错
              }
            }).then((response) => {
              if (response.status != 200) {
                this.$message.error("修改失败!");
              } else {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                });
              }
            });

          }
          this.getTableData()
        });
      },
      onDelete(obj) {
        this.$confirm('是否删除分类', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (obj.first_level_id === 0) {
            //后台接口
            this.$axios.get('http://localhost:8181/FirstLevel/delete', {
              params: {
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
            //后台接口
            this.$axios.get('http://localhost:8181/SecondLevel/delete', {
              params: {
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
          this.getTableData()

        });

      },

      //新建分类模板---输入名称
      newStanTemplate() {
        var name = this.form_name.tempName
        var id = '新建模板id'
        this.$axios({
          method: 'post',
          url: 'http://localhost:8181/Template/insert',
          data: {
            name: name
          },
          headers: {
            'Content-Type': 'application/json' //如果写成contentType会报错
          }
        }).then((response) => {
          
          console.log(response);
          if (response.status != 200) {
            this.$message.error("新建模板失败!")
          } else {
            this.$message.success("新建模板成功");
            //获取新建模板id
           id = response.data;
            this.$router.push({
              name: 'ClassTemplate',
              query: {
                tempId: id
              }
            })
          }
        })

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
            first_level_name: '',
            second_level_name: ''
          },
          firstLevels: []
        },
        optionsTemplate: [],

        dialogVisibleNew: false,
        formInline: {
          template: ''
        },
        form_name: {
          tempName: ''
        },
        pageSize: 10, //每页条数,  默认3条
        totalRecords: 0, //总条数
        currentPage: 1,
      }
    },
    mounted() {
      this.getTableData();
    }
  };
</script>
