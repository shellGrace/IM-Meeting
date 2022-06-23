import websdk from "easemob-websdk";
import { EventEmitter } from "events";
import config from "./WebIMConfig";

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

  initIMSDK(appkey) {
    if (this.inited) {
      return false;
    }
    WebIM = window.WebIM || {};
    WebIM.config = config;
    WebIM.config.appkey = appkey;

    let options = {
      isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
      isDebug: WebIM.config.isDebug,
      https: WebIM.config.https,
      isAutoLogin: false,
      heartBeatWait: WebIM.config.heartBeatWait,
      autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
      delivery: WebIM.config.delivery,
      appKey: appkey,
      useOwnUploadFun: WebIM.config.useOwnUploadFun,
      deviceId: WebIM.config.deviceId,
      //公有云 isHttpDNS 默认配置为true
      isHttpDNS: WebIM.config.isHttpDNS,
    };
    WebIM.conn = new websdk.connection(options);
    this.inited = true;
  }

  loginIM(appKey){
    const userUuid = store.getState().propsData.userUuid;
    const useLowerCaseUuid = userUuid ? userUuid.toLocaleLowerCase() : ''
    let potions = {
      user: useLowerCaseUuid,
      pwd: userUuid,
      appKey: appKey,
      success: () => {
        store.dispatch(userIDAction(useLowerCaseUuid));
      },
    };
    WebIM.conn.open(potions);
  };

}

export default WebIM;
