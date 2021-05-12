async (event, steps, auths) => {
    const fs = require('fs')

    function search(searchArray, index, searchValue) {
        indexCol = searchArray.map(x => x[index])
        if (indexCol.filter(x => x == searchValue).length > 1) { return 'Duplicates' }
        rowNum = indexCol.indexOf(searchValue)
        if (rowNum == -1) { return null }
        else { return searchArray[rowNum] }
    }

    function equate(row1, row2) {
        // if (row1.length != row2.length) {return [false, 'Arrays are of unequal length']}
        email = row1[2]
        //FOR THIS APPLICATION ONLY, INDEX 2 WILL ALWAYS MATCH ALREADY
        row1 = row1.slice(0, 2).concat(row1.slice(3))
        row2 = row2.slice(0, 2).concat(row2.slice(3))

        mismatches = []
        for (i in row1) {
            if ((row1[i] == undefined) || (row1[i] == '')) { row1[i] = null }
            if ((row2[i] == undefined) || (row2[i] == '')) { row2[i] = null }

            if ((row1[i] != row2[i])) {
                //mismatches.push(row1[i],row[i])
                mismatches[2 * i] = row1[i]
                mismatches[2 * i + 1] = row2[i]
            }
        }

        if (mismatches.length == 0) {
            return [true, []]
        } else {
            mismatches.unshift(email)
            return [false, mismatches]
        }
    }

    async function getSheet(sheetName) {
        range = sheetName + '!A1:Z'
        const config = {
            method: "get",
            url: `https://sheets.googleapis.com/v4/spreadsheets/${steps.params.spreadsheetId}/values/${sheetName}`,
            params: {
                majorDimension: 'ROWS'
            },
            headers: {
                Authorization: `Bearer ${auths.google_sheets.oauth_access_token}`,
            }
        }
        // Post data to Google Sheets and return transaction metadata
        return (await require("@pipedreamhq/platform").axios(this, config)).values
    }

    async function clearSheet(sheetName) {
        // range = sheetName + '!A1:Z'
        const config = {
            method: "post",
            url: `https://sheets.googleapis.com/v4/spreadsheets/${steps.params.spreadsheetId}/values/${sheetName}:clear`,
            headers: {
                Authorization: `Bearer ${auths.google_sheets.oauth_access_token}`,
            }
        }
        // Post data to Google Sheets and return transaction metadata
        return (await require("@pipedreamhq/platform").axios(this, config)).updates
    }

    async function printSheet(rows, sheetName) {
        const config = {
            method: "put",
            url: `https://sheets.googleapis.com/v4/spreadsheets/${steps.params.spreadsheetId}/values/${sheetName}`,
            params: {
                includeValuesInResponse: false,
                valueInputOption: "USER_ENTERED"
            },
            headers: {
                Authorization: `Bearer ${auths.google_sheets.oauth_access_token}`,
            },
            data: {
                values: rows,
            }
        }

        // Post data to Google Sheets and return transaction metadata
        return (await require("@pipedreamhq/platform").axios(this, config)).updates
    }

    var request = require('request');
    list = []
    var headers = {
        'Authorization': `Bearer ${steps.access_token.token}`,
        'Content-Type': 'application/json'
    };

    // var dataString = '{ "size": 1000, "scrollCursor": "string", "includeDeletedContacts": "boolean", "teamId": "string" }';
    var dataString = '{ "size": 1000}';

    var config = {
        url: 'https://api.contactsplus.com/api/v1/contacts.scroll',
        method: 'POST',
        headers: headers,
        data: dataString
    };
    response = (await require("@pipedreamhq/platform").axios(this, config))
    list = list.concat(response.contacts)
    while (Object.keys(response).includes('cursor')) {
        dataString = `{ "size": 1000, "scrollCursor": "${response.cursor}"}`
        config = {
            url: 'https://api.contactsplus.com/api/v1/contacts.scroll',
            method: 'POST',
            headers: headers,
            data: dataString
        };
        response = (await require("@pipedreamhq/platform").axios(this, config))
        list = list.concat(response.contacts)
    }


    var sheetNames = {
        'Total': [[
            'First Name',
            'Last Name',
            'Email Address',
            'Address - City',
            'Address - Country',
            'Organization - Name',
            'Organization - Title',
            'Facebook',
            'Twitter',
            'Linkedin',
            'Other'
        ]],
        // 'Updates': [[]]
        'Updates': [[
            'Email',
            'First Name', ,
            'Last Name', ,
            'Address - City', ,
            'Address - Country', ,
            'Organization - Name', ,
            'Organization - Title', ,
            'Facebook', ,
            'Twitter', ,
            'Linkedin', ,
            'Website', ,
        ], [
            '',
            'New', 'Old',
            'New', 'Old',
            'New', 'Old',
            'New', 'Old',
            'New', 'Old',
            'New', 'Old',
            'New', 'Old',
            'New', 'Old',
            'New', 'Old',
            'New', 'Old'
        ]]
    };


    var fname, lname, email, city, country, orgname, orgtitle, twitter, facebook, linkedin, other

    for (i in list) {
        fname = lname = email = city = country = orgname = orgtitle = twitter = facebook = linkedin = other = undefined
        contact = list[i].contactData
        for (key of Object.keys(contact)) {
            switch (key) {
                case 'name':
                    fname = contact.name.givenName
                    lname = contact.name.familyName
                    break;
                case 'emails':
                    email = contact.emails[0].value
                    break;
                case 'addresses':
                    city = contact.addresses[0].city
                    country = contact.addresses[0].country
                    break;
                case 'organizations':
                    orgname = contact.organizations[0].name
                    orgtitle = contact.organizations[0].title
                    break;
                case 'urls':
                    twitter = contact.urls.filter(x => x.type == 'twitter')[0];
                    if (typeof (twitter) != 'undefined') { twitter = twitter.value }// else {twitter = undefined};
                    facebook = contact.urls.filter(x => x.type == 'facebook')[0];
                    if (typeof (facebook) != 'undefined') { facebook = facebook.value }// else {facebook = undefined};
                    linkedin = contact.urls.filter(x => x.type == 'linkedin')[0];
                    if (typeof (linkedin) != 'undefined') { linkedin = linkedin.value }// else {linkedin = undefined};
                    other = contact.urls.filter(x => x.type == 'Other')[0];
                    if (typeof (other) != 'undefined') { other = other.value }// else {other = undefined};
                    break;
                default:
                    continue;
            };

        };

        sheetNames['Total'].push([
            fname,
            lname,
            email,
            city,
            country,
            orgname,
            orgtitle,
            facebook,
            twitter,
            linkedin,
            other
        ]);
    };

    oldsheet = await getSheet('Total')


    for (newRow of sheetNames['Total'].filter(x => x[2])) {
        oldRow = search(oldsheet.filter(x => x[2]), 2, newRow[2])
        if (oldRow == null) { sheetNames['Updates'].push([newRow[2], 'New Contact']) }
        else if (oldRow == 'Duplicates') { sheetNames['Updates'].push([newRow[2], oldRow]) }
        else {
            var [bool, msg] = equate(newRow, oldRow)
            if (bool == true) { continue }
            else { sheetNames['Updates'].push(msg) };
        }
    }
    for (oldRow of oldsheet.filter(x => x[2])) {
        newRow = search(sheetNames['Total'], 2, oldRow[2])
        if (newRow == null) { sheetNames['Updates'].push([oldRow[2], 'Contact Removed']) }
    }

    for (name of Object.keys(sheetNames)) {
        console.log(name)
        await clearSheet(name)
        await printSheet(sheetNames[name], name)
        console.log('complete')
    }

    //https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}:append
    // await printSheet([[steps.trigger.context.ts, 'Completed']], 'Log')
    // const log_config = {
    //   method: "post",
    //   url: `https://sheets.googleapis.com/v4/spreadsheets/${steps.params.spreadsheetId}/values/Log:append`,
    //   params: {
    //     includeValuesInResponse: false,
    //     valueInputOption: "USER_ENTERED"
    //   },
    //   headers: {
    //     Authorization: `Bearer ${auths.google_sheets.oauth_access_token}`,
    //   },
    //   data: {
    //   values: [[steps.trigger.context.ts, 'Completed']],
    //   }
    // }

    // Post data to Google Sheets and return transaction metadata
    // return (await require("@pipedreamhq/platform").axios(this, log_config))

}