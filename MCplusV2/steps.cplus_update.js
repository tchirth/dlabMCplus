async (event, steps) => {
    // Update CPLUS data w/ member data

    if (steps.trigger.event.body.type == 'profile' && steps.cplus_search.response.length == 0) {
        // add to c+
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


    } else if (steps.trigger.event.body.type == 'profile' && steps.cplus_search.response.length != 0) {
        var request = require('request');

        // var dataString = '{ "contact": { "contactId": "string", "etag": "string", "contactData": { "addresses": [ { "type": "string", "street": "string", "city": "string", "region": "string", "postalCode": "string", "country": "string", "extendedAddress": "string" } ], "birthday": "object", "dates": [ { "type": "string", "month": "integer", "day": "integer", "year": "integer" } ], "emails": [ { "type": "string", "value": "string" } ], "name": { "givenName": "string", "familyName": "string", "middleName": "string", "prefix": "string", "suffix": "string" }, "relatedPeople": [ { "type": "string", "value": "string" } ], "organizations": [ { "name": "string", "department": "string", "title": "string", "location": "string", "description": "string", "startDate": "object", "endDate": "object" } ], "urls": [ { "type": "string", "value": "string", "username": "string", "userId": "string" } ], "notes": "string", "items": [ { "type": "string", "value": "string" } ], "ims": [ { "type": "string", "value": "string" } ] } }, "resolveConflicts": "boolean", "teamId": "string" }';
        var dataString = steps.data.dataString
        dataString['contact']['contactData']['photos'] = steps.cplus_search.response[0].contactData.photos
        dataString.contact["contactId"] = steps.cplus_search.response[0].contactId
        dataString.contact["etag"] = steps.cplus_search.response[0].etag
        var headers = {
            'Authorization': `Bearer ${steps.access_token.token}`,
            'Content-Type': 'application/json'
        };

        var config = {
            url: 'https://api.contactsplus.com/api/v1/contacts.update',
            method: 'POST',
            headers: headers,
            data: dataString
        };
        this.update_response = (await require("@pipedreamhq/platform").axios(this, config))

        //manage tags
        contact_id = this.update_response.contact.contactId
        mc_tags = steps.interest_categories.tags
        cplus_tags = steps.cplus_search.response[0].contactMetadata
        var dataString = {
            'contactIds': [contact_id],
        };
        if (Object.keys(cplus_tags).includes('tagIds')) {
            addTagIds = mc_tags.filter(x => !cplus_tags.tagIds.includes(x))
            if (addTagIds.length != 0) { dataString['addTagIds'] = addTagIds }
            removeTagIds = cplus_tags.tagIds.filter(x => !mc_tags.includes(x))
            if (removeTagIds.length != 0) { dataString['removeTagIds'] = removeTagIds }
        } else {
            dataString['addTagIds'] = mc_tags
        };
        if (addTagIds.length != 0 || removeTagIds.length != 0) {
            var config = {
                url: 'https://api.contactsplus.com/api/v1/contacts.manageTags',
                method: 'POST',
                headers: headers,
                data: dataString
            };
            this.tag_response = (await require("@pipedreamhq/platform").axios(this, config))
        };
    } else {
        console.log('No updates.')
    }
}