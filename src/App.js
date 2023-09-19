import { useEffect, useState } from "react";
import "./App.css";

// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

function App() {
  const [numValue, setNumValue] = useState(0);
  const [selectOptionValue1, setSelectOptionValue1] = useState("EUR");
  const [selectOptionValue2, setSelectOptionValue2] = useState("USD");
  const [numResults, setNumResults] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // async function consumeAPI(url) {
  //   const res = await fetch(url);
  //   const data = await res.json();
  //   const results = data.rates[selectOptionValue2];
  //   setNumResults(results);
  // }
  // useEffect(() => {
  //   consumeAPI(
  //     `https://api.frankfurter.app/latest?amount=${numValue}&from=${selectOptionValue1}&to=${selectOptionValue2}`
  //   );
  // }, [numValue, selectOptionValue1, selectOptionValue2]);

  useEffect(() => {
    async function consumeAPI() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${numValue}&from=${selectOptionValue1}&to=${selectOptionValue2}`
        );
        if (!res.ok)
          throw new Error("Something went wrong with fetching currency");
        const data = await res.json();
        const result = data.rates[selectOptionValue2];
        setNumResults(result);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }
    if (selectOptionValue1 === selectOptionValue2)
      return setNumResults(numValue);
    consumeAPI();
  }, [numValue, selectOptionValue1, selectOptionValue2]);

  return (
    <div>
      <Header></Header>
      <CurrencyConverter
        numValue={numValue}
        setNumValue={setNumValue}
        selectOptionValue1={selectOptionValue1}
        selectOptionValue2={selectOptionValue2}
        setSelectOptionValue1={setSelectOptionValue1}
        setSelectOptionValue2={setSelectOptionValue2}
        numResults={numResults}
        error={error}
        isLoading={isLoading}
      ></CurrencyConverter>
    </div>
  );
}

function CurrencyConverter({
  numValue,
  setNumValue,
  selectOptionValue1,
  selectOptionValue2,
  setSelectOptionValue1,
  setSelectOptionValue2,
  numResults,
  error,
  isLoading,
}) {
  return (
    <div className="currency-container">
      {isLoading && <Loader></Loader>}
      {!isLoading && !error && (
        <div>
          <p className="desc">Enter an amount for convert the currency!</p>
          <input
            value={numValue}
            onChange={(e) => setNumValue(e.target.value)}
            type="text"
            disabled={isLoading}
          />
          <select
            value={selectOptionValue1}
            onChange={(e) => setSelectOptionValue1(e.target.value)}
            disabled={isLoading}
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="CAD">CAD</option>
            <option value="INR">INR</option>
          </select>
          <select
            value={selectOptionValue2}
            onChange={(e) => setSelectOptionValue2(e.target.value)}
            disabled={isLoading}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CAD">CAD</option>
            <option value="INR">INR</option>
          </select>
          <p className="result">
            {numResults} {selectOptionValue2}
          </p>
        </div>
      )}
      {error && <Error>{error}</Error>}
    </div>
  );
}

function Loader() {
  return (
    <div>
      <h4 className="result">Currently Loading...</h4>
    </div>
  );
}

function Error({ children }) {
  return (
    <div>
      <h4 className="result">{children}</h4>
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>Currency Converter</h1>
    </header>
  );
}

export default App;
