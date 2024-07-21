"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
// sync():

module.exports = async function () {
  //: The following code line is for development purposes only. When it is active the data will not be loaded.
  // return null;

  //: The following code lines are for development purposes only. When it is active the data will be loaded.
  //: This block of code is used to synchronize the database with the initial data.
  //: Since it is produced randomly, the id values should be hexadecimal and 24 characters.

  /* User */
  const User = require("../models/user");
  await User.deleteMany(); //: !!! Clear collection.
  await User.create({
    _id: "1111aaaa2222bbbb3333a001",
    username: "admin",
    password: "Musco.777",
    email: "admin@site.com",
    firstName: "admin",
    lastName: "admin",
    isActive: true,
    isStaff: true,
    isAdmin: true,
  });
  await User.create({
    _id: "1111aaaa2222bbbb3333a002",
    username: "staff",
    password: "Musco.777",
    email: "staff@site.com",
    firstName: "staff",
    lastName: "staff",
    isActive: true,
    isStaff: true,
    isAdmin: false,
  });
  await User.create({
    _id: "1111aaaa2222bbbb3333a003",
    username: "user",
    password: "MusCo.777",
    email: "user@site.com",
    firstName: "user",
    lastName: "user",
    isActive: true,
    isStaff: false,
    isAdmin: false,
  });

  /* Brand */
  const Brand = require("../models/brand");
  await Brand.deleteMany();

  /* ----------------------- shoes ----------------------- */

  await Brand.create({
    _id: "1111aaaa2222bbbb3333b001",
    name: "Adidas",
    image: "https://logowik.com/content/uploads/images/adidas-new-20225326.jpg",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b002",
    name: "Nike",
    image:
      "https://logowik.com/content/uploads/images/nike-swoosh5938.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b003",
    name: "North Face",
    image: "https://logowik.com/content/uploads/images/the-north-face.jpg",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b004",
    name: "Skechers",
    image: "https://logowik.com/content/uploads/images/skechers-shoes8680.jpg",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b005",
    name: "Salomon",
    image: "https://logowik.com/content/uploads/images/salomon-group7511.jpg",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b006",
    name: "Columbia",
    image:
      "https://logowik.com/content/uploads/images/columbia-sportswear7667.logowik.com.webp",
  });

  /* ----------------------- electronics ----------------------- */

  await Brand.create({
    _id: "1111aaaa2222bbbb3333b007",
    name: "Samsung",
    image:
      "https://logowik.com/content/uploads/images/samsung-black-wordmark5578.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b008",
    name: "Huawei",
    image:
      "https://logowik.com/content/uploads/images/huawei-vertical-flat6195.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b009",
    name: "LG",
    image:
      "https://logowik.com/content/uploads/images/lg-new-20233698.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b010",
    name: "Apple",
    image:
      "https://logowik.com/content/uploads/images/apple-carbon-neutral3283.logowik.com.webp",
  });

  await Brand.create({
    _id: "1111aaaa2222bbbb3333b011",
    name: "Dell",
    image: "https://logowik.com/content/uploads/images/627_dell_logo.jpg",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b012",
    name: "Asus",
    image: "https://logowik.com/content/uploads/images/424_asus.jpg",
  });

  /* ----------------------- clothes ----------------------- */

  await Brand.create({
    _id: "1111aaaa2222bbbb3333b013",
    name: "Tommy",
    image: "https://logowik.com/content/uploads/images/375_tommy_hilfiger.jpg",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b014",
    name: "Under Armour",
    image: "https://logowik.com/content/uploads/images/under-armour.jpg",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b014",
    name: "Jack Wolfskin",
    image:
      "https://logowik.com/content/uploads/images/jack-wolfskin2002.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b015",
    name: "Koton",
    image: "https://logowik.com/content/uploads/images/koton9388.jpg",
  });

  await Brand.create({
    _id: "1111aaaa2222bbbb3333b016",
    name: "Lacoste",
    image:
      "https://logowik.com/content/uploads/images/lacoste-crocodile6472.logowik.com.webp",
  });

  /* ----------------------- home ----------------------- */

  await Brand.create({
    _id: "1111aaaa2222bbbb3333b017",
    name: "Braun",
    image: "https://logowik.com/content/uploads/images/t_982_braun.jpg",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b018",
    name: "Philips",
    image: "https://logowik.com/content/uploads/images/395_philips.jpg",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b019",
    name: "Bosch",
    image:
      "https://logowik.com/content/uploads/images/t_bosch-black8003.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b020",
    name: "Siemens",
    image:
      "https://logowik.com/content/uploads/images/t_siemens-ag7992.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b021",
    name: "Tefal",
    image: "https://logowik.com/content/uploads/images/t_410_tefal.jpg",
  });

  /* ----------------------- beauty ----------------------- */

  await Brand.create({
    _id: "1111aaaa2222bbbb3333b022",
    name: "Davidoff",
    image:
      "https://logowik.com/content/uploads/images/davidoff6517.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b023",
    name: "Hugo Boss",
    image: "https://logowik.com/content/uploads/images/t_966_hugoboss.jpg",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b024",
    name: "Bvlgari",
    image:
      "https://logowik.com/content/uploads/images/bulgari2696.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b025",
    name: "Nivea",
    image: "https://logowik.com/content/uploads/images/t_239_nivea.jpg",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b026",
    name: "Loreal",
    image:
      "https://logowik.com/content/uploads/images/t_loreal2662.logowik.com.webp",
  });

  /* ----------------------- accessories ----------------------- */

  await Brand.create({
    _id: "1111aaaa2222bbbb3333b027",
    name: "Fossil",
    image:
      "hhttps://logowik.com/content/uploads/images/t_siemens-ag7992.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b028",
    name: "Rayban",
    image:
      "https://logowik.com/content/uploads/images/t_ray-ban9478.logowik.com.webp",
  });

  await Brand.create({
    _id: "1111aaaa2222bbbb3333b029",
    name: "Gucci",
    image: "https://logowik.com/content/uploads/images/t_493_gucci.jpg",
  });

  /* ----------------------- Tools ----------------------- */

  await Brand.create({
    _id: "1111aaaa2222bbbb3333b030",
    name: "Stanley",
    image:
      "https://logowik.com/content/uploads/images/stanley-hand-tools2014.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b031",
    name: "Makita",
    image:
      "https://logowik.com/content/uploads/images/t_makita5486.logowik.com.webp",
  });
  await Brand.create({
    _id: "1111aaaa2222bbbb3333b032",
    name: "Metabo",
    image:
      "https://logowik.com/content/uploads/images/t_metabo-no-tagline8054.logowik.com.webp",
  });

  /* Category */
  const Category = require("../models/category");
  await Category.deleteMany();
  await Category.create({
    _id: "1111aaaa2222bbbb3333c001",
    name: "Electronics",
  });
  await Category.create({
    _id: "1111aaaa2222bbbb3333c002",
    name: "Home Appliances",
  });
  await Category.create({
    _id: "1111aaaa2222bbbb3333c003",
    name: "Clothes",
  });
  await Category.create({
    _id: "1111aaaa2222bbbb3333c004",
    name: "Shoes",
  });
  await Category.create({
    _id: "1111aaaa2222bbbb3333c005",
    name: "Beauty",
  });
  await Category.create({
    _id: "1111aaaa2222bbbb3333c006",
    name: "Tools",
  });
  await Category.create({
    _id: "1111aaaa2222bbbb3333c007",
    name: "Accessories",
  });

  /* Firm */
  const Firm = require("../models/firm");
  await Firm.deleteMany();
  await Firm.create({
    _id: "1111aaaa2222bbbb3333f001",
    name: "Boyner",
    phone: "00902124442222",
    image: "https://logowik.com/content/uploads/images/t_242_boyner.jpg",
    address: {
      city: "Istanbul",
      country: "Türkiye",
    },
  });
  await Firm.create({
    _id: "1111aaaa2222bbbb3333f002",
    name: "Flo",
    phone: "00902125150019",
    image: "https://logowik.com/content/uploads/images/t_flo7262.jpg",
    address: {
      city: "Istanbul",
      country: "Türkiye",
    },
  });
  await Firm.create({
    _id: "1111aaaa2222bbbb3333f003",
    name: "Hepsiburada",
    phone: "00902123330001",
    image: "https://logowik.com/content/uploads/images/t_hepsiburada1183.jpg",
    address: {
      city: "Istanbul",
      country: "Türkiye",
    },
  });
  await Firm.create({
    _id: "1111aaaa2222bbbb3333f004",
    name: "Trendyol",
    phone: "00902124447700",
    image:
      "https://logowik.com/content/uploads/images/t_trendyol6623.logowik.com.webp",
    address: {
      city: "Istanbul",
      country: "Türkiye",
    },
  });
  await Firm.create({
    _id: "1111aaaa2222bbbb3333f005",
    name: "n11",
    phone: "00902124440011",
    image:
      "https://logowik.com/content/uploads/images/t_n11com-yeni7175.logowik.com.webp",
    address: {
      city: "Istanbul",
      country: "Türkiye",
    },
  });
  await Firm.create({
    _id: "1111aaaa2222bbbb3333f006",
    name: "Shopify",
    phone: "0014161234567",
    image: "https://logowik.com/content/uploads/images/t_803_shopify.jpg",
    address: {
      city: "Toronto",
      country: "Canada",
    },
  });
  await Firm.create({
    _id: "1111aaaa2222bbbb3333f007",
    name: "Rakuten",
    phone: "0081312345678",
    image: "https://logowik.com/content/uploads/images/t_rakuten6848.jpg",
    address: {
      city: "Tokyo",
      country: "Japan",
    },
  });
  await Firm.create({
    _id: "1111aaaa2222bbbb3333f008",
    name: "Alibaba Group",
    phone: "008621612345678",
    image: "https://logowik.com/content/uploads/images/t_alibaba-group4891.jpg",
    address: {
      city: "Shanghai",
      country: "China",
    },
  });
  await Firm.create({
    _id: "1111aaaa2222bbbb3333f009",
    name: "Kaufhof",
    phone: "00496912345678",
    image:
      "https://logowik.com/content/uploads/images/t_kaufhof5903.logowik.com.webp",
    address: {
      city: "Frankfurt",
      country: "Germany",
    },
  });

  /* Product */
  const Product = require("../models/product");
  await Product.deleteMany();
  await Product.create({
    _id: "65343222b67e9681f937f421",
    name: "Tommy",
    categoryId: "65343222b67e9681f937f203",
    brandId: "65343222b67e9681f937f107",
    quantity: 0,
  });
  await Product.create({
    _id: "65343222b67e9681f937f422",
    name: "Link",
    categoryId: "65343222b67e9681f937f202",
    brandId: "65343222b67e9681f937f123",
    quantity: 910,
  });
  await Product.create({
    _id: "65343222b67e9681f937f423",
    name: "Cola Turka",
    categoryId: "65343222b67e9681f937f202",
    brandId: "65343222b67e9681f937f123",
    quantity: 750,
  });
  await Product.create({
    _id: "65343222b67e9681f937f426",
    name: "Rondo",
    categoryId: "65343222b67e9681f937f201",
    brandId: "65343222b67e9681f937f123",
    quantity: 900,
  });
  await Product.create({
    _id: "65343222b67e9681f937f201",
    name: "Iphone 14 Pro",
    categoryId: "65343222b67e9681f937f204",
    brandId: "65343222b67e9681f937f131",
    quantity: 0,
  });

  /* Purchase */
  const Purchase = require("../models/purchase");
  await Purchase.deleteMany();
  await Purchase.create({
    _id: "65343222b67e9681f937f513",
    userId: "65343222b67e9681f937f001",
    firmId: "1111aaaa2222bbbb3333f003",
    brandId: "65343222b67e9681f937f123",
    productId: "65343222b67e9681f937f422",
    quantity: 1000,
    price: 20,
  });
  await Purchase.create({
    _id: "65343222b67e9681f937f514",
    userId: "65343222b67e9681f937f001",
    firmId: "1111aaaa2222bbbb3333f003",
    brandId: "65343222b67e9681f937f123",
    productId: "65343222b67e9681f937f423",
    quantity: 1000,
    price: 30,
  });
  await Purchase.create({
    _id: "65343222b67e9681f937f516",
    userId: "65343222b67e9681f937f001",
    firmId: "1111aaaa2222bbbb3333f003",
    brandId: "65343222b67e9681f937f123",
    productId: "65343222b67e9681f937f426",
    quantity: 1000,
    price: 5,
  });
  await Purchase.create({
    _id: "65343222b67e9681f937f519",
    userId: "65343222b67e9681f937f002",
    firmId: "1111aaaa2222bbbb3333f007",
    brandId: "65343222b67e9681f937f104",
    productId: "65343222b67e9681f937f422",
    quantity: 10,
    price: 100,
  });
  await Purchase.create({
    _id: "65343222b67e9681f937f520",
    userId: "65343222b67e9681f937f001",
    firmId: "1111aaaa2222bbbb3333f004",
    brandId: "65343222b67e9681f937f131",
    productId: "65343222b67e9681f937f201",
    quantity: 10,
    price: 2500,
  });

  /* Sale */
  const Sale = require("../models/sale");
  await Sale.deleteMany();
  await Sale.create({
    _id: "65343222b67e9681f937f614",
    userId: "65343222b67e9681f937f001",
    brandId: "65343222b67e9681f937f123",
    productId: "65343222b67e9681f937f422",
    quantity: 100,
    price: 30,
  });
  await Sale.create({
    _id: "65343222b67e9681f937f615",
    userId: "65343222b67e9681f937f001",
    brandId: "65343222b67e9681f937f123",
    productId: "65343222b67e9681f937f423",
    quantity: 250,
    price: 40,
  });
  await Sale.create({
    _id: "65343222b67e9681f937f617",
    userId: "65343222b67e9681f937f001",
    brandId: "65343222b67e9681f937f123",
    productId: "65343222b67e9681f937f426",
    quantity: 100,
    price: 6,
  });
  await Sale.create({
    _id: "65343222b67e9681f937f624",
    userId: "65343222b67e9681f937f001",
    brandId: "65343222b67e9681f937f131",
    productId: "65343222b67e9681f937f427",
    quantity: 10,
    price: 3500,
  });

  /* Finished */
  console.log("* Synchronized.");
};
