/* global data */
/* exported data */

const $photoURL = document.querySelector('input[name=photoURL]');

// no error check for broken src attribute
const $photoPreview = document.querySelector('.photo-preview');
$photoURL.addEventListener('input', function (e) {
  $photoPreview.setAttribute('src', e.target.value);
});

const $entryForm = document.querySelector('div[data-view=entry-form] form');
$entryForm.addEventListener('submit', function (e) {
  e.preventDefault();

  if (data.editing) {
    // if this is a editing screen

    data.editing.title = e.target.title.value;
    data.editing.photoURL = e.target.photoURL.value;
    data.editing.notes = e.target.notes.value;

    // brute force re-rendering all because brain fried, can't think.
    for (const entryobject of data.entries) {
      updateEntry(entryobject);
    }

    data.editing = null;
  } else {
    // otherwise if its a new entry
    const entryObj = {
      title: e.target.title.value,
      photoURL: e.target.photoURL.value,
      notes: e.target.notes.value,
      entryId: data.nextEntryId
    };

    data.nextEntryId++;
    data.entries.unshift(entryObj);
    $entryList.prepend(entryToDOM(entryObj));

    const $nothinghere = document.querySelector('.nothing-here');
    if (data.entries.length === 1) {
      if ($nothinghere) {
        $nothinghere.remove();
      }
    }
  }

  $entryForm.reset();
  $photoPreview.setAttribute('src', './images/placeholder-image-square.jpg');
  setViewToList();
});

function entryToDOM(entry) {
  // <li>
  //   <div class="row margin-bot">
  //     <div class="column-half">
  //       <img src="https://picsum.photos/2000" alt="">
  //     </div>
  //     <div class="column-half">
  //       <div class="row justify-space-between">
  //         <h3>Javascript</h3>
  //         <i class="fas fa-pen"></i>
  //       </div>
  //       <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio reiciendis mollitia quidem,
  //         perspiciatis reprehenderit modi dolorem nesciunt vero neque nostrum! Reiciendis repudiandae quibusdam
  //         officia qui, ut veniam dolores! Iure, ea.</p>
  //     </div>
  //   </div>
  // </li>

  const $li = document.createElement('li');
  $li.classList.add('entry-list-element');
  $li.setAttribute('data-entryID', entry.entryId + '');

  const $divRMb = document.createElement('div');
  $divRMb.classList.add('row', 'margin-bot');

  const $img = document.createElement('img');
  $img.setAttribute('src', entry.photoURL);

  const $divch1 = document.createElement('div');
  $divch1.classList.add('column-half');
  const $divch2 = document.createElement('div');
  $divch2.classList.add('column-half');

  const $divRjsb = document.createElement('div');
  $divRjsb.classList.add('row', 'justify-space-between');

  const $h3 = document.createElement('h3');
  $h3.textContent = entry.title;

  const $i = document.createElement('i');
  $i.classList.add('fas', 'fa-pen');
  $i.setAttribute('data-entry-id', entry.entryId);

  const $p = document.createElement('p');
  $p.textContent = entry.notes;

  $li.appendChild($divRMb);
  $divRMb.appendChild($divch1);
  $divch1.appendChild($img);
  $divRMb.appendChild($divch2);
  $divch2.appendChild($divRjsb);
  $divRjsb.appendChild($h3);
  $divRjsb.appendChild($i);
  $divch2.appendChild($p);

  return $li;
}

function updateEntry(entry) {
  const $target = getElementFromObject(entry);
  if ($target) {
    $target.replaceWith(entryToDOM(entry));
  }
}

function getElementFromObject(entry) {
  const $entryListNodeList = document.querySelectorAll('.entry-list-element');
  for (const node of $entryListNodeList) {
    if (entry && entry.entryId === +node.getAttribute('data-entryid')) {
      return node;
    }
  }
}

const $entryList = document.querySelector('.entry-view-container');

window.addEventListener('DOMContentLoaded', function (e) {
  if (data.entries.length) {
    for (const eachentry of data.entries) {
      $entryList.appendChild(entryToDOM(eachentry));
    }
  } else {
    appendNothingHereDOM($entryList);
  }

  if (data.editing) {
    $entryFormLabel.textContent = 'Edit Entry';
    $photoPreview.setAttribute('src', data.editing.photoURL);
  }

  if (data.view === 'entry-list') {
    setViewToList();
  } else if (data.view === 'entry-form') {
    setViewToForm();
    if (data.editing) {
      $deleteEntryButton.classList.remove('hidden');
    }
  }
});

function appendNothingHereDOM(parent) {
  const $nothinghere = document.createElement('li');
  $nothinghere.textContent = 'No entries have been recorded.';
  $nothinghere.className = 'centered-text nothing-here';
  parent.appendChild($nothinghere);
}

const $entryFormLabel = document.querySelector('.entry-form-label');
const $entryFormdiv = document.querySelector('div[data-view=entry-form]');
const $entryListdiv = document.querySelector('div[data-view=entries]');
const $entryAnchor = document.querySelector('.entry-anchor');

$entryAnchor.addEventListener('click', function (e) {
  e.preventDefault();
  setViewToList();
});

const $newEntryButton = document.querySelector('button[name=new-entry]');
$newEntryButton.addEventListener('click', function (e) {
  setViewToForm();
  $entryFormLabel.textContent = 'New Entry';
  $deleteEntryButton.classList.add('hidden');
  data.editing = null;
  $entryForm.reset();
  $photoPreview.setAttribute('src', './images/placeholder-image-square.jpg');
});

function setViewToForm() {
  data.view = 'entry-form';
  $entryFormdiv.classList.remove('hidden');
  $entryListdiv.classList.add('hidden');
}

function setViewToList() {
  data.view = 'entry-list';
  $entryListdiv.classList.remove('hidden');
  $entryFormdiv.classList.add('hidden');
}

// on clicking the edit pencil
$entryListdiv.addEventListener('click', function (e) {

  if (e.target.getAttribute('class') && e.target.getAttribute('class').includes('fa-pen')) {
    setViewToForm();
    const dataID = +e.target.getAttribute('data-entry-id');

    for (const ent of data.entries) {
      if (ent.entryId === dataID) {
        data.editing = ent;
      }
    }

    $entryForm.title.value = data.editing.title;
    $entryForm.photoURL.value = data.editing.photoURL;
    $entryForm.notes.value = data.editing.notes;
    $photoPreview.setAttribute('src', data.editing.photoURL);

    $entryFormLabel.textContent = 'Edit Entry';
    $deleteEntryButton.classList.remove('hidden');
  }
});

const $deleteEntryButton = document.querySelector('.delete-entry-button');
$deleteEntryButton.addEventListener('click', function (e) {
  e.preventDefault();
  modalVisibilitySwitch();
});

let popupStatus = false;
const $modal = document.querySelector('.modal');

function modalVisibilitySwitch() {
  popupStatus = !popupStatus;
  if (popupStatus === true) {
    $modal.className = 'modal blur';
  } else {
    $modal.className = 'modal';
  }
}

const $modalYesSelect = document.querySelector('.modal-yes-select');
const $modalNoSelect = document.querySelector('.modal-no-select');

$modalYesSelect.addEventListener('click', function (e) {
  // the relavent data.entries object
  const goodobj = data.entries.filter(obj => { return obj.entryId === data.editing.entryId; })[0];
  // remove from dom
  getElementFromObject(goodobj).remove();
  // update the object model
  data.entries = data.entries.filter(obj => { return obj.entryId !== data.editing.entryId; });
  data.editing = null;
  modalVisibilitySwitch();
  setViewToList();

  if (!data.entries.length) {
    appendNothingHereDOM($entryList);
  }
});

$modalNoSelect.addEventListener('click', function (e) {
  modalVisibilitySwitch();
});
