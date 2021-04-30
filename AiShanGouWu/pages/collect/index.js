// pages/collect/index.js
Page({
  data: {
    collect:[],
    tabs:[
      {
        id: 0,
        value: "店铺收藏",
        isActive: true
      },
      {
        id: 1,
        value: "商品收藏",
        isActive: false
      },
      {
        id: 2,
        value: "关注的商品",
        isActive: false
      },
      {
        id: 3,
        value: "浏览足迹",
        isActive: false
      }
    ]
  },
  onShow(options){
    const collect=wx.getStorageSync("collect")||[];
    this.setData({
      collect
    });
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    // 获取url上的type参数
    const {type}=currentPage.options;
    this.changeTitleByIndex(type-1);//id比起type在数值上小1
  },
  handleTabsItemChange(e){
    // 获取被点击的标题索引
    const {index}=e.detail;
    this.changeTitleByIndex(index);
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    // 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  }
})
