import { Aside } from "../../components/aside";
import { ChatContainer } from "../../components/chat-container";
import { PanelContainer } from "../../components/panel-container";
import "./index.css";

// 主页
export const MainPage = () => {
  return (
    <div className="main-page">
      <Aside></Aside>
      <PanelContainer></PanelContainer>
      <ChatContainer></ChatContainer>
    </div>
  );
};
