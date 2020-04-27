/*
 * @Author: your name
 * @Date: 2020-03-13 16:56:04
 * @LastEditTime: 2020-04-10 19:53:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-smartresume-master\src\utils\utils.js
 */
export const isNotNullORBlank = (...args) => {
  for (var i = 0; i < args.length; i++) {
    var argument = args[i];
    if (argument == null || argument == "" || argument == undefined) {
      return false;
    }
  }
  return true;
};

export const getuuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
};

//图片转base64
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    let fileResult = "";
    reader.readAsDataURL(file); //开始转
    reader.onload = function() {
      fileResult = reader.result;
    }; //转失败
    reader.onerror = function(error) {
      reject(error);
    }; //转结束  咱就 resolve 出去
    reader.onloadend = function() {
      resolve(fileResult);
    };
  });
};

// get请求拼接对象
export const concatGetUrl = (obj, url) => {
  url = url + "?";
  let initurl = url;
  //遍历整个对象
  for (let key in obj) {
    // 如果该项的obj不为空（等于0也可以），并且是第一个不为空的参数时，直接进行拼接，不用加&
    if ((url === initurl && obj[key]) || (url === initurl && obj[key] === 0)) {
      url = url + key + "=" + obj[key];
      // 如果该项的obj不为空（等于0也可以），但不是第一个不为空的参数时，加&进行拼接
    } else if (
      (url !== initurl && obj[key]) ||
      (url !== initurl && obj[key] === 0)
    ) {
      url = url + "&" + key + "=" + obj[key];
    }
  }
  return url;
};

// 时间格式化
export const formatDate = (date) => {
  var dateee = new Date(date).toJSON();
  return new Date(+new Date(dateee) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\.[\d]{3}Z/, "");
};

// 时间戳格式
export function formatdate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}
