// pages/pay/index.js
import {getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment} from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
import {request} from "../../request/index.js";

Page({
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    // 获取缓存中的信息 地址和购物车
    const address=wx.getStorageSync("address");
    let cart=wx.getStorageSync("cart")||[];
    // 过滤购物车数组 过滤后checked都为true 数据是从缓存中获取的并不是从购物车中传过来的
    cart=cart.filter(v=>v.checked);
    this.setData({address});
    
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {
      totalPrice+=v.num * v.goods_price;
      totalNum+=v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum
    });
  },
  //点击支付
  async handleOrderPay(){
    try {
      /*
      const token=wx.getStorageSync("token");
      if(!token){
        wx.navigateTo({ url: '/pages/auth/index' });
        return;
      }
      */
      const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
      
      // 后请求体参数
      const order_price=this.data.totalPrice;
      const consignee_addr=this.data.address.all;
      const cart=this.data.cart;
      let goods=[];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }));
      const orderParams={order_price,consignee_addr,goods};
      // 准备发送请求 创建订单 获取订单编号
      const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams});
      // 发起 预支付接口
      const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
      // 发起 微信支付
      await requestPayment(pay);
      // 查询后台 订单状态
      const res=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}});
      await showToast({title:"支付成功"});
      // 手动删除缓存中 已经支付了的商品
      let newCart=wx.getStorageSync("cart");
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
        
      // 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    } catch (error) {
      await showToast({title:"支付失败"});
      console.log(error);
    }
  }
})



/**
 *页面加载 onShow()
 * 1 缓存中获取购物车数据 渲染到页面上 这些数据的 checked=true
 * 
 *微信支付
 * 可以实现微信支付的账号
 * 1 企业微信
 * 2 企业账号的小程序后台中必须给开发者添加上白名单
 *    一个appid 可以同时绑定多个开发者
 *    白名单上的开发者就可以共用这个appid和它的开发权限
 * 
 *支付按钮
 * 1 先判断缓存中有没有token
 * 2 没有 跳转授权页面
 * 3 有token 就获取
 * 4 并且创建订单 获取订单编号
 * 5 已经完成了微信支付
 * 6 手动删除缓存中 已被选中了的商品
 * 7 删除购物车数据 填充回缓存
 * 8 跳转页面
 * 
 * 
 * 
 * 在这个支付页面中 有两处获取购物车信息的地方：
 * let cart=wx.getStorageSync("cart")||[];
 * let newCart=wx.getStorageSync("cart");
 * 而且它们都需要过滤。
 * 第一个是过滤之后剩下选中的商品，也就是需要支付的，这些就是需要支付的商品
 * 第二个过滤之后剩下的是没有被选中的商品，因为购物车中被选中的已经变成了支付订单，所以不应该继续出现在购物车中
 * 
 */