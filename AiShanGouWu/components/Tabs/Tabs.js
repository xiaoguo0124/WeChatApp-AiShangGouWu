// components/Tabs/Tabs.js
Component({
  /*组件的属性列表*/
  properties: {
    // 接收父元素传来的数据
    tabs:{
      type:Array,
      value:[]
    }
  },
  data: {

  },
  // 组件的方法列表
  methods: {
    handleItemTap(e){
      const {index}=e.currentTarget.dataset;
      // 触发父组件中的事件
      this.triggerEvent("tabsItemChange",{index});
    }
  }
})
