import { subTopicsSchema } from "../models/circleSchema";

export const randomSelector = async (
  data: Array<subTopicsSchema>,
  n: number
) => {
  let randomArray = [];
  let _data: Array<subTopicsSchema> = [];
  let i = 0;
  while (i < n) {
    let rand = randomIntFromInterval(0, data.length);
    if (randomArray.includes(rand)) {
      continue;
    }
    randomArray.push[rand];
    _data.push(data[rand]);
    i++;
  }
  return _data;
};

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
