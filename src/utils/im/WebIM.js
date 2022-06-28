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
    console.log("===WebIM.conn", WebIM.conn);
    this.inited = true;
    this.listen();
  }

  listen() {
    let _this = this;
    WebIM.conn.listen({
      onOpened: function () {}, //连接成功回调
      onClosed: function () {}, //连接关闭回调
      onTextMessage: function (message) {
        // debugger;
      }, //收到文本消息
      onEmojiMessage: function (message) {}, //收到表情消息
      onPictureMessage: function (message) {}, //收到图片消息
      onCmdMessage: function (message) {
        console.log("cmd-message", message);
        _this.emit("cmd-message", message);
      }, //收到命令消息
      onAudioMessage: function (message) {}, //收到音频消息
      onLocationMessage: function (message) {}, //收到位置消息
      onFileMessage: function (message) {}, //收到文件消息
      onCustomMessage: function (message) {}, //收到自定义消息
      onVideoMessage: function (message) {}, //收到视频消息
      onPresence: function (message) {}, //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
      onRoster: function (message) {}, //处理好友申请
      onInviteMessage: function (message) {
        // debugger;
      }, //处理群组邀请
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
      onContactInvited: async function (message) {
        await _this.dealInvitation({
          accept: true,
          username: message.from,
        });
        _this.emit("onContactInvited", message);
      }, // 收到好友邀请
      onContactDeleted: function () {}, // 被删除时回调此方法
      onContactAdded: function () {}, // 增加了联系人时回调此方法
      onContactRefuse: function () {}, // 好友请求被拒绝
      onContactAgreed: function (message) {
        _this.emit("onContactAgreed", message);
      }, // 好友请求被同意
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

  // 发送文本消息
  sendText({
    msg = "",
    to = "",
    chatType = "singleChat", // singleChat |  groupChat
  }) {
    return new Promise((resolve, reject) => {
      var id = WebIM.conn.getUniqueId();
      var message = new WebIM.message("txt", id);
      let option = {
        msg, // 消息内容
        to, // 接收消息对象 (群组id) （用户id）
        chatType, // 群聊类型设置为群聊
        success: function (res) {
          resolve();
        }, // 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
        fail: function (e) {
          // 失败原因:
          // e.type === '603' 被拉黑
          // e.type === '605' 群组不存在
          // e.type === '602' 不在群组或聊天室中
          // e.type === '504' 撤回消息时超出撤回时间
          // e.type === '505' 未开通消息撤回
          // e.type === '506' 没有在群组或聊天室白名单
          // e.type === '501' 消息包含敏感词
          // e.type === '502' 被设置的自定义拦截捕获
          // e.type === '503' 未知错误
          console.error(e);
          reject(e);
        },
      };
      message.set(option);
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
  getPublicListGroups({ limit = 20, cursor = 0 } = {}) {
    let options = {
      limit, // 预期每页获取的记录数
      cursor, // 游标
    };
    return WebIM.conn.listGroups(options);
  }

  // 向群组发出入群申请
  joinGroup({ groupId = "", msg = "" }) {
    let options = {
      groupId: groupId, // 群组ID
      message: msg, // 请求信息
    };
    return WebIM.conn.joinGroup(options);
  }

  // 解散群组
  dissolveGroup({ groupId }) {
    let option = {
      groupId,
    };
    return WebIM.conn.dissolveGroup(option);
  }

  // 退出群组
  quitGroup({ groupId }) {
    let option = {
      groupId,
    };
    return WebIM.conn.quitGroup(option);
  }

  // 查询好友列表
  getRoster() {
    return WebIM.conn.getRoster();
  }

  // 添加好友
  addContact({
    username = "", // 用户名
    msg = "", // 消息
  }) {
    return WebIM.conn.addContact(username, msg);
  }

  // 删除好友
  deleteContact(username) {
    return WebIM.conn.deleteContact(username);
  }

  //  处理好友请求
  dealInvitation({
    accept, // 是否接受
    username, // 用户名
  }) {
    if (accept) {
      return WebIM.conn.acceptInvitation(username);
    } else {
      return WebIM.conn.declineInvitation(username);
    }
  }

  /**
   * 获取指定会话的历史消息。
   * @param {Object} options
   * @param {String} options.queue   - 对方用户 ID（用户 ID 只能包含小写字母）、群组 ID 或聊天室 ID。
   * @param {Number} options.count   - 每次拉取的消息条数。
   * @param {Boolean} options.isGroup - 是否是群聊：`true`：群聊；（默认）`false`: 单聊或聊天室。
   * @param {String} options.start - （可选）起始位置的消息 ID，默认从最新一条开始。
   * @param {Boolean} options.format - （可选）是否格式化返回格式, 默认为 `false` （4.0 新语法建议设置为 `true`）。
   */
  fetchHistoryMessages({ queue = "", isGroup = false, count = 50, format = true }) {
    var options = {
      queue, //需特别注意queue属性值为大小写字母混合，以及纯大写字母，会导致拉取漫游为空数组，因此注意将属性值装换为纯小写
      isGroup,
      count,
      format
    };
    return WebIM.conn.fetchHistoryMessages(options);
  }

  //   获取会话列表
  // 当和一个用户或者在一个群中发消息后，就会自动把对方加到会话列表中，可以通过调用getSessionList去查询会话列表。
  // 建议一个页面只需要在初始时调用一次。使用该功能需要联系您的商务经理进行开通。（您可以在环信通讯云管理后台首页，扫描二维码联系您的商务经理）
  // 特别注意：登陆ID不要为大小写混用的ID，拉取会话列表大小写ID混用会出现拉取会话列表为空。
  getSessionList() {
    return WebIM.conn.getSessionList();
    /**
    返回参数说明
    channel_infos - 所有会话
    channel_id - 会话id, username@easemob.com表示单聊，groupid@conference.easemob.com表示群聊
    meta - 最后一条消息
    unread_num - 当前会话的未读消息数
    
    data{
        channel_infos:[
            {
                channel_id: 'easemob-demo#chatdemoui_username@easemob.com',
                meta: {},
                unread_num: 0
            },
            {
                channel_id: 'easemob-demo#chatdemoui_93734273351681@conference.easemob.com',
                meta: {
                    from: "easemob-demo#chatdemoui_zdtest@easemob.com/webim_1610159114836",
                    id: "827197124377577640",
                    payload: "{"bodies":[{"msg":"1","type":"txt"}],"ext":{},"from":"zdtest","to":"93734273351681"}",
                    timestamp: 1610161638919,
                    to: "easemob-demo#chatdemoui_93734273351681@conference.easemob.com"
                },
                unread_num: 0
            }
        ]
    }
    */
  }

  // 删除会话
  deleteSession({ channel, chatType = "singleChat", deleteRoam = true } = {}) {
    WebIM.conn.deleteSession({
      channel, // 会话 ID（对方的 userID 或群组 ID）。
      chatType, // 会话类型 singleChat（单聊） groupChat（群聊）。
      deleteRoam: true, // 是否同时删除服务端漫游消息。
    });
  }
}

export default WebIM;
