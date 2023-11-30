if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            owner: '652d5d8f278c95a181c46a61',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dictum dolor quis dignissim elementum. Nam venenatis odio non vulputate imperdiet.",
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dru4iyjoq/image/upload/v1697795946/YelpCamp/adayxutlzefzhnr98jwf.jpg',
                    filename: 'YelpCamp/adayxutlzefzhnr98jwf',
                },
                {
                    url: 'https://res.cloudinary.com/dru4iyjoq/image/upload/v1697795953/YelpCamp/hx1rozw3qh3ftljpcjah.jpg',
                    filename: 'YelpCamp/hx1rozw3qh3ftljpcjah',
                }
            ]
        });
        await camp.save();
    }
};

seedDB().then(function () {
    mongoose.connection.close();
});

