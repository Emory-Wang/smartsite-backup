<template>
	<el-main>
		<div>
			<el-son-header style="text-align: left; font-size: 20px">
				<span>标准属性管理</span>
			</el-son-header>

			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="设备:">
					<el-select @change="selectChange" v-model="formInline.standard" filterable placeholder="请选择">
						<el-option v-for="(item,index) in options" :key="index" :label="item.equip_name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="设备属性:">
					<el-select v-model="formInline.standard3" filterable placeholder="请选择">
						<el-option v-for="(item,index) in options3" :key="index" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="设备属性值:">
					<el-select v-model="formInline.standard1" filterable placeholder="请选择">
						<el-option v-for="(item,index) in options1" :key="index" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-button type="primary" @click="input">输入数值</el-button>

				<el-divider></el-divider>

				<el-form-item label="考核标准:">
					<el-select v-model="formInline.standard2" filterable placeholder="请选择">
						<el-option v-for="(item,index) in options2" :key="index" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否关联设备:">
					<!-- <el-select v-model="formInline.standard4" filterable placeholder="请选择">
						<el-option v-for="(item,index) in options4" :key="index" :label="item.name" :value="item.id">
						</el-option>
					</el-select> -->
					<div>{{formInline.standard4}}</div>
				</el-form-item>
			</el-form>

			<el-divider></el-divider>

			<el-button type="primary" @click="enter" class="el-icon-finished">信息确认</el-button>

			<el-divider></el-divider>

			<el-table :data="tableData">
				<el-table-column prop="id" label="编号">
				</el-table-column>
				<el-table-column prop="equ" label="设备">
				</el-table-column>
				<el-table-column prop="pro" label="设备属性">
				</el-table-column>
				<el-table-column prop="type" label="设备属性类型">
					<template slot-scope="scope">
						<el-tag type="success" effect="dark" v-if="scope.row.type==true">范围值</el-tag>
						<el-tag type="success" effect="dark" v-if="scope.row.type==false">固定值</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="nvalue" label="设备属性值">
				</el-table-column>
				<el-table-column prop="state" label="考核标准">
					<template slot-scope="scope">
						<el-tag type="success" effect="dark" v-if="scope.row.state==false">可选</el-tag>
					</template>
				</el-table-column>
			</el-table>
			<el-button type="primary" @click="switchpage" class="el-icon-finished">完成</el-button>

			<el-dialog title="属性数值设定" :visible.sync="dialogFormVisible1" width="30%">
				<el-input placeholder="请输入数值" style="width:400px" v-model.number="temvalue1">
				</el-input>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="func1">确 定</el-button>
					<el-button @click="dialogFormVisible1 = false">取 消</el-button>
				</div>
			</el-dialog>

			<el-dialog title="属性数值设定" :visible.sync="dialogFormVisible2" width="30%">
				<el-input placeholder="请输入数值1" style="width:400px" v-model.number="temvalue1">
				</el-input>
				<br />
				<br />
				<el-input placeholder="请输入数值2" style="width:400px" v-model.number="temvalue2">
				</el-input>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="func2">确 定</el-button>
					<el-button @click="dialogFormVisible2 = false">取 消</el-button>
				</div>
			</el-dialog>
		</div>
	</el-main>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				formInline: {
					standard: '',
					standard1: '',
					standard2: '',
					standard3: '',
					standard4: '',
				},
				options: '',
				options1: [{
					id: false,
					name: '固定值'
				}, {
					id: true,
					name: '范围值'
				}],
				options2: [{
					id: false,
					name: '可选项'
				}, {
					id: true,
					name: '必选项'
				}],
				options3: '',
				item_id: '',
				standard_id: '',
				equip_id: '',
				value1: '',
				value2: '',
				temvalue1: '',
				temvalue2: '',
				dialogFormVisible1: false,
				dialogFormVisible2: false,
			}
		},
		methods: {
			enter() {
				//后台接口	输入完5/6个属性向standard_item表新增数据并刷新表格
				this.$axios.put('http://localhost:8181/StandardItem/editEquip', {
					"standard_id": this.standard_id,
					"item_id": this.item_id,
					/* "equ": this.formInline.standard,
					   "pro": this.formInline.standard3, */ //问题:standard_item表中没有字段记录value属于哪一条属性
					"property_type": this.formInline.standard1,
					"value_1": this.value1,
					"value_2": this.value2,
					"required": this.formInline.standard2,
					"property_related": this.formInline.standard4
				}).then((response) => {
					console.log(response);
					if (response.status != 200) {
						this.$message.error("调整失败!");
					} else {
						this.$message({
							type: 'success',
							message: '调整成功'
						});
						this.getTableList(); //重新加载表格
					}
				});

			},
			//监听设备下拉框的变化
			selectChange() {
				this.equip_id = this.formInline.standard
				this.$axios.get('http://localhost:8181/Property/findAll', {
					params: {
						equip_id: this.equip_id
					}
				}).then((response) => {
					this.options3 = response.data;
					console.log(response);
				})
			},
			switchpage() {
				this.$router.push({
					path: './nstandardIII',
					query: {
						standard_id: this.standard_id
					},
				})
			},
			func1() {
				this.value1 = this.temvalue1
				this.value2 = ''
				this.temvalue1 = ''
				this.dialogFormVisible1 = false
			},
			func2() {
				this.value1 = this.temvalue1
				this.value2 = this.temvalue2
				this.temvalue1 = ''
				this.temvalue2 = ''
				this.dialogFormVisible2 = false
			},
			//输入属性值
			input() {
				if (this.formInline.standard1 === false) {
					this.dialogFormVisible1 = true
				}
				if (this.formInline.standard1 === true) {
					this.dialogFormVisible2 = true
				}
			},
			getTableList() {
				var that = this
				that.$axios.get('http://localhost:8181/FirstLevel/findItemEquip', {
					params: {
						item_id: that.item_id,
						standard_id: that.standard_id
					}
				}).then((response) => {
					this.standardlist = response.data;
					this.tableData = this.standardlist;
				})
			},
			getequList() {

				this.$axios.get('http://localhost:8181/Equipment/findByItem', {
					params: {
						item_id: this.item_id
					}
				}).then((response) => {
					this.options = response.data;
					console.log(this.options)
					if (this.options.length === 0)
						this.formInline.standard4 = false
					else
						this.formInline.standard4 = true
					console.log(response);
				})
			},

		},
		created() {
			this.item_id = this.$route.query.item_id
			this.standard_id = this.$route.query.standard_id
			this.getTableList();
			this.getequList();
		}
	}
</script>

<style>
</style>
