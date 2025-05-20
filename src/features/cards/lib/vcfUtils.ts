import type { VCardData } from "../types/card.types";

export function generateVcfContent(vcard: Partial<VCardData>): string {
  let vcfString = "BEGIN:VCARD\nVERSION:3.0\n";


  const lastName = vcard.lastName || "";
  const firstName = vcard.firstName || "";
  if (firstName || lastName) {
    vcfString += `N:${lastName};${firstName};;;\n`;
    vcfString += `FN:${firstName} ${lastName}\n`;
  } else {
    vcfString += "FN:Unnamed Contact\n"; // default
  }

  if (vcard.organization) {
    vcfString += `ORG:${vcard.organization}\n`;
  }
  if (vcard.title) {
    vcfString += `TITLE:${vcard.title}\n`;
  }

  // Telefonlar
  if (vcard.phoneWork) {
    vcfString += `TEL;TYPE=WORK,VOICE:${vcard.phoneWork}\n`;
  }
  if (vcard.phoneMobile) {
    vcfString += `TEL;TYPE=CELL,VOICE:${vcard.phoneMobile}\n`;
  }

  // E-posta
  if (vcard.email) {
    vcfString += `EMAIL:${vcard.email}\n`;
  }

  // Web sitesi
  if (vcard.website) {
    vcfString += `URL:${vcard.website}\n`;
  }
  

  // ADR;TYPE=HOME:;;123 Main St;Springfield;IL;12345;USA
  const street = vcard.addressStreet || "";
  const city = vcard.addressCity || "";
  const region = vcard.addressRegion || "";
  const postalCode = vcard.addressPostalCode || "";
  const country = vcard.addressCountry || "";
  if (street || city || region || postalCode || country) {
      vcfString += `ADR;TYPE=WORK:;;${street};${city};${region};${postalCode};${country}\n`;
  }

  // Not
  if (vcard.note) {
    vcfString += `NOTE:${vcard.note}\n`;
  }

  vcfString += "END:VCARD";
  return vcfString;
}

export function downloadVcfFile(vcfContent: string, filename: string = "contact.vcf") {
  const blob = new Blob([vcfContent], { type: "text/vcard;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 