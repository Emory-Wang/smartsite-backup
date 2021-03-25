<template>
	<el-main>
		<div>
			<el-container>
				<el-table :data="tableData" row-key="id" default-expand-all :tree-props="{children: 'children'}">
					<el-table-column prop="id" label="编号" sortable width="180">
					</el-table-column>
					<el-table-column prop="name" label="名称" sortable width="280">
					</el-table-column>
					<el-table-column fixed="right" label="操作">
					  <template slot-scope="scope">
					    <el-button @click="toEquip(scope.row.id)" type="success" size="small" v-if="scope.row.children==null">调整</el-button>
					  </template>
					</el-table-column>
				</el-table>
			</el-container>
			<el-button type="primary" @click="switchpage" class="el-icon-plus">添加</el-button>

			<el-divider></el-divider>

			<el-container>
				<el-button type="primary" @click="switchpage3" class="el-icon-finished">提交</el-button>
			</el-container>
		</div>
	</el-main>
</template>

<script>
	export default {
		data() {
			return {
				template_id: '',
				standard_id: '',
				tableData: [],
			}
		},
		methods: {
			switchpage() {
				this.$router.push({
					path: './add',
					query: {
						standard_id: this.standard_id
					},
				})
			},
			switchpage1() {
				this.$router.push({
					name: 'addem',
				})
			},
			switchpage2() {
				this.$router.push({
					name: 'addpqa',
				})
			},
			switchpage3() {
				this.$router.push({
					path: './upstandardd',
					query: {
						template_id: this.template_id,
						standard_id: this.standard_id
					},
				})
			},
			toEquip(item_id){
				var that = this
				that.$router.push({
					path: './addequip',
					query: {
						item_id: item_id,
						standard_id: that.standard_id
					},
				})
			},
			getTableList() {
				var that = this
				that.template_id = this.$route.query.template_id
				that.standard_id = this.$route.query.standard_id
				that.$axios.get('http://localhost:8181/FirstLevel/findThreeByStandard', {
					params: {
						standard_id: that.standard_id
					}
				}).then((response) => {
					that.standardlist = response.data;
					that.tableData = that.standardlist;
					console.log(response);
				})
			}
		},
		created() {
			this.getTableList();
		}
	}
</script>

<style>
</style>
