import Image from "next/image";

export default function cesu() {
  return (
    <section className="m-10">
      <div className="bg-[#155093] p-5 rounded-full flex flex-row justify-between">
        <div className="text-white flex flex-row mt-2">
          <p>Consommer Local - </p>
          <p className="font-bold">Chaville</p>
        </div>
        <div className="flex">
          <div className="relative">
            <input
              className="p-2 w-96 rounded-full mr-5 pl-10"
              type="text"
              placeholder="Rechercher des commerçants"
            />
            <Image
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              src="/magnifying-glass-solid.svg"
              alt="Search icon"
              width={15}
              height={15}
              priority
            />
          </div>
          <button className=" w-32  bg-white p-2 rounded-full">Compte ▼</button>
        </div>
      </div>
      <div>
        <div className="bg-white p-10 rounded-3xl m-10">
          <h2 className="font-bold text-3xl m-5 mb-10">
            Qu’est-ce que le CESU ?
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

        <div className="m-10">
          <h2 className="font-bold text-3xl text-[#920F4F] ml-10">
            Le CESU c’est pour qui ?
          </h2>
          <div className="font-bold m-5 bg-white p-10 rounded-3xl">
            <p className="m-5 w-2/5">
              Le Cesu vous facilite les démarches administratives pour déclarer
              la rémunération versée à un salarié à domicile pour des activités
              de services à la personne telles que:
            </p>
            <ol className="list-disc m-5">
              <li className="ml-10">l’entretien de la maison,</li>
              <li className="ml-10">
                les petits travaux de jardinage et bricolage,
              </li>
              <li className="ml-10">
                le soutien scolaire (à l’exception des cours à distance qui ne
                sont pas éligibles au Cesu),
              </li>
              <li className="ml-10">le babysitting,</li>
              <li className="ml-10">
                l’assistance aux personnes âgées ou fragiles à l’exception de
                soins relevant d’actes médicaux,
              </li>
              <li className="ml-10">
                toutes les activités qui s’exercent en dehors du domicile dans
                le prolongement d’une activité de service au domicile de
                l’employeur.
              </li>
            </ol>
          </div>
        </div>

        <div className="m-10">
          <h2 className="font-bold text-3xl text-[#920F4F] ml-10">
            Attention, vous ne pouvez pas notamment utiliser le Cesu pour :
          </h2>
          <ol className="list-disc m-5 font-bold bg-white p-10 rounded-3xl ">
            <li className="ml-10">les travaux de rénovation de l’habitat,</li>
            <li className="ml-10">
              l’emploi d’une assistante maternelle agréée.
            </li>
          </ol>
        </div>

        <div className="m-10">
          <h2 className="font-bold text-3xl text-[#920F4F] ml-10">
            Est-ce obligatoire ?
          </h2>
          <div className="font-bold m-5 bg-white p-10 rounded-3xl">
            <p className="m-5">
              Dès que vous faites appel à un salarié à votre domicile, vous avez
              l’obligation de le déclarer. Votre déclaration permet au Cesu de
              calculer les cotisations, d’établir et d’adresser le bulletin de
              salaire à votre salarié. Ces cotisations sont les principales
              bases du financement solidaire de la{" "}
              <a
                className="italic p-2"
                href="https://www.cesu.urssaf.fr/info/accueil/lexique.html?letter=S#securite-sociale"
              >
                Sécurité sociale.
              </a>
            </p>
            <p className="m-5">
              En tant que salarié, être déclaré vous garantit des droits et vous
              permet de bénéficier d’une couverture sociale : assurance maladie,
              maternité,{" "}
              <a
                className="italic p-2"
                href="https://www.cesu.urssaf.fr/info/accueil/lexique.html?letter=R#retraite"
              >
                retraite
              </a>
              , accident du travail, chômage… Ne pas être déclaré, c’est vous
              pénaliser dans l’obtention de vos droits sociaux. Ne pas déclarer,
              établir une fausse déclaration ou ne pas déclarer toutes les
              heures effectuées, c’est encourir une sanction pénale et civile.
            </p>
          </div>
        </div>

        <div className="m-10">
          <h2 className="font-bold text-3xl text-[#920F4F] ml-10">
            Les avantages
          </h2>
          <div className="font-bold m-5 bg-white p-10 rounded-3xl">
            <p className="m-5">
              Dès lors que vous établissez une déclaration, l'Urssaf service
              Cesu s’assure des{" "}
              <a
                className="italic p-2 rounded-lg"
                href="https://www.urssaf.fr/accueil/outils-documentation/taux-baremes.html"
              >
                taux de cotisations
              </a>{" "}
              en vigueur et réalise l’ensemble des opérations. Le Cesu, c’est
              plus de tranquillité. Plus besoin de suivre les évolutions des
              taux, ils sont mis à jour automatiquement en fonction des
              nouvelles réglementations.
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
          Pour plus d’informations, veuillez regarder le site web :<br></br>{" "}
          <a
            className="italic p-2 text-[#920F4F]"
            href="https://www.cesu.urssaf.fr/info/accueil/s-informer-sur-le-cesu/tout-savoir/c-est-quoi-pour-qui.html"
          >
            S'informer sur le CESU
          </a>
        </h2>
      </div>
    </section>
  );
}
