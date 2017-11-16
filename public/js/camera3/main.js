
/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/


'use strict';

var videoElement = document.querySelector('video');
// var audioInputSelect = document.querySelector('select#audioSource');
// var audioOutputSelect = document.querySelector('select#audioOutput');
var videoSelect = document.querySelector('select#videoSource');
var selectors = [videoSelect];
//var selectors = [audioInputSelect, audioOutputSelect, videoSelect];
var init = true

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  var values = selectors.map(function(select) {
    return select.value;
  });
  selectors.forEach(function(select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  var cnt = 1
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    // if (deviceInfo.kind === 'audioinput') {
    //   option.text = deviceInfo.label ||
    //       'microphone ' + (audioInputSelect.length + 1);
    //   audioInputSelect.appendChild(option);
    // } else if (deviceInfo.kind === 'audiooutput') {
    //   option.text = deviceInfo.label || 'speaker ' +
    //       (audioOutputSelect.length + 1);
    //   audioOutputSelect.appendChild(option);
    // } else
    if (deviceInfo.kind === 'videoinput') {
      //option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
      option.id = "camera_" + cnt;
      option.text = 'Camera ' + cnt++;
      option.value = deviceInfo.deviceId;
      videoSelect.appendChild(option);
      console.log('video info: ', deviceInfo)
    } else {
      //console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  selectors.forEach(function(select, selectorIndex) {
    if (Array.prototype.slice.call(select.childNodes).some(function(n) {
      return n.value === values[selectorIndex];
    })) {
      select.value = values[selectorIndex];
    }
  });

  if( init ){
    var id = $("#camera_2").val()
    if( id != undefined ){
      $("#videoSource").val(id).change()
    } else {
      start()
    }
    init = false
  }
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== 'undefined') {
    element.setSinkId(sinkId)
    .then(function() {
      console.log('Success, audio output device attached: ' + sinkId);
    })
    .catch(function(error) {
      var errorMessage = error;
      if (error.name === 'SecurityError') {
        errorMessage = 'You need to use HTTPS for selecting audio output ' +
            'device: ' + error;
      }
      console.error(errorMessage);
      // Jump back to first output device in the list as it's the default.
      //audioOutputSelect.selectedIndex = 0;
    });
  } else {
    console.warn('Browser does not support output device selection.');
  }
}

// function changeAudioDestination() {
//   var audioDestination = audioOutputSelect.value;
//   attachSinkId(videoElement, audioDestination);
// }

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  //var audioSource = audioInputSelect.value;
  var videoSource = videoSelect.value;
  console.log("videoSource : ", videoSource)
  var constraints = {
  //  audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).
      then(gotStream).then(gotDevices).catch(handleError);
}

//audioInputSelect.onchange = start;
//audioOutputSelect.onchange = changeAudioDestination;
videoSelect.onchange = start;

console.log("start : ", start)
//start();

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

var canvas = document.getElementById('canvas');
// console.log( "js - canvas : ", canvas )
var context = canvas.getContext('2d');

console.log( "context : ", context )

var video = document.getElementById('video');
// console.log( "js - video : ", video )
var th = 20
// 17.10.06 14:40 아무래도 여기가 비코드 스캔하여 값을 만드는 곳일 듯. 나머지는 내가 수정할 필요가 없고, 여기가 핵심이 될것 같다라는 생각.
// 기존 며칠간 한 것 처럼, JSON 파일에 저장되던 DB를 모두 MONGODB로 바꾸고, 일부 필요한 것은 추가(예를들어 로그인)하고, 이부분의 스캔 형태를 사각형이 아닌
//그리고 사각형의 한 변의 크기보다 작은 지름을 갖는 사이즈의 원의 형태를 갖도록 하여 스캔확룰을 보다 높이는(아마도 높아질 것이라 예측) 것이 10월 20일 전후 까지의 목표
function findPosition(){
  console.log("context:", video.videoHeight)
  console.log("context:", video.videoWidth)

  context.drawImage(video, 160+th, 240+th, 160-th*2, 160-th*2, 0, 0, 150, 150);

  var imageData = context.getImageData(0, 0, 150, 150);
  var data = imageData.data;

  var sum_array = [[0,0,0],[0,0,0],[0,0,0]]

  for(var i = 0; i < data.length; i += 4) {
    var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    // red
    data[i] = brightness;
    // green
    data[i + 1] = brightness;
    // blue
    data[i + 2] = brightness;

    if( (i/4)%150 < 50 ){
      var y = 0
    } else if( (i/4)%150 < 100 ){
      var y = 1
    } else {
      var y = 2
    }

    if( (i/4)/150 < 50 ){
      var x = 0
    } else if( (i/4)/150 < 100 ){
      var x = 1
    } else {
      var x = 2
    }

    sum_array[x][y] = sum_array[x][y] + brightness
  }

  var new_array = []
  var new_array_01 = []
  var sum = 0
  for(var i=0; i< sum_array.length; i++){
    new_array = new_array.concat(sum_array[i])
  }
  for(var i=0; i< new_array.length; i++){
    sum = sum + new_array[i]
  }
  var avg = sum / 9
  var s = ''
  for(var i=0; i< new_array.length; i++){
    new_array[i] = Math.round((new_array[i] / avg)*100)
    if( new_array[i] < 100 ){
      new_array_01[i] = 1
      s=s+'1'
    } else {
      new_array_01[i] = 0
      s=s+'0'
    }
  }
  var k = []; // 배열의 구분자를 , 넣고 싶을때 k를 사용, 배열의 구분자를 사용하고 싶지 않을 때 s를 사용
  for( var i=0; i<s.length; i++ ){
    k[i] = s.charAt(i);
    console.log("s.length : ", s.length)
    console.log("k :" , k)
  }
  //console.log(new_array)
  $("#tempOutput").text(new_array)
  $("#tempOutput2").text(k)
  //$("#tempOutput3").text(s)
  //$("#tempOutput3").val(this.text(s))  //test -   bCODE 171002
  $("#bcode").val(k) //완전 뻘짓 많이 했는데, 결국 form의 input에 값을 넣는 방법은 매우 간단, 단순했다. ㅠ
//171006 15:15 이 아래의 코드가 현재 스캔한 비코드 값이 기존에 저장된 DB에 존재하는지 여부를 확인하고 있을 경우 해당 데이터의 링크로 이동하는 코드인 듯.
k = [1,1,1,1,1,1,1,1,1]
 var posts ={}
 console.log("posts : ",posts)

 //console.log("postsAll main.js Test : ", postsAll);
 for( var i=0; i < posts.length; i++){
   console.log("posts[i].bcode : ", posts[i].bcode, "이고, k : " );

   if(posts[i].bcode == k){
     function page_replace() {
    location.replace("posts[i].link");
    }
   }
  }

  // $.ajax({
  //     type: "GET",
  //     url: '/find?bcode='+s,
  //     success:function(data){
  //       if( data ){
  //         window.location = data.link
  //       }
  //     }
  //   });
}

document.getElementById("snap").addEventListener("click", function() {
  findPosition()
  bcodeScan()

});

document.getElementById("video").addEventListener("click", function() {
	findPosition()
});


//video와 snap은 scan div로 묶여 있음
$(document).ready(function(){
  $("#video").click(function(){
    $("#scan").hide();
    $("#view").show();
  });
});

$(document).ready(function(){
  $("#snap").click(function(){
    $("#scan").hide();
    $("#view").show();
  });
});


$(document).ready(function(){
  $("#canvas").click(function(){
    $("#view").hide();
    $("#scan").show();
  });
});


$(document).ready(function(){
  $("#backToScan").click(function(){
    $("#view").hide();
    $("#scan").show();
  });
});

$(document).ready(function(){
  $("#setButton").click(function(){ // myboxVideo -> mybox
    $("#setButton").hide();
    $("#scan").hide();
    $("#set").show();
    $("#scanButton").show();
    $("#view").hide();
    exChage2()
  });
});


$(document).ready(function(){
  $("#scanButton").click(function(){ // mybox -> myboxVideo
    $("#scanButton").hide();
    $("#set").hide();
    $("#setButton").show();
    $("#scan").show();
    $("#view").hide();
    exChage();
  });
});


$(document).ready(function(){
  $("#backToScan").click(function(){
    $("#view").hide();
    $("#scan").show();
  });
});

/*$(document).ready(function(){
  $("#tile1").click(function(){
    var color = document.getElementById("tile1").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile1").style.background = "white"
      document.getElementById("tile11").style.background = document.getElementById("tile1").style.background
    } else {
      document.getElementById("tile1").style.background = "black"
      document.getElementById("tile11").style.background = document.getElementById("tile1").style.background
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile2").click(function(){
    var color = document.getElementById("tile2").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile2").style.background = "white"
      document.getElementById("tile22").style.background = "white"
    } else {
      document.getElementById("tile2").style.background = "black"
      document.getElementById("tile22").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile3").click(function(){
    var color = document.getElementById("tile3").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile3").style.background = "white"
      document.getElementById("tile33").style.background = "white"
    } else {
      document.getElementById("tile3").style.background = "black"
      document.getElementById("tile33").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile4").click(function(){
    var color = document.getElementById("tile4").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile4").style.background = "white"
      document.getElementById("tile44").style.background = "white"
    } else {
      document.getElementById("tile4").style.background = "black"
      document.getElementById("tile44").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile5").click(function(){
    var color = document.getElementById("tile5").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile5").style.background = "white"
      document.getElementById("tile55").style.background = "white"
    } else {
      document.getElementById("tile5").style.background = "black"
      document.getElementById("tile55").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile6").click(function(){
    var color = document.getElementById("tile6").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile6").style.background = "white"
      document.getElementById("tile66").style.background = "white"
    } else {
      document.getElementById("tile6").style.background = "black"
      document.getElementById("tile66").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile7").click(function(){
    var color = document.getElementById("tile7").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile7").style.background = "white"
      document.getElementById("tile77").style.background = "white"
    } else {
      document.getElementById("tile7").style.background = "black"
      document.getElementById("tile77").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile8").click(function(){
    var color = document.getElementById("tile8").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile8").style.background = "white"
      document.getElementById("tile88").style.background = "white"
    } else {
      document.getElementById("tile8").style.background = "black"
      document.getElementById("tile88").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile9").click(function(){
    var color = document.getElementById("tile9").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile9").style.background = "white"
      document.getElementById("tile99").style.background = "white"
    } else {
      document.getElementById("tile9").style.background = "black"
      document.getElementById("tile99").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile11").click(function(){
    var color = document.getElementById("tile11").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile11").style.background = "white"
      document.getElementById("tile1").style.background = "white"
      } else {
      document.getElementById("tile11").style.background = "black"
      document.getElementById("tile1").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile22").click(function(){
    var color = document.getElementById("tile22").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile22").style.background = "white"
      document.getElementById("tile2").style.background = "white"
      } else {
      document.getElementById("tile22").style.background = "black"
      document.getElementById("tile2").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile33").click(function(){
    var color = document.getElementById("tile33").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile33").style.background = "white"
      document.getElementById("tile3").style.background = "white"
      } else {
      document.getElementById("tile33").style.background = "black"
      document.getElementById("tile3").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile44").click(function(){
    var color = document.getElementById("tile44").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile44").style.background = "white"
      document.getElementById("tile4").style.background = "white"
      } else {
      document.getElementById("tile44").style.background = "black"
      document.getElementById("tile4").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile55").click(function(){
    var color = document.getElementById("tile55").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile55").style.background = "white"
      document.getElementById("tile5").style.background = "white"
      } else {
      document.getElementById("tile55").style.background = "black"
      document.getElementById("tile5").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile66").click(function(){
    var color = document.getElementById("tile66").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile66").style.background = "white"
      document.getElementById("tile6").style.background = "white"
    } else {
      document.getElementById("tile66").style.background = "black"
      document.getElementById("tile6").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile77").click(function(){
    var color = document.getElementById("tile77").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile77").style.background = "white"
      document.getElementById("tile7").style.background = "white"
    } else {
      document.getElementById("tile77").style.background = "black"
      document.getElementById("tile7").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile88").click(function(){
    var color = document.getElementById("tile88").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile88").style.background = "white"
      document.getElementById("tile8").style.background = "white"
    } else {
      document.getElementById("tile88").style.background = "black"
      document.getElementById("tile8").style.background = "black"
    }valSum()
  });valSum()
});

$(document).ready(function(){
  $("#tile99").click(function(){
    var color = document.getElementById("tile99").style.background
    console.log("color: ", color)
    if (color == "black"){
      document.getElementById("tile99").style.background = "white"
      document.getElementById("tile9").style.background = "white"
    } else {
      document.getElementById("tile99").style.background = "black"
      document.getElementById("tile9").style.background = "black"

    }valSum()
  });valSum()
});*/


$(document).ready(function(){
  $(".myboxVideo").click(function(){
    if($(this).css('background-color') == 'rgb(255, 255, 255)')  {
      var str = $(this).css('background-color','black')
    } else {
      $(this).css('background-color','white')
    }

  //  valSum()
    valSumVideo()
    })
})

$(document).ready(function(){
  $(".mybox").click(function(){
    if($(this).css('background-color') == 'rgb(255, 255, 255)')  {$(this).css('background-color','black')
  } else {
    $(this).css('background-color','white')
  }
    valSum()
//  valSumVideo()
})
})


function valSumVideo(){
  var a=[]
  var cnt=0

  $('.myboxVideo').each(function(){
    if($(this).css('background-color') == 'rgb(255, 255, 255)'){
      a[cnt] = 0
    } else {
      a[cnt] = 1
    }
    cnt++
  })
  console.log("valSumVideo : a[3] :", a[3])
  $("#bcode").val(a)

  console.log("valSumVideo a : ", a)
  return a;

}

function valSum(){
  var a=[]
  var cnt=0
  var s=''

  $('.mybox').each(function(){
    if($(this).css('background-color') == 'rgb(255, 255, 255)'){
      a[cnt] = 0
      s=s+'0'
    } else {
      a[cnt] = 1
      s=s+'1'
    }
    cnt++
  })

  $("#bcode").val(a)

  console.log("valSum a 1 : ", a)
  return s;

}


function exChage(){
  var a=[]
  var b=[]
  var cnt=0
  $('.mybox').each(function(){
    if($(this).css('background-color') == 'rgb(255, 255, 255)'){
      a[cnt] = 0
    } else {
      a[cnt] = 1
    }
    cnt++
  })
  cnt=0
   $('.myboxVideo').each(function(){
     if(a[cnt] == 0){
       $(this).css('background-color','white')
     } else {
       $(this).css('background-color','black')
     }
     cnt++
   })
 }


 function exChage2(){
   var a=[]
   var b=[]
   var cnt=0
   $('.myboxVideo').each(function(){
     if($(this).css('background-color') == 'rgb(255, 255, 255)'){
       a[cnt] = 0
     } else {
       a[cnt] = 1
     }
     cnt++
   })
   cnt=0
    $('.mybox').each(function(){
      if(a[cnt] == 0){
        $(this).css('background-color','white')
      } else {
        $(this).css('background-color','black')
      }
      cnt++
    })
  }

/*if(document.getElementById("tile1").style.background == "black") a[0] =1
if(document.getElementById("tile2").style.background == "black") a[1] =1
if(document.getElementById("tile3").style.background == "black") a[2] =1
if(document.getElementById("tile4").style.background == "black") a[3] =1
if(document.getElementById("tile5").style.background == "black") a[4] =1
if(document.getElementById("tile6").style.background == "black") a[5] =1
if(document.getElementById("tile7").style.background == "black") a[6] =1
if(document.getElementById("tile8").style.background == "black") a[7] =1
if(document.getElementById("tile9").style.background == "black") a[8] =1

if(document.getElementById("tile1").style.background == "white") a[0] =0
if(document.getElementById("tile2").style.background == "white") a[1] =0
if(document.getElementById("tile3").style.background == "white") a[2] =0
if(document.getElementById("tile4").style.background == "white") a[3] =0
if(document.getElementById("tile5").style.background == "white") a[4] =0
if(document.getElementById("tile6").style.background == "white") a[5] =0
if(document.getElementById("tile7").style.background == "white") a[6] =0
if(document.getElementById("tile8").style.background == "white") a[7] =0
if(document.getElementById("tile9").style.background == "white") a[8] =0*/





//시작하면서 숨길 요쇼들 - 1.스캔화면, 2.스캔버튼, 이후 세팅버튼 누르면 스캔버튼 생기고,세팅화면은 스대로 남아있고, 세팅버튼 사라짐, 이후 스캔버튼 누르면, 세팅화면 사라지고 스캔화면으로 변하고, 스캔버튼 사라짐
window.onload = function(){
$("#setButton").hide();
$("#view").hide();
$("#scan").hide();

};


document.getElementById("audioSource").style.display = 'none';
document.getElementById("audioOutput").style.display = 'none';
