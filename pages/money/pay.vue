<template>
	<view class="app">
		<view v-if="!shopw">
			<view class="price-box">
				<text>支付金额</text>
				<text class="price">{{pay_price}}</text>
			</view>
			<view class="titleBox">
				<image class="imgicon" src="../../static/pay/title.png" mode="widthFix"></image>全购支付
			</view>
			<view class="pay-type-list">
				<view class="type-item b-b" @click="changePayType(1)">
					<image class="imgicon" src="../../static/pay/account.png" mode="widthFix"></image>
					<view class="con">
						<text class="tit">账户余额</text>
						<text>(剩余：¥{{balance}})</text>
					</view>
					<label class="radio">
						<radio value="" color="#fa436a" :checked='payType == 1' :disabled="balance<pay_price" />
						</radio>
					</label>
				</view>
				<!-- <view class="type-item b-b" @click="changePayType(2)">
					<image class="imgicon" src="../../static/pay/cunbei.png" mode="widthFix"></image>
					<view class="con">
						<text class="tit">村贝</text>
						<text>(可用{{cunbei}}分，可抵{{cunbei}}.00元人民币)</text>
					</view>
					<label class="radio">
						<radio value="" color="#fa436a" :checked='payType == 2' />
						</radio>
					</label>
				</view> -->
			</view>
			<view class="pay-type-list">

				<view class="type-item b-b" @click="changePayType(2)">
					<text class="icon yticon icon-weixinzhifu"></text>
					<view class="con">
						<text class="tit">微信支付</text>
						<text></text>
					</view>
					<label class="radio">
						<radio value="" color="#fa436a" :checked='payType == 2' />
						</radio>
					</label>
				</view>
				<view class="type-item " @click="changePayType(3)">
					<text class="icon yticon icon-alipay"></text>
					<view class="con">
						<text class="tit">支付宝支付</text>
					</view>
					<label class="radio">
						<radio value="" color="#fa436a" :checked='payType == 3' />
						</radio>
					</label>
				</view>

			</view>
		</view>

		<view v-if="shopw">

			<view class="contentPw">
				<view class="login">
					<view class="l_top" style="margin-bottom:100upx;">
						<view class="l_text">请输入6位支付密码</view>
					</view>
					<view class="l_top">
						<view class="mima">
							<view class="item">
								<view v-if="len<=0" :class="{line:show}"></view>
								<view v-if="len>=1" class="dot"></view>
							</view>
							<view class="item">
								<view v-if="len==1" :class="{line:show}"></view>
								<view v-if="len>=2" class="dot"></view>
							</view>
							<view class="item">
								<view v-if="len==2" :class="{line:show}"></view>
								<view v-if="len>=3" class="dot"></view>
							</view>
							<view class="item">
								<view v-if="len==3" :class="{line:show}"></view>
								<view v-if="len>=4" class="dot"></view>
							</view>
							<view class="item">
								<view v-if="len==4" :class="{line:show}"></view>
								<view v-if="len>=5" class="dot"></view>
							</view>
							<view class="item">
								<view v-if="len==5" :class="{line:show}"></view>
								<view v-if="len>=6" class="dot"></view>

							</view>
							<view v-if="len>5" class="dot">{{numlength}}</view>
							<input class="trade_pwd" disabled="disabled" maxlength="6" id="targetInput" @focus="focus1" @blur="blur1" type="number"
							 v-model="trade_pwd" />
						</view>
					</view>
				</view>
				<view class="keypan">
					<view class="titles">
						<span @click="back()">取消</span>
						<span @click='setpwd'>确认</span>
					</view>
					<view class="pan_num_key" :class="[items.checked?'pan_num_checked':'pan_num_key']" v-for="(items,index) in boardlists"
					 :key="index" @click="writepwd(items.id)">{{items.con}}</view>
				</view>
			</view>
		</view>
		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				shopw: false,
				out_trade_Id: "",
				pay_price: "",
				payType: 1,
				orderInfo: {},
				balance: 0,
				cunbei: 0,
				trade_pwd: '',
				focus: true,
				show: false,
				numarr: [],
				d_time: 10,
				nextsteep: false,
				tel: 0,
				numlength: "",
				gopen: false,
				isactive: true,
				resgetcode: false,
				boardlists: [{
						id: 1,
						con: 1,
						checked: false
					}, {
						id: 2,
						con: 2,
						checked: false
					}, {
						id: 3,
						con: 3,
						checked: false
					}, {
						id: 4,
						con: 4,
						checked: false
					}, {
						id: 5,
						con: 5,
						checked: false
					}, {
						id: 6,
						con: 6,
						checked: false
					}, {
						id: 7,
						con: 7,
						checked: false
					}, {
						id: 8,
						con: 8,
						checked: false
					}, {
						id: 9,
						con: 9,
						checked: false
					}, {
						id: 10,
						con: "",
						checked: false
					}, {
						id: 11,
						con: 0,
						checked: false
					},
					{
						id: 12,
						con: "x",
						checked: false
					},

				]
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'openId']),
			len: function() {
				if (this.trade_pwd.length == 6) {
					// 第一次进来可以点击的

				}
				return this.trade_pwd.length
			}
		},
		async onLoad(options) {
			// this.total_order_id = options.id;
			const account = await this.$req.ajax({
				path: 'zdapp/users/get_users_info',
				title: '正在加载',
				data: {
					users_id: this.userInfo.id
				}
			});
			if (account.data.code == 200) {
				// console.log(account.data.data)
				if (account.data.data.balance) {
					this.balance = account.data.data.balance;
				}
				if (account.data.data.group_cowry) {
					this.cunbei = account.data.data.group_cowry;

				}

			}
			console.log(options)
			var res = await this.$req.ajax({
				path: 'zdapp/order_pay/get_order_pay',
				title: '正在加载',
				data: {
					users_id: this.userInfo.id,
					co_order_id: options.id

				}
			});
			if (res.data.code == 200) {
				this.out_trade_no = res.data.data.out_trade_no;
				this.pay_price = res.data.data.pay_price;
				this.create_time = res.data.data.create_time;
				this.out_trade_Id = res.data.data.id;
				if (this.balance < res.data.data.pay_price) {
					this.payType = 2
				}

			}
		},

		methods: {
			writepwd(num) {
				if (num == 12) {
					this.close();
					return;
				}
				if (num == 10) {
					return;
				}
				if (num == 11) {
					num = 0;
					this.boardlists[10].checked = true;
				} else {
					this.boardlists[num - 1].checked = true;
				}
				this.numarr.push(num);
				if (this.numarr.length > 6) {
					return
				}
				var that = this;
				setTimeout(function() {
					for (var i = 0; i < that.boardlists.length; i++) {
						that.boardlists[i].checked = false;
					}
				}, 200)
				this.trade_pwd = this.numarr.join("");


			},
			//密码框
			back() {
				this.shopw=false;
			},
			//回退方法
			close() {
				this.numarr.pop();
				if (this.trade_pwd.length > 0) {
					this.trade_pwd = this.trade_pwd.substring(0, this.trade_pwd.length - 1);
				}
			},
			blur1() {
				this.show = false
			},
			focus1() { 
				this.show = true
			},

			// 确认执行的方法
			async setpwd() {
				if (this.trade_pwd.length < 6) {
					this.$api.msg("密码长度不能少于6位");
					return;
				}
				// 密码长度为6位以后执行方法
				// console.log(this.trade_pwd);
				// zdapp/users/verify_password
				var res = await this.$req.ajax({
					path: 'zdapp/users/verify_password',
					title: '正在加载',
					data: {
						users_id: this.userInfo.id,
						password: this.trade_pwd
					}
				});
				if (res.data.code == 200) {
					this.payByPw()
				} else { 
					this.$api.msg(res.data.message);
				}
				

			},
			async payByPw(){
				var res = await this.$req.ajax({
					path: 'zdapp/pay/pay_balance',
					title: '正在加载',
					data: {
						users_id: this.userInfo.id,
						total_order_id: this.out_trade_Id
					}
				});
				if (res.data.code == 200) {
					uni.redirectTo({
						url: '/pages/money/paySuccess'
					})
				} else {
					this.shopw=true;
					this.$api.msg(res.data.message);
				}
			},

			//选择支付方式
			changePayType(type) {
				if (type == 1 && this.balance < this.pay_price) {
					this.$api.msg("账户余额不足");
					return false;
				}
				this.payType = type;
			},
			//确认支付
			confirm: async function() {
					
				if (this.payType == 1) {
					this.shopw=true;
					
				}
				if (this.payType == 2) {
					var res = await this.$req.ajax({
						path: 'zdapp/pay/pay_wxapp',
						title: '正在加载',
						data: {
							users_id: this.userInfo.id,
							open_id: this.openId,
							total_order_id: this.out_trade_Id,
						}
					});
					console.log(res)
					if (res.data.code == 200) {
						let dataSim = res.data.data;
						// appId: "wxf08b7ec6cc2c2841"
						// nonceStr: "sywrtilloiqekzu048zi2d0bgnarpawl"
						// package: "prepay_id=wx29174356967466075deb52d21537226100"
						// paySign: "F6D21FBAF0D2B751490073FEBFA4AE25"
						// signType: "MD5"
						// timeStamp: "1561801436"
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: dataSim.timeStamp,
							nonceStr: dataSim.nonceStr,
							package: dataSim.package,
							signType: dataSim.signType,
							paySign: dataSim.paySign,
							success: function(res) {
								uni.redirectTo({
									url: '/pages/money/paySuccess'
								})
							},
							fail: function(err) {
								console.log('fail:' + JSON.stringify(err));
							}
						});

					} else {
						this.$api.msg(res.data.message);
					}
				}

			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
		height: 100vh;
		background-color: #f2f2f2;
	}

	.titleBox {
		padding: 0 30upx;
		background-color: #FEF8F3;
		height: 90upx;
		display: flex;
		align-items: center;
		color: #FA5802;
		font-size: 26upx;


	}

	.imgicon {
		width: 40upx;
		margin-right: 20upx;
	}

	.price-box {
		background-color: #fff;
		height: 245upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-bottom: 20upx;
		background-color: #fff;
		padding-left: 30upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 70upx;
			font-size: 40upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

	.contentPw {
		width: 100%;
		font-size: 28upx;
		background: #fff;
		color: #555;
		height: 100vh;
		font-weight: 400;


		.keypan {
			width: 100%;
			height: 500upx;
			position: fixed;
			left: 0;
			bottom: 0;
			background: #E6E6E6;

			.titles {
				width: 100%;
				height: 80upx;
				background: #E6E6E6;
				display: flex;
				justify-content: space-between;
				line-height: 80upx;
				padding: 0 5%;
				font-size: 32upx;
				color: #292824;

				span {
					width: 100upx;
					height: 70upx;
					display: inline-block;
					padding-left: 30upx;
				}

			}

			.pan_num_key {
				width: 30%;
				height: 80upx;
				float: Left;
				margin-left: 2.1%;
				margin-top: 2.1%;
				text-align: center;
				background: #fff;
				font-size: 30upx;
				border-radius: 10upx;
				font-size: 35upx;
				line-height: 80upx;
				box-shadow: 0 2upx 5upx rgba(0, 0, 0, 0.5);

			}

			.pan_num_checked {
				width: 30%;
				height: 80upx;
				float: Left;
				margin-left: 2.1%;
				margin-top: 2.1%;
				text-align: center;
				font-size: 30upx;
				border-radius: 10upx;
				font-size: 35upx;
				line-height: 60upx;
				box-shadow: 0 2upx 5upx rgba(0, 0, 0, 0.5);
				animation: checked_bg 0.08s ease;
			}
		}

		.navigation_bar {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding-top: 60upx;

			.back-icon {
				width: 18upx;
				height: 34upx;
			}
		}

		.login {
			width: 100%;
			height: 300upx;

			.l_top {
				width: 700upx;
				height: 200upx;
				margin: 0 auto;
				position: relative;

				.l_text {
					width: 445upx;
					height: 69upx;
					font-size: 28upx;
					text-align: center;
					margin: auto;
					top: 100upx;
					position: relative;

				}

				.lt {
					margin-top: -20upx;
					font-size: 25upx;
					color: #555
				}
			}
		}

		.title {
			color: #616161;
			text-align: center;
			font-size: 30upx;
			margin-bottom: 34upx;
		}

		.mima {

			flex-direction: row;
			width: 680upx;
			height: 78upx;
			margin: 0 auto;
			position: relative;

			.item {
				width: 92upx;
				height: 100%;
				box-sizing: border-box;
				display: flex;
				float: left;
				align-items: center;
				justify-content: center;
				border-bottom: 1upx solid #E5E5E5;
				margin-left: 20upx;

				.line {
					width: 2upx;
					height: 40upx;
					background: #979797;
					animation: shan 1s ease infinite;
				}

				.dot {
					width: 20upx;
					height: 20upx;
					border-radius: 20upx;
					background: black;
				}
			}

			.trade_pwd {
				position: absolute;
				height: 78upx !important;
				width: 480upx;
				opacity: 0;
			}
		}
	}

	@keyframes shan {
		from {
			opacity: 1;
		}

		to {
			opacity: 0;
		}
	}

	@keyframes checked_bg {
		0% {
			background: #fff
		}

		50% {
			background: #D3D1E2
		}

		100% {
			background: #fff
		}
	}
</style>
