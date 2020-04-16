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

function parseRumFile(rumFile) {
  // TODO: allow appending a .rum file to an existing scene
  if (rumFile.name.includes('.rum')) {
    if (parsedImages.length > 0) {
      // eslint-disable-next-line no-alert
      const erase = window.confirm('replace current scene with ".rum" file?');
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

// handle files being dragged and dropped onto the document
document.ondragover = (e) => e.preventDefault();
document.ondrop = (e) => {
  e.preventDefault();
  for (let i = 0; i < e.dataTransfer.items.length; i += 1) {
    const file = e.dataTransfer.items[i].getAsFile();
    if (file) parseFile(file);
  }
};

// handle files chosen via the file <input> element
document.querySelector('#file-input').oninput = (ev) => {
  for (let i = 0; i < ev.target.files.length; i += 1) {
    const file = ev.target.files[i];
    parseFile(file);
  }
};

// download a "livin.rum" file that can be used to restore a scene
document.querySelector('#download-button').onclick = () => downloadRumFile();
