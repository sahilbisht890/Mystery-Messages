import { Message } from "@/models/User";

export default interface apiResponse {
    success : boolean ,
    message : string ,
    isAcceptingMessages? : boolean ,
    messages? : Array<Message>
}