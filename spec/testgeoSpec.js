
var frisby = require('frisby');
//Data    addProperty(2, '1301 2nd Ave', 'Seattle', 'WA', '98101', -122.338134, 47.607828, 'http://x.lnimg.com/photo/poster_768/edebe0efa14749c385f1f12bbb906d21 .jpg');

frisby.create('GET JSON data by long/lat')
  .get('https://nodejs02webapp-digitalcode.c9users.io/api/getBylatlon/-122.338134/47.607828')
  .expectStatus(200)
  .expectBodyContains("-122.338134,47.607828")
.toss();

//Data -   addProperty(5, '3750 18th St', 'San Francisco', 'CA', '94114', -122.427315, 37.761717, 'http://www.sfusd.edu/assets/sfusd­staff/schools­and­facilities/image s/mission­high­school­470.jpg');

frisby.create('GET JSON data  by long/lat')
  .get('https://nodejs02webapp-digitalcode.c9users.io/api/getBylatlon/-122.427315/37.761717')
  .expectStatus(200)
  .expectBodyContains("3750 18th St")
.toss();


//Data-  addProperty(2, '1 Telegraph Hill Blvd', 'San Francisco', 'CA', '94133', -122.405823, 37.802378, 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Coit_Tower_aeria l.jpg');


frisby.create('GET JSON data  by address')
  .get('https://nodejs02webapp-digitalcode.c9users.io/api/getZillow/1 Telegraph Hill Blvd')
  .expectStatus(200)
  .expectBodyContains("3750 18th St")
.toss();


//Data - addProperty(2, '7000 Coliseum Way', 'Oakland', 'CA', '94621', -122.202609, 37.750268, 'http://www.theuntz.com/media/member/6/6/1/66146/oco­coliseum_raw.jpg');

//Looks like by address has issue
frisby.create('GET JSON data  by address using ')
  .get('https://nodejs02webapp-digitalcode.c9users.io/api/getZillow/7000 Coliseum Way')
  .expectStatus(200)
  .expectBodyContains("3750 18th St")
.toss();



frisby.create('GET JSON data  by long/lat')
  .get('https://nodejs02webapp-digitalcode.c9users.io/api/getBylatlon/-122.202609/37.750268')
  .expectStatus(200)
  .expectBodyContains("7000 Coliseum Way")
.toss();



