async (params, auth) => {
    const axios = require('axios')

    const mailchimpParams = ["fields", "exclude_fields", "query", "list_id"]
    const { fields, exclude_fields, query, list_id } = params
    p = params

    const queryString = mailchimpParams.filter(param => p[param]).map(param => `${param}=${p[param]}`).join("&")

    return await require("@pipedreamhq/platform").axios(this, {
        url: `https://${auths.mailchimp.dc}.api.mailchimp.com/3.0/search-members?${queryString}`,
        headers: {
            Authorization: `Bearer ${auths.mailchimp.oauth_access_token}`,
        },
    })
}