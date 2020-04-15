
const BLOB = document.querySelector('#blob');

console.log('ah', BLOB)
const YROOF = 8;
const TICK_DROP_METERS = 0.005;

const dropRadius = 0.1;

AFRAME.registerComponent('falling', {
  init: function() {
      this.pos = this.el.object3D.position;
  },
  tick: function() {
      if(this.pos.y < -dropRadius) {
          this.el.object3D.position.y += YROOF;
      } else {
          this.el.object3D.position.y -= TICK_DROP_METERS;
      }
  }
});

function randHex(from=0x00, to=0xFF) {
  return Math.floor(from + Math.random() * (to-from));
}
// 1/4: 40
// 2/4: 80
// 5/8: A0
// 3/4: C0
// 7/8: E0
// 4/4: FF
let grass_rgb_hex_generator = () => {
  const r = randHex(0x00, 0x40);
  const g = randHex(0x40, 0xC0);
  const b = randHex(0x00, 0x40);
  const rgb = 0x10000 * r + 0x100 * g + b;
  return rgb.toString(16).padStart(6, '0');
}
let cloud_rgb_hex_generator = () => {
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
    BLOB.appendChild(this.element);
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
    this.element.setAttribute('radius', dropRadius*(0.8 +0.4*Math.random()));
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
for (let i = -10; i <= 10; i++) {
  // for (let j = -10; j <= 10; j++) {
    for (let k = -10; k <= 10; k++) {
      new FloorPlane({
        pos_x: i,
        pos_y: 0,
        pos_z: k,
      });
    }
  // }
}


// rain wall
for (let i = -4; i <= 4; i++) {
  for (let j = 1; j <= 8; j++) {
    // for (let k = -10; k <= 10; k++) {
      new FallingSnowball({
        pos_x: i + Math.random()-0.5,
        pos_y: j + Math.random()-0.5,
        pos_z: -10 + Math.random()-0.5,
      });
    // }
  }
}
// clouds
for (let i = -4.5; i <= 4.5; i+=0.5) {
  // for (let j = 1; j <= 8; j++) {
    // for (let k = -10; k <= 10; k++) {
      new Cloud({
        pos_x: i + Math.random()-0.5, 
        pos_y: YROOF + Math.random()-0.5, 
        pos_z: -10 + Math.random()-0.5, 
      });
    // }
  // }
}




class Robot {
  constructor() {
    this.anchor = document.createElement('a')
    this.input = document.createElement('input')
    this.input.setAttribute('type', 'file')
    this.input.setAttribute('multiple', '')

    this.input.addEventListener('input', files => this.parseFiles());

    this.sceneEntities = new Array(0);
    this.filesAsJSON = new Array(0);

    this.target = {
      x: 0,
      y: 1,
      z:-2
    }

    this.parsedFiles = [];

    window.addEventListener('DOMContentLoaded', e => {
      document.body.append(this.anchor)
      document.body.append(this.input)
      this.sceneEl = document.querySelector('a-scene')

      document.querySelector('body').ondragover = e => {
        e.preventDefault();
      };
      document.querySelector('body').ondrop = e => {
        console.log(e)
        e.preventDefault();
        if (e.dataTransfer.items) {
          // Use DataTransferItemList interface to access the file(s)
          console.log('marco')
          for (var i = 0; i < e.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (e.dataTransfer.items[i].kind === 'file') {
              var file = e.dataTransfer.items[i].getAsFile();
              this.parseDroppedFile(file)
              // console.log('... file[' + i + '].name = ' + file.name);
            }
          }
        } else {
          // Use DataTransfer interface to access the file(s)
          console.log('polo')
          // for (var i = 0; i < e.dataTransfer.files.length; i++) {
          //   console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
          // }
        }
      };
    });

  };
  askForFiles() {
    this.input.click();
  }
  parseDroppedFile(file) {
    console.log('dropped a file')
    if(file.type.includes('image/')) {
      // this.input.files.push(file)
      let reader = new FileReader();
      reader.onload = (e) => {
        let parsedFile = {
          dataURL: reader.result,
          position: `${this.target.x++} ${this.target.y} ${this.target.z}`,
        }
        console.log(parsedFile)
        this.parsedFiles.push(parsedFile);
        this.rumBlobToEntity(parsedFile);
      }
      reader.readAsDataURL(file); 
    } else {
      // assume it's a scene blob
      this.parseRum(file);
    }
  }
  // FILE INPUT PARSER
  parseFiles() {
    console.log('parsing files')
    this.parsedFiles = new Array(this.input.files.length)
    let files = this.input.files;
    if(files.length === 1 && files[0].name.includes('.rum')) {
      this.parseRum(files[0]);
    } else {
      for(let i = 0; i < this.input.files.length; i++) {
        let file = this.input.files[i];
        if(file.type.includes('image/')) {
          let reader = new FileReader();
          let idx = i;
          reader.onload = (e) => {
            let parsedFile = this.parsedFiles[idx] = {
              dataURL: reader.result,
              position: `${this.target.x++} ${this.target.y} ${this.target.z}`,
            }
            this.rumBlobToEntity(parsedFile);
          }
          reader.readAsDataURL(file); 
        }
      }
    }
  };
  parseRum(rumFile) {
    if(rumFile.name.includes('.rum')) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.parsedFiles = JSON.parse(reader.result);
        this.renderParsedFiles();
      }
      reader.readAsText(rumFile); 
    }
  };
  rumFromParsedFiles(name) {
    let file = new File([JSON.stringify(this.parsedFiles)], `${name}.rum`);
    this.downloadFile(file)
  };
  downloadFile(file) {
    let a = URL.createObjectURL(file)//<-- REMEMBER TO GARBAGE COLLECT THIS ???
    this.anchor.href = a;
    this.anchor.download = file.name
    this.anchor.click()
  };
  rumToParsedFiles(rumFile) {
    // load a .rum file onto parsedFiles 
    let file = rumFile;

    let reader = new FileReader();
    reader.onload = (e) => {
      this.parsedFiles = JSON.parse(reader.result)
    }
    reader.readAsDataURL(file); 
  };
  renderParsedFiles() {
    for(let i = 0; i < this.parsedFiles.length; i++) {
      this.rumBlobToEntity(this.parsedFiles[i]);
    }
  }
  rumBlobToEntity(rumBlob) {
    let entity = document.createElement('a-image')
    entity.setAttribute('src', rumBlob.dataURL)
    entity.setAttribute('position', rumBlob.position)
    this.sceneEntities.push(entity)
    document.querySelector('a-scene').appendChild(entity)
  };
}

window.bot = new Robot()
const button = document.querySelector('#download-button')
button.onclick = () => window.bot.rumFromParsedFiles();