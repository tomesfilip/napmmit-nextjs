import {
  LEGAL_DOMAIN,
  LEGAL_OPERATOR_EMAIL,
  LEGAL_OPERATOR_ICO,
  LEGAL_OPERATOR_NAME,
  TERMS_EFFECTIVE_DATE,
} from '@/lib/legal/constants';

export default function PrivacyPolicy() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Zásady ochrany osobných údajov</h1>
      <p className="text-muted-foreground">Platné od: {TERMS_EFFECTIVE_DATE}</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Úvod</h2>
        <p>
          Tieto zásady ochrany osobných údajov vysvetľujú, ako spoločnosť
          Napmmit (ďalej len „my“, „naša spoločnosť“ alebo „prevádzkovateľ“)
          spracúva osobné údaje používateľov webovej platformy {LEGAL_DOMAIN}{' '}
          (ďalej len „web“ alebo „platforma“).
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
        <p>{LEGAL_OPERATOR_NAME}</p>
        <p>IČO: {LEGAL_OPERATOR_ICO}</p>
        <p>E-mail: {LEGAL_OPERATOR_EMAIL}</p>
        <p>Web: {LEGAL_DOMAIN}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          3. Aké osobné údaje spracúvame
        </h2>
        <p>
          Spracúvame len údaje nevyhnutné na prevádzku platformy, spracovanie
          rezervácií a komunikáciu s používateľmi, najmä:
        </p>
        <ul className="list-disc pl-6">
          <li>Identifikačné údaje (meno, priezvisko – ak sú poskytnuté)</li>
          <li>
            Kontaktné údaje (e-mail, telefónne číslo – ak sú poskytnuté pri
            registrácii, v profile alebo pri rezervácii)
          </li>
          <li>
            Údaje o používateľskom účte (ak sa registrujete – prihlasovacie
            meno, heslo v šifrovanej forme)
          </li>
          <li>
            Údaje o chatách a ich zverejnení (ak ste vlastník a spravujete
            objekt, vrátane nahraných obrázkov)
          </li>
          <li>
            Údaje o rezervácii (dátumy pobytu, počet lôžok, identifikátor chaty,
            stav rezervácie napr. čaká na potvrdenie, potvrdená, zrušená)
          </li>
          <li>
            Kontaktné údaje hosta pri rezervácii (meno, e-mail, telefón –
            bez ohľadu na to, či ste prihlásený alebo rezervujete ako hosť)
          </li>
          <li>
            Platobné metadáta rezervačného poplatku (suma, mena, stav platby,
            identifikátory Stripe ako payment intent, checkout session alebo
            refund – <strong>nie</strong> úplné číslo platobnej karty ani CVV)
          </li>
          <li>
            Prístupové tokeny na zobrazenie potvrdenia rezervácie (nepriehľadné
            identifikátory viazané na konkrétnu rezerváciu)
          </li>
          <li>
            Metadáta o doručení transakčných e-mailov (napr. čas odoslania
            potvrdenia rezervácie)
          </li>
          <li>
            Technické údaje (IP adresa, cookies, informácie o zariadení, typ
            prehliadača – viď{' '}
            <a
              href="/cookie-policy"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Zásady používania súborov cookie
            </a>
            )
          </li>
        </ul>
        <p>
          Údaje platobnej karty zadávate priamo do zabezpečeného rozhrania
          poskytovateľa <strong>Stripe</strong>. Prevádzkovateľ neukladá úplné
          číslo platobnej karty (PAN) ani bezpečnostný kód (CVV).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Účel spracovania</h2>
        <p>Osobné údaje spracúvame na tieto účely:</p>
        <ul className="list-disc pl-6">
          <li>Registrácia a správa používateľského účtu.</li>
          <li>Zverejnenie a správa informácií o chatách.</li>
          <li>
            Spracovanie a správa rezervácií ubytovania vrátane prenosu
            relevantných údajov medzi turistom a vlastníkom chaty.
          </li>
          <li>
            Inkaso rezervačného poplatku platformy a spracovanie oprávnených
            refundácií prostredníctvom Stripe.
          </li>
          <li>
            Odosielanie transakčných e-mailov (potvrdenie rezervácie,
            overenie e-mailu, obnovenie hesla a pod.).
          </li>
          <li>
            Komunikácia s používateľmi (napr. odpovede na dopyty, notifikácie).
          </li>
          <li>
            Prevencia podvodov, ochrana platformy a riešenie zneužitia služby.
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
          <li>
            Plnenia zmluvy (registrácia, správa účtu, spracovanie rezervácie,
            úhrada rezervačného poplatku).
          </li>
          <li>
            Súhlasu (napr. pre zasielanie newslettera alebo používanie
            analytických cookies).
          </li>
          <li>
            Oprávneného záujmu (napr. zabezpečenie platformy, prevencia
            zneužitia, ochrana právnych nárokov prevádzkovateľa a používateľov –
            pričom tieto záujmy prevažujú nad vašimi právami, pokiaľ nie ste
            dotknutá osoba s prevažujúcimi oprávnenými dôvodmi).
          </li>
          <li>
            Právnej povinnosti (účtovné a daňové povinnosti, uchovávanie
            účtovných a platobných záznamov).
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Doba uchovávania údajov</h2>
        <p>Údaje uchovávame len po dobu nevyhnutnú na účel ich spracovania:</p>
        <ul className="list-disc pl-6">
          <li>
            Účet používateľa – do jeho zrušenia; niektoré údaje môžeme uchovávať
            aj po zrušení účtu, ak to vyžaduje zákon (napr. účtovné záznamy) alebo
            ak máte aktívne rezervácie, ktoré bránia okamžitému vymazaniu.
          </li>
          <li>
            Rezervácie a platobné záznamy – po dobu potrebnú na plnenie zmluvy,
            riešenie sporov a plnenie účtovných a daňových povinností (zvyčajne
            po dobu stanovenu účtovnými a daňovými predpismi).
          </li>
          <li>
            Prístupové tokeny rezervácie – počas trvania rezervácie a primeranú
            dobu po skončení pobytu.
          </li>
          <li>
            Záznamy o odoslaní potvrzovacích e-mailov – v súlade s dobou
            uchovávania príslušnej rezervácie.
          </li>
          <li>
            Komunikácia a e-maily – do 12 mesiacov od ukončenia komunikácie,
            pokiaľ zákon nevyžaduje dlhšiu lehotu.
          </li>
          <li>Cookies – podľa nastavení súhlasu používateľa.</li>
          <li>Účtovné a právne údaje – podľa zákonom stanovenej lehoty.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          7. Príjemcovia a sprostredkovatelia
        </h2>
        <p>
          Na prevádzku platformy a spracovanie rezervácií využívame tieto služby
          tretích strán, ktoré môžu spracúvať osobné údaje v našom mene:
        </p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Stripe</strong> — spracovanie online platieb rezervačného
            poplatku (platobné metadáta, e-mail zákazníka podľa potreby platby)
          </li>
          <li>
            <strong>Resend</strong> — doručovanie transakčných e-mailov (adresa
            príjemcu, obsah správy)
          </li>
          <li>
            <strong>Neon</strong> — hosting databázy (všetky údaje uložené v
            platforme)
          </li>
          <li>
            <strong>Vercel</strong> — hosting webovej aplikácie (technické
            logy)
          </li>
          <li>
            <strong>Vercel Blob</strong> — ukladanie obrázkov chát nahraných
            vlastníkmi
          </li>
        </ul>
        <p>
          Títo sprostredkovatelia spracúvajú údaje podľa našich pokynov a v
          rozsahu nevyhnutnom na poskytnutie služby. S relevantnými
          sprostredkovateľmi máme uzavreté zmluvy o spracúvaní osobných údajov
          alebo iné zmluvné záruky v súlade s GDPR, pokiaľ to zákon vyžaduje.
        </p>
        <p>Vaše údaje môžeme sprístupniť aj:</p>
        <ul className="list-disc pl-6">
          <li>orgánom verejnej správy, ak to vyžaduje zákon.</li>
        </ul>
        <p className="font-semibold">
          Údaje neposkytujeme tretím stranám na marketingové účely bez vášho
          súhlasu.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Práva dotknutej osoby</h2>
        <p>
          Podľa GDPR máte právo na prístup k údajom, opravu, vymazanie,
          obmedzenie spracovania, prenosnosť údajov a právo namietať proti
          spracovaniu založenému na oprávnenom záujme. Tieto práva sa vzťahujú
          aj na údaje súvisiace s rezerváciami a platbami.
        </p>
        <p>
          Právo na vymazanie môže byť obmedzené, ak údaje musíme uchovávať z
          dôvodu právnej povinnosti (napr. účtovné a daňové záznamy) alebo na
          uplatnenie právnych nárokov. Žiadosť o uplatnenie práv môžete poslať
          na {LEGAL_OPERATOR_EMAIL}.
        </p>
        <p>
          Máte tiež právo podať sťažnosť na Úrad na ochranu osobných údajov
          Slovenskej republiky (
          <a
            href="https://dataprotection.gov.sk"
            className="text-blue-600 underline hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            dataprotection.gov.sk
          </a>
          ).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">9. Medzinárodné prenosy údajov</h2>
        <p>
          Niektorí naši sprostredkovatelia (napr. Stripe, Vercel) môžu
          spracúvať údaje aj mimo Európskeho hospodárskeho priestoru, najmä v
          Spojených štátoch amerických. V takých prípadoch zabezpečujeme
          primeranú úroveň ochrany údajov prostredníctvom štandardných
          zmluvných doložiek schválených Európskou komisiou alebo iných
          zákonných mechanizmov podľa GDPR.
        </p>
      </section>
    </div>
  );
}
