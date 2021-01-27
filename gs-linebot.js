//PropertiesService
//https://developers.google.com/apps-script/reference/properties
var userProperties = PropertiesService.getUserProperties();

//輸入網址時,這個APP做出的回應.
//https://script.google.com/macros/s/AKfycbwATYacmpDVG83mV_o66IN7EkVlHhfUzQdZGx5WOuieR-0s3GI/exec?t=36.3
//https://script.google.com/macros/s/AKfycbwBUriNIHp1ny_DnoDmxqbzabuI4mIyDF3wi9zad1lGIZXv-Po/exec?t=36.3
//注意網址最後有加?t=36.3,代表我們呼叫上方的WebAPP且傳入t=36.3的參數.
//這個由瀏覽器,輸入網址讓WebApp回應的動作,都要在doGet中定義
function doGet(e){
  var temperature = e.parameter.t;
  if (!temperature) {
    return;
  }

  var nowDatetime = new Date().toLocaleString();
  userProperties.setProperty('temperatureText', nowDatetime  + "的溫度是 " + temperature + " 度");
  
  var returnText = temperature + " OK";
  var textOutput = ContentService.createTextOutput(returnText)
  return textOutput;
}

function doPost(e) {
  var msg = JSON.parse(e.postData.contents);
  console.log();
  // 取出 replyToken 和使用者送出的訊息文字
  var replyToken = msg.events[0].replyToken;
  var userMessage = msg.events[0].message.text;

  if (typeof replyToken === 'undefined') {
    return;
  }

  if (typeof keyWords === 'undefined') {
    //雖然是在if區塊中,宣告keyWords變數,但js仍視為全域變數
    var keyWords = ["溫度", "幾度", "熱不熱"];
  }
  else {
    keyWords = keyWords.concat(["溫度", "幾度", "熱不熱"]);
  }
  
  var returnText;
  var hasKeyword = false;
  
  //判斷Line傳來的訊息有沒有符合關鍵字
  if (userMessage) {
    for (var i = 0; i < keyWords.length; i++) {
      if (userMessage.indexOf(keyWords[i]) !== -1) {
        hasKeyword = true;
        break;
      }
    }
  }
  
  if (hasKeyword) {
    var temperatureText = userProperties.getProperty('temperatureText');
    if (temperatureText) {
      returnText =  temperatureText;
    }
    else {
      returnText = "抱歉我無法取得溫度";
    }
  }
  else {
    returnText = getMisunderstandWords();
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


function getMisunderstandWords() {
  var _misunderstandWords = [
    "不好意思，我無法理解您的需求",
    "再說明白一點好嗎？我只是一個不太懂事的 baby 機器人",
    "我不懂您的意思，抱歉我會加強訓練的"
  ];
  
  if (typeof misunderstandWords === 'undefined') {
    var misunderstandWords = _misunderstandWords;
  }
  else {
    misunderstandWords = misunderstandWords.concat(_misunderstandWords);
  }
  
  return misunderstandWords[Math.floor(Math.random()*misunderstandWords.length)];
}