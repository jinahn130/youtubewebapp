import React, { useState, useRef, useEffect } from 'react';
import MarketInsights from './MarketInsights'; // adjust path as needed

// Replace with actual parsed JSON objects
let dailyExtract = {
  theme_idea_analysis: [],
  frequently_mentioned_stocks: [],
  top_recommended_stocks: [],
  most_anticipated_events: []
};

let weeklyExtract = {
  theme_idea_analysis: [],
  frequently_mentioned_stocks: [],
  top_recommended_stocks: [],
  most_anticipated_events: []
};

dailyExtract = {"theme_idea_analysis":[{"theme":["U.S.-China Trade War & Tariffs","Global Supply Chains","Macroeconomic Risks"],"ideas":[{"idea":"The U.S.-China trade war has escalated, with the U.S. imposing a 10% universal tariff on imports and a 34% tariff on China, raising the average U.S. tariff rate to its highest since 1909. China responded with tariffs up to 125% on U.S. goods and has reduced its U.S. Treasury holdings to the lowest since 2009, pressuring U.S. interest rates. The U.S. is also coordinating with over 70 countries to block China from rerouting exports, intensifying economic isolation and uncertainty [ZbreGo0j4ko][o4J3naLM-1o][6u-fROiakpI][AY45uQelENc][ZEcHe7fI1Zk]."},{"idea":"Tariffs are causing supply chain disruptions, higher input costs, and declining consumer demand. Sectors like apparel and technology face increased cost pressures, with apparel prices projected to rise 17%. Corporate spending cuts and import surges have contributed to a 0.3% contraction in U.S. GDP in Q1 2025. Reciprocal tariffs could reduce U.S. GDP growth by $4,900 per household annually, with global GDP potentially declining by 7% if tensions persist [wqJiacXf_2c][ZbreGo0j4ko][3Inr4Bytxno][KE8QiAnY53g]."},{"idea":"Projected economic effects include a 2.3% increase in inflation (~$3,800 per household) and a 1% decrease in GDP growth in 2025. Long-term GDP is expected to decline by 0.5% annually ($100B–$180B per year), with stagflation risk elevated. The U.S. remains dependent on Chinese supply chains for critical goods, and 41% of S&P 500 revenues are derived from international markets, increasing vulnerability [ZbreGo0j4ko][CylWqcUHYKk]."}],"market_sentiment":"bearish","stock_mentions":[{"ticker":"NVDA","sentiment":"bearish","reason":"U.S. ban on AI chip sales to China led to a $5.5B charge and 10% stock drop [AY45uQelENc]"}],"global_events":["U.S. announced a 10% universal tariff on imports, with additional country-specific tariffs, including a 34% tariff on China [ZbreGo0j4ko]","China imposes 125% tariff on U.S. goods in retaliation [o4J3naLM-1o]","China's reduction in US Treasury holdings pressuring US interest rates [ZEcHe7fI1Zk]","PBOC cutting rates amid deflation [6u-fROiakpI]","Fed refusing to intervene in market declines, reversing bullish sentiment [AY45uQelENc]"]},{"theme":["Federal Reserve Policy & Stagflation Risks"],"ideas":[{"idea":"The Federal Reserve has paused rate cuts, citing inflationary concerns from tariffs and supply chain disruptions. Chair Powell warned that tariffs could lead to higher inflation and slower growth, creating a policy dilemma. The Fed's reactive stance and lack of clear guidance have increased uncertainty, with criticism over delayed responses and hesitancy to cut rates despite weak GDP and housing data [o4J3naLM-1o][q8mL1An1pF0][AY45uQelENc]."},{"idea":"Stagflation risks are rising, with stagnant growth, high inflation, and rising unemployment. Reduced trade with China and rising input costs are exacerbating inflationary pressures, while consumer demand is declining. The risk of a self-fulfilling recession is heightened as pessimism spreads among consumers and businesses [AY45uQelENc][wqJiacXf_2c][6u-fROiakpI][o4J3naLM-1o]."},{"idea":"Political pressure on the Fed is mounting, with speculation that Trump may attempt to remove Powell or intentionally create economic instability to force rate cuts and reduce U.S. debt servicing costs. The Fed's independence is being questioned, adding to market uncertainty [o4J3naLM-1o][1E9T6Ze0GL4]."}],"market_sentiment":"bearish","stock_mentions":[],"global_events":["Federal Reserve pauses rate cuts due to inflationary concerns from tariffs [o4J3naLM-1o]","Fed's reactive policy stance and stagflation risks [q8mL1An1pF0]","Political pressure on Jerome Powell from former President Trump [o4J3naLM-1o][1E9T6Ze0GL4]"]},{"theme":["AI Disruption & Regulatory Shifts"],"ideas":[{"idea":"AI is disrupting search, with Google facing competition from AI-driven alternatives and potential loss of its $20B+ annual default search agreement with Apple. Meta is enhancing AI research and open-sourcing large language models, while Apple may integrate third-party AI search into Safari. Ongoing antitrust cases against Google and Apple add to structural risks [SezBpiM2PSI][LruSSVpLvvk][5aQaLMIpqTo][q8mL1An1pF0]."},{"idea":"Nvidia's AI chip demand remains strong, but U.S. export controls on chips to China have led to a $5.5B charge and a 10% stock drop. Regulatory discussions and potential shifts under a Trump administration could ease restrictions, reopening the China market for U.S. tech firms [SezBpiM2PSI][AY45uQelENc]."},{"idea":"Google and Apple face ongoing antitrust litigation, with potential remedies including increased ad pricing transparency and third-party payment systems. These regulatory shifts could impact revenue streams and business models for major tech companies [SezBpiM2PSI][LruSSVpLvvk]."}],"market_sentiment":"mixed","stock_mentions":[{"ticker":"GOOGL","sentiment":"mixed","reason":"Strong cash flow and dominant market share but facing AI disruption and antitrust risks [SezBpiM2PSI][5aQaLMIpqTo][q8mL1An1pF0]"},{"ticker":"NVDA","sentiment":"mixed","reason":"Strong AI chip demand but exposed to regulatory and export risks [SezBpiM2PSI][AY45uQelENc]"},{"ticker":"META","sentiment":"bullish","reason":"Enhancing AI research and product development, positioning as a leading LLM platform [LruSSVpLvvk][q8mL1An1pF0]"},{"ticker":"AAPL","sentiment":"bearish","reason":"App Store litigation may impact its 30% commission revenue and no major in-house AI launch [SezBpiM2PSI][LruSSVpLvvk]"}],"global_events":["Potential eased AI chip export restrictions to China under a Trump administration [SezBpiM2PSI]","Ongoing antitrust cases against Google and Apple impacting their AI strategies [SezBpiM2PSI][LruSSVpLvvk]","Apple may integrate third-party AI search into Safari [SezBpiM2PSI][q8mL1An1pF0]"]}],"frequently_mentioned_stocks":[{"ticker":"GOOGL","mentions":5,"arguments":[{"youtuber":"@TheInvestorChannel","argument":["Facing AI-driven search competition and antitrust risks. [SezBpiM2PSI]","Ongoing DOJ antitrust case may require ad business divestitures. [LruSSVpLvvk]"]},{"youtuber":"@JosephCarlsonShow","argument":["Google’s financial performance shows strong revenue growth (15% YoY) and expanding margins, but faces structural risks from AI disruption [XrQ1XlKVnBE]","Google search usage is declining in Safari, attributed to AI adoption. Alphabet stock declined ~8% following Apple testimony but partially recovered [5aQaLMIpqTo]"]},{"youtuber":"@FinancialEducation","argument":["Apple's AI-powered Safari search could impact $20B in annual revenue, but Google's dominant market share (90%+ in search), YouTube, Android, and Gemini AI mitigate risks [q8mL1An1pF0]"]}]},{"ticker":"NVDA","mentions":3,"arguments":[{"youtuber":"@TheInvestorChannel","argument":["Strong AI chip demand and potential eased export restrictions to China. [SezBpiM2PSI]","Regulatory discussions on chip exports to China. [SezBpiM2PSI]"]},{"youtuber":"@WhiteBoardFinance","argument":["U.S. ban on AI chip sales to China led to a $5.5B charge and 10% stock drop [AY45uQelENc]"]}]},{"ticker":"META","mentions":3,"arguments":[{"youtuber":"@TheInvestorChannel","argument":["Enhancing AI research and product development. [SezBpiM2PSI]","Open-sourcing of large language models (LLMs) and standalone AI app launch. [LruSSVpLvvk]"]},{"youtuber":"@FinancialEducation","argument":["Earnings potential and valuation; forward P/E 22 could expand to 30 with earnings growth [q8mL1An1pF0]"]}]}],"top_recommended_stocks":[{"ticker":"GOOGL","action":"buy","confidence":"high","reason":"Dominant market positions in search, YouTube, and AI (Gemini), with a forward P/E of ~21 supporting valuation [q8mL1An1pF0][XrQ1XlKVnBE]"},{"ticker":"NVDA","action":"buy","confidence":"high","reason":"Strong AI chip demand and potential eased export restrictions to China, endorsed by multiple analysts [SezBpiM2PSI][AY45uQelENc]"},{"ticker":"META","action":"buy","confidence":"medium","reason":"Enhancing AI research and product development, positioning as a leading LLM platform. Forward P/E of 22 could expand to 30 with earnings growth [LruSSVpLvvk][q8mL1An1pF0]"}],"most_anticipated_events":[{"event":"Federal Reserve Rate Decisions","impact":"Market volatility due to stagflation risks, reactive policy stance, and potential for delayed or insufficient rate cuts","context":"Powell's lack of clear guidance and criticism of delayed rate cuts despite weak economic data [q8mL1An1pF0][o4J3naLM-1o][AY45uQelENc]"},{"event":"U.S.-China Trade War Escalation","impact":"Potential stagflation, supply chain disruptions, S&P 500 declines, and global GDP drag","context":"Tariffs may increase U.S. production costs while China leverages deflation for export competitiveness [6u-fROiakpI][wqJiacXf_2c][ZbreGo0j4ko]"},{"event":"AI Disruption in Search & Tech","impact":"Continued pressure on Google’s core search revenue and potential shifts in tech sector leadership","context":"Google search usage is declining in Safari, attributed to AI adoption. Apple may integrate third-party AI search, impacting Google's $20B+ annual default search agreement [5aQaLMIpqTo][SezBpiM2PSI][q8mL1An1pF0]"},{"event":"Spot XRP ETF Approval","impact":"Potential institutional inflows into XRP and broader crypto market","context":"Anticipated by October 2025, pending SEC approval [DW7byP5VNds]"}]}
function ExtractView({ onVideoClick }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollTop = localStorage.getItem('extractScrollTop');
    if (containerRef.current && scrollTop) {
      containerRef.current.scrollTop = parseInt(scrollTop, 10);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      localStorage.setItem('extractScrollTop', container.scrollTop);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '4px',
          minWidth: 0,
          maxWidth: '100%',
        }}
      >
        <h5 className="mb-3">📅 Daily Extract</h5>
        <MarketInsights data={dailyExtract} onVideoClick={onVideoClick} />

        <h5 className="mt-5 mb-3">🗓 Weekly Extract</h5>
        <MarketInsights data={weeklyExtract} onVideoClick={onVideoClick} />
      </div>
    </div>
  );
}

export default ExtractView;