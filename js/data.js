/* exported data */

var data = {
  view: 'entry-form',
  entries: [],
  currentTags: [],
  editing: null,
  nextEntryId: 1,
  modalLive: false,
  altLayout: false
};

const previousDataJSON = localStorage.getItem('javascript-local-storage');
if (previousDataJSON) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', function (event) {
  const dataJSON = JSON.stringify(data);
  this.localStorage.setItem('javascript-local-storage', dataJSON);
});

// eslint-disable-next-line no-unused-vars
function resetDataObject() {
  data = {
    view: 'entry-form',
    entries: [],
    currentTags: [],
    editing: null,
    nextEntryId: 1,
    modalLive: false,
    altLayout: false
  };
}

// for reference
// const entryObj = {
//   entryId: data.nextEntryId,
//   title: e.target.title.value,
//   photoURL: e.target.photoURL.value,
//   notes: e.target.notes.value,
//   tags: []
// };
