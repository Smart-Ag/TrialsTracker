var React = require('react');
var ReactDOM = require('react-dom');
var Baobab = require('baobab');
var root = require('baobab-react/mixins').root;
var App = require('./App.jsx');
var style = require('./reset.css'); 
var tree = require('./stateTree.js');
     
var Main = React.createClass({

  mixins: [root],
  
  render: function() {
    return (
      <div>
        <App className="app"/>
      </div>
    );
  }
});
ReactDOM.render(<Main tree={tree}/>,document.getElementById('app-container'));
