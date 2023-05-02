import { useState } from 'react';
import { Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import { languages } from '../config/languages';

const SelectLang = () => {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18next.languages[0]);

  const changeHandler = (e: any) => {
    setSelectedLang(e.target.value);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    i18next.changeLanguage(e.target.value).then(() => {});
  };

  return (
    <Select
      border="0"
      color="white"
      variant="flushed"
      value={selectedLang}
      onChange={changeHandler}
      name="lang"
    >
      {languages.map((language: string, i: number) => (
        <option key={i} value={language}>
          {t(`domain.languages.${language}`)}
        </option>
      ))}
    </Select>
  );
};

export default SelectLang;
