import { Message } from "@/models/User";

export interface PublicUserSummary {
    _id: string;
    username: string;
    profession?: string;
    gender?: string;
    profilePhoto?: string;
}

export interface UserProfileData {
    _id?: string;
    username: string;
    email: string;
    profession?: string;
    description?: string;
    currentCompany?: string;
    gender?: string;
    age?: number | null;
    profilePhoto?: string;
}

export default interface apiResponse {
    success : boolean ,
    message : string ,
    isAcceptingMessages? : boolean ,
    messages? : Array<Message>,
    users?: Array<PublicUserSummary>,
    data?: Array<string>,
    user?: UserProfileData
}
