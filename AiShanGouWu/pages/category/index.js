// pages/category/index.js
/**web中的本地存储与小程序中的本地存储区别
 * 1 写代码的方式：
 * web localStorage.setItem("key","value") localStorage.getItem("key")
 * min wx.setStorageSync("key","value") wx.getStorageSync("key")
 * 2 存的时候有无类型转换
 * web 不管存入的是什么类型的数据，最终都会先调用 toString() 把数据变成字符串
 * min 不存在类型转换这个操作 存什么类型就获取到什么类型
 */

import {request} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({
  data: {
    leftMenuList:[],    //左侧菜单数据
    rightContent:[],    //右侧商品数据
    currentIndex:0,     //被点击的左侧菜单
    scrollTop:0         //右侧内容的滚动条距离顶部的距离
  },
  //接口数据的返回值
  Cates:[],
  onLoad: function (options) {
    // 有无旧数据?'使用本地存储旧数据':'发送请求'
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      this.getCates(); 
    }else{
      if(Date.now() - Cates.time > 1000*10){
        this.getCates();
      }else{
        this.Cates=Cates.data;
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  //获取分类数据
  async getCates(){
    //使用es7的async发送异步请求
    const res=await request({url:"/categories"});
    this.Cates=res.data.message;
    wx.getStorageSync("cates",{time:Date.now(), data:this.Cates});
    let leftMenuList=this.Cates.map(v=>v.cat_name);
    let rightContent=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e){
    // 取值赋值 不同索引获取不同的商品内容
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0   //重设右侧预览区离顶部的距离
    })
  }
})