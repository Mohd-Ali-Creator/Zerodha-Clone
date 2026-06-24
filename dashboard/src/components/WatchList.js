import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Delete,
} from "@mui/icons-material";
import { watchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";

const allStocks = [
  { name: "INFY", price: 1555.45, percent: "-1.60%", isDown: true },
  { name: "ONGC", price: 116.8, percent: "-0.09%", isDown: true },
  { name: "TCS", price: 3194.8, percent: "-0.25%", isDown: true },
  { name: "KPITTECH", price: 266.45, percent: "3.54%", isDown: false },
  { name: "QUICKHEAL", price: 308.55, percent: "-0.15%", isDown: true },
  { name: "WIPRO", price: 577.75, percent: "0.32%", isDown: false },
  { name: "M&M", price: 779.8, percent: "-0.01%", isDown: true },
  { name: "RELIANCE", price: 2112.4, percent: "1.44%", isDown: false },
  { name: "HUL", price: 512.4, percent: "1.04%", isDown: false },
  { name: "SBIN", price: 430.2, percent: "-0.34%", isDown: true },
  { name: "HDFCBANK", price: 1522.35, percent: "0.11%", isDown: false },
  { name: "BHARTIARTL", price: 541.15, percent: "2.99%", isDown: false },
  { name: "TATAPOWER", price: 124.15, percent: "-0.24%", isDown: true },
  { name: "ITC", price: 207.9, percent: "0.80%", isDown: false }
];

const WatchList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWatchlist, setActiveWatchlist] = useState(watchlist);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddToWatchlist = (stock) => {
    if (!activeWatchlist.some((s) => s.name === stock.name)) {
      setActiveWatchlist([...activeWatchlist, stock]);
    }
  };

  const handleRemoveFromWatchlist = (stockName) => {
    setActiveWatchlist(activeWatchlist.filter((s) => s.name !== stockName));
  };

  const filteredStocks = allStocks.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const labels = activeWatchlist.map((stock) => stock.name);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Price",
        data: activeWatchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <span className="counts"> {activeWatchlist.length} / 50</span>
      </div>

      <ul className="list">
        {searchQuery ? (
          filteredStocks.map((stock, index) => {
            const isAdded = activeWatchlist.some((s) => s.name === stock.name);
            return (
              <SearchItem
                stock={stock}
                key={index}
                isAdded={isAdded}
                onAdd={() => handleAddToWatchlist(stock)}
                onRemove={() => handleRemoveFromWatchlist(stock.name)}
              />
            );
          })
        ) : (
          activeWatchlist.map((stock, index) => {
            return (
              <WatchListItem
                stock={stock}
                key={index}
                onRemove={() => handleRemoveFromWatchlist(stock.name)}
              />
            );
          })
        )}
      </ul>

      <DoughnutChart data={chartData} />
    </div>
  );
};

export default WatchList;

const SearchItem = ({ stock, isAdded, onAdd, onRemove }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="item-info">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="down" />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {showWatchlistActions && (
        <span className="actions" style={{ display: "flex", position: "absolute", right: "10px", top: "0", height: "100%", alignItems: "center" }}>
          <span>
            {isAdded ? (
              <button
                className="sell"
                style={{ fontSize: "0.75rem", padding: "4px 8px", width: "auto", height: "auto" }}
                onClick={onRemove}
              >
                Remove
              </button>
            ) : (
              <button
                className="buy"
                style={{ fontSize: "0.75rem", padding: "4px 8px", width: "auto", height: "auto" }}
                onClick={onAdd}
              >
                Add
              </button>
            )}
          </span>
        </span>
      )}
    </li>
  );
};

const WatchListItem = ({ stock, onRemove }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = (e) => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = (e) => {
    setShowWatchlistActions(false);
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="item-info">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="down" />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {showWatchlistActions && (
        <WatchListActions uid={stock.name} onRemove={onRemove} />
      )}
    </li>
  );
};

const WatchListActions = ({ uid, onRemove }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid);
  };

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy">Buy</button>
        </Tooltip>
        <Tooltip
          title="Delete (D)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={onRemove}
        >
          <button className="action" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Delete className="icon" style={{ fontSize: "1.1rem" }} />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
