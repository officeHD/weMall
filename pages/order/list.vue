<template>
	<view class="content">
		<view class="nav">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="index" :range="array">
							<view class="uni-input">
								{{array[index]||"账单类型"}}
								<image class="arrow" src="../../static/down.png"></image>
							</view>
						</picker>
					</view>
					<view class="uni-list-cell-db">
						<picker mode="date" fields="month" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{date||"选择时间"}}
								<image class="arrow" src="../../static/down.png"></image>
							</view>
						</picker>
					</view>
				</view>
			</view>

		</view>
		<empty v-if="  listArr.length === 0"></empty>
		<view v-for="(item,index) in listArr" :key="index">
			<view class="listT">
				<text class="listl">{{item.label}}</text>
				<view class="listR">
					<text>支出</text>
					<text class="money">{{item.value.total_money}}</text>
				</view>
			</view>
			<view class="listC" v-for="(item2,index2) in item.value.list" :key="index2">
				<!-- <view class="listCl">
					<text class="listDay"></text>
					<text class="listTime">{{item2.create_time.split(' ')[1]}}</text>
				</view> -->
				<view class="listCR">
					<view class="cleft">
						<text class="cTitle">{{item2.content}}</text>
						<text class="cType">{{item2.create_time}}</text>
					</view>
					<text class="cright">{{item2.money}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import empty from '@/components/empty';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {

			empty
		},
		data() {

			return {

				title: 'picker',
				array: ['村贝', '现金'],
				typeArr: ['1', '2'],
				index: "",
				date: "",
				time: '',
				listArr: '',
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']),
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onShow() {
			this.loadData();

		},

		methods: {
			loadData: async function() {
				const res = await this.$req.ajax({
					path: 'zdapp/users/get_order_co_list',
					title: '正在加载',
					data: {
						users_id: this.userInfo.id,
						money_type: this.typeArr[this.index] || "",
						time: this.date
					}
				});
				if (res.data.code == 200) {
					console.log();
					let orderList = res.data.data.list;
					let listArr = [];
					for (var index in orderList) {
						listArr[listArr.length] = {
							value: orderList[index],
							label: index
						}

					}
					this.listArr = listArr
					console.log(listArr)
				}
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value;
				this.loadData()

			},
			bindDateChange: function(e) {
				this.date = e.target.value
				this.loadData()
			},

			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}`;
			}
		}
	}
</script>

<style lang="scss">
	page,
	.content {
		background: #f5f5f5;
		height: 100%;
	}

	.nav {
		display: flex;
		height: 88upx;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 10;
	}

	.uni-list {
		background-color: #fff;
		z-index: 999;
	}

	.uni-list-cell {
		display: flex;
		font-size: 28upx;
		height: 88upx;
		align-items: center;
		border-bottom: 1upx solid rgba(230, 230, 230, 1);
		background-color: #fff;

		.uni-list-cell-db {
			padding: 0 32upx;

			.uni-input {
				display: flex;
				align-items: center;
				min-width: 150upx;
				justify-content: space-between;
				color: #666;
			}

			.arrow {
				width: 20upx;
				height: 12upx;
				margin-left: 10upx;
			}
		}
	}

	.listT {
		height: 90upx;
		display: flex;
		justify-content: space-between;
		padding: 0 30upx;
		align-items: center;

		.listl {
			font-size: 28upx;
			color: #666;
		}

		.listR {
			font-size: 24upx;
			color: #999;

			.money {
				color: #333;
			}
		}
	}

	.listC {
		display: flex;
		justify-content: space-between;
		padding: 0;
		padding-left: 30upx;
		height: 138upx;
		align-items: center;
		background: #fff;

		.listCl {
			width: 118upx;
			display: flex;
			flex-direction: column;

			.listDay {
				font-size: 28upx;
				color: #333;
			}

			.listTime {
				font-size: 24upx;
				color: #999999;
			}
		}

		&:last-child {
			.listCR {
				border-bottom: none;
			}
		}

		.listCR {
			flex: 1;
			height: 100%;
			display: flex;
			padding-right: 30upx;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1upx solid rgba(230, 230, 230, 1);

			.cleft {
				display: flex;
				flex-direction: column;
				height: 100%;
				justify-content: center;
			}

			.cTitle {
				color: #1E1E1E;
				font-size: 28upx;
				margin-bottom: 10upx;
			}

			.cType {
				color: #666666;
				font-size: 24upx;
			}

			.cright {
				color: #1E1E1E;
				font-size: 34upx;
			}
		}
	}
</style>
