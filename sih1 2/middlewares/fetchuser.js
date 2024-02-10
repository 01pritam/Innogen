// var jwt = require('jsonwebtoken');
// const JWT_SECRET = '1234';

// const fetchuser = (req, res, next) => {
//     // Get the user from the jwt token and add id to req object
//     const token = req.header('auth-token');
//     if (!token) {
//         res.status(401).send({ error: "Please authenticate using a valid token" })
//     }
//     try {
//         const data = jwt.verify(token, JWT_SECRET);
//         req.user = data.user;
//         next();
//     } catch (error) {
//         res.status(401).send({ error: "Please authenticate using a valid token" })
//     }

// }


// module.exports = fetchuser;
var jwt = require('jsonwebtoken');
const JWT_SECRET = '1234';

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    console.log(req.header('auth-token'))
    const token = req.header('auth-token');
    if (!token) {
        const error = new Error("Please authenticate using a valid token");
        return next(error); // Use next() to pass the error to the error handling middleware
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.userId;
        console.log(data)
        next();
    } catch (error) {
        next(error); // Pass the error to the Express error handling middleware
    }
}

module.exports = fetchuser;
