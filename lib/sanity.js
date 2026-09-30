const SANITY_PROJECT_ID = "cn5i08ux";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2025-08-15";

const CLOUDINARY_ASSET_FIELDS = `
  _key,
  _type,
  _version,
  id,
  public_id,
  resource_type,
  type,
  format,
  version,
  url,
  secure_url,
  width,
  height,
  bytes,
  created_at,
  display_name,
  asset_folder,
  tags
`;

export const HOME_PAGE_QUERY = `{
  "landingPage": *[_id == "landingPage" && _type == "landingPage"][0]{
    _id,
    _type,
    seo {
      title,
      description,
      socialImage {${CLOUDINARY_ASSET_FIELDS}},
      socialImageAlt
    },
    hero {
      eyebrow,
      headingLine1,
      headingLine2,
      headingLine3,
      intro,
      ctaLabel,
      supportingCopy,
      backgroundMedia {${CLOUDINARY_ASSET_FIELDS}},
      backgroundMediaAlt,
      proofItems[] {_key, text}
    },
    trustedClients {
      eyebrow,
      clients[] {_key, name, accessibleLabel, logo {${CLOUDINARY_ASSET_FIELDS}}}
    },
    productShowcase {
      eyebrow,
      heading,
      intro,
      products[] {_key, title, description, image {${CLOUDINARY_ASSET_FIELDS}}, imageAlt},
      consultationEyebrow,
      consultationHeading,
      consultationBody,
      consultationCtaLabel
    },
    saunaQuality {
      eyebrow,
      heading,
      intro,
      desktopCopy,
      mobileCopy,
      summary,
      primaryImage {${CLOUDINARY_ASSET_FIELDS}},
      primaryImageAlt,
      comparisonImage {${CLOUDINARY_ASSET_FIELDS}},
      comparisonImageAlt,
      technicalDetails[] {_key, title, label, mobileTitle, body}
    },
    iceBathQuality {
      eyebrow,
      heading,
      intro,
      summary,
      mobileImage {${CLOUDINARY_ASSET_FIELDS}},
      mobileImageAlt,
      desktopVideo {${CLOUDINARY_ASSET_FIELDS}},
      desktopVideoAlt,
      technicalDetails[] {_key, title, label, mobileTitle, body},
      bridgeCopy,
      ctaLabel
    },
    process {
      eyebrow,
      heading,
      intro,
      steps[] {_key, label, title, body, image {${CLOUDINARY_ASSET_FIELDS}}, imageAlt}
    },
    projects {
      eyebrow,
      heading,
      intro,
      projects[] {_key, image {${CLOUDINARY_ASSET_FIELDS}}, imageAlt}
    },
    consultation {
      eyebrow,
      heading,
      intro,
      checklist[] {_key, text},
      image {${CLOUDINARY_ASSET_FIELDS}},
      imageAlt,
      formHeading,
      nameLabel,
      namePlaceholder,
      whatsAppLabel,
      whatsAppPlaceholder,
      propertyTypeLabel,
      propertyTypePlaceholder,
      locationLabel,
      locationPlaceholder,
      interestsLabel,
      timelineLabel,
      requestTypeLabel,
      termsCopy,
      marketingConsentCopy,
      closingCopy,
      submitLabel,
      submittingLabel,
      successMessage,
      errorMessage
    },
    faq {
      eyebrow,
      heading,
      intro,
      faqs[] {_key, question, answer},
      ctaLabel
    },
    finalCta {
      eyebrow,
      heading,
      ctaLabel,
      primaryImage {${CLOUDINARY_ASSET_FIELDS}},
      primaryImageAlt,
      secondaryImage {${CLOUDINARY_ASSET_FIELDS}},
      secondaryImageAlt
    }
  },
  "siteSettings": *[_id == "siteSettings" && _type == "siteSettings"][0]{
    _id,
    _type,
    siteName,
    defaultSeoTitle,
    defaultSeoDescription,
    defaultSocialImage {${CLOUDINARY_ASSET_FIELDS}},
    defaultSocialImageAlt,
    headerLogo {${CLOUDINARY_ASSET_FIELDS}},
    headerLogoAlt,
    headerCtaLabel,
    footerDescription,
    footerGroups[] {_key, label, items[] {_key, text}},
    mobileBookingLabel,
    mobileBookingCtaLabel,
    copyrightText,
    originText
  }
}`;

export async function getHomePageContent() {
  const url = new URL(
    `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`,
  );
  url.searchParams.set("query", HOME_PAGE_QUERY);

  const response = await fetch(url, {next: {revalidate: 60}});

  if (!response.ok) {
    throw new Error(`Sanity home page query failed with HTTP ${response.status}.`);
  }

  const {result} = await response.json();

  if (result?.landingPage?._id !== "landingPage" || result?.siteSettings?._id !== "siteSettings") {
    throw new Error("Sanity singleton content is missing or invalid.");
  }

  return result;
}
