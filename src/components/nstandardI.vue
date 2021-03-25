<template>
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
					<el-option v-for="(item,index) in options" :key="index" :label="item.business" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-form :inline="true" :model="clevel" class="demo-form-inline">
			<el-form-item label="标准所属级别:">
				<el-select v-model="clevel.value" placeholder="请选择">
					<el-option v-for="item in options1" :key="item.value" :label="item.level" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-form :inline="true" :model="cplace" class="demo-form-inline">
			<el-form-item label="所属地区:">
				<el-select v-model="cplace.value" placeholder="请选择">
					<el-option v-for="(item,index) in options2" :key="index" :label="item.place" :value="item.id">
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
</template>

<script>
	export default {
		methods: {
			getplaceList() {
				this.$axios.get('http://localhost:8181//City/findAll').then((response) => {
					//用axios的方法引入地址
					this.options2 = response.data;
					console.log(response);
				})
			},
			getTableList() {
				this.$axios.get('http://localhost:8181/Business/findAll').then((response) => {
					this.options = response.data;
					console.log(response);
				})
			},
			getClassList() {
				this.$axios.get('http://localhost:8181//StandardClass/findAll').then((response) => {
					this.options1 = response.data;
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
					this.$axios.post('http://localhost:8181/Standard/insert', {
						"id": this.inputid,
						"name": this.input,
						"business_id": this.cproject.value,
						"class_id": this.clevel.value,
						"province_id":1,		//后台对城市对应省份id进行了查询和修改（已完成）
						"city_id":this.cplace.value,
						"file":"文件"
					}).then((response) => {
						console.log(response);
						if (response.status != 200) {
							this.$message.error("删除失败!");
						} else {
							this.$message({
								type: 'success',
								message: '新建标准' + this.input
							});
							//this.getTableList(); //重新加载表格
							this.nextStep();
						}
					});
				});
				
			},
			nextStep() {
				this.$router.push({
				    path:'./nstandardII',
				    query:{
				      standard_id:this.inputid,
					  },
				  })
			},
		},
		data() {
			return {
				options: '',
				cproject: {
					value: '',
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
				clevel: {
					value: '',
				},
				options2: '',
				cplace: {
					value: '',
				},
				input: '',
				inputid: ''
			}
		},
		mounted() {
			this.getTableList();
			this.getplaceList();
			this.getClassList();
		}
	};
</script>

<style>
</style>
