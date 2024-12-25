export interface ProjectFile {
    name: string;
    requests: Request[];

}

interface Request {
    name: string;
    url: string;
    topic: string;
    data: string;
    lastResponse?: string;
    //headers: Header[];
}