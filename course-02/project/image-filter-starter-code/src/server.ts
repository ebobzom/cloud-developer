import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get( "/filteredimage", async ( req, res ) => {

    // smample image url: https://media.istockphoto.com/photos/mountain-landscape-picture-id517188688

    const image_url: string = req.query.image_url;

    // validating that image url is provided
    if(!image_url){
      return res.status(401).send('image url is required');
    }
   
    try{
      // calling filterImageFromURL(image_url) to filter the image
      const filteredpath: string = await filterImageFromURL(image_url);
      res.status(200).sendFile(filteredpath);

      // deleting the link after 8 seconds if not the browser won't show the image
      setTimeout(() => {
        deleteLocalFiles([filteredpath]);
      }, 8000);
      
    }catch(error){
      return res.status(422).send('An error ocurred, please verify image format and image links do not redirect');
    }
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();