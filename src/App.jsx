var React = require('react');
var NoteList = require('./NoteList/note-list.js');
var uuid = require('uuid');
var Baobab = require('baobab');
var branch = require('baobab-react/mixins').branch;
var _ = require('lodash');
var Map = require('./Map/map.js');
var TagsModal = require('./TagsModal/tags-modal.js');
require('./App.css');

var _App = React.createClass({
  mixins: [branch],
  
  getInitialState: function() {
    return {
    };
  },
  
  render: function() {
    var position = [38, -85.5];
    return ( 
      <div className="app">
        <NoteList/>
        <Map/>
      </div>
    );
  }
});
module.exports = _App;
