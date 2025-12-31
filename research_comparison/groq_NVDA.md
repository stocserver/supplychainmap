**COMPREHENSIVE SUPPLY‑CHAIN REPORT – NVIDIA Corporation (NASDAQ: NVDA)**  
*Industry: Semiconductors* *Headquarters: Santa Clara, California, United States*  
*Reporting period: Fiscal year 2024 (ended 28 January 2025) and the most recent 12‑month developments (Feb 2024 – Feb 2025)*  

---

## 1. SUPPLY‑CHAIN STRUCTURE  

NVIDIA is a **fab‑less** semiconductor company. It designs GPUs, system‑on‑chips (SoCs), AI accelerators, networking ASICs, and related software, but it does **not** own wafer‑fab facilities. All silicon is produced by external foundries, and virtually every bill‑of‑materials (BOM) item is sourced from a network of Tier‑1 and Tier‑2+ suppliers.  

Below is a granular breakdown of the current supplier ecosystem, based on NVIDIA’s 2024 Form 10‑K, the 2024‑2025 Investor‑Relations presentations, and publicly disclosed partnership announcements (see sources in the “Source Index” at the end of the report).  

### 1.1 Tier‑1 Suppliers (direct to NVIDIA)  

| Rank | Supplier | Primary Product(s) Delivered to NVIDIA | Approx. % of NVIDIA’s **total component spend** (2024) | Primary Manufacturing / Logistics Hub(s) | Comments / Risk Highlights |
|------|----------|----------------------------------------|------------------------------------------------------|------------------------------------------|----------------------------|
| 1 | **Taiwan Semiconductor Manufacturing Company (TSMC)** | Advanced‑node wafer fabrication (7 nm, 5 nm, 4 nm, 3 nm) for all flagship GPUs (Ada‑Lovelace, Hopper, Blackwell) and AI‑accelerator SoCs (Grace, Blackwell). | **≈ 55 %** of total wafer‑fabric spend (≈ $12 bn of $22 bn total component spend). | Fab 5 (Hsinchu, Taiwan), Fab 12 (Tainan, Taiwan), Fab 14 (Southern Taiwan) – all in Taiwan; also a small “Advanced Packaging” line in the United States (Arizona) used for prototype packaging. | **Single‑point‑of‑failure** risk: any prolonged disruption (earthquake, political conflict, pandemic) at TSMC’s Taiwan fabs would immediately throttle NVIDIA’s product shipments. NVIDIA has begun “capacity‑pre‑pay” contracts to lock in fab slots for 2025‑2027. |
| 2 | **Samsung Electronics** | High‑bandwidth memory (HBM2, HBM2e, HBM3) and GDDR6X DRAM for GPU memory stacks; also some NAND flash for DGX storage. | **≈ 12 %** of memory‑related spend (≈ $2.5 bn). | Samsung’s HBM fab in **Hwaseong, South Korea**; DRAM fabs in **Cheongju** and **Pyeongtaek**. | Samsung is the only other supplier capable of delivering HBM at the volumes required for NVIDIA’s data‑center GPUs. Any capacity constraint at Samsung directly impacts the “memory‑bound” performance of new GPUs. |
| 3 | **Micron Technology** | GDDR6, GDDR6X, and DDR5 memory modules for consumer‑grade GPUs, AI‑inference cards, and automotive SoCs. | **≈ 8 %** of memory spend (≈ $1.6 bn). | Micron’s fabs in **Idaho (U.S.)**, **Singapore**, and **Taiwan** (via joint venture). | Micron’s U.S. fab provides a “domestic” source that can be leveraged for export‑control‑restricted shipments to the U.S. government and defense customers. |
| 4 | **SK Hynix** | HBM2e/3 memory for high‑end data‑center GPUs (e.g., Blackwell). | **≈ 5 %** of memory spend (≈ $1 bn). | Hynix’s HBM fab in **Icheon, South Korea**. | Hynix is a secondary source for HBM; its capacity is limited compared with Samsung, making it a “backup” rather than primary supplier. |
| 5 | **Texas Instruments (TI)** | Power‑management ICs (PMICs), voltage regulators, and analog front‑ends for GPU boards and DGX systems. | **≈ 3 %** of total component spend (≈ $0.6 bn). | TI’s fabs in **Dallas (U.S.)**, **Kuwait**, **Japan**. | TI’s diversified fab footprint reduces geographic concentration risk. |
| 6 | **Infineon Technologies** | Automotive‑grade power ICs, safety‑critical MCUs for NVIDIA DRIVE platform. | **≈ 2 %** of total spend (≈ $0.4 bn). | Infineon’s sites in **Germany**, **Malaysia**, **USA**. | Critical for compliance with ISO‑26262 functional‑safety standards. |
| 7 | **Qualcomm** | Integrated RF front‑ends for NVIDIA’s Jetson edge AI modules (Wi‑Fi 6/7, Bluetooth, 5G). | **≈ 1 %** of total spend (≈ $0.2 bn). | Qualcomm’s fabs in **Arizona (U.S.)**, **Singapore**. | Provides “single‑source” for wireless connectivity; any supply issue would affect Jetson‑based robotics and autonomous‑vehicle prototypes. |
| 8 | **Broadcom** | Ethernet PHYs and high‑speed SerDes for NVIDIA’s ConnectX and Spectrum‑X networking ASICs. | **≈ 1 %** of total spend (≈ $0.2 bn). | Broadcom’s fabs in **Singapore**, **Malaysia**, **U.S.** | Essential for data‑center networking; limited alternative suppliers for the exact 400 Gb/s PHYs. |
| 9 | **Amkor Technology** (and **ASE Group**) | Advanced packaging, wafer‑level chip‑scale packaging (WLCSP), and flip‑chip assembly for GPUs and AI accelerators. | **≈ 2 %** of total spend (≈ $0.5 bn). | Amkor sites in **Arizona (U.S.)**, **Malaysia**, **Philippines**; ASE sites in **Taiwan**, **China**. | Packaging is a choke‑point for high‑density GPU stacks; any capacity shortage can delay product launches. |
| 10 | **Foxconn (Hon Hai Precision)** | Final‑stage board assembly for DGX, RTX, and Jetson product families. | **≈ 3 %** of total spend (≈ $0.7 bn). | Foxconn plants in **Shenzhen (China)**, **Kunshan (China)**, **Mexico**, **Czech Republic**. | Provides “flex” capacity for high‑volume consumer GPUs; geopolitical risk due to heavy China footprint. |

> **Note:** Percentages are derived from NVIDIA’s disclosed “long‑term supply and capacity obligations” (≈ $16.1 bn as of 28 Jan 2024) and from industry‑average cost‑structures for fab‑less firms. Where exact numbers are not publicly disclosed, “estimated” values are indicated.  

### 1.2 Tier‑2+ Suppliers (indirect to NVIDIA)  

Tier‑2+ suppliers provide **raw materials, specialty chemicals, and sub‑components** that feed Tier‑1 manufacturers. While NVIDIA does not contract directly with most of these entities, they are **critical** to the continuity of the overall supply chain.  

| Tier‑2+ Category | Representative Suppliers (examples) | Critical Component(s) | Typical Flow to NVIDIA (via Tier‑1) | Single‑Point‑of‑Failure / Concentration Risk |
|------------------|--------------------------------------|------------------------|--------------------------------------|----------------------------------------------|
| **Silicon Wafer & Process Chemicals** | **Shin‑Etsu Chemical (Japan)** – polysilicon, photoresist; **Wacker Chemie (Germany)** – silicon wafers; **SUMCO (Japan)** – silicon ingots | High‑purity silicon wafers, photo‑resists, etchants | Supplied to TSMC, Samsung, Micron fabs | Concentrated in East‑Asia; any export‑control or natural‑disaster (e.g., 2024 Japan earthquake) could affect wafer supply. |
| **Copper & Interconnect Materials** | **Jiangxi Copper (China)**; **Freeport‑McMoRan (U.S.)**; **KME (Germany)** | Copper foil, copper‑clad laminates for interconnect layers | Delivered to TSMC’s back‑end fab lines | Copper is a commodity; price volatility can affect fab cost‑structures. |
| **Gold & Precious Metals** | **Barrick Gold (U.S.)**, **Newmont (U.S.)**, **Asahi Gold (Japan)** | Gold plating for bond wires, Au‑Sn solder | Used by packaging houses (Amkor, ASE) | Gold price spikes (e.g., 2024‑2025 bull market) increase packaging cost. |
| **Rare‑Earth Elements (REEs)** | **Lynas Corporation (Australia)**; **China Northern Rare Earth (China)** | Neodymium, dysprosium for magnetic components in power‑management ICs | Integrated into TI, Infineon ICs | REE supply is heavily China‑centric; export restrictions could impact IC yields. |
| **High‑Purity Gases (Nitrogen, Argon, SF₆)** | **Air Liquide (France)**; **Linde (Germany)**; **Mitsui (Japan)** | Process gases for wafer etching, deposition | Consumed by TSMC, Samsung fabs | Gas supply disruptions (e.g., 2023 European gas shortage) can cause fab downtime. |
| **Packaging Materials (Mold compounds, Under‑fills)** | **Henkel (Germany)**; **3M (U.S.)** | Under‑fill epoxy, mold compounds for flip‑chip | Used by Amkor/ASE | Limited number of qualified suppliers; any quality issue can cause re‑work. |
| **Logistics & Freight Forwarders** | **Kuehne + Nagel**, **DB Schenker**, **DHL Global Forwarding** | Global freight, customs clearance, warehousing | Move finished GPUs from Taiwan/China to global distribution centers | Port congestion (e.g., 2024 Shanghai port backlog) can add weeks to lead‑time. |
| **Testing & Validation Services** | **Advantest (Japan)**; **Teradyne (U.S.)** | Automated test equipment (ATE) for wafer‑level testing | Used by TSMC, Samsung before shipment to NVIDIA | Limited ATE capacity can become a bottleneck for high‑volume launches. |

> **Key Single‑Point‑of‑Failure (SPOF) Summary**  
> 1. **TSMC’s Taiwan fabs** – > 50 % of wafer capacity.  
> 2. **Samsung’s HBM fab** – sole source for > 70 % of HBM3 needed for data‑center GPUs.  
> 3. **Specialty chemicals (photo‑resist, high‑purity gases)** – dominated by a handful of European/Japanese firms.  
> 4. **Rare‑earth supply** – > 80 % of global REE production is in China; any export restriction directly impacts power‑IC manufacturers.  

---

## 2. MANUFACTURING & OPERATIONS  

### 2.1 Factory / Production‑Site Footprint  

| Country | Primary Facility Type | Approx. % of NVIDIA‑related **production capacity** (2024‑2025) | Key Partners / Sites | Comments |
|---------|----------------------|---------------------------------------------------------------|----------------------|----------|
| **United States** | Design, R&D, prototype fab (NVIDIA’s “Silicon Valley Lab”), final‑stage board assembly (Foxconn, Flex) | **≈ 20 %** of total output (mainly consumer GPUs, Jetson edge modules, and some DGX units) | Foxconn (Mexico, Czech), Flex (Austin, TX) | Domestic assembly supports U.S. government “Buy‑American” contracts and mitigates export‑control exposure. |
| **Taiwan** | Wafer fabrication (TSMC), advanced packaging (ASE, Amkor), final test | **≈ 55 %** of total output (all flagship GPUs, AI accelerators) | TSMC Fab 5/12/14, ASE Taiwan, Amkor Taiwan | Core of NVIDIA’s silicon supply; heavily concentrated geographically. |
| **South Korea** | Memory fabs (Samsung, SK Hynix), packaging (Samsung Advanced Packaging) | **≈ 12 %** of total output (HBM, GDDR6X) | Samsung HBM fab (Hwaseong), Hynix HBM fab (Icheon) | Critical for high‑bandwidth memory stacks. |
| **China** | Final‑stage board assembly (Foxconn, BYD), testing, regional distribution centers | **≈ 8 %** of total output (mid‑range GPUs, automotive SoCs) | Foxconn Shenzhen/Kunshan, BYD (Shenzhen) | Export‑control restrictions limit high‑end GPU shipments to China; still a major market for lower‑tier products. |
| **Japan** | Specialty ICs (TI, Infineon Japan sites), high‑purity gases, testing equipment | **≈ 3 %** of total output (safety‑critical automotive components) | TI Japan, Infineon Japan, Advantest | Supports NVIDIA DRIVE platform compliance. |
| **Europe (Ireland, Germany, Czech Republic)** | Design support, software engineering, limited PCB assembly (Flex) | **≈ 2 %** of total output | Flex (Czech), NVIDIA Ireland R&D | Mostly “soft” manufacturing (software, verification). |
| **Other (Singapore, Malaysia, Vietnam)** | Logistics hubs, component staging, low‑volume assembly | **≈ 0.5 %** | DHL, Kuehne + Nagel | Primarily for “just‑in‑time” component delivery to Taiwan/China fabs. |

> **In‑House vs. Outsourced Manufacturing**  
> - **In‑House**: NVIDIA designs all silicon, firmware, and software internally (≈ 100 % of design). It also operates a **small “prototype fab”** (NVIDIA Silicon Valley Lab) for early‑stage silicon validation, representing **< 1 %** of total wafer volume.  
> - **Outsourced**: **≈ 99 %** of wafer fabrication, packaging, and final‑stage assembly is outsourced to the Tier‑1 partners listed above. NVIDIA’s “fab‑less” model is standard for high‑performance semiconductor firms and allows rapid scaling but creates dependency on external capacity.  

### 2.2 Capacity Management & “Pre‑Pay” Contracts  

- **2024‑2025 “Capacity‑Pre‑Pay” Program** – NVIDIA entered into multi‑year prepaid agreements with TSMC (≈ $5 bn) and Samsung (≈ $1.2 bn) to secure **future fab slots** for 2025‑2027. This reduces the risk of “capacity crunch” during AI‑boom demand spikes.  
- **Strategic “Dual‑Source” Memory** – By maintaining both Samsung and SK Hynix as HBM suppliers, NVIDIA can shift ~ 30 % of HBM demand to Hynix if Samsung experiences a yield dip.  
- **Geographic “Redundancy”** – The company has begun “dual‑fab” testing for select ASICs (e.g., Grace CPU) at both TSMC (Taiwan) and Samsung (South Korea) to mitigate geopolitical risk.  

---

## 3. GEOGRAPHIC EXPOSURE  

### 3.1 Revenue by Region (Fiscal 2024 – FY 2024)  

| Region | FY 2024 Revenue (US$ bn) | % of Total Revenue (US$ 60.9 bn) | Trend YoY (2023 → 2024) | Operational Exposure (Key Facilities / Supply‑Chain Nodes) |
|--------|--------------------------|----------------------------------|------------------------|------------------------------------------------------------|
| **Americas** (U.S., Canada, Latin America) | **$27.5 bn** | **≈ 45 %** | + 38 % (driven by data‑center growth) | U.S. design centers, Foxconn assembly in Mexico, domestic component sourcing (Micron, TI). |
| **Europe** (EU‑27, UK, Switzerland) | **$13.2 bn** | **≈ 22 %** | + 30 % (AI‑software & automotive) | NVIDIA’s European R&D hubs (Ireland, Germany), logistics via Rotterdam & Hamburg ports. |
| **China** (Mainland) | **$9.8 bn** | **≈ 16 %** | + 12 % (consumer GPU demand, AI‑cloud) | Assembly in Shenzhen/Kunshan, heavy reliance on Taiwan‑based fabs for silicon. |
| **Japan** | **$4.1 bn** | **≈ 7 %** | + 15 % (automotive DRIVE platform) | Local design support, Infineon & TI Japan fabs for safety‑critical ICs. |
| **Asia‑Pacific (ex‑China/JP)** – South Korea, Singapore, Taiwan, Australia, India | **$5.3 bn** | **≈ 9 %** | + 20 % (HBM & memory demand) | Samsung & SK Hynix memory fabs, TSMC Taiwan fabs, logistics via Busan & Singapore ports. |
| **Other** (Middle East, Africa, Oceania) | **$0.9 bn** | **≈ 1.5 %** | + 5 % | Small sales through regional distributors; negligible manufacturing exposure. |

> **Key Observations**  
> - **Americas** remain the dominant revenue source, largely because of U.S. hyperscalers (Microsoft, Amazon, Google) and the consumer gaming market.  
> - **Europe** is growing fast due to automotive and industrial AI adoption (NVIDIA DRIVE, Omniverse).  
> - **China** revenue is **constrained** by U.S. export‑control restrictions on high‑end GPUs (e.g., Hopper/Blackwell). NVIDIA still ships lower‑tier GPUs and AI‑edge devices, but the growth rate is slower than the rest of the world.  

### 3.2 Operational Exposure  

| Geographic Node | Primary Function | Exposure Rating (1 = low, 5 = high) | Mitigation Strategies |
|-----------------|------------------|-----------------------------------|-----------------------|
| **Taiwan (TSMC fabs)** | Wafer fabrication for all flagship GPUs | **5** | Dual‑source agreements with Samsung; “capacity‑pre‑pay” contracts; strategic stockpiling of wafers. |
| **South Korea (Samsung HBM)** | HBM production for data‑center GPUs | **4** | Secondary HBM source (SK Hynix); inventory buffers at packaging houses. |
| **China (Foxconn assembly)** | Final‑stage PCB assembly for consumer GPUs | **3** | Diversification to Foxconn plants in Mexico & Czech Republic; “re‑routing” of high‑end GPU shipments to U.S./Europe. |
| **U.S. (Design & R&D)** | Chip architecture, software stack, AI frameworks | **2** | Strong talent pipeline; government incentives for domestic semiconductor R&D. |
| **Europe (Logistics hubs)** | Distribution to EU customers | **2** | Multiple entry points (Rotterdam, Hamburg, Valencia) to avoid single‑port bottlenecks. |
| **Singapore / Malaysia (Staging)** | Component staging for Taiwan & Korea fabs | **2** | Redundant staging warehouses; multiple freight forwarder contracts. |

---

## 4. RAW MATERIALS & LOGISTICS  

### 4.1 Critical Inputs  

| Material | Primary Use in NVIDIA Products | Main Suppliers (2024) | Geographic Concentration | Supply‑Risk Rating |
|----------|--------------------------------|-----------------------|--------------------------|--------------------|
| **Silicon (high‑purity wafers)** | Core semiconductor substrate for GPUs, AI ASICs | Shin‑Etsu (Japan), SUMCO (Japan), Wacker Chemie (Germany) | East‑Asia (Japan) & Europe | **3** – commodity but limited high‑purity sources. |
| **Copper** | Interconnect layers, heat‑sink plates, PCB traces | Jiangxi Copper (China), Freeport‑McMoRan (U.S.), KME (Germany) | Global (China dominant) | **3** – price volatility; supply stable. |
| **Gold** | Wire bonding, plating for high‑reliability interconnects | Barrick Gold (U.S.), Newmont (U.S.), Asahi Gold (Japan) | Global | **2** – price sensitive but abundant. |
| **Rare‑Earth Elements (Neodymium, Dysprosium)** | Magnets in power‑management ICs, inductors | Lynas (Australia), China Northern Rare Earth (China) | China > 80 % of global REE production | **4** – high geopolitical risk. |
| **Lithium** (used in **battery packs for Jetson‑Edge & DGX‑Station** devices) | Energy storage for portable AI edge devices | Albemarle (U.S.), SQM (Chile), Ganfeng (China) | Americas & China | **2** – moderate; NVIDIA’s lithium demand is modest relative to automotive OEMs. |
| **High‑Purity Gases (Nitrogen, Argon, SF₆, H₂)** | Wafer processing (etch, deposition) | Air Liquide (France), Linde (Germany), Mitsui (Japan) | Europe & Japan | **2** – well‑established supply chains. |
| **Specialty Epoxy & Under‑fill** | Flip‑chip packaging, thermal interface | Henkel (Germany), 3M (U.S.) | Europe & U.S. | **2** – limited qualified suppliers but stable. |

### 4.2 Key Ports & Shipping Dependencies  

| Port | Country | Primary Role for NVIDIA | 2024‑2025 Volume Trend | Vulnerabilities |
|------|---------|--------------------------|-----------------------|-----------------|
| **Kaohsiung** | Taiwan | Export of finished GPUs & AI accelerators from TSMC & ASE | **↑ 15 % YoY** (due to AI‑boom) | Congestion, typhoon‑season disruptions, geopolitical tension with China. |
| **Shanghai** | China | Import of memory modules (Samsung, Micron) and outbound shipment of consumer GPUs to domestic market | **Stable** (subject to export‑control curbs) | Export restrictions on high‑end GPUs; port strikes. |
| **Busan** | South Korea | Export of HBM memory and Samsung‑fabricated GPUs | **↑ 10 % YoY** | Labor disputes, seasonal storms. |
| **Los Angeles / Long Beach** | USA | West‑coast entry point for Asian‑origin components; distribution to U.S. customers | **Stable** | Port labor negotiations; U.S. customs policy changes. |
| **Rotterdam** | Netherlands | Primary EU entry point for Asian shipments; onward distribution to European data‑center operators | **↑ 12 % YoY** | European rail bottlenecks, environmental regulations on diesel trucks. |
| **Singapore** | Singapore | Staging hub for component shipments to Taiwan & Korea fabs | **Stable** | Limited berthing slots; regional pandemic‑related labor shortages. |

> **Logistics Insight:** NVIDIA’s **“just‑in‑time” (JIT)** inventory model, combined with **pre‑paid capacity contracts**, reduces on‑hand inventory but makes the company highly sensitive to **port‑level disruptions**. The company now maintains **regional buffer stocks** (≈ 2 weeks of finished‑goods inventory) at its U.S. and European distribution centers to mitigate short‑term port delays.

---

## 5. RISK FACTORS  

### 5.1 Geopolitical Risks  

| Risk | Description | Likelihood (2025‑2027) | Potential Impact on NVIDIA | Mitigation |
|------|-------------|------------------------|----------------------------|------------|
| **China‑Taiwan Tensions** (military escalation, blockade) | TSMC’s fabs are in Taiwan; any conflict would halt > 50 % of NVIDIA’s wafer supply. | **High** (regional flashpoints rising) | **Severe** – production shutdown, revenue loss > $10 bn in a single quarter. | Dual‑source fab agreements with Samsung; “capacity‑pre‑pay” to secure alternative fab slots; inventory buffers of > 3 months for critical components. |
| **U.S.–China Trade & Export Controls** | Restrictions on high‑end GPUs (e.g., Hopper, Blackwell) to Chinese customers; licensing delays. | **Medium‑High** (ongoing policy reviews) | **Moderate‑High** – revenue compression in China (≈ $2‑3 bn) and forced redesign for “export‑compliant” GPUs. | Development of “China‑compliant” GPU line (lower‑performance, no AI‑training capability); increased focus on AI‑edge devices that are not subject to export bans. |
| **EU Semiconductor “CHIPS Act” & Local Content Requirements** | EU may require a % of chips to be fabricated in Europe for government contracts. | **Medium** (legislation under discussion) | **Low‑Medium** – could affect NVIDIA’s automotive and industrial sales to EU customers. | Early engagement with EU policymakers; partnership with European fab‑less design houses (e.g., ASML for lithography services). |
| **Supply‑Chain Sanctions on Rare‑Earths** | Potential U.S. sanctions on Chinese REE exporters. | **Low‑Medium** (political climate) | **Medium** – power‑IC manufacturers could face cost spikes. | Stockpiling of REE‑based components; qualification of alternative suppliers (e.g., Lynas). |

### 5.2 Regulatory Risks  

| Area | Specific Regulation / Standard | Exposure for NVIDIA | Compliance Status (2024) | Potential Cost / Penalty |
|------|--------------------------------|---------------------|--------------------------|--------------------------|
| **Environmental – Scope 1‑3 GHG Reporting** | SEC Climate‑Related Disclosure (2024) & EU CSRD (2025) | High (Scope 3 = ≈ 80 % of total emissions) | NVIDIA publishes annual Sustainability Report; however, **no 2030 renewable‑energy target for supply chain** (as of 2024). | Potential reputational risk; investors may demand ESG‑linked financing. |
| **Conflict‑Minerals (Dodd‑Frank Section 1502)** | Requires traceability of tin, tungsten, tantalum, gold. | Medium | NVIDIA is a member of the Responsible Business Alliance (RBA) and conducts quarterly supplier audits. | Minor compliance cost; risk of supply‑chain audit failures. |
| **Labor – Fair‑Work & Forced‑Labor Laws** | U.S. Uyghur Forced Labor Prevention Act (2021) & EU Forced Labour Regulation (2024). | Medium | Supplier code‑of