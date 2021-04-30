// 同时发送异步请求的次数
let ajaxTimes=0;
export const request=(params)=>{
  // 判断url中是否有/my/ 请求的是私有路径要带上header token
  let header={...params.header};
  if(params.url.includes("/my/")){
    header["Authorization"]=wx.getStorageSync("token");
  }

  ajaxTimes++;
  //显示‘加载中’效果
  wx.showLoading({
    title: '加载中',
    mask:true
  });
  // 定义公共的url
  const comUrl="https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url:comUrl+params.url,
      success: (result) => {
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        ajaxTimes--;
        if(ajaxTimes===0){
          //关闭‘加载中’图标
          wx.hideLoading();
        }
      }
    });
  })
}