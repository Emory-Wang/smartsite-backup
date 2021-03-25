<template>
      <el-main>
        <div style="text-align: left;margin-bottom: 10px;">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="设备类型">
              <el-select v-model="formInline.equipId" filterable placeholder="设备类型">
                <el-option v-for="(item, index) in options" :key="index" :label="item.equip_name" :value="item.id">
                </el-option>
              </el-select>

            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="onClear">重置</el-button>
            </el-form-item>
          </el-form>

          <el-button type="primary" icon="el-icon-plus" @click="open">新建设备</el-button>
          <el-button type="primary" @click="exportExcel">全部导出</el-button>
        </div>

        <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
          <el-table-column prop="id" label="ID">
          </el-table-column>
          <el-table-column prop="equip_name" label="设备类型">
          </el-table-column>
          <el-table-column prop="propers" label="属性名称">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="onDetail(scope.row.id,scope.row.equip_name)" type="primary" size="small">详情</el-button>
              <el-button @click="onEdit(scope.row.id,scope.row.equip_name)" type="success" size="small">编辑</el-button>
              <el-button @click="onDelete(scope.row.id)" type="danger" size="small">删除</el-button>
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
  .block {
    text-align: right;
  }
</style>

<script>
  export default {
    name: 'Equipment',
    inject: ['reload'],
    methods: {

      //获取表格数据
      getTableList() {
        this.$axios.get('http://localhost:8181/Equipment/findAll').then((response) => {
          //用axios的方法引入地址
          this.equipList = response.data;
          this.tableData = this.equipList;
          this.options = this.equipList; //设备类型检索
          console.log(response);
        })
      },
      //查询响应
      onSubmit() {
        var temptable = []
        for (var item of this.equipList) {
          if (this.formInline.equipId === item.id) {
            temptable.push(item)
          }
        }
        this.tableData = temptable
      },
      //重置查询
      onClear() {
        this.formInline.equipId = '';
        this.tableData = this.equipList;
        this.currentPage = 1;
        this.pageSize = 10;
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
      //新建
      open() {
        this.$prompt('请输入设备类型', '新建设备', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
          inputErrorMessage: '输入含非法字符'
        }).then(({
          value
        }) => {
          //后台接口
          this.$axios({
            method:'post',
            url: 'http://localhost:8181/Equipment/insert',
            data: {
              equip_name: value
            },
            headers: {
              'Content-Type': 'application/json' //如果写成contentType会报错
            }
          }).then((response) => {
            console.log(response);
            if (response.status != 200) {
              this.$message.error("添加失败!");
            } else {
              this.$message({
                type: 'success',
                message: '新建设备：' + value
              });
            }
          });
        this.getTableList() //重新加载表格
        this.reload()
        });


      },
      //修改
      onEdit(_equip_id, _equip_name) {
        this.$prompt('请输入设备类型', '修改设备', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
          inputErrorMessage: '输入包含非法字符'
        }).then(({
          value
        }) => {
          //后台接口
          this.$axios({
            method:'post',
            url:'http://localhost:8181/Equipment/edit',
            data: {
              id: _equip_id,
              equip_name: value
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
        this.getTableList() //重新加载表格
        this.reload()
        });

      },
      //删除
      onDelete(_equip_id) {
        this.$confirm('是否删除设备及其属性', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //后台接口
          this.$axios({
            method:'post',
            url:'http://localhost:8181/Equipment/delete',
            data: {
              id: _equip_id
            },
            headers: {
              'Content-Type': 'application/json' //如果写成contentType会报错
            }
          }).then((response) => {
            console.log(response);
            if (response.status != 200) {
              this.$message.error("删除失败!");
            } else {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }
          });
          this.getTableList() //重新加载表格
          this.reload()
        });

      },
      //详情，跳转属性页
      onDetail(_id, _name) {
        this.$router.push({
          name: 'Property',
          query: {
            id: _id,
            name: _name
          }
        })
      },
      //下载全部表格
      exportExcel() {
        import('@/assets/excel/Export2Excel').then(excel => {
          const tHeader = ["ID", "设备类型", "属性名称"]; // 导出的excel表头名信息
          const filterVal = ["id", "equip_name", "proper_name"]; // 导出的excel表头字段名，需要导出表格字段名
          const list = this.equipList;
          const data = this.formatJson(filterVal, list)
          const autoWidth = true;
          excel.export_json_to_excel({
            header: tHeader, //表头
            data, //数据
            filename: "设备类型列表", //名称
            autoWidth: true, //宽度自适应
          })
        })
      },
      //格式转换,不需要改动
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      }

    },
    data() {
      return {
        equipList: [], //所有设备列表
        tableData: [], //表格数据
        options: "", //选项列表
        formInline: {
          equipId: "" //选项值
        },
        pageSize: 10, //每页条数,  默认3条
        totalRecords: 0, //总条数
        currentPage: 1
      }
    },
    //页面加载时载入数据
    mounted() {
      this.getTableList();
    }
  }
</script>
