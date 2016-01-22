var React = require('react');
var Baobab = require('baobab');
var branch = require('baobab-react/mixins').branch;
var uuid = require('uuid');
var _ = require('lodash');
require('./tags-input.css');

var _TagsInput = React.createClass({

  mixins: [branch],

  cursors: function () {
    return {
      noteId: ['model', 'tags_modal', 'note_id'],
      completions: ['model', 'tags_modal', 'completions'],
      tags: ['model', 'tags'],
      visible: ['model', 'tags_modal', 'visible'],
      inputText: ['model', 'tags_modal', 'input_text'],
    };
  },

  addTag: function(tagText) {
    if (tagText === "") {
        return;
    }
    var tagCursor = this.context.tree.select('model', 'notes', this.state.noteId, 'tags', tagText);
    var tag = tagCursor.get();
    if (tag) {
      if (tag.action_if_done === 'remove') {
        console.log('readding existing tag');
        tagCursor.unset('action_if_done'); 
        console.log(tagCursor.get());
      } else {
      //TODO: it is already on the list!  throw an error!
      }
    } else {
      var tagsCursor = this.context.tree.select('model', 'notes', this.state.noteId, 'tags');
      tagsCursor.set(tagText, {text:tagText, action_if_done:'add'});
    }
    if (!_.includes(this.state.tags, tagText)) {
      this.cursors.tags.set(tagText, {text:tagText, references: 1});
    }
    this.cursors.inputText.set('');
    this.cursors.completions.set([]);
    this.context.tree.commit();
  },

  removeTag: function(tagText) {
    var tagCursor = this.context.tree.select('model', 'notes', this.state.noteId, 'tags', tagText);
    var tag = tagCursor.get();
    if (tag.action_if_done === 'add') {
      console.log('remove pending add');
      tagCursor.unset;
    } else {
      console.log('setting remove on an existing tag');
      tagCursor.set('action_if_done', 'remove');
    }
    this.context.tree.commit();
  },

  onChange: function(evt) {
    this.complete(evt.target.value);
    this.cursors.inputText.set(evt.target.value);
    this.context.tree.commit();
  },

  handleKeyDown: function(evt) {
    if (evt.keyCode == 13 || evt.keyCode == 9) {
      this.addTag(evt.target.value);
    }
  },

  complete: function (value) {
    if (!value || value === "") {
      this.cursors.completions.set([]);
      this.context.tree.commit();
      return;
    }
   
    value = value.toLowerCase();
    var completions = _.filter(this.state.tags, function (comp) {
      var norm = comp.text.toLowerCase();
      return norm.substr(0, value.length) == value;
    }.bind(this));

    this.cursors.completions.set(completions.reduce(function (r, s) {
      return r.indexOf(s.text) === -1 ? r.concat([s.text]) : r;
    }, []));
    this.context.tree.commit();
  },

  render: function () {
    var tags = [];
    var self = this;
    if (!_.isEmpty(this.state.noteId)){
      var tagsCursor = this.context.tree.select('model', 'notes', this.state.noteId, 'tags');
      _.each(tagsCursor.get(), function(tag) {
        if (tag.action_if_done) {
          if (tag.action_if_done === 'add') {
            tags.push(React.createElement("div", {key:uuid.v4(), className: "tag"}, React.createElement("button", {key:uuid.v4(), onClick:self.removeTag.bind(null, tag.text)}, "X"), tag.text));
          }
        } else {
          tags.push(React.createElement("div", {key:uuid.v4(), className: "tag"}, React.createElement("button", {key:uuid.v4(), onClick:self.removeTag.bind(null, tag.text)}, "X"), tag.text));
        }
      });
    }

    var completions = [];
    _.each(this.state.completions, function(completion) {
      completions.push(React.createElement('option', {value:completion, key:uuid.v4()}));
    });
    var completion_list = React.createElement('datalist', {key:uuid.v4(), id:'completion_list'},completions);

    return (
      <div> 
        <div id='tags_container'>
          {tags}
        </div>
        {completion_list}
        <input type='text'
          placeholder="enter tag descriptors"
          list='completion_list'
          id='tags_input'
          value={this.state.inputText}
          onChange={this.onChange} 
          onKeyDown={this.handleKeyDown} />
        <button type='button' onClick={this.addTag.bind(null, this.state.inputText)}>Submit </button>
      </div>
    ); 
  }
});
module.exports = _TagsInput;
