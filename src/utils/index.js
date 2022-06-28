import { ChatTypesEnum } from "../redux/chat";

export * from "./rtc";
export * from "./im";

export const getRandomStr = (number) => {
  let s = "abcdefghijklmnopqrstuvwxyz";
  let len = s.length;
  let res = "";
  for (let i = 0; i < number; i++) {
    res += s[Math.floor(Math.random() * len)];
  }
  return res;
};

// "huice#matadodo_yyy@easemob.com"  => yyy
// huice#matadodo_235425423@conference.easemob.com  => 235425423
export const getIdfromChannel = (str) => {
  let isGroup = /\@conference\.easemob\.com$/.test(str);
  let reg = "";
  if (isGroup) {
    reg = /\_(\S+)\@conference\.easemob\.com$/;
  } else {
    reg = /\_(\S+)\@easemob\.com$/;
  }
  const res = str.match(reg) || [];
  return res[1];
};

export const getChatTypefromChannel = (str) => {
  let isGroup = /\@conference\.easemob\.com$/.test(str);
  return isGroup ? ChatTypesEnum.GroupChat : ChatTypesEnum.SingleChat;
};

export const transformIdToChannel = ({ id = "", type = ChatTypesEnum.SingleChat }) => {
  const appkey = WebIM.config.appkey;
  let last = "";
  if (type == ChatTypesEnum.SingleChat) {
    last = id + "@easemob.com";
  } else {
    last = id + "@conference.easemob.com";
  }
  return appkey + "_" + last;
};

export const formatTime = (time) => {
  var date = new Date(time);
  var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return date.getFullYear() + "-" + month + "-" + currentDate + " " + hh + ":" + mm;
};

export const genChannelName = (name1, name2) => {
  let arr = [name1, name2];
  arr.sort((a, b) => a - b);
  return arr[0] + "_" + arr[1];
};
