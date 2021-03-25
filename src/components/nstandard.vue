<template>
	<el-main>
		<el-menu
		  :default-active="this.$route.path" 
		  router mode="horizontal"
		  class="el-menu-vertical-demo"
		  @open="handleOpen"
		  @close="handleClose"
		  background-color="#ffffff"
		  text-color="#000000">
		  <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
		    <template slot="title">
		      <!-- <span style="margin-top: 12px;" @click="next">{{item.navItem}}</span> -->
			  <span style="margin-top: 12px;">{{item.navItem}}</span>
		    </template>
		  </el-menu-item>
		  </el-menu>
		  <el-divider></el-divider>
		  <router-view class="menu-right"/>
			</el-main>
</template>

<script>
  export default {
    data() {
      return {
		  //跳转新建标准页面
		  navList:[
		  {name:'/components/nstandardI',navItem:'步骤1：选择工程分类'},
		  {name:'/components/nstandardII',navItem:'步骤2：添加标准分类'},
		  {name:'/components/nstandardIII',navItem:'步骤3：添加标准项'},
		  ],
		  //
		  input:'',
		  formInline: {
		  	equip: ''
		  },
        active: 0
      };
    },

    methods: {
		//跳转新建标准页面
		handleOpen(key, keyPath) {
		  console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
		  console.log(key, keyPath);
		},
		//
      next() {
        if (this.active++ > 2) this.active = 0;
      }
    }
  }
</script>

<style>
	.menu-right{
	    margin-left:200px;
	}
</style>
