async (events, steps) => {
    // Format member data for use in CPLUS
    body = steps.trigger.event.body
    this.dataString = {
        "contact": {
            "contactData": {
                "emails": [{
                    "type": "Other",
                    "value": body["data[email]"]
                }],
                "name": {
                    "givenName": body['data[merges][FNAME]'],
                    "familyName": body['data[merges][LNAME]']
                },
                "organizations": [{
                    "name": body['data[merges][ORGNAME]'],
                    "title": body['data[merges][ORGTITLE]']
                }],
                "addresses": [{
                    "type": "Other",
                    "city": steps.reverse_geocode.res[0].city,
                    "country": steps.reverse_geocode.res[0].country
                }],
            }
        }
    }
    // Clean data of empty objects and empty nested objects
    const removeEmpty = obj => {
        Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] == 'object') {
                if (Object.keys(obj[key]).length == 0) delete obj[key]; // delete empty nested objects
                else removeEmpty(obj[key]);                             // recurse for nested arrays
            } else if (obj[key] && typeof obj[key] === "array") {
                if (obj[key].length == 0) delete obj[key];  // delete empty nested arrays
                else removeEmpty(obj[0][key]);              // recurse for nested arrays
            } else if (obj[key] == null || obj[key] == '') { delete obj[key] }; // delete null/empty items
        });
        c = ['""', 'null', '{}']
        while (Object.keys(obj).includes('emails') && (c.some(x => JSON.stringify(obj).includes(x)))) {
            removeEmpty(obj)
        };
    };
    removeEmpty(this.dataString.contact.contactData)
}