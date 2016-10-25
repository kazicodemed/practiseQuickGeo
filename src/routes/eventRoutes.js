var express = require('express');

var eventRouter = express.Router();



var mongodb = require("mongodb").MongoClient;
 var bigData2;
eventRouter.route('/')
   .get(function(req,res){
     

      var url = 'mongodb://localhost:27017/eventsApp';
       mongodb.connect(url,function(err,db){
         var collection = db.collection('events');
         collection.find({}).toArray(function (err, result){
            
      bigData2 = result;
                     res.render('events',
   { 
      list: ['first event','Second event','Third event'],
      nav:  [
               {Link: 'Services', Text: 'Services'},
               {Link: 'Portfolio',Text: 'Portfolio'},
               {Link: 'Team',Text: 'Team'},
               {Link: 'About',Text: 'About'},
               {Link: 'Contact',Text: 'Contact'},
               {Link: 'Events',Text: 'Events'}
             ],
            events: bigData2
   }
   );        
         })
       });

   });
   eventRouter.route('/:id')
   .get(function(req,res){
       var id = req.params.id;
         res.render('event',
   { 
      list: ['first S event','Second eS vent','Third S event'],
      nav:  [
               {Link: 'Services', Text: 'Services'},
               {Link: 'Portfolio',Text: 'Portfolio'},
               {Link: 'Team',Text: 'Team'},
               {Link: 'About',Text: 'About'},
               {Link: 'Contact',Text: 'Contact'},
               {Link: 'Events',Text: 'Events'}
             ],
            events: bigData2[id]             
    }
        ); 
   });
   
module.exports = eventRouter;   