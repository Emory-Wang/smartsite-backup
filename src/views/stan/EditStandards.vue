<template>
      <el-main>
        <el-container style="margin-bottom: 40px;">
          <el-page-header @back="goBack" content="编辑标准项"></el-page-header>
        </el-container>

        <el-container style="text-align: left;">
          <el-form :model="form" :ref="form" label-width="150px" class="demo-form">
            <el-form-item label="一级分类" prop="firstClassid">
              <el-select v-model="form.firstClassid" filterable placeholder="请选择一级分类" @change="selectFirstClass">
                <el-option v-for="item in firstClassification" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="二级分类" prop="secondClassid">
              <el-select v-model="form.secondClassid" filterable placeholder="请选择二级分类">
                <el-option v-for="item in secondClassification" :key="item.id" :label="item.name" :value="item.id" />
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
              <el-button type="primary" @click="submitForm('form')">确定</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-container>
      </el-main>
</template>

<script>
  export default {
    name: 'EditStandards',
    data() {
      return {
        stanId:'',
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
        this.$router.push({
          name: 'Standards'
        });
        this.$axios({
            method:'post',
            url: 'http://localhost:8181/Item/edit',
            data: {
              "id":this.stanId,
              "first_level_id":this.form.firstClassid,
              "second_level_id":this.form.secondClassid,
              "short_cut":this.form.desc,
              "property_related":this.form.delivery,
              "properties":this.form.equips
            },
            headers: {
              'Content-Type': 'application/json' //如果写成contentType会报错
            }
          }).then((response) => {
          //用axios的方法引入地址
          if (response.status != 200) {
            this.$message.error("修改失败!");
          } else {
            this.$message.success("修改成功!");

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
      getSecondSelectList(_firstId) {
        this.$axios.get('http://localhost:8181/SecondLevel/findAll', {
          params: {
            first_level_id: _firstId
          }
        }).then((response) => {
          //用axios的方法引入地址
          this.secondClassification = response.data;
          console.log(response);
        })
      },
      selectFirstClass(val) {
        this.getSecondSelectList(val);
      },
      selectSecondClass(val) {

      },
      getCascaderData() {
        this.$axios.get('http://localhost:8181/Cascader').then((response) => {
          //用axios的方法引入地址
          this.options = response.data;
          console.log(response);
        })

      },
      getOriginData(){
          this.$axios.get('http://localhost:8181/Item/queryItem',
          {
            params:{
              "id":this.stanId
            }
          }
          ).then((response) => {
            //用axios的方法引入地址
            var v = response.data;
            console.log(response);

            this.form.firstClassid = v.first_level_id;
            this.getSecondSelectList(v.first_level_id);
            this.form.secondClassid = v.second_level_id;
            this.form.desc = v.short_cut;
            this.form.delivery = v.property_related;

            this.form.equips = v.properties;
          })
      }
    },
    created() {
      this.stanId = this.$route.query.id;
      this.getFirstSelectList();
      this.getCascaderData();
      this.getOriginData();
    }
  }
</script>

<style>

  .block {
    text-align: right;
  }
</style>
