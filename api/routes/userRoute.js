module.exports = (server) => {
    const userController = require("../controllers/userController");
  
    server.route("/register")
        .post(userController.register);

    server.route("/signin")
        .post(userController.userLogin);

}
