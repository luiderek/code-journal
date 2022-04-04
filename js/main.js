/* global data */
/* exported data */

const $photoURL = document.querySelector('input[name=photoURL]');
const $photoPreview = document.querySelector('.photo-preview');
$photoURL.addEventListener('input', function (e) {
  $photoPreview.setAttribute('src', e.target.value);
});

// function l(logtarget) {
//   console.log(logtarget + ':', logtarget);
// }
