class CompositionHandler {
  constructor() {
    /*
    * TODO: instead of using this array, refer to children of #image-strip element
    * this would allow moving images around without having to update the .parsedImages
    */
    this.parsedImages = [];

    window.addEventListener('DOMContentLoaded', () => {
      // container element, and relative position of the next image
      this.imageContainer = document.querySelector('#image-strip');
      this.imgOffset = {
        x: 0,
        y: 0,
        z: 0,
      };

      // handle files being dragged and dropped onto the document
      document.ondragover = (e) => e.preventDefault();
      document.ondrop = (e) => {
        e.preventDefault();
        for (let i = 0; i < e.dataTransfer.items.length; i += 1) {
          const file = e.dataTransfer.items[i].getAsFile();
          if (file) this.parseFile(file);
        }
      };

      // handle files chosen via the file <input> element
      document.querySelector('#file-input').oninput = (ev) => {
        for (let i = 0; i < ev.target.files.length; i += 1) {
          const file = ev.target.files[i];
          this.parseFile(file);
        }
      };

      // download a "livin.rum" file that can be used to restore a scene
      document.querySelector('#download-button').onclick = () => this.downloadRumFile();
    });
  }

  parseFile(file) {
    if (file.type.includes('image/')) this.parseImageFile(file);
    else this.parseRumFile(file);
  }

  parseImageFile(imageFile) {
    const reader = new FileReader();
    reader.onload = () => {
      const image = {
        dataURL: reader.result,
        position: `${this.imgOffset.x} ${this.imgOffset.y} ${this.imgOffset.z}`,
      };
      this.imgOffset.x += 1;
      this.parsedImages.push(image);
      this.renderImageWithPosition(image);
    };
    reader.readAsDataURL(imageFile);
  }

  parseRumFile(rumFile) {
    // TODO: allow appending a .rum file to an existing scene
    if (rumFile.name.includes('.rum')) {
      if (this.parsedImages.length > 0) {
        // eslint-disable-next-line no-alert
        const erase = window.confirm('replace current scene with ".rum" file?');
        if (erase) this.imageContainer.innerHTML = '';
        else return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.parsedImages = JSON.parse(reader.result);
        this.parsedImages.forEach((img) => this.renderImageWithPosition(img));
        this.imgOffset.x = this.parsedImages.length;
      };
      reader.readAsText(rumFile);
    }
  }

  renderImageWithPosition(image) {
    const entity = document.createElement('a-image');
    entity.setAttribute('src', image.dataURL);
    entity.setAttribute('position', image.position);
    this.imageContainer.appendChild(entity);
  }

  downloadRumFile(name = 'livin') {
    if (this.parsedImages.length > 0) {
      const fileName = `${name}.rum`;
      const rumFile = new File([JSON.stringify(this.parsedImages)], fileName);
      const url = URL.createObjectURL(rumFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    }
  }
}

new CompositionHandler();
