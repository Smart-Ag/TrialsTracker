var React = require('react');
var Baobab = require('baobab');
var branch = require('baobab-react/mixins').branch;
var TagsInput = require('../TagsInput/tags-input.js');
var Modal = require('react-bootstrap/lib/Modal');
var uuid = require('uuid');
require('./tags-modal.css');

var _TagsModal = React.createClass({
  mixins: [branch],
  
  cursors: function() {
    return {
      note: ['model', 'tags_modal', 'note_id'],
      tags: ['model', 'tags'],
      visible: ['model', 'tags_modal', 'visible'],
      completions: ['model', 'tags_modal', 'completions'],
    };
  },

  doneButtonClick: function() {
    var tagListCursor = this.context.tree.select('model', 'notes', this.state.note, 'tags');
    var noteList = this.context.tree.select('model', 'notes').get();
    var self = this;
    _.each(tagListCursor.get(), function(tag) {
      if (tag.action_if_done === 'remove') {
        tagListCursor.unset(tag.text);
      } else if (tag.action_if_done === 'add') {
        var tagCursor = self.context.tree.select('model', 'notes', self.state.note, 'tags', tag.text);
        tagCursor.unset('action_if_done');
      }
    });
    this.cursors.visible.set(false);
    this.cursors.note.set({});
    this.context.tree.commit();
  },

  cancelButtonClick: function() {
    var tagListCursor = this.context.tree.select('model', 'notes', this.state.note, 'tags');
    var tags = tagListCursor.get();
    self = this;
    _.each(tags, function(tag) {
      if (tag.action_if_done === 'remove') {
        var tagCursor = self.context.tree.select('model', 'notes', self.state.note, 'tags', tag.text);
        tagCursor.unset('action_if_done');
      } else if (tag.action_if_done === 'add') {
        tagListCursor.unset(tag.text); 
      }
    });
    this.cursors.visible.set(false);
    this.cursors.note.set({});
    this.cursors.completions.set([]);
    this.context.tree.commit();
  },
  
  onModalHide: function() {
  },

  render: function () {
    var visibilityCursor = this.context.tree.select('model', 'notes', this.state.note, 'tags_modal_visibility');
    var containerId = '';
    if (visibilityCursor.get()) {
      containerId = 'tagging-container-show';
    } else {
      containerId = 'tagging-container-hide';
    }

    return (
      <div id={containerId}> 
        <TagsInput />
        <button id='done_button' onClick={this.doneButtonClick} width="48px" height="48px">Done</button>
        <button id='cancel_button' onClick={this.cancelButtonClick} width="48px" height="48px">Cancel</button>
      </div>
    );
  },
});
module.exports = _TagsModal;
