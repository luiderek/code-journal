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

  $photoPreview.setAttribute('src', './images/placeholder-image-square.jpg');
  $entryForm.reset();

  $entryListdiv.classList.remove('hidden');
  $entryFormdiv.classList.add('hidden');
  data.view = 'entry-list';
});

function entryToDOM(entry) {
  // <li>
  //   <div class="row margin-bot">
  //     <div class="column-half">
  //       <img src="https://picsum.photos/2000" alt="">
  //     </div>
  //     <div class="column-half">
  //       <h3>Javascript</h3>
  //       <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio reiciendis mollitia quidem,
  //         perspiciatis reprehenderit modi dolorem nesciunt vero neque nostrum! Reiciendis repudiandae quibusdam
  //         officia qui, ut veniam dolores! Iure, ea.</p>
  //     </div>
  //   </div>
  // </li>

  const $li = document.createElement('li');
  const $divRMb = document.createElement('div');
  $divRMb.classList.add('row', 'margin-bot');
  const $img = document.createElement('img');
  $img.setAttribute('src', entry.photoURL);
  const $divch1 = document.createElement('div');
  $divch1.classList.add('column-half');
  const $divch2 = document.createElement('div');
  $divch2.classList.add('column-half');
  const $h3 = document.createElement('h3');
  $h3.textContent = entry.title;
  const $p = document.createElement('p');
  $p.textContent = entry.notes;

  $li.appendChild($divRMb);
  $divRMb.appendChild($divch1);
  $divch1.appendChild($img);
  $divRMb.appendChild($divch2);
  $divch2.appendChild($h3);
  $divch2.appendChild($p);

  return $li;
}

const $entryList = document.querySelector('.entry-view-container');

window.addEventListener('DOMContentLoaded', function (e) {
  if (data.entries.length) {
    for (const eachentry of data.entries) {
      $entryList.appendChild(entryToDOM(eachentry));
    }
  } else {
    const $nothinghere = document.createElement('li');
    $nothinghere.textContent = 'No entries have been recorded.';
    $nothinghere.className = 'centered-text nothing-here';
    $entryList.appendChild($nothinghere);
  }
  if (data.view === 'entry-list') {
    $entryListdiv.classList.remove('hidden');
    $entryFormdiv.classList.add('hidden');
  } else if (data.view === 'entry-form') {
    $entryFormdiv.classList.remove('hidden');
    $entryListdiv.classList.add('hidden');
  }
});

const $entryFormdiv = document.querySelector('div[data-view=entry-form]');
const $entryListdiv = document.querySelector('div[data-view=entries]');
const $entryAnchor = document.querySelector('.entry-anchor');
$entryAnchor.addEventListener('click', function (e) {
  e.preventDefault();
  data.view = 'entry-list';
  $entryListdiv.classList.remove('hidden');
  $entryFormdiv.classList.add('hidden');
});

const $newEntryButton = document.querySelector('button[name=new-entry]');
$newEntryButton.addEventListener('click', function (e) {
  data.view = 'entry-form';
  $entryFormdiv.classList.remove('hidden');
  $entryListdiv.classList.add('hidden');
});
