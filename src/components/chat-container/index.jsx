import './index.css'
import { FC, useState } from 'react'
import { SvgImg } from '../svg-img'
import VideoContainer from '../video-call'
import { agoraRTCManager } from '../../utils/rtc'
import { IMManager } from '../../utils/im'
import { useDispatch } from 'react-redux'
import { saveMessage } from '../../redux/chat'
import { useSelector } from 'react-redux'

const manager = IMManager.getInstance()

export const ChatContainer = () => {
  const userProfile = ''
  const name = 'Byrom Guittet'

  const AGORA_APP_ID = 'c224c383433a4cd0b6aec36cb2e606f0'
  const AGORA_TOKEN = ''
  const roomId = ''

  const [calling, setCalling] = useState(false)
  const [videoCalling, setVideoCalling] = useState(false)
  const [msg, setMsg] = useState('')
  const dispatch = useDispatch()
  const { userName } = useSelector((store) => store.session)
  let { channelId } = useSelector((store) => store.chat)

  // TODO: need work (qinzhen)
  channelId = '1111'

  // TODO: need work (lijuan)
  // 做个消息面板的ui
  // 如果 from === userName 证明是发出去的消息 显示在右边
  // 如果 from !== userName 证明是收到的消息 显示在左边
  const messages = [
    { from: 'xxx', to: 'yyy', msg: '我是内容12313' },
    { from: 'xxx', to: 'yyy', msg: '我是内容4747' },
    { from: 'yyy', to: 'xxx', msg: '我是内容1254' },
  ]

  const onClickChatAudio = () => {
    setCalling(true) // 不应该加在这里，应该加在被呼叫方 监听到被呼叫消息回调时展示
  }

  const onClickChatVideo = async () => {
    setVideoCalling(true)
    try {
      await agoraRTCManager.join(AGORA_APP_ID, roomId, AGORA_TOKEN)
      agoraRTCManager.on('user-published', async (user, mediaType) => {
        await agoraRTCManager.subscribe(user, mediaType)
      })
      agoraRTCManager.on('user-unpublished', async (user, mediaType) => {
        await agoraRTCManager.unsubscribe(user, mediaType)
      })
      await agoraRTCManager.publish()
    } catch (err) {
      alert(err.message)
      await agoraRTCManager.leave()
      throw err
    }
  }

  const onClickChatMore = () => {
    console.log('onClickChatMore')
  }

  const onClickCalling = () => {
    setCalling(false)
  }

  const onClickCancel = () => {
    setCalling(false)
  }

  const onClickSendMsg = async () => {
    // const res = await manager.sendText({
    //   msg,
    //   to: "ascfa",
    //   chatType: "singleChat",
    // });

    // const res = await manager.sendText({
    //   msg,
    //   to: '185336537874433',
    //   chatType: 'groupChat',
    // })

    // dispatch(
    //   saveMessage(
    //     {
    //       form: "",
    //       to: res.to,
    //       id: res.id,
    //       msg: msg,
    //     },
    //     { isHistory: false }
    //   )
    // );
    // clear
    setMsg('')
  }

  return (
    <section className="chat-container">
      <div className="chat-header">
        <div className="left-box">
          <SvgImg className="user-icon" type={userProfile}></SvgImg>
          {channelId ? <span className="uesr-name">{name}</span> : null}
        </div>
        <div className="right-box">
          {channelId && (
            <div className="call-box" onClick={onClickChatAudio}>
              <SvgImg className="call-icon" type="chat-call"></SvgImg>
            </div>
          )}
          {channelId && (
            <div className="call-box" onClick={onClickChatVideo}>
              <SvgImg className="call-icon" type="video-call"></SvgImg>
            </div>
          )}
          <div className="call-box" onClick={onClickChatMore}>
            <SvgImg className="call-icon" type="circle-more"></SvgImg>
          </div>
        </div>
      </div>
      <div className="chat-content"></div>
      {channelId && (
        <div className="chat-footer">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Message"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <div className="send-box" onClick={onClickSendMsg}>
            <SvgImg className="send-msg" type="send-msg"></SvgImg>
          </div>
        </div>
      )}
      {calling && (
        <div className="call-card">
          <span className="text">Calling</span>
          <div className="action-button">
            <button type="button" className="btn" onClick={onClickCancel}>
              cancel
            </button>
            <button type="button" className="btn" onClick={onClickCalling}>
              calling
            </button>
          </div>
        </div>
      )}
      {videoCalling && (
        <div className="video-area">
          <VideoContainer></VideoContainer>
        </div>
      )}
    </section>
  )
}
