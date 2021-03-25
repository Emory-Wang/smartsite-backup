<template>
	<div id="app">
		<el-container style="border: 1px solid #eee">
			<el-header style="text-align: left; font-size: 20px">
				<span>智慧工地后台管理系统</span>
			</el-header>

			<el-container>
				<el-aside width="200px" style="background-color: rgb(238, 241, 246)">
					<el-menu @select="handleSelect">
						<el-menu-item index="1">
							<span slot="title">标准管理</span>
						</el-menu-item>
						<el-menu-item index="2">
							<span slot="title">设备模型管理</span>
						</el-menu-item>
						<el-menu-item index="3">
							<span slot="title">标准库管理</span>
						</el-menu-item>
						<el-menu-item index="4">
							<span slot="title">标准分类管理</span>
						</el-menu-item>
						<el-menu-item index="5">
							<span slot="title">系统管理</span>
						</el-menu-item>
					</el-menu>
				</el-aside>
				<router-view v-if="isRouterAlive" />
			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		name: 'App',
		provide(){
		  return{
		    reload:this.reload
		  }
		},
		data() {
			return{
			  isRouterAlive:true
			}
		},
		methods: {
			reload() {
				this.isRouterAlive = false
				this.$nextTick(function() {
					this.isRouterAlive = true
				})
			},
			handleSelect(key, keyPath) {
				console.log(key);
				switch (key) {
					case '1':
						this.$router.push({
							name: 'standardm'
						});
						break;
					case '2':
						this.$router.push({
							name: 'Equipment'
						});
						break;
					case '3':
						this.$router.push({
							name: 'Standards'
						});
						break;
					case '4':
						this.$router.push({
							name: 'StandardClass'
						});
						break;
					case '5':
						this.$router.push({
							name: 'System'
						});
						break;
				}
			},
		}
	}
</script>

<style>
	.el-header {
		background-color: #409EFF;
		color: #ffffff;
		line-height: 60px;
	}

	.el-aside {
		color: #333;
	}
</style>
