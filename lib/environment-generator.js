/* global AFRAME */
/* eslint max-classes-per-file: ["error", 10] */
// eslint-disable-next-line import/extensions
import { randGrassColor, randCloudColor } from './color-generator.js';

const environmentElem = document.querySelector('#environment-element');

// height (y-value) at which clouds are created
const CLOUD_HEIGHT = 8;
const SNOWFLAKE_RADIUS = 0.1;

AFRAME.registerComponent('falling', {
  schema: {
    tickDistance: { type: 'number', default: 0.005 },
  },
  init() {
    this.pos = this.el.object3D.position;
  },
  tick() {
    if (this.pos.y < -SNOWFLAKE_RADIUS) {
      this.el.object3D.position.y += CLOUD_HEIGHT;
    } else {
      this.el.object3D.position.y -= this.data.tickDistance;
    }
  },
});

class BaseEntity {
  constructor(config = {}) {
    this.element = document.createElement(config.element || 'a-entity');
    this.element.setAttribute('material', 'shader: flat');
    this.element.setAttribute('position', `${config.pos_x} ${config.pos_y} ${config.pos_z}`);
  }
}

class CloudSphere extends BaseEntity {
  constructor(config = {}) {
    super({ ...config, element: 'a-sphere' });
    this.element.setAttribute('color', randCloudColor());
  }
}

class FallingSnowball extends CloudSphere {
  constructor(config = {}) {
    super({ ...config });
    this.element.setAttribute('opacity', 0.5);
    this.element.setAttribute('radius', SNOWFLAKE_RADIUS * (0.8 + 0.4 * Math.random()));
    this.element.setAttribute('falling', '');
  }
}

class Cloud extends CloudSphere {
  constructor(config = {}) {
    super({ ...config, element: 'a-sphere' });
    this.element.setAttribute('radius', 1 + Math.random() * 0.4);
  }
}

class FloorPlane extends BaseEntity {
  constructor(config = {}) {
    super({ ...config, element: 'a-plane' });
    this.element.setAttribute('color', config.color || randGrassColor());
    this.element.setAttribute('rotation', '-90 0 0');
  }
}

// floor
for (let x = -10; x <= 10; x += 1) {
  for (let z = -10; z <= 10; z += 1) {
    const floorPlane = new FloorPlane({
      pos_x: x,
      pos_y: 0,
      pos_z: z,
    });
    environmentElem.appendChild(floorPlane.element);
  }
}

// falling snow
for (let x = -4; x <= 4; x += 1) {
  for (let y = 0; y <= CLOUD_HEIGHT; y += 1) {
    const snowBall = new FallingSnowball({
      pos_x: x + Math.random() - 0.5,
      pos_y: y + Math.random() - 0.5,
      pos_z: -10 + Math.random() - 0.5,
    });
    environmentElem.appendChild(snowBall.element);
  }
}

// clouds
for (let i = -4.5; i <= 4.5; i += 0.5) {
  const cloud = new Cloud({
    pos_x: i + Math.random() - 0.5,
    pos_y: CLOUD_HEIGHT + Math.random() - 0.5,
    pos_z: -10 + Math.random() - 0.5,
  });
  environmentElem.appendChild(cloud.element);
}
