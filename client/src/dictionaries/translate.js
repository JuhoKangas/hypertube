import { enUK } from './enUK'
import { esES } from './esEs'
import { fiFI } from './fiFI'

export const translate = (language) => {
  if (language === 'fi') {
    return fiFI
  } else if (language === 'es') {
    return esES
  } else return enUK
}
