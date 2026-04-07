import { useParams } from "react-router-dom";

function AllRestaurantsPage() {
  const { lang } = useParams();
  const isUz = lang === "uz";

  return (
    <main className="page-section">
      <div className="container">
        <h1>{isUz ? "Restoranlar" : "Рестораны"}</h1>
        <p>
          {isUz
            ? "Bu bo‘lim tez orada restoranlar va gastronomik joylar tanlovi bilan to‘ldiriladi."
            : "Этот раздел скоро будет заполнен подборкой ресторанов и гастрономических мест."}
        </p>
      </div>
    </main>
  );
}

export default AllRestaurantsPage;