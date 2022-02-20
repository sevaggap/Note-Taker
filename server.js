const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const { parse } = require('path');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json','utf8', (err,data) =>{
      if (err) {
          console.error(err);
      } else {
          const parsedData = JSON.parse(data);
          res.json(parsedData)
          
      }
    })
  });
  
  app.post('/api/notes', (req,res) => {
      console.log(req.body)
      const newNote = {
          title: req.body.title,
          text: req.body.text,
          id: uuid()
      }
  
      fs.readFile('./db/db.json', 'utf8', (err,data) => {
          if(err) {
              console.error(err);
          } else {
              const parsedNotes = JSON.parse(data);
              parsedNotes.push(newNote);
              fs.writeFile('./db/db.json', JSON.stringify(parsedNotes,null,4), (writeErr) => writeErr ? console.error(err) : console.info('Successfully updated Notes!')
              );
          }
      });
  
      fs.readFile('./db/db.json','utf8', (err,data) =>{
          if (err) {
              console.error(err);
          } else {
              const parsedData = JSON.parse(data);
              res.json(parsedData)
              
          }
        })
  }
  );  

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);