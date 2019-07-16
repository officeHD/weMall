<!-- 退换货 -->
<template>
	<view class="container">
		<view class="g-item">
			<view class="img">
				<v-lazyLoad mode="aspectFill" :realSrc="goodsInfo.thumb" :errorImage="errorImage" :placeholdSrc="placeholderSrc"></v-lazyLoad>
			</view>


			<view class="right">
				<text class="title clamp ">{{goodsInfo.title}}</text>
				<text class="spec">{{goodsInfo.spec_name}}</text>
			</view>
		</view>

		<view class="row b-b mt20">
			<text class="tit">服务类型</text>
			<text class="input" @click="toggleSpec('服务类型')">
				{{refund_type.name||"请选择"}}
			</text>

			<text class="yticon icon-you"></text>
		</view>
		<view class="row b-b ">
			<text class="tit">商品状态</text>
			<text class="input" @click="toggleSpec('商品状态')">
				{{goods_status.name||"请选择"}}
			</text>
			<text class="yticon icon-you"></text>
		</view>
		<view class="row b-b ">
			<text class="tit">退款原因</text>
			<text class="input" @click="toggleSpec('退款原因')">
				{{refund_reason||"请选择"}}
			</text>
			<text class="yticon icon-you"></text>
		</view>

		<view class="imgBox mt20">
			<view class="title">
				上传凭证
			</view>
			<view class="img" v-for="(img,imgi) in file" :key="imgi">
				<image :src="img.file_url" mode="aspectFill"></image>
			</view>
			<view class="img" @click="testUp(index)">
				<image src="../../static/add.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="issue-btn-box">
			<button class="submit-btn" type="primary" @click="add_refund">提交</button>

		</view>
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec()">
			<view class="mask"></view>
			<view class="layer attr-content " @click.stop="stopPrevent">
				<view class="titleC">{{specType}} </view>
				<view class="selectList" v-if="specType ==='服务类型'">
					<view class="selectItem" v-for="(item,index) in returnType" :key="index" @click="setType(item)">
						<view class=""> {{item.name}} </view>
						<image v-if="refund_type.value==item.value" src="/static/on.png" mode=""></image>
						<image v-else src="/static/off.png" mode=""></image>
					</view>
				</view>
				<view class="selectList" v-if="specType ==='商品状态'">
					<view class="selectItem" v-for="(item,index) in goodsStatus" :key="index" @click="setStatus(item)">
						<view class=""> {{item.name}} </view>
						<image v-if="goods_status.value==item.value" src="/static/on.png" mode=""></image>
						<image v-else src="/static/off.png" mode=""></image>
					</view>
				</view>

				<view class="selectList" v-if="specType ==='退款原因'">
					<view class="selectItem" v-for="(item,index) in returnReason" :key="index" @click="setReason(item)">
						<view class=""> {{item}} </view>
						<image v-if="refund_reason==item" src="/static/on.png" mode=""></image>
						<image v-else src="/static/off.png" mode=""></image>
					</view>
				</view>

				<button class="btn" @click="toggleSpec()">关闭</button>
			</view>
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
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		data() {
			return {
				returnType: [{
						name: "仅退款",
						value: "1"
					},
					{
						name: "退款退货",
						value: "2"
					},
					{
						name: "换货",
						value: "3"
					}
				],
				refund_type: {},
				goodsStatus: [{
						name: "已收到货 ",
						value: "1"
					},
					{
						name: "未收到货",
						value: "2"
					}
				],
				goods_status: {
					name: "已收到货 ",
					value: "1"
				},
				refund_reason: "",
				returnReason: ["不喜欢/不想要", "做工有问题", "发错货", "商品破损", "其他"],
				specType: "退款类型",
				specClass: "none",
				errorImage: '../static/errorImage.jpg',
				placeholderSrc: '../static/loading.png',

				goodsInfo: {},
				file: [],
				id: "110"
			}
		},
		onLoad(options) {
			let id = options.id;
			 
			this.id = id;
			this.loadData();
		},
		methods: {
			setType(type) {
				this.refund_type = type;
				this.toggleSpec();
			},
			setStatus(type) {
				this.goods_status = type;
				this.toggleSpec();
			},
			setReason(type) {
				this.refund_reason = type;
				this.toggleSpec();
			},


			async add_refund() {
				let that=this;
				let res = await this.$req.ajax({
					path: 'zdapp/order_refund/add_refund',
					title: '正在加载',
					data: {
						users_id: this.userInfo.id,
						order_id: this.id,
						refund_type: this.refund_type.value,
						goods_status: this.goods_status.value,
						refund_reason: this.refund_reason,
						file: this.file
					}
				});
				if (res.data.code == 200) {
					uni.showModal({
						cancelText: "稍后填写",
						confirmText: "立即填写",
						confirmColor: "#01AAEF",
						cancelColor: "#9E9E9E",
						content: "退款退货需要填写物流信息，是否立即填写",
						success: function(res){
							uni.navigateTo({
								url: `/pages/product/returnDetail?id=${that.id}`
							})
						}
					})
				}else{
					this.$api.msg(res.data.message);
				}

			},
			async loadData() {

				let res = await this.$req.ajax({
					path: 'zdapp/order/get_order_info',
					title: '正在加载',
					data: {
						users_id: this.userInfo.id,
						order_id: this.id,
					}
				});
				if (res.data.code == 200) {
					this.goodsInfo = res.data.data;
				}


			},
			async testUp(index) {
				try {
					const res = await rup.selectFiles({
						type: 2,
						maximum: 3,
						upload: {
							path: 'https://www.i2b2b.com/public/index.php/zdapp/upload/upload',
							files: ['file'],
							title: '正在上传',
							extra: {
								type: 1
							}
						}
					})

					// let imageArr=
					if (res.upload && res.upload.length > 0) {
						res.upload.forEach(item => {
							let returnData = JSON.parse(item);
							if (returnData.code == 200) {
								this.file.push({
									file_url: returnData.data.file_url,
									type: 1
								})
							}

						})
					}
					console.log(this.file)
				} catch (e) {
					console.log(e)
				}
			},
			doSubmit() {
				uni.navigateTo({
					url: '/pages/product/returnDetail',
					success: res => {},
					fail: () => {},
					complete: () => {}
				})
			},
			//规格弹窗开关
			toggleSpec(type) {
				if (type) {
					this.specType = type;
				}
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			stopPrevent() {}
		}

	}
</script>

<style lang="scss">
	.imgBox {
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
		padding: 20upx 0;

		.title {
			width: 100%;
			font-size: 26upx;
			color: #333;
			padding: 0 20upx;

		}

		.img {
			width: 25vw;
			height: 25vw;
			padding: 20upx;

			image {
				border-radius: 10upx;
				width: 100%;
				height: 100%;
			}
		}

	}

	.container {
		min-height: 100vh;
		background-color: #f2f2f2;
	}

	.g-item {
		display: flex;
		padding: 20upx 30upx;
		background-color: #fff;

		.img {
			width: 140upx;
			height: 140upx;
			border-radius: 4upx;
		}

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

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
			text-align: right;
			padding-right: 20upx;

		}

		.icon-shouhuodizhi {
			font-size: 36upx;
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
		justify-content: center;
		align-items: center;
		border-top: 1upx solid #e6e6e6;

		button {
			width: 100%;
			height: 80upx;

			font-size: 30upx;
			background-color: #3682FF;
			line-height: 80upx
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			padding-bottom: 100upx;

			.titleC {
				text-align: center;
				padding: 20upx;
				font-size: 32upx;
				color: #333;
			}

			.selectList {
				padding: 20upx;

				.selectItem {
					display: flex;
					justify-content: space-between;
					padding: 20upx 10upx;
					font-size: 30upx;
					color: #333;

					image {
						width: 50upx;
						height: 50upx;
					}
				}
			}



			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 10upx;
				background: #4B9FE0;
				font-size: $font-base + 2upx;
				color: #fff;

				position: absolute;
				bottom: 12upx;
				left: 30upx;
				width: 690upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}

	}
</style>
