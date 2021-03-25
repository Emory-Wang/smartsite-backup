<template>

      <el-main>
        <el-container>
          <el-page-header @back="goBack" content="设备属性详情"></el-page-header>

        </el-container>


        <div class="op">
          <el-button type="primary" icon="el-icon-plus" @click="open">添加</el-button>
        </div>

        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple" style="text-align: left;">
              <h4>设备类型：{{equip_name}}</h4>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <span>设备属性关键字搜索</span>
              <el-input placeholder="请输入内容" v-model="input" clearable style="width:300px">
              </el-input>
              <el-button type="primary" @click="onKeySubmit" icon="el-icon-search"></el-button>
              <el-button @click="onClear" icon="el-icon-minus"></el-button>
            </div>
          </el-col>
        </el-row>

        <el-table ref="multipleTable" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
          <el-table-column prop="id" label="ID">

          </el-table-column>
          <el-table-column prop="name" label="属性">
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

<script>
  export default {
    name: 'Property',
    inject: ['reload'],
    data() {
      return {
        properList:[],
        tableData: [],
        equip_id: "",
        equip_name: "",
        multipleSelection: [],
        input:'',
        pageSize: 10, //每页条数,  默认3条
        totalRecords: 0, //总条数
        currentPage: 1,
      }
    },

    methods: {
      goBack() {
        this.$router.push({
          name: 'Equipment'
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
      //关键字查询
      onKeySubmit(){
        var temptable = []
        for(var item of this.properList){
          if(item.name.indexOf(this.input) != -1){
              temptable.push(item)
          }
        }
        this.tableData = temptable
      },
      onClear(){
        this.input = '';
        this.tableData = this.properList;
        this.currentPage = 1;
        this.pageSize = 10;
      },
      open() {
        this.$prompt('请输入设备属性', '新建属性', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
          inputErrorMessage: '输入包含非法字符'
        }).then(({
          value
        }) => {
          //后台接口
          this.$axios(
          {
            method:'post',
            url:'http://localhost:8181/Property/insert',
            data: {
              equip_id: this.equip_id,
              name: value
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
                message: '新建属性：' + value
              });
            }
          });
          this.getTableList(); //重新加载表格

        });


      },
      onEdit(_id) {
        this.$prompt('请输入属性名称', '修改属性', {
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
            url:'http://localhost:8181/Property/edit',
            data: {
              id: _id,
              equip_id:this.equip_id,
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
                message: '修改属性：' + _id + value
              });
            }
          });
          this.getTableList(); //重新加载表格
          this.reload()
        });

      },
      onDelete(_id) {
        this.$confirm('是否删除属性', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //后台接口
          this.$axios(
          {
            method:'post',
            url:'http://localhost:8181/Property/delete',
            data: {
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
                message: '删除成功!' + _id
              });
            }
          });
          this.getTableList();
          this.reload()
        });

      },
      getTableList() {
        this.$axios.get('http://localhost:8181/Property/findAll', {
          params: {
            equip_id: this.equip_id
          }
        }).then((response) => {
          //用axios的方法引入地址
          this.properList = response.data
          this.tableData = this.properList
          console.log(response);
        })
      }
    },

    created() {
      this.equip_name = this.$route.query.name;
      this.equip_id = this.$route.query.id;
      this.getTableList();
    },
    mounted() {

    }
  }
</script>

<style>
  .op {
    text-align: left;
    margin-top: 40px;
    margin-bottom: 10px;
  }

  .block {
    text-align: right;
  }
</style>
