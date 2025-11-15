# TODO list for dashboard page

## Create listing

1. Button/Link that will lead to a form for creation of a listing
2. Multi-step form
   1. Location: MapyCZ API connection, field for entering address, map for exact point, another input field for mountain area
   2. Define basic info through input fields: How many people can stay, contact information (email, phone, website)
   3. Pricings - per night, low price per night, breakfast price, dinner price
   4. Images - add multiple images (define reasonable max, optimize when uploading/storing), possibility to choose the cover picture, possibility to reorder the images
   5. Additional services - multi select (shower, breakfast, ...)
   6. Title and description - title (max amount of chars - 32), description (rich text)

Nice to have: ability to save a draft.

## Show listings

1. Dashboard page defaultly shows all of the listings that are assigned to the signed user.
2. Quick actions on each item: Edit and Delete buttons
3. Edit goes to Edit listing form
4. Delete button triggers confirm modal

## Edit listing

Shares the same form as create listing just with prefilled values.
