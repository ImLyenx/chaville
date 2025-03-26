import { Header } from "../header";
import Footer from "../footer";

export default function cesu() {
  return (
    <section className="sm:m-10 m-2">
      <Header />
      <div>
        <div className="bg-white p-10 rounded-3xl sm:m-10 m-2">
          <h2 className="font-bold sm:text-3xl m-5 mb-10 text-xl">
            Qu&apos;est-ce que le CESU ?
          </h2>
          <p className="m-5 font-bold">
            Le Cesu est une offre simplifiée pour déclarer facilement la
            rémunération de votre salarié à domicile pour des activités de
            service à la personne. Le Cesu concerne tous les particuliers à
            différents moments de leur vie, pour améliorer le quotidien, pour la
            prise en charge de quelques heures de ménage ou pour accompagner une
            personne âgée ou handicapée.
          </p>
        </div>

        <div className="sm:m-10 m-2">
          <h2 className="font-bold sm:text-3xl sm:m-5 sm:mb-10 m-0 text-xl text-[#920F4F] ml-10">
            Le CESU c&apos;est pour qui ?
          </h2>
          <div className="font-bold m-5 bg-white p-10 rounded-3xl">
            <p className="sm:m-5 sm:w-2/5 m-0 w-full">
              Le Cesu vous permet de déclarer la rémunération de votre salarié
              pour des activités de services à la personne réalisées à votre
              domicile :
            </p>
            <ol className="list-disc sm:m-5 m-0">
              <li className="sm:ml-10 m-0">l&apos;entretien de la maison,</li>
              <li className="sm:ml-10 m-0">
                les petits travaux de jardinage et bricolage,
              </li>
              <li className="sm:ml-10 m-0">
                le soutien scolaire (à l&apos;exception des cours à distance qui
                ne sont pas éligibles au Cesu),
              </li>
              <li className="sm:ml-10 m-0">le babysitting,</li>
              <li className="sm:ml-10 m-0">
                l&apos;assistance aux personnes âgées ou fragiles à
                l&apos;exception de soins relevant d&apos;actes médicaux,
              </li>
              <li className="sm:ml-10 m-0">
                toutes les activités qui s&apos;exercent en dehors du domicile
                dans le prolongement d&apos;une activité de service au domicile
                de l&apos;employeur.
              </li>
            </ol>
          </div>
        </div>

        <div className="sm:m-10 m-2">
          <h2 className="font-bold sm:text-3xl sm:m-5 sm:mb-10 m-0 text-xl text-[#920F4F] ml-10">
            Attention, vous ne pouvez pas notamment utiliser le Cesu pour :
          </h2>
          <ol className="list-disc m-5 font-bold bg-white p-10 rounded-3xl ">
            <li className="sm:ml-10 m-0">
              les travaux de rénovation de l&apos;habitat,
            </li>
            <li className="sm:ml-10 m-0">
              l&apos;emploi d&apos;une assistante maternelle agréée.
            </li>
          </ol>
        </div>

        <div className="sm:m-10 m-2">
          <h2 className="font-bold sm:text-3xl sm:m-5 sm:mb-10 m-0 text-xl text-[#920F4F] ml-10">
            Est-ce obligatoire ?
          </h2>
          <div className="font-bold m-5 bg-white sm:p-10 p-2 rounded-3xl">
            <p className="m-5">
              Dès que vous faites appel à un salarié à votre domicile, vous avez
              l&apos;obligation de le déclarer. Votre déclaration permet au Cesu
              de calculer les cotisations, d&apos;établir et d&apos;adresser le
              bulletin de salaire à votre salarié. Ces cotisations sont les
              principales bases du financement solidaire de la{" "}
              <a
                className="italic p-2"
                href="https://www.cesu.urssaf.fr/info/accueil/lexique.html?letter=S#securite-sociale"
              >
                Sécurité sociale.
              </a>
            </p>
            <p className="m-5">
              En tant que salarié, être déclaré vous garantit des droits et vous
              permet de bénéficier d&apos;une couverture sociale : assurance
              maladie, maternité,{" "}
              <a
                className="italic p-2"
                href="https://www.cesu.urssaf.fr/info/accueil/lexique.html?letter=R#retraite"
              >
                retraite
              </a>
              , accident du travail, chômage… Ne pas être déclaré, c&apos;est
              vous pénaliser dans l&apos;obtention de vos droits sociaux. Ne pas
              déclarer, établir une fausse déclaration ou ne pas déclarer toutes
              les heures effectuées, c&apos;est encourir une sanction pénale et
              civile.
            </p>
          </div>
        </div>

        <div className="sm:m-10 m-2">
          <h2 className="font-bold sm:text-3xl sm:m-5 sm:mb-10 m-0 text-xl text-[#920F4F] ml-10">
            Les avantages
          </h2>
          <div className="font-bold m-5 bg-white sm:p-10 p-2 rounded-3xl">
            <p className="m-5">
              Dès lors que vous établissez une déclaration, l&apos;Urssaf
              service Cesu s&apos;assure des{" "}
              <a
                className="italic p-2 rounded-lg"
                href="https://www.urssaf.fr/accueil/outils-documentation/taux-baremes.html"
              >
                taux de cotisations
              </a>{" "}
              en vigueur et réalise l&apos;ensemble des opérations. Le Cesu,
              c&apos;est plus de tranquillité. Plus besoin de suivre les
              évolutions des taux, ils sont mis à jour automatiquement en
              fonction des nouvelles réglementations.
            </p>
            <p className="m-5">
              Le Cesu vous offre aussi plus de fiabilité. Les
              <a
                className="italic p-2"
                href="https://www.cesu.urssaf.fr/info/accueil/lexique.html?letter=C#cotisations-patronales"
              >
                cotisations patronales
              </a>
              et salariales sont calculées et vérifiées par un système
              performant et éprouvé depuis plus de 20 ans. Avec le Cesu, vous
              évitez toute erreur de calcul.
            </p>
          </div>
        </div>
        <br></br>

        <h2 className="font-bold text-3xl italic ml-10">
          Pour plus d&apos;informations, veuillez regarder le site web :
          <br></br>{" "}
          <a
            className="italic p-2 text-[#920F4F]"
            href="https://www.cesu.urssaf.fr/info/accueil/s-informer-sur-le-cesu/tout-savoir/c-est-quoi-pour-qui.html"
          >
            S'informer sur le CESU
          </a>
        </h2>
      </div>
      <Footer />
    </section>
  );
}
