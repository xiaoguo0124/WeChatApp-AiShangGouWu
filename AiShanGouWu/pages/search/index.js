// pages/search/index.js
import {request} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js"; 
Page({
  data: {
    goods:[],
    // 取消按钮是否隐藏
    isFocus:false,
    // 输入框的值
    inpValue:""
  },
  // 输入框中的值改变 就会触发的事件
  handleInput(e){
    const {value}=e.detail;
    if (!value.trim()) {
      this.setData({
        goods:[],
        isFocus:false
      })
      // 不合法
      return;
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{this.qsearch(value)}, 1000);
  },
  // 点击 取消按钮
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  },
  // 发送请求获取搜索数据
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    this.setData({
      goods:res.data.message
    })
  }
})

/**
 *输入框绑定 值改变事件 input事件 
 * 1 获取到输入框中的值
 * 2 合法性判断
 * 3 校验通过 把输入框的值发送到后台
 * 4 返回的数据打印在页面上
 * 
 *防抖 (每输入有个字符它会马上发送请求，导致返回数据时刻在变化)
 * 1 我们需要输入稳定之后才发送请求
 * 2 引入定时器 等待约定时长 之后才发送请求
 * 
 *做开发时，防抖与节流 放一起讨论
 * 防抖一般放在输入框中 防止重复输入 重复发送请求
 * 节流 一般是用在页面下拉和上拉
 * 
 */