import { IMManager } from '../../../utils/im'
import { useEffect, useState } from 'react'
import './index.css'
import { useDispatch } from 'react-redux'
import { startChar, CharTypesEnum } from '../../../redux/chat'
import { getRandomStr } from '../../../utils'

const manager = IMManager.getInstance()

export const PanelAttendees = () => {
  const [friends, setFriends] = useState([])
  const [friendName, setFriendName] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    getRoster()
    manager.on('onContactInvited', (message) => {
      // 收到好友邀请
      getRoster()
    })
    manager.on('onContactAgreed', (message) => {
      // 好友请求被同意
      getRoster()
    })
  }, [])

  const addContact = async () => {
    manager.addContact({
      username: friendName,
      msg: '请加我好友!',
    })
    await getRoster()
  }

  const getRoster = async () => {
    const data = (await manager.getRoster()).data || []
    setFriends(data)
  }

  const onClickStartChar = () => {
    // 开启单聊
    dispatch(
      startChar({
        channelId: getRandomStr(8),
        charType: CharTypesEnum.SingleChat,
      })
    )
  }

  return (
    <section className="attendees">
      <div>Attendees</div>
      <div className="item">
        <span onClick={addContact}>添加好友</span>
        <input
          className="input-wrapper"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
        ></input>
      </div>
      <div onClick={getRoster} className="item">
        获取我的好友
      </div>
      <section>
        {friends.map((item) => (
          <div key={item} className="group-item">
            <span onClick={onClickStartChar}>{item}</span>
          </div>
        ))}
      </section>
    </section>
  )
}
