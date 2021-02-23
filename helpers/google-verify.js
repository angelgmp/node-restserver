
//Se copió de la página de google
//https://developers.google.com/identity/sign-in/web/backend-auth
//y se modificó
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

const googleVerify = async( id_token = '' ) => {

  const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  //En el payload viene toda la información del usuario
  //const payload = ticket.getPayload();

  //Se extrae el userID
  //const userid = payload['sub'];
  
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  //return payload;

  //Desestructuramos lo que nos interesa del payload
  //(que viene de Google)
  //En el modelo, tienen nombre en español
  //(nombre, img, correo), pero la información de Google
  //viene en inglés
  //Asi renombramos lo que desesctucturamos, para
  //que tengan el nombre como en nuestro modelo
  //nombre, img y correo
  const { name: nombre, 
          picture: img,
          email: correo 
        } = ticket.getPayload();

  //return { name, picture, email };

  //Entonces ahora no tengo name, tengo nombre, no tengo picture, tengo img, no tengo email, tengo correo
  return { nombre, img, correo };
}

module.exports = {
    googleVerify
}

