const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
      // utilisation de l'opérateur spread ... qui copie tous les éléments de req.body
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getSauceById = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const sauceNotation = {
        likes: 0,
        dislikes: 0,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked
      }
      switch (like) {
        case 1: // L'utilisateur like la sauce
          sauceNotation.usersLiked.push(req.body.userId);
          break;
        case 0: // L'utilisateur annule sa notation ( like ou dislike )
          if (sauceNotation.usersLiked.includes(req.body.userId)) {
            const index = sauceNotation.usersLiked.indexOf(req.body.userId);
            sauceNotation.usersLiked.splice(index, 1);
          } else {
            const index = sauceNotation.usersDisliked.indexOf(req.body.userId);
            sauceNotation.usersDisliked.splice(index, 1);
          };
          break;
        case -1: // L'utilisateur dislike la sauce
          sauceNotation.usersDisliked.push(req.body.userId);
          break;
      };
      sauceNotation.likes = sauceNotation.usersLiked.length;
      sauceNotation.dislikes = sauceNotation.usersDisliked.length;
      Sauce.updateOne({ _id: req.params.id }, sauceNotation)
        .then(() => res.status(200).json({ message: 'sauce notée'}))
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
