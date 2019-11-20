import { Sprite } from "kontra";
import { getDistance, random, imageFromSvg } from "./utils.js";
import droneSvg from "./images/drone.svg";
import droneFollowSvg from "./images/droneFollow.svg";

const droneImage = imageFromSvg(droneSvg);
const droneFollowImage = imageFromSvg(droneFollowSvg);

export const createDrone = (player, wayPoints) => {
  return Sprite({
    width: 60,
    height: 60,
    wayPoints: wayPoints,
    target: null,
    image: droneImage,
    SPEED: random(1) / 2 + 1,
    PLAYER_FOLLOW_DISTANCE: random(600) + 100,

    update() {
      this.advance();
      let xDiff = 0,
        yDiff = 0;

      if (!this.target) {
        this._pickTarget();
      }

      if (
        !(player.isDead() || player.isSwirling()) &&
        getDistance(this, player) < this.PLAYER_FOLLOW_DISTANCE
      ) {
        xDiff = player.x - this.x;
        yDiff = player.y - this.y;
        this.image = droneFollowImage;
      } else if (this.target) {
        this.image = droneImage;
        if (getDistance(this, this.target) > 200) {
          xDiff = this.target.x - this.x;
          yDiff = this.target.y - this.y;
        } else {
          // randomly pick next target
          this._pickTarget();
        }
      }

      this.dx = Math.sign(xDiff) * this.SPEED;
      this.dy = Math.sign(yDiff) * this.SPEED;
    },

    _pickTarget() {
      this.target = wayPoints[Math.floor(random(100)) % wayPoints.length];
    },

    hit() {},

    render() {
      this.context.save();
      this.context.translate(this.x, this.y);
      this.context.drawImage(this.image, 0, 0);
      this.context.restore();
    },

    collidesWith(object) {
      const xMargin = 20;
      const yMargin = 20;
      return (
        this.x < object.x + object.width - xMargin &&
        this.x + this.width - xMargin > object.x &&
        this.y < object.y + object.height - yMargin &&
        this.y + this.height - yMargin > object.y
      );
    }
  });
};
