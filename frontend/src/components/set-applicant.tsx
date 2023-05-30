import { useTranslation } from 'react-i18next';
import Select from './form/Select';
import { GroupControl } from './form/group-control';
import { Individual } from '../types';
import { IndividualRoleEnum } from '../constants';

type SetApplicantProps = {
  individuals: any[];
  selectApplicant: (individualNumber: string) => void;
};

export const SetApplicant = (props: SetApplicantProps): JSX.Element => {
  const { individuals, selectApplicant } = props;

  const { t } = useTranslation();

  const defaultValue = individuals.findIndex((individual) =>
    individual.roles.includes(IndividualRoleEnum.applicant)
  );

  return (
    <GroupControl
      isRequired={true}
      label={
        t(`steps.individuals_list.set_applicant.label`) ||
        'Amongst these individuals, which one are you?'
      }
    >
      <Select
        stepId="individuals_list"
        name="set_applicant"
        defaultValue={defaultValue === -1 ? '' : defaultValue.toString()}
        options={individuals.map(
          (individual: Individual) =>
            `${individual.first_name} ${individual.last_name}`
        )}
        onChange={(e: string) => selectApplicant(e)}
        isTranslatableOptions={false}
      />
    </GroupControl>
  );
};
