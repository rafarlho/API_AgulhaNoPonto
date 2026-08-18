import { OllamaEmbeddingResponse } from "../types/ollama";

export async function getEmbeddings(text: string): Promise<number[]> {
    const res = await fetch(`${process.env.OLLAMA_URL}/api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "nomic-embed-text", prompt: text }),
    });

    const data = (await res.json()) as OllamaEmbeddingResponse;
    
    if (!data.embedding)
        throw new Error("Erro ao gerar resposta. Por favor reporta este erro.");
    
    return data.embedding;
}