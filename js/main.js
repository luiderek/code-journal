/* global data */
/* exported data */

const $photoURL = document.querySelector('input[name=photoURL]');

// no error check for broken src attribute
const $photoPreview = document.querySelector('.photo-preview');
$photoURL.addEventListener('input', function (e) {
  $photoPreview.setAttribute('src', e.target.value);
});

const $entryForm = document.querySelector('div[data-view=entry-form] > form');
$entryForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const entryObj = {
    title: e.target.title.value,
    photoURL: e.target.photoURL.value,
    notes: e.target.notes.value,
    entryId: data.nextEntryId
  };

  data.nextEntryId++;
  data.entries.unshift(entryObj);

  $photoPreview.setAttribute('src', './images/placeholder-image-square.jpg');
  $entryForm.reset();
});
