(function(){
    'use strict';

    var finderResults = false;

    var cloudRecognition =  new craftar.CloudRecognition({
        token: 'catchoomcooldemo'
    });

    cloudRecognition.addListener('results', function(err, response, xhr){
        if (response.results && response.results.length > 0) {
            renderResults( response );
            finderResults = true;
            cloudRecognition.stopFinder();
        }
    });

    cloudRecognition.addListener('finderFinished', function(){
        var spinnerElement = document.getElementById('spinner');
        spinnerElement.setAttribute("class", "spinner hidden");
        if (!finderResults) {
            alert("No results found, point to an object.");
        }
    });

    function init(){

        var scanButton = document.querySelector( '#scan1' );
        var spinnerElement = document.getElementById('spinner');

        if ( craftar.supportsCapture() ){

            setupCapture(function( err, captureObject ){

                if ( err ){

                    alert( 'there was an error initilizating the camera ( no device present? )' )

                }else{

                    var captureDivElement = document.getElementById( 'videoCapture' );
                    captureDivElement.appendChild( captureObject.domElement );

                    scanButton.addEventListener( 'click', function(){
                        spinnerElement.setAttribute("class", "spinner");

                        finderResults = false;
                        cloudRecognition.startFinder( captureObject, 2000, 3 );
                    });
                }

            });

        }else{

            alert("This browser don't support HTML5 features needed for the capture mode");

        }

    };


    function renderResults( results ){
        var resultItem = results.results[0];

        var template = document.getElementById("resultTemplate");
        var resultsElement = document.getElementById( 'resultList' );
        var spinnerElement = document.getElementById('spinner');

        var itemHTML =  Handlebars.compile(template.innerHTML);

        var resultEl = document.createElement('div');
        resultEl.innerHTML = itemHTML({thumbnailUrl: resultItem.image.thumb_120, itemUrl: resultItem.item.url, itemName: resultItem.item.name});
        resultsElement.insertBefore(resultEl, resultsElement.firstChild);
        spinnerElement.setAttribute("class", "spinner hidden");
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
