<template>
      <el-main>
        <el-container style="margin-bottom: 40px;">
          <el-page-header @back="goBack" content="新建标准项"></el-page-header>
        </el-container>

        <el-container style="text-align: left">
          <el-form :model="form" :ref="form" label-width="150px" class="demo-form">
            <el-form-item label="一级分类" prop="firstClassid">
              <el-select v-model="form.firstClassid" filterable placeholder="请选择一级分类" @change="selectFirstClass">
                <el-option v-for="(item,index) in firstClassification" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="二级分类" prop="secondClassid">
              <el-select v-model="form.secondClassid" filterable placeholder="请选择二级分类">
                <el-option v-for="(item,index) in secondClassification" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>

            <el-form-item label="标准内容" prop="desc">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>

            <el-form-item label="是否关联设备" prop="delivery">
              <el-switch v-model="form.delivery"></el-switch>
            </el-form-item>

            <div v-show="form.delivery">
              <el-form-item label="设备类型" prop="equips">
                <el-cascader :options="options" :props="{ multiple: true }" filterable v-model="form.equips"></el-cascader>
              </el-form-item>
            </div>

            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">创建</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-container>
      </el-main>
</template>

<script>
  export default {
    name: 'NewStandards',
    data() {
      return {
        form: {
          firstClassid: '',
          secondClassid: '',
          delivery: false,
          desc: '',
          equips: []
        },
        firstClassification: [],
        secondClassification: [],
        options: []
      };
    },
    methods: {
      goBack() {
        this.$router.push({
          name: 'Standards'
        });
      },
      submitForm() {

        this.$axios({
          method: 'post',
          url: 'http://localhost:8181/Item/insert',
          data: {
            "first_level_id": this.form.firstClassid,
            "second_level_id": this.form.secondClassid,
            "short_cut": this.form.desc,
            "property_related": this.form.delivery,
            "properties": this.form.equips
          },
          headers: {
            'Content-Type': 'application/json' //如果写成contentType会报错
          }
        }).then((response) => {
          //用axios的方法引入地址
          if (response.status != 200) {
            this.$message.error("添加失败!");
          } else {
            this.$message.success("添加成功!");
            this.$router.push({
              name: 'Standards'
            });
          }
        })

      },
      resetForm() {
        this.form.equips = [];
        this.form.desc = '';
        this.form.delivery = false;
        this.form.firstClassid = '';
        this.form.secondClassid = '';
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
            first_level_id: this.form.firstClassid
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
      getCascaderData() {
        this.$axios.get('http://localhost:8181/Cascader').then((response) => {
          //用axios的方法引入地址
          this.options = response.data;
          console.log(response);
        })

      }
    },
    mounted() {
      this.getFirstSelectList();
      this.getCascaderData();
    }
  }
</script>

<style>

  .block {
    text-align: right;
  }
</style>
