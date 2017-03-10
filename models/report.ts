export class Report {
    private _token: string;
    private _name: string;
    private _url: string;
    private _id: string;

    public get Id(): string { return this._id; }
    public get Name(): string { return this._name; }
    public get Url(): string { return this._url; }
    public get Token(): string { return this._token; }

    constructor(id: string, name: string, token: string, url: string) {
        this._id = id;
        this._name = name;
        this._token = token;
        this._url = url;
    }
}