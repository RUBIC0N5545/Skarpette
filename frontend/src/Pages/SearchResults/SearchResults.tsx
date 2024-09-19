import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Item from "../../Components/Item/Item";
import DataItem from "../../types/DataItem";
import "./SearchResults.scss";
import PageNavigation from "../../Components/PageNavigation/PageNavigation";
import ErrorNoResult from "../../Components/ErrorNoResult/ErrorNoResult";


const SearchResultsPage: React.FC = () => {
  const [results, setResults] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [is404Error, setIs404Error] = useState<boolean>(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      setIs404Error(false);
      try {
        const isVendorCode = /^\d+$/.test(query);

        const url = isVendorCode
          ? `http://localhost:5000/skarpette/search?vendor_code=${query}`
          : `http://localhost:5000/skarpette/search?name=${query}`;

        const response = await fetch(url);

        if (response.status === 404) {
          setIs404Error(true);
          throw new Error("Ресурс не найден");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setError(
          "Произошла ошибка при загрузке данных. Пожалуйста, попробуйте еще раз."
        );
        setResults([]);
      }
      setLoading(false);
    };

    if (query) {
      fetchResults();
    } else {
      setLoading(false);
      setResults([]);
    }
  }, [query]);

  if (loading) {
    return <div className="search-results">Загрузка...</div>;
  }

  if (is404Error) {
    return <ErrorNoResult query={query} />;
  }

  if (error) {
    return <div className="search-results error">{error}</div>;
  }

  return (
    <>
      <PageNavigation
        linkText="Результати пошуку"
        homeLink="/"
        linkHref="/search-results"
      />
      <div className="search-results">
        <h1>Результати пошуку для: "{query}"</h1>
        {results.length > 0 ? (
          <>
            <div className="search-results-grid">
              {results.map((item) => (
                <Item
                  key={item._id}
                  vendor_code={item.vendor_code}
                  image={item.images_urls?.[0] || ""}
                  category={item.type}
                  name={item.name}
                  price={item.price}
                  discount_price={item.price2}
                  isNew={item.is_new}
                  discountPercentage={item.discountPercentage}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <p>На Ваш запит "{query}" нічого не знайдено</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResultsPage;