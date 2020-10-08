import { random } from "./utils.js";

export const createCamera = (level, canvas) => {
  return {
    x: 0,
    y: 0,
    zoom: 1,
    shakePower: 0,
    shakeDecay: 0,

    follow(target) {
      this.zoom = 1;
      this.target = target;
    },

    zoomToLevel() {
      this.target = null;

      this.x = level.left + level.width / 2;
      this.y = level.top + level.height / 2;

      if (level.width / level.height >= canvas.width / canvas.height) {
        this.zoom = canvas.width / level.width;
      } else {
        this.zoom = canvas.height / level.height;
      }
    },

    shake(power = 8, length = 0.5) {
      this.shakePower = power;
      this.shakeDecay = power / length;
    },

    update() {
      if (this.target) {
        this._fitZoom();
        this._follow();
      }

      this._shake();
    },

    _shake() {
      const { shakePower } = this;

      if (shakePower <= 0) {
        return;
      }

      this.x += random(shakePower * 2) - shakePower;
      this.y += random(shakePower * 2) - shakePower;

      this.shakePower -= this.shakeDecay * (1.0 / 60);
    },

    _fitZoom() {
      const zoomedWidth = level.width * this.zoom;
      const zoomedHeight = level.height * this.zoom;

      // Zoom such that camera stays within the level.
      if (zoomedWidth < canvas.width || zoomedHeight < canvas.height) {
        this.zoom = Math.max(
          canvas.width / level.width,
          canvas.height / level.height
        );
      }
    },

    _follow() {
      let x = this.target.x + this.target.width;
      let y = this.target.y + this.target.height;

      const viewAreaWidth = canvas.width / this.zoom;
      const viewAreaHeight = canvas.height / this.zoom;

      // Keep camera within level in x-direction.
      if (x - viewAreaWidth / 2 < level.left) {
        x = level.left + viewAreaWidth / 2;
      } else if (x + viewAreaWidth / 2 > level.width) {
        x = level.width - viewAreaWidth / 2;
      }

      // Keep camera within level in y-direction.
      if (y - viewAreaHeight / 2 < level.top) {
        y = level.top + viewAreaHeight / 2;
      } else if (y + viewAreaHeight / 2 > level.height) {
        y = level.height - viewAreaHeight / 2;
      }

      this.x = x;
      this.y = y;
    }
  };
};
