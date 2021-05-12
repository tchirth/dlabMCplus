async (event, steps) => {
    var dataString = `client_id=${steps.params.cplus_client_id}&client_secret=${steps.params.cplus_client_secret}&refresh_token=${steps.params.cplus_refresh_token}`;

    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    var config = {
        url: 'https://api.contactsplus.com/v3/oauth.refreshToken',
        method: 'POST',
        headers: headers,
        data: dataString
    };

    this.response = await require("@pipedreamhq/platform").axios(this, config)
    this.token = this.response.access_token
}