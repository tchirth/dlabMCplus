async (event, steps) => {
    // Delete unsubs from CPLUS

    if (steps.trigger.event.body.type == 'unsubscribe' && steps.cplus_search.response.length != 0) {
        try {
            var dataString = { "contactId": steps.cplus_search.response[0].contactId, "etag": steps.cplus_search.response[0].etag };


            var headers = {
                'Authorization': `Bearer ${steps.access_token.token}`,
                'Content-Type': 'application/json'
            };

            var config = {
                url: 'https://api.contactsplus.com/api/v1/contacts.delete',
                method: 'POST',
                headers: headers,
                data: dataString
            };

            this.response = (await require("@pipedreamhq/platform").axios(this, config))
        } catch (error) {
            return error
        }
    } else {
        console.log('Not Deleted.')
    }
}