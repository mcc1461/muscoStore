# DONE

1. Using EJS as a Templating Engine without directly embedding the HTML in your "res.send" call.
2. We added a "tempBypass flag" to each middleware function (isLogin, isAdmin, isStaff) to temporarily disable permission checks, allowing all requests to pass through without requiring login or specific permissions. This flag can be set to true to bypass checks and easily reverted by setting it back to false.
3. .
