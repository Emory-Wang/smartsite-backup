<template>
	<el-main>
		<div>
			<el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id" border default-expand-all
			 :tree-props="{children: 'children'}">
				<el-table-column prop="id" label="编号" sortable width="180">
				</el-table-column>
				<el-table-column prop="name" label="名称" sortable width="280">
				</el-table-column>
			</el-table>
			<el-button type="primary" @click="switchpage">确定</el-button>
			<el-button type="primary" @click="switchpage1">返回</el-button>
		</div>
	</el-main>
</template>

<script>
	export default {
		methods: {
			switchpage() {
				var that = this
				//批量将模板里的内容新增到standard_item表中
				that.$axios.get('http://localhost:8181/StandardItem/insertMulti', {
					params: {
						standard_id: that.standard_id,
						template_id: that.template_id
					}
				}).then((response) => {
					that.$router.push({
				    path:'./nstandardIII',
				    query:{
				      template_id:that.template_id,
					  standard_id:that.standard_id},
				})
				})
				
				
			},
			switchpage1() {
				this.$router.push({
					name: 'nstandardII',
				})
			},

			getTableList() {
				var that = this
				that.template_id = this.$route.query.template_id
				that.standard_id = this.$route.query.standard_id
				that.$axios.get('http://localhost:8181/FirstLevel/findThree', {
					params: {
						template_id: that.template_id
					}
				}).then((response) => {
					that.tableData = response.data;
					console.log(that.tableData);
				})
			}
		},
		data() {
			return {
				tableData: [],
				template_id: '',
				standard_id:''
			}
		},
		created() {
			var _this = this
			_this.getTableList()

		},
		/* 		watch: {
				  // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
				  '$route': 'getTableList'
				}, */
	}
</script>

<style>
</style>
