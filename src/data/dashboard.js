// Everything on the Dashboard page comes from this file.
// A section with no data is hidden automatically, so fill in only what you have.

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Megawatts (MW) per month, January onwards. Add one number at the end of each month.
export const panelsSold = [0.27, 0.44, 0.64, 0.83, 1.21, 0.76, 1.13, 1.64, 1.01, 1.20, 0.22];
export const panelsPurchased = [0.33, 0.45, 0.60, 1.34, 0.77, 1.00, 1.33, 1.44, 1.06, 1.14, 0.20];

// true while the last number is only part of a month; set to false when the month is complete
export const lastMonthIsPartial = true;

// Installed systems, for example: { systems: 120, capacityKw: 640 }. Leave null to hide.
export const installed = null;

// Enquiries per month, for example: [{ label: 'Jan', value: 14 }, { label: 'Feb', value: 21 }]
export const enquiriesByMonth = [];

// Happy customer reviews, for example:
// { name: 'Rahul P.', location: 'Nagpur', text: 'Installed in two days, bill dropped by 80%.' }
export const reviews = [];

// Your IndiaMART listing, for example 'https://www.indiamart.com/your-company/'. Leave '' to hide.
export const indiaMartUrl = '';
