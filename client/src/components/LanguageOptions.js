import LanguageButton from './LanguageButton'

const LanguageOptions = () => {
  return (
    <div className='text-white flex justify-end font-montserrat font-thin m-2'>
      <LanguageButton>en</LanguageButton>
      <LanguageButton>fi</LanguageButton>
      <LanguageButton>es</LanguageButton>
      <LanguageButton>sk</LanguageButton>
    </div>
  )
}

export default LanguageOptions
