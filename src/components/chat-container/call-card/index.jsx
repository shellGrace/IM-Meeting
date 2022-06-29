import { CallTypeEnum } from "../index";
import "./index.css";

export const CallCard = ({ type, onCancel, onConfirm, show }) => {
  const onClickCancel = () => {
    onCancel && onCancel();
  };

  const onClickCalling = () => {
    onConfirm && onConfirm();
  };

  return show ? (
    <div className="call-card">
      <span className="text">{type === CallTypeEnum.Video ? "Video" : "Audio"} Calling</span>
      <div className="action-button">
        <button type="button" className="btn" onClick={onClickCancel}>
          cancel
        </button>
        <button type="button" className="btn" onClick={onClickCalling}>
          calling
        </button>
      </div>
    </div>
  ) : (
    <div></div>
  );
};
