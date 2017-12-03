(function(){
    'use strict';


    function init(){

        var scanButton = document.querySelector( '#scan1' );

        if ( craftar.supportsCapture() ){

            setupCapture(function( err, captureObject ){

                if ( err ){

                    alert( 'there was an error initilizating the camera ( no device present? )' )
                    console.log( "contextWidth : ", contextWidth )


                }else{

                    var captureDivElement = document.getElementById( 'videoCapture' );
                    //var canvas = document.getElementById('canvas');
                    // console.log( "js - canvas : ", canvas )
                    //var context = canvas.getContext('2d');
                    captureDivElement.appendChild( captureObject.domElement );
                    var contextWidth = captureDivElement.domElement.videoWidth;
                    var contextHeight = captureDivElement.domElement.videoHeight;
                    console.log( "contextWidth : ", contextWidth )
                    console.log( "contextHeight : ", contextHeight )
                    console.log( "captureDivElement : ", captureDivElement )




                }

            });

        }else{

            alert("This browser don't support HTML5 features needed for the capture mode");

        }

    };


    window.addEventListener("load", init, false);

    function setupCapture( callback ){

        var capture = new craftar.Capture();

        capture.addListener('started', function(){

            callback( null, capture );

        });

        capture.addListener('error', function( error ){

            callback( error, capture );

        });

        capture.start();

    }

})();
