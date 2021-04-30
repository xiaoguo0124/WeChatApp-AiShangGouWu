// 应用用来发送请求的方法
import { request } from "../../request/index.js";
Page({
  data: {
    swiperList:[],  // 轮播图数组
    catesList:[],   // 导航数组
    floorList:[],   // 楼层数组
  },
  // 页面开始加载就会触发
  onLoad: function (options) {
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  // 发送异步请求获取轮播图数据
  getSwiperList(){
    request({url: '/home/swiperdata'})
    .then(result=>{
        this.setData({
          swiperList:result.data.message
        })
    })
  },
  // 发送异步请求获取分类导航数据
  getCatesList(){
    request({url: '/home/catitems'})
    .then(result=>{
        this.setData({
          catesList:result.data.message
        })
    })
  },
  // 发送异步请求获取楼层数据
  getFloorList(){
    request({url: '/home/floordata'})
    .then(result=>{
        this.setData({
          floorList:result.data.message
        })
    })
  },

})