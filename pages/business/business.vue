<template>
	<view>

		<view class="shopHead">
			<view class="headLeft">
				<view class="headImg">
					<image :src="businInfo.co_logo||defaultImg" mode="aspectFill" @error="errorImg"></image>
				</view>

				<view class="shopInfo">

					<text class="name">{{businInfo.co_name}}</text>
					<view class="shopCon">
						推荐：<text class="num">{{recommend}}</text>
						商品：<text class="num">{{goods_count}}</text>
					</view>
				</view>
			</view>
			<view v-if="businInfo.is_recommend==0" class="suggest" @click="suggest">推荐</view>
			<view v-if="businInfo.is_recommend==1" class="suggest" @click="suggest">取消推荐</view>


		</view>
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="title">全部商品</view>
			<view class="product-list">
				<view class="lefBox">
					<view class="product" v-for="(product, index) in productList" :key="index" @tap="toGoods(product)" v-if="index % 2 == 0">
						<image class="pimg" mode="aspectFill" :src="product.thumb || defaultImg" @error="imageError(index)"></image>
						<view class="name">{{ product.title }}</view>
						<view class="info">
							<view class="price">¥{{ product.price }}</view>
							<view class="slogan">{{ product.slogan }}</view>
						</view>
					</view>
				</view>
				<view class="lefBox">
					<view class="product" v-for="(product, index) in productList" :key="index" @tap="toGoods(product)" v-if="index % 2 == 1">
						<image class="pimg" mode="aspectFill" :src="product.thumb || defaultImg" @error="imageError(index)"></image>
						<view class="name">{{ product.title }}</view>
						<view class="info">
							<view class="price">¥{{ product.price }}</view>
							<view class="slogan">{{ product.slogan }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{ loadingText }}</view>
		</view>
	</view>
</template>

<script>
	//高德SDK
	//
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				goods_count: 0, //商品总量 
				recommend: 0,
				businInfo: {},
				shopId: "",
				page: 1,
				total: 0,

				defaultImg: '../../static/errorImage.jpg',
				// 分类菜单 
				//猜你喜欢列表
				productList: [{
					goods_id: 0,
					img: '',
					name: '',
					price: '￥168',
					slogan: '1235人付款'
				}],
				loadingText: '正在加载...'
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},

		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			// uni.showToast({
			// 	title: '触发上拉加载'
			// });
			let len = this.productList.length;

			if (len == this.total || len < 10 || 10 * this.page == this.total) {
				this.loadingText = '到底了';
				return false;
			}
			this.page++;
			this.getGoodList();
		},
		onLoad(options) {
			this.shopId = options.id;
			// #ifdef APP-PLUS
			this.statusHeight = plus.navigator.getStatusbarHeight();
			// #endif


			this.page = 1;
			this.loadData();
			this.getGoodList();

		},
		methods: {
			errorImg(res) {
				console.log(res)
				this.businInfo.co_logo = this.defaultImg;
			},
			suggest() {
				if (this.businInfo.is_recommend == 1) {
					this.del_recommend();
				} else {
					this.add_recommend();
				}

				// 
			},
			async del_recommend() {
				const res = await this.$req.ajax({
					path: 'zdapp/co_recommend/del_recommend',
					data: {
						users_id: this.userInfo.id,
						co_id: this.shopId,
						group_id: "2c918aee6a48c1df016a48cdc53a0002",
					}
				});
				if (res.data.code == 200) {
					this.$api.msg(res.data.message);
					this.businInfo.is_recommend = 0

				} else {
					this.$api.msg(res.data.message);
				}
			},
			async add_recommend() {
				const res = await this.$req.ajax({
					path: 'zdapp/co_recommend/add_recommend',
					data: {
						users_id: this.userInfo.id,
						co_id: this.shopId,
						group_id: "2c918aee6a48c1df016a48cdc53a0002",
					}
				});
				if (res.data.code == 200) {
					this.$api.msg(res.data.message);
					this.businInfo.is_recommend = 1
				} else {
					this.$api.msg(res.data.message);
				}
			},
			async loadData() {
				const res = await this.$req.ajax({
					path: 'zdapp/company_info/get_co_info',
					title: '正在加载',
					data: {
						co_id: this.shopId
					}
				});
				if (res.data.code == 200) {
					this.businInfo = res.data.data;

				}
				const goods_count = await this.$req.ajax({
					path: 'zdapp/goods/get_goods_count',
					title: '正在加载',
					data: {
						co_id: this.shopId
					}
				});
				if (goods_count.data.code == 200) {
					this.goods_count = goods_count.data.data.count;
				}
				const recommend_count = await this.$req.ajax({
					path: 'zdapp/co_recommend/get_recommend_count',
					title: '正在加载',
					data: {
						co_id: this.shopId
					}
				});
				if (recommend_count.data.code == 200) {

					this.recommend = recommend_count.data.data.count;
					console.log(this.recommend)
				}

			},
			async getGoodList() {
				const goodlist = await this.$req.ajax({
					path: 'zdapp/goods/get_goods_list',
					title: '正在加载',
					data: {
						group_id: '2c918aee6a48c1df016a48cdc53a0002',
						co_id: this.shopId,
						keywords: '',
						categoryid: '',
						page: this.page,
						page_num: '10'
					}
				});
				if (goodlist.data.code == 200) {
					this.total = goodlist.data.data.total;
					if (this.page > 1) {
						this.productList = this.productList.concat(goodlist.data.data.list);
					} else {
						this.productList = goodlist.data.data.list;
					}
				}
			},
			//搜索跳转
			toSearch() {
				// uni.showToast({
				// 	title: '建议跳转到新页面做搜索功能'
				// });
			},
			//轮播图跳转
			toSwiper(e) {
				uni.showToast({
					title: e.src,
					icon: 'none'
				});
			},
			//分类跳转
			toCategory(e) {
				//uni.showToast({title: e.name,icon:"none"});
				let url = '../goods/goods-list?cid=' + e.id + '&name=' + e.name;
				if (!this.hasLogin) {
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url: url
				});
			},
			//推荐商品跳转
			toPromotion(e) {
				uni.showToast({
					title: e.title,
					icon: 'none'
				});
			},
			//商品跳转
			toGoods(item) {

				let id = item.id;
				// uni.showToast({
				// 	title: '商品' + item.id,
				// 	icon: 'none'
				// });
				let url = `/pages/product/product?id=1&co_id=${item.co_id}`;
				if (!this.hasLogin) {
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url: url
				});
			},

			imageError(index) {
				this.productList[index].thumb = this.defaultImg;
			}
		}
	};
</script>
<style lang="scss">
	page {
		position: relative;
	}

	@font-face {
		font-family: 'HMfont-home';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}

	.shopHead {
		height: 170upx;
		display: flex;
		padding: 0 30upx;
		justify-content: space-between;
		align-items: center;

		.headLeft {
			height: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.headImg {
				width: 92upx;
				height: 92upx;
				border-radius: 50%;
				overflow: hidden;
				background-color: #f2f2f2;
				margin-right: 20upx;

				image {
					width: 92upx;
					height: 92upx;
				}
			}

			.shopInfo {
				font-size: 28upx;

				.name {
					font-size: 32upx;
					color: #1E1E1E;
				}

				.shopCon {
					margin-top: 10upx;
					color: #999999;
					font-size: 24upx;

					.num {
						color: #1E1E1E;
						margin-right: 30upx;
					}
				}
			}
		}

		.suggest {
			height: 64upx;
			border-radius: 8upx;
			background-color: #4B9FE0;
			text-align: center;
			line-height: 64upx;
			padding: 0 40upx;
			color: #fff;
			font-size: 30upx;
		}
	}

	.icon {
		font-family: 'HMfont-home' !important;
		font-size: 60upx;
		font-style: normal;
		color: #000000;

		&.yuyin {
			&:before {
				content: '\e64e';
			}
		}

		&.tongzhi {
			&:before {
				content: '\e729';
			}
		}

		&.search {
			&:before {
				content: '\e628';
			}
		}

		&.location {
			&:before {
				content: '\e611';
			}
		}

		&.xia {
			&:before {
				content: '\e689';
			}
		}
	}

	.pullDown-effects {
		position: fixed;
		//top: calc(100upx - 36vw);
		top: 0;
		z-index: 9;
		width: 100%;
		height: 36vw;
		/*  #ifdef  APP-PLUS  */
		padding-top: var(--status-bar-height);

		/*  #endif  */
		image {
			width: 100%;
			height: 36vw;
		}
	}

	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height); //覆盖样式
		/*  #endif  */
	}

	.header {
		width: 100%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;

		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */

		.addr {
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			font-size: 28upx;

			.icon {
				height: 60upx;
				margin-right: 5upx;
				display: flex;
				align-items: center;
				font-size: 42upx;
				color: #ffc50a;
			}
		}

		.input-box {
			width: 100%;
			height: 60upx;
			background-color: #f5f5f5;
			border-radius: 30upx;
			position: relative;
			display: flex;
			align-items: center;

			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				top: 0;
				right: 0;
				width: 60upx;
				height: 60upx;
				font-size: 34upx;
				color: #c0c0c0;
			}

			input {
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
			}
		}

		.icon-btn {
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;

			.icon {
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42upx;
			}
		}
	}

	.place {
		background-color: #ffffff;
		height: 100upx;
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
	}

	.swiper {
		width: 100%;
		margin-top: 10upx;
		display: flex;
		justify-content: center;
		height: 338upx;

		.swiper-box {
			width: 100%;
			height: 338upx;

			overflow: hidden;

			// box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;

			swiper {
				width: 100%;
				height: 338upx;

				swiper-item {
					image {
						width: 100%;
						height: 338upx;
					}
				}
			}

			.indicator {
				position: absolute;
				bottom: 20upx;
				left: 20upx;
				background-color: rgba(255, 255, 255, 0.4);
				width: 150upx;
				height: 5upx;
				border-radius: 3upx;
				overflow: hidden;
				display: flex;

				.dots {
					width: 100%;

					&.on {
						background-color: rgba(255, 255, 255, 1);
					}
				}
			}
		}
	}

	.category-list {
		width: 92%;
		margin: 0 4%;
		padding: 0 0 30upx 0;
		border-bottom: solid 2upx #f6f6f6;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.category {
			width: 20%;
			margin-top: 50upx;
			display: flex;
			flex-wrap: wrap;

			.img {
				width: 100%;
				display: flex;
				justify-content: center;

				image {
					width: 15vw;
					height: 15vw;
				}
			}

			.text {
				margin-top: -10upx;
				width: 100%;
				display: flex;
				justify-content: center;
				font-size: 24upx;
				color: #3c3c3c;
			}
		}
	}

	.banner {
		width: 92%;
		margin: 40upx 4%;

		image {
			width: 100%;
			height: 20vw;
			border-radius: 10vw;
			box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.3);
		}
	}

	.promotion {
		width: 100%;
		margin: 20upx 0;

		.text {
			width: 100%;
			height: 60upx;
			font-size: 34upx;
			font-weight: 600;
			margin-top: -10upx;
			padding-left: 30upx;
		}

		.list {
			width: 100%;
			display: flex;
			justify-content: space-between;
			padding: 0 20upx;

			.column {
				flex: 1;
				padding: 15upx 3%;
				background-color: #ebf9f9;
				border-radius: 10upx;
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				margin: 0 15upx;

				.top {
					width: 100%;
					height: 40upx;
					display: flex;
					align-items: center;
					margin-bottom: 5upx;

					.title {
						font-size: 30upx;
					}

					.countdown {
						margin-left: 20upx;
						display: flex;
						height: 40upx;
						display: flex;
						align-items: center;
						font-size: 20upx;

						view {
							height: 30upx;
							background-color: #f06c7a;
							display: flex;
							justify-content: center;
							align-items: center;
							color: #fff;
							border-radius: 4upx;
							margin: 0 4upx;
							padding: 0 2upx;
						}
					}
				}

				.left {
					display: flex;
					flex-wrap: wrap;
					align-content: space-between;

					.ad {
						margin-top: 5upx;
						width: 100%;
						font-size: 22upx;
						color: #acb0b0;
					}

					.into {
						width: 100%;
						font-size: 24upx;
						color: #aaa;
						margin-bottom: 5upx;
					}
				}

				.right {
					width: 100%;
					height: 18.86vw;
					text-align: center;

					image {
						width: 18.86vw;
						height: 18.86vw;
					}
				}
			}
		}
	}

	.goods-list {
		background-color: #f5f5f5;
		padding-top: 40upx;

		.title {
			width: 100%;
			height: 60upx;
			font-size: 34upx;
			font-weight: 600;
			margin-top: -10upx;
			padding-left: 30upx;
		}

		.loading-text {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}

		.product-list {
			width: 100%;
			padding: 0 4% 3vw 4%;
			display: flex;
			justify-content: space-between;

			.lefBox {
				width: 50%;
				padding: 10upx;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
			}

			.product {
				width: 100%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);

				.pimg {
					width: 100%;
					height: 340upx;


				}

				image {
					width: 100%;
					height: 340upx;

					border-radius: 20upx 20upx 0 0;
				}

				.name {
					width: 92%;
					padding: 10upx 4%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 30upx;
				}

				.info {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
					padding: 10upx 4% 10upx 4%;

					.price {
						color: #e65339;
						font-size: 30upx;
						font-weight: 600;
					}

					.slogan {
						color: #807c87;
						font-size: 24upx;
					}
				}
			}
		}
	}
</style>
