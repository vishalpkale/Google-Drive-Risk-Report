const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const userModel=require('../model/userModel')
const axios=require('axios')


const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.photos.readonly'];


const credentials=require('./../../credentials.json')
const client_id = credentials.web.client_id;

// const client_secret = credentials.web.client_secret;
// const redirect_uris = credentials.web.redirect_uris;

// const OAuth2Client=new google.auth.OAuth2(client_id,client_secret,redirect_uris[0])
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');



async function authenticateUser(req,res){
try{
 
  console.log(CREDENTIALS_PATH)
  const authorised= await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })
  console.log(authorised.credentials,req.ip)
  const credentials=authorised.credentials
  const ip=req.ip

  const saveCredentials=await userModel.create({credentials,ip})

  return res.status(201).send({status:true,message:"token created",access_token:credentials.access_token})
  
}
catch(error){
  return res.status(500).send({status:false,err:error.message})
}
}



async function getfiles(req,res){
  try {
     const ip=req.ip;
    
     
     const checkuser=await userModel.findOne({ip})
     if(!checkuser){
      return res.status(401).send({status:false,message:"Please autheticate first, if you already authenticated then check access_token and try again"})
     }
     const access_token=checkuser.credentials.access_token

     const headers = {
      'Authorization': `Bearer ${access_token}`
    };
    const url="https://www.googleapis.com/drive/v3/files?key=AIzaSyBfPOyVVNTSCKs1y-CgQQNGqLwdAxLvXu0HTTP/1.1"

    const params = {
      q: "trashed = false",
      fields: "files(id, name, size, owners(emailAddress,displayName,me),mimeType,webViewLink , shared, permissions)"
    };
     
  const response =await axios.get(url, { headers ,params})
  let  files = response.data.files;

  //stroring public files separetes
  let publicFiles=files.filter((file)=>{
    return file.permissions[0].id=="anyoneWithLink"
  })

  let privatefiles=0
  files.forEach((file)=>{
    if(!file.shared){
      privatefiles++
    }
  })

  let filesSharedWithPeoples=files.filter((file)=>{
    if(file.shared){
      return file.permissions[0].id!=="anyoneWithLink"
    }
  })
  ///adding new key sharedWith(it contains the number of people that can access to that perticular file)
  filesSharedWithPeoples.map((file)=>{
    file['sharedWith']=file.permissions.length-1
  })

  let riskCounter=((files.length-privatefiles)/files.length)*100
 
  return res.status(200).send({status:true,message:"file List",riskCounter:riskCounter+'%', publicfiles:publicFiles, filesSharedWithPeoples:filesSharedWithPeoples, data:files})

} catch(error){
    return res.status(500).send({status:false,err:error.message})
  }
}



async function revokeToken(req,res) {
  try {
    const ip=req.ip;
    const checkuser=await userModel.findOne({ip})
    const access_token=checkuser.credentials.access_token
    
  const url = 'https://accounts.google.com/o/oauth2/revoke';

  const params = {
    token: access_token,
    client_id: client_id
  };

  
    await axios.post(url, null, { params });
    console.log('Access token revoked');
    await userModel.findOneAndDelete({'ip':ip})
    return res.redirect("http://localhost:2021")
  } catch(error){
    return res.status(500).send({status:false,err:error.message})
  }
}











module.exports= {authenticateUser,getfiles,revokeToken}

































// /**
//  * Reads previously authorized credentials from the save file.
//  *
//  * @return {Promise<OAuth2Client|null>}
//  */
// async function loadSavedCredentialsIfExist() {
//   try {
//     const content = await fs.readFile(TOKEN_PATH);
//     const credentials = JSON.parse(content);
//     return google.auth.fromJSON(credentials);
//   } catch (err) {
//     return null;
//   }
// }

// /**
//  * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: 'authorized_user',
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });
//   await fs.writeFile(TOKEN_PATH, payload);
// }

// /**
//  * Load or request or authorization to call APIs.
//  *
//  */
// async function authorize() {
//   let client = await loadSavedCredentialsIfExist();
//   if (client) {
//     return client;
//   }
//   client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH,
//   });
//   if (client.credentials) {
//     await saveCredentials(client);
//   }
//   return client;
// }

// /**
//  * Lists the names and IDs of up to 10 files.
//  * @param {OAuth2Client} authClient An authorized OAuth2 client.
//  */

//  var aa=["1"]
// async function listFiles(authClient) {
    
//   const drive = google.drive({version: 'v3', auth: authClient});
//   const res = await drive.files.list({
//     pageSize: 10,
//     fields: 'nextPageToken, files(id, name)',
//   });
//   const files = res.data.files;
//   if (files.length === 0) {
//     console.log('No files found.');
//     return;
//   }

//   console.log('Files:');
//   files.map((file) => {
//     aa.push(file)
//     console.log(`${file.name} (${file.id})`,"hii");
//   });
// }


// async function auth(req,res){
//  try {
//     // authorize().then(listFiles.t).catch((err)=>{console.log(err)})

    
//     // https://localhost:3000/userData?code=4/0AWtgzh7MQPj6-ZTIm6JSmc7mc_jC56YpV-CuQwwaq8Z5whJEBRK7hPe4w8mMemOmoCMPog&scope=https://www.googleapis.com/auth/drive.metadata.readonly
//     let filedata= await listFiles(authorize())
 
//     console.log(filedata,"hiiisdss")
//  } catch (error) {
//     res.status(500).send({err:error.message})  
//  }
// }


