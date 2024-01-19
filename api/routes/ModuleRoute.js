module.exports = (server) => {
    const ModuleController = require("../controllers/ModuleController");

    server.route("/modules")
        .get(ModuleController.listAllModules)
        .post(ModuleController.createModule);

    server.route("/modules/:moduleId")
        .delete(ModuleController.deleteModule)
        .put(ModuleController.updateModule)
        .get(ModuleController.getModuleById);
}
