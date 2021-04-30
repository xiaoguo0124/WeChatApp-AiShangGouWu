// pages/login/index.js
Page({
  getUserProfile(){
    wx.getUserProfile({
      desc:"用于完善会员资料",
      success:(res)=>{
        wx.setStorageSync("userinfo", res.userInfo);
        wx.navigateBack({
          delta: 1
        });
      },
      fail:(res)=>{
        console.log(res);
        wx.navigateBack({
          delta: 1
        });
      }
    });
  }
})