const jwt = require('jsonwebtoken');

// const verifyJWT = (req, res, next) => {
//   // get the header and check to see if there is an authorization section included in the header
//   let header = req.get('authorization'); // <<<-----does this need to be capitalized???

//   //check to make sure that you have something in the header
//   if(header){ //if there is
//     //split the header on its spaces
//     let parts = header.split(" ");
//     signedToken = parts[1];
//   };

//   //if the signedToken has parts in it, and is truthy
//   if(signedToken){
//     //verify using the jsonwebtoken library, that the web token is good
//     jwt.verify(signedToken, process.env.JWT_SECRET, (err, decoded)=>{
//       //if there is an error, process the error
//       if(err){
        
//       }
//     })
//   }

// };

const verifyJWT = (req, res, next) => {
  //get the token from the header
  let header = req.get('authorization'); //'Bearer+ space +token'

  //specifically access the token part
  let signedToken;
  if(header){
    let parts = header.split(' ');
    signedToken = parts[1];
  }

  //verify that the token is good
  if(signedToken){
    jwt.verify(signedToken, process.env.JWT_SECRET, function(err, decoded){
      if(err){
        console.log("");
        res.sendStatus(400);
      } else {
        next();
      }
    });
  } else {
    res.sendStatus(400);
  }
  //if the token is bad,
  //then return a status of 404

  //if the token is good
  //then do the regular controller stuff
}



/**add a function to check if user has appropriate role
 * teacher/admin
 * vs student or basic user
 */

module.exports = {
  verifyJWT
}
