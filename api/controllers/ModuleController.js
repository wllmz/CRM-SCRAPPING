const Module = require("../models/ModuleModel");


exports.listAllModules = async(req, res) => {
    try {
        const Modules = await Module.find({});
        res.status(200);
        res.json(Modules);

    } catch (error) {
        res.status(500);
        console.log(error);
        res.json({ message: "Erreur serveur." })
    }
}

exports.createModule = async (req, res) => {
    try {
        const newModule = new Module(req.body);
        const module = await newModule.save();
        
        // Renvoyer une réponse de succès avec le post créé
        res.status(201).json(module);
    } catch (error) {
        // Gérer les erreurs survenues lors de la création du post
        res.status(500).send({ message: 'Error creating post' });
    }

}

exports.deleteModule = async (req, res) => {
    try {
        const result = await Module.deleteOne({ _id: req.params.moduleId });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Post non trouvé" });
        } else {
            res.status(200).json({ message: "Post supprimé avec succès" });
        }
    } catch (error) {
        res.status(500);
        console.log(error);
        res.json({ message: "Erreur serveur." });
    }
};

exports.updateModule = async (req, res) => {
    try {
        const updatedModule = await Module.findByIdAndUpdate(
            req.params.moduleId,
            req.body,
            { new: true } 
        );

        if (!updatedModule) {
            res.status(404).json({ message: "Post non trouvé" });
        } else {
            res.status(200).json(updatedModule);
        }
    } catch (error) {
        res.status(500);
        console.log(error);
        res.json({ message: "Erreur serveur." });
    }
};

exports.getModuleById = async (req, res) => {
    try {
        const module = await Module.findById(req.params.moduleId);
        if (!module) {
            return res.status(404).json({ message: "Post non trouvé" });
        }
        res.json(module);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur." });
    }
};