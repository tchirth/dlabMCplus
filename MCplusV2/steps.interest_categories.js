async (event, steps, auths) => {
    // This step parses through the mailchimp and cplus environments to get the interests/tags
    // that we will match later for the specific member
    const list_id = process.env.mc_list_id
    // Mailchimp Interests
    var headers = {
        'Authorization': `Basic ${steps.params.mc_api_key}`,
    };

    var config = {
        url: `https://us13.api.mailchimp.com/3.0/lists/${process.env.mc_list_id}/interest-categories`,
        method: 'GET',
        headers: headers
    };
    this.mc_tags = {}
    cat_response = (await require("@pipedreamhq/platform").axios(this, config)).categories
    for (elem of cat_response) {
        var title = (elem.title)
        config.url = `https://us13.api.mailchimp.com/3.0/lists/${process.env.mc_list_id}/interest-categories/${elem.id}/interests`
        int_response = (await require("@pipedreamhq/platform").axios(this, config)).interests
        int_response.forEach(interest => this.mc_tags[interest.id] = String(title + ': ' + interest.name))
    }
    // CPLUS Interests
    var dataString = `{ "size": 100 }`;

    var headers = {
        'Authorization': `Bearer ${steps.access_token.token}`,
        'Content-Type': 'application/json'
    };

    var config = {
        url: 'https://api.contactsplus.com/api/v1/tags.scroll',
        method: 'POST',
        headers: headers,
        data: dataString
    };

    response = (await require("@pipedreamhq/platform").axios(this, config)).tags
    this.cplus_tags = {}
    response.forEach(tag => this.cplus_tags[tag.tagData.name] = tag.tagId)

    //Create a list of the CPLUS tag ids that match the member's interests in mailchimp
    this.tags = []
    for ([mc_int, bool] of Object.entries(steps.find_member.$return_value.exact_matches.members[0].interests)) {
        if (bool == true) {
            this.tags.push(this.cplus_tags[this.mc_tags[mc_int]])
        }
    }
}