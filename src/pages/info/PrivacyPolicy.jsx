import { Title } from "../../styles/generalStyles";

const PrivacyPolicy = () => {
  return (
    <div className="col-10 col-md-8 col-lg-6 m-auto">
      <Title>Personvernerklæring</Title>
      <p>
        Vi registrerer anonym statistikk over besøk på nettstedet. Dette gjøres
        uten bruk av cookies, og IP-adresser anonymiseres umiddelbart ved hjelp
        av en enveiskryptering (hashing). Informasjonen brukes kun for å telle
        besøk og forstå hvilke sider som er mest populære.
        <br />
        <br />
        Vi lagrer ikke personopplysninger, og ingen data kan knyttes til
        enkeltpersoner.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
