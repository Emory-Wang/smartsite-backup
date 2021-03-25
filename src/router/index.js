import Vue from 'vue'
import Router from 'vue-router'
import standardm from '@/components/standardm'
import nstandard from '@/components/nstandard'
import nstandardI from '@/components/nstandardI'
import nstandardII from '@/components/nstandardII'
import nstandardIII from '@/components/nstandardIII'
import standardd from '@/components/standardd'
import upstandardd from '@/components/upstandardd'
import template from '@/components/template'
import add from '@/components/add'
import addsecond from '@/components/addsecond'
import addequip from '@/components/addequip'
//
import Equipment from '../views/equip/Equipment.vue'
import Property from '../views/equip/Property.vue'
import Standards from '../views/stan/Standards.vue'
import NewStandards from '../views/stan/NewStandards.vue'
import EditStandards from '../views/stan/EditStandards.vue'
import StandardClass from '../views/class/StandardClass.vue'
import ClassTemplate from '../views/class/ClassTemplate.vue'
import System from '../views/System.vue'

Vue.use(Router)

export default new Router({
  routes: [
	  {
		  path: '/components/standardm',
		  name: 'standardm',
		  component: standardm,
		  },
		  {
			  path: '/components/standardd',
			  name: 'standardd',
			  component: standardd,
			  },
			  {
				  path: '/components/upstandardd',
				  name: 'upstandardd',
				  component: upstandardd,
				  },
				  {
				  	path: '/components/template',
				  	name: 'template',
				  	component:template,
				  },
				  {
				  	path: '/components/add',
				  	name: 'add',
				  	component:add,
				  },
				  {
				  	path: '/components/addsecond',
				  	name: 'addsecond',
				  	component:addsecond,
				  },
				  {
				  	path: '/components/addequip',
				  	name: 'addequip',
				  	component:addequip,
				  },
			
	{
	  path: '/components/nstandard',
	  name: 'nstandard',
	  component:nstandard,
	  children:[
		  {
		    path: '/components/nstandardI',
		    name: 'nstandardI',
		    component:nstandardI,
		  },
		  {
		    path: '/components/nstandardII',
		    name: 'nstandardII',
		    component:nstandardII,
		  },
		  {
		    path: '/components/nstandardIII',
		    name: 'nstandardIII',
		    component:nstandardIII,
		  }
	  ]
	},
	//设备模型跳转路由配置
	{
	  path: '/equipment',
	  name: 'Equipment',
	  component: Equipment
	},
	 //设备属性跳转路由配置
	 {
	   path: '/equipment/property',
	   name: 'Property',
	   component: Property
	 },
	//标准库跳转路由配置
	{
	  path: '/standards',
	  name: 'Standards',
	  component: Standards
	},
	//新建标准跳转路由配置
	{
	  path: '/standards/new',
	  name: 'NewStandards',
	  component: NewStandards
	},
	//编辑标准跳转路由配置
	{
	  path: '/standards/edit',
	  name: 'EditStandards',
	  component: EditStandards
	},
	//标准分类路由配置
	{
	  path: '/standardclass',
	  name: 'StandardClass',
	  component: StandardClass
	},
	{
	  path: '/template',
	  name: 'ClassTemplate',
	  component: ClassTemplate
	},
	{
	  path: '/template',
	  name: 'System',
	  component: System
	}]
})