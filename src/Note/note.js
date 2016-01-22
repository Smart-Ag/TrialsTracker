var React = require('react');
var Baobab = require('baobab');
var branch = require('baobab-react/mixins').branch;
var TagsModal = require('../TagsModal/tags-modal.js');
var uuid = require('uuid');
var _ = require('lodash');
var TextAreaAutoSize = require('react-textarea-autosize');
require('./note.css');

var _Note = React.createClass({
  mixins: [branch],

  cursors: function () {
    return {
      note: ['model', 'notes', this.props.id],
      modalVisible: ['model', 'notes', this.props.id, 'tags_modal_visibility'],
      tagsModalNoteId: ['model', 'tags_modal', 'note_id'],
      allTags: ['model', 'all_tags'],
      selectedNote: ['model', 'selected_note'],
      showHide: ['model', 'notes', this.props.id, 'geojson_visible'],
    };
  },

  textAreaChanged: function(evt) {
    this.cursors.note.set('text', evt.target.value),
    this.context.tree.commit();
  },

  deleteButtonClick: function(evt) {
    this.props.deleteNote(this.props.id);
  },

  openTagsModal: function() {
    this.cursors.modalVisible.set(true);
    this.cursors.tagsModalNoteId.set(this.props.id);
    this.context.tree.commit();
  },

  selectNote: function() {
    this.cursors.selectedNote.set(this.props.id);
    this.context.tree.commit();   
  },

  showHide: function() {
    var currentVisibility = this.cursors.showHide.get();
    if (currentVisibility === 'Show') {
      this.cursors.showHide.set('Hide');
    } else {
      this.cursors.showHide.set('Show');
    }
    this.context.tree.commit();
  },

  render: function () {
    var noteClass = 'note';
    if (this.state.note.id === this.state.selectedNote) {
      noteClass = 'selected-note';
    }
    var tags = [];
    _.each(this.state.note.tags, function(tag) {
      if (tag.action_if_done) {
        if (tag.action_if_done === 'add') {
        } else {
          tags.push(<span className='tag' key={uuid.v4()}>{tag.text}</span>);
        }
      } else {
        tags.push(<span className='tag' key={uuid.v4()}>{tag.text}</span>);
      }
    });
    var divStyle = {
      borderColor: this.state.note.color
    }
    return (
      <div style={divStyle} className={noteClass} onClick={this.selectNote}> 
        <TextAreaAutoSize value={this.state.note.text} minRows={3} className='note-text-input' onChange={this.textAreaChanged}></TextAreaAutoSize>
        <button type="button" className="note-remove-button" onClick={this.deleteButtonClick}>
          Delete Note
        </button>
        <button type="button" className="note-hide-show-button" onClick={this.showHide}>
          {this.cursors.showHide.get()}
        </button>
        <button type="button" className="note-edit-tags-button" onClick={this.openTagsModal}>
          edit tags
        </button>
        {tags}
        <TagsModal/>
      </div>
    ); 
  }
});
module.exports = _Note;
