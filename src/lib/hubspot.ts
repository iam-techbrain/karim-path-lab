export interface HubSpotBookingPayload {
  refCode: string;
  fullName: string;
  mobile: string;
  testType: string;
  prefDate: string;
  timeSlot: string;
  address: string;
  price: number;
  originalPrice: number;
}

/**
 * Sends booking contact lead to HubSpot CRM
 * Supports either:
 * 1. HubSpot Private App Access Token (CRM Objects API)
 * 2. HubSpot Form Submission API (Portal ID + Form ID)
 */
export async function sendBookingToHubSpot(payload: HubSpotBookingPayload) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;

  // Split name into first and last name
  const nameParts = payload.fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || payload.fullName;
  const lastName = nameParts.slice(1).join(" ") || "";

  const bookingSummary = `Ref: ${payload.refCode} | Test: ${payload.testType} | Date: ${payload.prefDate} (${payload.timeSlot}) | Fee: ₹${payload.price} (Saved ₹${payload.originalPrice - payload.price})`;

  // 1. Method A: HubSpot CRM Contacts API (Private App Token)
  if (token) {
    try {
      const response = await fetch(
        "https://api.hubapi.com/crm/v3/objects/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            properties: {
              firstname: firstName,
              lastname: lastName,
              phone: payload.mobile,
              address: payload.address,
              city: "Patna",
              state: "Bihar",
              message: bookingSummary,
              hs_lead_status: "NEW",
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // If contact already exists (409 Conflict), update existing contact record
        if (response.status === 409 && data?.message) {
          const match = data.message.match(/Existing ID: (\d+)/);
          if (match && match[1]) {
            const existingId = match[1];
            await fetch(
              `https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  properties: {
                    firstname: firstName,
                    lastname: lastName,
                    address: payload.address,
                    message: bookingSummary,
                  },
                }),
              }
            );
            return {
              success: true,
              contactId: existingId,
              method: "crm_api_updated",
            };
          }
        }

        console.warn("HubSpot API Error:", data);
        return { success: false, error: data };
      }

      return { success: true, contactId: data.id, method: "crm_api" };
    } catch (err: any) {
      console.error("HubSpot Contact Creation Failed:", err);
      return { success: false, error: err.message };
    }
  }

  // 2. Method B: HubSpot Form Submission API (Alternative)
  if (portalId && formId) {
    try {
      const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: firstName },
            { name: "lastname", value: lastName },
            { name: "phone", value: payload.mobile },
            { name: "address", value: payload.address },
            { name: "city", value: "Patna" },
            { name: "message", value: bookingSummary },
          ],
        }),
      });

      const data = await response.json();
      return { success: true, result: data, method: "form_api" };
    } catch (err: any) {
      console.error("HubSpot Form API Failed:", err);
      return { success: false, error: err.message };
    }
  }

  return {
    success: true,
    message: "Lead processed locally.",
    method: "local_lead",
  };
}
