var React = require('react');
var ReactDOM = require('react-dom');
var Baobab = require('baobab');
var branch = require('baobab-react/mixins').branch;
var Map = require('react-leaflet').Map;
var TileLayer = require('react-leaflet').TileLayer;
var _ = require('lodash');
var uuid = require('uuid');
var GeoJSON = require('react-leaflet').GeoJson;
var Polygon = require('react-leaflet').Polygon;
var Menu = require('./menu-bar.js');
//var AddPolygonControl = require('./addPolygonButton.js');
require('./map.css');
import { render } from 'react-dom';

var _Map = React.createClass({
  mixins: [branch],

  cursors: function() {
    return {
      notes: ['model', 'notes'],
      selectedNote: ['model', 'selected_note'],
      map: ['view', 'map'],
    };
  },
 
  clicked: function(e) {
    console.log(e);
  },

  render: function() {
    var position = [40.3686,-87.0909];
    var geoJSONData = [];
    var self = this;
    _.each(this.state.notes, function(note) {
      console.log(note.color);
      geoJSONData.push(<GeoJSON onLeafletClick={self.clicked} data={note.geojson} color={note.color} key={uuid.v4()}/>);
    });
    return(
      <div id='map-panel'>
        <Menu />
        <Map center={position} zoom={13}>
          <TileLayer
            url='http://otile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png'
            attribution='Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
          />
          {geoJSONData}
        </Map> 
      </div>
    )
  },

});
module.exports= _Map;
