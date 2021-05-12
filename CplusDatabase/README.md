# C+ Database

This is a workflow that pushes all Contacts+ data to a Google Sheet we use as a database once a week.

At the time of this update, it also compares the old data to the new data to develop a list of all changes in contact data.


Within the Google Sheet, we use a filter function and many named ranges to sort the overall contact data into site-specific sheets for people with 
known Facebook, Twitter, and Linkedin profiles. 

The first page of the database is a dashboard showing the important changes in data since the last update and various counts of contacts, for which we use the 
following custom function, saved in the associated Google Apps Script code file.

```
/**
 * Counts number of nonblank rows in array.
 *
 * @param {arr} input array.
 * @return Number of nonblank rows.
 * @customfunction
 */
function countRows(arr) {
  arr = arr.filter(row=>row.some(x=>x))
  return arr.length
}
```
For more information on creating custom functions in Google Sheets, click [here](https://developers.google.com/apps-script/guides/sheets/functions).
