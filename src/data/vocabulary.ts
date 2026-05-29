import { VocabularyWord } from '../types';

export const cybersecurityVocab: VocabularyWord[] = [
  // Web Security
  {
    id: 'web-1',
    category: 'Web Security',
    term: 'SQL Injection (SQLi)',
    pronunciationSpelled: '/ˌɛs.kjuːˈɛl ɪnˈdʒɛk.ʃən/',
    meaning: 'A vulnerability where malicious SQL statements are inserted into entry fields for execution (e.g. to bypass login or dump database data).',
    exampleSentence: 'We discovered a SQL injection vulnerability in the search bar of the customer billing portal.',
    clientFriendlyExplanation: 'Imagine an aggressive visitor handing your receptionist a form with hidden instructions that force them to unlock the private file room instead of just looking up a name.'
  },
  {
    id: 'web-2',
    category: 'Web Security',
    term: 'Cross-Site Scripting (XSS)',
    pronunciationSpelled: '/krɒs saɪt ˈskrɪp.tɪŋ/',
    meaning: 'A security vulnerability where an attacker injects malicious scripts into trusted websites, executing inside an innocent user\'s web browser.',
    exampleSentence: 'A stored XSS in the comments section allowed session tokens to be transmitted to an external listener.',
    clientFriendlyExplanation: 'Like someone sneaking a malicious sticky note onto a community bulletin board that tricks anyone who reads it into writing down and handing over their house keys.'
  },

  // Network Security
  {
    id: 'net-1',
    category: 'Network Security',
    term: 'Man-in-the-Middle (MITM)',
    pronunciationSpelled: '/mæn ɪn ðə ˈmɪd.əl/',
    meaning: 'An attack where the sender and receiver believe they are communicating directly, but the attacker secretly intercepts and alters the communication.',
    exampleSentence: 'Unencrypted public Wi-Fi networks are highly susceptible to Man-in-the-Middle eavesdropping.',
    clientFriendlyExplanation: 'Like a rogue mail carrier who quietly intercepts your letters, reads them, seals them back up, and delivers them without you ever realizing they were tampered with.'
  },
  {
    id: 'net-2',
    category: 'Network Security',
    term: 'Zero Trust Architecture',
    pronunciationSpelled: '/ˈzɪə.rəʊ trʌst ˈɑː.kɪ.tek.tʃər/',
    meaning: 'A security framework based on the premise of "never trust, always verify" where no user or device is trusted by default inside or outside the network.',
    exampleSentence: 'Moving to a Zero Trust architecture prevents lateral movement if an external workstation is compromised.',
    clientFriendlyExplanation: 'Instead of having one big gatekeeper at the front of a bank, you now require security badges, ID scans, and fingerprint checks at every single interior door and teller station.'
  },

  // Cloud Security
  {
    id: 'cloud-1',
    category: 'Cloud Security',
    term: 'Misconfiguration',
    pronunciationSpelled: '/ˌmɪs.kən.fɪɡ.jəˈreɪ.ʃən/',
    meaning: 'Incorrectly setting up security controls on cloud resources, leading to data exposure, unauthorized access, or regulatory non-compliance.',
    exampleSentence: 'The data breach resulted from an AWS S3 bucket misconfiguration set to public-read access.',
    clientFriendlyExplanation: 'Like renting a high-tech smart house but accidentally leaving the heavy security-hardened front door propped open with a brick.'
  },
  {
    id: 'cloud-2',
    category: 'Cloud Security',
    term: 'IAM Roles (Identity & Access Management)',
    pronunciationSpelled: '/ˌaɪ.eɪˈɛm rəʊlz/',
    meaning: 'A secure way to grant temporary, granular permissions to users, services, or applications in the cloud without sharing permanent keys.',
    exampleSentence: 'We need to lock down our cloud servers by assigning temporary IAM roles instead of hardcoded access credentials.',
    clientFriendlyExplanation: 'Instead of handing a keycard that gives access to the entire building, you give people a one-time digital token that opens only one specific desk drawer for exactly one hour.'
  },

  // Active Directory
  {
    id: 'ad-1',
    category: 'Active Directory',
    term: 'Kerberoasting',
    pronunciationSpelled: '/ˈkɜːr.bə.roʊst.ɪŋ/',
    meaning: 'A post-exploitation attack technique targeting Active Directory service accounts to extract Kerberos tickets and crack service account passwords offline.',
    exampleSentence: 'Enforcing strong outer password policies on service accounts mitigates the threat of Kerberoasting.',
    clientFriendlyExplanation: 'An intruder legally requests a sealed, encrypted ticket to a VIP party, then takes it back to their hideout to test millions of master keys on it offline until they figure out the passcode.'
  },
  {
    id: 'ad-2',
    category: 'Active Directory',
    term: 'Privilege Escalation',
    pronunciationSpelled: '/ˈprɪv.əl.ɪdʒ ˌes.kəˈleɪ.ʃən/',
    meaning: 'The act of exploiting a bug or configuration error to gain elevated access to resources that are normally protected from an application or user.',
    exampleSentence: 'The local user exploited a vulnerable print driver to achieve domain admin privilege escalation.',
    clientFriendlyExplanation: 'Like booking a standard economy air ticket, but finding a seating loophole that tricks the flight computer into upgrading you to pilot privileges.'
  },

  // API Security
  {
    id: 'api-1',
    category: 'API Security',
    term: 'BOLA (Broken Object Level Authorization)',
    pronunciationSpelled: '/ˈboʊ.lə/',
    meaning: 'A vulnerability where a user can manipulate a direct resource identifier (like an ID number) in an API request to access someone else\'s restricted records.',
    exampleSentence: 'By changing user_id in the API endpoint from 101 to 102, we could download account statements of other customers.',
    clientFriendlyExplanation: 'Like a coat check clerk giving you someone else\'s coat just because you changed the coat claim ticket number manually from 15 to 16.'
  },

  // Malware Analysis
  {
    id: 'mal-1',
    category: 'Malware Analysis',
    term: 'Ransomware',
    pronunciationSpelled: '/ˈræn.səm.weər/',
    meaning: 'Malicious software designed to block access to a computer system or files by encryption until a sum of money is paid to the attacker.',
    exampleSentence: 'Our incident response team stopped the ransomware outbreak before it could encrypt the high-availability servers.',
    clientFriendlyExplanation: 'Like a digital burglar who locks all your private photo albums, family files, and taxes in an unbreakable safe and demands cash for the combination.'
  },

  // Threat Hunting
  {
    id: 'threat-1',
    category: 'Threat Hunting',
    term: 'Indicators of Compromise (IoCs)',
    pronunciationSpelled: '/ˈɪn.dɪ.keɪ.tərz əv ˈkɒm.prə.maɪz/',
    meaning: 'Evidence or digital remnants (hashes, IP addresses, registry changes) indicating that a system has been successfully breached.',
    exampleSentence: 'We updated our threat hunting system with the newly released IoCs for the SolarWinds backdoor.',
    clientFriendlyExplanation: 'The digital equivalent of muddy footprints, a broken window latch, and a discarded crowbar left behind after a home break-in.'
  },

  // Compliance and GRC
  {
    id: 'com-1',
    category: 'Compliance and GRC',
    term: 'SOC 2 Compliance',
    pronunciationSpelled: '/sɒk tuː kəmˈplaɪ.əns/',
    meaning: 'An auditing procedure that ensures a service provider securely manages data to protect the organization\'s interests and the privacy of its clients.',
    exampleSentence: 'Our enterprise clients require a SOC 2 Type II report before we can sign a vendor contract.',
    clientFriendlyExplanation: 'A rigorous background check and regular inspection from building authorities confirming that your digital security locks, cameras, and fire exits are fully functional and tested daily.'
  },

  // Incident Response
  {
    id: 'ir-1',
    category: 'Incident Response',
    term: 'Containment Phrase',
    pronunciationSpelled: '/kənˈteɪn.mənt feɪz/',
    meaning: 'The portion of an incident action plan focused on isolating compromised host devices or segments to prevent the threat from spreading.',
    exampleSentence: 'We initiated the network containment phase immediately by segmenting the infected domain control tier.',
    clientFriendlyExplanation: 'Instantly shutting down the fireproof vault doors in a botanical lab to trap a biohazard leak inside a single room so it doesn\'t contaminate the entire facility.'
  },

  // Red Team Operations
  {
    id: 'red-1',
    category: 'Red Team Operations',
    term: 'Social Engineering',
    pronunciationSpelled: '/ˈsəʊ.ʃəl ˌen.dʒɪˈnɪə.rɪŋ/',
    meaning: 'The use of deception to manipulate individuals into divulging confidential information or performing actions that compromise security.',
    exampleSentence: 'The Red Team gained physical access to the server room through targeted social engineering at the reception desk.',
    clientFriendlyExplanation: 'Using charm, trust, or urgency to trick someone into opening a heavy vault door rather than spending years trying to crack the digital combination.'
  }
];
