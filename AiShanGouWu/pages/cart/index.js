// pages/cart/index.js
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";

Page({
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    // 获取缓存中的信息 地址和购物车
    const address=wx.getStorageSync("address");
    const cart=wx.getStorageSync("cart")||[];
    this.setData({address});
    this.setCart(cart);
  },
  //收货地址
  async handleChooseAddress(){
    try {
      // 获取权限状态
      const res1=await getSetting();
      const scopeAddress=res1.authSetting["scope.address"];
      if (scopeAddress===false) {
        // 用户打开授权页面
        await openSetting();
      }
      // 调用获取收货地址的api
      const address=await chooseAddress();
      //存入缓存
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },
  //商品的选中
  handeItemChange(e){
    const goods_id=e.currentTarget.dataset.id;
    let {cart}=this.data;
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);
  },
  // 全选与反选
  handleItemAllCheck(){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    // 循环修改cart数组中的 商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    this.setCart(cart);
  },
  //修改商品数量
  async handleItemNumEdit(e){
    // 获取传递过来的操作是加还是减 和商品id
    const {operation,id}=e.currentTarget.dataset;
    let {cart}=this.data;
    // 找要修改的商品索引
    const index=cart.findIndex(v=>v.goods_id===id);
    if (cart[index].num===1&&operation===-1) {
      //弹窗提示
      const res=await showModal({content:"你是否要删除？"});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      cart[index].num+=operation;
      this.setCart(cart);
    }
  },
  //点击结算
  async handlePay(){
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    wx.navigateTo({url: '/pages/pay/index'});
  },
  //设置购物车状态且计算全选 总价 总数
  setCart(cart){
    // 计算全选
    let allChecked=true;
    // 总数 总价
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice+=v.num * v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    });
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart",cart);
  }
})

/**
 *获取用户的收货地址
 *  1 绑定点击事件
 *  2 获取用户对小程序所授予的权限状态
 *      若用户在权限提示框点了确定 suthSetting scope.address是true
 *      若用户在权限提示框点了取消 suthSetting scope.address是false
 *      若用户从来没有调用过 scope undefined
 *  3 把获取到的收货地址 存入到本地存储中
 * 
 *页面加载完毕 onShow
 * 1 获取本地存储中的地址数据
 * 2 把数据 设置给data中的一个变量 
 * 
 *onShow
 * 1 回到商品详情页面 第一次添加商品的时候 手动添加属性
 * 2 获取缓存中的购物车数组
 * 3 把购物车数据 填充都data中
 * 
 *全选的实现
 * 1 onShow获取缓存中的购物车数组
 * 2 根据购物车中的商品数据 所有商品都被选中时 全选激活
 * every 数组方法会遍历 会接收一个回调函数 当每一个回调函数都返回true则every方法的返回值为true
 * 空数组调用every，返回值也是true
 * const allChecked=cart.length?cart.every(v=>v.checked):false; 或者 const allChecked=cart.every(v=>v.checked)&&cart.length>0;
 * 
 *总价格和总数量
 * 1 都需要商品被选中 才能那来计算
 * 2 获取购物车数组
 * 3 遍历
 * 4 判断商品是否被选中
 * 5 总价格+=商品单价*商品数量
 * 5 总数量+=商品的数量
 * 6 计算结果返回data中
 * 
 *商品的选中 handeItemChange
 * 1 绑定change事件
 * 2 获取被修改的商品对象
 * 3 商品对象的选中状态 取反
 * 4 重新填回data中和缓存中
 * 5 重新计算全选 总价 总数等
 * 
 *全选与反选
 * 1 全选复选框绑定事件 change
 * 2 获取data中的全选变量 allChecked
 * 3 直接取反  allChecked=!allChecked
 * 4 遍历购物车数组 让商品的选中状态跟随allChecked的改变而改变
 * 5 把购物车数组和allChecked 重新设置回data 把购物车重新设置回缓存中
 * 
 *商品数量的编辑
 * 1 +与- 按钮 绑定同一个点击事件 区分的关键 自定义属性
 * 2 传递被点击的商品id goods_id
 * 3 获取data中的购物车数组 来获取需要被修改的商品分类
 * 4 当商品数量=1 并且用户点击 "-"
 *    弹窗提示showModal 开放文档中api.界面.交互  
 *    是否删除 确定就删除若取消数据不做处理
 * 4 直接修改商品对象的数量
 * 5 把catr数组 重新设置  this.setCart(cart);
 * 
 *点击结算
 * 1 判断有没有收货地址信息
 * 2 判断用户有没有选购商品
 * 3 经过以上的验证 跳转支付页面
 * 
 * 由于接口的关系,我选择小程序内置的本地存储技术来缓存购物车数据  
 */