import { FC, useState } from "react";
import classnames from "classnames";
import { getPath, getViewBox } from "./svg-dict";
import "./index.css";

export const SvgImg = ({ type, size = 25, canHover = false, onClick, className, style, color }) => {
  const cls = classnames("svg-img", `icon-${type}`, {
    "can-hover": canHover,
    [`${className}`]: !!className,
  });
  return (
    <svg
      className={cls}
      width={size}
      height={size}
      viewBox={getViewBox(type)}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      onClick={onClick}
      style={style}
    >
      {getPath(type, { className: type, color })}
    </svg>
  );
};

export const SvgIcon = ({
  type,
  hoverType,
  size = 25,
  canHover = false,
  onClick,
  className,
  style,
  color,
}) => {
  const [hovering, setHovering] = useState(false) ;
  const t = canHover && hovering && hoverType ? hoverType : type;
  const cls = classnames("svg-img", `icon-${t}`, {
    "can-hover": canHover,
    [`${className}`]: !!className,
  });
  return (
    <div
      style={{ display: "flex" }}
      onMouseEnter={() => canHover && setHovering(true)}
      onMouseLeave={() => canHover && setHovering(false)}
    >
      <svg
        className={cls}
        width={size}
        height={size}
        viewBox={getViewBox(t)}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        onClick={onClick}
        style={style}
      >
        {getPath(t, { className: t, color })}
      </svg>
    </div>
  );
};
