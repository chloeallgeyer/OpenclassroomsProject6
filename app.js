// déclaration de la constante express et utilisation de la commande require pour importer express
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Sauce = require('./models/Sauce');

mongoose.connect('mongodb+srv://new-user-2020:admin2020@cluster0.xfzyn.mongodb.net/SoPekocko?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.post('/api/sauces', (req, res, next) => {
  delete req.body._id;
  const sauce = new Sauce({
    // utilisation de l'opérateur spread ... qui copie tous les éléments de req.body
    ...req.body
  })
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée'}))
    .catch(error => res.status(400).json({ error }));
});

app.put('/api/sauces/:id', (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
  .catch(error => res.status(400).json({ error }));
});

app.delete('/api/sauces/:id', (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Sauce supprimée'}))
  .catch(error => res.status(400).json({ error }));

});

app.get('/api/sauces/:id', (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
})

app.get('/api/sauces', (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
})

module.exports = app;