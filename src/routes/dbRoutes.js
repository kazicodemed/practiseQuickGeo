var express = require("express");
var dbRouterfx = express.Router();
var mongodb = require('mongodb').MongoClient;

var Mkazimongo = (function() {
   //Database configuration
   var url = 'mongodb://localhost:27017/eventsApp';
   var mongoDbObj;
   mongodb.connect(url, function(err, db) {
      if (err)
         console.log(err);
      else {
         console.log("Connected to MongoDB");
         mongoDbObj = {
            db: db,
            events: db.collection('events')
         };
      }
   });


   //Model for taking dta
   var propertyModel = function(id, address, city, state, zip, long, lat, image_url) {
      return {
         id: id,
         address: address,
         city: city,
         state: state,
         zip: zip,
         image_url: image_url,
         loc: {
            type: "Point",
            coordinates: [long, lat]
         }
      };
   };

   var milesToRadian = function(miles) {
      var earthRadiusInMiles = 3959;
      return miles / earthRadiusInMiles;
   };
   var getQuery = function(long, lat, radius) {
      var query = {
         "loc": {
            $geoWithin: {
               $centerSphere: [
                  [long, lat], milesToRadian(radius)
               ]
            }
         }
      }
      return query;
   };


   var getCollection = function() {
      return mongoDbObj.events;
   }
   
   return {
      getCollection:getCollection,
      getQuery:getQuery,
      propertyModel:propertyModel

   }

})();


//Get by string address
dbRouterfx.route('/getZillow/:address')
   .get(function(req, res) {
      var collection = Mkazimongo.getCollection();
      var vaddress = req.params.address;
      console.log(vaddress);

      var landmark2 = collection.findOne({
         address: vaddress
      }, function(err, propertyItem) {
         if (err || propertyItem == null) {
            res.send('Ne test get');
         }
         else {
            var query = Mkazimongo.getQuery(propertyItem.loc.coordinates[0], propertyItem.loc.coordinates[1], 20); //Not doing hardcode on radius

            collection.find(query).toArray(function(err, results) {
               if (err) {
                  console.log(err);

               }
               else {
                  res.send(results);
               }
            });
         }

      });


   });


//By  Latitude & Longitude coordinates
dbRouterfx.route('/getBylatlon/:long/:lat')
   .get(function(req, res) {
      var collection = Mkazimongo.getCollection();

      var lon = parseFloat(req.params.long);
      var lat = parseFloat(req.params.lat);
      console.log("Lat " + lat + " long " + lon);
      var query = Mkazimongo.getQuery(lon, lat, 5);

      console.log(query);


      collection.find(query).toArray(function(err, results) {
         if (err) {
            console.log(err);
         }
         else {
            res.send(results);
         }
      });

   });

//Load sample data
dbRouterfx.route('/loadData')
   .post(function(req, res) {


      var collection = Mkazimongo.getCollection();

      /*Clearing up , should have wrote find is result false then insert*/
      collection.remove({}, function(err, numberRemoved) {
         if (err) {
            console.log("Error while removing");
         }
         else {
            console.log("inside remove call back" + numberRemoved);
         }
      });


      //Adding property
      var addProperty = function(name, id, address, city, state, zip, long, lat, image_url) {
         collection.insert(Mkazimongo.propertyModel(name, id, address, city, state, zip, long, lat, image_url));

      };
      //Sample Data 
      addProperty(1, '535 Mission St', 'San Francisco', 'CA', '94107', -122.98129, 37.788840, 'http://www.cbre.us/o/sanfrancisco/AssetLibrary/535Mission_thumb.jpg');

      addProperty(2, '1 Telegraph Hill Blvd', 'San Francisco', 'CA', '94133', -122.405823, 37.802378, 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Coit_Tower_aeria l.jpg');

      addProperty(4, '24 Willie Mays Plaza', 'San Francisco', 'CA', '94107', -122.390725, 37.778175, 'http://www.ballparksofbaseball.com/nl/pictures/2013/att13_top2.jpg');

      addProperty(5, '3750 18th St', 'San Francisco', 'CA', '94114', -122.427315, 37.761717, 'http://www.sfusd.edu/assets/sfusd­staff/schools­and­facilities/image s/mission­high­school­470.jpg');

      addProperty(6, '712 Steiner St', 'San Francisco', 'CA', '94117', -122.432684, 37.776128, 'http://www.towrs.com/Images/Building/System/2010/04/28/712SteinerStr eetSanFranciscoCalifornia082009001a.jpg');

      addProperty(2, '490 Jamestown Ave', 'San Francisco', 'CA', '94124', -122.386139, 37.713531, 'http://1.bp.blogspot.com/13fLlNoMJuM/UJWjMfNQzXI/AAAAAAAAC7c/2ybBK6 q14IM/s1600/Stadium_TheRock.jpg');

      addProperty(2, '1301 2nd Ave', 'Seattle', 'WA', '98101', -122.338134, 47.607828, 'http://x.lnimg.com/photo/poster_768/edebe0efa14749c385f1f12bbb906d21 .jpg');

      addProperty(2, '1401 N Shoreline Blvd', 'Mountain View', 'CA', '94043', -122.077321, 37.414323, 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Computer_history _museum.jpg' );

      addProperty(2, '7000 Coliseum Way', 'Oakland', 'CA', '94621', -122.202609, 37.750268, 'http://www.theuntz.com/media/member/6/6/1/66146/oco­coliseum_raw.jpg');

      // index to make it faster like mysql
      collection.ensureIndex({
         loc: "2dsphere"
      });


      res.status(201).json([{
         'msg': 'Sample data was loaded'
      }]);

   });





module.exports = dbRouterfx;