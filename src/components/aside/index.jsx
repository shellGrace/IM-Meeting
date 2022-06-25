import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { SvgImg } from "../svg-img";
import { changeAsideItem } from "../../redux/ui";
import { IMManager } from "../../utils/im";
import "./index.css";

export const Aside = () => {
  const { asideItems } = useSelector((store) => store.ui);
  const dispatch = useDispatch();

  const onClick = (v) => {
    const newAsideItems = asideItems.map((item) => ({ ...item, active: item.id == v.id }));
    dispatch(changeAsideItem(newAsideItems));
  };

  const sendCmd = async () => {
    const manager = IMManager.getInstance();
    manager.sendCmdMessage({
      action: "api_call",
      to: "xxxasvdaasvcsvs",
    });
  };

  return (
    <section className="aside">
      <div className="aside-body">
        {asideItems.map((item) => (
          <div
            key={item.name}
            className={classnames("item", { active: item.active })}
            onClick={() => onClick(item)}
          >
            <SvgImg className="item-icon" type={item.svg}></SvgImg>
          </div>
        ))}
      </div>
      <div onClick={sendCmd}>sendCmd</div>
    </section>
  );
};
