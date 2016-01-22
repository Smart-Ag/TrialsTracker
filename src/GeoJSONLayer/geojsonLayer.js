var React = require('react');
var L = require('leaflet');
var Baobab = require('baobab');
var branch = require('baobab-react/mixins').branch;
require('./geojsonLayer.css');

var marker;

var GeoJSONLayer = React.createClass({
  mixins: [branch], 

  previouslyLayer: null,   // layer group

  currentLayer: null,	

  render: function() {
    if (this.props.map === null) {
      return;
    }
    if (this.previouslyLayer!==null){
      this.map.removeLayer(previouslyLayer);
      this.previouslyLayer = null;
    };
    var geojsonFeature = {
      "type": "Feature",
      "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
      }
    };
    console.log('geoj');
    L.geoJson(this.props.geojson).addTo(this.props.map);
    //L.geoJson(geojsonFeature).addTo(this.props.map);
	
    return (
      <div>
      </div>
    );
  }
});
module.exports = GeoJSONLayer;
