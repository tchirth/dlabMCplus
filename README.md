# Cailchimp-Contacts+ Automation
This project is somewhat smaller in scale than Asana Automation and more straightforward, so this readme will mainly just contain issues and a brief overview of each workflow.

To read on workflows, and how Pipedream works see [this section from the Asana Automation documentation](https://github.com/tchirth/DesignLabAsanaAutomation#pipedream).

To read on webhooks, [see this section](https://github.com/tchirth/DesignLabAsanaAutomation#webhooks) or read Mailchimp-specific webhook info [here](https://mailchimp.com/developer/marketing/guides/sync-audience-data-webhooks/).


## Overall
We use Mailchimp to organize and contact our extensive mailing lists along with Contacts+ to search for public social data about our mailing list members which can be used in social media strategy.

This project aims to **integrate the two services** and form an ecosystem that will keep both services up-to-date.

Ideally, we would have an equal relationship between them, where each can update the other, but I was not able to make that work. Instead, there is a three-tiered system, where Mailchimp is the master, Contacts+ is in the middle, and a gsheet database is at the bottom. Here I will describe each of these two connections and their purpose.


## MC+ V2
This is the second version of an automated connection between Mailchimp and Contacts+ and is set up to run off of webhooks from Mailchimp.

When a member of our Mailchimp list is added, subscribes, unsubscribes, or updates/receives updates to their profile, a webhook is sent from Mailchimp to this workflow, which then takes action based on the type of change made.

- For new members, a new contact with matching data is made in Contacts+.

- For updates, the matching Contacts+ member is updated with the same data.

- For unsubscribes, the matching Contacts+ member is deleted.

The program also accounts for interest categories in Mailchimp, which are mapped to tags in Contacts+ that have to be manually created.


## C+ Database
This second step of the hierarchy simply pushes all contact data in Contacts+ to a visual database in Google Sheets. It also compares the new data to the last set of database data and determines the updates/changes that have been made in Contacts+ since the time of the last update. 

Finally, a custom function is used to organize the Social Platform Specific sheets in the database from the overall printed data. This function is also included here and must be inserted into the Google Sheet script editor for use in the database.


### Issues
A logging feature was intended to print the time of the last update on the dashboard of this database, but it caused the workflow to exceed the operation time limits and was scrapped. I was unable to reduce the runtime of this step significantly, so it was totally abandoned.
