import * as React from 'react'
import { Select } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

function SelectLang(props: any) {
  const { t } = useTranslation()

  const lang = ['fr', 'en']

  const [selectedLang, setSelectedLang] = React.useState(i18next.languages[0])

  const changeHandler = (e: any) => {
    setSelectedLang(e.target.value)
    i18next.changeLanguage(e.target.value).then(() => {})
  }

  return (
    <Select
      border={0}
      color="white"
      variant="flushed"
      value={selectedLang}
      onChange={changeHandler}
      name="lang"
    >
      {lang.map((item: any, i: any) => (
        <option key={i} value={item}>
          {t(item)}
        </option>
      ))}
    </Select>
  )
}

export default SelectLang
