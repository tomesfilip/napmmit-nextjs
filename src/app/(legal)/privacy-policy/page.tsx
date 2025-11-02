export default function PrivacyPolicy() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Zásady ochrany osobných údajov</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Úvod</h2>
        <p>
          Tieto zásady ochrany osobných údajov vysvetľujú, ako spoločnosť
          Napmmit (ďalej len „my", „naša spoločnosť" alebo „prevádzkovateľ")
          spracúva osobné údaje používateľov webovej platformy www.napmmit.com
          (ďalej len „web" alebo „platforma").
        </p>
        <p>
          Ochrana súkromia našich používateľov je pre nás dôležitá a osobné
          údaje spracúvame výlučne v súlade s platnou legislatívou, najmä:
        </p>
        <ul className="list-disc pl-6">
          <li>Nariadenie (EÚ) 2016/679 (GDPR)</li>
          <li>Zákon č. 18/2018 Z. z. o ochrane osobných údajov</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Prevádzkovateľ</h2>
        <p>Filip Tomeš</p>
        <p>IČO: 17658969</p>
        <p>E-mail: info@napmmit.com</p>
        <p>Web: www.napmmit.com</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          3. Aké osobné údaje spracúvame
        </h2>
        <p>
          Spracúvame len údaje nevyhnutné na prevádzku platformy a komunikáciu s
          používateľmi, najmä:
        </p>
        <ul className="list-disc pl-6">
          <li>Identifikačné údaje (meno, priezvisko – ak sú poskytnuté)</li>
          <li>Kontaktné údaje (e-mail, telefónne číslo – ak sú poskytnuté)</li>
          <li>
            Údaje o používateľskom účte (ak sa registrujete – prihlasovacie
            meno, heslo v šifrovanej forme)
          </li>
          <li>Údaje o vašich chatách (ak ste vlastník a spravujete objekt)</li>
          <li>
            Technické údaje (IP adresa, cookies, informácie o zariadení, typ
            prehliadača – viď sekcia Cookies)
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Účel spracovania</h2>
        <p>Osobné údaje spracúvame na tieto účely:</p>
        <ul className="list-disc pl-6">
          <li>Registrácia a správa používateľského účtu.</li>
          <li>Zverejnenie a správa informácií o chatách.</li>
          <li>
            Komunikácia s používateľmi (napr. odpovede na dopyty, notifikácie).
          </li>
          <li>
            Analýza návštevnosti webu a zlepšovanie služieb (na základe
            súhlasu).
          </li>
          <li>Plnenie právnych povinností prevádzkovateľa.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Právny základ spracovania</h2>
        <p>Vaše údaje spracúvame na základe:</p>
        <ul className="list-disc pl-6">
          <li>Plnenia zmluvy (registrácia, správa účtu).</li>
          <li>
            Súhlasu (napr. pre zasielanie newslettera alebo používanie
            analytických cookies).
          </li>
          <li>
            Oprávneného záujmu (napr. zlepšenie funkčnosti webu, zabezpečenie
            platformy).
          </li>
          <li>Právnej povinnosti (účtovné, daňové povinnosti).</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Doba uchovávania údajov</h2>
        <p>Údaje uchovávame len po dobu nevyhnutnú na účel ich spracovania:</p>
        <ul className="list-disc pl-6">
          <li>Účet používateľa – do jeho zrušenia.</li>
          <li>
            Komunikácia a e-maily – do 12 mesiacov od ukončenia komunikácie.
          </li>
          <li>Cookies – podľa nastavení súhlasu používateľa.</li>
          <li>Účtovné a právne údaje – podľa zákonom stanovenej lehoty.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">7. Zdieľanie osobných údajov</h2>
        <p>Vaše údaje môžeme sprístupniť len:</p>
        <ul className="list-disc pl-6">
          <li>poskytovateľom IT služieb (hosting, e-mailing, analytika),</li>
          <li>orgánom verejnej správy, ak to vyžaduje zákon.</li>
        </ul>
        <p className="font-semibold">
          Údaje neposkytujeme tretím stranám na marketingové účely bez vášho
          súhlasu.
        </p>
      </section>
    </div>
  );
}
