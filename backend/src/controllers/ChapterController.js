const mongoose = require('mongoose');
const upload = require("../config/upload");
const fs = require('fs');


const Chapter = require('../models/Chapter');
const Manga = require('../models/Manga');
const { dirname } = require('path');
const valid_user = true;

module.exports = {
    async store(req, res){            
        const { manga_id, number, title } = req.body;

        if(!valid_user){    
            Object.keys(req.files).forEach((i) => {
                let file = req.files[i];                                                    
                fs.unlinkSync('uploads/' + file.filename)              
                
            });

            return res.status(404).json({               
                id: manga_id,
                message: "User cannot be found."               
            });
          
        }

        Manga.findOne({_id: manga_id}, function (err, manga){ 
            if(manga){                
                let jsonString = [];         
                
                Object.keys(req.files).forEach((i) => {
                    let file = req.files[i];

                    let temp = { originalname:  file.originalname,
                                size: file.size,
                                filename: file.filename,
                                url: "http://localhost:3333/files/" + file.filename,
                    }                            
                
                    jsonString.push(JSON.parse(JSON.stringify(temp)));
                    
                });

                console.log(jsonString);

                const chapter = new Chapter({                    
                    manga_id: manga_id,
                    number: number,
                    title: title,
                    imgCollection: [
                            
                    ],
                });

                chapter.imgCollection = jsonString;
            
                

                chapter.save().then(result => {
                    manga.data.push(result._id) 
                    manga.save().then(answer => {

                    }).catch(err =>{
                        Chapter.deleteOne({_id: result._id});
                        Object.keys(req.files).forEach((i) => {
                            let file = req.files[i];   
                            fs.unlinkSync('uploads/' + file.filename)    
                            
                        });
                        console.log(err),
                        res.status(500).json({
                            error: err,
                            message: "Chapter wasn't saved"
                        });
                    });
                    res.status(201).json({
                        message: "Done upload!",
                        chapterAdded: {
                            manga_id: result.manga_id,
                            chapter_id: result._id,
                            number: number,
                            imgCollection: result.imgCollection
                        }
                    })              
                
                }).catch(err => {
                    Object.keys(req.files).forEach((i) => {
                        let file = req.files[i];   
                        fs.unlinkSync('uploads/' + file.filename)    
                        
                    });
                    console.log(err),
                        res.status(500).json({
                            error: err
                        });
                });

            } else{

                Object.keys(req.files).forEach((i) => {
                    let file = req.files[i];
                    fs.unlinkSync('uploads/' + file.filename)
                    
                });
                return res.status(404).json({               
                    id: manga_id,
                    message: "Manga cannot be found."               
                });
            }
        });         
    },


    async update(req, res){        

        const { title, number, chapter_id } = req.body;

        let update = {};

        if(!(title === undefined)){
            update.title = title;
        }      
        
        if(!(number === undefined)){
            update.number = number;
        }


        if(!(chapter_id === undefined)){
            Chapter.findOneAndUpdate({_id: chapter_id}, update, {upsert: true}, function(err, doc) {
                if (err) return res.send(500, {error: err});
                return res.send({message: 'Succesfully saved.', changes: update});
            });


        } else{
            res.status(500).json({
                message: "manga_id undefined",
                               
            });   
         
        }        
    },

   
    async index(req, res){

        const { manga_id, number, chapter_id } = req.query;
       
        let docs;

        if (number){
            (await Chapter.find({ manga_id: manga_id, number: number })).forEach(function (doc){
                docs.push(doc)
            });
        }

        else if (chapter_id){
            (await Chapter.find({ _id: chapter_id })).forEach(function (doc){
                docs.push(doc)
            });     
        }
          
        res.status(200).json({
            message: "Page list retrieved successfully!",
            chapter: docs
            
        });      
    },

    async delete(req, res){

        const { manga_id, chapter_id } = req.query;

        const chapters = await Chapter.deleteMany( { manga_id: manga_id, _id: chapter_id });
        
      
       

        if (chapters.n === 0 ){
            return res.json({ removed: false, chapters: chapters });
        } else{

            Manga.findOne({ _id: manga_id }, function (err, manga){ 
                if(manga){
                    cloneData = [...manga.data];
                    let index = 0;
                    manga.data.forEach(function (pos, i){
                        if(pos === chapter_id){
                            index = i;
                            break;
                        }
                          
                    })
                    cloneData.slice(index, 1);
                } else{
                    return res.json({ error: err });
                }
               
               
            });

            await Manga.updateOne({ _id: manga_id }, { data: cloneData });


            return res.json({ removed: true, chapters: chapters });
        }

        
    }
}

