import { useParams } from "react-router-dom";

function AllExhibitionsPage() {
  const { lang } = useParams();
  const isUz = lang === "uz";

  return (
    <main className="page-section">
      <div className="container">
        <h1>{isUz ? "Ko‘rgazmalar" : "Выставки"}</h1>
        <p>
          {isUz
            ? "Bu bo‘lim tez orada Toshkentdagi ko‘rgazmalar afishasi bilan to‘ldiriladi."
            : "Этот раздел скоро будет заполнен афишей выставок Ташкента."}
        </p>
      </div>
    </main>
  );
}

export default AllExhibitionsPage;