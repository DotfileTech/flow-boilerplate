# Configuration

- Company.ts

Manage the properties requested for the company.

- Individuals.ts

Manage the properties requested for the individiuals

- Forms.ts

Manage the additional steps. Currently this support two types: CustomRadio & CustomForm.
The position of the additional step is controlled by the `after` property. If the `after` property is not filled then the step will be displayed first.

- trads

the translation files in the `trads` folder will overwrite the global translation files stored in the `i18n` folder.