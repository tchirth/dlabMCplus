async (event, steps) => {
    // Check if the email address is already attatched to a memebr in cplus
    // Return member data if so

    email = steps.trigger.event.body["data[email]"]
    this.response = []
    var dataString = `{ "searchQuery": "email:${email}" }`;

    var headers = {
        'Authorization': `Bearer ${steps.access_token.token}`,
        'Content-Type': 'application/json'
    };

    var config = {
        url: 'https://api.contactsplus.com/api/v1/contacts.search',
        method: 'POST',
        headers: headers,
        data: dataString
    };

    this.response = (await require("@pipedreamhq/platform").axios(this, config)).contacts
    // return this.response
    if (this.response.length != 0) {
        var dataString = { "contactIds": [this.response[0].contactId] };

        var config = {
            url: 'https://api.contactsplus.com/api/v1/contacts.get',
            method: 'POST',
            headers: headers,
            data: dataString
        };

        this.response = (await require("@pipedreamhq/platform").axios(this, config)).contacts
    }
    // console.log(response)

}