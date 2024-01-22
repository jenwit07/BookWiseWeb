# Welcome to Obiwan Backoffice

Obiwan Backoffice is an web frontend boilerplate. using Express.JS and React

# Permission Fix

สำหรับแก้ Permission มี 2 ที่
1.file routes.js
  // const access = permissions.includes('*') || permissions.includes(path);
  const access = true
  
 2.filer=> menu.js
 
# Add New Route
1.menu.js route สำหรับมีบน sidemenu
2.otherRoutes.js สำหรับไม่เอาขึ้น sidemenu


access token expired => /v1/token/refresh invork new token (Error 401)
{
    "code": "1001",
    "message": "TokenExpiredError: Access Token Expired"
}

refresh token expired => redirect to login (Error 400)
{
    "code": "1000",
    "message": "TokenExpiredError: Refresh Token was Expired2"
}
