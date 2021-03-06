/*
* TODO: instead of using this array, refer to children of #image-strip element
* this would allow moving images around without having to update the .parsedImages
*/
let parsedImages = [];

// container element, and relative position of the next image
const imageContainer = document.querySelector('#image-strip');
const imgOffset = {
  x: 0,
  y: 0,
  z: 0,
};

function renderImageWithPosition(image) {
  const entity = document.createElement('a-image');
  entity.setAttribute('src', image.dataURL);
  entity.setAttribute('position', image.position);
  imageContainer.appendChild(entity);
}

function parseImageFile(imageFile) {
  const reader = new FileReader();
  reader.onload = () => {
    const image = {
      dataURL: reader.result,
      position: `${imgOffset.x} ${imgOffset.y} ${imgOffset.z}`,
    };
    imgOffset.x += 1;
    parsedImages.push(image);
    renderImageWithPosition(image);
  };
  reader.readAsDataURL(imageFile);
}

// ".rum" files are .json files with a different extension
function parseRumFile(rumFile, autoReplace = false) {
  // TODO: allow appending a .rum file to an existing scene
  if (rumFile.name.includes('.rum')) {
    if (parsedImages.length > 0) {
      // eslint-disable-next-line no-alert
      const erase = autoReplace || window.confirm('replace current scene with ".rum" file?');
      if (erase) imageContainer.innerHTML = '';
      else return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      parsedImages = JSON.parse(reader.result);
      parsedImages.forEach((img) => renderImageWithPosition(img));
      imgOffset.x = parsedImages.length;
    };
    reader.readAsText(rumFile);
  }
}

function parseFile(file) {
  if (file.type.includes('image/')) parseImageFile(file);
  else parseRumFile(file);
}

function downloadRumFile(name = 'livin') {
  if (parsedImages.length > 0) {
    const fileName = `${name}.rum`;
    const rumFile = new File([JSON.stringify(parsedImages)], fileName);
    const url = URL.createObjectURL(rumFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  }
}

/*
* Handles loading a default .rum file
* TODO: turn code repeated here and inside parseRumFile into its own function
*/
// Uncomment the code below to load a default .rum file
// /* global THREE */
// const loader = new THREE.FileLoader();
// loader.load('default/livin.rum', (e) => {
//   parsedImages = JSON.parse(e);
//   parsedImages.forEach((img) => renderImageWithPosition(img));
//   imgOffset.x = parsedImages.length;
// });

// handle files being dragged and dropped onto the document
// TODO: for loops are faster
// https://stackoverflow.com/questions/47822612/array-from-vs-for-loop-in-array-like-object-javascript
document.ondragover = (ev) => ev.preventDefault();
document.ondrop = (ev) => {
  ev.preventDefault();
  Array.from(ev.dataTransfer.items).forEach((item) => {
    const file = item.getAsFile();
    if (file) parseFile(file);
  });
};

// handle files chosen via the file <input> element
// TODO: for loops are faster
// https://stackoverflow.com/questions/47822612/array-from-vs-for-loop-in-array-like-object-javascript
document.querySelector('#file-input').oninput = (ev) => {
  Array.from(ev.target.files).forEach(parseFile);
};

// download a "livin.rum" file that can be used to restore a scene
document.querySelector('#download-button').onclick = () => downloadRumFile();
