// pages/goods_detail/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  data: {
    goodsObj:{},
    isCollect:false
  },
  GoodsInfo:{},   //商品对象
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);

  },
  async getGoodsDetail(goods_id){
    const res=await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=res.data.message;
    let collect=wx.getStorageSync("collect")||[];
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:res.data.message,
      isCollect
    })
  },
  // 点击轮播图 放大预览
  handlePreviewImage(e){
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });   
  },
  // 加入购物车
  handleCartAdd(){
    let cart=wx.getStorageSync("cart")||[];
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if (index===-1) {
      //不存在 第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++;
    }
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });  
  },
  // 点击收藏事件
  handleCollect(){
    let isCollect=false;
    let collect=wx.getStorageSync("collect")||[];
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //不等-1说明在收藏列表中有这件商品 等于-1就说明列表中没有该商品
    if (index!==-1) {
      // index!==-1 表示已经收藏过该商品，所以点击之后应该把这个商品从收藏列表中删除
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title:'取消成功',
        icon:'success',
        mask:true
      });
    }else{
      // 没有收藏过的 点击之后应该是加入收藏
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title:'收藏成功',
        icon:'success',
        mask:true
      });
    }
    wx.setStorageSync("collect",collect);
    this.setData({
      isCollect
    })
  }
})



/**
 *点击轮播图 预览大图 
 *  1 给轮播图绑定点击事件
 *  2 本质是调用小程序的api previewImage
 *点击加入购物车
 *由于接口的关系 我选择小程序内置的本地存储技术来缓存购物车数据
 *  1 绑定点击事件
 *  2 获取缓存中的购物车数据 数组格式
 *  3 判断当前商品是否已经存在购物车里
 *  4 已经存在 修改商品数据 购物车数量++ 重新把购物车数组填充回缓存中
 *  5 不存在 直接给购物车数组添加一个新元素 新元素带上购买数量属性num 重新把购物车数组填充回缓存中
 *  6 弹出提示
 * 
 *商品收藏 
 * 1 页面onShow的时候 加载缓存中的商品收藏数据
 * 2 判断当前商品是否被收藏？‘改变图标’：‘’
 * 3 点击商品收藏图标
 *  判断该商品是否存在于缓存数组中
 *  已存在 把该商品删除
 *  不存在 把商品添加到收藏数组中 存入到缓存中即可
 * 
 * 
 * 
 * 
 * 
 * iphone部分手机 不识别webp图片格式
 * 最好是找后台 让他修改
 * 临时自己改 1.webp=>1.jpg
 * goods.introduce=goodsObj.goods_introduce.replace(/\.webp/g,'.jpg')
 */