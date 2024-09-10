import path from 'path';
import { promises as fs } from 'fs';

// export async function POST(req) {
//     const { question } = await req.json();
  
//     // HArdcoded response
//     const response = {
//       data: {
//         '552310': 4070.0,
//         '553210': 9900.0,
//       },
//       nature: 'selection',
//       schema: 'categories_depense',
//       statistique: {
//         texte:
//           "La catégorie de dépense la plus élevée dans la dernière année est 553210 avec un montant total de 9900.0.",
//         titre: 'Catégorie de dépense la plus élevée dans la dernière année',
//         unité: 'monnaie',
//       },
//     };
  
//     return new Response(JSON.stringify(response), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const { question } = await req.json();

  // Define your external API URL and request body
  const apiUrl = 'https://civision-db-tools-nvyfouhg5a-uc.a.run.app/api/accounting_question';
  const databaseId = '66d1f2dd8f86bfd405be1d73'; // Update with your actual database ID

  // Prepare the request body for the external API
  const requestBody = {
    user_question: question,
    database_id: databaseId,
  };

  try {
    // Fetch response from the external API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from external API');
    }

    const result = await response.json();

    // Return the response from the external API
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching data:', error);

    return new Response(
      JSON.stringify({ error: 'Error fetching data from external API' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(req) {
  const jsonDirectory = path.join(process.cwd(), 'public', 'data');
  const filePath = path.join(jsonDirectory, 'accounting_data_response.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return new Response(fileContents, {
      headers: { 'Content-Type': 'application/json' },
  });
}

// export async function GET(req) {
//   const { question } = await req.json();
//   const apiurl = 'https://civision-db-tools-nvyfouhg5a-uc.a.run.app/api/accounting_data';
//   const databaseId = '66d1f2dd8f86bfd405be1d73';

//   const requestBody = {
//     user_question: question,
//     database_id: databaseId,
//   };

//   try {
//     // Fetch data from the external API using GET
//     const response = await fetch(apiurl, {
//       method: 'POST', // Even though it's a GET route in your code, some APIs use POST for fetching data
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch data from external API');
//     }

//     const result = await response.json();

//     // Return the response from the external API
//     return new Response(JSON.stringify(result), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error fetching data:', error);

//     return new Response(
//       JSON.stringify({ error: 'Error fetching data from external API' }),
//       { status: 500, headers: { 'Content-Type': 'application/json' } }
//     );
//   }
// }
