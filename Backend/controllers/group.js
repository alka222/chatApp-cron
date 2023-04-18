const Group = require('../models/group');
const User = require('../models/user')
const Usergroup = require('../models/usergroup') 

exports.getGroups = async(req,res,next)=>{

    try {
        // let data = await req.user.getGroups()

        let groups = await Usergroup.findAll({where:{userId:req.user.id}})
        let data = []
        for(let i = 0 ; i< groups.length ; i++){
            let group = await Group.findByPk(groups[i].groupId);
            data.push(group);
        }
        if(!data){
            res.status(404).json({message:"no data found"})
        }
        res.status(200).json({data , message:"found groups"})
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.createGroup = async(req,res,next)=>{
    const{group} = req.body ;
    try {
        if(!group){
            res.status(404).json({message:"no name entered"})
        }
        let data = await req.user.createGroup({name:group} , {through: {isAdmin:true}})
        console.log(data) 
        res.status(201).json({ message:'successfully created new group'})
    } catch (err) {
        return res.status(500).json(err)
    }
}