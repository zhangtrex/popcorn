export type Movie = {
    mid: number;
    name: string;
    description: string;
}

export type User = {
    uid: number;
    username: string;
    accesslevel: number;
}

export type Genre = {
    gid: number;
    genre: string;
}

export type MovieComment = {
    uid: User;
    lastupdated: string;
    cid: number;
    content: string;
}

