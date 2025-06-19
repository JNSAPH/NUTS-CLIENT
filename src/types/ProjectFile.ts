import { AuthTypes } from "./Auth";

export interface ProjectFile {
    name: string;
    requests: Request[];

}

export interface Request {
    name: string;
    url: string;
    topic: string;
    data: string;
    lastResponse?: string;
    authentication?: {
        type: AuthTypes;
        token?: string;
        usernamepassword?: {
            username: string;
            password: string;
        };
    };
    //headers: Header[];
}