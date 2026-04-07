import { useParams } from "react-router-dom";

function AllKidsPage() {
  const { lang } = useParams();
  const isUz = lang === "uz";

  return (
    <main className="page-section">
      <div className="container">
        <h1>{isUz ? "Bolalar uchun" : "Детям"}</h1>
        <p>
          {isUz
            ? "Bu bo‘lim tez orada bolalar uchun tadbirlar va joylar bilan to‘ldiriladi."
            : "Этот раздел скоро будет заполнен событиями и местами для детей."}
        </p>
      </div>
    </main>
  );
}

export default AllKidsPage;