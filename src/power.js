import { Sprite } from "kontra";
import { imageFromSvg, random } from "./utils.js";
import sunSvg from "./images/sun.svg";

const sunImage = imageFromSvg(sunSvg);

export const createSun = () => {
  return Sprite({
    width: 30,
    height: 40,
    color: "black",
    dx: random(6) + 1,
    image: sunImage,

    render() {
      this.context.save();
      this.context.translate(this.x, this.y);
      this.context.drawImage(this.image, 0, 0);
      this.context.restore();
    },
    collidesWith(object) {
      //const xMargin = 10;
      const yMargin = 20;
      return (
        this.x < object.x + object.width &&
        this.x + this.width > object.x &&
        this.y < object.y + object.height - yMargin &&
        this.y + this.height - yMargin > object.y
      );
    },
  });
};
