# Meeting

An example of a chat room with audio and video.
（agora rtc sdk + easemob-websdk）

# Run Dev
rename `.env.example` to `.env` , and configure the following parameters.

Start Development
```bash
npm run dev
```


# Build Prod
```bash
npm run build
```

功能清单:
* 前端项目架子
* 环信im sdk 和 agora rtc sdk 接入
* ui layout
* 登录页面相关
* Messages 面板 （获取会话列表 点击进入聊天）
* Attendees 面板 （添加好友 获取我的好友 好友邀请 接受添加好友 点击进入单聊）
* Joined Chatrooms 面板 （获取我的群组 点击进入群聊）
* All Chat Rooms 面板  （获取所有群组 创建群组 点击加入群组） （点击是自动加入群组 并不需要群管理员审核）
* 聊天面板 （单聊 群聊）
* 漫游消息
* 历史消息
* 音视频相关 （calling对方  1v1音视频接通渲染  1 v more音视频接通渲染）
* 前端env环境配置
* 前端build打包流程





# TIP

* useId 最好不要大小写混合 （建议采用全小写字母+数字）
* agora rtc 音视频最多支持同时发17路流 （建议从设计上规避很多人同时发流 or 咨询声网技术支持）