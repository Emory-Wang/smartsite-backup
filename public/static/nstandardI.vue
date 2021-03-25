<template>
	<el-main>
	<div>
		<el-son-header style="text-align: left; font-size: 20px">
			<span>新建标准</span>
		</el-son-header>
		<el-form :inline="true" class="demo-form-inline">
							<el-form-item label="标准编号:">
								<el-input v-model="inputid" placeholder="请输入id"></el-input>
							</el-form-item>
						</el-form>
		<el-form :inline="true" :model="cproject" class="demo-form-inline">
						<el-form-item label="选择工程类型">
							<el-select v-model="cproject.value" placeholder="请选择">
								<el-option
							      v-for="(item,index) in options"
							      :key="index"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							</el-select>
						</el-form-item>
						</el-form>
						<el-form :inline="true" :model="clevel" class="demo-form-inline">
										<el-form-item label="标准所属级别:">
											<el-select v-model="clevel.value" placeholder="请选择">
											    <el-option
											      v-for="item in options1"
											      :key="item.value"
											      :label="item.label"
											      :value="item.value">
											    </el-option>
											  </el-select>
										</el-form-item>
										</el-form>
						<el-form :inline="true" :model="cplace" class="demo-form-inline">
											<el-form-item label="所属地区:">
												<el-select v-model="cplace.value" placeholder="请选择">
												    <el-option
												      v-for="item in options2"
												      :key="item.value"
												      :label="item.label"
												      :value="item.value">
												    </el-option>
												  </el-select>
											</el-form-item>
											</el-form>
											<el-form :inline="true" class="demo-form-inline">
																<el-form-item label="标准名称:">
																	<el-input v-model="input" placeholder="请输入内容"></el-input>
																</el-form-item>
															</el-form>
		<el-button type="primary" @click="getvalue">确定</el-button>
		</div>
		</el-main>
</template>

<script>
  export default {
	  methods: {
		  getTableList() {
		    this.$axios.get('http://localhost:8080/list/pro.json').then((response) => {
		      //用axios的方法引入地址
		      this.options=response.data;
		      console.log(response);
		    })
		  },
				  getvalue() {
				    this.$confirm('信息确认？', '提示', {
				      confirmButtonText: '确定',
				      cancelButtonText: '取消',
				      type: 'warning'
				    }).then(() => {
				      //后台接口
				      this.$axios.get('http://localhost:8080/sumdata.json', {
				        params: {
							id:this.inputid,
							name:this.input,
				           project:this.cproject.value,
				           level:this.clevel.value,
				           place:this.cplace.value,
				        }
				      }).then((response) => {
				        console.log(response);
				        if (response.status != 200) {
				          this.$message.error("删除失败!");
				        } else {
				          this.$message({
				            type: 'success',
				            message: '新建标准'+this.input
				          });
				        }
				      });
				    });
				    this.getTableList();  //重新加载表格
				  },
	  },
    data() {
      return {
		   options: "", //选项列表
			  cproject:{
				  value:'',
			  },
			  options1: [{
				  value: '地方标准',
				    label: '地方标准'
				  }, {
				    value: '企业标准',
				    label: '企业标准'
				  }, {
				    value: '行业标准',
				    label: '行业标准'
				  }],
				  clevel:{
					  value:'',
					  },
					  options2: [{
					  	            value: '北京市',
					  	            label: '北京市'
					  	          }, {
					  	            value: '天津市',
					  	            label: '天津市'
					  	          }, {
					  	            value: '重庆市',
					  	            label: '重庆市'
					  	          }],
								   cplace:{
									   value:'',
									   },
									   input:'',
									   inputid:''
      }
    },
	mounted(){
		this.getTableList();
	}
  };
</script>

<style>
</style>
