<template>
	<view class="content">
		<view class='issue' v-for="(item,index) in eva" :key="index">
			<view class="issue-head">
				<image :src="item.thumb" class="issue-head-pic" mode=""></image>
				<text class="issue-head-title">{{item.title}}</text>
			</view>
			<textarea @blur="blur" :data-key="index" :value="item.message" placeholder="请输入" />
			<view class="imgBox">
				<view class="img"  v-for="(img,imgi) in item.file" :key="imgi" >
					<image :src="img.file_url" mode="aspectFill"></image>
				</view>
				<view class="img"  @click="testUp(index)"><image src="../../static/add.png" mode="aspectFill"></image></view>
			</view>
			 
		</view>
		<view class="issue-btn-box">
			<button   class="submit-btn" type="primary" @click="doSubmit">发表</button>
						 
		</view>
	</view>
</template>

<script>
	 import rup  from '@/common/request/request-upFiles.js';
  import {
  	mapState
  } from 'vuex';
	export default {
		components:{},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		data() {
			return {
				 co_order_id:"",
				 orderList:[],
				 eva:[ {
						 order_id:"",
						 goods_id:"",
						 option_id:"",
						 message:"",
						 file:[ ]
					 }
				 ]
			}
		},
		async onLoad(option) {
			//商品数据
			let id = option.id; 
			this.co_order_id=id;
			let res = await this.$req.ajax({
				path: 'zdapp/order/get_order_co_info',
				title: '正在加载',
				data: {
					users_id: this.userInfo.id,
					co_order_id: id, 
				}
			});
		
			if (res.data.code == 200) {
				this.orderList = res.data.data.list; 
				this.eva=this.orderList.map(item=>{
					return {
					order_id:item.id,
					goods_id:item.goods_id,
					option_id:item.option_id,
					thumb: item.thumb,
					title: item.title,
					message:"",
					file:[ ]
				}
				})
			}
		},
		methods: {
			blur(e){
				 let index=e.currentTarget.dataset.key;
				 this.eva[index].message=e.detail.value;
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
							extra:{type:1}
						}
					})
					
					// let imageArr=
					 if(res.upload&&res.upload.length>0){ 
						 res.upload.forEach(item=>{
							 let returnData=JSON.parse(item);
							 if(returnData.code==200){
								 this.eva[index].file.push({
									file_url:returnData.data.file_url,
									type:1
								 })
							 }
							
						 })
					 }
					console.log(this.eva)
				} catch (e) {
					console.log(e)
				}
			},
			async doSubmit(){
				let evaArr=this.eva.map(item=>{
					return {
						order_id:item.order_id,
						goods_id:item.goods_id,
						option_id:item.option_id, 
						message:item.message,
						file:item.file
					}
				})
				let res = await this.$req.ajax({
					path: 'zdapp/evaluation/add_evaluation',
					title: '正在加载',
					data: {
						users_id: this.userInfo.id,
						co_order_id: this.co_order_id,
						eva:JSON.stringify(evaArr)
						
					}
				});
				console.log(res)
			}
		}
	}
</script>

<style  lang='scss'>
	.content{
		height: 100%;
	}
	$backgroundC:#f9f9f9;
	$borderColor:#f5f5f5;
	$white:#ffffff;
	$fontSize:28upx;
	
	.issue {
		background-color: $backgroundC;
		min-height: 100vh;
		&-head{
			background-color: $white;
			height: 100upx;
			border-top: 1upx solid $borderColor;
			border-bottom: 1upx solid $borderColor;
			padding: 0 25upx;
			
			&-pic{
				width: 70upx;
				height: 70upx;
				border-radius: 50%;
				vertical-align: middle;
				margin-right: 17upx;
			}
			&-title{
				line-height: 100upx;
				font-size: 30upx;
				vertical-align: middle;
				margin-right: 35upx;
			}
			
			&-star-box{
				display: inline-block;
				
				image{
					width: 32upx;
					height: 32upx;
					vertical-align: middle;
					margin-right: 14upx;
				}
				image.active{
					animation: star_move ease-in 1 1s,star_rotate ease 1.5s infinite 1s;
				}
			}
		}
		textarea{
			width: 100%;
			height: 150upx;
			background-color: $white;
			font-size: $fontSize;
			color: #898989;
			padding: 24upx;
			box-sizing: border-box;
			line-height: 40upx
		}
		
	}
	 .issue-btn-box{
		height: 100upx;
		position: fixed;
		padding: 0 30upx;
		left: 0;
		bottom:0;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1upx solid #e6e6e6;
		button{
			width:100%;
			height: 80upx;
			 
			font-size: $fontSize;
			background-color: #3682FF;
			line-height: 80upx
		}
	}
	@keyframes star_move{
		from{
			width: 50upx;
			height: 50upx;
			transform: rotate(180deg)
		}
		to{
			width: 32upx;
			height: 32upx;
			transform: rotate(0)
		}
	}
	@keyframes star_rotate{
		0%{
			transform: rotateY(360deg)
		}
		100%{
			transform: rotateY(180deg)
		}
	}
	.imgBox{
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
		.img{
			width: 25vw;
			height: 25vw;
			padding: 20upx;
			image{
				border-radius: 10upx;
				width: 100%;height: 100%;
			}
		}
		
	}
</style>
