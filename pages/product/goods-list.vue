<template>
	<view>
		<!-- <view class="header" :style="{position:headerPosition,top:headerTop}">
			<view class="target" v-for="(target,index) in orderbyList" @tap="select(index)" :key="index" :class="[target.selected?'on':'']">
				{{target.text}}
				<view v-if="target.orderbyicon" class="icon" :class="target.orderbyicon[target.orderby]"></view>
			</view>
		</view> -->
		<!-- 占位 -->
		<!-- <view class="place"></view> -->
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" v-for="(goods,index) in productList" :key="index" @tap="toGoods(goods)">
					<view class="pimg">
						<v-lazyLoad mode="widthFix" :realSrc="goods.thumb " :errorImage="errorImage" :placeholdSrc="placeholderSrc"></v-lazyLoad>
					</view>
					<view class="name">{{goods.title}}</view>
					<view class="info">
						<view class="price">{{goods.price}}</view>
						<view class="slogan">{{goods.slogan}}</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{loadingText}}</view>
		</view>
		<view v-if="productList.length<1" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view class="empty-tips">
				暂无该类商品
			</view>

		</view>
	</view>
</template>

<script>
	import VLazyLoad from "@/components/lazyLoad";
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			VLazyLoad
		},
		computed: {
			...mapState(['hasLogin'])
		},
		data() {
			return {
				page: 1,
				total: 0,
				errorImage: '../static/errorImage.jpg',
				placeholderSrc: '../static/loading.png',
				productList: [],
				loadingText: "",
				categoryid: "",
				keywords: "",
				headerTop: "0px",
				headerPosition: "fixed",
				orderby: "sheng"
			};
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.id); //打印出上个页面传递的参数。

			if (option.id) {
				this.categoryid = option.id;
			}

			uni.setNavigationBarTitle({
				title: option.name
			});

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

			this.getGoodList();
		},
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
			this.loadingText = "正在加载...";
			this.getGoodList();
		},

		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			setTimeout(() => {
				this.reload();
				uni.stopPullDownRefresh();
			}, 1000);
		},

		methods: {
			async getGoodList() {
				const goodlist = await this.$req.ajax({
					path: 'zdapp/goods/get_goods_list',
					title: '正在加载',
					data: {
						group_id: '2c918aee6a48c1df016a48cdc53a0002',
						keywords: this.keywords,
						categoryid: this.categoryid,
						page: this.page,
						page_num: '10'
					}
				});
				this.loadingText = "";
				if (goodlist.data.code == 200) {
					this.total = goodlist.data.data.total;
					if (this.page > 1) {
						this.productList = this.productList.concat(goodlist.data.data.list);
					} else {
						this.productList = goodlist.data.data.list;
					}
				}
			},
			reload() {
				this.page = 1;
				this.getGoodList();
			},

			imageError(index) {
				this.productList[index].thumb = this.defaultImg;
			},
			//商品跳转
			toGoods(item) {
				let id = item.id;

				let url = `/pages/product/product?id=1&co_id=${item.co_id}`;
				if (!this.hasLogin) {
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url: url
				});
			},
			//排序类型
			select(index) {
				let tmpTis = this.orderbyList[index].text + "排序 "
				if (this.orderbyList[index].orderbyicon) {
					let type = this.orderbyList[index].orderby == 0 ? '升序' : '降序';
					if (this.orderbyList[index].selected) {
						type = this.orderbyList[index].orderby == 0 ? '降序' : '升序';
						this.orderbyList[index].orderby = this.orderbyList[index].orderby == 0 ? 1 : 0;
					}
					tmpTis += type
				}
				this.orderbyList[index].selected = true;
				let len = this.orderbyList.length;
				for (let i = 0; i < len; i++) {
					if (i != index) {
						this.orderbyList[i].selected = false;
					}
				}
				uni.showToast({
					title: tmpTis,
					icon: "none"
				});
			}
		}

	}
</script>

<style lang="scss">
	@font-face {
		font-family: "HMfont-home";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAMMAAsAAAAAB3gAAALAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCfgqCXII4ATYCJAMMCwgABCAFhG0HQxuDBsiemjxBRCmUAtQ2VRCBG4ig2u+zZ3c/ortTgBIoQOVPBYSJYkUggWRSPqyjY2yEQyPe5FzmkfXucrOArBAKSdt/TjNmNTZyfrOTKAwgNQXmqbkEBgj2eS6nNz3A+YFyXHs9P2raURxQgHtR7yiyEknMW4bXLsaDeEygbVEkxYXiyhqgV+BVgbgmCQzQ55xKS2doCvWag0W8o9FMz9M24G34/fgvPvQktQxvPL5axIPc38m/U/JI9VSLIKjm80M7RsYWoBAXa4PHVHFxi0rbKaotAfuaFfxOqSp+Jwvlbv/wCImow+1dsAaGdEcqZnRrKhAggQzqaOI24Bmw02JRZmZ88bS/fq2vH6Y1yywb576F7tn3l1/5e7zm6Ze2+cW37DBXjFEftC+6U7vil0/zOvXIl3lf7cx/3DkeysBDV/tDQ5N7tli9AzsiHDgcO55136FS8LLTzBygm4Q9u6bCp1zAy0lh7v/L+PnQ0P71YAZeG0pE3eWwRIIOANX5dz4JQCX8hQLB+5z/hXZb5ofeVMCvjc0fKFEp+rs1bzkU/H5Vz67iarArF1vJlH4oO8g0SGi7EVU4OnY43jzr3U5omqVIGhaQNS2Rhd1CTcc26ppOo21TyfGOCUIlSgsbJhHC0DqSvp/IhnbIwh6gZu4BdcNQoe1iuC7sWAnJWEAQQxEP2V4ocQE/ph5qjDqrkNDpZUhWE4rrEJGlDIyLji1WSpAfkTm2yF1CPKUYYhLwwWL0HPJ6AzBIAm7E0WiR0mB6TAyue1M0F/ABo/MIhEEhPIjVC5JwAvywGE8ZS5+vggg6eTFIC6ejWAchZNL0UJxosT3IEqO/F+dehMi6COJRFAZhRIAPVIz8iJcUA6Bg/Tw3hENFE0fkg9LFSP1wX2P0+mbf952ANvxUjhQ5is4tRurpjHJLjF9IRbKIHAAA') format('woff2');
	}

	/* 空白页 */
	.empty {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 100upx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background: #fff;

		image {
			width: 240upx;
			height: 160upx;
			margin-bottom: 30upx;
		}

		.empty-tips {
			display: flex;
			font-size: $font-sm+2upx;
			color: $font-color-disabled;

			.navigator {
				color: $uni-color-primary;
				margin-left: 16upx;
			}
		}
	}

	.icon {
		font-family: "HMfont-home" !important;
		font-size: 26upx;
		font-style: normal;

		&.sheng {
			&:before {
				content: "\e737";
			}
		}

		&.jiang {
			&:before {
				content: "\e736";
			}
		}

	}

	.header {
		width: 92%;
		padding: 0 4%;
		height: 79upx;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		border-bottom: solid 1upx #eee;

		.target {
			width: 20%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			margin-bottom: -2upx;
			color: #aaa;

			&.on {
				color: #555;
				border-bottom: 4upx solid #f06c7a;
				font-weight: 600;
				font-size: 30upx;
			}


		}
	}

	.place {

		background-color: #ffffff;
		height: 100upx;

	}

	.goods-list {
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
			padding: 20upx 30upx 3vw 30upx;
			display: flex;
			justify-content: space-around;
			flex-wrap: wrap;

			&::after {
				content: "";
				width: 46%;

			}

			.product {
				width: 46%;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);

				.pimg {
					width: 100%;
					height: 340upx;

					image {
						width: 100%;

						height: 340upx;
						border-radius: 20upx 20upx 0 0;
					}

				}



				.name {
					width: 100%;
					padding: 16upx 24upx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 26upx;
				}

				.info {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 100%;
					padding: 10upx 24upx 23upx;
					font-size: 18upx;
					color: #e65339;

					.price {
						color: #e65339;
						font-size: 32upx;
						font-weight: 600;
					}

					.slogan {
						color: #807c87;
						font-size: 24upx;
						width: 56upx;
						height: 44upx;
						border-radius: 10upx;
						overflow: hidden;
					}
				}
			}

		}
	}
</style>
