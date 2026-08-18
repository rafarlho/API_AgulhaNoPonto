import express, { Router, Request, Response } from "express";
import { askLimiter } from "../middleware/rateLimiter";
import { getEmbeddings } from "../services/embeddingService";
import { findSimilarProducts } from "../repository/productRepository";
import { generateAnswer } from "../services/ollamaService";

const router: Router = express.Router();

router.post("/ask", askLimiter, async (req: Request, res: Response) => {
  const { question } = req.body as { question?: string };

  if (!question) 
    return res.status(400).json({ error: "Por favor forneça uma pergunta válida para avançar." });
  
  if (question.length > 500)
    return res.status(400).json({ error: "Pergunta demasiado longa" });
  

  try {
    const embedding = await getEmbeddings(question);
    const vectorStr = `[${embedding.join(",")}]`;

    const products = await findSimilarProducts(vectorStr)

    if (products.length === 0) {
      return res.json({
        question,
        answer:
          "Não encontrei nenhum produto relacionado com a tua pergunta. Podes reformular ou pedir para ver o catálogo completo?",
        sources: [],
      });
    }

    const answer = await generateAnswer(question, products);

    return res.json({ question, answer, sources: products });


  } catch (err) {
    console.error(err);
    res.status(500).json({
      error:
        "Ocorreu um erro ao processar a tua questão. Por favor tenta novamente e se o erro persistir reporta-o.",
    });
  }
});

export default router;
