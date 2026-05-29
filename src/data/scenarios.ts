import { ConversationScenario, DailyChallenge } from '../types';

export const practiceScenarios: ConversationScenario[] = [
  // --- Conversations & Roleplays ---
  {
    id: 'sim-1',
    category: 'simulator',
    title: 'Incident Response Emergency',
    clientRole: 'Frantic VP of Infrastructure',
    description: 'A ransomware threat has compromised a database server. You have to explain which servers should be contained, reassure the executive, and obtain approval for segregation under high pressure.',
    initialMessage: 'Our entire logistics hub is halted. The screen says "Locked". Can we just restore from backup and not tell anyone? I don\'t want to isolate the segment, the business is losing $10,000 every minute we are down!',
    objectives: [
      'De-escalate client panic and establish authority',
      'Explain the danger of ransom transmission (lateral movement) clearly',
      'Present a containment strategy (segmentation/isolation of critical nodes)',
      'Confirm backing up unaffected systems before offline triage'
    ],
    guidanceDocs: 'Use phrases like: "I understand the extreme urgency...", "To prevent further lateral spread...", "We must immediately isolate...". Keep technical jargon minimal.'
  },
  {
    id: 'sim-2',
    category: 'simulator',
    title: 'GRC compliance Audit',
    clientRole: 'Strict Lead Auditor',
    description: 'During a compliance auditing mock session, the external regulatory auditor doubts the validity of your organization\'s key management procedures.',
    initialMessage: 'I notice your team has cloud servers in AWS. How do you guarantee to me that database credentials aren\'t committed into Git or shared insecurely among the developers? What auditing proofs do you have?',
    objectives: [
      'Explain AWS IAM roles or secrets manager setups professionally',
      'Mention secret-scanning measures in CI/CD chains (e.g. GitLeaks)',
      'Reference SOC 2 compliance reports or security telemetry logs',
      'Avoid defensive vocabulary and stay factual'
    ],
    guidanceDocs: 'Recommend phrases like: "We utilize AWS Secrets Manager with automatic credential rotation...", "We have established preventive gates in our pipeline..."'
  },
  {
    id: 'sim-3',
    category: 'simulator',
    title: 'Salary & Budget Negotiation',
    clientRole: 'CISO / Purchasing Director',
    description: 'You are presenting a business case for a security tools budget upgrade or pitching your freelance pentesting rate increment against their objections.',
    initialMessage: 'Look, your service is great, but we don\'t have the funds to increase your scoping budget or buy premium licenses. Why can\'t you just use free tools like Nmap and OpenVAS instead of commercial toolkits?',
    objectives: [
      'Elaborate difference between simple automated port scanning and specialized custom manual exploits',
      'Link secure tool investments directly to business risks and enterprise integrity',
      'Pivot from a cost dialogue to a risk-avoidance value dialogue',
      'Define expected ROI (e.g., preventing a multi-million dollar regulatory breach)'
    ],
    guidanceDocs: 'Emphasize: "While automated tools are excellent for open ports, custom penetration testing is necessary to exploit logical business flows...", "Investing in specialized security measures prevents..."'
  },
  {
    id: 'sim-4',
    category: 'simulator',
    title: 'Web Application Scope Discussion',
    clientRole: 'Skeptical Product Manager',
    description: 'An incoming client is asking to scope a penetration test. They want to exclusion-list their database server from active scans because "it\'s already behind a firewall."',
    initialMessage: 'We want the pentest done in three days, but let\'s skip the backend database testing. We already have a primary firewall, and besides, we don\'t want any downtime during working hours.',
    objectives: [
      'Explain the concept of firewall bypass via application-layer weaknesses (such as SQLi or API design flaws)',
      'Offer alternative non-disruptive testing schedules (e.g. overnight testing)',
      'Discuss the critical importance of a complete, accurate attack-surface analysis'
    ],
    guidanceDocs: 'Suggest: "While firewalls block network-level intrusions, application-layer flaws such as SQL Injection bypass those gates completely..."'
  },

  // --- Scenario-Based Learning ---
  {
    id: 'scen-1',
    category: 'scenario',
    title: 'Explaining SQL Injection to non-technical CEO',
    clientRole: 'Non-Technical CEO',
    description: 'You have found a Critical SQL Injection vulnerability in the core database backend. You must explain what it is and why it requires immediate fixes without getting lost in technical terms.',
    initialMessage: 'I saw your security report. What on earth is SQL Injection? It sounds like some medical terms. Is it really critical enough to delay our public product release today?',
    objectives: [
      'Explain the concept using an analogy (receptionist, bank teller, form tampering)',
      'Detail the business impact directly (unauthorized access to private core customer data)',
      'Formulate a confident recommendations roadmap for code patching (input validation/parameterized queries)'
    ],
    guidanceDocs: 'Avoid talking about: "SELECT * FROM users WHERE ID=...". Stick to the physical analogy.'
  },
  {
    id: 'scen-2',
    category: 'scenario',
    title: 'Handling Angry Client After a False Positive Alert',
    clientRole: 'Stressed Dev Lead',
    description: 'A developer is furious because your security scanner flagged an internal testing library as a critical Trojan horse, halting their entire automated container deployment pipeline.',
    initialMessage: 'Your stupid scanner flagged a mock database dependency as malware! The entire development team has been blocked for four hours, and we missed our production release target today. This is obviously a false positive, what are you going to do about it?!',
    objectives: [
      'Acknowledge client frustration with empathy',
      'Explain step-by-step why the signature matching was triggered (e.g. testing keys/scripts left in code)',
      'Outline an immediate mitigation path (allowing rule exceptions or refactoring the test code)',
      'Propose a cooperative joint review process'
    ],
    guidanceDocs: 'Utilize active listening: "I completely understand the frustration that this delay has caused...", "To avoid similar blocks in the future, we should..."'
  },
  {
    id: 'scen-3',
    category: 'scenario',
    title: 'Convincing a Client to Patch Legacy Systems',
    clientRole: 'Traditional IT Director',
    description: 'You found an old, unpatched Windows Server in active directory running legacy accounting services. The IT Director refuses to patch it because "it has worked fine for 15 years."',
    initialMessage: 'Yes, I know that Server 2008 has bugs. But it is internal only, and it has our old tracking software. Patching it might break the ledger, and we can\'t afford that. Why is this a concern?',
    objectives: [
      'Demonstrate how internal attackers or lateral pivots happen',
      'Detail the compromise risk (Active Directory domain-wide takeover)',
      'Propose intermediate mitigation pathways (microsegmentation, restricted VLANs, offline archiving)'
    ],
    guidanceDocs: 'Use phrases: "Even though the server is interior-facing, once any single network device is breached...", "We can coordinate a safe sandbox environment to test the patch..."'
  },

  // --- Interview Questioning ---
  {
    id: 'int-1',
    category: 'interview',
    title: 'Lead PenTester Interview',
    clientRole: 'Technical PenTest Director',
    description: 'Simulate a job interview for a senior pen-testing role. Prepare to explain your methodology when encountering unfamiliar systems.',
    initialMessage: 'Excellent resume. Can you explain your end-to-end technical methodology when performing a black-box web application penetration test? What are your starting steps, and how do you document your findings?',
    objectives: [
      'Outline reconnaissance steps logically (passive recon, subdomain enum, port mapping)',
      'Describe vulnerability identification and logical exploitation flows safely',
      'Emphasize the paramount importance of strict scope adherence and professional documentation',
      'Explain how you rate threat levels using standard CVE classifications or CVSS matrices'
    ],
    guidanceDocs: 'Maintain structured delivery: "My methodology begins with systemic reconnaissance...", "I prioritize mapping out logical application structures before launching targeted exploit steps."'
  },
  {
    id: 'int-2',
    category: 'interview',
    title: 'SOC Analyst Assessment',
    clientRole: 'SOC Manager',
    description: 'Practice responding securely in a fast-paced Security Operations Center interview setting.',
    initialMessage: 'If you see an unusual SPIKE in outbound data transfers on a domain controller on a weekend, what are your immediate triage phases, and how do you distinguish an actual incident from safe, pre-scheduled backup cronjobs?',
    objectives: [
      'Reference log baseline values and credential validation checks',
      'Explain host quarantine procedures or logging correlations',
      'Highlight crosschecking operational runbooks and contacting the administrative owner'
    ],
    guidanceDocs: 'Speak clearly: "First, I would baseline the logs to inspect matching users...", "I would verify if any backup change requests were logged in Jira..."'
  },

  // --- Freelance Scenarios ---
  {
    id: 'free-1',
    category: 'freelance',
    title: 'First Discovery scoping Call',
    clientRole: 'Potential Corporate Client',
    description: 'Practice taking control of a scoping talk with a prospective small business client who wants "a quick security check" but has no formal parameters, threat models, or clear budget set.',
    initialMessage: 'Hi, we are starting a small online banking portal and we want you to just \'look at it\' to make sure hackers can\'t break in. We have a tiny budget, how much do you charge for a security evaluation?',
    objectives: [
      'Formulate questions to outline scoping criteria (number of endpoints, APIs, third-party integrations)',
      'Explain why a professional pentest is scoped by complex workloads, not flat rates',
      'Educate client on the legal compliance benefits of getting certified test structures'
    ],
    guidanceDocs: 'Guide conversations with confidence: "Before we can offer pricing, we should outline the specific landscape...", "To ensure the safety of your portal, I suggest scheduling a technical inventory session..."'
  }
];

export const dailyChallenges: DailyChallenge[] = [
  {
    id: 'challenge-1',
    title: 'The 1-Minute Pitch: Explain MFA Bypass',
    prompt: 'Record a speech under 60 seconds explaining how an attacker could bypass multi-factor authentication using session hijacking or phishing prompts to a client who thinks MFA makes them completely bulletproof.',
    challengeType: 'pitch',
    xpReward: 120
  },
  {
    id: 'challenge-2',
    title: 'The Bad News Briefing: Data Leak',
    prompt: 'You have verified that a database leak exposing employee emails has occurred via an open API. Explain this to the CTO confidently, detailing the immediate containment step and next threat hunting checklist.',
    challengeType: 'summarize',
    xpReward: 150
  },
  {
    id: 'challenge-3',
    title: 'Objection Handling: Pentest Prerequisite',
    prompt: 'A client maintains they do not need source-code Audits because they trust their cloud provider\'s security. Counter this argument with a concise, persuasive explanation relating to custom code flaws.',
    challengeType: 'negotiate',
    xpReward: 180
  }
];
