import { Poststatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface Ipostpayload {
  title: string;
  content: string;
  thumbnil?: string;
  isFeature?: boolean;
  status?: Poststatus;
  tags: string[];
}

export interface Iupdatepost {
  title?: string;
  content?: string;
  thumbnil?: string;
  isFeature?: boolean;
  status?: Poststatus;
  tags?: string[];
}

export interface Ipostquery extends PostWhereInput {
  searchItem?: string
  page?: string
  limit?: string
  sortby?: string
  sortOrder?: string
}