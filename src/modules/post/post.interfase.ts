import { Poststatus } from "../../../generated/prisma/enums";

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
