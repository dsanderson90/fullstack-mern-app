const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute = 'mongodb+srv://admin:abcd1234@cluster0-myg00.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database!!'));

//  checks if connection w/ the database is successful

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging
// bodyParser parsed the request body to be a readable JSON format.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

//  READ
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if(err) return res.json({ success: false, error: err});
    return res.json({ sucess: true, data: data});
  });
});

//  UPDATE
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, (err) => {
    if(err) return res.json({ success: false, error: err});
    return res.json({ success: true });
  });
});

//  DELETE
router.delete('deleteData', (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if(err) return res.send(err);
    return res.json({ success: true});
  });
});

// CREATE
router.post('/postData', (req, res) => {
  let data = new Data();

  const { id, msg } = req.body;

  if ((!id && id !== 0 ) || !msg) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.msg = msg;
  data.id = id;
  data.save((err) => {
    if(err) return res.json({ success: false, error: err});
    return res.json({ sucess: true });
  });
});

app.use('/api', router);

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT} :)`))