const { Router } = require('express') 
const router = Router()

router.post('/login', (req, res) => {
    if (!req.body.user) res.status(400).json({"error":"no user name"})
    if (!req.body.pass) res.status(400).json({"error":"no password"})
    
    console.log("/login")

    fs = require('fs')
    fs.readFile('./static/users.txt', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return;
        }
        
        let userFound = data.replace(/\r/g, '').split('\n').filter(line => {
            let user = line.split(':')[0]
            let pass = line.split(':')[1]

            if (req.body.user == user &&
                req.body.pass == pass) 
                    return true
            return false
        })
        
        if ((userFound || []).length > 0) 
            res.status(200).json({logged: true})
        else
            res.status(200).json({logged: false})
        
    })
  
})

module.exports = router