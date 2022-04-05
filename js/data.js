/* exported data */

var data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1
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
function clearEntries(a) {
  if (a) {
    data = {
      view: 'entry-form',
      entries: [],
      editing: null,
      nextEntryId: 1
    };
  }
}
clearEntries(null);
