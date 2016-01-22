var React = require('react');
var Route = require('react-router').Route;
var Main = require('./Main.jsx');
console.log("routes?");
module.exports = (
  <Route handler={Main} path="/" />
);
