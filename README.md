## ABOUT

The project is a proof of concept.

## INSTRUCTIONS TO RUN THE PROJECT LOCALLY

- Clone.
- Execute command **npm i** to install packages.
- Execute command **node ./src/index.js** to start the application at port 3000.

## EXTRA INSTRUCTIONS

- TO ADD NEW MESSAGE WITH SUPPORT TO INTERNACIONALIZATION YOU NEED TO FOLLOW THE STEPS:

  - Access **./constant/MessageCode** file
  - Create new message code following the standard:

  ```
      MESSAGE_CODE_HERE: "message_code_here"
  ```

  - Access the translaction files inside **locales** directory and add the message following the standard:

  ```
    -- locales/en/transaction.json
      {
        message_code_here: "Message here in specific language"
      }

    -- locales/pt/transaction.json
      {
        message_code_here: "Message here in specific language"
      }

     -- locales/es/transaction.json
      {
        message_code_here: "Message here in specific language"
      }

  ```
