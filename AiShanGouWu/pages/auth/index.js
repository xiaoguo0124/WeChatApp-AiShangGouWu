// pages/auth/index.js
import {request} from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
import {login} from "../../utils/asyncWx.js";

Page({
  async handleGetUserInfo(e){
    try {
      // 获取用户信息
      const { encryptedData,rawData,iv,signatrue }=e.detail;
      // 获取小程序登录成功后的 code
      const {code} =await login();
      const loginParams={encryptedData,rawData,iv,signatrue,code};
      // 发送请求 获取用户的token
      const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
      // token存入缓存 并跳转回上 1 页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
      
      
  }
})