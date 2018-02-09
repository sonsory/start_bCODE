//public/js/camera3/main.js ver.171204//

/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/



'use strict';


////171204
function init(){

    //var scanButton = document.querySelector( '#scan' );

    if ( craftar.supportsCapture() ){
        console.log("craftar.supportsCapture() : ", craftar.supportsCapture)
        setupCapture(function( err, captureObject ){


            if ( err ){

                alert( 'there was an error initilizating the camera ( no device present? )' )



            }else{

                var captureDivElement = document.getElementById( 'videoCapture' );
                //var canvas = document.getElementById('canvas');
                // console.log( "js - canvas : ", canvas )
                //var context = canvas.getContext('2d');
                //captureDivElement.appendChild( captureObject.domElement );
                var video = captureDivElement.appendChild( captureObject.domElement ); //이 부분이 추가되는 순간 느려짐, 위의 captureDivElement.appendChild( captureObject.domElement ); 대신 이부분만 남김 -> 문제 해결됨 171204
                //var contextHeight = captureDivElement.domElement.videoHeight;
                console.log( "captureDivElement: ", captureDivElement )
                console.log( "captureDivElement.domElement : ", video )
                video.setAttribute("id", "video"); //html 태그의 속성 추가, 수정하는 방법
                video.setAttribute("style", "margin:0 auto; width:1024px; max-width:100%; height:auto; position: relative; z-index: -3;border: 1px solid gold"); //width:141px; height:188px;"); //margin:0 auto; width:200px; height:270px; position: relative; z-index: -3;border: 1px solid gold  //margin:0 auto; width:200px; position: relative; z-index: -3  원본! 180130
                //여기서 width가 디바이스의 카메라 크기를 정하는 것, 최대가 1023, 그 이하일 경우, 디바이스의 화면크게이 맞춰서 100% 180208
                ////180209 width:1024px; max-width:100%; height:auto;
                    // 폰에서 촬영된 영상처럼 기준 잡기위해 - 가로 세로  height:480
                            //width:200px; height:270px;
                console.log("main.js init() captureObject : ", captureObject)
                console.log("main.js init() captureObject.domElement : ", captureObject.domElement)
                console.log("main.js init() captureObject.domElement.clientHeight : ", captureObject.domElement.clientHeight)
                console.log("main.js init() captureObject.domElement.clientWidth : ", captureObject.domElement.clientWidth)
              //틀린부분.180208  console.log("main.js init() captureObject.domElement.clientHeight : ", captureObject.domElement.style.Height)
                console.log("main.js init() captureObject.domElement.attributes : ", captureObject.domElement.attributes[0])
                console.log("main.js init() captureObject.domElement.style : ", captureObject.domElement.style)

                console.log("##### video width : ",video.clientWidth )
                console.log("##### video height : ",video.clientHeight )

////
                console.log( "video id : ", video.getAttribute("id") )
                console.log( "video style : ", video.getAttribute("style") )
                //console.log( "contextHeight : ", contextHeight )
                //console.log( "captureDivElement : ", captureDivElement )

                //업로드용 비코드 스캔부분 a의 값은 박스의 크기
                var a = 40
                var video1 = document.getElementById('video1')
                video1.setAttribute("style", "margin:0 auto;  top:25px; left: 197px; width:"+a+"px; height:"+a+"px;position: absolute; z-index: -1 ") //top의 기준은 video1 엘리먼트의 시작위치인듯.
                // 값 a가 달라지면, top등의 기준점이 달라짐 // 18.01.30 현재 a=25, left:163px; top:90px이 적당.


                function drawingRectangle(){ //171230
                  var ObjCanvas, ObjContext;
                  ObjCanvas = document.getElementById('video1');
                  ObjContext = ObjCanvas.getContext('2d');
                  ObjContext.fillStyle='white';
                  ObjContext.fillRect(0,0,400,200);  //앞의 두개는 시작점, 그 뒤의 두개는 칠하는 영역 가로 세로 인듯
                }

                drawingRectangle();





            }

        });

    }else{

        alert("This browser don't support HTML5 features needed for the capture mode");

    }

};




window.addEventListener("load", init, false);

function setupCapture( callback ){
console.log( "setupCapture : ", setupCapture )
    var capture = new craftar.Capture();

    capture.addListener('started', function(){

        callback( null, capture );

    });

    capture.addListener('error', function( error ){

        callback( error, capture );

    });

    capture.start();

    console.log("비디오 스트리밍 관련 콘솔에서 정보 보기 : setupCapture() 함수 안에서 capture: ", capture);

}

////171204 end

/* 171204 function findPosition(){ 안으로 옮김
var video = document.getElementById('video');
console.log("video : ", video);
*/



// console.log( "js - video : ", video )
var th = 0 //최초 50, 값을 조절해보니, th값이 작아지면, 스캔된 이미지 사이즈가 좀더 큰 이미지가 되는 듯. 171228
// 17.10.06 14:40 아무래도 여기가 비코드 스캔하여 값을 만드는 곳일 듯. 나머지는 내가 수정할 필요가 없고, 여기가 핵심이 될것 같다라는 생각.
// 기존 며칠간 한 것 처럼, JSON 파일에 저장되던 DB를 모두 MONGODB로 바꾸고, 일부 필요한 것은 추가(예를들어 로그인)하고, 이부분의 스캔 형태를 사각형이 아닌
//그리고 사각형의 한 변의 크기보다 작은 지름을 갖는 사이즈의 원의 형태를 갖도록 하여 스캔확룰을 보다 높이는(아마도 높아질 것이라 예측) 것이 10월 20일 전후 까지의 목표

function findPosition(){
  var canvas = document.getElementById('canvas'); //나중에 스캔이미지가 여기에 생김
  // console.log( "js - canvas : ", canvas )
  var context = canvas.getContext('2d');

  console.log( "context : ", context )

  var video = document.getElementById('video');
  console.log("video : ", video);
  console.log("findPosition() rrr videoHeight : ", video.videoHeight)
  console.log("findPosition()  videoWidth : ", video.videoWidth)
  console.log("findPosition() document.body.clientWidth: ", document.body.clientWidth)
  console.log("findPosition() document.body.clientHeight: ", document.body.clientHeigth)

      console.log("findPosition() video.clientWidth : ",video.clientWidth )
      console.log("findPosition() video.clientHeight : ",video.clientHeight )
  console.log("findPosition() window.outerWidth: ", window.outerWidth)
  console.log("findPosition() window.outerHeight: ", window.outerHeight)
  console.log("findPosition() window.innerWidth: ", window.innerWidth)
  console.log("findPosition() window.innerHeight: ", window.innerHeight)
  //video.videoHeight = window.innerWidth - window.innerWidth * 0.2
  //video.videoHeight = window.innerWidth - window.innerWidth * 0.2 //추후에는 가로세로 비율 계산해서 비율의 비로 줄게 만들것. -> 이 부분을 조절하면 스캔 되는 영역 등에 영향을 미치는 것 같음 171228



//context.drawImage(video, 160+th, 240+th, 160-th*2, 160-th*2, 0, 0, 150, 150); // 이것은 코드 스캔용으로 적당할 듯.
 //context.drawImage(video, 335+th, 501 +th, 450-th*2, 450-th*2, 0, 0, 480, 480); 18.02.08
  context.drawImage(video, 362+th, 560+th, 60-th*2, 60-th*2, 0, 0, 150, 150); //
  //sx 숫자를 크게 할 수록 가로로 움직인 이미지를 캡쳐한다(캡쳐틀은 고정되어 있고 이미지가 움직인다고 생각)
 // sy 숫자를 크게 할 수록 위로 움직인 이미지를 캡쳐한다.
                      //(소스, 클리핑 시작점x, 클리핑 시작점y, 소스의 x방향길이만큼 가져옴, 소스의 y방향길이 방향만큼 가져옴, 가져온 이미지의 새로운 x시작점 지정, 가져온 이미지의 새로운 y 시작점 지정, x방향 길이(배율조절됨), y 방향 길이(배율 조절됨) ... 배율조절 된다는게.. 내가쓴 글인데.. 뭔말..
                       //original 160+th, 240+th, 160-th*2, 160-th*2, 0, 0, 150, 150);
                      //context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
                      // img	     Specifies the image, canvas, or video element to use
                      // sx	      Optional. The x coordinate where to start clipping	Play it »
                      // sy	      Optional. The y coordinate where to start clipping	Play it »
                      // swidth	  Optional. The width of the clipped image	Play it »
                      // sheight	Optional. The height of the clipped image	Play it »
                      // x	      The x coordinate where to place the image on the canvas	Play it »
                      // y	      The y coordinate where to place the image on the canvas	Play it »
                      // width	  Optional. The width of the image to use (stretch or reduce the image)	Play it »
                      // height	  Optional. The height of the image to use (stretch or reduce the image)
                      // (video, 335+th, 501 +th, 40-th*2, 40-th*2, 0, 0, 150, 150)
  var imageData = context.getImageData(0, 0, 150, 150); // -original: context.getImageData(0, 0, 150, 150);
  console.log("public/js/main.js imageData = ", imageData);

/*
  //var afterImageData;

  cv.cvtColor(imageData, imageData, cv.COLOR_RGBA2GRAY, 0);
  // You can try more different parameters
  cv.adaptiveThreshold(imageData, afterImageData, 200, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 3, 2);

  var data = afterImageData.data;  */  //openCV 테스트 인듯. 180129

  var data = imageData.data;
    console.log("public/js/main.js imageData.data = ", imageData.data);
    console.log("public/js/main.js data = ", data.length);





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

    //이건 테스트용 start Test
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
      // end Test

  // $.ajax({   //김박사님 작
  //     type: "GET",
  //     url: '/find?bcode='+s,
  //     success:function(data){
  //       if( data ){
  //         window.location = data.link
  //       }
  //     }
  //   });
}


function wholeCapture(){
  var canvas = document.getElementById('canvasWholeCapture'); //나중에 스캔이미지가 여기에 생김
  // console.log( "js - canvas : ", canvas )
  var context = canvas.getContext('2d');
    canvas.setAttribute("height", video.clientHeight);
    canvas.setAttribute("width", video.clientWidth);
  console.log( "context : ", context )

  var video1 = document.getElementById('video');
  //context.scale(0.1, 0.1);
  console.log("##### video width : ",video.width )
  console.log("##### video height : ",video.height )
  console.log("##### canvas.width : ",canvas.width )
  console.log("##### canvas.height : ",canvas.height )
  console.log("wholeCapture() video.clientWidth : ",video.clientWidth )
  console.log("wholeCapture() video.clientHeight : ",video.clientHeight )

  /* 굳이 context.drawImage()를 쓸 필요가 없는 듯. 걍 canvas.toDataURL 로 하는 게 더 심플 한듯 180208
  아니... 해보니까.. 이것을 생략하면, 안되는데? */
  context.drawImage(video1, 0, 0, canvas.width, video.clientHeight);


   // source rectangle  canvas.width, canvas.height
   //(video, 0, 0, video.width,    video.height, 0,0,canvas.width, canvas.height) // 1205, 1015
   /*
  var imgURL = canvas.toDataURL("image/png");
  document.getElementById('canvasImg').src = imgURL;
  */
}

//파일다운로드  https://jsfiddle.net/AbdiasSoftware/7PRNN/   180208

/**
 * This is the function that will take care of image extracting and
 * setting proper filename for the download.
 * IMPORTANT: Call it from within a onclick event.
*/
function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}
/**
 * The event handler for the link's onclick event. We give THIS as a
 * parameter (=the link element), ID of the canvas and a filename.
*/
document.getElementById('download').addEventListener('click', function() {
    downloadCanvas(this, 'canvasWholeCapture', 'bcode.png');
}, false);

/**
 * Draw something to canvas
 */




document.getElementById("snap").addEventListener("click", function() {
  findPosition()
  isTherebcode() //이건 비코드 스캔후, 현재 저장된 비코드와 비교하는 함수, 비교후 일치하는 비코드 있으면 해당 URL로 이동
  wholeCapture()

});

document.getElementById("videoCapture").addEventListener("click", function() {
	findPosition()
});


//video와 snap은 scan div로 묶여 있음
/*
$(document).ready(function(){
  $("#videoCapture").click(function(){
    $("#scan").hide();
    $("#view").show();
  });
});
*/ //180130

$(document).ready(function(){
  $("#snap").click(function(){
    //$("#scan").hide();
    $("#view").show();
    $("#viewCapturedImg").show();
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
    $("#viewCapturedImg").hide();
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





//시작하면서 숨길 요쇼들 - 1.스캔화면, 2.스캔버튼, 이후 세팅버튼 누르면 스캔버튼 생기고,세팅화면은 그대로 남아있고, 세팅버튼 사라짐, 이후 스캔버튼 누르면, 세팅화면 사라지고 스캔화면으로 변하고, 스캔버튼 사라짐
window.onload = function(){
$("#view").hide(); //171225 시작하면서 뷰(스캔 후 보여져할 부분이 시작하면서 보였음) 부분 사라지게함
$("#scan").show(); //171225 시작하면서 스캔부분 보이게 함
$("#set").hide();

};


// 맨위로 올리기 버튼 180209
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

//토글 스위치 180209
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
