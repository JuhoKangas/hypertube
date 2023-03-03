import { enUK } from './enUK'
import { esES } from './esEs'
import { fiFI } from './fiFI'
import { skSK } from './skSK'

export const translate = (language) => {
  if (language === 'fi') {
    return fiFI
  } else if (language === 'es') {
    return esES
  } else if (language === 'sk') {
    return skSK
  } else return enUK
}
