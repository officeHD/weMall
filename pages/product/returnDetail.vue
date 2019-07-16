<!-- 退换货 -->
<template>
	<view class="container">
		<view class="user-section">
			<text class="top-title">退款申请成功</text>
			<text class="top-con"></text>
		</view>
		<view class="address-section">
			<view class="order-content">
				请按以下地址退回
			</view>
			<view class="location">
				{company.refund_address}
			</view>
		</view>
		<view class="address-section">
			<view class="order-content">
				请填写有效的物流信息
			</view>
			<view class="addressMess">
				<view class="item">
					<text>快递单号：</text>
					<input class="input" type="text" value="" placeholder="" data-key="tracking_number" @input="inputChange" />
				</view>
				<view class="item">
					<text>物流公司：</text>
					<input class="input" type="text" value="" placeholder="" data-key="logistics" @input="inputChange" />
				</view>
			</view>
		</view>

		<view class="address-section">

			<view class="order-content">
				要退的商品
			</view>
			<view class="g-item">
				<v-lazyLoad mode="aspectFill" :realSrc="goodsInfo.thumb" :errorImage="errorImage" :placeholdSrc="placeholderSrc"></v-lazyLoad>
				<view class="right">
					<text class="title clamp ">{{goodsInfo.title}}</text>
					<text class="spec">{{goodsInfo.spec_name}}</text>
				</view>
			</view>

		</view>
		<view class="money">
			退款金额：<text>￥{{refund.refund_price}}</text>
		</view>
		<view class="address-section">

			<view class="order-content">
				退款说明
			</view>
			<view class="location">
				商家收到货后未进行处理的
			</view>
		</view>
		<view class="issue-btn-box">
			<button class="submit-btn" type="primary" @click="doSubmit">发表</button>
			<button class="submit-btn" type="primary" @click="doSubmit">发表</button>

		</view>
	</view>
</template>

<script>
	import rup from '@/common/request/request-upFiles.js';
	import VLazyLoad from "@/components/lazyLoad";

	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			VLazyLoad
		},
		data() {
			return {
				logistics: "",
				tracking_number: "",
				goodsInfo: {},
				refund: {},
				company: {},
				id: "",
				errorImage: '../static/errorImage.jpg',
				placeholderSrc: '../static/loading.png',

				file: []
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onLoad(options) {
			let id = options.id;
			this.id = id;
			this.loadData();
		},
		methods: {
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			async upload(){
				if(!this.tracking_number){
					this.$api.msg("请输入快递单号")
					return false;
				}
				if(!this.logistics){
					this.$api.msg("请输入物流公司")
					return false;
				}
				let res = await this.$req.ajax({
					path: 'zdapp/order_refund/add_refund_tracking',
					title: '正在加载',
					data: {
						users_id: this.userInfo.id,
						order_id: this.id,
						tracking_number:this.tracking_number,
						logistics:this.logistics,
					}
				});
				if(res.data.code==200){
					uni.switchTab({
						url:"pages/user/user"
					})
				}
			},
			async loadData() {
				try {
					let res = await this.$req.ajax({
						path: 'zdapp/order_refund/get_refund_info',
						title: '正在加载',
						data: {
							users_id: this.userInfo.id,
							order_id: this.id,
						}
					});
					if (res.data.code == 200) {

						this.company = res.data.data.company;
						this.refund = res.data.data.refund;

					}
					let res2 = await this.$req.ajax({
						path: 'zdapp/order/get_order_info',
						title: '正在加载',
						data: {
							users_id: this.userInfo.id,
							order_id: this.id,
						}
					});
					if (res2.data.code == 200) {
						this.goodsInfo = res2.data.data;
					}


				} catch (e) {
					console.log(e)
				}
			},
		}

	}
</script>

<style lang="scss">
	.address-section {
		margin-top: 20upx;
		padding: 10upx 30upx 10upx 30upx;
		min-height: 130upx;
		background: #fff;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.order-content {
			display: flex;
			align-items: flex-start;
			flex-direction: column;
			font-size: 28upx;
			color: $font-color-dark;
			padding: 5px 0;
		}

		.location {
			font-size: 24upx;
			color: #888888;
			margin-bottom: 10upx;
		}

		.addressMess {
			.item {
				padding: 8upx 0;
				display: flex;
				font-size: 24upx;
				color: #888888;
				align-items: center;

				.input {
					flex: 1;
					margin-left: 10upx;
					border: 1upx solid #CFCFCF;
					border-radius: 4upx;
					padding: 0 10upx;
				}
			}
		}
	}

	.money {
		padding: 20upx 30upx;
		font-size: 24upx;
		color: #888888;
		border-top: 1upx solid #e6e6e6;
		background-color: #fff;

	}

	.user-section {
		// height: 228upx;
		padding: 30upx 30upx;
		position: relative;
		background: linear-gradient(to right, #6ab0e6, #4b9fe0);
		display: flex;
		flex-direction: column;

		color: #fff;

		.top-title {
			font-size: 32upx;
			margin-bottom: 10upx;

		}

		.top-con {
			font-size: 22upx;
		}
	}



	.container {
		min-height: 100vh;
		background-color: #f2f2f2;
	}

	.g-item {
		display: flex;
		padding: 20upx 0;
		background-color: #fff;

		image {
			flex-shrink: 0;
			display: block;
			width: 140upx;
			height: 140upx;
			border-radius: 4upx;
		}

		.right {
			flex: 1;
			padding-left: 24upx;
			overflow: hidden;
		}

		.title {
			font-size: 30upx;
			color: $font-color-dark;
		}

		.spec {
			font-size: 26upx;
			color: $font-color-light;
		}




	}



	.mt20 {
		margin-top: 20upx;
	}

	.issue-btn-box {
		height: 100upx;
		position: fixed;
		padding: 0 30upx;
		left: 0;
		bottom: 0;
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top: 1upx solid #e6e6e6;

		button {
			width: 336upx;
			height: 80upx;

			font-size: 30upx;
			background-color: #3682FF;
			line-height: 80upx
		}
	}
</style>
