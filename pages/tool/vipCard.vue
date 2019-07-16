<template>
	<view>
		<view class="tabr" :style="{top:headerTop}">
			<view :class="{on:typeClass=='valid'}" @tap="switchType('valid')">已有会员({{couponValidList.length}})</view>
			<view :class="{on:typeClass=='invalid'}" @tap="switchType('invalid')">待领取会员卡</view>
			<view class="border" :class="typeClass"></view>
		</view>
		<view class="place"></view>
		<view class="list">
			<!-- 优惠券列表 -->

			<scroll-view class="sub-list valid" :class="subState" scroll-y @scrolltolower="loadValid()">
				<empty v-if="couponValidList.length === 0"></empty>
				<view class="row" v-for="(row,index) in couponValidList" :key="index">
					<!-- content -->
					<view class="carrier" :class="[typeClass=='valid'?theIndex==index?'open':oldIndex==index?'close':'':'']">
						<view class="content">
							<text class="exit" @tap="delVipCard(row.id)">退出会员</text>
							<view class="vipname">
								VIP
							</view>
							<view class="descript">会员专享
								<view class="beforeline"></view>
								<view class="afterline"></view>
							</view>
							<view class="info">
								<image class="img" :src="row.co_logo" mode="aspectFill"></image>
								<text class="nickname_web">{{row.co_name}}</text>
								<text class="level">{{row.level_name}}</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

			<scroll-view class="sub-list invalid" :class="subState" scroll-y @scrolltolower="loadInvalid()">
				<empty v-if="couponinvalidList.length === 0"></empty>
				<view class="row" v-for="(row,index) in couponinvalidList" :key="index">

					<!-- content -->
					<view class="carrier" :class="[typeClass=='valid'?theIndex==index?'open':oldIndex==index?'close':'':'']">
						<view class="content">
							<text class="exit" @tap="notinter(row.id,couponinvalidList)">不感兴趣</text>
							<view class="vipImg">
								<image class="img" :src="row.co_logo" mode="aspectFill"></image>
							</view>
							<text class="vipName">{{row.co_name}}</text>
							<text class="vipTips">会员有礼入会即享</text>


							<view class="lingqu" @tap="getVip(row.id,couponinvalidList)">
								立即领取
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
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
				couponValidList: [],
				couponinvalidList: [],
				headerTop: 0,
				//控制滑动效果
				typeClass: 'valid',
				subState: '',
				theIndex: null,
				oldIndex: null,
				validPage: 1,
				validMore: true,
				invalidMore: true,
				invalidPage: 1,
				isStop: false
			}
		},
		onPageScroll(e) {

		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad() {
			//兼容H5下排序栏位置
			// #ifdef H5
			//定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
			let Timer = setInterval(() => {
				let uniHead = document.getElementsByTagName('uni-page-head');
				if (uniHead.length > 0) {
					this.headerTop = uniHead[0].offsetHeight + 'px';
					clearInterval(Timer); //清除定时器
				}
			}, 1);
			// #endif
			this.loadData();
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			loadData() {
				this.validPage = 1;
				this.invalidPage = 1;
				this.loadInvalid();
				this.loadValid();
			},
			async loadValid() {
				if (!validMore && this.validPage > 1) {
					return
				}
				let res = await this.$req.ajax({
					path: 'zdapp/users/get_users_card_list',
					title: '正在加载',
					data: {
						users_id: this.userInfo.id,
						page: this.validPage,
						page_num: 10

					}
				});
				if (res.data.data.list.length == 10) {
					this.validPage++;
					this.validMore = true;
				} else {
					this.validMore = false;
				}
				if (res.statusCode == 200 && res.data.code == 200) {
					console.log(res.data.data.list)
					this.couponValidList = res.data.data.list;
					// console.log(res.data.data.list)
				}
			},
			async loadInvalid() {
				if (!invalidMore && this.invalidPage > 1) {
					return
				}
				let res2 = await this.$req.ajax({
					path: 'zdapp/users/get_users_push',
					title: '正在加载',
					data: {
						users_id: this.userInfo.id,
						page: this.invalidPage,
						page_num: 10


					}
				});
				if (res2.data.data.length == 10) {
					this.invalidMore = true;
					this.invalidPage++;
				} else {
					this.invalidMore = false;
				}
				if (res2.statusCode == 200 && res2.data.code == 200) {
					this.couponinvalidList = res2.data.data;

				}
			},
			switchType(type) {
				if (this.typeClass == type) {
					return;
				}
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.typeClass = type;
				this.subState = this.typeClass == '' ? '' : 'show' + type;
				setTimeout(() => {
					this.oldIndex = null;
					this.theIndex = null;
					this.subState = this.typeClass == 'valid' ? '' : this.subState;
				}, 200)
			},
			async delVipCard(id) {

				let res = await this.$req.ajax({
					path: 'zdapp/users/del_users_type',
					title: '删除',
					data: {
						users_id: this.userInfo.id,
						id: id
					}
				});
				if (res.data.code == 200) {
					this.loadData()
				}



			},
			//领取会员卡
			async getVip(id) {
				let that = this;
				let res = await this.$req.ajax({
					path: 'zdapp/users/get_users_type',

					data: {
						users_id: this.userInfo.id,
						id: id

					}
				});
				if (res.data.code == 200) {
					this.loadData()
				}
			},
			//忽略会员卡
			async notinter(id, List) {
				let that = this;
				let res = await this.$req.ajax({
					path: 'zdapp/users/del_users_type_push',

					data: {
						users_id: this.userInfo.id,
						id: id

					}
				});

				if (res.data.code == 200) {
					this.loadData()
				}
			},

			//控制左滑删除效果-begin
			touchStart(index, event) {
				//多点触控不触发
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
			},
			touchMove(index, event) {
				//多点触控不触发
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];

				if (this.isStop || Math.abs(moveX) < 5) {
					return;
				}
				if (Math.abs(moveY) > Math.abs(moveX)) {
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}

				if (moveX < 0) {
					this.theIndex = index;
					this.isStop = true;
				} else if (moveX > 0) {
					if (this.theIndex != null && this.oldIndex == this.theIndex) {
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(() => {
							this.oldIndex = null;
						}, 150)
					}
				}
			},

			touchEnd(index, $event) {
				//解除禁止触发状态
				this.isStop = false;
			},



			discard() {
				//丢弃
			}


		}
	}
</script>
<style lang="scss">
	view {
		display: flex;
		flex-wrap: wrap;

	}

	page {
		position: relative;
		background-color: #f5f5f5;
	}

	@font-face {
		font-family: "HMfont-home";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}

	.icon {
		font-family: "HMfont-home" !important;
		font-size: 60upx;
		font-style: normal;
		color: #000000;

		&.jia {
			&:before {
				content: "\e641";
			}
		}

		&.jian {
			&:before {
				content: "\e643";
			}
		}

		&.shanchu {
			&:before {
				content: "\e6a4";
			}
		}

		&.shixiao {
			&:before {
				content: "\e669";
			}
		}

	}

	.hidden {
		display: none !important;
	}

	.place {
		width: 100%;
		height: 95upx;
	}

	.tabr {
		background-color: #fff;
		width: 100%;
		height: 95upx;
		padding: 0 3%;
		border-bottom: solid 1upx #dedede;
		position: fixed;
		top: 0;
		z-index: 10;

		view {
			width: 50%;
			height: 90upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			color: #999;
		}

		.on {
			color: #f06c7a;
		}

		.border {
			height: 4upx;
			background-color: #f06c7a;
			transition: all .3s ease-out;

			&.invalid {
				transform: translate3d(100%, 0, 0);
			}
		}

	}

	.list {
		width: 100%;
		display: block;
		position: relative;
		height: calc(100vh - 95upx);
	}

	@keyframes showValid {
		0% {
			transform: translateX(-100%);
		}

		100% {
			transform: translateX(0);
		}
	}

	@keyframes showInvalid {
		0% {
			transform: translateX(0);
		}

		100% {
			transform: translateX(-100%);
		}
	}

	.sub-list {
		&.invalid {
			position: absolute;
			top: 0;
			left: 100%;
			display: none;
			height: 100%;
		}

		&.showvalid {
			display: flex;
			animation: showValid 0.20s linear both;
		}

		&.showinvalid {
			display: flex;
			animation: showInvalid 0.20s linear both;
		}

		width: 100%;
		padding: 20upx 0 120upx 0;

		.tis {
			width: 100%;
			height: 60upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}

		.row {

			height: 329upx;
			background: radial-gradient(circle, #415184 30%, #11141F);
			border-radius: 12upx;
			width: 92%;
			margin: 20upx auto 10upx auto;
			// box-shadow: 0upx 0 10upx rgba(0,0,0,0.1);
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;

			.menu {
				.icon {
					color: #fff;
					font-size: 50upx;
				}

				position: absolute;
				width: 28%;
				height: 100%;
				right: 0;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}

			.carrier {
				width: 100%;
				height: 100%;

				.vipImg {
					justify-content: center;

					.img {
						width: 80upx;
						height: 80upx;
						border-radius: 50%;

						image {
							width: 80upx;
							height: 80upx;
						}
					}
				}

				.vipName {
					margin-top: 20upx;
					font-size: 30upx;
					color: #fff;
				}

				.vipTips {
					font-size: 24upx;
					color: #FFD082;
				}

				.lingqu {
					width: 220upx;
					height: 50upx;
					background: linear-gradient(rgba(230, 204, 147, 1) 0%, rgba(200, 157, 90, 1) 100%);
					border-radius: 25upx;

					margin: 25upx auto;
					text-align: center;
					font-size: 24upx;
					color: #171B2C;
					justify-content: center;
					align-items: center;
				}

				.content {
					display: flex;
					position: relative;
					flex-direction: column;
					width: 100%;
					height: 100%;
					text-align: center;
					padding-top: 50upx;

					.exit {
						position: absolute;
						right: 24upx;
						top: 24upx;
						font-size: 22upx;
					}

					.vipname {
						font-size: 80upx;
						color: #fff;
						font-family: PingFangSC-Semibold;
						text-align: center;
						justify-content: center;
					}

					.descript {
						justify-content: center;
						font-size: 24upx;
						position: relative;
						margin-top: 10upx;

						.beforeline,
						.afterline {

							position: absolute;
							width: 100upx;
							height: 1px;
							background-color: #D5D5D5;
							top: 50%;

						}

						.beforeline {
							left: 170upx;
						}

						.afterline {
							right: 170upx;
						}
					}

					.info {
						position: absolute;
						width: 100%;
						bottom: 20upx;
						left: 0;
						display: flex;
						align-items: center;
						padding: 10upx 20upx;

						.img {
							width: 50upx;
							height: 50upx;
							border-radius: 50%;
							overflow: hidden;
							margin-right: 30upx;

							image {
								width: 50upx;
								height: 50upx;
							}
						}

						.nickname_web {
							font-size: 28upx;
							color: #fff;
						}

						.level {
							font-size: 19upx;
							color: #fff;
							background: rgba(47, 58, 98, 1);
							border-radius: 40upx;
							padding: 5upx 30upx;
							margin-left: 20upx;
						}
					}
				}



				position: relative;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				flex-wrap: nowrap;
				color: #fff;

				.left {
					width: 100%;

					.title {
						padding-top: 3vw;
						width: 90%;
						margin: 0 5%;
						font-size: 36upx;
					}

					.term {
						width: 90%;
						margin: 0 5%;
						font-size: 26upx;
						color: #999;
					}

					position: relative;

					.gap-top,
					.gap-bottom {
						position: absolute;
						width: 20upx;
						height: 20upx;
						right: -10upx;
						border-radius: 100%;
						background-color: #f5f5f5;
					}

					.gap-top {
						top: -10upx;
					}

					.gap-bottom {
						bottom: -10upx;
					}

					.shixiao {
						position: absolute;
						right: 20upx;
						font-size: 150upx;
						z-index: 6;
						color: rgba(153, 153, 153, 0.2)
					}
				}

				.right {
					flex-shrink: 0;
					width: 28%;
					color: #fff;
					background: linear-gradient(to right, #ec625c, #ee827f);

					&.invalid {
						background: linear-gradient(to right, #aaa, #999);

						.use {
							color: #aaa;
						}
					}

					justify-content: center;

					.ticket,
					.criteria {
						width: 100%;
					}

					.ticket {
						padding-top: 1vw;
						justify-content: center;
						align-items: baseline;
						height: 6vw;

						.num {
							font-size: 42upx;
							font-weight: 600;
						}

						.unit {
							font-size: 24upx;
						}
					}

					.criteria {
						justify-content: center;

						font-size: 28upx;
					}

					.use {
						width: 50%;
						height: 40upx;
						justify-content: center;
						align-items: center;
						font-size: 24upx;
						background-color: #fff;
						color: #ee827f;
						border-radius: 40upx;
						padding: 0 10upx;
					}
				}
			}

			/*
			<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
				<view class="left">
					<view class="title">
						10元日常用品类
					</view>
					<view class="term">
						2019-04-01~2019-05-30
					</view>
				</view>
				<view class="right">
					<view class="ticket">
						<view class="num">
							10
						</view>
						<view class="unit">
							元
						</view>
					</view>
					<view class="criteria">
						满50使用
					</view>
					<view class="use">
						去使用
					</view>
				</view>
			</view>
			* 
			* */
		}
	}
</style>
