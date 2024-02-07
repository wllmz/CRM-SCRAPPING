module.exports = (server) => {
    const ModuleController = require("../controllers/ModuleController");
    const jwtverifytoken = require("../middleware/jwtMiddleware");

    server.route("/modules")
        .get(jwtverifytoken.verifyToken, ModuleController.listAllModules)
        .post(jwtverifytoken.verifyToken, ModuleController.createModule);

    server.route("/modules/:moduleId")
        .delete(jwtverifytoken.verifyToken, ModuleController.deleteModule)
        .put(jwtverifytoken.verifyToken, ModuleController.updateModule)
        .get(jwtverifytoken.verifyToken, ModuleController.getModuleById);
}
