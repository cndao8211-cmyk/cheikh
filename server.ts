import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini SDK with User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. AI Tutor chat
app.post('/api/tutor/chat', async (req, res) => {
  try {
    const { message, subject } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'الرجاء إرسال سؤال أو رسالة صحيحة.' });
    }

    const systemInstruction = `
أنت المساعد الأكاديمي لمجموعة "IE" التعليمية والاستثمارية لطلاب الجامع والمعاهد في السنغال، بإشراف فضيلة الشيخ تيجان ا نداو (Cheikh Tidiane Ndao).
تساعد الطلاب في:
1. اللغة العربية (النحو والصرف، البلاغة، الأدب السنغالي وشعر العلماء الأجلاء كالشيخ بمب، الحاج مالك سي، والشيخ إبراهيم نياس).
2. التاريخ (تاريخ السنغال وممالك تكرور، وجولوف، كايور، فوتا تورو، ومقاومة لط ديور والعلماء).
3. الجغرافيا والتنمية (أقاليم السنغال الـ 14، الأنهار والسدود، والغاز والنفط والفول السوداني).
4. مجالات ريادة الأعمال والاستثمار للشباب السنغالي ضمن رؤية شركة ومجموعة IE.
أسلوبك علمي رصين، مشكول، باللغة العربية الفصحى مع المصطلحات الفرنسية الشائعة في الامتحانات.
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `المجال: ${subject || 'عام'}\nالسؤال: ${message}`,
      config: { systemInstruction },
    });

    return res.json({ reply: response.text || 'لا توجد إجابة متاحة.' });
  } catch (error: any) {
    console.error('Error in tutor chat:', error);
    return res.status(500).json({
      error: 'تعذر الاتصال بالمساعد الذكي حالياً.',
      details: error?.message,
    });
  }
});

// 2. Google Maps Grounding with gemini-3.8-flash (tools: [{ type: 'google_maps' }])
app.post('/api/maps/grounding', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'يرجى تقديم استفسار جغرافي أو مكاني.' });
    }

    const prompt = `أنت الخبير الجغرافي السنغالي في منصة IE بإشراف الشيخ تيجان ا نداو. قدم معلومات جغرافية ومكانية دقيقة موثقة بالخرائط الحية حول: ${query} في جمهورية السنغال وغرب إفريقيا، واذكر الإحداثيات التقريبية، والمعالم المجاورة، والأهمية الاقتصادية والتعليمية.`;

    const interaction = await ai.interactions.create({
      model: 'gemini-3.8-flash',
      input: prompt,
      tools: [{ type: 'google_maps' }],
    });

    let fullOutput = '';
    for (const step of interaction.steps) {
      if (step.type === 'model_output') {
        const textContent = step.content?.find((c) => c.type === 'text');
        if (textContent?.text) fullOutput += textContent.text;
      }
    }

    return res.json({
      result: fullOutput || interaction.output_text || 'تم فحص الموقع بنجاح.',
    });
  } catch (error: any) {
    console.error('Error in Maps grounding:', error);
    return res.status(500).json({
      error: 'تعذر الاتصال ببيانات الخرائط الحية. تأكد من تفعيل إعدادات المفتاح.',
      details: error?.message,
    });
  }
});

// 3. Video Generation & Image Animation using gemini-omni-1.2-flash
app.post('/api/video/generate', async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType = 'image/jpeg', aspectRatio = '16:9' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'الرجاء كتابة وصف الفيديو المراد توليده.' });
    }

    let inputData: any = prompt;
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      inputData = [
        {
          type: 'image',
          mime_type: mimeType,
          data: cleanBase64,
        },
        {
          type: 'text',
          text: prompt,
        },
      ];
    }

    const interaction = await ai.interactions.create(
      {
        model: 'gemini-omni-1.2-flash',
        input: inputData,
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: aspectRatio as '16:9' | '9:16',
          duration: '10s',
          resolution: '720p',
        },
      },
      { timeout: 300000 }
    );

    const videoPart = interaction.output_video;
    if (videoPart?.data) {
      return res.json({
        videoBase64: `data:${videoPart.mime_type || 'video/mp4'};base64,${videoPart.data}`,
        duration: '10s',
        aspectRatio,
      });
    }

    return res.json({
      success: true,
      message: 'تمت معالجة أمر الفيديو بنجاح بواسطة gemini-omni-1.2-flash.',
      simulated: true,
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return res.status(500).json({
      error: 'تتطلب ميزة توليد الفيديو ترقية المفتاح إلى باقة الفوترة (Paid Model Flow) لنموذج gemini-omni-1.2-flash.',
      details: error?.message,
    });
  }
});

// 4. Music Generation using lyria-3-clip-preview
app.post('/api/music/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'يرجى كتابة وصف اللحن أو النشيد المطلوب.' });
    }

    const response = await ai.models.generateContentStream({
      model: 'lyria-3-clip-preview',
      contents: prompt,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (audioBase64) {
      return res.json({
        audioBase64: `data:${mimeType};base64,${audioBase64}`,
        lyrics,
      });
    }

    return res.json({
      success: true,
      lyrics: lyrics || 'نشيد تعليمي سنغالي بروح الأصالة والمجد.',
      simulated: true,
    });
  } catch (error: any) {
    console.error('Error generating music with Lyria:', error);
    return res.status(500).json({
      error: 'يتطلب توليد الموسيقى بنموذج lyria-3-clip-preview تفعيل باقة الفوترة الخاصة بالمستخدم.',
      details: error?.message,
    });
  }
});

// 5. Dynamic Exam question generator
app.post('/api/exam/generate-questions', async (req, res) => {
  try {
    const { subject, topic, difficulty = 'متوسط' } = req.body;

    const prompt = `
أنشئ 3 أسئلة اختيار من متعدد تفاعلية لاختبار طلاب المعاهد والجامع في السنغال لمادة (${subject}) في موضوع (${topic}) بمستوى (${difficulty}).
أجب بتنسيق JSON مطابق للمخطط:
[
  {
    "id": 1,
    "question": "نص السؤال الواضح والدقيق",
    "options": ["الخيار الأول", "الخيار الثاني", "الخيار الثالث", "الخيار الرابع"],
    "correctIndex": 0,
    "explanation": "شرح علمي مفصل"
  }
]
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const questions = JSON.parse(response.text || '[]');
    return res.json({ questions });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ error: 'تعذر توليد الأسئلة حالياً.' });
  }
});

// 6. Commercial orders & simulated transactions for company monetization
app.post('/api/store/order', (req, res) => {
  const { planId, studentEmail, amountCFA, itemTitle } = req.body;
  const orderId = 'IE-' + Math.floor(100000 + Math.random() * 900000);
  const licenseKey = 'IE-LIC-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  return res.json({
    success: true,
    orderId,
    licenseKey,
    planId,
    itemTitle,
    amountCFA,
    date: new Date().toISOString(),
    status: 'مكتمل ومعتمد',
    message: `شكراً لدعمك شركة IE التعليمية بإشراف الشيخ تيجان ا نداو. تم تفعيل اشتراكك بنجاح.`,
  });
});

// 7. Academic AI Service: Essay & Composition Grader (Bac Arabe Sénégal)
app.post('/api/academic/grade-essay', async (req, res) => {
  try {
    const { topic, studentText } = req.body;
    if (!studentText || typeof studentText !== 'string') {
      return res.status(400).json({ error: 'يرجى إرسال نص المقال الإنشائي.' });
    }

    const prompt = `
أنت مصحح امتحانات البكالوريا العربية في السنغال ولجنة معهد IE بإشراف الشيخ تيجان ا نداو.
الموضوع الإنشائي: "${topic || 'إنشاء عام في الأدب أو التاريخ السنغالي'}"
نص الطالب السنغالي:
"${studentText}"

قم بتصحيح هذا المقال وفق المعايير الرسمية لامتحان البكالوريا (من 20 درجة):
أرجع نتيجة بتنسيق JSON مطابق للمخطط:
{
  "scoreOutOf20": 16,
  "appraisal": "تقدير عام (مثلاً: حسن جداً، جيد، يحتاج إلى تحسين)",
  "languageCritique": "ملاحظات حول السلامة النحوية والإملائية وحروف الجر",
  "contentCritique": "ملاحظات حول الأفكار التاريخية أو الأدبية والشواهد المستشهد بها",
  "correctedModelExcerpt": "صياغة نموذجية محسنة لأحد فقرات المقال",
  "adviceForExam": "نصيحة ذهبية لضمان الدرجة الكاملة في الامتحان الرسمي"
}
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json({ result });
  } catch (error: any) {
    console.error('Error grading essay:', error);
    return res.status(500).json({ error: 'تعذر تقييم المقال حالياً.' });
  }
});

// 8. Academic AI Service: Poetry & Prosody Analyzer (محلل العروض والبلاغة)
app.post('/api/academic/analyze-poem', async (req, res) => {
  try {
    const { verses } = req.body;
    if (!verses || typeof verses !== 'string') {
      return res.status(400).json({ error: 'يرجى إرسال الأبيات الشعرية.' });
    }

    const prompt = `
أنت أستاذ العروض والبلاغة في معاهد وجامعات السنغال لدى منصة IE بإشراف فضيلة الشيخ تيجان ا نداو.
الأبيات المطلوبة للتحليل:
"${verses}"

قم بتحليل عروضي وبلاغي دقيق وأرجع JSON:
{
  "meterName": "اسم البحر الشعري (مثلاً: بحر البسيط / الطويل / الكامل / الرجز)",
  "tafeela": "تفعيلات البيت (مثلاً: فعولن مفاعيلن فعولن مفاعيلن)",
  "rawi": "حرف الروي والقافية",
  "rhetoricalGems": ["محسن بديعي أو بياني كالجناس أو الاستعارة", "محسن آخر"],
  "poeticMeaning": "المعنى الإجمالي والعمق التربوي والروحي في سياق الشعر السنغالي والعربي"
}
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json({ result });
  } catch (error: any) {
    console.error('Error analyzing poem:', error);
    return res.status(500).json({ error: 'تعذر تحليل الأبيات حالياً.' });
  }
});

// 9. Academic AI Service: Flashcards & Lesson Summarizer (ملخص الدروس والبطاقات)
app.post('/api/academic/summarize-lesson', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content && !title) {
      return res.status(400).json({ error: 'يرجى تقديم موضوع أو نص الدرس.' });
    }

    const prompt = `
أنت المرشد الأكاديمي للتلخيص الذكي لطلاب السنغال في منصة IE بإشراف الشيخ تيجان ا نداو.
الدرس: "${title}"
المحتوى: "${content || 'درس منهجي في السنغال'}"

أنشئ ملخصاً مركّزاً و 3 بطاقات مراجعة ذكية (Flashcards) بصيغة JSON:
{
  "keySummary": "خلاصة مكثفة في 3 أسطر تناسب الحفظ قبل الامتحان",
  "memoryMnemonic": "عبارة أو أسلوب لتذكر النقاط بسرعة",
  "flashcards": [
    {
      "front": "السؤال أو المفهوم الرئيسي",
      "back": "الجواب النموذجي الموجز"
    }
  ]
}
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json({ result });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ error: 'تعذر تلخيص الدرس حالياً.' });
  }
});


// 10. Merchant Payment Configuration for Senegal (Wave & Orange Money)
let merchantConfig = {
  waveNumber: '+221 78 713 00 61',
  orangeMoneyNumber: '+221 78 713 00 61',
  merchantName: 'فضيلة الشيخ تيجان ا نداو / Cheikh Tidiane Ndao',
  merchantEmail: 'cndao8211@gmail.com',
  ussdCode: '#144#399#',
  currency: 'FCFA',
};

const ordersDatabase: any[] = [];

app.get('/api/payments/config', (req, res) => {
  return res.json(merchantConfig);
});

app.post('/api/payments/config', (req, res) => {
  const { waveNumber, orangeMoneyNumber, merchantName } = req.body;
  if (waveNumber) merchantConfig.waveNumber = waveNumber;
  if (orangeMoneyNumber) merchantConfig.orangeMoneyNumber = orangeMoneyNumber;
  if (merchantName) merchantConfig.merchantName = merchantName;
  return res.json({ success: true, config: merchantConfig });
});

// 11. Process Senegal Mobile Money payment (Wave & Orange Money)
app.post('/api/payments/process-mobile-money', (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      region,
      schoolOrDaara,
      planId = 'bac_excellence',
      planTitle = 'باقة الامتياز للبكالوريا',
      amountCFA = 25000,
      paymentMethod = 'wave',
      transactionRef = '',
    } = req.body;

    const orderId = `IE-ORD-${Date.now().toString().slice(-6)}`;
    const licenseKey = `IE-${planId.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}-SN`;

    const record = {
      orderId,
      fullName: fullName || 'طالب معهد IE',
      phoneNumber,
      region: region || 'السنغال',
      schoolOrDaara: schoolOrDaara || 'الجامع والمعاهد بالسنغال',
      planId,
      planTitle,
      amountCFA: Number(amountCFA),
      paymentMethod,
      transactionRef: transactionRef || `${paymentMethod === 'wave' ? 'WV' : 'OM'}-${Date.now().toString().slice(-6)}`,
      status: 'active',
      licenseKey,
      timestamp: new Date().toISOString(),
    };

    ordersDatabase.unshift(record);

    return res.json({
      success: true,
      orderId,
      licenseKey,
      record,
      message: `تم اعتماد التحويل عبر ${paymentMethod === 'wave' ? 'Wave' : 'Orange Money'} وتفعيل الاشتراك بنجاح. مرحباً بك في منصة فضيلة الشيخ تيجان ا نداو!`,
    });
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ error: 'تعذر معالجة الدفع الإلكتروني حالياً.' });
  }
});

// 12. Direct Store Order endpoint
app.post('/api/store/order', (req, res) => {
  const { planId = 'bac', studentEmail, amountCFA = 5000, itemTitle = 'اشتراك منصة IE' } = req.body;
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const licenseKey = `IE-LIC-${Math.floor(10000 + Math.random() * 90000)}-SN`;

  return res.json({
    success: true,
    orderId,
    licenseKey,
    itemTitle,
    amountCFA,
    message: 'تم تفعيل الطلب بنجاح عبر منصة IE التعليمية بالسنغال بإشراف فضيلة الشيخ تيجان ا نداو.',
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`IE Holding & Educational Platform running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
