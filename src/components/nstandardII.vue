<template>
	<el-main>
		<div>
			<el-form :inline="true" :model="fromInline" class="demo-form-inline">
				<el-form-item label="添加标准分类">
					<el-select v-model="fromInline.cvalue" placeholder="请选择">
						<el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click="switchpage">确定</el-button>
			</el-form>
		</div>
	</el-main>
</template>

<script>
	export default {
		data() {
			return {
				temlist: [],
				options: '',
				fromInline: {
					cvalue: '',
				},
				standard_id:''
			}
		},
		methods: {

			getTableList() {
				this.standard_id = this.$route.query.standard_id
				this.$axios.get('http://localhost:8181/Template/findAll').then((response) => {
					this.temlist = response.data;
					this.options = this.temlist;
					console.log(response);
				})
			},

			switchpage() {
				this.$router.push({
				    path:'./template',
				    query:{
				      template_id:this.fromInline.cvalue,
					  standard_id:this.standard_id},
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
