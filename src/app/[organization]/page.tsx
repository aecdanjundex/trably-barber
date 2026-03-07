import { cache } from "react";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { organization } from "@/db/schema";
import { BookingPage } from "./_components/booking-page";

interface Props {
  params: Promise<{ organization: string }>;
}

const getOrganization = cache(async (slug: string) => {
  const rows = await db
    .select({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo,
    })
    .from(organization)
    .where(eq(organization.slug, slug))
    .limit(1);

  return rows[0] ?? null;
});

export async function generateMetadata({ params }: Props) {
  const { organization: slug } = await params;
  const org = await getOrganization(slug);

  return {
    title: org ? `${org.name} — Agendamento` : "Agendamento",
  };
}

export default async function OrganizationPage({ params }: Props) {
  const { organization: slug } = await params;
  const org = await getOrganization(slug);

  if (!org) notFound();

  return <BookingPage org={org} />;
}
