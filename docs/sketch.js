class GeoJSON {
  constructor(data) {
    this.features = data.features;
    print(this.features);
  }
  vis(map) {
    this.features.forEach(function(elm) {
      let canvasPos = map.latLngToPixel(elm.geometry.coordinates[1], elm.geometry.coordinates[0]);
      // Geopunkter fra geojson
      fill(255, 0, 0);
      ellipse(canvasPos.x, canvasPos.y, 10);

    })
  }
  clickedOn(x, y, map) {
    let navn = "Tryk på en af de røde cirkler på kortet."
    //let beskrivelse;
    this.features.forEach(function(elm) {
      let canvasPos = map.latLngToPixel(elm.geometry.coordinates[1], elm.geometry.coordinates[0]);
      if (dist(canvasPos.x, canvasPos.y, x, y) < 10) {
        //navn = "Bygning: " + elm.properties.navn
        //alert(elm.properties.navn);

        var spg = [{
          prompt: elm.properties.beskrivelse + "\n(a) Svar 1\n(b) Svar 2\n(c) Svar 3",
          svar: "a"
        }, {
          prompt: "Spørgsmål 2\n(a) Svar 1\n(b) Svar 2\n(c) Svar 3",
          svar: "b"
        }, {
          prompt: "Spørgsmål 3\n(a) Svar 1\n(b) Svar 2\n(c) Svar 3",
          svar: "c"
        }]
        var score = 0;

        for (var i = 0; i < spg.length; i++) {
          var respons = window.prompt(spg[i].prompt);
          if (respons == spg[i].answer) {
            score++;
            alert("Rigtigt svar!");
          } else {
            alert("Forkert");
          }
        }
        alert("Du har " + score + " ud af " + spg.length);
      }
    })
    return navn;
  } //clickedOn

} //class GeoJSON

let kortStatus = "ikkeKlar";
let statusP; //bruges til at infomere brugeren om status op appen
let geoJSON;
let gpsService;
let sidstePos;
let start_btn;

// Create an instance of Leaflet
const mappa = new Mappa('Leaflet');
let myMap;

let canvas

// callback for GeoJSON data
function modtagData(data) {
  statusP.html("Vent venligst ...");
  geoJSON = new GeoJSON(data);
}
// opdater prossesing canvas ting
function opdaterKort() {
  clear();
  if (sidstePos) {
    let canvasPos = myMap.latLngToPixel(sidstePos.latitude, sidstePos.longitude);
    // Brugeren lokalitet
    fill(0, 0, 255)
    ellipse(canvasPos.x, canvasPos.y, 10);
  }
  if (geoJSON) {
    geoJSON.vis(myMap);
  }
}
//callback når kortet er klart
function kortKlar() {
  kortStatus = "klar";
  myMap.onChange(opdaterKort);
}

// callback når der er GPS data /opret kort
function lavKort(pos) {
  const options = {
    lat: pos.latitude,
    lng: pos.longitude,
    zoom: 15,
    style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
  }
  myMap = mappa.tileMap(options);
  // Overlay the canvas to the new tile map created.
  myMap.overlay(canvas, kortKlar);
}
//callback for GPS data
function positionChanged(pos) {
  statusP.html("OK!");
  sidstePos = pos;
  if (myMap) {
    opdaterKort();
  } else if(start_btn == undefined) {
    start_btn = createButton("næste");
  //select("#velkommen_btn").hide();
  //select("#velkommen_btn").mousePressed(startApp);
  start_btn.mousePressed(startApp);
  }
}
function startApp(){
	select("#velkom").hide();
  select("#kort").show();
  lavKort(sidstePos);
}

function setup() {
  
  
  canvas = createCanvas(320, 320).parent("kort");
  select("#kort").hide();
  statusP = createP().html("Øjeblik").parent("#infoText");
  // henter geoJSON data
  let rucPunkterURL = "https://skattejagt.github.io/RUCskat/map.geojson"
  loadJSON(rucPunkterURL, modtagData);
  // henter GPS koordinater


  watchOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  gpsService = watchPosition(positionChanged, watchOptions)

}

function mouseClicked() {
  //ellipse(mouseX, mouseY, 5, 5);
  if (geoJSON) {
    statusP.html(geoJSON.clickedOn(mouseX, mouseY, myMap))
  }
  // prevent default
  return false;
}

function draw() {

}