var React = require('react');
var Baobab = require('baobab');
var branch = require('baobab-react/mixins').branch;
var TagsModal = require('../TagsModal/tags-modal.js');
var uuid = require('uuid');
var _ = require('lodash');
var TextAreaAutoSize = require('react-textarea-autosize');
var TagsInput = require('../TagsInput/tags-input.js');
var Modal = require('react-bootstrap/lib/Modal');
require('./note.css');

var _Note = React.createClass({
  mixins: [branch],

  cursors: function () {
    return {
      note: ['model', 'notes', this.props.id],
      modalVisible: ['model', 'notes', this.props.id, 'tags_modal_visibility'],
      allTags: ['model', 'all_tags'],
      selectedNote: ['model', 'selected_note'],
      showHide: ['model', 'notes', this.props.id, 'geojson_visible'],

      noteId: ['model', 'tags_modal', 'note_id'],      
      editTags: ['view', 'edittingTags'],
      tags: ['model', 'tags'],
      visible: ['model', 'tags_modal', 'visible'],
      completions: ['model', 'tags_modal', 'completions'],
      inputText: ['model', 'tags_modal', 'input_text'],
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

  addTag: function(tagText) {
    if (tagText === "") {
        return;
    }
    var tagCursor = this.context.tree.select('model', 'notes', this.props.id, 'tags', tagText);
    var tag = tagCursor.get();
    if (tag) {
    } else {
      var tagsCursor = this.context.tree.select('model', 'notes', this.props.id, 'tags');
      tagsCursor.set(tagText, {text:tagText});
    }
    if (!_.includes(this.state.tags, tagText)) {
      this.cursors.tags.set(tagText, {text:tagText, references: 1});
    }
    this.cursors.inputText.set('');
    this.cursors.completions.set([]);
    this.context.tree.commit();
  },

  removeTag: function(tagText) {
    var tagCursor = this.context.tree.select('model', 'notes', this.props.id, 'tags');
    
    console.log(tagCursor);
    console.log(tagCursor.get());
    console.log(tagText);
    tagCursor.unset(tagText);
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

  editTags: function() {
    if (this.state.editTags) {
      this.cursors.editTags.set(false);
      this.context.tree.commit();
    } else {
      this.cursors.editTags.set(true);
      this.context.tree.commit();
    }
  },

  render: function () {
    var noteClass = 'note';
    var tags = [];
    var self = this;
    _.each(this.state.note.tags, function(tag) {
      if (self.state.editTags && self.state.note.id === self.state.selectedNote) {
        tags.push(React.createElement("div", {key:uuid.v4(), className: "tag"}, React.createElement("button", {key:uuid.v4(), onClick:self.removeTag.bind(null, tag.text)}, "X"), tag.text));
      } else {
        tags.push(<span className='tag' key={uuid.v4()}>{tag.text}</span>);
      }
    });

    var divStyle = {
      borderColor: this.state.note.color
    }

    var tagsInput = [];
    if (this.state.note.id === this.state.selectedNote) {
      noteClass = 'selected-note';
      tagsInput.push(<button type="button" className="note-remove-button" onClick={this.deleteButtonClick}>Delete Note</button>);
      tagsInput.push(<br />);
      tagsInput.push(<button type="button" className="note-edit-tags-button" onClick={this.editTags}>edit tags</button>);
      if (this.state.editTags) {
        tagsInput.push(<input type='text'
                        placeholder="enter tag descriptors"
                        list='completion_list'
                        id='tags_input'
                        value={this.state.inputText}
                        onChange={this.onChange}
                        onKeyDown={this.handleKeyDown} />);
        tagsInput.push(<button type='button' onClick={this.addTag.bind(null, this.state.inputText)}>Submit</button>);
      }
    }

    var completions = [];
    _.each(this.state.completions, function(completion) {
      completions.push(React.createElement('option', {value:completion, key:uuid.v4()}));
    });
    var completion_list = React.createElement('datelist', {key:uuid.v4(), id:'completion_list'}, completions);
    
//    var visibilityCursor = this.context.tree.select('model', 'notes', this.state.tagNote, 'tags_modal_visibility');

    return (
      <div style={divStyle} className={noteClass} onClick={this.selectNote}> 
        <TextAreaAutoSize value={this.state.note.text} minRows={3} className='note-text-input' onChange={this.textAreaChanged}></TextAreaAutoSize>
        <button type="button" className="note-hide-show-button" onClick={this.showHide}>{this.cursors.showHide.get()}</button>        
        {tags}
        {completion_list}
        {tagsInput}
      </div>
    ); 
  }
});
module.exports = _Note;
