const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("connected to db");
})
.catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/majorproject");
}

const initdb =async()=>{
   
    await Listing.deleteMany({});
   initdata.data=initdata.data.map((obj)=>({...obj,owner:"6824b21efb3fb55afd836ffa"}));
    await Listing.insertMany(initdata.data);
}
initdb();
