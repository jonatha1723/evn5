export const EXTERNAL_SERVER_URL = "https://recreation-invited-brochure-though.trycloudflare.com";

export async function uploadFileToExternalServer(file: File): Promise<{ url: string; fileId: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${EXTERNAL_SERVER_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Erro desconhecido");
    throw new Error(`Falha no upload para o servidor externo: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log("[External Server] Upload realizado:", result);
  return result;
}

export async function saveDocumentToExternalServer(collectionName: string, data: any): Promise<any> {
  const response = await fetch(`${EXTERNAL_SERVER_URL}/api/${collectionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Falha ao salvar no servidor externo (${collectionName})`);
  }

  return response.json();
}

export async function getDocumentsFromExternalServer(collectionName: string): Promise<any> {
    const response = await fetch(`${EXTERNAL_SERVER_URL}/api/${collectionName}`, {
      method: 'GET',
    });
  
    if (!response.ok) {
      throw new Error(`Falha ao buscar do servidor externo (${collectionName})`);
    }
  
    return response.json();
}
