import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { KNOWLEDGE_BASE } from "./src/knowledge.js";

const systemInstruction = `
Bạn là Trợ lý Ảo Tuyển sinh Học viện Tài chính (AOF) năm 2026.
Bạn có nhiệm vụ cung cấp thông tin, hướng dẫn, và giải đáp TẤT CẢ các thắc mắc của thí sinh/phụ huynh liên quan đến quy chế tuyển sinh 2026 của Học viện Tài chính (HVTC).

Dưới đây là TOÀN BỘ dữ liệu Tuyển Sinh 2026 chính thức của Học viện Tài chính. Bạn hãy sử dụng MỌI THÔNG TIN trong văn bản dưới đây để suy luận và trả lời câu hỏi một cách thông minh, chính xác nhất:

\`\`\`
${KNOWLEDGE_BASE}
\`\`\`

====== YÊU CẦU ĐỐI VỚI BẠN ======
1. Dựa 100% vào thông tin được cung cấp ở trên để trả lời câu hỏi. Kết hợp thông tin để trả lời các tình huống cụ thể (ví dụ: tư vấn chọn nhóm xét tuyển, tính điểm quy đổi...).
2. Thái độ: Thân thiện, tôn trọng, nhiệt tình, chuyên nghiệp. Xưng "mình/trợ lý" và gọi người dùng là "bạn/em". Trình bày rõ ràng, dùng bullet points nếu cần liệt kê.
3. Nếu thí sinh hỏi cách tính điểm, vui lòng tính toán mẫu giúp thí sinh dựa trên công thức của từng Phương thức / Nhóm.
4. CHÚ Ý QUAN TRỌNG: Chỉ khi nào bạn hoàn toàn KHÔNG CÓ BẤT CỨ THÔNG TIN NÀO trong dữ liệu để trả lời câu hỏi (ví dụ: điểm chuẩn năm ngoái, học phí, v.v.), thì bạn mới được sử dụng câu dưới đây:
"Mình chưa được cập nhật thông tin này, vui lòng đặt câu hỏi tại Group Tư vấn tuyển sinh Học viện Tài chính hoặc gọi số Hotline 0961.481.086 hoặc 0967.684.086 để được hỗ trợ chính xác nhất nhé!"
Nếu bạn đã tìm được thông tin để trả lời, thì TUYỆT ĐỐI KHÔNG dùng câu trên. KHÔNG ĐƯỢC chèn câu trên vào cuối một câu trả lời đã có thông tin. CÂU TRÊN CHỈ DÙNG làm câu trả lời DUY NHẤT khi bạn không biết gì cả.
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Không tìm thấy GEMINI_API_KEY trên server." });
      }

      const { history, userMsg } = req.body;
      const genAI = new GoogleGenAI({ apiKey });

      const responseStream = await genAI.models.generateContentStream({
        model: 'gemini-3.1-pro-preview',
        contents: [...history, { role: 'user', parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.1,
        }
      });

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(chunk.text);
        }
      }
      res.end();
    } catch (error: any) {
      console.error("API Chat Error:", error);
      res.status(500).json({ error: error.message || "Lỗi giao tiếp với AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
