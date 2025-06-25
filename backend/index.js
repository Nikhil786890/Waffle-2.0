import express from "express";
import cors from "cors";//we are adding cors middleware here so that the frontend running on the port 3000 can make requests to the server port 5k which is a express server
import fetch from "node-fetch";


//here we are importing express module from "express " package.
const app =express();

app.use(cors());

const port = process.env.PORT || 5000;

//port 5000 as on port 3000 client app will run


//when there is a get request from the frontend at the route= /suggestions ,it will send the data to the frontend in a json(js obj notation) format as a respnse
// app.get("/suggestions",(req,res)=>{
//     const data=['react','MongoDB','node','sql','banana', 'cherry', 'date', 'fig', 'grape', 'kiwi', 'mango', 'papaya', 'peach'];
//     console.log(data);
//     res.json(data); ,peivete api

// })
//this is the endpoint for getting the books by their titles,this get req loads the page localhost:5000/openlibrary
//then fetches the content from url given which contains all the info related to harry potter the book title,author and category,then the response is recieved which is in a 
//raw form which is converted into a json format then that data is formatted that only the book titles related to harry potter is shown : data.docs.map((item) => item.title)
//idhar woh results open lib website se fetch karke localhost:5000/openlibarray pr layega ,the backend server fetches the result form api (the url )
//simplifies it and then sents it to the localhost/openlibrary route which is recieved by the frontened
app.get('/openlibrary',(req,res)=>{
  const q = req.query.q ? req.query.q :"" ;//this means value of the q from the query,in the req
  //ternary operator

  if (!q) {
    return res.status(400).json({error:'Query is missing'})

  }


  
  fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`)
    .then((response) => response.json()) 
    .then((data) => {
      // Transform the data
      const simplified = data.docs.map((item) => item.title);
      res.json(simplified);

    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({error:'Failed to fetch from Open Library'})
    });
});


app.listen(port, () =>{
    console.log(`Server running on port ${port}.`);
})
//here the code means that the when the port is ready it will call the callback function
