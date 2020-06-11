// Libraries
var socket = require("socket.io");
var jwt = require("jsonwebtoken");

var sockets = {};
let io;

// verify token
// const verifyToken = function (token) {
//     // check header or url parameters or post parameters for token
//     if (token !== undefined && token !== null && token !== '' && token !== 'undefined') {
//         // verifies secret and checks exp
//         return jwt.verify(token.replace(/['"]+/g, ''), app_constants.SECRET, function (err, decoded) {
//             if (err) {
//                 return false;
//             } else {
//                 return true;
//                 // if everything is good, save to request for use in other routes
//                 // ath = decoded;
//             }
//         });
//     } else {
//         return false;
//     }
// }

// const verifySession = async (user_id, sessionId, isWeb = false) => {
//     if (isWeb !== undefined && isWeb === true) {
//         return true;
//     }
//     var query = "SELECT id FROM users WHERE id=" + user_id;
//     let res = await sql.query(query);
//     if (res.length) {
//         return true;
//     } else {
//         return false;
//     }
// }
// const socketMiddleware = async (socket, next) => {
//     let token = socket.handshake.query.token;
//     // console.log("Token", verifyToken(token));
//     if (verifyToken(token)) {

//         let session_id = socket.id;

//         var user_id = null;

//         let isWeb = socket.handshake.query['isWeb'];

//         if (isWeb !== undefined && isWeb !== 'undefined' && (isWeb !== false || isWeb !== 'false') && (isWeb === true || isWeb === 'true')) {
//             isWeb = true;
//         } else {
//             isWeb = false;
//             user_id = socket.handshake.query['user_id'];
//         }

//         let sessionVerify = await verifySession(user_id, session_id, isWeb);
//         console.log("Session", sessionVerify);

//         if (user_id != undefined && user_id !== null && sessionVerify) {
//             console.log("mobile side: ", user_id);
//             next();
//         } else if (isWeb === true && sessionVerify) {
//             console.log("web side: ", isWeb);
//             next();
//         } else {
//             return next(new Error('Unauthorized'));
//         }

//     } else {
//         return next(new Error('Unauthorized'));
//     }
// }

sockets.listen = function (server) {
  io = socket();
  // ===============================================================================
  // io.of('/') is for middleware not for path
  // ===============================================================================
  io.listen(server);

  // middleware for socket incoming and outgoing requests
  // io.use(socketMiddleware);

  var allClients = [];

  io.sockets.on("connection", async function (socket) {
    allClients.push(socket);
    //socket.disconnect(true);
    //socket.join('user_id');

    let user_id = null;
    let session_id = socket.id;

    let isWeb = socket.handshake.query["isWeb"];
    if (
      isWeb !== undefined &&
      isWeb !== "undefined" &&
      (isWeb !== false || isWeb !== "false") &&
      (isWeb === true || isWeb === "true")
    ) {
      isWeb = true;
    } else {
      isWeb = false;
      user_id = socket.handshake.query["user_id"];
    }
    socket.join(user_id);
    console.log(
      "connection established on user_id: " +
        user_id +
        " and session_id: " +
        session_id
    );

    // console.log("Number of sockets: ",io.sockets.sockets);
    // check the number of sockets connected to server
    let users = io.engine.clientsCount;
    console.log("connected_users: " + users);

    if (user_id != undefined && user_id != null && isWeb === false) {
      console.log("on mobile side event");

      console.log("user_id: ", user_id);

      socket.on("placeOrder", (data) => {
        console.log(data);
        socket.broadcast.to(data.store).emit("order_for_store", data);
      });
    } else {
      console.log("web socket");
    }
    // ====================================================== Common Channels =====================================
    socket.on("disconnect", async () => {
      await console.log(
        "disconnected: session " + socket.id + " on user id: " + user_id
      );
      let updatedClients = allClients.filter((user) => {
        return user.handshake.query["user_id"] !== user_id;
      });
      allClients = updatedClients;
      console.log("connected_users: " + io.engine.clientsCount);
    });

    // socket.on(Constants.CONNECT_ERROR, (error) => {
    //     console.log("connection_error_occured: " + error);
    // });

    // socket.on(Constants.CONNECT_TIMEOUT, (timeout) => {
    //     console.log("connection_timeout: " + timeout);
    // });

    // socket.on('error', (error) => {
    //     console.log("error_occured: " + error);
    // });

    // socket.on(Constants.RECONNECT, (attemptNumber) => {
    //     console.log("reconnecting: " + attemptNumber);
    // });

    // socket.on(Constants.RECONNECT_ATTEMPT, (attemptNumber) => {
    //     console.log("reconnect_attempt: " + attemptNumber);
    // });

    // socket.on(Constants.RECONNECTING, (attemptNumber) => {
    //     console.log("reconnecting: " + attemptNumber);
    // });

    // socket.on(Constants.RECONNECT_ERROR, (error) => {
    //     console.log("reconnect_error: " + error);
    // });

    // socket.on(Constants.RECONNECT_FAILED, () => {
    //     console.log("reconnect_failed: ");
    // });

    // socket.on(Constants.PING, () => {
    //     console.log("ping: ");
    // });

    // socket.on(Constants.PONG, (latency) => {
    //     console.log("pong: " + latency);
    // });
  });

  return io;
};

module.exports = sockets;
