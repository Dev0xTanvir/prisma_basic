import { Commentstatus } from "../../../generated/prisma/enums";

export interface Icreatecommentpayload {
    postId:string
    authorId: string
    content: string
}

export interface Iupdatecommentpayload {
    content?: string
    status?: Commentstatus
}

export interface Imodaratecommentpayload {
    status: Commentstatus
}