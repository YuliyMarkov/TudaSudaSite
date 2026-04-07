import { useParams } from "react-router-dom";

function AllConcertsPage() {
  const { lang } = useParams();
  const isUz = lang === "uz";

  return (
    <main className="page-section">
      <div className="container">
        <h1>{isUz ? "Konsertlar" : "Концерты"}</h1>
        <p>
          {isUz
            ? "Bu bo‘lim tez orada Toshkentdagi konsertlar afishasi bilan to‘ldiriladi."
            : "Этот раздел скоро будет заполнен афишей концертов Ташкента."}
        </p>
      </div>
    </main>
  );
}

export default AllConcertsPage;