// pages/goods_list/index.js
import {request} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
  },
  // 异步请求 获取商品列表数据
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});
    const total=res.data.message.total;//获取总条数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      // 数组拼接
      goodsList:[...this.data.goodsList,...res.data.message.goods]
    })
    //关闭下拉刷新窗口 若没有调用onPullDownRefresh() 直接关闭不报错
    wx.stopPullDownRefresh();
  },
  //标题点击事件 从子组件传递过来的
  handleTabsItemChange(e){
    const {index} =  e.detail;//相当于 const index=e.detail.index;
    // 修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  //页面上滑 滚动条触底事件 判断？有下一页无给提示
  onReachBottom(){
    if(this.QueryParams.pagenum >= this.totalPages){
      wx.wx.showToast({title: '没有下一页数据'});
    }else{
      this.QueryParams++;
      this.getGoodsList();
    }
  },
  // 下拉事件监听
  onPullDownRefresh(){
    this.setData({
      goodsList:[]
    })
    this.getGoodsList();
  }
})

/**
 *onReachBottom()（开放文档页面生命周期）
 *用户上滑页面内 滚动条触底 开始加载下一页数据
 *  1 找到滚动条触底事件（微信开放文档）
 *  2 判断有没有下一页数据
 *      获取总页数 总页数=Math.ceil(总条数/页容量)
 *      获取当前的页码 pagenum
 *      判断 当前页码是否大于等于总页数
 *  3 若没有下一页数据 弹出提示
 *  4 若有就加载下一页数据
 *  
 *onPullDownRefresh()（开放文档页面生命周期）
 *下拉刷新页面
 *  1 触发下拉刷新事件 页面json中开启一个配置项
 *  2 重置数据
 *  3 重置页码 设置为1（this.QueryParams.pagenum=1）
 *  4 重新发送请求
 *  5 数据请求返回成功 手动关闭等待效果
 *  
 */