import websdk from "easemob-websdk";
import { EventEmitter } from "events";
import store from "../../redux";
import config from "./WebIMConfig";

const appKey = EASEMOB_APP_KEY;
const PREFIX = "[im] ";

const log = (str) => {
  console.log(PREFIX + str);
};

const logErr = (str) => {
  console.error(PREFIX + str);
};

let WebIM = window.WebIM || {};

export class IMManager extends EventEmitter {
  static _shared = null;
  inited = false;

  static getInstance() {
    if (!IMManager._shared) {
      IMManager._shared = new IMManager();
    }
    return IMManager._shared;
  }

  // 初始化
  init() {
    if (this.inited) {
      return false;
    }
    WebIM = window.WebIM || {};
    WebIM.config = config;

    let options = {
      appKey: WebIM.config.appkey,
      isHttpDNS: WebIM.config.isHttpDNS,
      isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
      https: WebIM.config.https,
      url: WebIM.config.socketServer,
      apiUrl: WebIM.config.restServer,
      isAutoLogin: WebIM.config.isAutoLogin,
      autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
      autoReconnectInterval: WebIM.config.autoReconnectInterval,
      delivery: WebIM.config.delivery,
      useOwnUploadFun: WebIM.config.useOwnUploadFun,
    };
    WebIM.conn = new websdk.connection(options);
    this.inited = true;
    this.listen();
  }

  listen() {
    WebIM.conn.listen({
      onOpened: function () {}, //连接成功回调
      onClosed: function () {}, //连接关闭回调
      onTextMessage: function (message) {}, //收到文本消息
      onEmojiMessage: function (message) {}, //收到表情消息
      onPictureMessage: function (message) {}, //收到图片消息
      onCmdMessage: function (message) {
        debugger;
      }, //收到命令消息
      onAudioMessage: function (message) {}, //收到音频消息
      onLocationMessage: function (message) {}, //收到位置消息
      onFileMessage: function (message) {}, //收到文件消息
      onCustomMessage: function (message) {}, //收到自定义消息
      onVideoMessage: function (message) {}, //收到视频消息
      onPresence: function (message) {}, //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
      onRoster: function (message) {}, //处理好友申请
      onInviteMessage: function (message) {}, //处理群组邀请
      onOnline: function () {}, //本机网络连接成功
      onOffline: function () {}, //本机网络掉线
      onError: function (message) {}, //失败回调
      onBlacklistUpdate: function (list) {
        //黑名单变动
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
      },
      onRecallMessage: function (message) {}, //收到撤回消息回调
      onReceivedMessage: function (message) {}, //收到消息送达服务器回执
      onDeliveredMessage: function (message) {}, //收到消息送达客户端回执
      onReadMessage: function (message) {}, //收到消息已读回执
      onCreateGroup: function (message) {}, //创建群组成功回执（需调用createGroupNew）
      onMutedMessage: function (message) {}, //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
      onChannelMessage: function (message) {}, //收到整个会话已读的回执，在对方发送channel ack时会在这个回调里收到消息
    });
  }

  // 注册用户
  register({ username, password }) {
    return new Promise((resolve, reject) => {
      var options = {
        username: username,
        password: password,
        nickname: "nickname",
        appKey: WebIM.config.appkey,
        success: function () {
          log("register success");
          resolve();
        },
        error: function (err) {
          let errorData = JSON.parse(err.data);
          if (errorData.error === "duplicate_unique_property_exists") {
            console.log("用户已存在！");
          } else if (errorData.error === "illegal_argument") {
            if (errorData.error_description === "USERNAME_TOO_LONG") {
              console.log("用户名超过64个字节！");
            } else {
              console.log("用户名不合法！");
            }
          } else if (errorData.error === "unauthorized") {
            console.log("注册失败，无权限！");
          } else if (errorData.error === "resource_limited") {
            console.log("您的App用户注册数量已达上限,请升级至企业版！");
          }
          reject();
        },
      };
      console.log(WebIM.conn);
      WebIM.conn.registerUser(options);
    });
  }

  // 登录
  login({ username, password }) {
    let potions = {
      user: username,
      pwd: password,
      appKey: WebIM.config.appkey,
    };
    return WebIM.conn.open(potions);
  }

  // 退出
  logout() {
    WebIM.conn.close();
  }

  // 发送命令消息
  sendCmdMessage({
    to = "", // 目标用户名
    action = "", // 行为
    gType, //判断消息类型是否为群组
  }) {
    return new Promise((resolve, reject) => {
      var id = WebIM.conn.getUniqueId();
      var message = new WebIM.message("cmd", id);
      message.set({
        to,
        action,
        // ext :{'extmsg':'extends messages'},    //用户自扩展的消息内容（群聊用法相同）
        success: function (id, serverMsgId) {
          console.log("发送命令消息成功", id, serverMsgId);
          resolve();
        },
        fail: function (err) {
          console.log("发送命令消息失败", err);
          reject(err);
        },
      });
      //判断消息类型是否为群组
      if (gType) {
        message.setGroup("groupchat");
      }
      WebIM.conn.send(message.body);
    });
  }

  // 查询好友列表
  getContacts() {
    return WebIM.conn.getContacts();
  }

  // 创建群组
  createGroupNew({ groupname, desc }) {
    let options = {
      data: {
        groupname, // 群组名
        desc, // 群组描述
        members: [], // 用户名组成的数组
        public: true, // pub等于true时，创建为公开群
        approval: false, // approval为true，加群需审批，为false时加群无需审批
        allowinvites: true, // true：允许群成员邀请人加入此群，false：只有群主才可以往群里加人 注意公开群（public：true),则不允许群成员邀请别人加入此群
        inviteNeedConfirm: false, // 邀请加群，被邀请人是否需要确认。true 为需要被邀请者同意才会进群
      },
    };
    return WebIM.conn.createGroupNew(options);
  }

  // 获取我的群组
  getMyGroup() {
    return WebIM.conn.getGroup();
  }

  // 分页获取公开群
  getPublicListGroups({ limit = 20, cursor = 0 }) {
    let options = {
      limit, // 预期每页获取的记录数
      cursor, // 游标
    };
    return WebIM.conn.listGroups(options);
  }
}

export default WebIM;
