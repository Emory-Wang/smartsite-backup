<template>
	<el-main>
		<div>
			<el-button type="primary" class="el-icon-upload2">上传附件</el-button>

			<el-table :data="tableData">
				<el-table-column prop="id" label="编号" width="100px">
				</el-table-column>
				<el-table-column prop="project" label="工程类型">
				</el-table-column>
				<el-table-column prop="level" label="标准级别">
				</el-table-column>
				<el-table-column prop="name" label="标准名称">
				</el-table-column>
			</el-table>

			<el-divider></el-divider>

			<el-table :data="sumData" style="width: 100%;margin-bottom: 20px;" row-key="id" border default-expand-all
			 :tree-props="{children: 'children'}">
				<el-table-column prop="id" label="编号" sortable width="180">
				</el-table-column>
				<el-table-column prop="name" label="名称" sortable width="180">
				</el-table-column>
				<el-table-column prop="detail" label="标准详情" sortable>
				</el-table-column>
				<el-table-column prop="state" label="状态" sortable width="120">
					<template slot-scope="scope">
						<el-tag type="success" effect="dark" v-if="scope.row.state!= null&&scope.row.state==false">可选</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="equstate" label="设备状态" sortable width="120">
					<template slot-scope="scope">
						<el-tag type="success" effect="dark" v-if="scope.row.equstate==true">设备绑定</el-tag>
					</template>
				</el-table-column>
			</el-table>

			<el-divider></el-divider>

			<el-table :data="equData">
				<el-table-column prop="id" label="编号" width="100px">
				</el-table-column>
				<el-table-column prop="type" label="设备类型">
				</el-table-column>
				<el-table-column prop="model" label="设备型号">
				</el-table-column>
			</el-table>
		</div>
	</el-main>
</template>

<script>
	export default {
		data() {
			return {
				standard_id: '',
				template_id: '',
				tableData: [],
				sumData: [],
				equData: [],
			}
		},

		methods: {
			getTableList() {
				var that = this
				that.$axios.get('http://localhost:8181/Standard/findStandardById', {
					params: {
						standard_id: that.standard_id
					}
				}).then((response) => {
					this.tableData = response.data;
				})
				that.$axios.get('http://localhost:8181/FirstLevel/findThreeByStandardId', {
					params: {
						standard_id: that.standard_id
					}
				}).then((response) => {
					that.sumData = response.data;
				})
				that.$axios.get('http://localhost:8181/FirstLevel/findEquipInfo', {
					params: {
						standard_id: that.standard_id
					}
				}).then((response) => {
					this.equData = response.data;
				})
				/* this.$axios.get('http://localhost:8080/nexa.json').then((response) => {
				this.tableData=response.data;
				console.log(response);
				  }),
				  this.$axios.get('http://localhost:8080/sum.json').then((response) => {
				  this.sumData=response.data;
				  console.log(response);
				    }),
						this.$axios.get('http://localhost:8080/equ.json').then((response) => {
						this.equData=response.data;
						console.log(response);
						  }) */
			},
		},

		created() {
			this.standard_id = this.$route.query.standard_id
			this.template_id = this.$route.query.template_id
			this.getTableList();
		}
	}
</script>

<style>
</style>
