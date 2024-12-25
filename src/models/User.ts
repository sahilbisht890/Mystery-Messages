import mongoose , {Schema , Document} from "mongoose";


export interface Message extends Document {
    content : string,
    createdAt : Date
}

const messageSchema : Schema <Message>  = new Schema({
    content : { 
        type : String , 
        required : true
    },
    createdAt : {
        type : Date,      
        required : true,
        default : Date.now  
    }

});



export interface User extends Document {
    username : string,
    password : string,
    email : string,
    verifyCode : string , 
    verifyCodeExpire : Date,
    isAcceptingMessage : Boolean,
    message : Message[],
    isVerified : Boolean
}

const userSchema : Schema <User>  = new Schema({
     username : {
         type : String ,
         required : true,
         trim : true,
         unique : true
     },
     password : {
         type : String , 
         required : true
     },
     email : {
         type : String , 
         required : true,
         trim : true,
         unique : true
     },
     verifyCode : {
         type : String , 
         required : true
     },
     verifyCodeExpire : {
         type : Date , 
         required : true
     },
     isAcceptingMessage : {
         type : Boolean , 
         required : true
     }
     , message : {
        type : [messageSchema],
     },
     isVerified : {
        type : Boolean,
        default : false
     }
});

const userModal = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User' , userSchema));

export default userModal;