import websdk from 'easemob-websdk'
import { EventEmitter } from 'events'
import store from '../../redux'
import config from './WebIMConfig'

const appKey = EASEMOB_APP_KEY
const PREFIX = '[im] '

const log = (str) => {
  console.log(PREFIX + str)
}

const logErr = (str) => {
  console.error(PREFIX + str)
}

let WebIM = window.WebIM || {}

export class IMManager extends EventEmitter {
  static _shared = null
  inited = false

  static getInstance() {
    if (!IMManager._shared) {
      IMManager._shared = new IMManager()
    }
    return IMManager._shared
  }

  // 初始化
  init() {
    if (this.inited) {
      return false
    }
    WebIM = window.WebIM || {}
    WebIM.config = config
    // WebIM.config.appkey = appKey

    let options = {
      appKey: WebIM.config.appkey,
      isHttpDNS: WebIM.config.isHttpDNS,
      isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
      host: WebIM.config.Host,
      https: WebIM.config.https,
      url: WebIM.config.xmppURL,
      apiUrl: WebIM.config.apiURL,
      isAutoLogin: false,
      heartBeatWait: WebIM.config.heartBeatWait,
      autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
      autoReconnectInterval: WebIM.config.autoReconnectInterval,
      isStropheLog: WebIM.config.isStropheLog,
      delivery: WebIM.config.delivery,
    }
    WebIM.conn = new websdk.connection(options)
    this.inited = true
  }

  // 注册用户
  register({ username, password }) {
    return new Promise((resolve, reject) => {
      var options = {
        username: username,
        password: password,
        nickname: 'nickname',
        appKey: WebIM.config.appkey,
        success: function () {
          log('register success')
          resolve()
        },
        error: function (err) {
          let errorData = JSON.parse(err.data)
          if (errorData.error === 'duplicate_unique_property_exists') {
            console.log('用户已存在！')
          } else if (errorData.error === 'illegal_argument') {
            if (errorData.error_description === 'USERNAME_TOO_LONG') {
              console.log('用户名超过64个字节！')
            } else {
              console.log('用户名不合法！')
            }
          } else if (errorData.error === 'unauthorized') {
            console.log('注册失败，无权限！')
          } else if (errorData.error === 'resource_limited') {
            console.log('您的App用户注册数量已达上限,请升级至企业版！')
          }
          reject()
        },
      }
      console.log(WebIM.conn)
      debugger
      WebIM.conn.registerUser(options)
    })
  }

  // 登录 im
  login({ username, password }) {
    // const useLowerCaseUuid = userId.toLocaleLowerCase()
    let potions = {
      user: username,
      pwd: password,
      appKey: appKey,
      success: () => {
        log('loginIM success')
      },
      error: () => {
        logErr('loginIM error')
      },
    }
    WebIM.conn.open(potions)
  }
}

export default WebIM
