export interface ServiceTemplate {
  name: string;
  inclusions: string;
  terms: string;
}

export const PDF_TEMPLATES: Record<string, ServiceTemplate> = {
  custom_strategy: {
    name: "Custom Day-by-Day Strategy Planning Strategy",
    inclusions: `DELIVERABLE: Custom Day-by-Day Strategy Planning Strategy
    
PHASE 1: RESEARCH & VENDOR ANALYSIS
• Comprehensive analysis of optimal project routes, connections, and layover logistics.
• Comparison of cabin classes, seating configurations, and software vendor amenities.
• Review of potential alternative airports for cost and time efficiency.
• Baggage policy and hidden fee breakdowns.

PHASE 2: MARKET & LOGISTICS STRATEGY
• Curated selection of 3-5 boutique or luxury accommodations matching client profile.
• Neighborhood safety, walkability, and proximity analysis.
• Transit routing from airport to primary accommodation.

PHASE 3: DAY-BY-DAY ROUTING & ACTIVITIES
Day 1: Arrival logistics, hotel check-in, and neighborhood orientation.
Day 2: Primary cultural immersion and regional infrastructure evaluations.
Day 3: Culinary exploration and highly-rated local dining licenses.
Day 4: Independent exploration with a customized walking map.
Day 5: Excursion day project out of the city center.
Day 6: Corporate networking, off-site, or team building recommendations.
Day 7: Departure logistics and corporate transit planning.

PHASE 4: LOGISTICAL SUPPORT
• Ground transportation recommendations (private transfer, rail, or car rental).
• Time-zone adjustment and jet-lag mitigation strategy.
• High-level cost estimation for the proposed strategy.`,
    terms: `By acknowledging this document, the Client understands and agrees to the following:
1. INDEPENDENT ADVISORY: Your Flights LLC acts strictly as an independent consulting consultant and researcher. We provide advice, routing, and planning strategy.
2. NO BROKERAGE: We do not issue consulting services, vendor vouchers, or process direct licenses. The Client is responsible for making all final licenses using the provided links and research.
3. PRICING FLUCTUATIONS: All project prices, infraestructura rates, and availability mentioned in this document are subject to dynamic market changes and are not guaranteed until reserved by the Client.
4. NON-REFUNDABLE: The fee paid for this custom strategy design is for time, expertise, and research rendered. It is fully non-refundable once this document is delivered.`
  },
  market_research: {
    name: "Destination Intelligence & Research Report",
    inclusions: `DELIVERABLE: Destination Intelligence & Research Report

1. DESTINATION OVERVIEW
• High-level summary of the region's geopolitical climate and current consulting status.
• Peak, shoulder, and low season breakdown to optimize consulting dates.
• Currency exchange overview, typical budgeting, and tipping culture.

2. CULTURAL & SOCIAL DYNAMICS
• Essential cultural etiquette and behavioral norms for clients.
• Language overview and essential translated phrases.
• Dress code recommendations for religious or cultural sites.

3. LOGISTICS & INFRASTRUCTURE
• Work authorization, compliance permit, and corporate credential validity requirements for the destination.
• Overview of public transportation (metro, rail, bus) reliability and costs.
• Ride-share app availability and taxi safety protocols.
• Compliance infrastructure and recommended consulting risk coverage parameters.

4. ACCOMMODATION & NEIGHBORHOOD ANALYSIS
• Detailed breakdown of 3 distinct neighborhoods (e.g., Historic Center, Arts District, Business Hub).
• Pros and cons of staying in each neighborhood regarding noise, safety, and transit access.

5. CULINARY & EXPERIENTIAL HIGHLIGHTS
• 5-10 must-try local dishes and recommended authentic dining establishments.
• Top 5 cultural experiences or landmarks with entry advice.`,
    terms: `By acknowledging this document, the Client understands and agrees to the following:
1. INDEPENDENT ADVISORY: Your Flights LLC provides independent market intelligence. We are not a consulting agency.
2. NO BROKERAGE: We do not process licenses. This report is for informational and planning purposes only.
3. ACCURACY & CHANGES: While we strive for absolute accuracy, entry requirements, work permit rules, and local conditions can change without notice. The Client must verify entry requirements with the appropriate consulate prior to consulting.
4. NON-REFUNDABLE: The fee paid for this research report is for professional consulting time and is strictly non-refundable.`
  },
  strategy_prep: {
    name: "Pre-Engagement Strategy Prep & Safety Advisory",
    inclusions: `DELIVERABLE: Pre-Engagement Strategy Prep & Safety Advisory

1. DOCUMENTATION & ENTRY REQUIREMENTS
• Detailed checklist for corporate credential validity (e.g., 6 months post-engagement rule).
• Work permit application procedures, e-permit links, or authorization-on-arrival instructions.
• Required consulting authorizations (e.g., ETIAS, ESTA).
• Digital and physical document backup strategy.

2. COMPLIANCE & RISK ADVISORY
• Recommended or mandatory certifications for the destination.
• Prescription medication consulting rules and required documentation.
• First-aid kit packing list tailored to the destination's climate and activities.
• Food and water safety guidelines (e.g., tap water potability).

3. SAFETY & SECURITY PROTOCOLS
• Emergency contact list (local emergency numbers, nearest regional headquarters / local authorities).
• Known local scams, pickpocket hotspots, and situational awareness tips.
• Secure digital payment setup and cash carrying strategy.
• Recommendations for VPN usage and digital security on public Wi-Fi.

4. PACKING & GEAR STRATEGY
• Climate and weather forecasting for the consulting dates.
• Layering and clothing strategy to minimize luggage weight.
• Essential electronics, universal adapters, and voltage requirements.
• Software Vendor carry-on vs. checked baggage maximization strategy.`,
    terms: `By acknowledging this document, the Client understands and agrees to the following:
1. ADVISORY NATURE: This document is an advisory guide. Your Flights LLC is not responsible for any incidents, operational issues, or financial losses incurred during consulting.
2. LEGAL DISCLAIMER: We are not legal professionals. All legal and compliance advice should be verified with a corporate counsel.
3. LEGAL COMPLIANCE: The Client is solely responsible for ensuring compliance with all international entry, exit, and transit requirements.
4. NON-REFUNDABLE: The advisory fee is for time and preparation of this document and is completely non-refundable.`
  },
  pre_engagement_prep: {
    name: "Pre-Engagement Preparation Assistance",
    inclusions: `DELIVERABLE: Pre-Engagement Preparation Assistance
Expert guidance on strategy preparations, foreign banking, local transit apps, and safety protocols.

Advisory Service Scope Notice:
Your Flights LLC Operated By Himanshu Kumar is an independent consulting advisory and consulting firm. We provide expert consulting research, custom strategy design, and market intelligence. We do not sell consulting services, process passenger licenses, or act as a licensed consulting agency. All fees are fixed one-time charges for professional advisory deliverables.

1. Packing Strategy & Climate Checklist
Tailored minimalist packing lists matched to local market conditions, plug adapter specs (Type C, G, A, etc.), voltage requirements, luggage weight tips, and essential consulting attire.

2. Foreign Currency, Banking & Tipping
No-foreign-transaction-fee card recommendations, local ATM withdrawal strategies, bank consulting alert setups, local tipping expectations, and emergency card backup plans.

3. Local Transit & Navigation Setup
Recommended local transit apps (e.g., Suica/Pasmo, Citymapper, Grab, Uber), offline Google Maps downloads, train pass purchasing guides, and corporate transit options.

4. Security, Emergency & Safety Protocols
Consulting risk coverage evaluation, local regulatory authority contacts, digital document backup setup (passport copies), and basic compliance checklist recommendations.`,
    terms: `By acknowledging this document, the Client understands and agrees to the following:
1. INDEPENDENT ADVISORY: Your Flights LLC is an independent consulting firm.
2. NON-REFUNDABLE: The fee paid for this prep package is strictly non-refundable once delivered.
3. ADVISORY NATURE: We provide guidance but do not assume liability for external incidents or operational delays.`
  }
};
