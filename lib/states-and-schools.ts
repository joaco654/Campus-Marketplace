// Comprehensive US States and Schools Data
export interface State {
  code: string
  name: string
  flag: string // State symbol/emoji
  mascot: string // State mascot/animal/plant/bird
  schools: School[]
}

export interface School {
  id: string
  name: string
  abbreviation: string
  logo: string
}

// Complete list of all 50 US states with major universities
export const STATES_AND_SCHOOLS: State[] = [
  // Alabama
  {
    code: 'AL',
    name: 'Alabama',
    flag: '🏴',
    mascot: '🐘', // Alabama State Elephant
    schools: [
      { id: 'ua', name: 'University of Alabama', abbreviation: 'UA', logo: '🐘' },
      { id: 'auburn', name: 'Auburn University', abbreviation: 'AUB', logo: '🐅' },
      { id: 'uab', name: 'University of Alabama at Birmingham', abbreviation: 'UAB', logo: '🟢' },
      { id: 'troy', name: 'Troy University', abbreviation: 'TROY', logo: '🔴' },
      { id: 'south-alabama', name: 'University of South Alabama', abbreviation: 'USA', logo: '🔵' },
      { id: 'alabama-state', name: 'Alabama State University', abbreviation: 'ASU', logo: '🦁' },
      { id: 'samford', name: 'Samford University', abbreviation: 'SAM', logo: '🦅' },
      { id: 'jacksonville-state', name: 'Jacksonville State University', abbreviation: 'JSU', logo: '🐓' },
      { id: 'north-alabama', name: 'University of North Alabama', abbreviation: 'UNA', logo: '🦁' },
      { id: 'alabama-am', name: 'Alabama A&M University', abbreviation: 'AAMU', logo: '🐕' },
      { id: 'alabama-tuskegee', name: 'Tuskegee University', abbreviation: 'TU', logo: '🐅' },
      { id: 'montevallo', name: 'University of Montevallo', abbreviation: 'UM', logo: '🦅' },
      { id: 'west-alabama', name: 'University of West Alabama', abbreviation: 'UWA', logo: '🐅' },
      { id: 'athens-state', name: 'Athens State University', abbreviation: 'ASU', logo: '🦉' },
      { id: 'auburn-montgomery', name: 'Auburn University at Montgomery', abbreviation: 'AUM', logo: '🐅' },
      { id: 'birmingham-southern', name: 'Birmingham-Southern College', abbreviation: 'BSC', logo: '🦁' },
      { id: 'huntingdon', name: 'Huntingdon College', abbreviation: 'HC', logo: '🦅' },
      { id: 'spring-hill', name: 'Spring Hill College', abbreviation: 'SHC', logo: '🦅' },
      { id: 'faulkner', name: 'Faulkner University', abbreviation: 'FU', logo: '🦅' },
      { id: 'mobile', name: 'University of Mobile', abbreviation: 'UM', logo: '🦅' },
    ],
  },
  // Alaska
  {
    code: 'AK',
    name: 'Alaska',
    flag: '🏴',
    mascot: '🐻', // Alaskan Brown Bear
    schools: [
      { id: 'alaska-fairbanks', name: 'University of Alaska Fairbanks', abbreviation: 'UAF', logo: '🐻' },
      { id: 'alaska-anchorage', name: 'University of Alaska Anchorage', abbreviation: 'UAA', logo: '🐻' },
      { id: 'alaska-southeast', name: 'University of Alaska Southeast', abbreviation: 'UAS', logo: '🐻' },
      { id: 'alaska-pacific', name: 'Alaska Pacific University', abbreviation: 'APU', logo: '🐻' },
    ],
  },
  // Arizona
  {
    code: 'AZ',
    name: 'Arizona',
    flag: '🏴',
    mascot: '🌵', // Saguaro Cactus
    schools: [
      { id: 'asu', name: 'Arizona State University', abbreviation: 'ASU', logo: '🔥' },
      { id: 'uofa', name: 'University of Arizona', abbreviation: 'UA', logo: '🐻' },
      { id: 'nau', name: 'Northern Arizona University', abbreviation: 'NAU', logo: '🟢' },
      { id: 'grand-canyon', name: 'Grand Canyon University', abbreviation: 'GCU', logo: '🎓' },
      { id: 'embry-riddle', name: 'Embry-Riddle Aeronautical University', abbreviation: 'ERAU', logo: '✈️' },
      { id: 'prescott-college', name: 'Prescott College', abbreviation: 'PC', logo: '🌵' },
      { id: 'arizona-christian', name: 'Arizona Christian University', abbreviation: 'ACU', logo: '✝️' },
      { id: 'thunderbird', name: 'Thunderbird School of Global Management', abbreviation: 'TSGM', logo: '🌍' },
    ],
  },
  // Arkansas
  {
    code: 'AR',
    name: 'Arkansas',
    flag: '🏴',
    mascot: '🐷', // Arkansas Razorback
    schools: [
      { id: 'arkansas', name: 'University of Arkansas', abbreviation: 'UA', logo: '🐗' },
      { id: 'arkansas-state', name: 'Arkansas State University', abbreviation: 'AState', logo: '🔴' },
      { id: 'arkansas-tech', name: 'Arkansas Tech University', abbreviation: 'ATU', logo: '🎓' },
      { id: 'uark-little-rock', name: 'University of Arkansas at Little Rock', abbreviation: 'UALR', logo: '🐗' },
      { id: 'central-arkansas', name: 'University of Central Arkansas', abbreviation: 'UCA', logo: '🐻' },
      { id: 'southern-arkansas', name: 'Southern Arkansas University', abbreviation: 'SAU', logo: '🎓' },
      { id: 'hendrix', name: 'Hendrix College', abbreviation: 'HC', logo: '🦅' },
      { id: 'harding', name: 'Harding University', abbreviation: 'HU', logo: '🦁' },
      { id: 'john-brown', name: 'John Brown University', abbreviation: 'JBU', logo: '🦅' },
      { id: 'ozarks', name: 'University of the Ozarks', abbreviation: 'UO', logo: '🌲' },
    ],
  },
  // California - Major universities
  {
    code: 'CA',
    name: 'California',
    flag: '🏴',
    mascot: '🐻', // California Grizzly Bear
    schools: [
      { id: 'uc-berkeley', name: 'UC Berkeley', abbreviation: 'UCB', logo: '🐻' },
      { id: 'ucla', name: 'UCLA', abbreviation: 'UCLA', logo: '🐻' },
      { id: 'usc', name: 'University of Southern California', abbreviation: 'USC', logo: '✌️' },
      { id: 'stanford', name: 'Stanford University', abbreviation: 'STAN', logo: '🌲' },
      { id: 'ucsd', name: 'UC San Diego', abbreviation: 'UCSD', logo: '🐻' },
      { id: 'ucsb', name: 'UC Santa Barbara', abbreviation: 'UCSB', logo: '🐻' },
      { id: 'ucdavis', name: 'UC Davis', abbreviation: 'UCD', logo: '🐴' },
      { id: 'uc-irvine', name: 'UC Irvine', abbreviation: 'UCI', logo: '🐻' },
      { id: 'caltech', name: 'California Institute of Technology', abbreviation: 'Caltech', logo: '🔬' },
      { id: 'cal-poly', name: 'Cal Poly San Luis Obispo', abbreviation: 'Cal Poly', logo: '🎓' },
      { id: 'san-diego-state', name: 'San Diego State University', abbreviation: 'SDSU', logo: '🔴' },
      { id: 'cal-state-fullerton', name: 'Cal State Fullerton', abbreviation: 'CSUF', logo: '🎓' },
      { id: 'san-jose-state', name: 'San Jose State University', abbreviation: 'SJSU', logo: '🟢' },
      { id: 'long-beach-state', name: 'Cal State Long Beach', abbreviation: 'CSULB', logo: '🌊' },
      { id: 'cal-state-northridge', name: 'Cal State Northridge', abbreviation: 'CSUN', logo: '🎓' },
      { id: 'fresno-state', name: 'Fresno State', abbreviation: 'FSU', logo: '🐶' },
      { id: 'sac-state', name: 'Sacramento State', abbreviation: 'SAC', logo: '🐻' },
      { id: 'pepperdine', name: 'Pepperdine University', abbreviation: 'PEP', logo: '🌊' },
      { id: 'santa-clara', name: 'Santa Clara University', abbreviation: 'SCU', logo: '🔴' },
      { id: 'lmu', name: 'Loyola Marymount University', abbreviation: 'LMU', logo: '🦁' },
    ],
  },
  // Colorado
  {
    code: 'CO',
    name: 'Colorado',
    flag: '🏴',
    mascot: '🦬', // American Bison
    schools: [
      { id: 'cu-boulder', name: 'University of Colorado Boulder', abbreviation: 'CU', logo: '🐻' },
      { id: 'csu', name: 'Colorado State University', abbreviation: 'CSU', logo: '🐏' },
      { id: 'du', name: 'University of Denver', abbreviation: 'DU', logo: '🔴' },
      { id: 'colorado-school-of-mines', name: 'Colorado School of Mines', abbreviation: 'CSM', logo: '⛏️' },
      { id: 'ucolorado-denver', name: 'University of Colorado Denver', abbreviation: 'UCD', logo: '🐻' },
      { id: 'northern-colorado', name: 'University of Northern Colorado', abbreviation: 'UNC', logo: '🐻' },
      { id: 'colorado-college', name: 'Colorado College', abbreviation: 'CC', logo: '🐅' },
      { id: 'metropolitan-state', name: 'Metropolitan State University of Denver', abbreviation: 'MSU', logo: '🎓' },
      { id: 'colorado-tech', name: 'Colorado Technical University', abbreviation: 'CTU', logo: '💻' },
      { id: 'regis', name: 'Regis University', abbreviation: 'RU', logo: '🦁' },
    ],
  },
  // Connecticut
  {
    code: 'CT',
    name: 'Connecticut',
    flag: '🏴',
    mascot: '🐦', // American Robin
    schools: [
      { id: 'yale', name: 'Yale University', abbreviation: 'YALE', logo: '🐕' },
      { id: 'uconn', name: 'University of Connecticut', abbreviation: 'UCONN', logo: '🐕' },
      { id: 'fairfield', name: 'Fairfield University', abbreviation: 'FU', logo: '🔴' },
      { id: 'quinnipiac', name: 'Quinnipiac University', abbreviation: 'QU', logo: '🦅' },
      { id: 'trinity', name: 'Trinity College', abbreviation: 'TC', logo: '🦅' },
      { id: 'wesleyan', name: 'Wesleyan University', abbreviation: 'WES', logo: '🦅' },
      { id: 'connecticut-college', name: 'Connecticut College', abbreviation: 'CC', logo: '🐕' },
      { id: 'sacred-heart', name: 'Sacred Heart University', abbreviation: 'SHU', logo: '❤️' },
      { id: 'central-connecticut', name: 'Central Connecticut State University', abbreviation: 'CCSU', logo: '🎓' },
      { id: 'southern-connecticut', name: 'Southern Connecticut State University', abbreviation: 'SCSU', logo: '🎓' },
    ],
  },
  // Delaware
  {
    code: 'DE',
    name: 'Delaware',
    flag: '🏴',
    mascot: '🐔', // Blue Hen Chicken
    schools: [
      { id: 'udel', name: 'University of Delaware', abbreviation: 'UD', logo: '🐔' },
      { id: 'delaware-state', name: 'Delaware State University', abbreviation: 'DSU', logo: '🐴' },
      { id: 'goldey-beacom', name: 'Goldey-Beacom College', abbreviation: 'GBC', logo: '🎓' },
      { id: 'wesley-college', name: 'Wesley College', abbreviation: 'WC', logo: '🦅' },
    ],
  },
  // Florida
  {
    code: 'FL',
    name: 'Florida',
    flag: '🏴',
    mascot: '🐊', // American Alligator
    schools: [
      { id: 'uf', name: 'University of Florida', abbreviation: 'UF', logo: '🐊' },
      { id: 'fsu', name: 'Florida State University', abbreviation: 'FSU', logo: '⚡' },
      { id: 'um', name: 'University of Miami', abbreviation: 'UM', logo: '🌴' },
      { id: 'ucf', name: 'University of Central Florida', abbreviation: 'UCF', logo: '🛡️' },
      { id: 'usf', name: 'University of South Florida', abbreviation: 'USF', logo: '🐂' },
      { id: 'fau', name: 'Florida Atlantic University', abbreviation: 'FAU', logo: '🦉' },
      { id: 'fiu', name: 'Florida International University', abbreviation: 'FIU', logo: '🔥' },
      { id: 'nova', name: 'Nova Southeastern University', abbreviation: 'NSU', logo: '🦈' },
      { id: 'florida-tech', name: 'Florida Institute of Technology', abbreviation: 'FIT', logo: '🔬' },
      { id: 'rollins', name: 'Rollins College', abbreviation: 'RC', logo: '🌊' },
      { id: 'embry-riddle-fl', name: 'Embry-Riddle Aeronautical University', abbreviation: 'ERAU', logo: '✈️' },
      { id: 'unf', name: 'University of North Florida', abbreviation: 'UNF', logo: '🦅' },
      { id: 'fgcu', name: 'Florida Gulf Coast University', abbreviation: 'FGCU', logo: '🦅' },
      { id: 'pbsc', name: 'Palm Beach State College', abbreviation: 'PBSC', logo: '📚' },
      { id: 'florida-am', name: 'Florida A&M University', abbreviation: 'FAMU', logo: '🐗' },
      { id: 'eckerd', name: 'Eckerd College', abbreviation: 'EC', logo: '🌊' },
      { id: 'flagler', name: 'Flagler College', abbreviation: 'FC', logo: '🏰' },
      { id: 'stetson', name: 'Stetson University', abbreviation: 'SU', logo: '🦅' },
      { id: 'florida-southern', name: 'Florida Southern College', abbreviation: 'FSC', logo: '🌊' },
      { id: 'jacksonville', name: 'Jacksonville University', abbreviation: 'JU', logo: '🐬' },
    ],
  },
  // Georgia
  {
    code: 'GA',
    name: 'Georgia',
    flag: '🏴',
    mascot: '🍑', // Peach
    schools: [
      { id: 'uga', name: 'University of Georgia', abbreviation: 'UGA', logo: '🐕' },
      { id: 'gt', name: 'Georgia Institute of Technology', abbreviation: 'GT', logo: '🐝' },
      { id: 'emory', name: 'Emory University', abbreviation: 'EMORY', logo: '🦅' },
      { id: 'georgia-state', name: 'Georgia State University', abbreviation: 'GSU', logo: '🐈' },
      { id: 'kennesaw', name: 'Kennesaw State University', abbreviation: 'KSU', logo: '🦉' },
      { id: 'georgia-southern', name: 'Georgia Southern University', abbreviation: 'GS', logo: '🦅' },
      { id: 'mercer', name: 'Mercer University', abbreviation: 'MU', logo: '🐻' },
      { id: 'agness-scott', name: 'Agnes Scott College', abbreviation: 'ASC', logo: '🦅' },
      { id: 'berry', name: 'Berry College', abbreviation: 'BC', logo: '🦅' },
      { id: 'clark-atlanta', name: 'Clark Atlanta University', abbreviation: 'CAU', logo: '🦁' },
      { id: 'georgia-college', name: 'Georgia College & State University', abbreviation: 'GCSU', logo: '🎓' },
      { id: 'georgia-tech', name: 'Georgia Tech', abbreviation: 'GT', logo: '🐝' },
      { id: 'morehouse', name: 'Morehouse College', abbreviation: 'MC', logo: '🦁' },
      { id: 'spelman', name: 'Spelman College', abbreviation: 'SC', logo: '🦋' },
      { id: 'university-of-west-georgia', name: 'University of West Georgia', abbreviation: 'UWG', logo: '🐺' },
      { id: 'valdosta-state', name: 'Valdosta State University', abbreviation: 'VSU', logo: '🔥' },
      { id: 'fort-valley-state', name: 'Fort Valley State University', abbreviation: 'FVSU', logo: '🐱' },
      { id: 'georgia-southwestern', name: 'Georgia Southwestern State University', abbreviation: 'GSW', logo: '🎓' },
      { id: 'middle-georgia-state', name: 'Middle Georgia State University', abbreviation: 'MGSU', logo: '🎓' },
      { id: 'albany-state', name: 'Albany State University', abbreviation: 'ASU', logo: '🦅' },
    ],
  },
  // Hawaii
  {
    code: 'HI',
    name: 'Hawaii',
    flag: '🏴',
    mascot: '🌺', // Hibiscus Flower
    schools: [
      { id: 'uh-manoa', name: 'University of Hawaii at Manoa', abbreviation: 'UHM', logo: '🌺' },
      { id: 'hawaii-pacific', name: 'Hawaii Pacific University', abbreviation: 'HPU', logo: '🌊' },
      { id: 'brigham-young-hawaii', name: 'Brigham Young University Hawaii', abbreviation: 'BYUH', logo: '🌴' },
      { id: 'chaminade', name: 'Chaminade University of Honolulu', abbreviation: 'CUH', logo: '🌺' },
    ],
  },
  // Idaho
  {
    code: 'ID',
    name: 'Idaho',
    flag: '🏴',
    mascot: '🐴', // Appaloosa Horse
    schools: [
      { id: 'uidaho', name: 'University of Idaho', abbreviation: 'UI', logo: '🟡' },
      { id: 'boise-state', name: 'Boise State University', abbreviation: 'BSU', logo: '🔵' },
      { id: 'idaho-state', name: 'Idaho State University', abbreviation: 'ISU', logo: '🐅' },
      { id: 'college-of-idaho', name: 'College of Idaho', abbreviation: 'CI', logo: '🎓' },
      { id: 'northwest-nazarene', name: 'Northwest Nazarene University', abbreviation: 'NNU', logo: '🎓' },
    ],
  },
  // Illinois
  {
    code: 'IL',
    name: 'Illinois',
    flag: '🏴',
    mascot: '🦌', // White-tailed Deer
    schools: [
      { id: 'uiuc', name: 'University of Illinois Urbana-Champaign', abbreviation: 'UIUC', logo: '🔵' },
      { id: 'uic', name: 'University of Illinois Chicago', abbreviation: 'UIC', logo: '🔥' },
      { id: 'northwestern', name: 'Northwestern University', abbreviation: 'NU', logo: '🐱' },
      { id: 'uchicago', name: 'University of Chicago', abbreviation: 'UCHICAGO', logo: '🔥' },
      { id: 'depaul', name: 'DePaul University', abbreviation: 'DPU', logo: '🔵' },
      { id: 'loyola-chicago', name: 'Loyola University Chicago', abbreviation: 'LUC', logo: '🦁' },
      { id: 'illinois-state', name: 'Illinois State University', abbreviation: 'ISU', logo: '🔴' },
      { id: 'niu', name: 'Northern Illinois University', abbreviation: 'NIU', logo: '🐕' },
      { id: 'southern-illinois', name: 'Southern Illinois University', abbreviation: 'SIU', logo: '🐺' },
      { id: 'bradley', name: 'Bradley University', abbreviation: 'BU', logo: '🦅' },
      { id: 'illinois-tech', name: 'Illinois Institute of Technology', abbreviation: 'IIT', logo: '🔬' },
      { id: 'eastern-illinois', name: 'Eastern Illinois University', abbreviation: 'EIU', logo: '🦁' },
      { id: 'western-illinois', name: 'Western Illinois University', abbreviation: 'WIU', logo: '🐺' },
      { id: 'aurora', name: 'Aurora University', abbreviation: 'AU', logo: '🟢' },
      { id: 'roosevelt', name: 'Roosevelt University', abbreviation: 'RU', logo: '🦅' },
      { id: 'columbia-chicago', name: 'Columbia College Chicago', abbreviation: 'CCC', logo: '🎨' },
      { id: 'illinois-wesleyan', name: 'Illinois Wesleyan University', abbreviation: 'IWU', logo: '🦅' },
      { id: 'knox', name: 'Knox College', abbreviation: 'KC', logo: '🦅' },
      { id: 'millikin', name: 'Millikin University', abbreviation: 'MU', logo: '🐅' },
      { id: 'north-park', name: 'North Park University', abbreviation: 'NPU', logo: '🔴' },
    ],
  },
  // Indiana
  {
    code: 'IN',
    name: 'Indiana',
    flag: '🏴',
    mascot: '🐴', // State Horse
    schools: [
      { id: 'iu', name: 'Indiana University', abbreviation: 'IU', logo: '🔴' },
      { id: 'purdue', name: 'Purdue University', abbreviation: 'PURDUE', logo: '🚂' },
      { id: 'notre-dame', name: 'University of Notre Dame', abbreviation: 'ND', logo: '☘️' },
      { id: 'butler', name: 'Butler University', abbreviation: 'BU', logo: '🐕' },
      { id: 'ball-state', name: 'Ball State University', abbreviation: 'BSU', logo: '🔴' },
      { id: 'indiana-state', name: 'Indiana State University', abbreviation: 'ISU', logo: '🐗' },
      { id: 'purdue-fort-wayne', name: 'Purdue Fort Wayne', abbreviation: 'PFW', logo: '🚂' },
      { id: 'iupui', name: 'IUPUI', abbreviation: 'IUPUI', logo: '🔴' },
      { id: 'valparaiso', name: 'Valparaiso University', abbreviation: 'VU', logo: '🔴' },
      { id: 'taylor', name: 'Taylor University', abbreviation: 'TU', logo: '🦅' },
      { id: 'indiana-wesleyan', name: 'Indiana Wesleyan University', abbreviation: 'IWU', logo: '🦅' },
      { id: 'depauw', name: 'DePauw University', abbreviation: 'DPU', logo: '🦅' },
      { id: 'wabash', name: 'Wabash College', abbreviation: 'WC', logo: '🦅' },
      { id: 'rose-hulman', name: 'Rose-Hulman Institute of Technology', abbreviation: 'RHIT', logo: '🔬' },
      { id: 'hanover', name: 'Hanover College', abbreviation: 'HC', logo: '🦅' },
      { id: 'earlham', name: 'Earlham College', abbreviation: 'EC', logo: '🦅' },
      { id: 'goshen', name: 'Goshen College', abbreviation: 'GC', logo: '🦅' },
      { id: 'huntington', name: 'Huntington University', abbreviation: 'HU', logo: '🦅' },
      { id: 'marian', name: 'Marian University', abbreviation: 'MU', logo: '🦅' },
      { id: 'trine', name: 'Trine University', abbreviation: 'TU', logo: '🔴' },
    ],
  },
  // Iowa
  {
    code: 'IA',
    name: 'Iowa',
    flag: '🏴',
    mascot: '🦅', // Eastern Goldfinch (State Bird)
    schools: [
      { id: 'uiowa', name: 'University of Iowa', abbreviation: 'UI', logo: '🦅' },
      { id: 'iowa-state', name: 'Iowa State University', abbreviation: 'ISU', logo: '🔴' },
      { id: 'uni', name: 'University of Northern Iowa', abbreviation: 'UNI', logo: '🐱' },
      { id: 'drake', name: 'Drake University', abbreviation: 'DU', logo: '🐕' },
      { id: 'grinnell', name: 'Grinnell College', abbreviation: 'GC', logo: '🦅' },
      { id: 'coe', name: 'Coe College', abbreviation: 'CC', logo: '🦅' },
      { id: 'cornell-college', name: 'Cornell College', abbreviation: 'CC', logo: '🔴' },
      { id: 'simpson', name: 'Simpson College', abbreviation: 'SC', logo: '🦅' },
      { id: 'luther', name: 'Luther College', abbreviation: 'LC', logo: '🦅' },
      { id: 'wartburg', name: 'Wartburg College', abbreviation: 'WC', logo: '🦅' },
    ],
  },
  // Kansas
  {
    code: 'KS',
    name: 'Kansas',
    flag: '🏴',
    mascot: '🐱', // Kansas Jayhawk
    schools: [
      { id: 'ku', name: 'University of Kansas', abbreviation: 'KU', logo: '🐦' },
      { id: 'kstate', name: 'Kansas State University', abbreviation: 'KSU', logo: '🐱' },
      { id: 'wichita-state', name: 'Wichita State University', abbreviation: 'WSU', logo: '⚫' },
      { id: 'wichita-state-shockers', name: 'Wichita State Shockers', abbreviation: 'WSU', logo: '⚡' },
      { id: 'pitt-state', name: 'Pittsburg State University', abbreviation: 'PSU', logo: '🔴' },
      { id: 'emu', name: 'Emporia State University', abbreviation: 'ESU', logo: '🐗' },
      { id: 'fort-hays', name: 'Fort Hays State University', abbreviation: 'FHSU', logo: '🐅' },
      { id: 'baker', name: 'Baker University', abbreviation: 'BU', logo: '🦅' },
      { id: 'benedictine', name: 'Benedictine College', abbreviation: 'BC', logo: '🦅' },
      { id: 'newman', name: 'Newman University', abbreviation: 'NU', logo: '🦅' },
    ],
  },
  // Kentucky
  {
    code: 'KY',
    name: 'Kentucky',
    flag: '🏴',
    mascot: '🐴', // Thoroughbred Horse
    schools: [
      { id: 'uk', name: 'University of Kentucky', abbreviation: 'UK', logo: '🐱' },
      { id: 'louisville', name: 'University of Louisville', abbreviation: 'UofL', logo: '🔴' },
      { id: 'western-kentucky', name: 'Western Kentucky University', abbreviation: 'WKU', logo: '🔴' },
      { id: 'eastern-kentucky', name: 'Eastern Kentucky University', abbreviation: 'EKU', logo: '🔴' },
      { id: 'northern-kentucky', name: 'Northern Kentucky University', abbreviation: 'NKU', logo: '🟢' },
      { id: 'morehead-state', name: 'Morehead State University', abbreviation: 'MSU', logo: '🦅' },
      { id: 'murray-state', name: 'Murray State University', abbreviation: 'MSU', logo: '🐴' },
      { id: 'transylvania', name: 'Transylvania University', abbreviation: 'TU', logo: '🦅' },
      { id: 'centre', name: 'Centre College', abbreviation: 'CC', logo: '🟢' },
      { id: 'berea', name: 'Berea College', abbreviation: 'BC', logo: '🦅' },
    ],
  },
  // Louisiana
  {
    code: 'LA',
    name: 'Louisiana',
    flag: '🏴',
    mascot: '🐊', // American Alligator
    schools: [
      { id: 'lsu', name: 'Louisiana State University', abbreviation: 'LSU', logo: '🐅' },
      { id: 'tulane', name: 'Tulane University', abbreviation: 'TULANE', logo: '🟢' },
      { id: 'louisiana-tech', name: 'Louisiana Tech University', abbreviation: 'LaTech', logo: '🐕' },
      { id: 'ul-lafayette', name: 'University of Louisiana at Lafayette', abbreviation: 'ULL', logo: '🔴' },
      { id: 'ul-monroe', name: 'University of Louisiana at Monroe', abbreviation: 'ULM', logo: '🐗' },
      { id: 'southern-university', name: 'Southern University', abbreviation: 'SU', logo: '🐗' },
      { id: 'grambling', name: 'Grambling State University', abbreviation: 'GSU', logo: '🐅' },
      { id: 'mcnese', name: 'McNeese State University', abbreviation: 'MSU', logo: '🐗' },
      { id: 'nicholls', name: 'Nicholls State University', abbreviation: 'NSU', logo: '🐗' },
      { id: 'northwestern-state', name: 'Northwestern State University', abbreviation: 'NSU', logo: '🐗' },
    ],
  },
  // Maine
  {
    code: 'ME',
    name: 'Maine',
    flag: '🏴',
    mascot: '🦞', // Maine Lobster
    schools: [
      { id: 'umaine', name: 'University of Maine', abbreviation: 'UM', logo: '🐻' },
      { id: 'bowdoin', name: 'Bowdoin College', abbreviation: 'BC', logo: '🐻' },
      { id: 'colby', name: 'Colby College', abbreviation: 'CC', logo: '🐴' },
      { id: 'bates', name: 'Bates College', abbreviation: 'BC', logo: '🐱' },
      { id: 'southern-maine', name: 'University of Southern Maine', abbreviation: 'USM', logo: '🦅' },
    ],
  },
  // Maryland
  {
    code: 'MD',
    name: 'Maryland',
    flag: '🏴',
    mascot: '🐱', // Chesapeake Bay Retriever (State Dog)
    schools: [
      { id: 'umd', name: 'University of Maryland', abbreviation: 'UMD', logo: '🐢' },
      { id: 'johns-hopkins', name: 'Johns Hopkins University', abbreviation: 'JHU', logo: '🔵' },
      { id: 'towson', name: 'Towson University', abbreviation: 'TU', logo: '🐅' },
      { id: 'umbc', name: 'UMBC', abbreviation: 'UMBC', logo: '🐕' },
      { id: 'loyola-maryland', name: 'Loyola University Maryland', abbreviation: 'LUM', logo: '🦁' },
      { id: 'goucher', name: 'Goucher College', abbreviation: 'GC', logo: '🦅' },
      { id: 'morgan-state', name: 'Morgan State University', abbreviation: 'MSU', logo: '🐻' },
      { id: 'frostburg', name: 'Frostburg State University', abbreviation: 'FSU', logo: '🐗' },
      { id: 'salisbury', name: 'Salisbury University', abbreviation: 'SU', logo: '🦅' },
      { id: 'coppin-state', name: 'Coppin State University', abbreviation: 'CSU', logo: '🦅' },
    ],
  },
  // Massachusetts
  {
    code: 'MA',
    name: 'Massachusetts',
    flag: '🏴',
    mascot: '🐶', // Boston Terrier (State Dog)
    schools: [
      { id: 'mit', name: 'Massachusetts Institute of Technology', abbreviation: 'MIT', logo: '🔬' },
      { id: 'harvard', name: 'Harvard University', abbreviation: 'HARVARD', logo: '🔴' },
      { id: 'boston-university', name: 'Boston University', abbreviation: 'BU', logo: '🐕' },
      { id: 'northeastern', name: 'Northeastern University', abbreviation: 'NU', logo: '🦅' },
      { id: 'umass-amherst', name: 'UMass Amherst', abbreviation: 'UMASS', logo: '🟢' },
      { id: 'umass-boston', name: 'UMass Boston', abbreviation: 'UMB', logo: '🟢' },
      { id: 'bc', name: 'Boston College', abbreviation: 'BC', logo: '🦅' },
      { id: 'tufts', name: 'Tufts University', abbreviation: 'TUFTS', logo: '🐘' },
      { id: 'brandeis', name: 'Brandeis University', abbreviation: 'BU', logo: '🦅' },
      { id: 'wellesley', name: 'Wellesley College', abbreviation: 'WC', logo: '🦅' },
      { id: 'amherst', name: 'Amherst College', abbreviation: 'AC', logo: '🦅' },
      { id: 'williams', name: 'Williams College', abbreviation: 'WC', logo: '🦅' },
      { id: 'smith', name: 'Smith College', abbreviation: 'SC', logo: '🦅' },
      { id: 'mount-holyoke', name: 'Mount Holyoke College', abbreviation: 'MHC', logo: '🦅' },
      { id: 'umass-lowell', name: 'UMass Lowell', abbreviation: 'UML', logo: '🟢' },
      { id: 'worcester-polytech', name: 'Worcester Polytechnic Institute', abbreviation: 'WPI', logo: '🔬' },
      { id: 'umass-dartmouth', name: 'UMass Dartmouth', abbreviation: 'UMD', logo: '🟢' },
      { id: 'bentley', name: 'Bentley University', abbreviation: 'BU', logo: '🦅' },
      { id: 'suffolk', name: 'Suffolk University', abbreviation: 'SU', logo: '🔴' },
      { id: 'umass-medical', name: 'UMass Medical School', abbreviation: 'UMMS', logo: '⚕️' },
    ],
  },
  // Michigan
  {
    code: 'MI',
    name: 'Michigan',
    flag: '🏴',
    mascot: '🍒', // Cherry
    schools: [
      { id: 'umich', name: 'University of Michigan', abbreviation: 'UM', logo: '〽️' },
      { id: 'msu', name: 'Michigan State University', abbreviation: 'MSU', logo: '🟢' },
      { id: 'wayne-state', name: 'Wayne State University', abbreviation: 'WSU', logo: '🟢' },
      { id: 'central-michigan', name: 'Central Michigan University', abbreviation: 'CMU', logo: '🔴' },
      { id: 'eastern-michigan', name: 'Eastern Michigan University', abbreviation: 'EMU', logo: '🟢' },
      { id: 'western-michigan', name: 'Western Michigan University', abbreviation: 'WMU', logo: '🟤' },
      { id: 'northern-michigan', name: 'Northern Michigan University', abbreviation: 'NMU', logo: '🟢' },
      { id: 'oakland', name: 'Oakland University', abbreviation: 'OU', logo: '🟢' },
      { id: 'grand-valley', name: 'Grand Valley State University', abbreviation: 'GVSU', logo: '🔴' },
      { id: 'ferris-state', name: 'Ferris State University', abbreviation: 'FSU', logo: '🔴' },
      { id: 'albion', name: 'Albion College', abbreviation: 'AC', logo: '🔴' },
      { id: 'calvin', name: 'Calvin University', abbreviation: 'CU', logo: '🔴' },
      { id: 'hope', name: 'Hope College', abbreviation: 'HC', logo: '🔵' },
      { id: 'kalamazoo', name: 'Kalamazoo College', abbreviation: 'KC', logo: '🦅' },
      { id: 'lawrence-tech', name: 'Lawrence Technological University', abbreviation: 'LTU', logo: '🔬' },
      { id: 'adrian', name: 'Adrian College', abbreviation: 'AC', logo: '🐕' },
      { id: 'alma', name: 'Alma College', abbreviation: 'AC', logo: '🦅' },
      { id: 'aquinas', name: 'Aquinas College', abbreviation: 'AC', logo: '🦅' },
      { id: 'hillsdale', name: 'Hillsdale College', abbreviation: 'HC', logo: '🦅' },
      { id: 'saginaw-valley', name: 'Saginaw Valley State University', abbreviation: 'SVSU', logo: '🔴' },
    ],
  },
  // Minnesota
  {
    code: 'MN',
    name: 'Minnesota',
    flag: '🏴',
    mascot: '🦌', // White-tailed Deer
    schools: [
      { id: 'umn', name: 'University of Minnesota', abbreviation: 'UMN', logo: '🟡' },
      { id: 'st-thomas', name: 'University of St. Thomas', abbreviation: 'UST', logo: '🟣' },
      { id: 'carleton', name: 'Carleton College', abbreviation: 'CC', logo: '🦅' },
      { id: 'gustavus-adolphus', name: 'Gustavus Adolphus College', abbreviation: 'GAC', logo: '🟡' },
      { id: 'macalester', name: 'Macalester College', abbreviation: 'MC', logo: '🟡' },
      { id: 'st-olef', name: 'St. Olaf College', abbreviation: 'SOC', logo: '🟡' },
      { id: 'bethel', name: 'Bethel University', abbreviation: 'BU', logo: '🟡' },
      { id: 'minnesota-state', name: 'Minnesota State University', abbreviation: 'MSU', logo: '🔴' },
      { id: 'st-cloud-state', name: 'St. Cloud State University', abbreviation: 'SCSU', logo: '🔴' },
      { id: 'winona-state', name: 'Winona State University', abbreviation: 'WSU', logo: '🟣' },
    ],
  },
  // Mississippi
  {
    code: 'MS',
    name: 'Mississippi',
    flag: '🏴',
    mascot: '🐟', // Largemouth Bass
    schools: [
      { id: 'ole-miss', name: 'University of Mississippi', abbreviation: 'OLE MISS', logo: '🔴' },
      { id: 'mississippi-state', name: 'Mississippi State University', abbreviation: 'MSU', logo: '🐕' },
      { id: 'southern-miss', name: 'University of Southern Mississippi', abbreviation: 'USM', logo: '🟡' },
      { id: 'jackson-state', name: 'Jackson State University', abbreviation: 'JSU', logo: '🔵' },
      { id: 'delta-state', name: 'Delta State University', abbreviation: 'DSU', logo: '🔴' },
      { id: 'alcorn-state', name: 'Alcorn State University', abbreviation: 'ASU', logo: '🔴' },
      { id: 'mississippi-valley', name: 'Mississippi Valley State University', abbreviation: 'MVSU', logo: '🔴' },
      { id: 'mississippi-college', name: 'Mississippi College', abbreviation: 'MC', logo: '🦅' },
      { id: 'belhaven', name: 'Belhaven University', abbreviation: 'BU', logo: '🦅' },
      { id: 'millsaps', name: 'Millsaps College', abbreviation: 'MC', logo: '🦅' },
    ],
  },
  // Missouri
  {
    code: 'MO',
    name: 'Missouri',
    flag: '🏴',
    mascot: '🐻', // Missouri Mule
    schools: [
      { id: 'mizzou', name: 'University of Missouri', abbreviation: 'Mizzou', logo: '🐅' },
      { id: 'wustl', name: 'Washington University in St. Louis', abbreviation: 'WUSTL', logo: '🐻' },
      { id: 'slu', name: 'Saint Louis University', abbreviation: 'SLU', logo: '🦅' },
      { id: 'umsl', name: 'University of Missouri-St. Louis', abbreviation: 'UMSL', logo: '🐅' },
      { id: 'umkc', name: 'University of Missouri-Kansas City', abbreviation: 'UMKC', logo: '🐅' },
      { id: 'missouri-state', name: 'Missouri State University', abbreviation: 'MSU', logo: '🐻' },
      { id: 'semo', name: 'Southeast Missouri State University', abbreviation: 'SEMO', logo: '🔴' },
      { id: 'truman', name: 'Truman State University', abbreviation: 'TSU', logo: '🟢' },
      { id: 'lindenwood', name: 'Lindenwood University', abbreviation: 'LU', logo: '🦁' },
      { id: 'drury', name: 'Drury University', abbreviation: 'DU', logo: '🦅' },
      { id: 'mizzou-s&t', name: 'Missouri S&T', abbreviation: 'MST', logo: '🔬' },
      { id: 'northwest-missouri', name: 'Northwest Missouri State University', abbreviation: 'NWMSU', logo: '🟢' },
      { id: 'missouri-western', name: 'Missouri Western State University', abbreviation: 'MWSU', logo: '🔴' },
      { id: 'central-missouri', name: 'University of Central Missouri', abbreviation: 'UCM', logo: '🔴' },
      { id: 'lincoln-mo', name: 'Lincoln University', abbreviation: 'LU', logo: '🦅' },
      { id: 'westminster', name: 'Westminster College', abbreviation: 'WC', logo: '🦅' },
      { id: 'columbia-college', name: 'Columbia College', abbreviation: 'CC', logo: '🦅' },
      { id: 'william-jewell', name: 'William Jewell College', abbreviation: 'WJC', logo: '🦅' },
      { id: 'rockhurst', name: 'Rockhurst University', abbreviation: 'RU', logo: '🦅' },
      { id: 'park', name: 'Park University', abbreviation: 'PU', logo: '🎓' },
    ],
  },
  // Montana
  {
    code: 'MT',
    name: 'Montana',
    flag: '🏴',
    mascot: '🦬', // American Bison
    schools: [
      { id: 'umt', name: 'University of Montana', abbreviation: 'UM', logo: '🦅' },
      { id: 'montana-state', name: 'Montana State University', abbreviation: 'MSU', logo: '🐱' },
      { id: 'montana-tech', name: 'Montana Tech', abbreviation: 'MT', logo: '🔬' },
      { id: 'montana-western', name: 'University of Montana Western', abbreviation: 'UMW', logo: '🦅' },
      { id: 'montana-state-northern', name: 'Montana State University Northern', abbreviation: 'MSUN', logo: '🐱' },
    ],
  },
  // Nebraska
  {
    code: 'NE',
    name: 'Nebraska',
    flag: '🏴',
    mascot: '🌽', // Corn
    schools: [
      { id: 'unl', name: 'University of Nebraska-Lincoln', abbreviation: 'UNL', logo: '🌽' },
      { id: 'unomaha', name: 'University of Nebraska Omaha', abbreviation: 'UNO', logo: '🌽' },
      { id: 'nebraska-kearney', name: 'University of Nebraska at Kearney', abbreviation: 'UNK', logo: '🌽' },
      { id: 'creighton', name: 'Creighton University', abbreviation: 'CU', logo: '🔵' },
      { id: 'chadron-state', name: 'Chadron State College', abbreviation: 'CSC', logo: '🦅' },
      { id: 'wayne-state-ne', name: 'Wayne State College', abbreviation: 'WSC', logo: '🦅' },
      { id: 'peru-state', name: 'Peru State College', abbreviation: 'PSC', logo: '🦅' },
      { id: 'nebraska-wesleyan', name: 'Nebraska Wesleyan University', abbreviation: 'NWU', logo: '🟢' },
      { id: 'hastings', name: 'Hastings College', abbreviation: 'HC', logo: '🟢' },
      { id: 'doane', name: 'Doane University', abbreviation: 'DU', logo: '🦅' },
    ],
  },
  // Nevada
  {
    code: 'NV',
    name: 'Nevada',
    flag: '🏴',
    mascot: '🦌', // Desert Bighorn Sheep
    schools: [
      { id: 'unlv', name: 'University of Nevada, Las Vegas', abbreviation: 'UNLV', logo: '🔴' },
      { id: 'unr', name: 'University of Nevada, Reno', abbreviation: 'UNR', logo: '🔵' },
      { id: 'nevada-state', name: 'Nevada State College', abbreviation: 'NSC', logo: '🎓' },
      { id: 'sierra-nevada', name: 'Sierra Nevada University', abbreviation: 'SNU', logo: '🏔️' },
    ],
  },
  // New Hampshire
  {
    code: 'NH',
    name: 'New Hampshire',
    flag: '🏴',
    mascot: '🐶', // State Dog
    schools: [
      { id: 'unh', name: 'University of New Hampshire', abbreviation: 'UNH', logo: '🐱' },
      { id: 'dartmouth', name: 'Dartmouth College', abbreviation: 'DARTMOUTH', logo: '🟢' },
      { id: 'plymouth-state', name: 'Plymouth State University', abbreviation: 'PSU', logo: '🐱' },
      { id: 'keene-state', name: 'Keene State College', abbreviation: 'KSC', logo: '🦅' },
      { id: 'franklin-pierce', name: 'Franklin Pierce University', abbreviation: 'FPU', logo: '🦅' },
    ],
  },
  // New Jersey
  {
    code: 'NJ',
    name: 'New Jersey',
    flag: '🏴',
    mascot: '🐴', // Horse
    schools: [
      { id: 'princeton', name: 'Princeton University', abbreviation: 'PRINCETON', logo: '🟠' },
      { id: 'rutgers', name: 'Rutgers University', abbreviation: 'RU', logo: '🔴' },
      { id: 'seton-hall', name: 'Seton Hall University', abbreviation: 'SHU', logo: '🔵' },
      { id: 'rowan', name: 'Rowan University', abbreviation: 'RU', logo: '🟤' },
      { id: 'montclair-state', name: 'Montclair State University', abbreviation: 'MSU', logo: '🔴' },
      { id: 'stevens', name: 'Stevens Institute of Technology', abbreviation: 'SIT', logo: '🔬' },
      { id: 'njit', name: 'New Jersey Institute of Technology', abbreviation: 'NJIT', logo: '🔬' },
      { id: 'the-college-of-nj', name: 'The College of New Jersey', abbreviation: 'TCNJ', logo: '🦁' },
      { id: 'stockton', name: 'Stockton University', abbreviation: 'SU', logo: '🟢' },
      { id: 'rider', name: 'Rider University', abbreviation: 'RU', logo: '🔴' },
    ],
  },
  // New Mexico
  {
    code: 'NM',
    name: 'New Mexico',
    flag: '🏴',
    mascot: '🌵', // Yucca Plant
    schools: [
      { id: 'unm', name: 'University of New Mexico', abbreviation: 'UNM', logo: '🔴' },
      { id: 'nmsu', name: 'New Mexico State University', abbreviation: 'NMSU', logo: '🔴' },
      { id: 'new-mexico-tech', name: 'New Mexico Institute of Mining and Technology', abbreviation: 'NMT', logo: '🔬' },
      { id: 'eastern-nm', name: 'Eastern New Mexico University', abbreviation: 'ENMU', logo: '🟢' },
      { id: 'western-nm', name: 'Western New Mexico University', abbreviation: 'WNMU', logo: '🟢' },
    ],
  },
  // New York
  {
    code: 'NY',
    name: 'New York',
    flag: '🏴',
    mascot: '🍎', // Empire State Apple
    schools: [
      { id: 'columbia', name: 'Columbia University', abbreviation: 'COLUMBIA', logo: '🦁' },
      { id: 'nyu', name: 'New York University', abbreviation: 'NYU', logo: '🟣' },
      { id: 'cornell', name: 'Cornell University', abbreviation: 'CORNELL', logo: '🔴' },
      { id: 'suny-buffalo', name: 'SUNY Buffalo', abbreviation: 'UB', logo: '🔵' },
      { id: 'suny-albany', name: 'SUNY Albany', abbreviation: 'UAlbany', logo: '🟡' },
      { id: 'suny-binghamton', name: 'SUNY Binghamton', abbreviation: 'BU', logo: '🟢' },
      { id: 'suny-stony-brook', name: 'SUNY Stony Brook', abbreviation: 'SBU', logo: '🔴' },
      { id: 'syu-syracuse', name: 'Syracuse University', abbreviation: 'SU', logo: '🟠' },
      { id: 'rochester', name: 'University of Rochester', abbreviation: 'UR', logo: '🟡' },
      { id: 'fordham', name: 'Fordham University', abbreviation: 'FU', logo: '🔴' },
      { id: 'rpi', name: 'Rensselaer Polytechnic Institute', abbreviation: 'RPI', logo: '🔬' },
      { id: 'stony-brook', name: 'Stony Brook University', abbreviation: 'SBU', logo: '🔴' },
      { id: 'city-college', name: 'City College of New York', abbreviation: 'CCNY', logo: '🔵' },
      { id: 'hunter', name: 'Hunter College', abbreviation: 'HC', logo: '🔵' },
      { id: 'baruch', name: 'Baruch College', abbreviation: 'BC', logo: '🔵' },
      { id: 'brooklyn-college', name: 'Brooklyn College', abbreviation: 'BC', logo: '🔵' },
      { id: 'ithaca', name: 'Ithaca College', abbreviation: 'IC', logo: '🔵' },
      { id: 'pace', name: 'Pace University', abbreviation: 'PU', logo: '🔵' },
      { id: 'hofstra', name: 'Hofstra University', abbreviation: 'HU', logo: '🔵' },
      { id: 'st-johns', name: "St. John's University", abbreviation: 'SJU', logo: '🔴' },
    ],
  },
  // North Carolina
  {
    code: 'NC',
    name: 'North Carolina',
    flag: '🏴',
    mascot: '🐻', // Black Bear
    schools: [
      { id: 'unc', name: 'University of North Carolina', abbreviation: 'UNC', logo: '🔵' },
      { id: 'nc-state', name: 'NC State University', abbreviation: 'NCSU', logo: '🔴' },
      { id: 'duke', name: 'Duke University', abbreviation: 'DUKE', logo: '🔵' },
      { id: 'wake-forest', name: 'Wake Forest University', abbreviation: 'WFU', logo: '🟤' },
      { id: 'app-state', name: 'Appalachian State University', abbreviation: 'ASU', logo: '⚫' },
      { id: 'east-carolina', name: 'East Carolina University', abbreviation: 'ECU', logo: '🟣' },
      { id: 'unc-charlotte', name: 'UNC Charlotte', abbreviation: 'UNCC', logo: '🟢' },
      { id: 'unc-greensboro', name: 'UNC Greensboro', abbreviation: 'UNCG', logo: '🟡' },
      { id: 'unc-wilmington', name: 'UNC Wilmington', abbreviation: 'UNCW', logo: '🔵' },
      { id: 'western-carolina', name: 'Western Carolina University', abbreviation: 'WCU', logo: '🟣' },
      { id: 'north-carolina-at', name: 'North Carolina A&T', abbreviation: 'NCAT', logo: '🔵' },
      { id: 'davidson', name: 'Davidson College', abbreviation: 'DC', logo: '🔴' },
      { id: 'elon', name: 'Elon University', abbreviation: 'EU', logo: '🟢' },
      { id: 'high-point', name: 'High Point University', abbreviation: 'HPU', logo: '🟣' },
      { id: 'nc-central', name: 'NC Central University', abbreviation: 'NCCU', logo: '🔵' },
      { id: 'campbell', name: 'Campbell University', abbreviation: 'CU', logo: '🟠' },
      { id: 'gardner-webb', name: 'Gardner-Webb University', abbreviation: 'GWU', logo: '🟢' },
      { id: 'meredith', name: 'Meredith College', abbreviation: 'MC', logo: '🦅' },
      { id: 'queens', name: "Queens University of Charlotte", abbreviation: 'QU', logo: '🟢' },
      { id: 'wingate', name: 'Wingate University', abbreviation: 'WU', logo: '🦅' },
    ],
  },
  // North Dakota
  {
    code: 'ND',
    name: 'North Dakota',
    flag: '🏴',
    mascot: '🐄', // Nokota Horse
    schools: [
      { id: 'und', name: 'University of North Dakota', abbreviation: 'UND', logo: '🟢' },
      { id: 'ndsu', name: 'North Dakota State University', abbreviation: 'NDSU', logo: '🟢' },
      { id: 'minot-state', name: 'Minot State University', abbreviation: 'MSU', logo: '🔴' },
      { id: 'valley-city-state', name: 'Valley City State University', abbreviation: 'VCSU', logo: '🔴' },
      { id: 'dickinson-state', name: 'Dickinson State University', abbreviation: 'DSU', logo: '🔴' },
    ],
  },
  // Ohio
  {
    code: 'OH',
    name: 'Ohio',
    flag: '🏴',
    mascot: '🔴', // Cardinal
    schools: [
      { id: 'osu', name: 'Ohio State University', abbreviation: 'OSU', logo: '🔴' },
      { id: 'miami-oh', name: 'Miami University', abbreviation: 'MU', logo: '🔴' },
      { id: 'uc', name: 'University of Cincinnati', abbreviation: 'UC', logo: '🔴' },
      { id: 'case-western', name: 'Case Western Reserve University', abbreviation: 'CWRU', logo: '🔵' },
      { id: 'ohio-university', name: 'Ohio University', abbreviation: 'OU', logo: '🟢' },
      { id: 'bowling-green', name: 'Bowling Green State University', abbreviation: 'BGSU', logo: '🟠' },
      { id: 'kent-state', name: 'Kent State University', abbreviation: 'KSU', logo: '🟡' },
      { id: 'toledo', name: 'University of Toledo', abbreviation: 'UT', logo: '🔵' },
      { id: 'akron', name: 'University of Akron', abbreviation: 'UA', logo: '🔵' },
      { id: 'xavier', name: 'Xavier University', abbreviation: 'XU', logo: '🔵' },
      { id: 'dayton', name: 'University of Dayton', abbreviation: 'UD', logo: '🔴' },
      { id: 'oberlin', name: 'Oberlin College', abbreviation: 'OC', logo: '🔴' },
      { id: 'kenyon', name: 'Kenyon College', abbreviation: 'KC', logo: '🟢' },
      { id: 'wooster', name: 'College of Wooster', abbreviation: 'CW', logo: '🟢' },
      { id: 'denison', name: 'Denison University', abbreviation: 'DU', logo: '🔴' },
      { id: 'wright-state', name: 'Wright State University', abbreviation: 'WSU', logo: '🟢' },
      { id: 'youngstown-state', name: 'Youngstown State University', abbreviation: 'YSU', logo: '🔴' },
      { id: 'cleveland-state', name: 'Cleveland State University', abbreviation: 'CSU', logo: '🟢' },
      { id: 'ohio-northern', name: 'Ohio Northern University', abbreviation: 'ONU', logo: '🟢' },
      { id: 'wittenberg', name: 'Wittenberg University', abbreviation: 'WU', logo: '🔴' },
    ],
  },
  // Oklahoma
  {
    code: 'OK',
    name: 'Oklahoma',
    flag: '🏴',
    mascot: '🦃', // Scissor-tailed Flycatcher
    schools: [
      { id: 'ou', name: 'University of Oklahoma', abbreviation: 'OU', logo: '🔴' },
      { id: 'okstate', name: 'Oklahoma State University', abbreviation: 'OSU', logo: '🟠' },
      { id: 'tulsa', name: 'University of Tulsa', abbreviation: 'TU', logo: '🟡' },
      { id: 'ou-health-sciences', name: 'OU Health Sciences Center', abbreviation: 'OUHSC', logo: '⚕️' },
      { id: 'central-oklahoma', name: 'University of Central Oklahoma', abbreviation: 'UCO', logo: '🔴' },
      { id: 'northeastern-state', name: 'Northeastern State University', abbreviation: 'NSU', logo: '🟢' },
      { id: 'east-central', name: 'East Central University', abbreviation: 'ECU', logo: '🔴' },
      { id: 'southwestern-ok', name: 'Southwestern Oklahoma State University', abbreviation: 'SWOSU', logo: '🟢' },
      { id: 'northwestern-ok', name: 'Northwestern Oklahoma State University', abbreviation: 'NWOSU', logo: '🔴' },
      { id: 'oral-roberts', name: 'Oral Roberts University', abbreviation: 'ORU', logo: '🟢' },
    ],
  },
  // Oregon
  {
    code: 'OR',
    name: 'Oregon',
    flag: '🏴',
    mascot: '🦪', // Oyster
    schools: [
      { id: 'uo', name: 'University of Oregon', abbreviation: 'UO', logo: '🟡' },
      { id: 'osu', name: 'Oregon State University', abbreviation: 'OSU', logo: '🟠' },
      { id: 'portland-state', name: 'Portland State University', abbreviation: 'PSU', logo: '🟢' },
      { id: 'willamette', name: 'Willamette University', abbreviation: 'WU', logo: '🔴' },
      { id: 'reed', name: 'Reed College', abbreviation: 'RC', logo: '🔴' },
      { id: 'lewis-clark', name: 'Lewis & Clark College', abbreviation: 'LCC', logo: '🟢' },
      { id: 'linfield', name: 'Linfield University', abbreviation: 'LU', logo: '🟢' },
      { id: 'pacific-university', name: 'Pacific University', abbreviation: 'PU', logo: '🔵' },
      { id: 'oregon-tech', name: 'Oregon Institute of Technology', abbreviation: 'OIT', logo: '🔬' },
      { id: 'southern-oregon', name: 'Southern Oregon University', abbreviation: 'SOU', logo: '🔴' },
    ],
  },
  // Pennsylvania
  {
    code: 'PA',
    name: 'Pennsylvania',
    flag: '🏴',
    mascot: '🦌', // White-tailed Deer
    schools: [
      { id: 'upenn', name: 'University of Pennsylvania', abbreviation: 'UPenn', logo: '🔴' },
      { id: 'pitt', name: 'University of Pittsburgh', abbreviation: 'PITT', logo: '🔵' },
      { id: 'psu', name: 'Penn State University', abbreviation: 'PSU', logo: '🔵' },
      { id: 'carnegie-mellon', name: 'Carnegie Mellon University', abbreviation: 'CMU', logo: '🔴' },
      { id: 'temple', name: 'Temple University', abbreviation: 'TU', logo: '🔴' },
      { id: 'drexel', name: 'Drexel University', abbreviation: 'DU', logo: '🔵' },
      { id: 'villanova', name: 'Villanova University', abbreviation: 'VU', logo: '🔵' },
      { id: 'lehigh', name: 'Lehigh University', abbreviation: 'LU', logo: '🟤' },
      { id: 'bucknell', name: 'Bucknell University', abbreviation: 'BU', logo: '🟠' },
      { id: 'lafayette', name: 'Lafayette College', abbreviation: 'LC', logo: '🔴' },
      { id: 'swarthmore', name: 'Swarthmore College', abbreviation: 'SC', logo: '🔴' },
      { id: 'haverford', name: 'Haverford College', abbreviation: 'HC', logo: '🔴' },
      { id: 'gettysburg', name: 'Gettysburg College', abbreviation: 'GC', logo: '🔵' },
      { id: 'franklin-marshall', name: 'Franklin & Marshall College', abbreviation: 'F&M', logo: '🔵' },
      { id: 'dickinson', name: 'Dickinson College', abbreviation: 'DC', logo: '🔴' },
      { id: 'brynmawr', name: 'Bryn Mawr College', abbreviation: 'BMC', logo: '🔴' },
      { id: 'penn-state-behrend', name: 'Penn State Behrend', abbreviation: 'PSB', logo: '🔵' },
      { id: 'west-chester', name: 'West Chester University', abbreviation: 'WCU', logo: '🟤' },
      { id: 'indiana-pa', name: 'Indiana University of Pennsylvania', abbreviation: 'IUP', logo: '🔴' },
      { id: 'slippery-rock', name: 'Slippery Rock University', abbreviation: 'SRU', logo: '🟢' },
    ],
  },
  // Rhode Island
  {
    code: 'RI',
    name: 'Rhode Island',
    flag: '🏴',
    mascot: '🐔', // Rhode Island Red Chicken
    schools: [
      { id: 'brown', name: 'Brown University', abbreviation: 'BROWN', logo: '🔵' },
      { id: 'uri', name: 'University of Rhode Island', abbreviation: 'URI', logo: '🔴' },
      { id: 'providence', name: 'Providence College', abbreviation: 'PC', logo: '⚫' },
      { id: 'bryant', name: 'Bryant University', abbreviation: 'BU', logo: '🔵' },
      { id: 'roger-williams', name: 'Roger Williams University', abbreviation: 'RWU', logo: '🔵' },
    ],
  },
  // South Carolina
  {
    code: 'SC',
    name: 'South Carolina',
    flag: '🏴',
    mascot: '🦃', // Wild Turkey
    schools: [
      { id: 'clemson', name: 'Clemson University', abbreviation: 'CLEMSON', logo: '🟠' },
      { id: 'usc', name: 'University of South Carolina', abbreviation: 'USC', logo: '🔴' },
      { id: 'citadel', name: 'The Citadel', abbreviation: 'CIT', logo: '🔵' },
      { id: 'coastal-carolina', name: 'Coastal Carolina University', abbreviation: 'CCU', logo: '🟢' },
      { id: 'winthrop', name: 'Winthrop University', abbreviation: 'WU', logo: '🔴' },
      { id: 'furman', name: 'Furman University', abbreviation: 'FU', logo: '🟣' },
      { id: 'wofford', name: 'Wofford College', abbreviation: 'WC', logo: '🟤' },
      { id: 'presbyterian', name: 'Presbyterian College', abbreviation: 'PC', logo: '🔵' },
      { id: 'charleston-southern', name: 'Charleston Southern University', abbreviation: 'CSU', logo: '🔵' },
      { id: 'clafin', name: 'Claflin University', abbreviation: 'CU', logo: '🟠' },
    ],
  },
  // South Dakota
  {
    code: 'SD',
    name: 'South Dakota',
    flag: '🏴',
    mascot: '🐧', // Ring-necked Pheasant
    schools: [
      { id: 'usd', name: 'University of South Dakota', abbreviation: 'USD', logo: '🔴' },
      { id: 'sdsu', name: 'South Dakota State University', abbreviation: 'SDSU', logo: '🟡' },
      { id: 'dakota-state', name: 'Dakota State University', abbreviation: 'DSU', logo: '🔴' },
      { id: 'northern-state', name: 'Northern State University', abbreviation: 'NSU', logo: '🔵' },
      { id: 'black-hills-state', name: 'Black Hills State University', abbreviation: 'BHSU', logo: '🟡' },
    ],
  },
  // Tennessee
  {
    code: 'TN',
    name: 'Tennessee',
    flag: '🏴',
    mascot: '🐔', // Bobwhite Quail
    schools: [
      { id: 'utk', name: 'University of Tennessee', abbreviation: 'UT', logo: '🔴' },
      { id: 'vanderbilt', name: 'Vanderbilt University', abbreviation: 'VANDY', logo: '🟤' },
      { id: 'ut-chattanooga', name: 'UTC', abbreviation: 'UTC', logo: '🔵' },
      { id: 'memphis', name: 'University of Memphis', abbreviation: 'UM', logo: '🔵' },
      { id: 'middle-tennessee', name: 'Middle Tennessee State University', abbreviation: 'MTSU', logo: '🔵' },
      { id: 'tennessee-tech', name: 'Tennessee Tech University', abbreviation: 'TTU', logo: '🔴' },
      { id: 'east-tennessee', name: 'East Tennessee State University', abbreviation: 'ETSU', logo: '🔵' },
      { id: 'tennessee-state', name: 'Tennessee State University', abbreviation: 'TSU', logo: '🔵' },
      { id: 'austin-peay', name: 'Austin Peay State University', abbreviation: 'APSU', logo: '🔴' },
      { id: 'belmont', name: 'Belmont University', abbreviation: 'BU', logo: '🔴' },
      { id: 'lipscomb', name: 'Lipscomb University', abbreviation: 'LU', logo: '🟣' },
      { id: 'union', name: 'Union University', abbreviation: 'UU', logo: '🔴' },
      { id: 'rhodes', name: 'Rhodes College', abbreviation: 'RC', logo: '🔴' },
      { id: 'sewanee', name: 'Sewanee: The University of the South', abbreviation: 'SU', logo: '🟢' },
      { id: 'fisk', name: 'Fisk University', abbreviation: 'FU', logo: '🔵' },
      { id: 'tusculum', name: 'Tusculum University', abbreviation: 'TU', logo: '🟢' },
      { id: 'maryville', name: 'Maryville College', abbreviation: 'MC', logo: '🟢' },
      { id: 'christian-brothers', name: 'Christian Brothers University', abbreviation: 'CBU', logo: '🔵' },
      { id: 'carson-newman', name: 'Carson-Newman University', abbreviation: 'CNU', logo: '🔴' },
      { id: 'lee', name: 'Lee University', abbreviation: 'LU', logo: '🔴' },
    ],
  },
  // Texas
  {
    code: 'TX',
    name: 'Texas',
    flag: '🏴',
    mascot: '🐔', // Mockingbird
    schools: [
      { id: 'ut', name: 'University of Texas at Austin', abbreviation: 'UT', logo: '🔴' },
      { id: 'tamu', name: 'Texas A&M University', abbreviation: 'TAMU', logo: '🔴' },
      { id: 'baylor', name: 'Baylor University', abbreviation: 'BAYLOR', logo: '🟢' },
      { id: 'rice', name: 'Rice University', abbreviation: 'RICE', logo: '🦉' },
      { id: 'tcu', name: 'TCU', abbreviation: 'TCU', logo: '🟣' },
      { id: 'texas-tech', name: 'Texas Tech University', abbreviation: 'TTU', logo: '🔴' },
      { id: 'ut-dallas', name: 'UT Dallas', abbreviation: 'UTD', logo: '🔴' },
      { id: 'ut-arlington', name: 'UT Arlington', abbreviation: 'UTA', logo: '🔵' },
      { id: 'ut-san-antonio', name: 'UT San Antonio', abbreviation: 'UTSA', logo: '🔴' },
      { id: 'ut-el-paso', name: 'UT El Paso', abbreviation: 'UTEP', logo: '🟠' },
      { id: 'smu', name: 'Southern Methodist University', abbreviation: 'SMU', logo: '🔴' },
      { id: 'houston', name: 'University of Houston', abbreviation: 'UH', logo: '🔴' },
      { id: 'unt', name: 'University of North Texas', abbreviation: 'UNT', logo: '🟢' },
      { id: 'texas-state', name: 'Texas State University', abbreviation: 'TXST', logo: '🔴' },
      { id: 'sam-houston', name: 'Sam Houston State University', abbreviation: 'SHSU', logo: '🟠' },
      { id: 'texas-womans', name: 'Texas Woman\'s University', abbreviation: 'TWU', logo: '🟡' },
      { id: 'prairie-view', name: 'Prairie View A&M University', abbreviation: 'PVAMU', logo: '🟡' },
      { id: 'texas-southern', name: 'Texas Southern University', abbreviation: 'TSU', logo: '🔴' },
      { id: 'stephen-f-austin', name: 'Stephen F. Austin State University', abbreviation: 'SFA', logo: '🔴' },
      { id: 'lamar', name: 'Lamar University', abbreviation: 'LU', logo: '🔴' },
    ],
  },
  // Utah
  {
    code: 'UT',
    name: 'Utah',
    flag: '🏴',
    mascot: '🐝', // Honey Bee
    schools: [
      { id: 'byu', name: 'Brigham Young University', abbreviation: 'BYU', logo: '🔵' },
      { id: 'uofu', name: 'University of Utah', abbreviation: 'UU', logo: '🔴' },
      { id: 'utah-state', name: 'Utah State University', abbreviation: 'USU', logo: '🔵' },
      { id: 'weber-state', name: 'Weber State University', abbreviation: 'WSU', logo: '🟣' },
      { id: 'utah-valley', name: 'Utah Valley University', abbreviation: 'UVU', logo: '🟢' },
      { id: 'southern-utah', name: 'Southern Utah University', abbreviation: 'SUU', logo: '🔴' },
      { id: 'westminster-utah', name: 'Westminster College', abbreviation: 'WC', logo: '🟢' },
      { id: 'dixie-state', name: 'Dixie State University', abbreviation: 'DSU', logo: '🔴' },
    ],
  },
  // Vermont
  {
    code: 'VT',
    name: 'Vermont',
    flag: '🏴',
    mascot: '🦌', // Morgan Horse
    schools: [
      { id: 'uvm', name: 'University of Vermont', abbreviation: 'UVM', logo: '🟢' },
      { id: 'middlebury', name: 'Middlebury College', abbreviation: 'MC', logo: '🟡' },
      { id: 'bennington', name: 'Bennington College', abbreviation: 'BC', logo: '🟢' },
      { id: 'norwich', name: 'Norwich University', abbreviation: 'NU', logo: '🔴' },
      { id: 'champlain', name: 'Champlain College', abbreviation: 'CC', logo: '🔵' },
    ],
  },
  // Virginia
  {
    code: 'VA',
    name: 'Virginia',
    flag: '🏴',
    mascot: '🐔', // Cardinal
    schools: [
      { id: 'uva', name: 'University of Virginia', abbreviation: 'UVA', logo: '🟠' },
      { id: 'vtech', name: 'Virginia Tech', abbreviation: 'VT', logo: '🟠' },
      { id: 'wm', name: 'William & Mary', abbreviation: 'W&M', logo: '🟢' },
      { id: 'vcu', name: 'VCU', abbreviation: 'VCU', logo: '⚫' },
      { id: 'jmu', name: 'James Madison University', abbreviation: 'JMU', logo: '🟣' },
      { id: 'george-mason', name: 'George Mason University', abbreviation: 'GMU', logo: '🟢' },
      { id: 'virginia-commonwealth', name: 'Virginia Commonwealth University', abbreviation: 'VCU', logo: '⚫' },
      { id: 'radford', name: 'Radford University', abbreviation: 'RU', logo: '🔴' },
      { id: 'old-dominion', name: 'Old Dominion University', abbreviation: 'ODU', logo: '🔵' },
      { id: 'liberty', name: 'Liberty University', abbreviation: 'LU', logo: '🔴' },
      { id: 'regent', name: 'Regent University', abbreviation: 'RU', logo: '🔴' },
      { id: 'shenandoah', name: 'Shenandoah University', abbreviation: 'SU', logo: '🔴' },
      { id: 'university-of-richmond', name: 'University of Richmond', abbreviation: 'UR', logo: '🟢' },
      { id: 'washington-lee', name: 'Washington and Lee University', abbreviation: 'W&L', logo: '🔴' },
      { id: 'hampton-sydney', name: 'Hampden-Sydney College', abbreviation: 'HSC', logo: '🔴' },
      { id: 'roanoke', name: 'Roanoke College', abbreviation: 'RC', logo: '🔴' },
      { id: 'randolph-macon', name: 'Randolph-Macon College', abbreviation: 'RMC', logo: '🔴' },
      { id: 'virginia-wesleyan', name: 'Virginia Wesleyan University', abbreviation: 'VWU', logo: '🔵' },
      { id: 'longwood', name: 'Longwood University', abbreviation: 'LU', logo: '🔴' },
      { id: 'mary-washington', name: 'University of Mary Washington', abbreviation: 'UMW', logo: '🟢' },
    ],
  },
  // Washington
  {
    code: 'WA',
    name: 'Washington',
    flag: '🏴',
    mascot: '🦫', // Olympic Marmot
    schools: [
      { id: 'uw', name: 'University of Washington', abbreviation: 'UW', logo: '🟣' },
      { id: 'wsu', name: 'Washington State University', abbreviation: 'WSU', logo: '🔴' },
      { id: 'gonzaga', name: 'Gonzaga University', abbreviation: 'GU', logo: '🔴' },
      { id: 'seattle-u', name: 'Seattle University', abbreviation: 'SU', logo: '🔴' },
      { id: 'wwu', name: 'Western Washington University', abbreviation: 'WWU', logo: '🔵' },
      { id: 'ewu', name: 'Eastern Washington University', abbreviation: 'EWU', logo: '🔴' },
      { id: 'central-washington', name: 'Central Washington University', abbreviation: 'CWU', logo: '🔴' },
      { id: 'whitworth', name: 'Whitworth University', abbreviation: 'WU', logo: '🔴' },
      { id: 'pacific-lutheran', name: 'Pacific Lutheran University', abbreviation: 'PLU', logo: '🟡' },
      { id: 'walla-walla', name: 'Walla Walla University', abbreviation: 'WWU', logo: '🔵' },
    ],
  },
  // West Virginia
  {
    code: 'WV',
    name: 'West Virginia',
    flag: '🏴',
    mascot: '🐔', // Cardinal
    schools: [
      { id: 'wvu', name: 'West Virginia University', abbreviation: 'WVU', logo: '🔵' },
      { id: 'marshall', name: 'Marshall University', abbreviation: 'MU', logo: '🟢' },
      { id: 'shepherd', name: 'Shepherd University', abbreviation: 'SU', logo: '🔴' },
      { id: 'fairmont-state', name: 'Fairmont State University', abbreviation: 'FSU', logo: '🔴' },
      { id: 'west-liberty', name: 'West Liberty University', abbreviation: 'WLU', logo: '🔴' },
    ],
  },
  // Wisconsin
  {
    code: 'WI',
    name: 'Wisconsin',
    flag: '🏴',
    mascot: '🐄', // Dairy Cow
    schools: [
      { id: 'uw-madison', name: 'University of Wisconsin-Madison', abbreviation: 'UW', logo: '🔴' },
      { id: 'uw-milwaukee', name: 'UW-Milwaukee', abbreviation: 'UWM', logo: '🔵' },
      { id: 'marquette', name: 'Marquette University', abbreviation: 'MU', logo: '🔵' },
      { id: 'beloit', name: 'Beloit College', abbreviation: 'BC', logo: '🔴' },
      { id: 'lawrence', name: 'Lawrence University', abbreviation: 'LU', logo: '🔴' },
      { id: 'uw-eau-claire', name: 'UW-Eau Claire', abbreviation: 'UWEC', logo: '🔵' },
      { id: 'uw-la-crosse', name: 'UW-La Crosse', abbreviation: 'UWL', logo: '🔵' },
      { id: 'uw-oshkosh', name: 'UW-Oshkosh', abbreviation: 'UWO', logo: '🔵' },
      { id: 'uw-stevens-point', name: 'UW-Stevens Point', abbreviation: 'UWSP', logo: '🔵' },
      { id: 'uw-whitewater', name: 'UW-Whitewater', abbreviation: 'UWW', logo: '🔵' },
    ],
  },
  // Wyoming
  {
    code: 'WY',
    name: 'Wyoming',
    flag: '🏴',
    mascot: '🦬', // American Bison
    schools: [
      { id: 'uwyo', name: 'University of Wyoming', abbreviation: 'UW', logo: '🟤' },
      { id: 'wyoming-tech', name: 'Wyoming Technical Institute', abbreviation: 'WTI', logo: '🔧' },
    ],
  },
]

// Helper function to get state by code
export function getStateByCode(code: string): State | undefined {
  return STATES_AND_SCHOOLS.find((state) => state.code === code)
}

// Helper function to get all state codes
export function getAllStateCodes(): string[] {
  return STATES_AND_SCHOOLS.map((state) => state.code)
}
