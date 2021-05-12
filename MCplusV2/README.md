# MC+ V2

As stated in the main branch README, this step in the automation simply updates Contacts+ everytime a relevant update is made in Mailchimp. 

## **Note:** 
Tag names in Contacts+ should perfectly match the interest categories found in Mailchimp and have to be manually created. These scripts do not automatically
 create tags in Contacts+ to match Mailchimp, so it has to be done manually. The tag names must be exactly matching strings (case- and space- sensitive)!!


## Step order:
1. steps.params
2. steps.access_token
3. steps.find_member
4. steps.interest_categories
5. steps.reverse_geocode
6. steps.cplus_search
7. steps.data
8. steps.cplus_add
9. steps.cplus_delete
10. steps.cplus_update
