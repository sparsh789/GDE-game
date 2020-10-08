import { Sprite } from "kontra";
import { imageFromSvg, random } from "./utils.js";
import enemySvg from "./images/enemy.svg";
import enemyHitSvg from "./images/enemy.svg";

const enemyImage = imageFromSvg(enemySvg);
const enemyHitImage = imageFromSvg(enemyHitSvg);

export const createEnemy = platform => {
  return Sprite({
    width: 30,
    height: 80,
    color: "black",
    dx: random(6) + 1,
    image: enemyImage,

    update() {
      this.advance();
      let speed = this.dx;
      if (platform.x + platform.width - this.width < this.x) {
        this.dx = -speed;
      } else if (this.x < platform.x) {
        this.dx = -speed;
      }
    },
    render() {
      this.context.save();
      this.context.translate(this.x, this.y);
      this.context.drawImage(this.image, 0, 0);
      this.context.restore();
    },
    collidesWith(object) {
      const xMargin = 10;
      const yMargin = 20;
      return (
        this.x < object.x + object.width - xMargin &&
        this.x + this.width - xMargin > object.x &&
        this.y < object.y + object.height - yMargin &&
        this.y + this.height - yMargin > object.y
      );
    },
    hit() {
      this.image = enemyHitImage;
      setTimeout(() => {
        this.image = enemyImage;
      }, 1000);
    }
  });
};
