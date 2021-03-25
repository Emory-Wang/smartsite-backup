<template>
	<el-main>
		<div>
			<el-son-header style="text-align: left; font-size: 20px">
				<span>添加标准项</span>
			</el-son-header>

			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="一级分类:">
					<el-select v-model="formInline.standard1" filterable placeholder="请选择">
						<el-option v-for="(item,index) in options1" :key="index" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-button @click="search" type="primary">查询</el-button>
			</el-form>

			<el-table :data="vstableData">
				<el-table-column prop="id" label="一级编号">
				</el-table-column>
				<el-table-column prop="idII" label="二级编号">
				</el-table-column>
				<el-table-column prop="item_id" label="标准项编号">
				</el-table-column>
				<el-table-column prop="detail" label="标准项">
				</el-table-column>
				<el-table-column prop="equ" label="关联设备">
					<template slot-scope="scope">
						<el-tag type="success" effect="dark" v-if="scope.row.property_related==true">{{scope.row.equ}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="250px">
					<template slot-scope="scope">
						<el-button @click="onEdit(scope.row.item_id)" type="primary" size="small">添加</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-button class="el-icon-finished" @click="switchpage" type="primary">添加完成</el-button>
		</div>
	</el-main>
</template>

<script>
	export default {
		methods: {
			search() {
				var temptable = []
				for (var item of this.standardlist) {
					if ((this.formInline.standard1 === item.id)) {
						temptable.push(item)
					}
				}
				this.vstableData = temptable
			},
			switchpage() {
					this.$router.push({
						path: './nstandardIII',
						query: {
							standard_id: this.standard_id
						},
					})
			},
			onEdit(item_id) {
				var that = this
				that.$router.push({
					path: './addsecond',
					query: {
						item_id: item_id,
						standard_id: that.standard_id
					},
				})
			},
			getTableList() {
				this.standard_id = this.$route.query.standard_id
				this.$axios.get('http://localhost:8181/FirstLevel/findItems').then((response) => {
					this.standardlist = response.data;
					this.vstableData = this.standardlist;
					console.log(response);
				})
			},
			getidList() {
				this.$axios.get('http://localhost:8181/FirstLevel/findFirstLevel').then((response) => {
					this.options1 = response.data;
					console.log(response);
				})
			},
		},
		data() {
			return {
				formInline: {
					standard1: '',
				},
				options1: '',
				vstableData: [],
				standardlist: [],
				standard_id: '',
			}
		},
		created() {
			this.getTableList();
			this.getidList();
		}
	}
</script>

<style>
</style>
