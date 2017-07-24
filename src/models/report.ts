/**
 * Model for a PowerBI embed report with token.
 *
 * @class Report
 * @export
 * @model
 */
export class Report {
    ///
    /// Field declarations
    ///
    private _token: string;
    private _name: string;
    private _url: string;
    private _id: string;

    ///
    /// Property declarations
    ///

    /**
     * Gets the report Id.
     *
     * @type string
     * @memberof Report
     * @property
     * @public
     * @readonly
     */
    public get Id(): string { return this._id; }

    /**
     * Gets the report name
     *
     * @type string
     * @memberof Report
     * @property
     * @public
     * @readonly
     */
    public get Name(): string { return this._name; }

    /**
     * Gets the report URL
     *
     * @type string
     * @memberof Report
     * @property
     * @public
     * @readonly
     */
    public get Url(): string { return this._url; }

    /**
     * Gets the report access token.
     *
     * @type string
     * @memberof Report
     * @property
     * @public
     * @readonly
     */
    public get Token(): string { return this._token; }

    /**
     * Creates an instance of Report.
     * @param {string} id - Report id.
     * @param {string} name - Report name
     * @param {string} token - Report access token.
     * @param {string} url - Report url.
     * @memberof Report
     * @constructor
     * @public
     */
    constructor(id: string, name: string, token: string, url: string) {
        this._id = id;
        this._name = name;
        this._token = token;
        this._url = url;
    }
}
