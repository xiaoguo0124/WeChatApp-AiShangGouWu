// pages/feedback/index.js
Page({
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品，商家投诉",
        isActive:false
      }
    ],
    // 被选中的图片路径数组
    chooseImgs:[],
    // 文本域的内容
    textVal:""
  },
  // 外网的图片的路径数组
  UpLoadImgs:[],
  handleTabsItemChange(e){
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  // 点击"+"选择图片
  handleChooseImg(){
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组 进行拼接
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    }); 
  },
  // 点击图片删除
  handleRemoveImg(e){
    const {index}=e.currentTarget.dataset;
    let {chooseImgs}=this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域的输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  // 提交按钮的点击
  handleFormSubmit(){
    const {textVal,chooseImgs}=this.data;
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        mask: true
      });
      return;
    }
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    // 判断 有没有图片需要上传

    if (chooseImgs.length!=0) {
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
          // 上传到图床
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          filePath: v,
          name: file,
          formData: {},
          success: (result)=>{
            let url=JSON.parse(result.data);
            this.UpLoadImgs.push(url);
            // 所有图片上传完成
            if (i===chooseImgs.length-1) {
              wx.hideLoading();
  
              this.setData({
                textVal:"",
                chooseImgs:[]
              })
              wx.navigateBack({
                delta: 1
              });
                
            }
          }
        });
      })
    } else {
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }
    
  }
})

/**
 *点击"+"触发tap事件 
 * 1 调用小程序内置的选择图片api
 * 2 获取到图片的路径数组
 * 3 把图片路径存到 data的变量中
 * 4 页面就可以根据 图片数组 进行循环显示 自定义组件
 * 
 *点击自定义图片组件删除图片
 * 1 获取被点击的元素索引
 * 2 获取data中的图片数组
 * 3 根据索引 数组中的删除对应的元素
 * 4 把数组重新设置回data中
 * 
 *点击 "提交"
 * 1 获取文本域的内容
 *    data中定义变量 存放输入框内容
 *    文本域绑定输入事件 触发时把输入框中的值存入变量
 * 2 对这些内容 合法性验证
 * 3 验证通过 用户选择的图片上传到专门的图片的服务器 返回图片外网的链接
 *    遍历图片数组
 *    逐个上传
 *    自己再维护图片数组 存放图片上传后的外网的链接
 * 4 文本域和外网图片的路径 一起提交到服务器（前端模拟 不真发）
 * 5 清空当前页面
 * 6 返回上一页
 * 
 * 
 * 上传文件的api不支持多个文件同时上传 只能遍历 逐个上传
 * // 小程序api
    wx.uploadFile({
      // 图片要上传到哪里
      url: '',
      // 被上传的文件的路径
      filePath: ,
      // 上传的文件得到名称 后台要用这个名字来获取
      name: ,
      // 顺带的文本信息
      formData: {},
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
 */