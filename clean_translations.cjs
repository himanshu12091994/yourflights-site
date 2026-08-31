const fs = require('fs');

let content = fs.readFileSync('src/translations.ts', 'utf8');

// The easiest way to fix duplicates is just replace multiple occurrences of the injected blocks with a single one.
const esBlock = `shippingTitle: "Política de Envío y Entrega",
      shippingContent: [
        "1. SOLO ENTREGA DIGITAL: Your Flights proporciona servicios de consultoría y entregables exclusivamente digitales. No fabricamos, vendemos ni enviamos productos físicos.",
        "2. PLAZO DE ENTREGA: Todos los entregables personalizados se entregan electrónicamente por correo electrónico seguro en un plazo de 3 a 5 días hábiles después de su sesión de asesoramiento inicial."
      ],
      cancellationTitle: "Política de Cancelación",
      cancellationContent: [
        "1. PLAZO DE CANCELACIÓN: Los clientes pueden cancelar su compra para obtener un reembolso completo siempre que la solicitud se reciba al menos 24 horas antes de cualquier sesión programada.",
        "2. CANCELACIONES FUERA DE PLAZO: Las cancelaciones con menos de 24 horas de antelación o después de que haya comenzado la investigación son estrictamente no reembolsables."
      ],
      complianceTitle: "Aviso de Clasificación y Cumplimiento"`;

// Because I might have injected this multiple times:
while (content.includes(esBlock.replace(/complianceTitle.*/, '') + esBlock)) {
  content = content.replace(esBlock.replace(/complianceTitle.*/, '') + esBlock, esBlock);
}

// Just globally strip ALL shippingTitle and cancellationTitle blocks from the ENTIRE file, then we re-inject exactly once for each known locale.
// This is the safest way to reset it.
const stripRegex = /shippingTitle:\s*"[^"]*",\s*shippingContent:\s*\[[\s\S]*?\],\s*cancellationTitle:\s*"[^"]*",\s*cancellationContent:\s*\[[\s\S]*?\],/g;
content = content.replace(stripRegex, '');

// Now we safely inject exactly once for each locale right before complianceTitle:
const injections = [
  {
    search: /complianceTitle: "Service Classification & Compliance Notice"/,
    replace: `shippingTitle: "Shipping & Delivery Policy",
      shippingContent: [
        "1. DIGITAL DELIVERY ONLY: Your Flights LLC Operated By Himanshu Kumar provides exclusively digital consulting deliverables and advisory services. We do not manufacture, sell, or ship any physical goods.",
        "2. DELIVERY TIMEFRAME: All custom deliverables, including Day-by-Day Strategies, Market Research Reports, and Prep Guides, are delivered electronically via secure email within 3 to 5 business days following the completion of your initial advisory session or upon receipt of your completed intake questionnaire.",
        "3. EXPEDITED DELIVERY: If you require expedited digital delivery, please contact our support team prior to purchasing to confirm availability. Expedited timelines may incur additional consulting fees.",
        "4. ACCEPTANCE OF DELIVERY: A digital deliverable is considered 'delivered' and accepted once it is successfully transmitted to the email address provided during checkout. It is the client's responsibility to ensure their email address is accurate and capable of receiving digital attachments."
      ],
      cancellationTitle: "Cancellation Policy",
      cancellationContent: [
        "1. CANCELLATION TIMEFRAME: Clients may cancel their purchase of any consulting package for a full refund provided the cancellation request is received at least 24 hours prior to any scheduled 1-on-1 advisory session or before any bespoke research work has commenced.",
        "2. HOW TO CANCEL: To cancel, please email support@yourflightsllc.com with your order details. Requests must explicitly state the intention to cancel.",
        "3. LATE CANCELLATIONS: Cancellations made less than 24 hours before a scheduled session, or after custom research has officially begun, are strictly non-refundable due to the labor-intensive nature of our preparation.",
        "4. NO-SHOWS: Failure to attend a scheduled advisory session without prior 24-hour notice is considered a no-show and forfeits the right to any refund or complimentary rescheduling."
      ],
      complianceTitle: "Service Classification & Compliance Notice"`
  },
  {
    search: /complianceTitle: "Aviso de Clasificación y Cumplimiento"/,
    replace: `shippingTitle: "Política de Envío y Entrega",
      shippingContent: [
        "1. SOLO ENTREGA DIGITAL: Your Flights proporciona servicios de consultoría y entregables exclusivamente digitales. No fabricamos, vendemos ni enviamos productos físicos.",
        "2. PLAZO DE ENTREGA: Todos los entregables personalizados se entregan electrónicamente por correo electrónico seguro en un plazo de 3 a 5 días hábiles después de su sesión de asesoramiento inicial."
      ],
      cancellationTitle: "Política de Cancelación",
      cancellationContent: [
        "1. PLAZO DE CANCELACIÓN: Los clientes pueden cancelar su compra para obtener un reembolso completo siempre que la solicitud se reciba al menos 24 horas antes de cualquier sesión programada.",
        "2. CANCELACIONES FUERA DE PLAZO: Las cancelaciones con menos de 24 horas de antelación o después de que haya comenzado la investigación son estrictamente no reembolsables."
      ],
      complianceTitle: "Aviso de Clasificación y Cumplimiento"`
  },
  {
    search: /complianceTitle: "Hinweis zur Serviceklassifizierung und Compliance"/,
    replace: `shippingTitle: "Versand- und Lieferrichtlinie",
      shippingContent: ["1. NUR DIGITALE LIEFERUNG: Wir liefern alle Dokumente digital. Keine physischen Produkte."],
      cancellationTitle: "Stornierungsrichtlinie",
      cancellationContent: ["1. STORNIERUNG: Sie können bis zu 24 Stunden vorher stornieren."],
      complianceTitle: "Hinweis zur Serviceklassifizierung und Compliance"`
  },
  {
    search: /complianceTitle: "Avis de Classification des Services et de Conformité"/,
    replace: `shippingTitle: "Politique d'Expédition et de Livraison",
      shippingContent: ["1. LIVRAISON NUMÉRIQUE UNIQUEMENT: Livraison numérique uniquement."],
      cancellationTitle: "Politique d'Annulation",
      cancellationContent: ["1. ANNULATION: Vous pouvez annuler jusqu'à 24 heures avant."],
      complianceTitle: "Avis de Classification des Services et de Conformité"`
  },
  {
    search: /complianceTitle: "服务分类与合规声明"/,
    replace: `shippingTitle: "运输与交付政策",
      shippingContent: ["1. 仅数字交付: 仅数字交付。"],
      cancellationTitle: "取消政策",
      cancellationContent: ["1. 取消: 您可以提前24小时取消。"],
      complianceTitle: "服务分类与合规声明"`
  },
  {
    search: /complianceTitle: "サービス分類とコンプライアンスに関する通知"/,
    replace: `shippingTitle: "配送ポリシー",
      shippingContent: ["1. デジタル配信のみ: デジタル配信のみです。"],
      cancellationTitle: "キャンセルポリシー",
      cancellationContent: ["1. キャンセル: 24時間前までにキャンセルできます。"],
      complianceTitle: "サービス分類とコンプライアンスに関する通知"`
  },
  {
    search: /complianceTitle: "إشعار تصنيف الخدمة والامتثال"/,
    replace: `shippingTitle: "سياسة الشحن والتسليم",
      shippingContent: ["1. التسليم الرقمي فقط: التسليم الرقمي فقط."],
      cancellationTitle: "سياسة الإلغاء",
      cancellationContent: ["1. الإلغاء: يمكنك الإلغاء قبل 24 ساعة."],
      complianceTitle: "إشعار تصنيف الخدمة والامتثال"`
  }
];

for (let inj of injections) {
  content = content.replace(inj.search, inj.replace);
}

// Let's also fix the duplicate curreny symbols one more time.
content = content.replace(/₹12,500 INR \(\₹12,500 INR \(\$150\.00 USD\)\) USD\)/g, '₹12,500 INR ($150.00 USD)');
content = content.replace(/₹12,500 INR \(\₹12,500 INR \(\$150\.00 USD\)\)/g, '₹12,500 INR ($150.00 USD)');
content = content.replace(/₹12,500 INR \(\$150\.00 USD\) USD/g, '₹12,500 INR ($150.00 USD)');

content = content.replace(/₹6,000 INR \(\₹6,000 INR \(\$75\.00 USD\)\) USD\)/g, '₹6,000 INR ($75.00 USD)');
content = content.replace(/₹6,000 INR \(\₹6,000 INR \(\$75\.00 USD\)\)/g, '₹6,000 INR ($75.00 USD)');
content = content.replace(/₹6,000 INR \(\$75\.00 USD\) USD/g, '₹6,000 INR ($75.00 USD)');

content = content.replace(/₹4,000 INR \(\₹4,000 INR \(\$50\.00 USD\)\) USD\)/g, '₹4,000 INR ($50.00 USD)');
content = content.replace(/₹4,000 INR \(\₹4,000 INR \(\$50\.00 USD\)\)/g, '₹4,000 INR ($50.00 USD)');
content = content.replace(/₹4,000 INR \(\$50\.00 USD\) USD/g, '₹4,000 INR ($50.00 USD)');


fs.writeFileSync('src/translations.ts', content, 'utf8');
console.log('Cleaned and fixed translations properly.');
