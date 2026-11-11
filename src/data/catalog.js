import imgInv25 from '../assets/images/inverter-25kw.jpg';
import imgInv8 from '../assets/images/inverter-8kw.jpg';
import imgInv20 from '../assets/images/inverter-20kw.jpg';
import imgHyb3000 from '../assets/images/hybrid-3000.jpg';
import imgPanelBi from '../assets/images/panel-bifacial.jpg';
import imgPanelMono from '../assets/images/panel-mono.jpg';
import imgBattery from '../assets/images/battery-165ah.jpg';

// Names you can type in the "image" column of the price sheet.
export const imageMap = {
  'inverter-25kw': imgInv25,
  'inverter-8kw': imgInv8,
  'inverter-20kw': imgInv20,
  'hybrid-3000': imgHyb3000,
  'panel-bifacial': imgPanelBi,
  'panel-mono': imgPanelMono,
  'battery-165ah': imgBattery,
};

// Used when the price sheet is not set up or cannot be reached.
export const productsData = [
  {
    category: 'Solar Inverters (Authorised Dealer)',
    items: [
      { id: 1, name: 'UTL Gamma+ rMPPT Solar PCU', brand: 'UTL Solar', desc: 'Best for home backup', price: '₹ 14,500 approx', image: imgHyb3000 },
      { id: 2, name: 'Fujiyama 10kW On-Grid Inverter', brand: 'Fujiyama', desc: 'High efficiency for Net Metering', price: 'Contact for Price', image: imgInv8 },
      { id: 3, name: 'Luminous NXi Grid Tie (20kW)', brand: 'Luminous', desc: '3-Phase Commercial Inverter', price: 'Best Market Rate', image: imgInv20 },
    ],
  },
  {
    category: 'Solar Panels (Wholesale Rates)',
    items: [
      { id: 4, name: 'Tata Power 550W Bifacial', brand: 'Tata Power', desc: 'Generates power from both sides', price: '₹ 16/Watt', image: imgPanelBi },
      { id: 5, name: 'Waaree 540W Mono PERC', brand: 'Waaree', desc: 'High efficiency half-cut cells', price: '₹ 15/Watt', image: imgPanelMono },
    ],
  },
  {
    category: 'Solar Batteries & Accessories',
    items: [
      { id: 6, name: 'UTL UST 1650 (165Ah) C10', brand: 'UTL Solar', desc: '5-Year Replacement Warranty', price: '₹ 12,500', image: imgBattery },
      { id: 7, name: 'ACDB & DCDB Protection Box', brand: 'Kaki Custom', desc: 'With SPD and MCB Protection', price: '₹ 3,500', image: imgInv25 },
    ],
  },
];
