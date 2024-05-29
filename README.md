## Bitespeed Assignment: Identity Reconciliation

### Introduction

FluxKart.com, committed to offering personalized customer experiences, has integrated Bitespeed into their platform. Bitespeed needs to identify and track customer identities across multiple purchases made with varying contact information. This project aims to address the challenge of linking different orders made with different contact details to the same customer.

### Requirements

Design a web service with an endpoint `/identify` to receive HTTP POST requests with a JSON body:

```json
{
  "email"?: string,
  "phoneNumber"?: number
}
```

The service should return an HTTP 200 response with a JSON payload containing consolidated contact information:

```json
{
  "contact": {
    "primaryContactId": number,
    "emails": string[], // First element is the email of the primary contact
    "phoneNumbers": string[], // First element is the phone number of the primary contact
    "secondaryContactIds": number[] // Array of all secondary contact IDs
  }
}
```

#### Instructions

1. Ensure orders always have either an email or phone number in the checkout event.
2. Link contact rows if they have either email or phone as common.
3. Create a new primary contact if no existing contacts match the incoming request.
4. Create secondary contacts if the request has either email or phone common to an existing contact but contains new information.

### Stack

- **Database:** PostgreSQL
- **Backend:** Node.js, Express, TypeScript, Sequelize

### Hosting and Endpoint

- **Hosted Endpoint:** <https://bitespeed-assignment-c3nx.onrender.com>
- **Identify Route:** <https://bitespeed-assignment-c3nx.onrender.com/identify>

### Contact Information

For any queries or issues, please contact me at <sarkartanmay393@gmail.com>.

---
