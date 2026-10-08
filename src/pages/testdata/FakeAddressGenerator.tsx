import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { 
  MapPin, 
  Copy, 
  Check, 
  RefreshCw, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Globe, 
  Calendar, 
  CreditCard,
  Hash,
  Compass,
  Monitor
} from 'lucide-react';

interface AddressProfile {
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  company: string;
  department: string;
  job: string;
  birthday: string;
  ssn: string;
  coordinates: string;
  mockCard: string;
  ipAddress: string;
  browser: string;
}

const REGIONS_DATA: Record<string, { states: string[]; cities: Record<string, string[]>; dialCode: string }> = {
  'United States': {
    dialCode: '+1',
    states: ['California', 'New York', 'Texas', 'Florida', 'Washington', 'Illinois', 'Ohio', 'Georgia'],
    cities: {
      'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
      'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse'],
      'Texas': ['Houston', 'Austin', 'Dallas', 'San Antonio', 'Fort Worth'],
      'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
      'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
      'Illinois': ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford'],
      'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
      'Georgia': ['Atlanta', 'Savannah', 'Augusta', 'Columbus', 'Macon']
    }
  },
  'United Kingdom': {
    dialCode: '+44',
    states: ['Greater London', 'Greater Manchester', 'West Midlands', 'Scotland', 'West Yorkshire'],
    cities: {
      'Greater London': ['London', 'Westminster', 'Camden', 'Greenwich'],
      'Greater Manchester': ['Manchester', 'Salford', 'Bolton', 'Stockport'],
      'West Midlands': ['Birmingham', 'Coventry', 'Wolverhampton', 'Solihull'],
      'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'],
      'West Yorkshire': ['Leeds', 'Bradford', 'Wakefield', 'Huddersfield']
    }
  },
  'Canada': {
    dialCode: '+1',
    states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
    cities: {
      'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'],
      'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
      'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'],
      'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge']
    }
  },
  'Australia': {
    dialCode: '+61',
    states: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
    cities: {
      'New South Wales': ['Sydney', 'Newcastle', 'Central Coast', 'Wollongong'],
      'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
      'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville'],
      'Western Australia': ['Perth', 'Mandurah', 'Bunbury', 'Geraldton']
    }
  },
  'Germany': {
    dialCode: '+49',
    states: ['Bavaria', 'Berlin', 'North Rhine-Westphalia', 'Hesse', 'Hamburg'],
    cities: {
      'Bavaria': ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg'],
      'Berlin': ['Berlin', 'Mitte', 'Pankow', 'Spandau'],
      'North Rhine-Westphalia': ['Cologne', 'Dusseldorf', 'Dortmund', 'Essen'],
      'Hesse': ['Frankfurt', 'Wiesbaden', 'Kassel', 'Darmstadt'],
      'Hamburg': ['Hamburg', 'Altona', 'Eimsbuttel']
    }
  },
  'France': {
    dialCode: '+33',
    states: ['Ile-de-France', 'Auvergne-Rhone-Alpes', 'Provence-Alpes-Cote d\'Azur', 'Occitanie'],
    cities: {
      'Ile-de-France': ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil'],
      'Auvergne-Rhone-Alpes': ['Lyon', 'Saint-Etienne', 'Grenoble', 'Villeurbanne'],
      'Provence-Alpes-Cote d\'Azur': ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence'],
      'Occitanie': ['Toulouse', 'Montpellier', 'Nimes', 'Perpignan']
    }
  },
  'Japan': {
    dialCode: '+81',
    states: ['Tokyo', 'Osaka', 'Kanagawa', 'Aichi', 'Hokkaido', 'Fukuoka'],
    cities: {
      'Tokyo': ['Shinjuku', 'Shibuya', 'Chiyoda', 'Minato', 'Setagaya'],
      'Osaka': ['Osaka City', 'Sakai', 'Higashiosaka', 'Toyonaka'],
      'Kanagawa': ['Yokohama', 'Kawasaki', 'Sagamihara', 'Fujisawa'],
      'Aichi': ['Nagoya', 'Toyota', 'Okazaki', 'Ichinomiya'],
      'Hokkaido': ['Sapporo', 'Asahikawa', 'Hakodate'],
      'Fukuoka': ['Fukuoka City', 'Kitakyushu', 'Kurume']
    }
  },
  'Italy': {
    dialCode: '+39',
    states: ['Lombardy', 'Lazio', 'Campania', 'Veneto', 'Tuscany'],
    cities: {
      'Lombardy': ['Milan', 'Brescia', 'Monza', 'Bergamo'],
      'Lazio': ['Rome', 'Latina', 'Guidonia', 'Fiumicino'],
      'Campania': ['Naples', 'Salerno', 'Giugliano', 'Torre del Greco'],
      'Veneto': ['Venice', 'Verona', 'Padua', 'Vicenza'],
      'Tuscany': ['Florence', 'Prato', 'Livorno', 'Pisa']
    }
  },
  'Spain': {
    dialCode: '+34',
    states: ['Community of Madrid', 'Catalonia', 'Andalusia', 'Valencian Community'],
    cities: {
      'Community of Madrid': ['Madrid', 'Mostoles', 'Alcala de Henares', 'Fuenlabrada'],
      'Catalonia': ['Barcelona', 'L\'Hospitalet', 'Badalona', 'Terrassa'],
      'Andalusia': ['Seville', 'Malaga', 'Cordoba', 'Granada'],
      'Valencian Community': ['Valencia', 'Alicante', 'Elche', 'Castellon']
    }
  },
  'Singapore': {
    dialCode: '+65',
    states: ['Central Region', 'East Region', 'West Region', 'North Region'],
    cities: {
      'Central Region': ['Downtown Core', 'Orchard', 'Marina Bay', 'Newton'],
      'East Region': ['Tampines', 'Bedok', 'Pasir Ris', 'Changi'],
      'West Region': ['Jurong East', 'Clementi', 'Bukit Batok'],
      'North Region': ['Woodlands', 'Yishun', 'Sembawang']
    }
  },
  'South Korea': {
    dialCode: '+82',
    states: ['Seoul Capital Area', 'Busan', 'Incheon', 'Daegu', 'Gyeonggi'],
    cities: {
      'Seoul Capital Area': ['Gangnam', 'Mapo', 'Songpa', 'Jung-gu', 'Yongsan'],
      'Busan': ['Haeundae', 'Busanjin', 'Sasang', 'Nam-gu'],
      'Incheon': ['Songdo', 'Bupyeong', 'Namdong', 'Yeonsu'],
      'Daegu': ['Suseong', 'Dalseo', 'Jung-gu'],
      'Gyeonggi': ['Suwon', 'Seongnam', 'Goyang', 'Yongin']
    }
  },
  'Netherlands': {
    dialCode: '+31',
    states: ['North Holland', 'South Holland', 'Utrecht', 'North Brabant'],
    cities: {
      'North Holland': ['Amsterdam', 'Haarlem', 'Zaanstad', 'Hilversum'],
      'South Holland': ['Rotterdam', 'The Hague', 'Leiden', 'Delft'],
      'Utrecht': ['Utrecht', 'Amersfoort', 'Veenendaal'],
      'North Brabant': ['Eindhoven', 'Tilburg', 'Breda', 'Den Bosch']
    }
  }
};

const FIRST_NAMES_MALE = ['James', 'Robert', 'Michael', 'David', 'William', 'Alexander', 'Ethan', 'Oliver', 'Lucas', 'Daniel', 'Liam', 'Noah', 'Leo'];
const FIRST_NAMES_FEMALE = ['Emma', 'Olivia', 'Sophia', 'Ava', 'Isabella', 'Mia', 'Harper', 'Evelyn', 'Charlotte', 'Amelia', 'Chloe', 'Elena', 'Maya'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore'];
const STREET_NAMES = ['Oak Avenue', 'Maple Street', 'Pine Road', 'Cedar Boulevard', 'Elm Drive', 'Sunset Highway', 'Willow Lane', 'River Street', 'Grand View Way', 'Highland Park'];
const COMPANIES = ['Apex Innovations', 'Vanguard Systems', 'Horizon Tech', 'Pinnacle Global', 'Sterling Partners', 'Nexus Media', 'Summit Logistics', 'Quantum Dynamics'];
const DEPARTMENTS = ['Engineering', 'Product & Design', 'Marketing & Growth', 'Finance & Analytics', 'Human Resources', 'Customer Operations', 'Information Security'];
const JOBS = ['Software Engineer', 'Product Manager', 'Financial Analyst', 'Marketing Director', 'Systems Architect', 'Operations Lead', 'Creative Designer', 'DevOps Specialist'];

export const FakeAddressGenerator: React.FC = () => {
  const tool = getToolById('fake-address-generator')!;
  
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [selectedState, setSelectedState] = useState('Any State');
  const [selectedCity, setSelectedCity] = useState('Any City');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Male' | 'Female'>('All');

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [profile, setProfile] = useState<AddressProfile>(() => generateRandomProfile('United States', 'Any State', 'Any City', 'All'));

  function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateRandomProfile(country: string, stateChoice: string, cityChoice: string, genderChoice: 'All' | 'Male' | 'Female'): AddressProfile {
    const countryData = REGIONS_DATA[country] || REGIONS_DATA['United States'];
    
    const state = stateChoice === 'Any State' ? getRandomItem(countryData.states) : stateChoice;
    const availableCities = countryData.cities[state] || Object.values(countryData.cities).flat();
    const city = cityChoice === 'Any City' || !availableCities.includes(cityChoice) ? getRandomItem(availableCities) : cityChoice;
    
    const gender: 'Male' | 'Female' = genderChoice === 'All' 
      ? (Math.random() > 0.5 ? 'Male' : 'Female') 
      : genderChoice;

    const firstName = gender === 'Male' ? getRandomItem(FIRST_NAMES_MALE) : getRandomItem(FIRST_NAMES_FEMALE);
    const lastName = getRandomItem(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;
    
    const streetNumber = getRandomNumber(100, 9999);
    const street = `${streetNumber} ${getRandomItem(STREET_NAMES)}`;
    const zipCode = getRandomNumber(10000, 99999).toString();
    
    const cleanFirstName = firstName.toLowerCase();
    const cleanLastName = lastName.toLowerCase();
    const emailDomain = getRandomItem(['gmail.com', 'outlook.com', 'yahoo.com', 'proton.me', 'company.org']);
    const email = `${cleanFirstName}.${cleanLastName}${getRandomNumber(10, 99)}@${emailDomain}`;
    
    const phone = `${countryData.dialCode} (${getRandomNumber(200, 999)}) ${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`;
    const company = getRandomItem(COMPANIES);
    const department = getRandomItem(DEPARTMENTS);
    const job = getRandomItem(JOBS);
    
    const birthYear = getRandomNumber(1975, 2003);
    const currentYear = 2026;
    const age = currentYear - birthYear;
    const birthMonth = getRandomNumber(1, 12).toString().padStart(2, '0');
    const birthDay = getRandomNumber(1, 28).toString().padStart(2, '0');
    const birthday = `${birthYear}-${birthMonth}-${birthDay}`;

    const ssn = `${getRandomNumber(100, 999)}-${getRandomNumber(10, 99)}-${getRandomNumber(1000, 9999)}`;
    const lat = (getRandomNumber(1000, 8000) / 100).toFixed(4);
    const lng = (getRandomNumber(-17000, 17000) / 100).toFixed(4);
    const coordinates = `${lat}° N, ${lng}° W`;

    const mockCard = `4532 •••• •••• ${getRandomNumber(1000, 9999)} (Exp: ${getRandomNumber(1, 12)}/${getRandomNumber(27, 31)})`;
    const ipAddress = `${getRandomNumber(11, 220)}.${getRandomNumber(1, 254)}.${getRandomNumber(1, 254)}.${getRandomNumber(1, 254)}`;
    const browser = getRandomItem(['Chrome 128 / Windows 11', 'Safari 18 / macOS Sonoma', 'Firefox 130 / Linux x64', 'Edge 128 / Windows 11']);

    return {
      name: fullName,
      gender,
      age,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
      email,
      company,
      department,
      job,
      birthday,
      ssn,
      coordinates,
      mockCard,
      ipAddress,
      browser
    };
  }

  const handleGenerate = () => {
    const newProfile = generateRandomProfile(selectedCountry, selectedState, selectedCity, selectedGender);
    setProfile(newProfile);
  };

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(identifier);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyFullAddress = () => {
    const fullText = `Name: ${profile.name} (${profile.gender}, Age ${profile.age})\nStreet: ${profile.street}\nCity: ${profile.city}\nState: ${profile.state}\nPostal/Zip: ${profile.zipCode}\nCountry: ${profile.country}\nPhone: ${profile.phone}\nEmail: ${profile.email}\nCompany: ${profile.company} (${profile.department})\nJob: ${profile.job}\nBirthday: ${profile.birthday}\nSimulated ID/SSN: ${profile.ssn}\nCoordinates: ${profile.coordinates}\nIP Address: ${profile.ipAddress}`;
    copyToClipboard(fullText, 'full-profile');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  };

  const currentStates = REGIONS_DATA[selectedCountry]?.states || [];
  const currentCities = selectedState !== 'Any State' && REGIONS_DATA[selectedCountry]?.cities[selectedState]
    ? REGIONS_DATA[selectedCountry].cities[selectedState]
    : Object.values(REGIONS_DATA[selectedCountry]?.cities || {}).flat();

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="testdata" />
      
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        {/* Filters & Region Selector Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Select Region & City Focus</span>
            </h3>
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              14+ Global Regions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Country */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Country / Region</label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedState('Any State');
                  setSelectedCity('Any City');
                }}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
              >
                {Object.keys(REGIONS_DATA).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* State / Province */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">State / Province</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('Any City');
                }}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="Any State">Any State (Random)</option>
                {currentStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="Any City">Any City (Random)</option>
                {Array.from(new Set(currentCities)).map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value as any)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="All">All / Random</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Fake Address Profile</span>
            </button>
          </div>
        </div>

        {/* ================= SINGLE FOCUSED PROFILE CARD ================= */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
          
          {/* Card Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center text-xl shadow-lg shadow-blue-500/20 shrink-0">
                {getInitials(profile.name)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {profile.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(profile.name, 'name')}
                    className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Copy Name"
                  >
                    {copiedField === 'name' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    {profile.job}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    at <strong>{profile.company}</strong> • {profile.department}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 self-start sm:self-center transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next Random</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Street Address */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Street Address</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{profile.street}</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(profile.street, 'street')}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedField === 'street' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'street' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* City, State & Zip */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">City, State, Postal Code</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{profile.city}, {profile.state} {profile.zipCode}</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(`${profile.city}, ${profile.state} ${profile.zipCode}`, 'citystate')}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedField === 'citystate' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'citystate' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Country */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Country & Region</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{profile.country}</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(profile.country, 'country')}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedField === 'country' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'country' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Phone Number */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white truncate mt-0.5">{profile.phone}</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(profile.phone, 'phone')}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Email Address */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{profile.email}</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(profile.email, 'email')}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Date of Birth & Age */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Birth Date & Age</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{profile.birthday} ({profile.age} yrs, {profile.gender})</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(`${profile.birthday} (Age ${profile.age})`, 'dob')}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedField === 'dob' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'dob' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Simulated National ID / SSN */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Simulated National ID / SSN</span>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white truncate mt-0.5">{profile.ssn}</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(profile.ssn, 'ssn')}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedField === 'ssn' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'ssn' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Coordinates & IP */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Coordinates & Simulated IP</span>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white truncate mt-0.5">{profile.coordinates} • {profile.ipAddress}</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(`${profile.coordinates} | IP: ${profile.ipAddress}`, 'geo')}
                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedField === 'geo' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'geo' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

          </div>

          {/* Big Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={copyFullAddress}
              className="w-full sm:flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              {copiedField === 'full-profile' ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5" />}
              <span>{copiedField === 'full-profile' ? 'Full Profile Copied!' : 'Copy Full Address & Profile'}</span>
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              className="w-full sm:w-auto py-3.5 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Another</span>
            </button>
          </div>

        </div>

        <ResultPanel
          onCopy={copyFullAddress}
          copied={copiedField === 'full-profile'}
          infoItems={[
            'Single profile card focus for fast 1-click copying',
            'Filter by 14+ Countries, States, and Cities',
            'Includes Street, Postal, Phone, Email, and Coordinates',
            '100% Free & Unlimited'
          ]}
        />

      </div>
    </div>
  );
};
