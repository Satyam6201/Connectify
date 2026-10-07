import { getLanguageFlagUrl } from "../lib/utils";

const LanguageFlag = ({ language }) => {
  const url = getLanguageFlagUrl(language);
  if (!url) return null;

  return (
    <img
      src={url}
      alt={`${language} flag`}
      className="h-3 mr-1 inline-block rounded-sm"
    />
  );
};

export default LanguageFlag;
