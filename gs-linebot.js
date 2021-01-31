var userProperties = PropertiesService.getUserProperties();
var nowDatetime = new Date().toLocaleString();

function doPost(e) {
  var msg = JSON.parse(e.postData.contents);
  console.log();
  // 取出 replyToken 和使用者送出的訊息文字
  var replyToken = msg.events[0].replyToken;
  var userMessage = msg.events[0].message.text;

  if (typeof replyToken === 'undefined') {
    return;
  }  
  
  var returnText = "";
 
  for(let x in msg.events[0]){
    returnText = returnText + x + ":" + msg.events[0][x] + "\n";
  }
  
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + accessToken.trim(),
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': returnText,
      }],
    }),
  });
}
