require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const authMiddleware = require("./middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret_key_zerodha_clone";
const yahooFinance = require("yahoo-finance2").default;

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// app.get("/addHoldings", async (req, res) => {
//   let tempHoldings = [
//     {
//       name: "BHARTIARTL",
//       qty: 2,
//       avg: 538.05,
//       price: 541.15,
//       net: "+0.58%",
//       day: "+2.99%",
//     },
//     {
//       name: "HDFCBANK",
//       qty: 2,
//       avg: 1383.4,
//       price: 1522.35,
//       net: "+10.04%",
//       day: "+0.11%",
//     },
//     {
//       name: "HINDUNILVR",
//       qty: 1,
//       avg: 2335.85,
//       price: 2417.4,
//       net: "+3.49%",
//       day: "+0.21%",
//     },
//     {
//       name: "INFY",
//       qty: 1,
//       avg: 1350.5,
//       price: 1555.45,
//       net: "+15.18%",
//       day: "-1.60%",
//       isLoss: true,
//     },
//     {
//       name: "ITC",
//       qty: 5,
//       avg: 202.0,
//       price: 207.9,
//       net: "+2.92%",
//       day: "+0.80%",
//     },
//     {
//       name: "KPITTECH",
//       qty: 5,
//       avg: 250.3,
//       price: 266.45,
//       net: "+6.45%",
//       day: "+3.54%",
//     },
//     {
//       name: "M&M",
//       qty: 2,
//       avg: 809.9,
//       price: 779.8,
//       net: "-3.72%",
//       day: "-0.01%",
//       isLoss: true,
//     },
//     {
//       name: "RELIANCE",
//       qty: 1,
//       avg: 2193.7,
//       price: 2112.4,
//       net: "-3.71%",
//       day: "+1.44%",
//     },
//     {
//       name: "SBIN",
//       qty: 4,
//       avg: 324.35,
//       price: 430.2,
//       net: "+32.63%",
//       day: "-0.34%",
//       isLoss: true,
//     },
//     {
//       name: "SGBMAY29",
//       qty: 2,
//       avg: 4727.0,
//       price: 4719.0,
//       net: "-0.17%",
//       day: "+0.15%",
//     },
//     {
//       name: "TATAPOWER",
//       qty: 5,
//       avg: 104.2,
//       price: 124.15,
//       net: "+19.15%",
//       day: "-0.24%",
//       isLoss: true,
//     },
//     {
//       name: "TCS",
//       qty: 1,
//       avg: 3041.7,
//       price: 3194.8,
//       net: "+5.03%",
//       day: "-0.25%",
//       isLoss: true,
//     },
//     {
//       name: "WIPRO",
//       qty: 4,
//       avg: 489.3,
//       price: 577.75,
//       net: "+18.08%",
//       day: "+0.32%",
//     },
//   ];

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.day,
//       day: item.day,
//     });

//     newHolding.save();
//   });
//   res.send("Done!");
// });

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });
//   res.send("Done!");
// });

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

const tickerMap = {
  INFY: "INFY.NS",
  ONGC: "ONGC.NS",
  TCS: "TCS.NS",
  KPITTECH: "KPITTECH.NS",
  QUICKHEAL: "QUICKHEAL.NS",
  WIPRO: "WIPRO.NS",
  "M&M": "M&M.NS",
  RELIANCE: "RELIANCE.NS",
  HUL: "HINDUNILVR.NS",
  SBIN: "SBIN.NS",
  HDFCBANK: "HDFCBANK.NS",
  BHARTIARTL: "BHARTIARTL.NS",
  TATAPOWER: "TATAPOWER.NS",
  ITC: "ITC.NS"
};

app.get("/prices", async (req, res) => {
  try {
    const { symbols } = req.query;
    if (!symbols) {
      return res.status(400).json({ message: "Symbols parameter is required" });
    }

    const symbolList = symbols.split(",");
    const results = {};

    await Promise.all(
      symbolList.map(async (symbol) => {
        const uppercaseSymbol = symbol.toUpperCase();
        const yahooTicker = tickerMap[uppercaseSymbol] || `${uppercaseSymbol}.NS`;
        
        try {
          const quote = await yahooFinance.quote(yahooTicker);
          if (quote) {
            results[uppercaseSymbol] = {
              price: quote.regularMarketPrice,
              percent: quote.regularMarketChangePercent 
                ? `${quote.regularMarketChangePercent.toFixed(2)}%` 
                : "0.00%",
              isDown: quote.regularMarketChangePercent < 0,
            };
          }
        } catch (error) {
          console.error(`Error fetching quote for ${yahooTicker}:`, error.message);
          results[uppercaseSymbol] = {
            price: 100.0,
            percent: "0.00%",
            isDown: false,
          };
        }
      })
    );

    res.json(results);
  } catch (error) {
    console.error("Prices fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/newOrder", authMiddleware, async (req, res) => {
  try {
    let newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
      userId: req.user.id,
    });

    await newOrder.save();
    res.status(201).send("Order saved!");
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/allOrders", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const allOrders = await OrdersModel.find({ userId }).sort({ createdAt: -1 });
    res.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/ai-insights", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const holdings = await HoldingsModel.find({});
    const orders = await OrdersModel.find({ userId: req.user.id });

    let portfolioContext = "The user has the following holdings in their Zerodha trading portfolio:\n";
    if (holdings.length === 0) {
      portfolioContext += "- No active stock holdings currently.\n";
    } else {
      holdings.forEach((h) => {
        const netChange = (h.price - h.avg) * h.qty;
        portfolioContext += `- ${h.name}: Quantity = ${h.qty}, Avg Purchase Price = ₹${h.avg.toFixed(2)}, Current Price = ₹${h.price.toFixed(2)}, Net Value = ₹${(h.price * h.qty).toFixed(2)}, Profit/Loss = ₹${netChange.toFixed(2)}\n`;
      });
    }

    if (orders.length > 0) {
      portfolioContext += "\nRecent orders placed by the user:\n";
      orders.slice(0, 5).forEach((o) => {
        portfolioContext += `- ${o.mode} ${o.qty} shares of ${o.name} at ₹${o.price.toFixed(2)}\n`;
      });
    }

    const systemPrompt = `You are an expert financial analyst and investment advisor for Kite (Zerodha Clone).
You are analyzing the user's trading portfolio. Answer their questions professionally, clearly, and concisely. Keep answers formatted nicely in Markdown paragraphs.

${portfolioContext}

User Query: "${question}"

Provide a professional, concise response in 3-4 paragraphs. If recommending actions, explain the rationale based on their portfolio gains/losses and general market conditions.`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt
                }
              ]
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiResponse) {
          return res.json({ answer: aiResponse });
        }
      }
      
      console.warn("Gemini API call failed, falling back to local heuristic analyzer.");
    }

    // Fallback: Rule-Based Local Portfolio Analyst
    let reply = "";
    const lowercaseQuery = question.toLowerCase();

    if (lowercaseQuery.includes("sell") || lowercaseQuery.includes("buy")) {
      const matchedHolding = holdings.find(h => lowercaseQuery.includes(h.name.toLowerCase()));
      if (matchedHolding) {
        const profit = (matchedHolding.price - matchedHolding.avg) * matchedHolding.qty;
        if (profit > 0) {
          reply = `Based on your portfolio analysis, your position in **${matchedHolding.name}** is currently in profit by **₹${profit.toFixed(2)}** (+${((matchedHolding.price - matchedHolding.avg) / matchedHolding.avg * 100).toFixed(2)}%). Since it is performing well, you could consider booking partial profits if you need liquidity, or hold for long-term growth as the technical indicators remain stable.`;
        } else {
          reply = `Your position in **${matchedHolding.name}** is currently at a loss of **₹${Math.abs(profit).toFixed(2)}** (${((matchedHolding.price - matchedHolding.avg) / matchedHolding.avg * 100).toFixed(2)}%). Selling now would lock in this loss. If the company's fundamentals are still strong, it may be wiser to hold or average down rather than panic sell.`;
        }
      } else {
        reply = `You asked about buying/selling. Looking at your holdings, you hold stocks like INFY, TCS, and RELIANCE. I suggest checking individual stock charts and placing a new buy order using the Watchlist Buy window to build your positions incrementally.`;
      }
    } else if (lowercaseQuery.includes("analyze") || lowercaseQuery.includes("performance") || lowercaseQuery.includes("portfolio")) {
      let totalValue = 0;
      let totalCost = 0;
      holdings.forEach(h => {
        totalValue += h.price * h.qty;
        totalCost += h.avg * h.qty;
      });
      const netGain = totalValue - totalCost;
      const gainPercent = totalCost > 0 ? (netGain / totalCost) * 100 : 0;

      reply = `### Portfolio Performance Analysis
Your total portfolio value is **₹${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}** against an invested capital of **₹${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}**.
Your net profit/loss is **₹${netGain.toFixed(2)}** (**${gainPercent.toFixed(2)}%**).

**Key Takeaways:**
1. Your portfolio is well diversified across IT, energy, and consumer goods.
2. The IT sector (TCS, INFY) makes up a significant portion of your holdings and has seen mild fluctuations.
3. Consolidate your positions in high-performing assets like BHARTIARTL and consider setting price alerts to capture swings.`;
    } else if (lowercaseQuery.includes("best") || lowercaseQuery.includes("worst") || lowercaseQuery.includes("perform")) {
      let bestStock = null;
      let maxGain = -Infinity;
      holdings.forEach(h => {
        const gain = (h.price - h.avg) * h.qty;
        if (gain > maxGain) {
          maxGain = gain;
          bestStock = h;
        }
      });

      if (bestStock) {
        reply = `Your best performing stock is **${bestStock.name}** with a net gain of **₹${maxGain.toFixed(2)}** (+${((bestStock.price - bestStock.avg) / bestStock.avg * 100).toFixed(2)}%). This is followed by stable moves in other sectors. We recommend holding onto winners to let your profits run.`;
      } else {
        reply = `You do not have any holdings loaded in your portfolio at the moment. Add some shares to your watchlist, place a buy order, and I will analyze the best performer for you!`;
      }
    } else {
      reply = `Hello! I am your AI Portfolio Assistant. Here is a quick snapshot of your holdings:
- Total Assets: **${holdings.length}** unique stocks
- Recent Actions: **${orders.length}** orders placed today

Feel free to ask me to:
- *"Analyze my portfolio"*
- *"Should I sell INFY?"*
- *"What is my best performing stock?"*
*(Note: To enable live API responses, add your GEMINI_API_KEY in the backend .env!)*`;
    }

    res.json({ answer: reply });
  } catch (error) {
    console.error("AI Insights error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Authentication Routes
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("DB connected!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });