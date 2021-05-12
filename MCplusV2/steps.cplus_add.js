async (event, steps) => {
    // Add new members to CPLUS

    if (steps.trigger.event.body.type == 'subscribe' && steps.cplus_search.response.length == 0) {
        //add to c+
        var dataString = steps.data.dataString

        var headers = {
            'Authorization': `Bearer ${steps.access_token.token}`,
            'Content-Type': 'application/json'
        };

        var config = {
            url: 'https://api.contactsplus.com/api/v1/contacts.create',
            method: 'POST',
            headers: headers,
            data: dataString
        };

        this.add_response = (await require("@pipedreamhq/platform").axios(this, config))

        //manage tags
        if (steps.interest_categories.tags.length != 0) {
            contact_id = this.add_response.contact.contactId
            var dataString = {
                'contactIds': [contact_id],
                'addTagIds': steps.interest_categories.tags
            }
            var config = {
                url: 'https://api.contactsplus.com/api/v1/contacts.manageTags',
                method: 'POST',
                headers: headers,
                data: dataString
            };
            this.tag_response = (await require("@pipedreamhq/platform").axios(this, config))
        }


    } else {
        console.log('Not added.')
    }
}