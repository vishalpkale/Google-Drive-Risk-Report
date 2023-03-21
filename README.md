# jarviot-challenge-full-stack

## Steps to run the code</br> 
1.Just run the server</br>
2.This app contain 3 Apis, the endpoints are  "/autheticate", "/getfiles", "/revokeToken", first of all call the first "/autheticate" API,</br>
You don't need to pass anything in params,headers,query params,etc.
3.Now call the Second API "/getfiles", In this call also you don't need to pass anything anyware.</br>
by calling "/getfiles" api,you get the response with all the files of client with "riskCounter", "publicFiles", "filesSharedWithPeoples"  and the entired files combined).</br> 
4.If client want to stop to use the Drive Risk management App then the last API helps you i.e. "/revokeToken", this api revoke the access of clients Drive also delete the saved token in our database

