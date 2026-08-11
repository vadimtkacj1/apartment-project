import { owners, team } from '@/app/(public)/about/aboutData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

// "050-549-6626" -> "+972505496626" (E.164). Returns undefined for empty input.
function toE164(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  return digits.startsWith('0') ? `+972${digits.slice(1)}` : `+972${digits}`;
}

interface PersonInput {
  id: string;
  name: string;
  jobTitle?: string;
  image?: string;
  phone?: string;
  email?: string;
  license?: string;
  description?: string;
}

// Emits one Person node per real, named agency principal/agent — the strongest
// "who is behind this site" E-E-A-T signal. Every optional field is gated on real
// data (no fabricated bios, phones, or license numbers), and each Person is linked
// to the agency entity via worksFor -> #organization.
export default function PersonSchema() {
  const people: PersonInput[] = [
    ...owners.map((o) => ({
      id: `owner-${o.id}`,
      name: o.name,
      jobTitle: o.title,
      image: o.image,
      phone: o.phone,
      email: o.email,
      license: o.licenceNumber,
      description: o.description,
    })),
    ...team.map((t) => ({
      id: `team-${t.id}`,
      name: t.name,
      jobTitle: t.role,
      image: t.image,
      phone: t.phone || t.mobile,
      email: t.email,
      license: (t as { licenceNumber?: string }).licenceNumber,
      description: t.description,
    })),
  ];

  const persons = people
    .filter((p) => p.name && p.name.trim().length > 0)
    .map((p) => {
      const tel = toE164(p.phone);
      return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${siteUrl}/about#${p.id}`,
        name: p.name,
        ...(p.jobTitle ? { jobTitle: p.jobTitle } : {}),
        worksFor: { '@id': `${siteUrl}/#organization` },
        url: `${siteUrl}/about`,
        ...(p.image ? { image: `${siteUrl}${p.image}` } : {}),
        ...(tel ? { telephone: tel } : {}),
        ...(p.email ? { email: p.email } : {}),
        ...(p.description ? { description: p.description } : {}),
        ...(p.license
          ? {
              hasCredential: {
                '@type': 'EducationalOccupationalCredential',
                credentialCategory: 'Real Estate License',
                identifier: p.license,
              },
            }
          : {}),
      };
    });

  return (
    <>
      {persons.map((person) => (
        <script
          key={person['@id']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      ))}
    </>
  );
}
