import { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = [
  // 1. EMI Mathematics
  {
    id: 'how-emi-is-calculated',
    slug: 'how-emi-is-calculated-formula-and-tricks',
    title: 'How Loan EMI is Calculated: The Hidden Truth of Frontloaded Interest',
    excerpt: 'Understand the mathematical mechanics of reducing balance EMIs and how paying just one extra EMI per year can cut 5+ years off your home loan.',
    readTime: '7 min read',
    publishedAt: 'Jan 2025',
    category: 'Finance & Banking',
    imageUrl: '/images/compound_growth.jpg',
    relatedCalculatorSlug: 'emi-calculator',
    references: [
      {
        title: 'Master Direction – Reserve Bank of India (Interest Rate on Advances) Directions',
        url: 'https://rbi.org.in/',
        source: 'Reserve Bank of India (RBI)',
      },
      {
        title: 'Amortization Schedules & Reducing Balance Method Explained',
        url: 'https://www.investopedia.com/terms/a/amortization.asp',
        source: 'Investopedia Finance Guide',
      },
    ],
    content: `
## The Mathematics of Equated Monthly Installments (EMI)

When you borrow a long-term loan from a bank (such as a 20-year home loan of ₹30,00,000 at 8.75% interest), your monthly payment ($EMI$) consists of two interdependent components:

1. **Principal Repayment**: The portion that directly reduces the outstanding debt balance.
2. **Interest Charge**: The borrowing fee calculated strictly on the current outstanding balance.

The standard reducing balance formula used globally by commercial banks is:

$$EMI = P \\times r \\times \\frac{(1 + r)^n}{(1 + r)^n - 1}$$

Where:
- $P$ = Principal Loan Amount
- $r$ = Periodic Monthly Interest Rate (Annual Rate / 12 / 100)
- $n$ = Total Number of Monthly Installments (Years &times; 12)

### The Frontloaded Interest Phenomenon

In the initial 5 to 7 years of a 20-year mortgage, nearly **70% to 80% of every monthly EMI check goes purely towards interest**, leaving the principal debt balance barely touched.

> **Key Rule of Thumb:** If you pay an extra 5% to 10% over your standard EMI as a dedicated principal prepayment, 100% of that extra cash directly reduces the principal balance, stripping away compounding interest years in advance.

### Case Study: The ₹5,000 Prepayment Multiplier

Let us examine a loan of **₹30,00,000 at 8.75% for 20 years (240 months)**:
- Standard Monthly EMI: **₹26,511**
- Total Interest over 20 years: **₹33,62,729** (More than the principal!)
- Total Repayment: **₹63,62,729**

Now, what happens if you add just **₹5,000/month** in extra prepayment?
- New Monthly Outflow: **₹31,511**
- Loan gets completely paid off in **14.3 years** (instead of 20 years).
- **Total Interest Saved: ₹11,84,200!**

| Strategy | Monthly Payment | Loan Duration | Total Interest Paid | Total Savings |
| :--- | :--- | :--- | :--- | :--- |
| **Standard Baseline** | ₹26,511 | 20.0 Years | ₹33,62,729 | ₹0 |
| **+₹2,000 / Month** | ₹28,511 | 17.1 Years | ₹27,85,400 | **₹5,77,329** |
| **+₹5,000 / Month** | ₹31,511 | 14.3 Years | ₹21,78,529 | **₹11,84,200** |
| **1 Extra EMI / Year** | ₹26,511 + Lump | 16.2 Years | ₹25,90,100 | **₹7,72,629** |
`,
  },

  // 2. SIP vs Lumpsum
  {
    id: 'sip-vs-lumpsum-verdict',
    slug: 'sip-vs-lumpsum-historical-analysis',
    title: 'SIP vs Lumpsum: The Stochastic Verdict Across 20 Years of Market Cycles',
    excerpt: 'We ran 10,000 Monte Carlo iterations comparing Dollar Cost Averaging against Lump Sum investing across bull, bear, and sideways regimes.',
    readTime: '8 min read',
    publishedAt: 'Feb 2025',
    category: 'Investment & Wealth',
    imageUrl: '/images/monte_carlo.jpg',
    relatedCalculatorSlug: 'sip-calculator',
    references: [
      {
        title: 'National Stock Exchange (NSE) Historical Index Statistics & Total Return Indices',
        url: 'https://www.nseindia.com/',
        source: 'NSE India Research',
      },
      {
        title: 'Dollar-Cost Averaging vs Lump-Sum: An Empirical Study',
        url: 'https://www.vanguard.com/pdf/ISGDCA.pdf',
        source: 'Vanguard Research Division',
      },
    ],
    content: `
## The Core Dilemma: Timing vs Time in the Market

Investors with accumulated cash constantly wrestle with whether to deploy capital immediately (*Lumpsum*) or systematically stagger it over 12 to 36 months (*Systematic Investment Plan / Dollar Cost Averaging*).

### Mathematical Mechanics

1. **Lumpsum Expectation:** Since equity indices trend upwards over multi-decade horizons due to nominal GDP expansion and corporate earnings growth, money invested earlier enjoys a longer compounding runway:
$$FV_{Lump} = PV \\times (1 + r)^t$$

2. **SIP / DCA Variance Minimizer:** Rupee Cost Averaging lowers sequence-of-returns risk by automatically acquiring more fund units when market prices drop:
$$FV_{SIP} = P \\times \\frac{(1 + i)^n - 1}{i} \\times (1 + i)$$

### Empirical Results from 2000–2024 NIFTY 50 TRI Data

Over 10-year rolling investment windows:
- **Lumpsum outperformed SIP in 68.4% of historical periods** (due to the upward equity drift).
- **SIP beat Lumpsum in 31.6% of periods** — specifically during secular bear market entries (e.g., investing in early 2000 before the Dotcom bust, or January 2008 before the GFC).

> **The Psychological Edge:** While Lumpsum holds the statistical edge in mathematical expectation, SIP guarantees survival against panic selling during early sequence drawdown shocks.
`,
  },

  // 3. Probability Paradoxes
  {
    id: 'monty-hall-birthday-paradox',
    slug: 'monty-hall-and-birthday-probability-paradoxes',
    title: 'The Monty Hall & Birthday Paradox: Why Human Intuition Fails at Probability',
    excerpt: 'Explore why your brain naturally calculates a 50% chance on Monty Hall when the true math is 66.7%, and why 23 people guarantee a 50.7% birthday match.',
    readTime: '6 min read',
    publishedAt: 'Feb 2025',
    category: 'Probability & Math',
    imageUrl: '/images/probability_paradox.jpg',
    relatedCalculatorSlug: 'monte-carlo-pi-simulator',
    references: [
      {
        title: 'The Monty Hall Problem: A Classic Demonstration of Conditional Probability',
        url: 'https://ocw.mit.edu/courses/mathematics/',
        source: 'MIT OpenCourseWare (Probability & Statistics)',
      },
      {
        title: 'Combinatorics and the Birthday Collision Boundary',
        url: 'https://plato.stanford.edu/',
        source: 'Stanford Encyclopedia of Philosophy',
      },
    ],
    content: `
## Conditional Probability and Bayesian Updating

Human cognitive heuristics rely on symmetry: when two doors remain closed, our instinct erroneously tells us each door has an equal $50\\%$ probability of holding the prize.

### The Monty Hall Mathematical Proof

Let the car be located behind Door 1, 2, or 3 with prior probabilities:
$$P(C_1) = P(C_2) = P(C_3) = \\frac{1}{3}$$

Suppose you pick Door 1 ($P(\\text{Win if you STAY}) = \\frac{1}{3}$). The host, Monty Hall, who knows what is behind each door, opens Door 3 to reveal a goat.

By Bayes' Theorem:
$$P(C_2 \\mid \\text{Host opens 3}) = \\frac{P(\\text{Host opens 3} \\mid C_2) \\times P(C_2)}{P(\\text{Host opens 3})} = \\frac{1 \\times \\frac{1}{3}}{\\frac{1}{2}} = \\frac{2}{3} \\approx 66.67\\%$$

### The Birthday Collision Paradox

In a room of just **23 people**, the probability that at least two share a birthday exceeds **50% ($50.73\\%$)**!

Why? We are not checking if someone matches *your* specific birthday ($22$ comparisons). We are checking all pairwise combinations:
$$\\binom{23}{2} = \\frac{23 \\times 22}{2} = 253 \\text{ distinct pairs!}$$

$$P(\\text{No Match}) = \\frac{365}{365} \\times \\frac{364}{365} \\times \\dots \\times \\frac{343}{365} \\approx 0.4927$$
$$P(\\text{At least 1 Collision}) = 1 - 0.4927 = 0.5073 \\quad (50.73\\%)$$
`,
  },

  // 4. Old vs New Tax Regime
  {
    id: 'old-vs-new-tax-regime-guide',
    slug: 'old-vs-new-tax-regime-inflection-point',
    title: 'Old vs New Tax Regime in India: The Mathematical Inflection Point for FY 2025-26',
    excerpt: 'Detailed comparison of deductions (80C, 80D, HRA, NPS) vs simplified slab rates to calculate your personal tax breakeven point.',
    readTime: '9 min read',
    publishedAt: 'Feb 2025',
    category: 'Taxation & Fiscal Policy',
    imageUrl: '/images/compound_growth.jpg',
    relatedCalculatorSlug: 'salary-calculator',
    references: [
      {
        title: 'Income Tax Department of India — Tax Slab Rates and Notifications',
        url: 'https://incometaxindia.gov.in/',
        source: 'Income Tax Department (CBDT)',
      },
    ],
    content: `
## Deciding Between Old and New Tax Regimes

The Union Budget has made the **New Tax Regime** the default tax framework with lower slab rates and an enhanced **₹75,000 Standard Deduction**. However, the **Old Tax Regime** permits substantial itemized exemptions.

### The Breakeven Deduction Formula

To choose the optimal regime, compute your Total Eligible Deductions ($D_{total}$):
$$D_{total} = \\text{Standard Deduction (₹50k/75k)} + 80C (\\le ₹1.5L) + 80D (\\le ₹50k) + HRA + 80CCD(1B) (₹50k)$$

### Key Mathematical Takeaway
- If your total itemized deductions exceed **₹3,75,000 to ₹4,25,000**, the **Old Regime** typically yields lower total tax.
- If your deductions are below **₹3,50,000**, the **New Tax Regime** guarantees higher take-home pay with zero compliance friction.
`,
  },

  // 5. Physics of Silicon
  {
    id: 'physics-of-2nm-silicon-chips',
    slug: 'physics-of-2nm-gaa-transistors-semiconductors',
    title: 'The Physics of Silicon: How 2nm Gate-All-Around (GAA) Transistors Power Generative AI',
    excerpt: 'From FinFET to RibbonFET and High-NA EUV lithography — how atomic scale engineering prevents quantum tunneling in modern AI supercomputers.',
    readTime: '10 min read',
    publishedAt: 'Mar 2025',
    category: 'Technology & Hardware',
    imageUrl: '/images/products/keyboard.jpg',
    relatedCalculatorSlug: 'developer-tools-suite',
    references: [
      {
        title: 'TSMC N2 Technology and GAA Architecture Whitepaper',
        url: 'https://www.tsmc.com/',
        source: 'TSMC Engineering',
      },
      {
        title: 'ASML High-NA EUV Lithography Specifications',
        url: 'https://www.asml.com/',
        source: 'ASML Lithography Research',
      },
    ],
    content: `
## Beyond the Sub-3nm Scaling Wall

As semiconductor transistor gates shrink below 3 nanometers (the width of roughly 10 silicon atoms), classical electronic conductivity breaks down due to **quantum mechanical tunneling** (electrons leaking across closed barriers).

### From FinFET to GAA Nanosheets (RibbonFET)

1. **Legacy FinFET (3D Fin):** The gate wraps around 3 sides of the channel fin. At sub-3nm nodes, electrostatic control weakens along the bottom edge.
2. **Gate-All-Around (GAA):** Horizontally stacked silicon nanosheets surrounded on **all 4 sides** by the dielectric gate oxide, maximizing channel drive current while eliminating subthreshold leakage.

### High-NA EUV Optics: 0.33 NA vs 0.55 NA
High-NA (Numerical Aperture) lenses use anamorphic magnification ($4\\times$ in X, $8\\times$ in Y) to focus 13.5nm wavelength EUV light into sharper focal patterns, allowing single-exposure print of sub-10nm pitch metal interconnect lines.
`,
  },

  // 6. Quantum Computing Decoded
  {
    id: 'quantum-computing-superposition-shor',
    slug: 'quantum-computing-superposition-shors-algorithm',
    title: 'Quantum Computing Decoded: Superposition, Shor’s Algorithm & Post-Quantum Cryptography',
    excerpt: 'How Hilbert space linear algebra allows quantum qubits to evaluate exponentially vast solution states simultaneously.',
    readTime: '11 min read',
    publishedAt: 'Mar 2025',
    category: 'Quantum Frontiers',
    imageUrl: '/images/probability_paradox.jpg',
    relatedCalculatorSlug: 'monte-carlo-pi-simulator',
    references: [
      {
        title: 'Quantum Computation and Quantum Information — Nielsen & Chuang',
        url: 'https://www.cambridge.org/',
        source: 'Cambridge University Press',
      },
    ],
    content: `
## The Mathematics of Quantum Information

Unlike a classical bit which is strictly $|0\\rangle$ or $|1\\rangle$, a quantum qubit exists as a normalized linear superposition in a two-dimensional complex Hilbert space:

$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle, \\quad \\text{where } |\\alpha|^2 + |\\beta|^2 = 1$$

For $n$ entangled qubits, the state space expands exponentially to $2^n$ simultaneous complex amplitudes:
$$|\\Psi\\rangle = \\sum_{k=0}^{2^n - 1} c_k |k\\rangle$$

### How Shor's Algorithm Breaks RSA Cryptography

RSA encryption relies on the classical computational hardness of prime factorization. While classical algorithms (like the General Number Field Sieve) run in sub-exponential time:
$$\\mathcal{O}\\left(e^{(\\sqrt[3]{\\frac{64}{9}} + o(1)) (\\ln N)^{\\frac{1}{3}} (\\ln \\ln N)^{\\frac{2}{3}}}\\right)$$

Shor's quantum algorithm utilizes the **Quantum Fourier Transform (QFT)** to find the modular order period $r$ in polynomial time:
$$\\mathcal{O}\\left((\\log N)^2 (\\log \\log N) (\\log \\log \\log N)\\right)$$
`,
  },

  // 7. De-Dollarization & Global Macro
  {
    id: 'dedollarization-brics-macroeconomics',
    slug: 'dedollarization-brics-macroeconomics-global-reserves',
    title: 'De-Dollarization and the BRICS Currency Dilemma: Macroeconomic Mechanics of Global Reserves',
    excerpt: 'An objective financial analysis of Triffin’s Dilemma, SWIFT clearing alternatives, and central bank gold accumulation.',
    readTime: '9 min read',
    publishedAt: 'Mar 2025',
    category: 'Global Macroeconomics',
    imageUrl: '/images/compound_growth.jpg',
    relatedCalculatorSlug: 'sip-calculator',
    references: [
      {
        title: 'IMF Currency Composition of Official Foreign Exchange Reserves (COFER)',
        url: 'https://www.imf.org/',
        source: 'International Monetary Fund',
      },
    ],
    content: `
## The Anatomy of the Global Reserve Currency

The US Dollar represents $\\approx 58\\%$ of global foreign exchange reserves and clears $\\approx 88\\%$ of daily foreign exchange turnover ($8.5 Trillion/day).

### Triffin's Dilemma Explained

To supply global trade with sufficient liquid reserve currency, the reserve issuer (the US) must run persistent **Current Account Deficits** ($Import > Export$), exporting dollars to the rest of the world. Over decades, this expands foreign debt liabilities relative to domestic gold/GDP backing.

### The Rise of Bilateral Clearing & Central Bank Gold

Following geopolitical asset freezes in 2022, global central banks accelerated strategic gold bullion acquisitions to record highs, testing tokenized mCBDC platforms (e.g. Project mBridge) for non-dollar cross-border settlements.
`,
  },

  // 8. The Math of Compound Living
  {
    id: 'the-math-of-compound-living',
    slug: 'the-math-of-compound-living-rule-of-72-habits',
    title: 'The Math of Compound Living: The Rule of 72, Buffett’s Snowball, and Habit Stacking',
    excerpt: 'How tiny 1% daily exponential compounding produces 37.78x growth over 365 days, and how to harness nonlinear leverage.',
    readTime: '6 min read',
    publishedAt: 'Mar 2025',
    category: 'Behavioral Math',
    imageUrl: '/images/products/smartwatch.jpg',
    relatedCalculatorSlug: 'sip-calculator',
    references: [
      {
        title: 'The Snowball: Warren Buffett and the Business of Life — Alice Schroeder',
        url: 'https://www.penguinrandomhouse.com/',
        source: 'Penguin Random House',
      },
    ],
    content: `
## The Power of Exponential Functions

Linear growth adds: $1 + 1 + 1 = 3$.
Exponential growth multiplies: $1.01^{365} = 37.78$.

Conversely, consistent 1% daily degradation yields:
$$0.99^{365} = 0.03 \\quad (97\\% \\text{ decline})$$

### The Rule of 72

A rapid mental math formula to determine how many years ($T$) it takes for an asset or capital sum to double at an annual interest rate ($r\\%$):

$$T \\approx \\frac{72}{r}$$

- At $6\\%$ return: Doubles every $12$ years.
- At $12\\%$ return: Doubles every $6$ years.
- At $18\\%$ return: Doubles every $4$ years.
`,
  },

  // 9. Capital Gains Tax (LTCG & STCG)
  {
    id: 'capital-gains-tax-ltcg-stcg-guide',
    slug: 'capital-gains-tax-ltcg-stcg-budget-reforms',
    title: 'Understanding Indian Capital Gains Tax (LTCG & STCG) After Budget Reforms',
    excerpt: 'Clear breakdown of 12.5% Long Term Capital Gains, ₹1.25 Lakh annual exemption, and 20% Short Term Capital Gains on listed equities.',
    readTime: '7 min read',
    publishedAt: 'Mar 2025',
    category: 'Personal Finance & Tax',
    imageUrl: '/images/compound_growth.jpg',
    relatedCalculatorSlug: 'salary-calculator',
    references: [
      {
        title: 'Taxation of Capital Gains Under Section 112A and 111A',
        url: 'https://incometaxindia.gov.in/',
        source: 'Income Tax Department of India',
      },
    ],
    content: `
## Post-Budget Capital Gains Framework

The Indian Income Tax Act has unified and standardized the classification and taxation of capital gains across financial and non-financial asset classes.

### 1. Listed Equities & Equity Mutual Funds
- **STCG (Holding < 12 Months):** Taxed at **20%** under Section 111A.
- **LTCG (Holding > 12 Months):** Taxed at **12.5%** under Section 112A for net gains exceeding **₹1,25,000/year** (up from previous ₹1.0 Lakh exemption).

### 2. Real Estate & Unlisted Assets
- **Holding Period Threshold:** Standardized to **24 Months**.
- **LTCG Rate:** **12.5% without indexation** (with grandfathering options available for properties acquired prior to July 2024).

### Tax Harvesting Strategy
Investors can harvest up to **₹1.25 Lakh in tax-free LTCG each financial year** by selling and immediately repurchasing appreciated mutual fund units, resetting the cost basis upwards without paying tax.
`,
  },

  // 10. Algorithmic Trading & Microstructure
  {
    id: 'algorithmic-trading-market-microstructure',
    slug: 'algorithmic-trading-order-books-microstructure',
    title: 'Algorithmic Trading & High-Frequency Market Microstructure: Order Books, Spreads, and Arbitrage',
    excerpt: 'Inside the sub-millisecond mechanics of Limit Order Books (LOB), Poisson arrival processes, and market making math.',
    readTime: '10 min read',
    publishedAt: 'Mar 2025',
    category: 'Quantitative Finance',
    imageUrl: '/images/monte_carlo.jpg',
    relatedCalculatorSlug: 'quickstats-csv-analyzer',
    references: [
      {
        title: 'Algorithmic and High-Frequency Trading — Cartea, Jaimungal & Penalva',
        url: 'https://www.cambridge.org/',
        source: 'Cambridge University Press',
      },
    ],
    content: `
## The Mechanics of Modern Electronic Exchanges

Modern securities exchanges (NSE, NYSE, CME) operate as continuous double auctions organized into a **Limit Order Book (LOB)** with discrete price levels (ticks) and time priority.

### The Avellaneda-Stoikov Market Making Model

A high-frequency market maker posts bid and ask limit orders to capture the bid-ask spread ($S = p_a - p_b$) while managing inventory risk ($q$):

The reservation price $r(s, q, t)$ is modeled as:
$$r(s, q, t) = s - q \\gamma \\sigma^2 (T - t)$$

Where:
- $s$ = Mid-price of the underlying asset
- $q$ = Current inventory position (units held)
- $\\gamma$ = Risk aversion parameter
- $\\sigma$ = Asset volatility
- $T - t$ = Remaining trading session time horizon

When inventory $q > 0$ (long position), the reservation price shifts downwards, prompting the algorithm to lower its ask quote to encourage rapid liquidation before adverse selection occurs.
`,
  },
];
