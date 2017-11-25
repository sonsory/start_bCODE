// expose our config directly to our application using module.exports

module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleOAuth' : {
        "clientID":"1019465226439-vi3tcigl73e1r6784v0g4hjtqbu2nq2v.apps.googleusercontent.com",
        "project_id":"noncorp-bcode-000000",
        "auth_uri":"https://accounts.google.com/o/oauth2/auth",
        "token_uri":"https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
        "clientSecret":"wLJEpwbr378J1jLL3CKJ06GA",
        "callbackURL":"http://localhost:4000/auth/google/callback",
        "callbackURL2":"https://bcode-new.herokuapp.com/auth/google/callback"


    }

};
