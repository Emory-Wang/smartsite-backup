<template>
	<el-main>
		<el-container>
			<el-row>
				<el-button type="info" plain @click="onClear">全部工程</el-button>
				<el-button type="info" plain @click="chooserailway">铁路工程</el-button>
				<el-button type="info" plain @click="choosehighway">公路工程</el-button>
				<el-button type="info" plain @click="choosehouse">房屋工程</el-button>
				<el-button type="info" plain @click="choosema">市政工程</el-button>
				<el-button type="info" plain @click="choosewcah">水利水电工程</el-button>
				<el-button type="info" plain @click="chooseurt">城市轨道交通工程</el-button>
			</el-row>
		</el-container>

		<el-divider></el-divider>

		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="标准级别">
				<el-select v-model="formInline.standard" filterable placeholder="请选择">
					<el-option v-for="(item,index) in options" :key="index" :label="item.level" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="省市:">
				<el-select v-model="formInline.standard1" filterable placeholder="请选择">
					<el-option v-for="(item,index) in options1" :key="index" :label="item.place" :value="item.place">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="onSubmit">查询</el-button>
				<el-button @click="onClear">重置</el-button>
			</el-form-item>
		</el-form>

		<!--跳转至新建标准页面-->
		<el-container>
			<el-button type="primary" @click="switchpage" class="el-icon-plus">新建</el-button>
		</el-container>
		<!---->

		<el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
			<el-table-column prop="id" label="编号">
			</el-table-column>
			<el-table-column prop="project" label="所属工程">
			</el-table-column>
			<el-table-column prop="level" label="标准级别">
			</el-table-column>
			<el-table-column prop="name" label="标准名称">
			</el-table-column>
			<el-table-column prop="place" label="所属地区">
			</el-table-column>
			<el-table-column prop="time" label="创建时间">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="250px">
				<template slot-scope="scope">
					<el-button @click="onDetail(scope.row.id)" type="primary" size="small">详情</el-button>
					<el-button @click="onEdit(scope.row.id)" type="success" size="small">编辑</el-button>
					<el-button @click="onDelete(scope.row.id)" type="danger" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
			 :page-sizes="[3, 6, 9, 12]" :page-size="6" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
			</el-pagination>
		</div>
	</el-main>
</template>

<style>
	.menu-right {
		margin-left: 200px;
	}
</style>

<script>
	export default {
		methods: {
			//跳转页面
			switchpage() {
				this.$router.push({
					name: 'nstandard',
				})
			},
			//编辑
			onEdit(_standard_id) {
				const _this = this
				this.$prompt('请输入标准名称', '修改标准名称', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					//后台接口
					this.$axios.post('http://localhost:8181//Standard/edit', {
						id: _standard_id,
						name: value,
					}).then((response) => {
						if (response.status != 200) {
							_this.$message.error("修改失败!");
						} else {
							_this.$message({
								type: 'success',
								message: '修改标准名称：' + "id:" + _standard_id + "value:" + value
							});
							_this.getTableList(); //重新加载表格
						}
					});

				});

			},
			//删除
			onDelete(_standard_id) {
				const _this = this
				this.$confirm('是否删除标准', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//后台接口
					this.$axios.get('http://localhost:8181/Standard/delete', {
						params: {
							id: _standard_id
						}
					}).then((response) => {
						console.log(response);
						if (response.status != 200) {
							_this.$message.error("删除失败!");
						} else {
							_this.$message({
								type: 'success',
								message: '删除成功' + _standard_id
							});
							_this.getTableList(); //重新加载表格
						}
					});
				});

			},
			//详情
			onDetail(standard_id) {
				this.$router.push({
					path: './standardd',
					query: {
						standard_id: standard_id
					},
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
			//工程切换
			chooserailway() {
				var temptable = []
				for (var item of this.standardlist) {
					if ('铁路工程' === item.project) {

						temptable.push(item)
					}
				}
				this.tableData = temptable
			},
			choosehighway() {
				var temptable = []
				for (var item of this.standardlist) {
					if ('公路工程' === item.project) {
						temptable.push(item)
					}
				}
				this.tableData = temptable
			},
			choosehouse() {
				var temptable = []
				for (var item of this.standardlist) {
					if ('房屋工程' === item.project) {
						temptable.push(item)
					}
				}
				this.tableData = temptable
			},
			choosema() {
				var temptable = []
				for (var item of this.standardlist) {
					if ('市政工程' === item.project) {
						temptable.push(item)
					}
				}
				this.tableData = temptable
			},
			choosewcah() {
				var temptable = []
				for (var item of this.standardlist) {
					if ('水利水电工程' === item.project) {
						temptable.push(item)
					}
				}
				this.tableData = temptable
			},
			chooseurt() {
				var temptable = []
				for (var item of this.standardlist) {
					if ('城市轨道交通工程' === item.project) {
						temptable.push(item)
					}
				}
				this.tableData = temptable
			},
			//查询响应
			onSubmit() {
				var temptable = []
				for (var item of this.standardlist) {
					if (this.formInline.standard === "地方标准") {
						if ((this.formInline.standard === item.level) && (this.formInline.standard1 === item.place)) {
							temptable.push(item)
						}
					} else {
						if ((this.formInline.standard === item.level) || (this.formInline.standard1 === item.place)) {
							temptable.push(item)
						}
					}
				}
				this.tableData = temptable
			},
			//重置查询
			onClear() {
				this.formInline.standard = '';
				this.formInline.standard1 = '';
				this.tableData = this.standardlist;
			},
			//用axios的方法引入地址
			getTableList() {
				this.$axios.get('http://localhost:8181/Standard/findAllStandardForm').then((response) => {
					this.standardlist = response.data;
					this.tableData = this.standardlist;
					console.log(response);
				})
			},
			getplaceList() {
				this.$axios.get('http://localhost:8181//City/findAll').then((response) => {
					//用axios的方法引入地址
					this.options1 = response.data;
					console.log(response);
				})
			},
			getClassList() {
				this.$axios.get('http://localhost:8181//StandardClass/findAll').then((response) => {
					this.options = response.data;
					console.log(response);
				})
			}
		},
		data() {
			return {
				pageSize: 6, //每页条数,  默认6条
				totalRecords: 0, //总条数
				currentPage: 1,
				tableData: [],
				standardlist: [],
				formInline: {
					standard: '',
					standard1: '',
				},
				options1: "", //选项列表
				//选择器
				options: [{
					id: '地方标准',
					level: '地方标准'
				}, {
					id: '企业标准',
					level: '企业标准'
				}, {
					id: '行业标准',
					level: '行业标准'
				}],
			}
		},
		mounted() {
			this.getTableList();
			this.getplaceList();
		}
	};
</script>
