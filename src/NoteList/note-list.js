var React = require('react');
var Note = require('../Note/note.js');
var SortingTabs = require('../SortingTabs/sorting-tabs.js');
//var SearchBar = require('react-search-bar');
var _ = require('lodash');
var uuid = require('uuid');
var branch = require('baobab-react/mixins').branch;
var TagsModal = require('../TagsModal/tags-modal.js');
require("./note-list.css");


var _NoteList = React.createClass({
  mixins: [branch],

  cursors: function() {
    return {
      notes: ['model', 'notes'],
      sortMode: ['view', 'sort_mode'],
      allTags: ['model', 'all_tags'],
    };
  },
  
  deleteNote: function(id) {
    var delete_note_order = this.state.notes[id].order;
    this.context.tree.unset(['model', 'notes', id]);
    this.context.tree.commit();
    var self = this;
    // now adjust the order value of all notes following the current note
    _.each(this.state.notes, function(note) {
      if (note.order > delete_note_order) {
        self.context.tree.select('model', 'notes', note.id).set('order', self.state.notes[note.id].order - 1);
      }
    });
    console.log(this.state.notes);
    this.context.tree.commit();
    console.log(this.state.notes);
  },

  addNote: function() {
    var obj_id = uuid.v4();
    var obj = {   
      id: obj_id,
      text: ' ',
      order: Object.keys(this.state.notes).length,
      tags: [],
      fields:[],
    };
    console.log(this);
    this.cursors.notes.set(obj_id, obj);
    this.context.tree.commit();
  },
  
  render: function () {
    var notes_array  = [];
    if (this.state.sortMode === 'all') {
      for (var i in this.state.notes) {
        notes_array.push(<Note id={this.state.notes[i].id} key={this.state.notes[i].id} deleteNote={this.deleteNote} />);
        }
    } else if(this.state.sortMode === 'fields') {
      var note_groups = _.groupBy(this.state.notes, this.state.sortMode);
      var self = this;
      _.each(note_groups, function(group, key) {
        notes_array.push(<h1 key={uuid.v4()}>{key}</h1>);
        notes_array.push(<hr key={uuid.v4()}/>);
        for (var i in group) {
          notes_array.push(<Note id={group[i].id} key={group[i].id} deleteNote={self.deleteNote} />);
        }
      });
    } else if (this.state.sortMode === 'tags') {
      var self = this;
      _.each(self.state.notes, function(note) {
        if (_.isEmpty(note.tags)) {
          notes_array.push(<Note id={note.id} key={uuid.v4()} deleteNote={self.deleteNote} />);
        }
      });
      _.each(this.state.allTags, function(tag) {
        notes_array.push(<span className='note-tag-headings' key={uuid.v4()}>{tag}</span>);
        notes_array.push(<hr key={uuid.v4()}/>);
        _.each(self.state.notes, function(note) {
          _.each(note.tags, function(noteTag) {
            if (noteTag.text === tag) {
              notes_array.push(<Note id={note.id} key={uuid.v4()} deleteNote={self.deleteNote} />);
            }
          });
        });
      });
    }
    return (
      <div className="note-list">
        <SortingTabs/>
        <div className="notes-container">{notes_array} </div>
        <button type= "button" onClick={this.addNote} className="add-note-button">
          Add Note
        </button>
      </div>
    );
  }
});
module.exports = _NoteList;
