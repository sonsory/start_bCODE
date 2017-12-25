//public/js/camera3/main.js ver.171204//

/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/


'use strict';



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

/*
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
*/

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



window.onload = function(){
  //bcodeVal();
}

/*

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
