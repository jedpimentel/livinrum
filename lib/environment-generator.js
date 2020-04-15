
const environmentElem = document.querySelector('#environment-element');

// height (y-value) at which
const CLOUD_HEIGHT = 8;
const SNOWFLAKE_RADIUS = 0.1;

AFRAME.registerComponent('falling', {
  schema: {
    tickDistance: {type: 'number', default: 0.005}
  },
  init: function() {
      this.pos = this.el.object3D.position;
  },
  tick: function() {
      if(this.pos.y < -SNOWFLAKE_RADIUS) {
          this.el.object3D.position.y += CLOUD_HEIGHT;
      } else {
          this.el.object3D.position.y -= this.data.tickDistance;
      }
  }
});

function randHex(from=0x00, to=0xFF) {
  return Math.floor(from + Math.random() * (to-from));
}

function grass_rgb_hex_generator() {
  const r = randHex(0x00, 0x40);
  const g = randHex(0x40, 0xC0);
  const b = randHex(0x00, 0x40);
  const rgb = 0x10000 * r + 0x100 * g + b;
  return rgb.toString(16).padStart(6, '0');
}
function cloud_rgb_hex_generator() {
  const r = randHex(0xA0, 0xE0);
  const g = r;
  const b = randHex(0xE0, 0xFF);
  const rgb = 0x10000 * r + 0x100 * g + b;
  return rgb.toString(16).padStart(6, '0');
}

class BaseEntity {
  constructor(config={}) {
    this.element = document.createElement(config.element || 'a-entity');
    this.element.setAttribute('material', "shader: flat");
    this.element.setAttribute('position', `${config.pos_x} ${config.pos_y} ${config.pos_z}`);
    environmentElem.appendChild(this.element);
  }
}

class CloudSphere extends BaseEntity {
  constructor(config={}) {
    super( { ...config, element: 'a-sphere'})
    this.element.setAttribute('color', `#${cloud_rgb_hex_generator()}`);
  }
}

class FallingSnowball extends CloudSphere {
  constructor(config={}) {
    super( { ...config })
    this.element.setAttribute('opacity', 0.5)
    this.element.setAttribute('radius', SNOWFLAKE_RADIUS*(0.8 +0.4*Math.random()));
    this.element.setAttribute('falling', "")
  }
}

class Cloud extends CloudSphere {
  constructor(config={}) {
    super( { ...config, element: 'a-sphere'})
    this.element.setAttribute('radius', 1 + Math.random()*0.4);
  }s
}

class FloorPlane extends BaseEntity {
  constructor(config={}) {
    // zoidberg does this opening curly need a prepended space?
    super( { ...config, element: 'a-plane'})
    this.element.setAttribute('color', config.color || `#${grass_rgb_hex_generator()}`);
    this.element.setAttribute('rotation', '-90 0 0');
  }
}


// floor
for (let x = -10; x <= 10; x++) {
  for (let z = -10; z <= 10; z++) {
    new FloorPlane({
      pos_x: x,
      pos_y: 0,
      pos_z: z,
    });
  }
}

// rain wall
for (let x = -4; x <= 4; x++) {
  for (let y = 0; y <= CLOUD_HEIGHT; y++) {
    new FallingSnowball({
      pos_x: x + Math.random()-0.5,
      pos_y: y + Math.random()-0.5,
      pos_z: -10 + Math.random()-0.5,
    });
  }
}

// clouds
for (let i = -4.5; i <= 4.5; i+=0.5) {
  new Cloud({
    pos_x: i + Math.random()-0.5, 
    pos_y: CLOUD_HEIGHT + Math.random()-0.5, 
    pos_z: -10 + Math.random()-0.5, 
  });
}


// class CompositionHandler {
//   constructor() {
//     /*
//     * TODO: instead of using this array, refer to children of #image-strip element
//     * this would allow moving images around without having to update the .parsedImages
//     */
//     this.parsedImages = [];

//     window.addEventListener('DOMContentLoaded', e => {
//       // container element, and relative position of the next image
//       this.imageContainer = document.querySelector('#image-strip');
//       this.imgOffset = {
//         x: 0,
//         y: 0,
//         z: 0,
//       }

//       // handle files being dragged and dropped onto the document
//       document.ondragover = e => e.preventDefault();
//       document.ondrop = e => {
//         e.preventDefault();
//         if (e.dataTransfer.items) {
//           for (const item of e.dataTransfer.items) {
//             const file = item.getAsFile();
//             if (file) this.parseFile(file);
//           }
//         }
//       };

//       // handle files chosen via the file <input> element
//       document.querySelector('#file-input').oninput = ev => {
//         for (const file of ev.target.files) this.parseFile(file);
//       };

//       // download a "livin.rum" file that can be used to restore a scene
//       document.querySelector('#download-button').onclick = () => this.downloadRumFile();
//     });

//   };
//   parseFile(file) {
//     if (file.type.includes('image/')) this.parseImageFile(file);
//     else this.parseRumFile(file);
//   }
//   parseImageFile(imageFile) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const image = {
//         dataURL: reader.result,
//         position: `${this.imgOffset.x++} ${this.imgOffset.y} ${this.imgOffset.z}`,
//       };
//       this.parsedImages.push(image);
//       this.renderImageWithPosition(image);
//     }
//     reader.readAsDataURL(imageFile); 
//   };
//   parseRumFile(rumFile) {
//     // TODO: allow appending a .rum file to an existing scene
//     if(rumFile.name.includes('.rum') ) {
//       if (this.parsedImages.length > 0) {
//         const erase = confirm('replace current scene with ".rum" file?');
//         if (erase) this.imageContainer.innerHTML = "";
//         else return;
//       }
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         this.parsedImages = JSON.parse(reader.result);
//         this.parsedImages.forEach(img => this.renderImageWithPosition(img));
//         this.imgOffset.x = this.parsedImages.length;
//       }
//       reader.readAsText(rumFile); 
//     }
//   };
//   renderImageWithPosition(image) {
//     const entity = document.createElement('a-image')
//     entity.setAttribute('src', image.dataURL)
//     entity.setAttribute('position', image.position)
//     this.imageContainer.appendChild(entity)
//   };
//   downloadRumFile(name = "livin") {
//     if (this.parsedImages.length > 0) {
//       const rumFile = new File([JSON.stringify(this.parsedImages)], `${name}.rum`);
//       this.downloadFile(rumFile)
//     }
//   };
//   downloadFile(file) {
//     const a = document.createElement('a');
//     const url = URL.createObjectURL(file);
//     a.href = url;
//     a.download = file.name
//     a.click()
//   };
// }

// window.bot = new CompositionHandler();