import { CustomField } from './custom-field';

export type FormData = {
  /**
   * @description Should be unique because it's used as the step id and also as the translation key
   */
  key: string;

  /**
   * @description To indicate the position of the custom step in the flow. Indicate the key of the step which should be before. If the after property is not filled then the step will be displayed first
   */
  after: string;

  /**
   * @description To indicate if the custom step is the last step to submit the flow
   */
  isLastStep: boolean;

  /**
   * @description The list of custom fields to display in the custom step
   */
  fields: CustomField[];
};
