
module.exports = progress_middleware

function progress_middleware(req, res, next){
    let progress = 0;
    let fileSize = req.headers['content-length'] ? parseInt(req.headers['content-length']) : 0;
    
    // set event listener

    req.on('data', (chunk) => {        
        progress += chunk.length;
        //res.write((`${Math.floor((progress * 100) / fileSize)} `));
        if (progress === fileSize) {
            console.log('Finished', progress, fileSize)
        } else {
            console.log(`Sending ${Math.floor((progress * 100) / fileSize)}% `)
        }
    });

    // invoke next middleware
    next();
}
