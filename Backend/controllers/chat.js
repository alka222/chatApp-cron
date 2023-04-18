const User = require('../models/user');
const Chat = require('../models/chat');
const s3Service = require('../services/s3Service')

exports.postMessage= async(req, res, next) => {

    try{

        const {message, file} = req.body;
        console.log(req.user);
        console.log(message);
        console.log(file);

        const groupId = req.params.groupId

        const date = new Date();
        const fileName = `Photo_${date}_${req.user}_${groupId}_${file}`;
        
        if(file == ""){
            const fileURL = "";

            const data = await req.user.createChat({message, imageUrl: fileURL, groupId});
            const name = req.user.name;

            const arr = [];
            const details = {
            id: data.id,
            groupId:data.groupId,
            name: req.user.name,
            message: data.message,
            imageUrl: fileURL,
            createdAt: data.createdAt
        }

        arr.push(details);
        return res.status(201).json({arr, message: 'chat message successfully added'});
        }

        const fileURL = await s3Service.uploadToS3(file, fileName);
        console.log(fileURL)

        if(!message && !groupId || !file && !groupId ){
            return res.status(400).json({message: 'nothing entered'});
        }

        const data = await req.user.createChat({message, imageUrl: fileURL, groupId});
        const name = req.user.name;

        const arr = [];
        const details = {
            id: data.id,
            groupId:data.groupId,
            name: req.user.name,
            message: data.message,
            imageUrl: fileURL,
            createdAt: data.createdAt
        }

        arr.push(details);
        res.status(201).json({arr, message: 'chat message successfully added'});

    }

    catch(err){
        res.status(500).json({message: 'unable to add chat message'+ err})
    }
}


exports.getMessage = async(req,res,next)=>{

    try {
        let msgId = req.query.msg ; 
        let groupId = req.params.groupId
        console.log(groupId);
        console.log('///////////////////////////',msgId)

        const data = await Chat.findAll({where:{groupId}});
        console.log(data.length);
        let index = data.findIndex(chat => chat.id == msgId)
        // console.log('.......................',index);
        let messagestosend = data.slice(index+1)
        console.log(messagestosend)
        

        let arr = [];

        for(let i = 0 ; i<messagestosend.length ; i++){

            const user = await User.findByPk(messagestosend[i].userId);

            const details = {
                id :messagestosend[i].id ,
                groupId:messagestosend[i].groupId,
                name:user.name ,
                message:messagestosend[i].message,
                imageUrl:messagestosend[i].imageUrl,
                createdAt:messagestosend[i].createdAt
            }

            arr.push(details)
        }

        res.status(200).json({arr})
    }
    
    catch (err) {
        res.status(500).json({message:'unable to get chats'+err})
    }


} 

// exports.postUploadFile = async (req, res) => {
//     try{
//         console.log(req);
//         const userId = req.user.id;
//         const groupId = req.params.groupId;
//         const file =req.body.uploadFileInput
//         console.log(req.body);
//         const date = new Date();
//         const fileName = `Photo_${date}_${userId}_${groupId}_${file}`;
        
//         const fileURL = await s3Service.uploadToS3(file, fileName);

//         const chat = await req.user.createChat({
//             imageUrl: fileURL,
//             userId,
//             groupId,
//         });
//         res.json({data:chat,data1: req.user})
//     }
//     catch(err)
//     {
//         console.log(err);
//     }
// }
