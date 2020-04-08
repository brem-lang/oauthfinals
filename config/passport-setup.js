const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20');
const GitHubStrategy = require('passport-github').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');
const passport = require('passport');

passport.serializeUser((user, done)=>{
    done(null, user.id); // A piece of info and save it to cookies
});

// passport.deserializeUser((id, done)=>{
//     //Who's id is this?
//     User.query(`SELECT "oauth".findById(${id})`,(err,res)=>{
//         if(err){
//             console.log(id);
//             console.log(err);
//         }else{
//             console.log(res.rows[0]);
//             const user = res.rows[0].row_to_json.user;     
//             done(null, user); 
//         }        
//     });
// });
passport.deserializeUser((id, done)=>{
    //Who's id is this?
    User.query(`select row_to_json (u) from ( SELECT "oauth".findById(${id}) as user) u;`,(err,res)=>{
        if(err){
            console.log(err);
        }else{                        
            const user = res.rows[0].row_to_json.user;
            console.log(">>>> deserializeUser >>>>> ",user);
            done(null, user); 
        }        
    });
});

passport.use( 
    new GoogleStrategy(
    {
        // options for the google strat
        callbackURL: '/auth/google/callback',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, 
    (accessToken, refreshToken, profile, done)=>
    {
        User.query(
            `CALL "oauth".insert_when_unique(${profile.id}, '${profile.displayName}', '${profile.photos[0].value}')`,
            (err,res)=>
            {
                 const _user = 
                 {
                            id: profile.id,
                            name: profile.displayName,                                
                            picture: profile.photos[0].value
                 };

                if (err) 
                {
                     const currentUser = _user;
                    done(null, currentUser);
                }
                else
                {
                     const newUser = _user;
                    done(null, newUser);
                }
            }
        );
    })
);

passport.use(
    new GitHubStrategy(
    {
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret,
        callbackURL: "/auth/github/callback"
    },
    (accessToken, refreshToken, profile, cb) => 
    {
             User.query(
            `CALL "oauth".insert_when_unique('${profile.id}', '${profile.username}', '${profile.photos[0].value}')`,
            (err,res)=>
            {
                 const _user = 
                 {
                            id: profile.id,
                            name: profile.displayName,                              
                            picture: profile.photos[0].value
                 };

                if (err) 
                {
                     const currentUser = _user;
                    cb(null, currentUser);
                }
                else
                {
                     const newUser = _user;
                    cb(null, newUser);
                }
            }
        );
    }
)
);

passport.use(
    new SpotifyStrategy(
      {
        clientID: keys.spotify.clientID,
        clientSecret: keys.spotify.clientSecret,
        callbackURL: '/auth/spotify/callback'
      },
      (accessToken, refreshToken, expires_in, profile, done) =>
      {

              let image=profile._json.images;
              if (image.length>0) 
              {
                  image=profile._json.images.url;
              }
              else
              {
                  image='https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png';
              }

              var x;
              var str = "";
              var temp = profile.id;
              for(var i=0;i<temp.length;i++){
                  var x = temp.charCodeAt(i);
                  str += x;
              }
              
              var xd = parseInt(str);
              console.log(xd);
              User.query(
              `CALL "oauth".insert_when_unique(${xd}, '${profile.displayName}', '${image}')`,
              (err,res)=>
              {
                   const _user = 
                   {
                              id: xd,
                              name: profile.displayName,                              
                              picture: image
                   };

                  if (err) 
                  {
                       const currentUser = _user;
                       done(null, currentUser);
                  }
                  else
                  {
                       const newUser = _user;
                      done(null, newUser);
                  }
              });
      }
));

passport.use(
    new FacebookStrategy(
    {
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'photos']
    },
   (accessToken, refreshToken, profile, cb) => 
   {   

        User.query(
            `CALL "oauth".insert_when_unique('${profile.id}', '${profile.displayName}', '${profile.photos[0].value}')`,
            (err,res)=>
            {
                 const _user = 
                 {
                            id: profile.id,
                            name: profile.displayName,                              
                            picture: profile.photos[0].value
                 };

                if (err) 
                {
                     const currentUser = _user;
                    cb(null, currentUser);
                }
                else
                {
                     const newUser = _user;
                    cb(null, newUser);
                }
            }
        );
   }
));