const AWS = require('aws-sdk')

function uploadToS3(file,fileName){
    let s3Bucket = new AWS.S3({
        accessKeyId:process.env.IAM_USER_KEY,
        secretAccessKey:process.env.IAM_SECRET_KEY,
    }) 
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: file,
        ACL: 'public-read'
    }
    return new Promise((resolve,reject)=>{
        s3Bucket.upload(params,(err,S3response) =>{
            if(err){
                console.log('ERR in S3_BUCKET.UPLOAD',err)
                reject(err)
            }
            else{
                console.log('S3 UPLOAD SUCCESSFUL')
                resolve(S3response.Location)
            }
        })
    })
}

module.exports={
    uploadToS3
}