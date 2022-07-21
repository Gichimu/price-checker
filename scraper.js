const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://www.jumia.co.ke/catalog/?q=phones";

// const productArray = [
//     { description: "", price: "", link: ""}
// ];

const products = [];

async function scrape() {
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const item = $("div .prd");

  $(item)
    .find("a")
    .each((index, product) => {
      var product = {
        description: $(product).find("div.info > h3").text().trim(),
        imageUrl: $(product).find("div.img-c").find("img").attr('src'),
        price: parseInt(
          $(product)
            .find("div.info > .prc")
            .text()
            .replace(/[KSh,]/g, "")
        ),
        link: "https://www.jumia.co.ke" + $(product).attr("href"),
      };
      if (product.description != "") {
        products.push(product);
      }
    });
  console.log(products);
}

scrape();
