import JSEncrypt from "jsencrypt"
const mc = '统一身份认证'
// 拱墅
const url = 'http://open.hzgsedu.cn/backend'
// 155的统一身份认证ty.tybd.91sst.com
// const url = 'http://ty.tybd.91sst.com/backend'

// 是否启用统一身份认证
const isCertified = true
export const getEncryptCode = (param) => {
    let public_key = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpu2kryFOuOBGUM40teBQC56y6MxsOLFefai8Omm6gbj3R3+opte7QztUupq5aHuUUzxPFqaURpCRW5JFvkEL7cQXT7/fW4j3yNSTUqkzE/22+7ou1AiQ0jFJUVNthuvOixkSW9iys+Tb0lpncp3/CUooNrjf86VIbPJEH2tnpswIDAQAB"

    let encryptParam = new JSEncrypt()
    encryptParam.setPublicKey(public_key)
    
    return encryptParam.encrypt(param.toString())
}
export default {
  // 导出
  dc: function (res,filename) {
      var blob = new Blob([res], {type:res.type}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
  　　var downloadElement = document.createElement('a');
  　　var href = window.URL.createObjectURL(blob); //创建下载的链接
  　　downloadElement.href = href;
  　　downloadElement.download = filename; //下载后文件名
  　　document.body.appendChild(downloadElement);
  　　downloadElement.click(); //点击下载
  　　document.body.removeChild(downloadElement); //下载完成移除元素
  　　window.URL.revokeObjectURL(href); //释放掉blob对
  },
  // 搜索标红
	KeyRegExp: function (val, keyword) {
		val = val + "";
		if (val.indexOf(keyword) !== -1 && keyword !== "") {
			var word = keyword.split('');
			var str ='';
			word.forEach(e=>{
				str = str + e.replace(new RegExp('\\' + e,("gm")),'\\' + e)
			})
			return val.replace(new RegExp(str, ("gm")),'<font color="#f00">' + keyword + "</font>")
		} else {
			return val;
		}
	},
  mc,
  url,
  isCertified
}
