const axios = require("axios");
const cheerio = require("cheerio");

const carrefour = "https://www.carrefour.ke/mafken/en/v4/search?keyword=fridge";

async function scrapeCarrefour() {
  const { data } = await axios.get(carrefour);

  const $ = cheerio.load(data);

  const item = $("div .css-11qbfb");

//   console.log($(item).find("div .css-11qbfb > div .css-1ian0zx > div .css-2a09gr > div .css-17fvam3").text());

console.log(item)
}
 

scrapeCarrefour();