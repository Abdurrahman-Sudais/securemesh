// Synthetic security findings for the triage-console prototype. Accounts, resources and identities are invented;
// IP addresses come from the documentation ranges (203.0.113.0/24, 198.51.100.0/24) reserved for examples.

export const ORG = {name: 'Northwind SaaS (synthetic)', window: 'Last 24 hours'};
export const hhmm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** How much each asset matters to the business (1 low – 3 critical). */
export const assets = {
  'prod-payments-api': {crit: 3, env: 'production', owner: 'Payments'},
  'prod-db-cluster': {crit: 3, env: 'production', owner: 'Platform'},
  'iam-user/deploy-bot': {crit: 3, env: 'production', owner: 'Platform'},
  'root-account': {crit: 3, env: 'all', owner: 'Security'},
  's3/marketing-assets': {crit: 1, env: 'production', owner: 'Marketing'},
  's3/customer-exports': {crit: 3, env: 'production', owner: 'Data'},
  'staging-web-01': {crit: 1, env: 'staging', owner: 'Web'},
  'build-runner-07': {crit: 2, env: 'tooling', owner: 'Platform'},
  'iam-user/amaka.o': {crit: 2, env: 'all', owner: 'Engineering'},
};

// [id, minute of day, source, type, resource, severity (0–10), confidence (0–1), actor, detail]
const F = (id, t, source, type, resource, severity, confidence, actor, detail) => ({id, t, source, type, resource, severity, confidence, actor, detail});
export const findings = [
  F('F01', 125, 'GuardDuty', 'Console login from an unusual location', 'iam-user/deploy-bot', 7.2, 0.8, '203.0.113.45', 'Successful console sign-in for a service user that normally only uses access keys.'),
  F('F02', 131, 'GuardDuty', 'API calls from an unusual network', 'iam-user/deploy-bot', 6.8, 0.75, '203.0.113.45', 'ListBuckets and GetObject calls from an autonomous system never seen for this identity.'),
  F('F03', 138, 'Security Hub', 'Bucket policy allows public read', 's3/customer-exports', 8.4, 0.95, 'iam-user/deploy-bot', 'Bucket policy changed to allow s3:GetObject for any principal.'),
  F('F04', 140, 'CloudWatch', 'Spike in S3 GetObject requests', 's3/customer-exports', 5.5, 0.7, '203.0.113.45', '4,812 GetObject requests in 6 minutes, 40× the usual rate.'),
  F('F05', 300, 'GuardDuty', 'Port probe on an exposed port', 'staging-web-01', 2.0, 0.9, '198.51.100.23', 'Unsolicited connection attempts on TCP 22 from an internet scanner.'),
  F('F06', 302, 'GuardDuty', 'Port probe on an exposed port', 'staging-web-01', 2.0, 0.9, '198.51.100.24', 'Unsolicited connection attempts on TCP 3389 from an internet scanner.'),
  F('F07', 310, 'Security Hub', 'Security group allows SSH from anywhere', 'staging-web-01', 4.0, 0.95, 'iam-user/amaka.o', 'Inbound 0.0.0.0/0 on port 22.'),
  F('F08', 520, 'GuardDuty', 'DNS requests to a crypto-mining domain', 'build-runner-07', 6.0, 0.85, 'build-runner-07', 'Instance resolved a domain associated with cryptocurrency mining pools.'),
  F('F09', 522, 'CloudWatch', 'CPU at 100% for 40 minutes', 'build-runner-07', 3.5, 0.6, 'build-runner-07', 'Sustained full CPU outside any scheduled build.'),
  F('F10', 610, 'Security Hub', 'Root account used', 'root-account', 8.0, 0.9, 'root-account', 'Root user signed in and created an access key.'),
  F('F11', 615, 'Security Hub', 'MFA not enabled for root', 'root-account', 5.0, 1.0, 'root-account', 'Control check failed: root account without MFA.'),
  F('F12', 700, 'Security Hub', 'Bucket policy allows public read', 's3/marketing-assets', 3.0, 0.95, 'iam-user/amaka.o', 'Public read on a bucket tagged as website assets.'),
  F('F13', 820, 'GuardDuty', 'Unusual database login failures', 'prod-db-cluster', 5.8, 0.7, '198.51.100.77', '38 failed logins in 5 minutes from a single address.'),
  F('F14', 822, 'GuardDuty', 'Unusual database login failures', 'prod-db-cluster', 5.8, 0.7, '198.51.100.77', 'Another 41 failed logins from the same address.'),
  F('F15', 960, 'Security Hub', 'TLS certificate expires in 7 days', 'prod-payments-api', 3.0, 1.0, 'prod-payments-api', 'Certificate for the payments API expires soon.'),
  F('F16', 1010, 'GuardDuty', 'Port probe on an exposed port', 'staging-web-01', 2.0, 0.9, '198.51.100.90', 'Unsolicited connection attempts on TCP 22.'),
];

export const roles = [
  {id: 'analyst', label: 'Security Analyst', can: ['triage', 'case']},
  {id: 'lead', label: 'SOC Lead', can: ['triage', 'case', 'close', 'export']},
  {id: 'ciso', label: 'CISO', can: ['export']},
  {id: 'auditor', label: 'Auditor', can: []},
];
export const people = {analyst: 'Tolu Bankole', lead: 'Ngozi Udeh', ciso: 'Chidi Eze', auditor: 'External auditor'};
