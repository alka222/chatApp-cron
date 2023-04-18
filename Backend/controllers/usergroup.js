const User = require('../models/user');
const Chat = require('../models/chat');
const Group = require('../models/group');
const Usergroup = require('../models/usergroup');


exports.fetchUsers = async(req,res,next)=>{
    try {
        let groupId = req.params.groupId ;
        // console.log('...........................' , groupId)
        const group = await  Group.findByPk(groupId)
        if(!group){
            return res.status(404).json({message:"no group found"})
        }
        let users = await group.getUsers()
        let data = users.filter(user => user.id != req.user.id)
        return res.status(200).json(data)
    } catch (err) {
        res.status(500).json({err , message: "some error occured" });
    }
}

exports.addUserToGroup = async(req,res,next)=>{
    const {email, groupId} = req.body
    console.log(email , groupId)
    try {
        if(!email || !groupId){
            return res.status(400).json({message:'enter all fields'})
        }
        let user = await User.findOne({where:{email}});
        let group = await Group.findByPk(groupId);
        if(!user || !group){
            return res.status(404).json({message:'User not found'})
        }
    //    console.log(user);
            const check = await group.hasUser(user);
            console.log(check);
            if(check){
                return res.status(401).json({ message:'user already in group'});
            }
            const data = await group.addUser(user , {through:{isAdmin:false}}) ;
            return res.status(200).json({user , message:'added user to group'});
        //    return res.status(400).json({ message:'user already in group'});
    } catch (error) {
        res.status(500).json({error , message: "some error occured" });
    }
}

exports.isAdmin  = async(req,res,next)=>{
    let groupId = req.params.groupId 
    // console.log('/////////////////////' , groupId)
    try {
        if(!groupId){
            return res.status(400).json({message:'no group id found'})
        }
        let group = await Group.findByPk(groupId);
        if(!group){
            return res.status(404).json({message:'no group found'})
        }
        // console.log('dddddddddddddd')
        let row= await  Usergroup.findOne({where:{userId:req.user.id , groupId:groupId }})
        let isAdmin = row.isAdmin ;
        // console.log(isAdmin)
        return res.status(200).json(isAdmin)
    } catch (err) {
        res.status(500).json({err , message: "some error occured" });
    }
}

exports.removeUserFromGroup = async(req,res,next)=>{
    const {userId , groupId} = req.body;
    // console.log('inside youuuuuuuuuuuuuuuuuuuuuuuuu')
    try {
        if(!userId || !groupId){
            return res.status(400).json({message:'no group id found'})
        }
        let row= await  Usergroup.findOne({where:{userId:req.user.id, groupId:groupId }})
        let isAdmin = row.isAdmin ;
        if(!isAdmin){
            return res.status(402).json({message:'not admin' })
        }

        let user = await User.findByPk(userId);
        let group = await Group.findByPk(groupId);
        if(!user || !group ){
            return res.status(404).json({message:'no group or user found' })
        }
        let result = await group.removeUser(user);
        console.log('uuuuuuuuuuuuuuu' , result)
        if(!result){
            return res.status(401).json({message:'unable to remove user' })
        }
        return res.status(200).json({user , message:"user removed"})

    } catch (err) {
        res.status(500).json({err , message: "some error occured" });
    }
}

exports.makeAdmin = async(req,res,next)=>{
    const {userId , groupId} = req.body;
    // console.log('inside youuuuuuuuuuuuuuuuuuuuuuuuu')
    try {
        if(!userId || !groupId){
            return res.status(400).json({message:'no group id found'})
        }
        let row= await  Usergroup.findOne({where:{userId:req.user.id, groupId:groupId }})
        let isAdmin = row.isAdmin ;
        if(!isAdmin){
            return res.status(402).json({message:'not admin' })
        }

        let user = await User.findByPk(userId);
        let group = await Group.findByPk(groupId);

        if(!user || !group ){
            return res.status(404).json({message:'no group or user found' })
        }
        let result = await group.addUser(user , {through:{isAdmin:true}});
        // console.log('uuuuuuuuuuuuuuu' , result)
        if(!result){
            return res.status(401).json({message:'unable to make admin' })
        }
        return res.status(200).json({user , message:"user is admin now"})

    } catch (err) {
        res.status(500).json({err , message: "some error occured" });
    }
}

exports.removeAdmin = async(req,res,next)=>{
    const {userId , groupId} = req.body;
    // console.log('inside youuuuuuuuuuuuuuuuuuuuuuuuu')
    try {
        if(!userId || !groupId){
            return res.status(400).json({message:'no group id found'})
        }
        let row= await  Usergroup.findOne({where:{userId:req.user.id, groupId:groupId }})
        let isAdmin = row.isAdmin ;
        if(!isAdmin){
            return res.status(402).json({message:'not admin' })
        }

        let user = await User.findByPk(userId);
        let group = await Group.findByPk(groupId);

        if(!user || !group ){
            return res.status(404).json({message:'no group or user found' })
        }
        let result = await group.addUser(user , {through:{isAdmin:false}});
        // console.log('uuuuuuuuuuuuuuu' , result)
        if(!result){
            return res.status(401).json({message:'unable to make admin' })
        }
        return res.status(200).json({user , message:"user is admin now"})

    } catch (err) {
        res.status(500).json({err , message: "some error occured" });
    }
}