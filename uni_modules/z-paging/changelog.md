## 2.3.4（2022-07-31）
1.使用聊天记录时，触摸列表默认自动隐藏键盘；优化聊天记录模式demo。  
2.renderjs与js数据交互修改为通过classList交互，以避免不同页面z-paging renderjs数据与组件数据不一致的问题，从而解决使用页面滚动模式时，有概率出现的列表无法滚动的问题。  
3.修复使用`completeByTotal`时，在调用`refresh`后，是否有更多数据判断出现错误的问题。  
4.修复在动态隐藏`slot="left"`时，布局未更新的问题。  
5.修复在nvue中，在弹窗中使用`z-paging`时`slot="top"`错位的问题。  
