const express = require("express")
const app = express()
const md5 = require("md5")
app.use(express.json())

const models = require ("../models/index")
const { request } = require("./member")
const users = models.users

//panggil fungsi auth -> validasi token
const {auth} = require("./login")

//fungsi auth dijadikan middleware
app.use(auth)


//endpoint for get all users
app.get("/", async (request , response) =>{
    let dataUsers =  await users.findAll()
    
    return response.json(dataUsers)
    })
    
    //endpoint add new users 
    app.post("/", (request , response) =>{
        let newUsers ={
            nama: request.body.nama,
            username: request.body.username,
            password: md5(request.body.password),
            role: request.body.role
        }
        users.create(newUsers)
        .then(result =>{
            response.json({
                message: `Data berhasil ditambahkan`
            })
        })
        .catch(error =>{
            response.json({
                message: error.message
            })
        })
    })
    
    //endpoint update data users
    app.put("/:id_users", (request, response)=>{
        //tampung data yang akan diubah
        let data ={
            nama: request.body.nama,
            username: request.body.username,
            password: md5(request.body.password),
            role: request.body.role
        }
    
        //tampung id users
        let parameter ={
            id_users: request.params.id_users
        }
    
        //proses update
        users.update(data, {where:parameter})
        .then(result =>{
            return response.json({
                message:`Data berhasil diubah`,
                data: result
            })
        })
        .catch(error =>{
            return response.json({
                message: error.message
            })
        })
    })
    
    //endpoint hapus data users
    app.delete("/:id_users" , (request,response) =>{
        //tampung data yg akan dihapus
        let parameter = {
            id_users: request.params.id_users
        }
    
        //proses hapus
        users.destroy({where:parameter})
        .then(result =>{
            return response.json({
                message:`Data berhasil dihapus`
            })
        })
        .catch(error=>{
            return response.json({
                message: error.message
            })
        })
    })
    module.exports = app