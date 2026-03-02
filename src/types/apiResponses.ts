import { Message } from "@/models/User";

export interface PublicUserSummary {
    _id: string;
    username: string;
}

export default interface apiResponse {
    success : boolean ,
    message : string ,
    isAcceptingMessages? : boolean ,
    messages? : Array<Message>,
    users?: Array<PublicUserSummary>
}
