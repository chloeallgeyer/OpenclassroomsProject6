const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    delete req.body.id;
    const sauce = new Sauce({
      // utilisation de l'opérateur spread ... qui copie tous les éléments de req.body
      ...req.body
    })
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    Sauce.updateOne({ id: req.params.id }, { ...req.body, id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce supprimée'}))
    .catch(error => res.status(400).json({ error }));
};

exports.findOneSauce = (req, res, next) => {
    Sauce.findOne({ id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.findAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};