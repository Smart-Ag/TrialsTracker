var React = require('react');
var Baobab = require('baobab');
var branch = require('baobab-react/mixins').branch;
var _ = require('lodash');
require('./sorting-tabs.css');

var _TabsBar = React.createClass({
  mixins: [branch],
  
  cursors: {
    sortMode: ['view', 'sort_mode'],
  },

  onClick: function(mode) {
    this.cursors.sortMode.set(mode);
    this.context.tree.commit(); 
  },

  render: function() {
    return (
      <div className="sorting-tabs">
      <button type="button" className="tab-button" onClick={this.onClick.bind(null, 'all')}>
        All
      </button>
      <button type="button" className="tab-button" onClick={this.onClick.bind(null, 'fields')}>
        Fields
      </button>
      <button type="button" className="tab-button" onClick={this.onClick.bind(null, 'tags')}>
        Tags
      </button> 
      </div>
    );
  },
});
module.exports = _TabsBar;
