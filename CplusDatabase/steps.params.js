async (event, steps, params) => {
    this.cplus_client_id = process.env.cplus_client_id
    this.spreadsheetId = params.spreadsheetId
    this.cplus_scopes = params.cplus_scopes
    this.redirect_uri = params.redirect_uri
    this.cplus_client_secret = process.env.cplus_client_secret
    this.cplus_refresh_token = process.env.cplus_refresh_token
}