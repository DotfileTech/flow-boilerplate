# Configuration

## Company

Manage the properties of a company. Each property is an object with: 

- **id** (`string`): The name of the property, which is also useful for the translation system
- **type** (optional `string`): The input type, default `text`. Can be `text`, `url`, `date`, `tel`, `email`, `select`, `country` or `number`.
- **nested** (optional `string`): For nested object: `banking_information`, `classifications` or `address`.
- **required** (`boolean`): To require the field in the company form
- **enabled** (`boolean`): To display the field in the company form
- **options** (optional `array`): An array of string for the `select` field

```
Info: You can move a property in the array to change the form order.
```

## Individual

Manage the properties of an individual. Each property is an object with:

- **id** (`string`): The name of the property, which is also useful for the translation system
- **type** (`string`): The input type, default `text`. Can be `text`, `url`, `date`, `number`, `email`, `checkbox`, `tel` or `country`.
- **nested** (`string`): For nested object: `banking_information` or `address`.
- **required** (`boolean`): To require the field in the individual form
- **enabled** (`boolean`): To display the field in the individual form
- **options** (optional `array`): An array of string for the `checkbox` field

```
Info: You can move a property in the array to change the form order only in a same category.
```

## Custom form

Create additional steps with the `Forms.ts` on your onboarding.

For each additional step you can create an object with:

- **key** (`string`): The name of the step, which is useful for the translation system
- **after** (`string`): The position of the additional step. If the after property is not filled then the step will be displayed first.
- **fields** (`array`): An array of fields for this step.
  - **id** (`string`): The name of the property, which is also useful for the translation system.
  - **type** (`string`): The input type. Can be `text`, `url`, `date`, `number`, `email`, `tel`, `select`, `radio` or `country`.
  - **isRequired** (`boolean`): To require the field
  - **hasHelper** (optional `boolean`): To display a text helper below the label
  - **options** (optional `array`): An array of string for the `select` and `radio` fields

```
Info: The field id is the key name to generate the label and the helper which will have to 
be defined in the trads folder. Same thing for options.
```

## Trads

The translation files in the `trads` folder will overwrite the global translation files stored in the `i18n` folder.

```
Warning: Do not update translation in the `i18n` folder
```

## Theme

To set up your own logo and the main colors and fonts on the onboarding flow.

## Languages

Manage the languages available on the onboarding flow.

To display the language dropdown in the sidebar, you must have at least 2 languages.