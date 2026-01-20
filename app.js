// if(process.env.NODE_ENV != "production"){
//     require('dotenv').config();
// }
require('dotenv').config();
// =====================
// REQUIRING PACKAGES
// =====================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const {MongoStore} = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Models
const User = require("./models/user");
const Listing = require("./models/listing");
const Review = require("./models/review");

// Utils
const ExpressError = require("./utils/ExpressError");

// =====================
// VIEW ENGINE
// =====================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =====================
// DATABASE
// =====================
const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(process.env.ATLASDB_URL)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// =====================
// SESSION
// =====================
const store = new MongoStore({
    mongoUrl : process.env.ATLASDB_URL,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
})
store.on("error",(err)=>{
    console.log("Error in MONGO SESSION STORE",err);
})
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionOption));
app.use(flash());

// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const geocodingClient = mbxGeocoding({
//   accessToken: process.env.MAP_TOKEN
// });

// =====================
// MIDDLEWARE
// =====================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// =====================
// PASSPORT CONFIG
// =====================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =====================
// FLASH LOCALS
// =====================
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.mapToken = process.env.MAP_TOKEN; // ✅ ADD THIS
    next();
});

// =====================
// ROUTES
// =====================
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/user");

// app.get("/", (req, res) => {
//     res.send("Hello");
// });



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

// =====================
// ERROR HANDLING
// =====================
app.use((req, res, next) => {
     next(new ExpressError(404, "Page Not Found"));
 });


 app.use((err, req, res, next) => {
     const statusCode = err.statusCode || 500;
     const message = err.message || "Something went wrong";
     res.status(statusCode).render("error.ejs", { message });
 });

// =====================
// SERVER
// =====================
app.listen(8080, () => {
    console.log("App listening on port 8080");
});
