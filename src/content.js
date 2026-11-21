// SecureMesh — site facts used by the pages, the prerender step and the tests.
// A proposed product: features, integrations and AWS services are planned until implemented and verified.
const site = {
  name: 'SecureMesh',
  slug: 'securemesh',
  tagline: 'Security alerts that deserve attention.',
  about: 'SecureMesh is a proposed defensive security monitoring platform that would help security teams consolidate authorised security findings, prioritise alerts and understand potential incidents. Analysts review every summary and decide every response.',
  url: 'https://securemesh.space',
  email: 'david@securemesh.space',
  team: [
    {name: 'David Emeka', role: 'Founder', initials: 'DE', bio: 'David founded SecureMesh after seeing security teams lose real incidents in a flood of duplicate, unexplained alerts. David leads product, customers and every pilot, with a focus on read-only, analyst-first tooling.', focus: ['Product', 'Alert triage', 'Customer pilots']},
    {name: "Aisha Garba", role: "Co-founder", initials: "AG", bio: "Aisha leads customer success at SecureMesh: onboarding security teams and managed service providers, shaping the analyst triage workflow and turning analyst feedback into product changes.", focus: ["Security operations", "Pilot onboarding", "Analyst workflow"]},
    {name: "Femi Adeyinka", role: "CTO", initials: "FA", bio: "Femi leads engineering: read-only ingestion of authorised findings, correlation and priority scoring, evidence summaries, case management and the AWS platform it runs on.", focus: ["Platform architecture", "Detection and correlation", "AWS infrastructure"]},
  ],
  app: {
    title: 'Triage console',
    subtitle: 'Sixteen synthetic findings from GuardDuty, Security Hub and CloudWatch, correlated into incidents with transparent priority scores, draft evidence summaries, cases and an audit trail.',
  },
};
export default site;
