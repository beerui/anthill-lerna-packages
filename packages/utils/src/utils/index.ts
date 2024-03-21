import EchartsAction from "./EchartsAction";

/**
 * 下载文件
 * @param data 二进制文件流
 * @param fileName 文件名称
 */
function DownloadBlobFile(data: string, fileName: string) {
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const link = window.document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([data]));
    link.style.display = 'none';
    link.download = decodeURIComponent(fileName);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  } else {
    // IE10+下载
    (window.navigator as any).msSaveBlob(new Blob([data]), fileName);
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * 生成一个用不重复的ID
 * @param { Number } randomLength
 */
function getUuiD(randomLength = 6) {
  return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36);
}

export * from './date';
export {
  EchartsAction,
  getUuiD,
  getRandomNumber,
  DownloadBlobFile
}
