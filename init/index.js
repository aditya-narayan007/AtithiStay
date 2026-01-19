const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Awara");
    console.log("MongoDB connected");
}

main().catch(err => console.log(err));

const initDB = async () => {
    await Listing.deleteMany({});

    const dataWithOwner = initData.data.map(obj => ({
        ...obj,
        owner: "69636313c432731b9f255368" // valid user ID
    }));

    await Listing.insertMany(dataWithOwner);

    console.log("Data initialized");
};

initDB();
