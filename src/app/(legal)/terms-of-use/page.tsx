import {
  LEGAL_DOMAIN,
  LEGAL_OPERATOR_EMAIL,
  LEGAL_OPERATOR_ICO,
  LEGAL_OPERATOR_NAME,
  TERMS_EFFECTIVE_DATE,
} from '@/lib/legal/constants';
import {
  RESERVATION_FEE_CENTS,
  RESERVATION_REFUND_CENTS,
} from '@/lib/stripe/reservation-checkout';

function formatEur(cents: number) {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

const reservationFee = formatEur(RESERVATION_FEE_CENTS);
const reservationRefund = formatEur(RESERVATION_REFUND_CENTS);

export default function TermsAndConditions() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Obchodné podmienky</h1>
      <p className="text-muted-foreground">Platné od: {TERMS_EFFECTIVE_DATE}</p>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Úvodné ustanovenia</h2>
        <p>
          Tieto obchodné podmienky upravujú používanie webovej platformy{' '}
          {LEGAL_DOMAIN} (ďalej len „web“, „platforma“ alebo „služba“), ktorú
          prevádzkuje {LEGAL_OPERATOR_NAME}, IČO: {LEGAL_OPERATOR_ICO}, e-mail:{' '}
          {LEGAL_OPERATOR_EMAIL} (ďalej len „prevádzkovateľ“).
        </p>
        <p>
          Používaním platformy Napmmit vyjadrujete súhlas s týmito obchodnými
          podmienkami. Odporúčame vám, aby ste si ich pozorne prečítali pred
          registráciou, vytvorením rezervácie alebo využívaním služieb
          platformy.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Predmet služby</h2>
        <p>
          Platforma Napmmit poskytuje online službu na zverejňovanie informácií
          o horských chatách a na sprostredkovanie rezervačných požiadaviek medzi
          návštevníkmi (turistami) a vlastníkmi chát. Prevádzkovateľ poskytuje
          najmä:
        </p>
        <ul className="list-disc pl-6">
          <li>zverejnenie informácií o chatách a ich vybavení,</li>
          <li>správu profilov vlastníkov chát,</li>
          <li>prehľadné vyhľadávanie a filtrovanie chát pre návštevníkov,</li>
          <li>
            online rezervačný proces vrátane spracovania rezervačného poplatku
            (viď časť 3),
          </li>
          <li>
            prenos kontaktných údajov a detailov rezervácie medzi turistom a
            vlastníkom chaty.
          </li>
        </ul>
        <p>
          Prevádzkovateľ nie je poskytovateľom ubytovania a nie je zmluvnou
          stranou zmluvy o ubytovaní medzi turistom a vlastníkom chaty. Zmluva o
          samotnom pobyte a platba za ubytovanie sa uzatvára priamo medzi
          turistom a vlastníkom chaty, pokiaľ nie je na platforme uvedené
          inak.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Rezervácie a platby</h2>
        <p>
          Pri odoslaní rezervačnej požiadavky cez platformu môže byť turista
          vyzvaný uhradiť rezervačný poplatok vo výške {reservationFee}. Tento
          poplatok predstavuje odmenu za online službu platformy spojenú so
          spracovaním rezervácie; nepredstavuje platbu za ubytovanie.
        </p>
        <p>
          Platby rezervačného poplatku spracúva tretia strana{' '}
          <strong>Stripe Payments Europe, Ltd.</strong> (ďalej len „Stripe“).
          Údaje platobnej karty zadávate priamo do zabezpečeného rozhrania
          Stripe; prevádzkovateľ neukladá úplné číslo platobnej karty.
        </p>
        <p>
          Cena ubytovania uvedená pri chate má informatívny charakter. Platba
          za pobyt prebieha priamo medzi turistom a vlastníkom chaty, ak nie je
          na platforme výslovne uvedené inak.
        </p>
        <p>Rezervácia prechádza týmito stavmi:</p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Čaká na potvrdenie (pending):</strong> rezervácia bola
            vytvorená po úspešnej úhrade rezervačného poplatku a čaká na
            potvrdenie vlastníkom chaty.
          </li>
          <li>
            <strong>Potvrdená (confirmed):</strong> vlastník chaty rezerváciu
            potvrdil.
          </li>
          <li>
            <strong>Zrušená (cancelled):</strong> rezervácia bola zrušená
            turistom alebo vlastníkom chaty, prípadne z iného dôvodu podľa
            týchto podmienok.
          </li>
        </ul>
        <p>
          Ak platba rezervačného poplatku zlyhá, rezervácia nevznikne. V prípade
          sporných platieb alebo chargebackov sa uplatňujú pravidlá Stripe a
          platné právne predpisy; otázky môžete smerovať na{' '}
          {LEGAL_OPERATOR_EMAIL}.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Zrušenie rezervácií</h2>
        <p>
          Turista môže zrušiť svoju rezerváciu cez platformu. Ak zruší
          rezerváciu najmenej 48 hodín pred začiatkom pobytu (podľa dátumu
          príchodu uvedeného v rezervácii), má nárok na vrátenie časti
          rezervačného poplatku vo výške {reservationRefund} späť na platobnú
          kartu použitú pri platbe. Pri zrušení menej ako 48 hodín pred
          začiatkom pobytu sa rezervačný poplatok nevracia.
        </p>
        <p>
          Vlastník chaty môže rezerváciu potvrdiť alebo zrušiť. Zrušenie
          rezervácie vlastníkom chaty nenahradzuje pravidlá o vrátení
          rezervačného poplatku uvedené vyššie, pokiaľ nie je v konkrétnom
          prípade dohodnuté alebo zákonne upravené inak.
        </p>
        <p>
          Prevádzkovateľ nezodpovedá za kvalitu ubytovania, dostupnosť chaty,
          zmeny cien ubytovania ani za spory medzi turistom a vlastníkom chaty
          týkajúce sa samotného pobytu.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          5. Registrácia a používateľský účet
        </h2>
        <p>
          Pre plnohodnotné využívanie platformy sa používateľ môže zaregistrovať
          a vytvoriť si používateľský účet. Pri registrácii je povinný uviesť
          pravdivé a aktuálne údaje.
        </p>
        <p>
          Používateľ je zodpovedný za ochranu svojich prihlasovacích údajov a
          nesmie umožniť prístup k účtu tretím osobám. Prevádzkovateľ nenesie
          zodpovednosť za zneužitie účtu spôsobené porušením tejto povinnosti.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Povinnosti používateľa</h2>
        <ul className="list-disc pl-6">
          <li>používať platformu v súlade so zákonmi a dobrými mravmi,</li>
          <li>
            nezverejňovať nepravdivé, zavádzajúce alebo neaktuálne informácie,
          </li>
          <li>
            nezverejňovať obsah porušujúci autorské práva alebo práva tretích
            strán,
          </li>
          <li>nezneužívať platformu na marketingové alebo škodlivé účely,</li>
          <li>
            pri rezervácii uvádzať pravdivé a aktuálne kontaktné údaje (e-mail,
            telefón), aby bolo možné rezerváciu spracovať a komunikovať o nej,
          </li>
          <li>
            vlastníci chát sú povinní primerane reagovať na čakajúce rezervácie
            a udržiavať informácie o svojej chate aktuálne.
          </li>
        </ul>
        <p>
          Prevádzkovateľ si vyhradzuje právo odstrániť obsah alebo zablokovať
          účet používateľa, ak dôjde k porušeniu týchto podmienok.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          7. Obsah zverejnený používateľmi
        </h2>
        <p>
          Používatelia môžu na platforme zverejňovať informácie, texty a obrázky
          svojich chát. Používateľ zodpovedá za to, že má právo tento obsah
          používať a že jeho zverejnením neporušuje práva tretích strán.
        </p>
        <p>
          Používateľ udeľuje prevádzkovateľovi nevýhradnú licenciu na použitie
          obsahu za účelom zobrazenia na platforme a propagácie služby Napmmit.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          8. Spracovatelia a tretie strany
        </h2>
        <p>
          Na prevádzku platformy a spracovanie rezervácií využívame tieto služby
          tretích strán:
        </p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Stripe</strong> — spracovanie online platieb rezervačného
            poplatku,
          </li>
          <li>
            <strong>Resend</strong> — odosielanie transakčných e-mailov,
          </li>
          <li>
            <strong>Vercel</strong> — hosting webovej aplikácie,
          </li>
          <li>
            <strong>Vercel Blob</strong> — ukladanie obrázkov chát,
          </li>
          <li>
            <strong>Neon</strong> — hosting databázy.
          </li>
        </ul>
        <p>
          Podrobnosti o spracovaní osobných údajov týmito subjektmi nájdete v
          dokumente{' '}
          <a
            href="/privacy-policy"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Zásady ochrany osobných údajov
          </a>{' '}
          a v{' '}
          <a
            href="/cookie-policy"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Zásadách používania súborov cookie
          </a>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          9. Zodpovednosť prevádzkovateľa
        </h2>
        <p>
          Prevádzkovateľ sa snaží zabezpečiť správne fungovanie platformy, no
          nezaručuje jej nepretržitú dostupnosť alebo bezchybnosť.
        </p>
        <p>Prevádzkovateľ nezodpovedá za:</p>
        <ul className="list-disc pl-6">
          <li>obsah vložený používateľmi alebo vlastníkmi chát,</li>
          <li>konanie tretích strán (napr. vlastníkov chát),</li>
          <li>
            kvalitu, dostupnosť alebo podmienky ubytovania poskytovaného
            vlastníkmi chát,
          </li>
          <li>škody spôsobené nesprávnym použitím platformy,</li>
          <li>prípadné technické výpadky alebo stratu dát.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">10. Ochrana osobných údajov</h2>
        <p>
          Spracovanie osobných údajov sa riadi dokumentom{' '}
          <a
            href="/privacy-policy"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Zásady ochrany osobných údajov
          </a>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          11. Zmeny a ukončenie poskytovania služby
        </h2>
        <p>
          Prevádzkovateľ si vyhradzuje právo kedykoľvek upraviť alebo ukončiť
          poskytovanie služby, prípadne zmeniť tieto obchodné podmienky.
          Podstatné zmeny zverejníme na stránke {LEGAL_DOMAIN} s uvedením dátumu
          nadobudnutia účinnosti. Ďalšie používanie platformy po nadobudnutí
          účinnosti zmien znamená súhlas s upravenými podmienkami, pokiaľ
          zákon nevyžaduje výslovný súhlas.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">12. Záverečné ustanovenia</h2>
        <p>
          Tieto obchodné podmienky nadobúdajú účinnosť dňom {TERMS_EFFECTIVE_DATE}.
        </p>
        <p>
          Právne vzťahy medzi používateľom a prevádzkovateľom sa riadia právnym
          poriadkom Slovenskej republiky.
        </p>
        <p>
          Ak sa niektoré ustanovenie týchto podmienok stane neplatným alebo
          nevykonateľným, ostatné časti zostávajú v platnosti.
        </p>
      </section>
    </div>
  );
}
