export const EXTERNAL_SERVER_URL = "https://stellar-recharger-doubling.ngrok-free.dev";

export async function uploadFileToExternalServer(file: File): Promise<{ url: string; fileId: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${EXTERNAL_SERVER_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Falha no upload para o servidor externo');
  }

  return response.json();
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
