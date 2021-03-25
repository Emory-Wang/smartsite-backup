<template>
      <el-main>
        <div style="text-align: left; margin-bottom: 15px;">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="标准分类">
              <el-select v-model="formInline.firstClassId" filterable placeholder="一级分类" @change="selectFirstClass">
                <el-option v-for="(item,index) in firstClassification" :key="index" :label="item.name" :value="item.id" />
              </el-select>
              <el-select v-model="formInline.secondClassId" filterable placeholder="二级分类" @change="selectSecondClass"
                style="margin-left: 20px;">
                <el-option v-for="(item,index) in secondClassification" :key="index" :label="item.name" :value="item.id" />
              </el-select>

            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onClassSubmit">查询</el-button>
              <el-button @click="onClear">重置</el-button>
            </el-form-item>
          </el-form>

          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-button type="primary" icon="el-icon-plus" @click="open">新建</el-button>
                <el-button type="primary" @click="exportExcel">全部导出</el-button>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <span>标准项关键字搜索</span>
                <el-input placeholder="请输入内容" v-model="input" clearable style="width:300px">
                </el-input>
                <el-button type="primary" @click="onKeySubmit" icon="el-icon-search"></el-button>
              </div>
            </el-col>
          </el-row>
        </div>


        <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
          <el-table-column prop="id" label="ID">
          </el-table-column>
          <el-table-column prop="short_cut" label="标准项">
          </el-table-column>
          <el-table-column prop="equips" label="关联设备">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click="onEdit(scope.row.id)" type="success" size="small">编辑</el-button>
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
    name: 'Standards',
    methods: {
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
        this.$axios.get('http://localhost:8181/Item/findAll').then((response) => {
          //用axios的方法引入地址
          this.standardList = response.data;
          this.tableData = this.standardList;
          console.log(response);
        })
      },
      getFirstSelectList() {
        this.$axios.get('http://localhost:8181/FirstLevel/findAll').then((response) => {
          //用axios的方法引入地址
          this.firstClassification = response.data;
          console.log(response);
        })

      },
      getSecondSelectList() {
        this.$axios.get('http://localhost:8181/SecondLevel/findAll', {
          params: {
            first_level_id: this.formInline.firstClassId
          }
        }).then((response) => {
          //用axios的方法引入地址
          this.secondClassification = response.data;
          console.log(response);
        })
      },
      selectFirstClass(val) {
        this.getSecondSelectList();
      },
      selectSecondClass(val) {

      },
      //按照标准分类查询
      onClassSubmit() {
        var temptable = []
        if (this.formInline.secondClassId === '') {
          for (var item of this.standardList) {
            if (this.formInline.firstClassId === item.first_level_id) {
              temptable.push(item)
            }
          }
        } else {
          for (var item of this.standardList) {
            if (this.formInline.firstClassId === item.first_level_id && this.formInline.secondClassId === item.second_level_id) {
              temptable.push(item)
            }
          }
        }

        this.tableData = temptable
      },
      onClear() {
        this.formInline.firstClassId = this.formInline.secondClassId = '';
        this.getTableData();
      },
      //关键字查询
      onKeySubmit() {
        var temptable = []
        for (var item of this.standardList) {
          if (item.standard.indexOf(this.input) != -1) {
            temptable.push(item)
          }
        }
        this.tableData = temptable
      },
      open() {
        this.$router.push({
          name: 'NewStandards'
        })
      },
      onEdit(_id) {
        this.$router.push({
          name: 'EditStandards',
          query: {
            "id": _id
          }
        })
      },
      onDelete(_id) {
        this.$confirm('是否删除标准项及其关联设备', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //后台接口
          this.$axios(
          {
            method:'get',
            url:'http://localhost:8181/Item/delete',
            params:{
              id: _id
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
          this.getTableData()
          this.reload()
        });
      },
      //下载全部表格
      exportExcel() {
        import('@/assets/excel/Export2Excel').then(excel => {
          const tHeader = ["ID", "标准项", "关联设备"]; // 导出的excel表头名信息
          const filterVal = ["id", "standard", "equipment"]; // 导出的excel表头字段名，需要导出表格字段名
          const list = this.standardList;
          const data = this.formatJson(filterVal, list)
          const autoWidth = true;
          excel.export_json_to_excel({
            header: tHeader, //表头
            data, //数据
            filename: "标准项列表", //名称
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
        standardList: [],
        tableData: [],
        formInline: {
          firstClassId: '',
          secondClassId: ''
        },
        firstClassification: [],
        secondClassification: [],
        input: '',
        pageSize: 10, //每页条数,  默认3条
        totalRecords: 0, //总条数
        currentPage: 1
      }
    },
    mounted() {
      this.getFirstSelectList();
      this.getTableData();
    }
  };
</script>
