const fs = require('fs');
let tContent = fs.readFileSync('src/translations.ts', 'utf8');

// The Spanish block looks like:
// refundContent: [...], complianceTitle:
// Let's add the Spanish equivalents or just English placeholders for now so it compiles.

tContent = tContent.replace(
  /refundContent:\s*\[[\s\S]*?(?=],\s*complianceTitle:)],\s*complianceTitle:(?![\s\S]*shippingTitle)/,
  function(match) {
    return match.replace(/],\s*complianceTitle:/, `],
      shippingTitle: "Política de Envío y Entrega",
      shippingContent: [
        "1. SOLO ENTREGA DIGITAL: Your Flights proporciona servicios de consultoría y entregables exclusivamente digitales. No fabricamos, vendemos ni enviamos productos físicos.",
        "2. PLAZO DE ENTREGA: Todos los entregables personalizados se entregan electrónicamente por correo electrónico seguro en un plazo de 3 a 5 días hábiles después de su sesión de asesoramiento inicial."
      ],
      cancellationTitle: "Política de Cancelación",
      cancellationContent: [
        "1. PLAZO DE CANCELACIÓN: Los clientes pueden cancelar su compra para obtener un reembolso completo siempre que la solicitud se reciba al menos 24 horas antes de cualquier sesión programada.",
        "2. CANCELACIONES FUERA DE PLAZO: Las cancelaciones con menos de 24 horas de antelación o después de que haya comenzado la investigación son estrictamente no reembolsables."
      ],
      complianceTitle:`);
  }
);

// To be safe, let's just do a manual string replace for the Spanish section specifically.
// We look for the second occurrence of complianceTitle (which is in the es block).
const parts = tContent.split('complianceTitle: "Aviso de Clasificación y Cumplimiento"');
if (parts.length > 1) {
    parts[0] = parts[0] + `shippingTitle: "Política de Envío y Entrega",
      shippingContent: [
        "1. SOLO ENTREGA DIGITAL: Your Flights proporciona servicios de consultoría y entregables exclusivamente digitales. No fabricamos, vendemos ni enviamos productos físicos.",
        "2. PLAZO DE ENTREGA: Todos los entregables personalizados se entregan electrónicamente por correo electrónico seguro en un plazo de 3 a 5 días hábiles después de su sesión de asesoramiento inicial."
      ],
      cancellationTitle: "Política de Cancelación",
      cancellationContent: [
        "1. PLAZO DE CANCELACIÓN: Los clientes pueden cancelar su compra para obtener un reembolso completo siempre que la solicitud se reciba al menos 24 horas antes de cualquier sesión programada.",
        "2. CANCELACIONES FUERA DE PLAZO: Las cancelaciones con menos de 24 horas de antelación o después de que haya comenzado la investigación son estrictamente no reembolsables."
      ],
      `;
    tContent = parts.join('complianceTitle: "Aviso de Clasificación y Cumplimiento"');
}

fs.writeFileSync('src/translations.ts', tContent, 'utf8');
console.log('Fixed Spanish translations.');
