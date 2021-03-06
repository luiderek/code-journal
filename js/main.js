/* global data */
/* exported data */

const $photoURL = document.querySelector('input[name=photoURL]');
const $entryList = document.querySelector('.entry-view-container');
const $entryFormLabel = document.querySelector('.entry-form-label');
const $entryFormdiv = document.querySelector('div[data-view=entry-form]');
const $entryListdiv = document.querySelector('div[data-view=entries]');

window.addEventListener('DOMContentLoaded', function (event) {
  if (data.entries.length) {
    for (const entry of data.entries) {
      $entryList.appendChild(entryToDOM(entry));
    }
  } else {
    appendNothingHereDOM($entryList);
  }

  if (data.editing) {
    $entryFormLabel.textContent = 'Edit Entry';
    $photoPreview.setAttribute('src', data.editing.photoURL);
  }

  if (data.altLayout === true) {
    $container.classList.toggle('container-grow');
    $entryViewContainer.classList.toggle('grid-mode-on');
  }

  if (data.view === 'entry-list') {
    setViewToList();
  } else if (data.view === 'entry-form') {
    setViewToForm();
    tagListRefreshDOM();
    if (data.editing) {
      $deleteEntryButton.classList.remove('hidden');
    }
  }
});

const $photoPreview = document.querySelector('.photo-preview');
$photoURL.addEventListener('input', function (event) {
  $photoPreview.setAttribute('src', event.target.value);
});

const $entryForm = document.querySelector('div[data-view=entry-form] form');
$entryForm.addEventListener('submit', function (event) {
  event.preventDefault();

  if (data.editing) {
    data.editing.title = event.target.title.value;
    data.editing.photoURL = event.target.photoURL.value;
    data.editing.notes = event.target.notes.value;

    for (const entry of data.entries) {
      if (entry.entryId === data.editing.entryId) {
        entry.tags = data.currentTags;
      }
    }
    data.currentTags = [];

    // brute force re-rendering all brain fried, can't think.
    for (const entry of data.entries) {
      updateEntry(entry);
    }

    data.editing = null;
  } else {
    const entryObj = {
      entryId: data.nextEntryId,
      title: event.target.title.value,
      photoURL: event.target.photoURL.value,
      notes: event.target.notes.value,
      tags: data.currentTags
    };

    data.nextEntryId++;
    data.entries.unshift(entryObj);
    data.currentTags = [];
    $entryList.prepend(entryToDOM(entryObj));
    removeNothings();
  }

  $photoPreview.setAttribute('src', './images/placeholder-image-square.jpg');
  setViewToList();
});

const $entryAnchor = document.querySelector('.entry-anchor');
$entryAnchor.addEventListener('click', function (event) {
  event.preventDefault();
  setViewToList();
});

const $newEntryButton = document.querySelector('button[name=new-entry]');
$newEntryButton.addEventListener('click', function (event) {
  setViewToForm();
  $entryFormLabel.textContent = 'New Entry';
  $deleteEntryButton.classList.add('hidden');
  data.editing = null;
  $entryForm.reset();
  data.currentTags = [];
  tagListRefreshDOM();
  $photoPreview.setAttribute('src', './images/placeholder-image-square.jpg');
});

function entryToDOM(entry) {
  // <li>
  //   <div class="row margin-bot justify-space-between">
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
  //  div.row
  //    div.column-full
  //      span.tag-list-view
  //     /div
  //  /div
  // </li>

  // <video id="my-video" class="video-js" controls preload="auto" width="640" height="264" poster="MY_VIDEO_POSTER.jpg"
  //   data-setup="{}">
  //   <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
  //   <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/webm" />
  // </video>

  const $li = document.createElement('li');
  $li.classList.add('entry-list-element');
  $li.setAttribute('data-entryID', entry.entryId + '');

  const $divRMb = document.createElement('div');
  $divRMb.classList.add('row', 'justify-space-between');

  const $divch1 = document.createElement('div');
  $divch1.classList.add('column-half');
  const $divch2 = document.createElement('div');
  $divch2.classList.add('column-half');

  if (entry.photoURL.slice(-3) === 'mp4' || entry.photoURL.slice(-4) === 'webm') {
    const $img = document.createElement('video');
    $img.classList.add('video-js', 'vjs-fluid', 'vjs-big-play-centered');
    $img.setAttribute('data-setup', '{ "controls": true, "picture_in_picture_control": false, "fluid": true}');
    const $source = document.createElement('source');
    $source.setAttribute('src', entry.photoURL);
    if (entry.photoURL.slice(-3) === 'mp4') {
      $source.setAttribute('type', 'video/mp4');
    } else {
      $source.setAttribute('type', 'video/webm');
    }
    $img.appendChild($source);
    $divch1.appendChild($img);
  } else {
    const $img = document.createElement('img');
    $img.setAttribute('src', entry.photoURL);
    $divch1.appendChild($img);
  }

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
  $divRMb.appendChild($divch2);
  $divch2.appendChild($divRjsb);
  $divRjsb.appendChild($h3);
  $divRjsb.appendChild($i);
  $divch2.appendChild($p);

  //  div.row
  //    div.column-full
  //      span.tag-list-view
  //     /div
  //  /div

  const $divTagRow = document.createElement('div');
  $divTagRow.className = 'row margin-bot';
  const $divTagCol = document.createElement('div');
  $divTagCol.className = 'column-full';
  const $spanTagView = document.createElement('span');
  $spanTagView.className = 'tag-list-view';

  $li.appendChild($divTagRow);
  $divTagRow.appendChild($divTagCol);
  $divTagCol.appendChild($spanTagView);

  for (const tag of entry.tags) {
    const $newTag = document.createElement('span');
    $newTag.textContent = tag;
    $spanTagView.appendChild($newTag);
  }

  return $li;
}

function getElementFromObject(entry) {
  const $entryListNodeList = document.querySelectorAll('.entry-list-element');
  for (const node of $entryListNodeList) {
    if (entry && entry.entryId === +node.getAttribute('data-entryid')) {
      return node;
    }
  }
}

function appendNothingHereDOM(parent) {
  const $nothinghere = document.createElement('li');
  $nothinghere.textContent = 'No entries have been recorded.';
  $nothinghere.className = 'centered-text nothing-here';
  parent.appendChild($nothinghere);
}

function updateEntry(entry) {
  const $target = getElementFromObject(entry);
  if ($target) {
    $target.replaceWith(entryToDOM(entry));
  }
}

function entryListRefreshDOM() {
  entryListClearDOM();
  if (data.entries.length) {
    for (const eachentry of data.entries) {
      $entryList.appendChild(entryToDOM(eachentry));
    }
  }
}

// eslint-disable-next-line no-unused-vars
function entryListClearDOM() {
  const $entryListNodeList = document.querySelectorAll('.entry-list-element');
  for (const node of $entryListNodeList) {
    node.remove();
  }
}

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

function removeNothings() {
  const $nothinghere = document.querySelector('.nothing-here');
  if ($nothinghere) {
    $nothinghere.remove();
  }
}

// on clicking the edit pencil
$entryListdiv.addEventListener('click', function (event) {
  if (event.target.getAttribute('class') && event.target.getAttribute('class').includes('fa-pen')) {
    setViewToForm();
    const dataID = +event.target.getAttribute('data-entry-id');

    for (const entry of data.entries) {
      if (entry.entryId === dataID) {
        data.editing = entry;
        data.currentTags = entry.tags;
      }
    }
    tagListRefreshDOM();

    $entryForm.title.value = data.editing.title;
    $entryForm.photoURL.value = data.editing.photoURL;
    $entryForm.notes.value = data.editing.notes;
    $photoPreview.setAttribute('src', data.editing.photoURL);

    $entryFormLabel.textContent = 'Edit Entry';
    $deleteEntryButton.classList.remove('hidden');
  }
});

const $deleteEntryButton = document.querySelector('.delete-entry-button');
$deleteEntryButton.addEventListener('click', function (event) {
  event.preventDefault();
  modalVisibilitySwitch();
});

// MODAL
const $modal = document.querySelector('.modal');
const $modalYesSelect = document.querySelector('.modal-yes-select');
const $modalNoSelect = document.querySelector('.modal-no-select');

function modalVisibilitySwitch() {
  data.modalLive = !data.modalLive;
  if (data.modalLive === true) {
    $modal.className = 'modal blur';
  } else {
    $modal.className = 'modal';
  }
}

$modalYesSelect.addEventListener('click', function (e) {
  const goodobj = data.entries.filter(obj => { return obj.entryId === data.editing.entryId; })[0];
  // remove from dom
  getElementFromObject(goodobj).remove();
  // update the object model
  data.entries = data.entries.filter(obj => { return obj.entryId !== data.editing.entryId; });
  data.editing = null;
  data.currentTags = [];
  modalVisibilitySwitch();
  setViewToList();

  if (!data.entries.length) {
    appendNothingHereDOM($entryList);
  }
});

$modalNoSelect.addEventListener('click', function (e) {
  modalVisibilitySwitch();
});

// SEARCHBAR
const $searchBar = document.querySelector('input[id=searchbar]');
$searchBar.addEventListener('input', function (event) {
  entryListFilterDOM(event.target.value);
});

function entryListFilterDOM(searchTerm) {
  entryListClearDOM();

  const splitSearch = searchTerm.toLowerCase().split(' ');

  if (data.entries.length) {
    for (const entry of data.entries) {
      let targetString = entry.title + ' ' + entry.notes;
      targetString = targetString.toLowerCase();
      if (splitSearch.every(term => targetString.includes(term))) {
        $entryList.appendChild(entryToDOM(entry));
      }
    }
  }
}

// ALT LAYOUT
const $slideToggle = document.querySelector('#layout-toggle');
const $container = document.querySelector('.container');
const $entryViewContainer = document.querySelector('.entry-view-container');
$slideToggle.addEventListener('click', function (event) {
  data.altLayout = !data.altLayout;
  $container.classList.toggle('container-grow');
  $entryViewContainer.classList.toggle('grid-mode-on');
});

// TAGS
const $tagList = document.querySelector('.tag-list-edit');
$tagList.addEventListener('click', function (event) {
  // so HTMLCollection didn't have what I wanted
  // array methods don't let me down
  if ([...$tagList.children].includes(event.target)) {
    const tagindex = data.currentTags.indexOf(event.target.textContent);
    data.currentTags.splice(tagindex, 1);
    tagListRefreshDOM();
    // need to update the data object (by deleting)
    // need a seperate tag-domifier function
    // need to re-render existing tags
  }
  // console.log('event.target:', event.target);
});

const $tagInput = document.querySelector('.tag-list-input');
$tagInput.addEventListener('keydown', function (event) {
  // if keydown is enter
  if (event.which === 13) {
    if (event.target.value.split(' ').join('')) {
      data.currentTags.push(event.target.value.split(' ').join(''));
      data.currentTags = [...new Set(data.currentTags)];
      // for some reason data.current tags doesn't maintain its set-iness
      // on refresh so i'm settling for keeping values as an array
      // but filtering for uniqueness / cleaning up spaces before entering
      // might be computationally bad but unsure of workaround.
      tagListRefreshDOM();
      event.target.value = '';
    }
  }
});

function tagListRefreshDOM() {
  while ($tagList.firstChild) {
    $tagList.removeChild($tagList.firstChild);
  }
  for (const tag of data.currentTags) {
    const $newTag = document.createElement('span');
    $newTag.textContent = tag;
    $tagList.appendChild($newTag);
  }
}

// eslint-disable-next-line no-unused-vars
function createDummyEntry(num) {
  while (num--) {
    const x = Math.floor(Math.random() * 100) + 700;

    const entryObj = {
      title: 'dummy entry number ' + (x - 700),
      photoURL: 'https://picsum.photos/' + x,
      notes: 'lorem ipsoom notes notes notes notes notes notes notes notes notes notes notes notes',
      entryId: data.nextEntryId
    };

    data.nextEntryId++;
    data.entries.unshift(entryObj);
    $entryList.prepend(entryToDOM(entryObj));
  }
  removeNothings();
  entryListRefreshDOM();
}
